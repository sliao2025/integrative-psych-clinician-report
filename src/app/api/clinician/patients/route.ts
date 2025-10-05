import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

/**
 * GET /api/clinician/patients?firstName=First&lastName=Last
 *    or
 * GET /api/clinician/patients?name=First%20Last
 *
 * Matches the **first** patient whose Profile.json contains
 *   { firstName: <exact>, lastName: <exact> }
 * using JSON-path filters. Comparison is exact & case-sensitive.
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const clinicianEmail = session?.user?.email ?? "";

  if (!clinicianEmail || !/@psych-nyc\.com$/i.test(clinicianEmail)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  // Prefer explicit firstName/lastName; otherwise parse from `name`
  let firstName = (searchParams.get("firstName") || "").trim();
  let lastName = (searchParams.get("lastName") || "").trim();

  if ((!firstName || !lastName) && searchParams.get("name")) {
    const tokens = searchParams
      .get("name")!
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (tokens.length >= 2) {
      firstName = firstName || tokens[0];
      lastName = lastName || tokens[tokens.length - 1];
    }
  }

  if (!firstName || !lastName) {
    return NextResponse.json(
      {
        error:
          "Missing 'firstName' and 'lastName' (or 'name') query parameters",
      },
      { status: 400 }
    );
  }

  try {
    // JSON-path exact matching on related Profile.json
    // Uses Prisma JSON path filters: { path: [..], equals: value }
    const patient = await prisma.profile.findFirst({
      where: {
        AND: [
          {
            json: {
              path: "$.firstName",
              equals: firstName,
            },
          },
          {
            json: {
              path: "$.lastName",
              equals: lastName,
            },
          },
        ],
      },
      select: {
        userId: true,
        json: true,
        user: {
          select: {
            id: true,
            intakeFinished: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    if (!patient.user?.intakeFinished) {
      return NextResponse.json(
        { error: "Patient intake not completed" },
        { status: 403 }
      );
    }

    return NextResponse.json({ patient });
  } catch (err) {
    console.error("GET /api/clinician/patients error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
