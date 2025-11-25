import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { patientId, assessmentType, dueDate, requestedBy } = body;

    if (!patientId || !assessmentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Normalize assessment type to lowercase for consistency
    const assessmentTypeLower = assessmentType.toLowerCase();

    // Fetch the patient to get their clinicId
    const patient = await prisma.user.findUnique({
      where: { id: patientId },
      select: { clinicId: true },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Create a new assessment response with initial null values
    // This indicates the assessment was requested but not yet completed
    const assessment = await prisma.assessmentResponse.create({
      data: {
        userId: patientId,
        clinicId: patient.clinicId, // Use the patient's clinicId from their User record
        assessmentType: assessmentTypeLower, // Store normalized to lowercase
        responses: {},
        requestedBy: requestedBy || session.user.email,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedAt: new Date(), // Set when clinician assigns the assessment
        // completedAt will be set when patient completes it
      },
    });

    return NextResponse.json({ success: true, assessment });
  } catch (error: any) {
    console.error("Error sending assessment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send assessment" },
      { status: 500 }
    );
  }
}
