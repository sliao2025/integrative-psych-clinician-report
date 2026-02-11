import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/transcribe/trigger
 * Triggers the transcription service to process an uploaded audio file.
 * This is a fire-and-forget endpoint - it doesn't wait for transcription to complete.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const body = await request.json();
    const { userId, fileName, fieldType, bucket } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!fileName || !fieldType) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, fieldType" },
        { status: 400 }
      );
    }

    // Trigger transcription service
    const transcriptionEndpoint = process.env.TRANSCRIPTION_SERVICE_URL;

    const bucketName = bucket || process.env.GCS_BUCKET_NAME;

    console.log(
      `[transcribe/trigger] Triggering transcription for: ${fileName}`
    );

    const transcriptionResponse = await fetch(transcriptionEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: fileName, // e.g., "userId/storyNarrative-123.webm"
        userId: userId,
        fieldType: fieldType, // e.g., "storyNarrative", "livingSituation", etc.
        bucket: bucketName,
      }),
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error(
        `[transcribe/trigger] Transcription trigger failed: ${transcriptionResponse.status}`,
        errorText
      );
      return NextResponse.json(
        {
          ok: false,
          error: "Transcription trigger failed",
          details: errorText,
        },
        { status: transcriptionResponse.status }
      );
    }

    console.log(
      `[transcribe/trigger] Transcription triggered successfully for ${fileName}`
    );

    return NextResponse.json({
      ok: true,
      message: "Transcription triggered successfully",
    });
  } catch (error: any) {
    console.error(`[transcribe/trigger] Error:`, error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
