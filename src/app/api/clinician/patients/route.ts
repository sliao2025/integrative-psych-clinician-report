import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

/**
 * GET /api/clinician/patients?name=First%20Last
 *
 * Returns the single most recently matching patient for the signed-in clinician.
 * - Parses the provided `name` into tokens.
 * - If two or more tokens: require both first and last tokens to be present in `User.name` (case-insensitive).
 * - If one token: match `User.name` containing that token (case-insensitive).
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const clinicianEmail = session?.user?.email ?? "";

  if (!clinicianEmail || !/@psych-nyc\.com$/i.test(clinicianEmail)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  // Prefer ?name=... but allow legacy ?firstName=&lastName=
  const rawName =
    searchParams.get("name")?.trim() ||
    [searchParams.get("firstName"), searchParams.get("lastName")]
      .filter(Boolean)
      .join(" ")
      .trim();

  if (!rawName) {
    return NextResponse.json(
      { error: "Missing 'name' query parameter" },
      { status: 400 }
    );
  }

  // Tokenize: collapse multiple spaces and split
  const tokens = rawName
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  // Infer first/last from tokens for stricter matching (first token, last token)
  const firstToken = tokens[0] ?? "";
  const lastToken = tokens.length > 1 ? tokens[tokens.length - 1] : "";
  console.log(firstToken, lastToken);
  let where: {};
  if (firstToken && lastToken) {
    // Require both ends to appear within the single `name` field
    where = {
      AND: [
        { name: { contains: firstToken } },
        { name: { contains: lastToken } },
      ],
    };
  } else {
    // Single token: match anywhere in `name`
    where = {
      name: { contains: firstToken },
    };
  }

  try {
    const patient = await prisma.user.findFirst({
      where,
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
    console.error("GET /api/clinician/patients error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
