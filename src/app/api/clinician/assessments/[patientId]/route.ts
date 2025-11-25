import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ patientId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { patientId } = await ctx.params;

    if (!patientId) {
      return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
    }

    // Fetch all assessment responses for this patient
    const assessments = await prisma.assessmentResponse.findMany({
      where: {
        userId: patientId,
      },
      orderBy: {
        completedAt: "desc",
      },
      select: {
        id: true,
        assessmentType: true,
        totalScore: true,
        completedAt: true,
        requestedBy: true,
        dueDate: true,
        assignedAt: true,
        responses: true,
      },
    });

    // Separate completed and pending assessments
    const completedAssessments = assessments.filter((assessment) => {
      const responses = assessment.responses as Record<string, any>;
      return (
        responses && Object.keys(responses).length > 0 && assessment.completedAt
      );
    });

    const pendingAssessments = assessments.filter((assessment) => {
      const responses = assessment.responses as Record<string, any>;
      return (
        (!responses || Object.keys(responses).length === 0) &&
        !assessment.completedAt
      );
    });

    return NextResponse.json({
      assessments: completedAssessments,
      pendingAssessments: pendingAssessments,
    });
  } catch (error: any) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch assessments" },
      { status: 500 }
    );
  }
}
