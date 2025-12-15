// app/api/clinician/insights/route.ts
import { NextRequest, NextResponse } from "next/server";

// ============================================
// Types
// ============================================

interface Diagnosis {
  diagnosis: string;
  rule_in_criteria: string;
  rule_out_criteria: string;
  reasoning: string;
}

interface ActionItemsResponse {
  success: boolean;
  userId: string;
  actionItems: {
    interview_questions: any[];
    collateral_interviews: any[];
    labs_imaging: any[];
    vitals_and_physical_exam: any[];
    standardized_diagnostic_testing: any[];
    scales: any[];
    records_and_documents: any[];
    behavioral_monitoring_and_diaries: any[];
    specialist_consultations: any[];
    digital_and_passive_monitoring: any[];
  };
}

interface DiagnosesResponse {
  success: boolean;
  userId: string;
  diagnoses: Diagnosis[];
}

// ============================================
// Configuration
// ============================================

// Use environment variable for service URL, fallback to localhost for development
const CLINICAL_INSIGHTS_SERVICE_URL =
  process.env.CLINICAL_INSIGHTS_SERVICE_URL || "http://localhost:8080";

// ============================================
// API Route Handler
// ============================================

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

    console.log(
      `[Clinical Insights API] Fetching insights for userId: ${userId}`
    );

    // Fetch action items and diagnoses in parallel from the Cloud Run service
    const [actionItemsResult, diagnosesResult] = await Promise.allSettled([
      fetch(`${CLINICAL_INSIGHTS_SERVICE_URL}/action-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }),
      fetch(`${CLINICAL_INSIGHTS_SERVICE_URL}/diagnoses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }),
    ]);

    // Process action items response
    let actionItems = null;
    if (
      actionItemsResult.status === "fulfilled" &&
      actionItemsResult.value.ok
    ) {
      const data: ActionItemsResponse = await actionItemsResult.value.json();
      actionItems = data.actionItems;
      console.log(`[Clinical Insights API] Action items fetched successfully`);
    } else {
      const errorMsg =
        actionItemsResult.status === "rejected"
          ? actionItemsResult.reason?.message
          : await actionItemsResult.value.text();
      console.error(`[Clinical Insights API] Action items error:`, errorMsg);
    }

    // Process diagnoses response
    let diagnoses: Diagnosis[] = [];
    if (diagnosesResult.status === "fulfilled" && diagnosesResult.value.ok) {
      const data: DiagnosesResponse = await diagnosesResult.value.json();
      diagnoses = data.diagnoses;
      console.log(
        `[Clinical Insights API] Diagnoses fetched successfully: ${diagnoses.length} diagnoses`
      );
    } else {
      const errorMsg =
        diagnosesResult.status === "rejected"
          ? diagnosesResult.reason?.message
          : await diagnosesResult.value.text();
      console.error(`[Clinical Insights API] Diagnoses error:`, errorMsg);
    }

    // Return error if both requests failed
    if (!actionItems && diagnoses.length === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch clinical insights" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      actionItems,
      diagnoses,
    });
  } catch (error: any) {
    console.error("[Clinical Insights API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
