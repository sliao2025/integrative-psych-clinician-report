import PatientReportClient from "@/app/components/Report/PatientReportClient";

export default function Page({ params }: { params: { id: string } }) {
  // Server component simply forwards the route param to the client component.
  // This avoids the new "params is a Promise" warning in client space.
  const { id } = params;
  return <PatientReportClient id={Array.isArray(id) ? id[0] : id} />;
}
