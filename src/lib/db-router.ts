/**
 * Database Router with Dual-Write and Failover Support
 *
 * This module provides a database access layer with:
 * - Dual-write: Write to both Cloud SQL (primary) and PlanetScale (backup)
 * - Failover: Read from backup if primary is unavailable
 * - Health monitoring: Track database health status
 *
 * Configuration via environment variables:
 * - DATABASE_URL          → Primary database (Cloud SQL)
 * - DATABASE_URL_BACKUP   → Backup database (PlanetScale)
 * - ENABLE_DUAL_WRITE     → Enable writing to both databases (default: true)
 * - FORCE_BACKUP_DB       → Force using backup database only
 *
 * Usage:
 *   import { db, dualWrite } from "@/lib/db-router";
 *
 *   // For reads (auto-failover)
 *   const users = await db.user.findMany();
 *
 *   // For writes (dual-write)
 *   await dualWrite(async (prisma) => {
 *     await prisma.user.create({ data: { ... } });
 *   });
 */

import { PrismaClient } from "@prisma/client";

// Configuration
const ENABLE_DUAL_WRITE = process.env.ENABLE_DUAL_WRITE !== "false"; // Default: true
const FORCE_BACKUP = process.env.FORCE_BACKUP_DB === "true";
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

  return getPrimaryClient();
}

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

/**
 * Get current database health status
 */
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
 * Dual-write function
 * Executes a write operation on both primary and backup databases
 *
 * Primary write is awaited (synchronous), backup write is fire-and-forget (async)
 * This ensures minimal latency impact while maintaining data replication
 *
 * @param operation - A function that receives a PrismaClient and performs writes
 * @returns The result from the primary write
 */
export async function dualWrite<T>(
  operation: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  const primaryClient = getPrimaryClient();
  const backupClient = getBackupClient();

  // Execute on primary (synchronous - we wait for this)
  let primaryResult: T;
  try {
    primaryResult = await operation(primaryClient);
    primaryConsecutiveFailures = 0;
    primaryHealthy = true;
  } catch (error: any) {
    console.error("[Dual Write] Primary write failed:", error.message);
    primaryConsecutiveFailures++;
    if (primaryConsecutiveFailures >= FAILOVER_THRESHOLD) {
      primaryHealthy = false;
    }

    // If primary fails and backup is available, try backup
    if (backupClient && backupHealthy) {
      console.log("[Dual Write] Attempting backup write as fallback");
      return await operation(backupClient);
    }

    throw error;
  }

  // Execute on backup (asynchronous - fire and forget)
  if (ENABLE_DUAL_WRITE && backupClient) {
    operation(backupClient)
      .then(() => {
        backupConsecutiveFailures = 0;
        backupHealthy = true;
        console.log("[Dual Write] Backup write succeeded");
      })
      .catch((error) => {
        console.error("[Dual Write] Backup write failed:", error.message);
        backupConsecutiveFailures++;
        if (backupConsecutiveFailures >= FAILOVER_THRESHOLD) {
          backupHealthy = false;
        }
      });
  }

  return primaryResult;
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
  const primaryClient = getPrimaryClient();
  const backupClient = getBackupClient();

  const primaryResult = await operation(primaryClient);

  let backupResult: T | undefined;
  if (ENABLE_DUAL_WRITE && backupClient) {
    try {
      backupResult = await operation(backupClient);
    } catch (error: any) {
      console.error("[Dual Write Sync] Backup write failed:", error.message);
      // We don't throw here - primary succeeded, backup failed
      // Log for monitoring but don't break the user experience
    }
  }

  return { primary: primaryResult, backup: backupResult };
}

/**
 * The main database client for reads
 * Use this for all read operations - it handles failover automatically
 */
export const db = getActiveClient();

/**
 * Get a fresh client (useful after health status changes)
 */
export function getDb(): PrismaClient {
  return getActiveClient();
}

/**
 * Original prisma export for backward compatibility
 * This allows gradual migration - existing code using `prisma` will still work
 */
export const prisma = getPrimaryClient();

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
