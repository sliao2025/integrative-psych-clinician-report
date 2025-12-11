import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { AssessmentReportPDFAdult } from "@/app/components/AssessmentReportPDFAdult";
import { AssessmentReportPDFChild } from "@/app/components/AssessmentReportPDFChild";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 }
    );
  }

  try {
    // Fetch the profile data
    const profileRecord = await prisma.profile.findUnique({
      where: { userId },
      select: { json: true },
    });

    if (!profileRecord || !profileRecord.json) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profile = profileRecord.json as any;

    // Determine if this is a child or adult report
    const isChild = profile.isChild === true;

    // Generate PDF based on profile type
    const PdfComponent = isChild
      ? AssessmentReportPDFChild
      : AssessmentReportPDFAdult;

    const pdfBuffer = await renderToBuffer(
      (<PdfComponent profile={profile} />) as any
    );

    // Return the PDF as a downloadable file - use FirstName_LastName format
    const filename = `Intake_Report_${profile.firstName || "Patient"}_${
      profile.lastName || "Report"
    }.pdf`.replace(/\s+/g, "_");

    // Convert Buffer to Uint8Array for NextResponse compatibility
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
