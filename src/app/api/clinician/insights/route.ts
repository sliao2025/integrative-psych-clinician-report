// app/api/clinician/insights/route.ts
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

    // Check if insights already exist in database
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
      select: { json: true },
    });

    if (existingProfile) {
      const profileJson = existingProfile.json as any;

      // If insights already exist, return them
      if (profileJson.clinical_insights) {
        return NextResponse.json({
          success: true,
          insights: profileJson.clinical_insights,
          cached: true,
        });
      }
    }

    // Forward the userId to the insights service
    // The service will fetch the profile data itself from the database
    const response = await fetch("http://localhost:8080/insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Insights API error:", errorText);
      return NextResponse.json(
        { success: false, error: "Failed to fetch insights data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the actual insights from the response
    // Server returns: { success: true, userId: "...", insights: {...} }
    const insights = data.insights || data;

    // Save the insights to the database
    // (Commented out for now as per user's changes)
    // if (insights && existingProfile) {
    //   const profileJson = existingProfile.json as any;

    //   // Add insights to the profile JSON
    //   const updatedJson = {
    //     ...profileJson,
    //     clinical_insights: insights,
    //   };

    //   // Update the database
    //   await prisma.profile.update({
    //     where: { userId },
    //     data: { json: updatedJson },
    //   });

    //   console.log(`Clinical insights saved for user ${userId}`);
    // }

    return NextResponse.json({ success: true, insights });
  } catch (error: any) {
    console.error("Clinical insights error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
