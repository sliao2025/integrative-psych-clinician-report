/**
 * S3-Compatible Storage Client
 *
 * This module provides an S3-compatible storage client that works with:
 * - Cloudflare R2
 * - Amazon S3
 * - MinIO
 * - Any S3-compatible storage
 *
 * PRESERVED: The original GCS code remains in the API routes.
 * This file provides an alternative storage backend.
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

// Environment-based configuration
const S3_ENDPOINT = process.env.S3_ENDPOINT; // e.g., https://ACCOUNT_ID.r2.cloudflarestorage.com
const S3_REGION = process.env.S3_REGION || "auto";
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const S3_BUCKET_NAME =
  process.env.S3_BUCKET_NAME || "intake-assessment-audio-files";

// Determine which storage backend to use
export const STORAGE_BACKEND = process.env.STORAGE_BACKEND || "s3"; // "s3" or "gcs"

// Initialize S3 client (only if using S3 backend)
let s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3Client) {
    if (!S3_ENDPOINT || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
      throw new Error(
        "Missing S3 configuration. Set S3_ENDPOINT, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY"
      );
    }

    s3Client = new S3Client({
      region: S3_REGION,
      endpoint: S3_ENDPOINT,
      credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
      },
      // Required for Cloudflare R2
      forcePathStyle: true,
    });
  }
  return s3Client;
}

export function getBucketName(): string {
  return S3_BUCKET_NAME;
}

/**
 * Upload a file to S3-compatible storage
 */
export async function uploadFile(
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<{ success: boolean; key: string }> {
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  });

  await client.send(command);

  console.log(`[S3 Storage] Uploaded: ${fileName}`);

  return {
    success: true,
    key: fileName,
  };
}

/**
 * Download a file from S3-compatible storage
 */
export async function downloadFile(fileName: string): Promise<Buffer> {
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
  });

  const response = await client.send(command);

  if (!response.Body) {
    throw new Error(`File not found: ${fileName}`);
  }

  // Convert stream to buffer
  const stream = response.Body as Readable;
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

/**
 * Get file as a readable stream
 */
export async function getFileStream(fileName: string): Promise<{
  stream: Readable;
  contentType: string | undefined;
  contentLength: number | undefined;
}> {
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
  });

  const response = await client.send(command);

  if (!response.Body) {
    throw new Error(`File not found: ${fileName}`);
  }

  return {
    stream: response.Body as Readable,
    contentType: response.ContentType,
    contentLength: response.ContentLength,
  };
}

/**
 * Delete a file from S3-compatible storage
 */
export async function deleteFile(fileName: string): Promise<boolean> {
  const client = getS3Client();

  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
  });

  await client.send(command);

  console.log(`[S3 Storage] Deleted: ${fileName}`);

  return true;
}

/**
 * Check if a file exists
 */
export async function fileExists(fileName: string): Promise<boolean> {
  const client = getS3Client();

  try {
    const command = new HeadObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
    });

    await client.send(command);
    return true;
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Generate a pre-signed URL for temporary access
 */
export async function getSignedDownloadUrl(
  fileName: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
  });

  const url = await getSignedUrl(client, command, {
    expiresIn: expiresInSeconds,
  });

  return url;
}
