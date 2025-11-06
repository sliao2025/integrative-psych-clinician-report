// app/api/summarize/route.ts
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

    // Check if summary already exists in the database
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
      select: { json: true },
    });

    // TEMPORARILY DISABLED: Always fetch fresh data
    // if (existingProfile) {
    //   const profileJson = existingProfile.json as any;

    //   // If summary already exists, return it
    //   if (profileJson.summary) {
    //     return NextResponse.json({
    //       success: true,
    //       summary: profileJson.summary,
    //       cached: true,
    //     });
    //   }
    // }

    // Forward the request to the summarization service
    const response = await fetch(
      "https://summarization-b5ikba4x4q-uk.a.run.app/summarize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Summarization API error:", errorText);
      return NextResponse.json(
        { success: false, error: "Failed to fetch summary data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Save the summary to the database
    if (data.success && data.summary && existingProfile) {
      const profileJson = existingProfile.json as any;

      // Add summary to the profile JSON
      const updatedJson = {
        ...profileJson,
        summary: data.summary,
      };

      // Update the database
      await prisma.profile.update({
        where: { userId },
        data: { json: updatedJson },
      });

      console.log(`Summary saved for user ${userId}`);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
