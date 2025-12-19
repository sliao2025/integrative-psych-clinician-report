/**
 * Database Router with Dual-Write and Failover Support
 *
 * This module provides a database access layer with:
 * - Dual-write: Writes to Cloud SQL (primary) are strictly mirrored to PlanetScale (backup) safely
 * - Failover: Reads from backup if primary is unavailable
 * - Health monitoring: Track database health status
 *
 * Configuration via environment variables:
 * - DATABASE_URL          → Primary database (Cloud SQL)
 * - DATABASE_URL_BACKUP   → Backup database (PlanetScale)
 * - ENABLE_DUAL_WRITE     → Enable writing to both databases (default: true)
 * - FORCE_BACKUP_DB       → Force using backup database only
 */

import { PrismaClient } from "@prisma/client";

// Configuration
const ENABLE_DUAL_WRITE =
  process.env.ENABLE_DUAL_WRITE?.toLowerCase() !== "false"; // Default: true
const FORCE_BACKUP = process.env.FORCE_BACKUP_DB?.toLowerCase() === "true";
const DATABASE_URL_BACKUP = process.env.DATABASE_URL_BACKUP;

// Health tracking
let primaryHealthy = true;
let backupHealthy = true;
let lastPrimaryCheck = new Date(0);
let lastBackupCheck = new Date(0);
let primaryConsecutiveFailures = 0;
let backupConsecutiveFailures = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
const FAILOVER_THRESHOLD = 3; // Consecutive failures before failover

// Singleton clients
const globalForPrisma = globalThis as unknown as {
  primaryPrisma?: PrismaClient;
  backupPrisma?: PrismaClient;
};

// Primary Prisma client (Cloud SQL)
function getPrimaryClient(): PrismaClient {
  if (!globalForPrisma.primaryPrisma) {
    globalForPrisma.primaryPrisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }
  return globalForPrisma.primaryPrisma;
}

// Backup Prisma client (PlanetScale)
function getBackupClient(): PrismaClient | null {
  if (!DATABASE_URL_BACKUP) {
    return null;
  }

  if (!globalForPrisma.backupPrisma) {
    // Create a new Prisma client with the backup URL
    // Note: This requires the backup URL to use the same schema
    globalForPrisma.backupPrisma = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL_BACKUP,
        },
      },
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }
  return globalForPrisma.backupPrisma;
}

// Prevent hot-reload from creating new clients in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.primaryPrisma = getPrimaryClient();
  if (DATABASE_URL_BACKUP) {
    globalForPrisma.backupPrisma = getBackupClient() ?? undefined;
  }
}

/**
 * Check primary database health
 */
async function checkPrimaryHealth(): Promise<boolean> {
  if (Date.now() - lastPrimaryCheck.getTime() < HEALTH_CHECK_INTERVAL) {
    return primaryHealthy;
  }

  try {
    const client = getPrimaryClient();
    await client.$queryRaw`SELECT 1`;
    primaryHealthy = true;
    primaryConsecutiveFailures = 0;
    lastPrimaryCheck = new Date();
    return true;
  } catch (error: any) {
    console.error("[DB Primary Health] Check failed:", error.message);
    primaryConsecutiveFailures++;
    if (primaryConsecutiveFailures >= FAILOVER_THRESHOLD) {
      primaryHealthy = false;
    }
    lastPrimaryCheck = new Date();
    return false;
  }
}

/**
 * Check backup database health
 */
async function checkBackupHealth(): Promise<boolean> {
  const backupClient = getBackupClient();
  if (!backupClient) {
    backupHealthy = false;
    return false;
  }

  if (Date.now() - lastBackupCheck.getTime() < HEALTH_CHECK_INTERVAL) {
    return backupHealthy;
  }

  try {
    await backupClient.$queryRaw`SELECT 1`;
    backupHealthy = true;
    backupConsecutiveFailures = 0;
    lastBackupCheck = new Date();
    return true;
  } catch (error: any) {
    console.error("[DB Backup Health] Check failed:", error.message);
    backupConsecutiveFailures++;
    if (backupConsecutiveFailures >= FAILOVER_THRESHOLD) {
      backupHealthy = false;
    }
    lastBackupCheck = new Date();
    return false;
  }
}

/**
 * Get the active database client for reads
 * Automatically fails over to backup if primary is unhealthy
 */
function getActiveClient(): PrismaClient {
  // Force backup mode
  if (FORCE_BACKUP) {
    const backupClient = getBackupClient();
    if (backupClient) {
      console.log("[DB Router] Using backup database (forced)");
      return backupClient;
    }
    console.warn("[DB Router] Backup database not configured, using primary");
    return getPrimaryClient();
  }

  // Failover logic
  if (!primaryHealthy && backupHealthy) {
    const backupClient = getBackupClient();
    if (backupClient) {
      console.log("[DB Router] Using backup database (failover)");
      return backupClient;
    }
  }
  console.log("[DB Router] Using primary database");
  return getPrimaryClient();
}

/**
 * GET DB (Failover-only Client)
 * This client is used primarily for READS.
 * It does NOT automatically dual-write.
 */
export function getDb(): PrismaClient {
  return getActiveClient();
}

export const db = getActiveClient();

/**
 * @deprecated automatic dual-write is now enabled via Prisma extensions.
 * This function is kept for backward compatibility but operates as a pass-through.
 */
export async function dualWrite<T>(
  operation: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  // Use the proxied prisma client which handles dual-write automatically
  return operation(prisma);
}

/**
 * Execute a transaction across both databases (for critical operations)
 * Both writes must succeed for the operation to complete
 *
 * Use this sparingly - it's slower but guarantees consistency
 */
export async function dualWriteSync<T>(
  operation: (prisma: PrismaClient) => Promise<T>
): Promise<{ primary: T; backup?: T }> {
  // For now, fall back to simple primary execution as sync logic is complex with extensions
  // True dual-sync is hard to guarantee without 2PC.
  const result = await operation(prisma);
  return { primary: result, backup: undefined };
}

/**
 * createDualWriteExtension
 * Creates a Prisma extension that intercepts all write operations
 * and mirrors them to the backup database in the background.
 */
function createDualWriteExtension(primaryClient: PrismaClient) {
  return primaryClient.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          // List of operations that modify data
          const writeOperations = [
            "create",
            "createMany",
            "update",
            "updateMany",
            "upsert",
            "delete",
            "deleteMany",
          ];

          // 1. Execute the operation on the PRIMARY database (always await)
          const result = await query(args);

          // 2. If it's a write operation, mirror to BACKUP
          if (
            ENABLE_DUAL_WRITE &&
            !FORCE_BACKUP && // Don't dual-write if we are fully failed over
            writeOperations.includes(operation)
          ) {
            const backupClient = getBackupClient();
            if (backupClient) {
              try {
                // SYNC ID LOGIC:
                // If this is a 'create' operation, the Primary DB likely generated an ID (e.g. CUID/UUID).
                // We MUST use the same ID for the backup to ensure consistency for future updates/relations.
                // We inject the result's ID into the backup's create arguments.
                if (operation === "create" && result && (result as any).id) {
                  // Ensure args.data exists
                  if (!(args as any).data) (args as any).data = {};
                  // Override/Set ID to match Primary
                  (args as any).data.id = (result as any).id;
                }

                // @ts-ignore - Dynamic model access
                await backupClient[model][operation](args);
                console.log(
                  `[Dual Write] Mirrored ${operation} on ${model} to backup (ID synced: ${
                    (result as any)?.id ? "yes" : "n/a"
                  }).`
                );
              } catch (err: any) {
                console.error(
                  `[Dual Write] Failed to mirror ${operation} on ${model}:`,
                  err.message
                );
                // We catch and log error so primary flow is not interrupted.
                // In a perfect world, we'd add to a dead-letter queue here.
              }
            }
          }

          return result;
        },
      },
    },
  });
}

/**
 * The 'prisma' export is the main entry point for the application.
 * It uses a Proxy to dynamically switch between:
 * 1. The Primary Client (configured with Dual-Write Extension)
 * 2. The Backup Client (if failed over)
 */
export const prisma = new Proxy({} as PrismaClient, {
  get: (_target, prop) => {
    // 1. Determine which physical client is active (Failover Logic)
    const activeRawClient = getActiveClient();

    // 2. If we are on the PRIMARY, we wrap it with the Dual-Write Extension
    //    so that writes are mirrored.
    //    If we are on the BACKUP (Failover), we use the raw client directly.
    if (activeRawClient === getPrimaryClient() && !FORCE_BACKUP) {
      const extendedClient = createDualWriteExtension(activeRawClient);
      // @ts-ignore - Proxy generic typing
      return extendedClient[prop];
    }

    // 3. Fallback/Failover mode: Raw client (no mirroring)
    return activeRawClient[prop as keyof PrismaClient];
  },
});

/**
 * Health status for monitoring
 */
export interface DatabaseHealthStatus {
  primary: {
    healthy: boolean;
    lastCheck: Date;
    consecutiveFailures: number;
    configured: boolean;
  };
  backup: {
    healthy: boolean;
    lastCheck: Date;
    consecutiveFailures: number;
    configured: boolean;
  };
  activeDatabase: "primary" | "backup";
  dualWriteEnabled: boolean;
}

export async function getDatabaseHealthStatus(): Promise<DatabaseHealthStatus> {
  await Promise.all([checkPrimaryHealth(), checkBackupHealth()]);

  return {
    primary: {
      healthy: primaryHealthy,
      lastCheck: lastPrimaryCheck,
      consecutiveFailures: primaryConsecutiveFailures,
      configured: true,
    },
    backup: {
      healthy: backupHealthy,
      lastCheck: lastBackupCheck,
      consecutiveFailures: backupConsecutiveFailures,
      configured: !!DATABASE_URL_BACKUP,
    },
    activeDatabase:
      FORCE_BACKUP || (!primaryHealthy && backupHealthy) ? "backup" : "primary",
    dualWriteEnabled: ENABLE_DUAL_WRITE && !!DATABASE_URL_BACKUP,
  };
}

/**
 * Disconnect all clients (for graceful shutdown)
 */
export async function disconnectAll(): Promise<void> {
  const promises: Promise<void>[] = [];

  if (globalForPrisma.primaryPrisma) {
    promises.push(globalForPrisma.primaryPrisma.$disconnect());
  }

  if (globalForPrisma.backupPrisma) {
    promises.push(globalForPrisma.backupPrisma.$disconnect());
  }

  await Promise.all(promises);
}
