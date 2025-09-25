// src/app/api/clinician/patients/[id]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const clinicianEmail = session?.user?.email ?? "";
  if (!clinicianEmail || !/@psych-nyc\.com$/i.test(clinicianEmail)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const patient = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        profile: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ patient });
  } catch (err) {
    console.error("GET /api/clinician/patients/[id] error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
