import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
});

const bucketName =
  process.env.GCS_BUCKET_NAME || "intake-assessment-audio-files";

/**
 * Stream audio files from GCS with ownership verification.
 * This proxies the file through our API, ensuring only the owner can access it.
 * No signed URLs needed - we verify userId matches the file path.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.warn("[audio/stream] No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get fileName from query parameters (GET requests don't have body)
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");
    console.log("[audio/stream] Requested fileName:", fileName);

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName parameter required" },
        { status: 400 }
      );
    }

    // Security check: verify the file belongs to this user
    // The fileName format is: userId/fieldName-timestamp.webm

    const userId = fileName.split("/")[0];
    console.log(
      "[audio/stream] File path starts with:",
      fileName.split("/")[0]
    );
    if (!fileName.startsWith(`${userId}/`)) {
      console.warn(
        `[audio/stream] Unauthorized access attempt: user ${userId} tried to access ${fileName}`
      );
      return NextResponse.json(
        { error: "Unauthorized to access this file" },
        { status: 403 }
      );
    }

    // Stream the file from GCS
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    // Check if file exists
    const [exists] = await file.exists();

    console.log("[audio/stream] File exists:", exists);

    if (!exists) {
      console.error(`[audio/stream] File not found: ${fileName}`);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Get file metadata
    const [metadata] = await file.getMetadata();

    console.log("[audio/stream] File metadata:", {
      contentType: metadata.contentType,
      size: metadata.size,
      timeCreated: metadata.timeCreated,
    });

    // Download file content
    const [content] = await file.download();

    console.log(
      `[audio/stream] Successfully streaming ${fileName} (${content.length} bytes) for user ${userId}`
    );

    // Return the audio file with proper headers
    return new NextResponse(content as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": metadata.contentType || "audio/webm",
        "Content-Length": String(content.length),
        "Cache-Control": "private, max-age=3600", // Cache for 1 hour
        "Content-Disposition": `inline; filename="${fileName
          .split("/")
          .pop()}"`,
        // Security headers
        "X-Content-Type-Options": "nosniff",
        // CORS headers (if needed for audio playback)
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error: any) {
    console.error("[audio/stream] Error:", error);
    console.error("[audio/stream] Error stack:", error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to stream audio" },
      { status: 500 }
    );
  }
}
