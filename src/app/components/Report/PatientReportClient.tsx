"use client";

import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Activity,
  BookOpen,
  ShieldAlert,
  Info,
  Users as UsersIcon,
  Pill as PillIcon,
  Syringe,
  Stethoscope,
  FileText,
  HeartPulse,
  Pencil,
  BrainCircuit,
} from "lucide-react";
import { DM_Serif_Text, DM_Sans } from "next/font/google";
import { CenterModal, AudioPlayer } from "./ui";
import { InsightsBlock } from "./TopBlocks";
import {
  GoalsCard,
  StoryCard,
  SafetyCard,
  ScalesCard,
  MedsCard,
  AllergiesCard,
  RelationshipsCard,
  GlanceCard,
  PrevTreatmentCard,
  HospitalizationsCard,
  MedicalHistoryCard,
} from "./Cards";
import {
  SafetyDetail,
  MedsDetail,
  AllergiesDetail,
  HospitalizationsDetail,
  RelationshipsDetail,
  GlanceDetail,
  ScalesDetail,
  PrevTreatmentDetail,
  StoryDetail,
  MedicalHistoryDetail,
  GoalsDetail,
} from "./DetailPanels";
import type { ModalState, Patient, ProfileJson } from "../types";
import { intPsychTheme, theme } from "../theme";

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });
const dm_sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function PatientReportClient({ id }: { id: string }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [highlightField, setHighlightField] = useState<string | null>(null);
  const [highlightText, setHighlightText] = useState<string | null>(null);

  const open = (
    title: React.ReactNode,
    content: React.ReactNode,
    maxWidth?: string,
    fieldToHighlight?: string,
    textToHighlight?: string
  ) => {
    setHighlightField(fieldToHighlight || null);
    setHighlightText(textToHighlight || null);
    setModal({ title, content, maxWidth });
  };
  const close = () => {
    setModal(null);
    setHighlightField(null);
    setHighlightText(null);
  };

  // Lock background scroll when a CenterModal is open (desktop + iOS-safe)
  useEffect(() => {
    if (!modal) {
      return;
    }

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
        console.log(res);
        if (!res.ok) {
          const text = await res.text();
          console.log(text);
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
  console.log(data);
  if (loading) {
    return (
      <div
        className={`fixed inset-0 min-h-[100svh] h-dvh flex items-center justify-center ${dm_sans.className}`}
        style={{ background: intPsychTheme.card, color: theme.text }}
      >
        <div className="animate-pulse text-center">
          <div
            style={{ borderTopColor: intPsychTheme.secondary }}
            className="rounded-full h-12 w-12 mx-auto mb-4 border-4 border-gray-300 border-t-4 border-t-transparent animate-spin"
          />
          <p className="text-gray-700 font-medium">Preparing your report…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`mx-auto max-w-[900px] px-4 py-10 ${dm_sans.className}`}>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          <p className="font-medium">Failed to load patient</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className={`mx-auto max-w-[900px] px-4 py-10 ${dm_sans.className}`}>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <p className="font-medium">No patient found</p>
          <p className="text-sm mt-1">ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`mx-auto max-w-[1600px] xl:max-w-[2000px] px-4 sm:px-6 pb-20 ${dm_sans.className}`}
        aria-hidden={modal ? true : false}
        inert={modal ? "" : (undefined as any)}
      >
        <div className="mt-8 grid grid-cols-1 2xl:grid-cols-12 gap-6 items-start">
          {/* Left Column: Clinical Insights (2XL: col-span-4) */}
          <div className="2xl:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                <BrainCircuit
                  className="w-6 h-6"
                  style={{ color: intPsychTheme.primary }}
                />
              </div>
              <div>
                <h2
                  className={`${dm_serif.className} text-3xl font-normal`}
                  style={{ color: intPsychTheme.primary }}
                >
                  Clinical Insights
                </h2>
                <p className="text-sm text-slate-500">
                  AI-powered analysis and key findings
                </p>
              </div>
            </div>

            <InsightsBlock
              userId={id}
              data={data}
              onNavigate={(field) => {
                // Map field to appropriate modal/card
                const fieldModalMap: Record<string, () => void> = {
                  goals: () =>
                    open(
                      <>
                        <ClipboardList className="h-4 w-4 inline-block mr-2" />
                        Presenting Goal(s)
                      </>,
                      <div
                        className="rounded-[2rem] bg-white overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100"
                        data-field="goals"
                      >
                        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                          <h3 className="text-sm font-semibold text-slate-900">
                            Presenting Goals
                          </h3>
                        </div>
                        <div className="p-4 space-y-4">
                          {/* Audio Response - First */}
                          {data.goals?.audio?.fileName && (
                            <AudioPlayer
                              data={data}
                              fieldName="goals"
                              label=""
                            />
                          )}

                          {/* Written Response - Second */}
                          {data.goals?.text && (
                            <div className="py-2 px-3 bg-slate-50/50 border border-slate-200/60 rounded-lg">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Pencil className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                                <h4 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                                  Written Response
                                </h4>
                              </div>
                              <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                                {data.goals.text}
                              </p>
                            </div>
                          )}

                          {!data.goals?.text &&
                            !data.goals?.audio?.fileName && (
                              <p className="text-[13px] text-slate-400">—</p>
                            )}
                        </div>
                      </div>,
                      undefined,
                      "goals"
                    ),
                  livingSituation: () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                  storyNarrative: () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                  cultureContext: () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                  upbringingEnvironments: () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                  upbringingWhoWith: () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                  childhoodNegativeReason: () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                  familyHistoryElaboration: () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                  // Support both old and new field name formats for followup questions
                  followupQuestion1: () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                  followupQuestion2: () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                  followupQuestion3: () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                  "followupQuestions.question1": () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                  "followupQuestions.question2": () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                  "followupQuestions.question3": () =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} highlightField={field} />,
                      "max-w-6xl",
                      field
                    ),
                };

                const handler = fieldModalMap[field];
                if (handler) {
                  handler();
                }
              }}
            />
          </div>

          {/* Right Column: Patient Details (2XL: col-span-8) */}
          <div className="2xl:col-span-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                <FileText
                  className="w-6 h-6"
                  style={{ color: intPsychTheme.primary }}
                />
              </div>
              <div>
                <h2
                  className={`${dm_serif.className} text-3xl font-normal`}
                  style={{ color: intPsychTheme.primary }}
                >
                  Patient Details
                </h2>
                <p className="text-sm text-slate-500">Full Intake Responses</p>
              </div>
            </div>

            <div className="columns-1 md:columns-2 gap-5 [column-fill:_balance]">
              <div className="mb-4 break-inside-avoid inline-block w-full">
                <SafetyCard
                  data={data}
                  onOpen={() =>
                    open(
                      <>
                        <ShieldAlert className="h-4 w-4 inline-block mr-2" />
                        Suicide Risk
                      </>,
                      <SafetyDetail data={data} />
                    )
                  }
                />
              </div>
              <div className="mb-4 break-inside-avoid inline-block w-full">
                <GoalsCard
                  data={data}
                  onOpen={() =>
                    open(
                      <>
                        <ClipboardList className="h-4 w-4 inline-block mr-2" />
                        Presenting Goal(s)
                      </>,
                      <GoalsDetail data={data} />
                    )
                  }
                />
              </div>
              <div className="mb-4 break-inside-avoid inline-block w-full">
                <ScalesCard
                  data={data}
                  onOpen={() =>
                    open(
                      <>
                        <Activity className="h-4 w-4 inline-block mr-2" />
                        Scale Details
                      </>,
                      <ScalesDetail data={data} />,
                      "max-w-7xl"
                    )
                  }
                />
              </div>
              <div className="mb-4 break-inside-avoid inline-block w-full">
                <StoryCard
                  data={data}
                  onOpen={() =>
                    open(
                      <>
                        <BookOpen className="h-4 w-4 inline-block mr-2" />
                        Story / History
                      </>,
                      <StoryDetail data={data} />,
                      "max-w-6xl"
                    )
                  }
                />
              </div>
              {!data.isChild && (
                <>
                  <div className="mb-4 break-inside-avoid inline-block w-full">
                    <PrevTreatmentCard
                      data={data}
                      onOpen={() =>
                        open(
                          <>
                            <FileText className="h-4 w-4 inline-block mr-2" />
                            Previous Treatment
                          </>,
                          <PrevTreatmentDetail data={data} />
                        )
                      }
                    />
                  </div>
                </>
              )}

              <div className="mb-4 break-inside-avoid inline-block w-full">
                <GlanceCard
                  data={data}
                  onOpen={() =>
                    open(
                      <>
                        <Info className="h-4 w-4 inline-block mr-2" />
                        At a Glance
                      </>,
                      <GlanceDetail data={data} />
                    )
                  }
                />
              </div>
              {data.isChild && (
                <div className="mb-4 break-inside-avoid inline-block w-full">
                  <MedicalHistoryCard
                    data={data}
                    onOpen={() =>
                      open(
                        <>
                          <HeartPulse className="h-4 w-4 inline-block mr-2" />
                          Medical History
                        </>,
                        <MedicalHistoryDetail data={data} />,
                        "max-w-6xl"
                      )
                    }
                  />
                </div>
              )}

              <div className="mb-4 break-inside-avoid inline-block w-full">
                <RelationshipsCard
                  data={data}
                  onOpen={() =>
                    open(
                      <>
                        <UsersIcon className="h-4 w-4 inline-block mr-2" />
                        Relationships
                      </>,
                      <RelationshipsDetail data={data} />
                    )
                  }
                />
              </div>

              <div className="mb-4 break-inside-avoid inline-block w-full">
                <MedsCard
                  data={data}
                  onOpen={() =>
                    open(
                      <>
                        <PillIcon className="h-4 w-4 inline-block mr-2" />
                        Medications
                      </>,
                      <MedsDetail data={data} />
                    )
                  }
                />
              </div>
              <div className="mb-4 break-inside-avoid inline-block w-full">
                <AllergiesCard
                  data={data}
                  onOpen={() =>
                    open(
                      <>
                        <Syringe className="h-4 w-4 inline-block mr-2" />
                        Allergies
                      </>,
                      <AllergiesDetail data={data} />
                    )
                  }
                />
              </div>
              <div className="mb-4 break-inside-avoid inline-block w-full">
                <HospitalizationsCard
                  data={data}
                  onOpen={() =>
                    open(
                      <>
                        <Stethoscope className="h-4 w-4 inline-block mr-2" />
                        Hospitalizations & Injuries
                      </>,
                      <HospitalizationsDetail data={data} />
                    )
                  }
                />
              </div>
            </div>
          </div>
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
    </>
  );
}
