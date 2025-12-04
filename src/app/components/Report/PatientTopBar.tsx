"use client";

import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { DemographicsHeader } from "./TopBlocks";
import { CenterModal } from "./ui";
import { DemographicsDetail } from "./DetailPanels";
import type { Patient, ProfileJson } from "../types";
import { intPsychTheme } from "../theme";
import { DM_Sans } from "next/font/google";

const dm_sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

interface PatientTopBarProps {
  patientId: string;
}

export default function PatientTopBar({ patientId }: PatientTopBarProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDemographicsModal, setShowDemographicsModal] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/clinician/patients/${patientId}`, {
          method: "GET",
          cache: "no-store",
          credentials: "include",
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
    })();

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!showDemographicsModal) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [showDemographicsModal]);

  const data: ProfileJson = (patient?.profile as any)?.json ?? {};

  if (loading) {
    return (
      <div className={`${dm_sans.className}`}>
        <div className="relative rounded-2xl bg-white p-4 sm:p-6 border border-slate-200 border-b-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-full"
              style={{ background: intPsychTheme.secondary + "40" }}
            />
            <div className="space-y-2">
              <div className="h-6 w-40 bg-slate-200 rounded" />
              <div className="h-4 w-24 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${dm_sans.className}`}>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          <p className="font-medium">Failed to load patient info</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <>
      <div
        className={dm_sans.className}
        aria-hidden={showDemographicsModal}
        inert={showDemographicsModal ? "" : (undefined as any)}
      >
        <DemographicsHeader
          data={data}
          patientDbData={patient}
          onOpen={() => setShowDemographicsModal(true)}
        />
      </div>

      {showDemographicsModal && (
        <CenterModal
          title={
            <>
              <User className="h-4 w-4 inline-block mr-2" />
              Demographics
            </>
          }
          onClose={() => setShowDemographicsModal(false)}
          maxWidth="max-w-3xl"
        >
          <DemographicsDetail data={data} />
        </CenterModal>
      )}
    </>
  );
}
