import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { spawn } from "child_process";
import path from "path";

/**
 * Transcribe audio file using Python transcription service
 * Fetches audio from /api/audio, pipes it to Python, returns transcript
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.warn("[transcribe] No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName parameter required" },
        { status: 400 }
      );
    }

    console.log("[transcribe] Request:", { fileName });

    // Fetch audio from our own /api/audio endpoint (which handles all GCS auth)
    const audioUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/api/audio?fileName=${encodeURIComponent(fileName)}`;

    console.log("[transcribe] Fetching audio from /api/audio...");
    const audioResponse = await fetch(audioUrl, {
      headers: {
        // Forward the session cookie to authenticate with /api/audio
        cookie: req.headers.get("cookie") || "",
      },
    });

    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio: ${audioResponse.statusText}`);
    }

    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    console.log(`[transcribe] Fetched ${audioBuffer.length} bytes`);

    // Get file extension
    const fileExtension = path.extname(fileName) || ".webm";

    // Call Python transcription script
    console.log("[transcribe] Starting transcription...");
    const transcript = await transcribeAudio(audioBuffer, fileExtension);

    console.log("[transcribe] Transcription complete");

    return NextResponse.json(
      {
        fileName,
        transcription: transcript.transcription,
        translation: transcript.translation, // May be undefined if already English
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[transcribe] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}

/**
 * Transcribe audio by piping it to Python script
 */
function transcribeAudio(
  audioBuffer: Buffer,
  fileExtension: string
): Promise<{
  transcription: { text: string; chunks: any[] };
  translation?: { text: string; chunks: any[] };
}> {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(
      process.cwd(),
      "src/app/analysis/venv/bin/python3"
    );
    const scriptPath = path.join(
      process.cwd(),
      "src/app/analysis/audio_transcription.py"
    );

    // Spawn Python process
    const pythonProcess = spawn(pythonPath, [
      scriptPath,
      "--stdin",
      fileExtension,
    ]);

    let stdoutData = "";
    let stderrData = "";

    // Collect stdout (JSON result)
    pythonProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    // Collect stderr (logs)
    pythonProcess.stderr.on("data", (data) => {
      const message = data.toString();
      console.log("[transcribe/python]", message);
      stderrData += message;
    });

    // Handle process completion
    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(`Python process exited with code ${code}\n${stderrData}`)
        );
        return;
      }

      try {
        const result = JSON.parse(stdoutData);
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${stdoutData}`));
      }
    });

    // Handle process errors
    pythonProcess.on("error", (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });

    // Write audio data to stdin
    pythonProcess.stdin.write(audioBuffer);
    pythonProcess.stdin.end();
  });
}
