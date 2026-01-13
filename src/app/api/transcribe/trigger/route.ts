import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 * POST /api/transcribe/trigger
 * Triggers the transcription service to process an uploaded audio file.
 * This is a fire-and-forget endpoint - it doesn't wait for transcription to complete.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { fileName, fieldType, bucket } = body;

    // Validate required fields
    if (!fileName || !fieldType) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, fieldType" },
        { status: 400 }
      );
    }

    // Trigger transcription service
    const transcriptionEndpoint =
      process.env.TRANSCRIPTION_SERVICE_URL ||
      "https://intake-analysis-34615113909.us-east4.run.app/transcribe";

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
