/**
 * Health Check API Endpoint
 *
 * Provides a comprehensive health status for monitoring:
 * - Database (primary and backup)
 * - Storage (primary and backup)
 * - Overall system status
 *
 * GET /api/health
 *
 * Response:
 * {
 *   status: 'healthy' | 'degraded' | 'unhealthy',
 *   timestamp: string,
 *   database: { primary: {...}, backup: {...}, active: 'primary' | 'backup' },
 *   storage: { gcs: {...}, s3: {...}, active: 'gcs' | 's3' },
 *   config: { dualWriteDb: boolean, dualWriteStorage: boolean, ... }
 * }
 */

import { NextResponse } from "next/server";
import { getDatabaseHealthStatus } from "@/lib/db-router";
import { getStorageHealthStatus, getStorageConfig } from "@/lib/file-storage";

export async function GET() {
  try {
    // Check database health
    const dbHealth = await getDatabaseHealthStatus();

    // Check storage health
    const storageHealth = await getStorageHealthStatus();
    const storageConfig = getStorageConfig();

    // Determine overall status using a function to avoid TypeScript type narrowing issues
    function calculateStatus(): "healthy" | "degraded" | "unhealthy" {
      const dbDown = !dbHealth.primary.healthy && !dbHealth.backup.healthy;
      const storageDown =
        !storageHealth.gcs.healthy && !storageHealth.s3.healthy;

      if (dbDown || storageDown) {
        return "unhealthy";
      }

      const dbDegraded = !dbHealth.primary.healthy || !dbHealth.backup.healthy;
      const storageDegraded =
        !storageHealth.gcs.healthy || !storageHealth.s3.healthy;

      if (dbDegraded || storageDegraded) {
        return "degraded";
      }

      return "healthy";
    }

    const status = calculateStatus();

    const response = {
      status,
      timestamp: new Date().toISOString(),
      database: {
        primary: {
          healthy: dbHealth.primary.healthy,
          lastCheck: dbHealth.primary.lastCheck.toISOString(),
          consecutiveFailures: dbHealth.primary.consecutiveFailures,
        },
        backup: {
          configured: dbHealth.backup.configured,
          healthy: dbHealth.backup.healthy,
          lastCheck: dbHealth.backup.lastCheck.toISOString(),
          consecutiveFailures: dbHealth.backup.consecutiveFailures,
        },
        active: dbHealth.activeDatabase,
        dualWriteEnabled: dbHealth.dualWriteEnabled,
      },
      storage: {
        gcs: {
          healthy: storageHealth.gcs.healthy,
          lastCheck: storageHealth.gcs.lastCheck.toISOString(),
        },
        s3: {
          healthy: storageHealth.s3.healthy,
          lastCheck: storageHealth.s3.lastCheck.toISOString(),
        },
        active: storageHealth.activeBackend,
        config: {
          primaryBackend: storageConfig.primaryBackend,
          failoverEnabled: storageConfig.failoverEnabled,
          dualWriteEnabled: storageConfig.dualWriteEnabled,
        },
      },
      version: process.env.npm_package_version || "unknown",
      environment: process.env.NODE_ENV || "unknown",
    };

    // Return 200 for healthy/degraded, 503 for unhealthy
    const httpStatus = status === "unhealthy" ? 503 : 200;

    return NextResponse.json(response, { status: httpStatus });
  } catch (error: any) {
    console.error("[Health Check] Error:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 503 }
    );
  }
}
