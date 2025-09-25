"use client";

// src/app/report/[id]/page.tsx (Client Component)
import { useEffect, useState } from "react";
import Link from "next/link";

type Patient = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  profile: unknown;
};

export default function PatientReport({ params }: { params: { id: string } }) {
  const { id } = params;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/clinician/patients/${id}`, {
          method: "GET",
          cache: "no-store",
          credentials: "include", // send auth cookies automatically
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`${res.status} ${text}`);
        }
        const data = (await res.json()) as { patient: Patient };
        if (!cancelled) setPatient(data.patient);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link href="/search" className="text-blue-600 underline">
          ← Back to search
        </Link>
      </div>
      <h1 className="text-2xl font-semibold mb-4">Patient Report (raw)</h1>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
          Loading patient…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error.includes("401")
            ? "Unauthorized. Please sign in with a psych-nyc.com account."
            : error}
        </div>
      )}

      {!loading && !error && (
        <pre className="rounded-xl border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm">
          {JSON.stringify(patient, null, 2)}
        </pre>
      )}
    </main>
  );
}
