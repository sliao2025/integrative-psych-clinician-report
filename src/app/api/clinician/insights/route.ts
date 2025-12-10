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

      // Return cached data if available
      if (profileJson.clinical_action_items || profileJson.clinical_diagnoses) {
        return NextResponse.json({
          success: true,
          actionItems: profileJson.clinical_action_items || null,
          diagnoses: profileJson.clinical_diagnoses || null,
          cached: true,
        });
      }
    }

    console.log(
      `[Insights] No cached data for user ${userId}, fetching from service...`
    );

    let actionItems = null;
    let diagnoses = null;

    // Call the intake-analysis service
    const insightsUrl = process.env.INTAKE_ANALYSIS_URL;
    const apiKey = process.env.INTAKE_ANALYSIS_API_KEY;

    if (insightsUrl && apiKey) {
      console.log(
        `[Insights] Calling ${insightsUrl}/api/action-items and /api/diagnoses`
      );

      const [actionItemsResponse, diagnosesResponse] = await Promise.all([
        fetch(`${insightsUrl}/api/action-items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
          body: JSON.stringify({ userId }),
          signal: AbortSignal.timeout(55000), // 55 second timeout (just under Vercel's 60s limit)
        }).catch((err) => {
          console.error("Action items fetch failed:", err);
          return null;
        }),
        fetch(`${insightsUrl}/api/diagnoses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
          body: JSON.stringify({ userId }),
          signal: AbortSignal.timeout(55000), // 55 second timeout
        }).catch((err) => {
          console.error("Diagnoses fetch failed:", err);
          return null;
        }),
      ]);

      // Parse action items response
      if (actionItemsResponse && actionItemsResponse.ok) {
        try {
          const data = await actionItemsResponse.json();
          if (data.success && data.actionItems) {
            actionItems = data.actionItems;
            console.log("[Insights] Action items received successfully");
          }
        } catch (e) {
          console.error("[Insights] Failed to parse action items response:", e);
        }
      } else if (actionItemsResponse) {
        console.error(
          "[Insights] Action items request failed:",
          actionItemsResponse.status
        );
      }

      // Parse diagnoses response
      if (diagnosesResponse && diagnosesResponse.ok) {
        try {
          const data = await diagnosesResponse.json();
          if (data.success && data.diagnoses) {
            diagnoses = data.diagnoses;
            console.log("[Insights] Diagnoses received successfully");
          }
        } catch (e) {
          console.error("[Insights] Failed to parse diagnoses response:", e);
        }
      } else if (diagnosesResponse) {
        console.error(
          "[Insights] Diagnoses request failed:",
          diagnosesResponse.status
        );
      }

      // Save to database if we got results
      if (existingProfile && (actionItems || diagnoses)) {
        try {
          const profileJson = existingProfile.json as any;
          const updatedJson = {
            ...profileJson,
            ...(actionItems && { clinical_action_items: actionItems }),
            ...(diagnoses && { clinical_diagnoses: diagnoses }),
          };
          await prisma.profile.update({
            where: { userId },
            data: { json: updatedJson },
          });
          console.log(`[Insights] Clinical data saved for user ${userId}`);
        } catch (dbError) {
          console.error("[Insights] Failed to save to database:", dbError);
        }
      }
    } else {
      console.warn(
        "[Insights] INTAKE_ANALYSIS_URL or INTAKE_ANALYSIS_API_KEY not configured"
      );
    }

    return NextResponse.json({
      success: true,
      actionItems,
      diagnoses,
    });
  } catch (error: any) {
    console.error("Clinical insights error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
