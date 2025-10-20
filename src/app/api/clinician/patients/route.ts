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
 *
 * Notes:
 *  - Supports multi-word first/last names via trying all possible splits of the provided `name`.
 *  - Matching is still exact (case-sensitive) against Profile.json firstName/lastName.
 *  - Now supports multi-word last names and multi-word first names.
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const clinicianEmail = session?.user?.email ?? "";

  if (!clinicianEmail || !/@psych-nyc\.com$/i.test(clinicianEmail)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Prefer explicit firstName/lastName; otherwise parse from `name`
  // Supports multi-word first or last names (e.g., "Andre van Heerden" or "Mary Anne Smith")
  const { searchParams } = new URL(req.url);

  const rawName = (searchParams.get("name") || "").trim();

  type NamePair = { first: string; last: string };
  const candidates: NamePair[] = [];

  // If a single `name` string is provided, generate split candidates.
  if (rawName) {
    const tokens = rawName.split(/\s+/).filter(Boolean);
    // Generate all possible splits between 1..n-1 (so both multi-word first AND multi-word last are supported).
    // Example: "Andre van Heerden" => ["Andre" | "van Heerden"], ["Andre van" | "Heerden"]
    for (let i = 1; i < tokens.length; i++) {
      const first = tokens.slice(0, i).join(" ");
      const last = tokens.slice(i).join(" ");
      candidates.push({ first, last });
    }
  }
  // De-duplicate candidate pairs while preserving order
  const seen = new Set<string>();
  const namePairs = candidates.filter(({ first, last }) => {
    const key = `${first}:::${last}`;
    if (first && last && !seen.has(key)) {
      seen.add(key);
      return true;
    }
    return false;
  });

  if (namePairs.length === 0) {
    return NextResponse.json(
      {
        error:
          "Missing 'firstName' and 'lastName' (or 'name') query parameters",
      },
      { status: 400 }
    );
  }

  try {
    // Try each name split candidate in order until one matches exactly (case-sensitive)
    let patient: {
      userId: string;
      json: any;
      user: { id: string; intakeFinished: boolean } | null;
    } | null = null;

    for (const pair of namePairs) {
      const match = await prisma.profile.findFirst({
        where: {
          AND: [
            {
              json: {
                path: "$.firstName",
                equals: pair.first,
              },
            },
            {
              json: {
                path: "$.lastName",
                equals: pair.last,
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

      if (match) {
        patient = match;
        break;
      }
    }

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
