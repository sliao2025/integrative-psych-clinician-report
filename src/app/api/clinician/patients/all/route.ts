import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

/**
 * GET /api/clinician/patients/all
 * Returns all patients with completed intakes (admin only: sliao@psych-nyc.com)
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  const clinicianEmail = session?.user?.email ?? "";

  // Removed strict admin check to allow all authenticated clinicians to fetch patients
  if (!clinicianEmail.endsWith("@psych-nyc.com")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const patients = await prisma.user.findMany({
      where: {
        intakeFinished: true,
        profile: {
          isNot: null,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        clinician: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            age: true,
            json: true,
            firstSubmittedAt: true,
          },
        },
      },
      orderBy: {
        profile: {
          firstSubmittedAt: "desc",
        },
      },
    });

    // Filter out any patients without profiles
    const validPatients = patients.filter((p) => p.profile);

    return NextResponse.json({ patients: validPatients });
  } catch (err) {
    console.error("GET /api/clinician/patients/all error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
