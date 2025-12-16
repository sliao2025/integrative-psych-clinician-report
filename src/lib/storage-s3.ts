/**
 * S3-Compatible Storage Client
 *
 * This module provides an S3-compatible storage client that works with:
 * - Cloudflare R2
 * - Amazon S3
 * - MinIO
 * - Any S3-compatible storage
 *
 * Used as backup storage when GCS is unavailable.
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

// Environment-based configuration for R2/S3
// R2-specific env vars (preferred)
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

// Generic S3 env vars (fallback for AWS S3 or other providers)
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_REGION = process.env.S3_REGION || "auto";
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || R2_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY =
  process.env.S3_SECRET_ACCESS_KEY || R2_SECRET_ACCESS_KEY;
const S3_BUCKET_NAME =
  process.env.S3_BUCKET_NAME ||
  R2_BUCKET_NAME ||
  "intake-assessment-audio-files";

// Build endpoint: prefer explicit S3_ENDPOINT, then build from R2_ACCOUNT_ID
function getEndpoint(): string | undefined {
  if (S3_ENDPOINT) return S3_ENDPOINT;
  if (R2_ACCOUNT_ID) return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  return undefined;
}

// Singleton S3 client
let s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3Client) {
    const endpoint = getEndpoint();

    if (!endpoint || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
      throw new Error(
        "Missing S3/R2 configuration. Set either:\n" +
          "  - R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME (for Cloudflare R2)\n" +
          "  - S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET_NAME (for AWS S3 or other)"
      );
    }

    s3Client = new S3Client({
      region: S3_REGION,
      endpoint: endpoint,
      credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
      },
      // Required for Cloudflare R2 and path-style access
      forcePathStyle: true,
    });

    console.log(`[S3 Storage] Initialized client for endpoint: ${endpoint}`);
  }
  return s3Client;
}

export function getBucketName(): string {
  return S3_BUCKET_NAME;
}

/**
 * Check if S3/R2 storage is configured and accessible
 */
export async function checkS3Health(): Promise<boolean> {
  try {
    const endpoint = getEndpoint();
    if (!endpoint || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
      console.log("[S3 Health] Not configured");
      return false;
    }

    const client = getS3Client();
    const command = new HeadBucketCommand({ Bucket: S3_BUCKET_NAME });

    await client.send(command);
    console.log("[S3 Health] Bucket accessible");
    return true;
  } catch (error: any) {
    console.error("[S3 Health] Check failed:", error.message);
    return false;
  }
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

  console.log(`[S3 Storage] Uploaded: ${fileName} (${buffer.length} bytes)`);

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
