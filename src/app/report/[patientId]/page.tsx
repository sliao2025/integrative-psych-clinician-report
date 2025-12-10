import PatientReportClient from "@/app/components/Report/PatientReportClient";

export default async function Page({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  // Server component simply forwards the route param to the client component.
  // This avoids the new "params is a Promise" warning in client space.
  const { patientId } = await params;
  return <PatientReportClient id={patientId} />;
}
