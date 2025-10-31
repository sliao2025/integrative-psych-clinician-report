"use client";

import React, { useEffect, useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
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
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { DM_Serif_Text } from "next/font/google";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import logo from "@/assets/IP_Logo.png";
import { CenterModal, KV, AudioPlayer } from "./ui";
import { DemographicsHeader } from "./TopBlocks";
import {
  GoalsCard,
  StoryCard,
  SafetyCard,
  AssessmentsCard,
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
  AssessmentsDetail,
  PrevTreatmentDetail,
  StoryDetail,
  DemographicsDetail,
  MedicalHistoryDetail,
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

  const displayName = session?.user?.name ?? "Clinician";
  const clinicianProfilePic = session?.user?.image ?? "";

  const open = (
    title: React.ReactNode,
    content: React.ReactNode,
    maxWidth?: string
  ) => setModal({ title, content, maxWidth });
  const close = () => setModal(null);

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
  console.log(data);
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
          <p className="text-gray-700">Preparing your report…</p>
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
      {/* --- DROP-IN HEADER (paste inside return) --- */}
      <header className="relative sticky top-0 z-50 bg-white border-b border-slate-200/70">
        <div className="mx-auto max-w-[1500px] px-3 sm:px-4 h-12 sm:h-14 md:h-16 flex items-center justify-between">
          {/* Left: Back + Logo + Title */}
          <div className="flex items-center gap-3">
            <Link href="/search" className="group z-10 shrink-0">
              <span
                className="inline-flex border bg-white border-slate-200 items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm transition-all hover:shadow-sm"
                style={{ color: intPsychTheme.primary }}
              >
                <ArrowLeft className="h-4 w-4 transition-transform" />
                Search
              </span>
            </Link>
            <Image
              src={logo}
              alt="Integrative Psych"
              width={36}
              height={36}
              className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 z-10 object-contain"
            />
            <span
              className={`${dm_serif.className} z-10 text-base sm:text-lg md:text-2xl text-slate-800`}
              style={{ color: intPsychTheme.primary }}
            >
              Integrative Psych Clinician Report
            </span>
          </div>

          {/* Right: Profile menu (can overflow) */}
          <div className="z-10 flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border border-gray-200 bg-white/60 backdrop-blur-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                  title={displayName}
                  aria-label="Open profile menu"
                >
                  {clinicianProfilePic ? (
                    <img
                      src={clinicianProfilePic}
                      alt={displayName}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">
                      {(displayName?.[0] ?? "G").toUpperCase()}
                    </span>
                  )}
                </MenuButton>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                  <div className="py-1">
                    <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                      <div className="truncate font-medium text-gray-700">
                        {displayName}
                      </div>
                      <div className="truncate">
                        {session?.user?.email ?? ""}
                      </div>
                    </div>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            signOut({ callbackUrl: "/auth/signin" })
                          }
                          className={`w-full text-left px-3 py-2 text-sm ${
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          Logout
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        </div>
      </header>

      <div
        className="mx-auto max-w-[1400px] px-3 sm:px-4 pt-4 sm:pt-6 pb-16"
        aria-hidden={modal ? true : false}
        inert={modal ? "" : (undefined as any)}
      >
        <DemographicsHeader
          data={data}
          patientDbData={patient}
          onOpen={() =>
            open(
              <>
                <User className="h-4 w-4 inline-block mr-2" />
                Demographics
              </>,
              <DemographicsDetail data={data} />,
              "max-w-3xl"
            )
          }
        />

        <div className="mt-5 columns-1 md:columns-2 gap-4  [column-fill:_balance]">
          <div className="mb-4 break-inside-avoid">
            <GoalsCard
              data={data}
              onOpen={() =>
                open(
                  <>
                    <ClipboardList className="h-4 w-4 inline-block mr-2" />
                    Presenting Goal(s)
                  </>,
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                        Summary
                      </h4>
                      <p className="whitespace-pre-wrap">{data.goals?.text}</p>
                    </div>
                    {data.goals?.audio?.fileName && (
                      <div className="rounded-xl border border-slate-200 p-4">
                        <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                          Audio Recording
                        </h4>
                        <AudioPlayer
                          data={data}
                          fieldName="goals"
                          label="Presenting Goals Recording"
                        />
                      </div>
                    )}
                  </div>
                )
              }
            />
          </div>
          <div className="mb-4 break-inside-avoid">
            <AssessmentsCard
              data={data}
              onOpen={() =>
                open(
                  <>
                    <Activity className="h-4 w-4 inline-block mr-2" />
                    Assessment Details
                  </>,
                  <AssessmentsDetail data={data} />,
                  "max-w-7xl"
                )
              }
            />
          </div>
          <div className="mb-4 break-inside-avoid">
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
              <div className="mb-4 break-inside-avoid">
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

          <div className="mb-4 break-inside-avoid">
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

          <div className="mb-4 break-inside-avoid">
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
            <div className="mb-4 break-inside-avoid">
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
          <div className="mb-4 break-inside-avoid">
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

          <div className="mb-4 break-inside-avoid">
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
          <div className="mb-4 break-inside-avoid">
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
          <div className="mb-4 break-inside-avoid">
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
