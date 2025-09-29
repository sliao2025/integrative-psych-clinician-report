"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { DM_Serif_Text } from "next/font/google";
import logo from "@/assets/IP_Logo.png";
import { CenterModal, KV } from "./ui";
import { DemographicsHeader } from "./TopBlocks";
import {
  GoalsCard,
  StoryCard,
  SafetyCard,
  AssessmentsCard,
  MedsCard,
  AllergiesCard,
  RelationshipsCard,
  FamilyHistoryCard,
  GlanceCard,
  PrevTreatmentCard,
  HospitalizationsCard,
} from "./Cards";
import {
  SafetyDetail,
  MedsDetail,
  AllergiesDetail,
  HospitalizationsDetail,
  RelationshipsDetail,
  FamilyDetail,
  GlanceDetail,
  AssessmentsDetail,
} from "./DetailPanels";
import type { ModalState, Patient, ProfileJson } from "../types";
import { intPsychTheme, theme } from "../theme";
import Garden from "../Garden/Garden";
const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });

export default function PatientReportClient({ id }: { id: string }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const { data: session } = useSession();

  console.log(session?.user?.image);
  const displayName = session?.user?.name ?? "Clinician";
  const clinicianProfilePic = session?.user?.image ?? "";

  const open = (title: string, content: React.ReactNode, maxWidth?: string) =>
    setModal({ title, content, maxWidth });
  const close = () => setModal(null);

  // Lock background scroll when a CenterModal is open (desktop + iOS-safe)
  useEffect(() => {
    if (!modal) {
      // restore
      const top = (document.body.style.top || "0").replace("px", "");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (top) {
        const y = -parseInt(top, 10) || 0;
        window.scrollTo(0, y);
      }
      return;
    }

    // lock
    const scrollY = window.scrollY;
    document.body.style.position = "fixed"; // prevents scroll on most browsers
    document.body.style.top = `-${scrollY}px`; // preserve scroll position
    document.body.style.width = "100%"; // avoid layout shift
    document.body.style.overflow = "hidden"; // belt-and-suspenders

    return () => {
      const top = (document.body.style.top || "0").replace("px", "");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (top) {
        const y = -parseInt(top, 10) || 0;
        window.scrollTo(0, y);
      }
    };
  }, [modal]);
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/clinician/patients/${id}`, {
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
  }, [id]);

  const data: ProfileJson = (patient?.profile as any)?.json ?? {};

  if (loading) {
    return (
      <div
        className="fixed inset-0 min-h-[100svh] h-dvh flex items-center justify-center"
        style={{ background: intPsychTheme.card, color: theme.text }}
      >
        <div className="animate-pulse text-center">
          <div
            style={{ borderTopColor: intPsychTheme.secondary }}
            className="rounded-full h-12 w-12 mx-auto mb-4 border-4 border-gray-300 border-t-4 border-t-transparent animate-spin"
          />
          <p className="text-gray-700">{`Preparing your report…`}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[900px] px-4 py-10">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          <p className="font-medium">Failed to load patient</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="mx-auto max-w-[900px] px-4 py-10">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <p className="font-medium">No patient found</p>
          <p className="text-sm mt-1">ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-slate-200/70">
        <div className="mx-auto max-w-[1500px] px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/search" className="group">
              <span
                className="inline-flex border border-slate-200 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm shadow-sm hover:bg-slate-100/30 transition-all hover:shadow-md"
                style={{
                  color: intPsychTheme.secondary,
                }}
              >
                <ArrowLeft className="h-4 w-4 transition-transform" />
              </span>
            </Link>
            <Image
              src={logo}
              alt="Integrative Psych"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span
              className={`${dm_serif.className} text-xl md:text-2xl text-slate-800`}
              style={{ color: intPsychTheme.primary }}
            >
              Integrative Psych Clinician Report
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-700 hidden sm:block">
              {displayName}
            </span>
            {clinicianProfilePic ? (
              <img
                src={clinicianProfilePic}
                alt={displayName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border border-slate-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-slate-300" />
            )}
          </div>
        </div>
      </header>

      <div
        className="mx-auto max-w-[1500px] px-4 pt-6 pb-12"
        aria-hidden={modal ? true : false}
        inert={modal ? "" : (undefined as any)}
      >
        {/* <Garden bloom={1} /> */}
        <DemographicsHeader
          data={data}
          patientDbData={patient}
          onOpen={() =>
            open(
              "Demographics",
              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <KV
                  label="Name"
                  value={`${data.firstName} ${data.lastName}`}
                  truncate={false}
                />
                <KV
                  label="Pronouns"
                  value={data.pronouns?.[0]?.label}
                  truncate={false}
                />
                <KV label="Age" value={data.age} truncate={false} />
                <KV
                  label="DOB"
                  value={
                    data.dob ? new Date(data.dob).toLocaleDateString() : "—"
                  }
                />
                <KV label="Phone" value={data.contactNumber} />
                <KV label="Email" value={data.email} />
                <KV label="Sex" value="Male" />
                <KV label="Gender identity" value="Cis male" truncate={false} />
                <KV
                  label="Ethnicity"
                  value={data.ethnicity?.map((e: any) => e.label).join(", ")}
                  truncate={false}
                />
                <KV
                  label="Religion"
                  value={data.religion?.map((r: any) => r.label).join(", ")}
                  truncate={false}
                />
                <KV
                  label="Marital"
                  value={data.isMarried ? "Married" : "Single"}
                  truncate={false}
                />
                <KV
                  label="Employment"
                  value={data.isEmployed ? "Employed" : "Unemployed"}
                  truncate={false}
                />
                <KV
                  label="Height"
                  value={`${data.height?.feet || 0}'${
                    data.height?.inches || 0
                  }"`}
                  truncate={false}
                />
                <KV
                  label="Weight"
                  value={data.weightLbs ? `${data.weightLbs} lb` : "—"}
                  truncate={false}
                />
              </div>
            )
          }
        />

        <div className="mt-5 grid grid-cols-12 gap-4 md:gap-5">
          <div className="col-span-12 md:col-span-6">
            <GoalsCard
              data={data}
              className="h-[320px]"
              onOpen={() =>
                open(
                  "Presenting Goal(s)",
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                        Summary
                      </h4>
                      <p className="whitespace-pre-wrap">{data.goals?.text}</p>
                    </div>
                  </div>
                )
              }
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <AssessmentsCard
              data={data}
              className="h-[320px]"
              onOpen={() =>
                open("Assessment Details", <AssessmentsDetail data={data} />)
              }
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <StoryCard
              data={data}
              className="h-[320px]"
              onOpen={() =>
                open(
                  "Story / History",
                  <div className="space-y-4">
                    {[
                      ["Story", data.storyNarrative?.text],
                      ["Living Situation", data.livingSituation?.text],
                      [
                        "Upbringing Environments",
                        data.upbringingEnvironments?.text,
                      ],
                      [
                        "Who the patient grew up with",
                        data.upbringingWhoWith?.text,
                      ],
                      ["Cultural / Context", data.cultureContext?.text],
                    ].map(([title, body], i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <h4 className="mb-2 text-md font-semibold text-slate-900">
                          {title}
                        </h4>
                        <p className="whitespace-pre-wrap">{body as string}</p>
                      </div>
                    ))}
                  </div>
                )
              }
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <GlanceCard
              data={data}
              className="h-[320px]"
              onOpen={() => open("At a Glance", <GlanceDetail data={data} />)}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <PrevTreatmentCard
              data={data}
              onOpen={() =>
                open(
                  "Previous Treatment",
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="whitespace-pre-wrap">
                      {data.prevTreatmentSummary?.text}
                    </p>
                  </div>
                )
              }
              className="h-[150px]"
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <RelationshipsCard
              data={data}
              onOpen={() =>
                open("Relationships", <RelationshipsDetail data={data} />)
              }
              className="h-[150px]"
            />
          </div>
          <div className="col-span-6 md:col-span-3">
            <SafetyCard
              data={data}
              onOpen={() => open("Risk & Safety", <SafetyDetail data={data} />)}
              className="h-[100px]"
            />
          </div>
          <div className="col-span-6 md:col-span-3">
            <MedsCard
              data={data}
              onOpen={() => open("Medications", <MedsDetail data={data} />)}
              className="h-[100px]"
            />
          </div>
          <div className="col-span-6 md:col-span-3">
            <AllergiesCard
              data={data}
              onOpen={() => open("Allergies", <AllergiesDetail data={data} />)}
              className="h-[100px]"
            />
          </div>

          <div className="col-span-6 md:col-span-3">
            <HospitalizationsCard
              data={data}
              onOpen={() =>
                open(
                  "Past Hospitalizations",
                  <HospitalizationsDetail data={data} />
                )
              }
              className="h-[100px]"
            />
          </div>
        </div>

        {modal && (
          <CenterModal
            title={modal.title}
            onClose={close}
            maxWidth={modal.maxWidth}
          >
            {modal.content}
          </CenterModal>
        )}
      </div>
    </>
  );
}
