// app/api/sentiment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    // Check if sentiment analysis already exists in the database
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
      select: { json: true },
    });

    // TEMPORARILY DISABLED: Always fetch fresh data
    // if (existingProfile) {
    //   const profileJson = existingProfile.json as any;

    //   // If sentimentAnalysis already exists, return it
    //   if (profileJson.sentimentAnalysis) {
    //     return NextResponse.json({
    //       success: true,
    //       result: profileJson.sentimentAnalysis,
    //       cached: true,
    //     });
    //   }
    // }

    // Forward the request to the sentiment analysis service
    // Use SENTIMENT_SERVICE_URL if set, otherwise fall back to INTAKE_ANALYSIS_URL
    const baseUrl = process.env.INTAKE_ANALYSIS_URL;

    // If baseUrl doesn't end with /api/sentiment, append it
    const sentimentServiceUrl = baseUrl.includes("/api/sentiment")
      ? baseUrl
      : baseUrl.includes("/api")
      ? `${baseUrl}/sentiment`
      : `${baseUrl}/api/sentiment`;

    console.log(
      `[Sentiment] Calling sentiment service at: ${sentimentServiceUrl}`
    );

    // Get API key from environment
    const apiKey = process.env.INTAKE_ANALYSIS_API_KEY?.trim() || "";

    if (!apiKey) {
      console.error("[Sentiment] INTAKE_ANALYSIS_API_KEY not configured");
      return NextResponse.json(
        { success: false, error: "INTAKE_ANALYSIS_API_KEY not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(sentimentServiceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sentiment API error:", errorText);
      return NextResponse.json(
        { success: false, error: "Failed to fetch sentiment data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Save the sentiment analysis results to the database
    if (data.success && data.result && existingProfile) {
      const profileJson = existingProfile.json as any;

      // Add sentimentAnalysis to the profile JSON
      const updatedJson = {
        ...profileJson,
        sentimentAnalysis: data.result,
      };

      // Update the database
      await prisma.profile.update({
        where: { userId },
        data: { json: updatedJson },
      });

      console.log(`Sentiment analysis saved for user ${userId}`);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Sentiment analysis error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
