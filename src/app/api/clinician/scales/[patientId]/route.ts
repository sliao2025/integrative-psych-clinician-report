import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ patientId: string }> },
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
        canPatientView: true,
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
      scales: completedAssessments,
      pendingScales: pendingAssessments,
    });
  } catch (error: any) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch assessments" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ patientId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get clinician ID
    const clinician = await prisma.user.findFirst({
      where: { email: session.user.email },
    });

    if (!clinician) {
      return NextResponse.json(
        { error: "Clinician not found" },
        { status: 401 },
      );
    }

    const { patientId } = await ctx.params;
    const body = await req.json();
    const { assessmentType, responses, totalScore, assessmentId } = body;

    if (!patientId || !assessmentType || !responses) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let assessment;

    if (assessmentId) {
      // Update existing assigned assessment
      assessment = await prisma.assessmentResponse.update({
        where: { id: assessmentId },
        data: {
          responses,
          totalScore: totalScore ?? null,
          completedAt: new Date(),
          requestedBy: clinician.id,
        },
      });
    } else {
      // Create new assessment (clinician administered)
      assessment = await prisma.assessmentResponse.create({
        data: {
          id: crypto.randomUUID(),
          userId: patientId,
          clinicId: clinician.clinicId || "",
          assessmentType: assessmentType.toLowerCase(),
          responses,
          totalScore: totalScore ?? null,
          completedAt: new Date(),
          requestedBy: clinician.id,
        },
      });
    }

    return NextResponse.json({ success: true, assessment });
  } catch (error: any) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit assessment" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ patientId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { assessmentId, canPatientView } = body;

    if (!assessmentId || typeof canPatientView !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const assessment = await prisma.assessmentResponse.update({
      where: { id: assessmentId },
      data: { canPatientView },
    });

    return NextResponse.json({ success: true, assessment });
  } catch (error: any) {
    console.error("Error updating assessment visibility:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update visibility" },
      { status: 500 },
    );
  }
}
