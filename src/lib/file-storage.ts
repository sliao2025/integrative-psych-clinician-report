/**
 * File Storage Abstraction Layer with Failover Support
 *
 * This module provides a unified interface for file storage with automatic failover:
 * - Primary: Google Cloud Storage (GCS)
 * - Backup: S3-compatible storage (Cloudflare R2)
 *
 * Configuration via environment variables:
 * - STORAGE_BACKEND=gcs|s3     → Primary storage backend (default: gcs)
 * - STORAGE_FAILOVER=true      → Enable automatic failover to backup
 * - FORCE_BACKUP_STORAGE=true  → Force use of backup storage only
 *
 * For dual-write mode (recommended for high availability):
 * - STORAGE_DUAL_WRITE=true    → Write to both backends simultaneously
 */

import { Readable } from "stream";

// Configuration
const PRIMARY_BACKEND = process.env.STORAGE_BACKEND || "gcs";
const ENABLE_FAILOVER = process.env.STORAGE_FAILOVER === "true";
const FORCE_BACKUP = process.env.FORCE_BACKUP_STORAGE === "true";
const DUAL_WRITE = process.env.STORAGE_DUAL_WRITE === "true";

// Health tracking
let gcsHealthy = true;
let s3Healthy = true;
let lastGcsCheck = new Date(0);
let lastS3Check = new Date(0);
const HEALTH_CHECK_INTERVAL = 60000; // 1 minute

// Types
export interface UploadResult {
  success: boolean;
  key: string;
  url?: string;
  backend: "gcs" | "s3";
  dualWriteSuccess?: boolean; // true if dual-write to backup also succeeded
}

export interface FileStreamResult {
  stream: Readable;
  contentType: string | undefined;
  contentLength: number | undefined;
}

export interface HealthStatus {
  gcs: { healthy: boolean; lastCheck: Date };
  s3: { healthy: boolean; lastCheck: Date };
  activeBackend: "gcs" | "s3";
}

// Dynamic imports to avoid loading unused dependencies
async function getS3Module() {
  return import("./storage-s3");
}

async function getGCSStorage() {
  const { Storage } = await import("@google-cloud/storage");
  return new Storage({
    projectId: process.env.GCP_PROJECT_ID,
  });
}

const GCS_BUCKET =
  process.env.GCS_BUCKET_NAME || "intake-assessment-audio-files";

/**
 * Determine which storage backend to use
 */
function getActiveBackend(): "gcs" | "s3" {
  // Force backup mode overrides everything
  if (FORCE_BACKUP) {
    return "s3";
  }

  // If failover is enabled, check health
  if (ENABLE_FAILOVER) {
    if (PRIMARY_BACKEND === "gcs" && !gcsHealthy && s3Healthy) {
      console.log("[Storage] Failover: Using S3 because GCS is unhealthy");
      return "s3";
    }
    if (PRIMARY_BACKEND === "s3" && !s3Healthy && gcsHealthy) {
      console.log("[Storage] Failover: Using GCS because S3 is unhealthy");
      return "gcs";
    }
  }

  return PRIMARY_BACKEND as "gcs" | "s3";
}

/**
 * Check GCS health
 */
async function checkGCSHealth(): Promise<boolean> {
  // Skip if checked recently
  if (Date.now() - lastGcsCheck.getTime() < HEALTH_CHECK_INTERVAL) {
    return gcsHealthy;
  }

  try {
    const storage = await getGCSStorage();
    const bucket = storage.bucket(GCS_BUCKET);
    await bucket.exists();
    gcsHealthy = true;
    lastGcsCheck = new Date();
    return true;
  } catch (error: any) {
    console.error("[GCS Health] Check failed:", error.message);
    gcsHealthy = false;
    lastGcsCheck = new Date();
    return false;
  }
}

/**
 * Check S3/R2 health
 */
async function checkS3Health(): Promise<boolean> {
  // Skip if checked recently
  if (Date.now() - lastS3Check.getTime() < HEALTH_CHECK_INTERVAL) {
    return s3Healthy;
  }

  try {
    const s3 = await getS3Module();
    const healthy = await s3.checkS3Health();
    s3Healthy = healthy;
    lastS3Check = new Date();
    return healthy;
  } catch (error: any) {
    console.error("[S3 Health] Check failed:", error.message);
    s3Healthy = false;
    lastS3Check = new Date();
    return false;
  }
}

/**
 * Get current health status
 */
export async function getStorageHealthStatus(): Promise<HealthStatus> {
  await Promise.all([checkGCSHealth(), checkS3Health()]);

  return {
    gcs: { healthy: gcsHealthy, lastCheck: lastGcsCheck },
    s3: { healthy: s3Healthy, lastCheck: lastS3Check },
    activeBackend: getActiveBackend(),
  };
}

/**
 * Upload a file to storage with failover and optional dual-write
 */
export async function uploadFileToStorage(
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<UploadResult> {
  const backend = getActiveBackend();
  let dualWriteSuccess = false;

  // Primary upload
  try {
    if (backend === "gcs") {
      const storage = await getGCSStorage();
      const bucket = storage.bucket(GCS_BUCKET);
      const file = bucket.file(fileName);

      await file.save(buffer, {
        contentType,
        resumable: false,
      });

      console.log(`[Storage] Uploaded to GCS: ${fileName}`);

      // Dual-write to S3 if enabled
      if (DUAL_WRITE) {
        try {
          const s3 = await getS3Module();
          await s3.uploadFile(fileName, buffer, contentType);
          dualWriteSuccess = true;
          console.log(`[Storage] Dual-write to S3 succeeded: ${fileName}`);
        } catch (error: any) {
          console.error(`[Storage] Dual-write to S3 failed: ${error.message}`);
        }
      }

      return { success: true, key: fileName, backend: "gcs", dualWriteSuccess };
    } else {
      // S3 backend
      const s3 = await getS3Module();
      await s3.uploadFile(fileName, buffer, contentType);

      console.log(`[Storage] Uploaded to S3: ${fileName}`);

      // Dual-write to GCS if enabled (reverse direction)
      if (DUAL_WRITE) {
        try {
          const storage = await getGCSStorage();
          const bucket = storage.bucket(GCS_BUCKET);
          const file = bucket.file(fileName);
          await file.save(buffer, { contentType, resumable: false });
          dualWriteSuccess = true;
          console.log(`[Storage] Dual-write to GCS succeeded: ${fileName}`);
        } catch (error: any) {
          console.error(`[Storage] Dual-write to GCS failed: ${error.message}`);
        }
      }

      return { success: true, key: fileName, backend: "s3", dualWriteSuccess };
    }
  } catch (error: any) {
    // Primary upload failed - try failover if enabled
    if (ENABLE_FAILOVER) {
      console.error(
        `[Storage] Primary upload to ${backend} failed: ${error.message}`
      );

      // Mark primary as unhealthy
      if (backend === "gcs") {
        gcsHealthy = false;
        lastGcsCheck = new Date();
      } else {
        s3Healthy = false;
        lastS3Check = new Date();
      }

      // Try backup
      const backupBackend = backend === "gcs" ? "s3" : "gcs";
      console.log(`[Storage] Attempting failover to ${backupBackend}`);

      if (backupBackend === "s3") {
        const s3 = await getS3Module();
        await s3.uploadFile(fileName, buffer, contentType);
        return { success: true, key: fileName, backend: "s3" };
      } else {
        const storage = await getGCSStorage();
        const bucket = storage.bucket(GCS_BUCKET);
        const file = bucket.file(fileName);
        await file.save(buffer, { contentType, resumable: false });
        return { success: true, key: fileName, backend: "gcs" };
      }
    }

    throw error;
  }
}

/**
 * Download a file from storage with failover
 */
export async function downloadFileFromStorage(
  fileName: string
): Promise<Buffer> {
  const backend = getActiveBackend();

  try {
    if (backend === "gcs") {
      const storage = await getGCSStorage();
      const bucket = storage.bucket(GCS_BUCKET);
      const file = bucket.file(fileName);
      const [contents] = await file.download();
      return contents;
    } else {
      const s3 = await getS3Module();
      return await s3.downloadFile(fileName);
    }
  } catch (error: any) {
    // Try failover
    if (ENABLE_FAILOVER) {
      console.error(
        `[Storage] Download from ${backend} failed: ${error.message}`
      );

      const backupBackend = backend === "gcs" ? "s3" : "gcs";
      console.log(
        `[Storage] Attempting failover download from ${backupBackend}`
      );

      if (backupBackend === "s3") {
        const s3 = await getS3Module();
        return await s3.downloadFile(fileName);
      } else {
        const storage = await getGCSStorage();
        const bucket = storage.bucket(GCS_BUCKET);
        const file = bucket.file(fileName);
        const [contents] = await file.download();
        return contents;
      }
    }

    throw error;
  }
}

/**
 * Get file as a readable stream with failover
 */
export async function getFileStreamFromStorage(
  fileName: string
): Promise<FileStreamResult> {
  const backend = getActiveBackend();

  try {
    if (backend === "gcs") {
      const storage = await getGCSStorage();
      const bucket = storage.bucket(GCS_BUCKET);
      const file = bucket.file(fileName);

      const [metadata] = await file.getMetadata();
      const stream = file.createReadStream();

      return {
        stream: stream as unknown as Readable,
        contentType: metadata.contentType,
        contentLength: parseInt(metadata.size as string, 10),
      };
    } else {
      const s3 = await getS3Module();
      return await s3.getFileStream(fileName);
    }
  } catch (error: any) {
    // Try failover
    if (ENABLE_FAILOVER) {
      console.error(
        `[Storage] Stream from ${backend} failed: ${error.message}`
      );

      const backupBackend = backend === "gcs" ? "s3" : "gcs";
      console.log(`[Storage] Attempting failover stream from ${backupBackend}`);

      if (backupBackend === "s3") {
        const s3 = await getS3Module();
        return await s3.getFileStream(fileName);
      } else {
        const storage = await getGCSStorage();
        const bucket = storage.bucket(GCS_BUCKET);
        const file = bucket.file(fileName);

        const [metadata] = await file.getMetadata();
        const stream = file.createReadStream();

        return {
          stream: stream as unknown as Readable,
          contentType: metadata.contentType,
          contentLength: parseInt(metadata.size as string, 10),
        };
      }
    }

    throw error;
  }
}

/**
 * Delete a file from storage (deletes from both if dual-write enabled)
 */
export async function deleteFileFromStorage(
  fileName: string
): Promise<boolean> {
  const backend = getActiveBackend();
  let primarySuccess = false;

  try {
    if (backend === "gcs") {
      const storage = await getGCSStorage();
      const bucket = storage.bucket(GCS_BUCKET);
      await bucket.file(fileName).delete();
      primarySuccess = true;
    } else {
      const s3 = await getS3Module();
      await s3.deleteFile(fileName);
      primarySuccess = true;
    }

    // If dual-write is enabled, also delete from backup
    if (DUAL_WRITE) {
      try {
        if (backend === "gcs") {
          const s3 = await getS3Module();
          await s3.deleteFile(fileName);
        } else {
          const storage = await getGCSStorage();
          const bucket = storage.bucket(GCS_BUCKET);
          await bucket.file(fileName).delete();
        }
      } catch (error: any) {
        console.error(
          `[Storage] Dual-delete from backup failed: ${error.message}`
        );
      }
    }

    return primarySuccess;
  } catch (error: any) {
    if (ENABLE_FAILOVER) {
      console.error(
        `[Storage] Delete from ${backend} failed: ${error.message}`
      );

      const backupBackend = backend === "gcs" ? "s3" : "gcs";
      if (backupBackend === "s3") {
        const s3 = await getS3Module();
        return await s3.deleteFile(fileName);
      } else {
        const storage = await getGCSStorage();
        const bucket = storage.bucket(GCS_BUCKET);
        await bucket.file(fileName).delete();
        return true;
      }
    }

    throw error;
  }
}

/**
 * Check if a file exists in storage
 */
export async function fileExistsInStorage(fileName: string): Promise<boolean> {
  const backend = getActiveBackend();

  try {
    if (backend === "gcs") {
      const storage = await getGCSStorage();
      const bucket = storage.bucket(GCS_BUCKET);
      const [exists] = await bucket.file(fileName).exists();
      return exists;
    } else {
      const s3 = await getS3Module();
      return await s3.fileExists(fileName);
    }
  } catch (error: any) {
    if (ENABLE_FAILOVER) {
      const backupBackend = backend === "gcs" ? "s3" : "gcs";
      if (backupBackend === "s3") {
        const s3 = await getS3Module();
        return await s3.fileExists(fileName);
      } else {
        const storage = await getGCSStorage();
        const bucket = storage.bucket(GCS_BUCKET);
        const [exists] = await bucket.file(fileName).exists();
        return exists;
      }
    }

    throw error;
  }
}

/**
 * Get the current storage backend name
 */
export function getStorageBackend(): string {
  return getActiveBackend();
}

/**
 * Get storage configuration info (for debugging)
 */
export function getStorageConfig() {
  return {
    primaryBackend: PRIMARY_BACKEND,
    activeBackend: getActiveBackend(),
    failoverEnabled: ENABLE_FAILOVER,
    dualWriteEnabled: DUAL_WRITE,
    forceBackup: FORCE_BACKUP,
    gcsBucket: GCS_BUCKET,
  };
}
