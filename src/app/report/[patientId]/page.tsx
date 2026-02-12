"use client";

import PageLoadingSpinner from "@/app/components/PageLoadingSpinner";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  Star,
  BookOpen,
  ClipboardList,
  GraduationCap,
  FileText,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { intPsychTheme, sigmundTheme } from "@/app/components/theme";
import { DM_Serif_Text, DM_Sans } from "next/font/google";
import { usePatientSettings } from "@/app/contexts/PatientSettingsContext";

import Link from "next/link";
import sigmund_logo from "@/assets/Sigmund Chair.png";

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });
const dm_sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

interface PatientData {
  firstName: string;
  lastName: string;
  fullName: string;
}

export default function PatientDashboardPage() {
  const { data: session } = useSession();
  const params = useParams();
  const patientId = params?.patientId as string;
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  // Shared settings from context — stays in sync with sidebar
  const { settings, toggleSetting } = usePatientSettings();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`/api/clinician/patients/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          const patient = data.patient;
          const profile = patient?.profile;

          // Try to get name from profile first, then fallback to user name
          let firstName = profile?.firstName || "";
          let lastName = profile?.lastName || "";

          // If no profile names, try to parse from user.name
          if (!firstName && patient?.name) {
            const nameParts = patient.name.split(" ");
            firstName = nameParts[0] || "Patient";
            lastName = nameParts.slice(1).join(" ") || "";
          }

          setPatientData({
            firstName: firstName || "Patient",
            lastName,
            fullName: `${firstName} ${lastName}`.trim() || "Patient",
          });
        }
      } catch (error) {
        console.error("Failed to load patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const clinicianFirstName = session?.user?.name?.split(" ")[0] || "Doctor";
  const patientFirstName = patientData?.firstName || "Patient";

  if (loading) {
    return <PageLoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className={`p-6 md:p-8 ${dm_sans.className}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Area */}
        <div>
          <h1
            className={`${dm_serif.className} text-3xl sm:text-4xl md:text-5xl mb-2 text-[#1c1917]`}
          >
            Welcome,{" "}
            <span style={{ color: sigmundTheme.accent }}>
              {clinicianFirstName + "!"}
            </span>
          </h1>
          <p className="text-stone-500 text-lg font-medium">
            Ready to review {patientFirstName}'s progress?
          </p>
        </div>

        {/* Main Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hero Card: Patient Journals */}
          <div
            style={{ borderColor: sigmundTheme.border }}
            className="lg:col-span-2 bg-white rounded-2xl border-b-6 border-2 p-1  group hover:border-[#1c1917]/20 transition-all duration-300"
          >
            <div
              style={{ backgroundColor: sigmundTheme.background }}
              className={`rounded-[12px] p-6 h-full relative overflow-hidden flex flex-col sm:flex-row items-center gap-8`}
            >
              {/* Sigmund Image */}
              <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 relative flex-shrink-0">
                <div className="absolute inset-0 bg-[#e7e5e4] rounded-full blur-2xl opacity-50 transform translate-y-4" />
                <Image
                  src={sigmund_logo}
                  alt="Sigmund"
                  fill
                  className="object-contain drop-shadow-md"
                />
              </div>
              <div className="flex-1 relative z-10 w-full flex flex-col items-center sm:items-end text-center sm:text-right">
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-sm font-bold mb-4 border border-[#e7e5e4] text-[#1c1917]">
                  <BookOpen className="w-4 h-4 text-[#1c1917]" />
                  PATIENT JOURNALS
                </div>
                <h2
                  className={`${dm_serif.className} text-2xl sm:text-3xl mb-3 text-[#1c1917]`}
                >
                  Review {patientFirstName}'s Reflections
                </h2>
                <p className="text-[#44403c] text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                  Explore insights from {patientFirstName}'s journal entries to
                  gain a deeper understanding of their progress and emotional
                  states.
                </p>

                <div className="flex justify-end w-full">
                  <Link href={`/report/${patientId}/journals`}>
                    <button
                      style={{
                        backgroundColor: sigmundTheme.secondary,
                        borderColor: sigmundTheme.secondaryDark,
                      }}
                      className="cursor-pointer px-6 py-2.5 text-white rounded-lg text-xs font-bold uppercase tracking-wider border-b-4 hover:translate-y-[-2px] hover:brightness-105 active:translate-y-[2px] active:border-b-0 active:brightness-95 transition-all flex items-center gap-2"
                    >
                      View Journals
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* View Intake Card */}
          <div
            style={{ borderColor: sigmundTheme.border }}
            className="lg:col-span-1 bg-white rounded-2xl border-b-6 border-2 p-6 flex flex-col items-center justify-center text-center gap-4 transition-all group relative overflow-hidden"
          >
            <div
              style={{ backgroundColor: sigmundTheme.background }}
              className="p-5 rounded-2xl mb-2 transition-transform duration-300 shadow-inner"
            >
              <FileText className="w-10 h-10 text-[#57534e]" />
            </div>

            <div className="relative z-10">
              <h3
                className={`${dm_serif.className} text-2xl text-[#1c1917] mb-1`}
              >
                View Intake
              </h3>
              <p className="text-stone-500 font-medium mb-6">
                Access {patientFirstName}'s intake assessment.
              </p>
              <Link href={`/report/${patientId}/intake`}>
                <button
                  style={{
                    color: sigmundTheme.accent,
                    borderColor: sigmundTheme.accent,
                  }}
                  className="w-full cursor-pointer active:brightness-105 hover:scale-102 active:scale-98 bg-white px-6 py-2 rounded-xl font-bold border-2 transition-all"
                >
                  View Intake
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Patient Visibility Settings */}
        <div className="pt-8 border-t border-stone-100">
          <h2
            className={`${dm_serif.className} text-xl text-[#1c1917] mb-6 flex items-center gap-3`}
          >
            <Settings className="w-5 h-5 text-stone-500" />
            Patient Visibility
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Journal Toggle */}
            <div
              style={{ borderColor: sigmundTheme.border }}
              className={`bg-white rounded-2xl border-2 p-6 flex items-center justify-between transition-all duration-300 ${
                settings.journalEnabled
                  ? "border-emerald-200 bg-emerald-50/30"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl transition-colors ${
                    settings.journalEnabled ? "bg-emerald-100" : "bg-stone-100"
                  }`}
                >
                  <BookOpen
                    className={`w-6 h-6 ${
                      settings.journalEnabled
                        ? "text-emerald-600"
                        : "text-stone-400"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[#1c1917]">Journal</h3>
                  <p className="text-sm text-stone-500">
                    {settings.journalEnabled
                      ? "Visible to patient"
                      : "Hidden from patient"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting("journalEnabled")}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                  settings.journalEnabled ? "bg-emerald-500" : "bg-stone-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    settings.journalEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Scales Toggle */}
            <div
              style={{ borderColor: sigmundTheme.border }}
              className={`bg-white rounded-2xl border-2 p-6 flex items-center justify-between transition-all duration-300 ${
                settings.scalesEnabled
                  ? "border-emerald-200 bg-emerald-50/30"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl transition-colors ${
                    settings.scalesEnabled ? "bg-emerald-100" : "bg-stone-100"
                  }`}
                >
                  <ClipboardList
                    className={`w-6 h-6 ${
                      settings.scalesEnabled
                        ? "text-emerald-600"
                        : "text-stone-400"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[#1c1917]">Scales</h3>
                  <p className="text-sm text-stone-500">
                    {settings.scalesEnabled
                      ? "Visible to patient"
                      : "Hidden from patient"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting("scalesEnabled")}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                  settings.scalesEnabled ? "bg-emerald-500" : "bg-stone-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    settings.scalesEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="pt-8 border-t border-stone-100">
          <h2
            className={`${dm_serif.className} text-xl text-stone-400 mb-6 flex items-center gap-3`}
          >
            <Star className="w-5 h-5 text-stone-300" />
            Coming Soon
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 grayscale-[0.5] pointer-events-none select-none">
            {/* Feature 1: Treatment Plan */}
            <div
              className={`bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 p-6 flex flex-col items-center text-center gap-4`}
            >
              <div className="bg-white p-4 rounded-full shadow-sm">
                <ClipboardList className="w-6 h-6 text-stone-400" />
              </div>
              <div>
                <h3 className="font-bold text-stone-600 mb-1">
                  Treatment Plan
                </h3>
                <p className="text-sm text-stone-400">
                  Structured treatment planning and progress tracking.
                </p>
              </div>
            </div>

            {/* Feature 2: Psychoeducation */}
            <div
              className={`bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 p-6 flex flex-col items-center text-center gap-4`}
            >
              <div className="bg-white p-4 rounded-full shadow-sm">
                <GraduationCap className="w-6 h-6 text-stone-400" />
              </div>
              <div>
                <h3 className="font-bold text-stone-600 mb-1">
                  Psychoeducation
                </h3>
                <p className="text-sm text-stone-400">
                  Share evidence-based strategies for mental wellness with
                  patients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
