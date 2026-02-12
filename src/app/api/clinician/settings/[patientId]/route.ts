// src/app/api/clinician/settings/[patientId]/route.ts
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

/**
 * GET /api/clinician/settings/[patientId]
 * Returns the patient's visibility settings (defaults if no row exists)
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ patientId: string }> },
) {
  const { patientId } = await ctx.params;

  const session = await getServerSession(authOptions);
  const clinicianEmail = session?.user?.email ?? "";
  if (!clinicianEmail || !/@psych-nyc\.com$/i.test(clinicianEmail)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!patientId?.trim()) {
    return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
  }

  try {
    const settings = await prisma.settings.findUnique({
      where: { userId: patientId.trim() },
    });

    return NextResponse.json({
      journalEnabled: settings?.journalEnabled ?? false,
      scalesEnabled: settings?.scalesEnabled ?? false,
    });
  } catch (err) {
    console.error("GET /api/clinician/settings/[patientId] error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * POST /api/clinician/settings/[patientId]
 * Upsert patient visibility settings
 * Body: { journalEnabled?: boolean, scalesEnabled?: boolean }
 */
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ patientId: string }> },
) {
  const { patientId } = await ctx.params;

  const session = await getServerSession(authOptions);
  const clinicianEmail = session?.user?.email ?? "";
  if (!clinicianEmail || !/@psych-nyc\.com$/i.test(clinicianEmail)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!patientId?.trim()) {
    return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data: Record<string, boolean> = {};

    if (typeof body.journalEnabled === "boolean") {
      data.journalEnabled = body.journalEnabled;
    }
    if (typeof body.scalesEnabled === "boolean") {
      data.scalesEnabled = body.scalesEnabled;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const settings = await prisma.settings.upsert({
      where: { userId: patientId.trim() },
      create: {
        userId: patientId.trim(),
        journalEnabled: data.journalEnabled ?? false,
        scalesEnabled: data.scalesEnabled ?? false,
      },
      update: data,
    });

    return NextResponse.json({
      journalEnabled: settings.journalEnabled,
      scalesEnabled: settings.scalesEnabled,
    });
  } catch (err) {
    console.error("POST /api/clinician/settings/[patientId] error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
