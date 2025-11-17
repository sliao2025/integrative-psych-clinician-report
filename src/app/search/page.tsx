"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import Garden from "@/app/components/Garden/Garden";
import logo from "@/assets/IP_Logo.png";
import { intPsychTheme } from "@/app/components/theme";
import { DM_Serif_Text, Roboto } from "next/font/google";
import { useState, useEffect } from "react";
import { Search, CalendarDays, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });
const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });

type Patient = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  profile: {
    firstName: string | null;
    lastName: string | null;
    age: string | null;
    json: any;
  } | null;
};

export default function ClinicianHome() {
  const router = useRouter();
  const { data: session } = useSession();
  const name = session?.user?.name ?? "Clinician";
  const email = session?.user?.email ?? "";
  const isAdmin =
    email === "sliao@psych-nyc.com" ||
    email === "rsultan@psych-nyc.com" ||
    email === "yherbst@psych-nyc.com";

  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(false);

  // Admin-only: patient list
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // Fetch all patients for admin
  useEffect(() => {
    if (!isAdmin) return;

    const fetchPatients = async () => {
      try {
        setLoadingPatients(true);
        const res = await fetch("/api/clinician/patients/all", {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) {
          console.error("Failed to fetch patients");
          return;
        }
        const data = await res.json();
        setAllPatients(data.patients || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [isAdmin]);

  // Auto-dismiss error tooltip after 3 seconds
  useEffect(() => {
    if (!showTip) return;
    const t = setTimeout(() => {
      setShowTip(false);
    }, 3000);
    return () => clearTimeout(t);
  }, [showTip]);

  const searchPatient = async () => {
    const full = patientName.trim();
    if (!full) return;

    try {
      setLoading(true);
      setErrorMsg(null);
      setShowTip(false);
      const qs = new URLSearchParams({ name: full }).toString();
      const r = await fetch(`/api/clinician/patients?${qs}`, {
        method: "GET",
        cache: "no-store",
      });
      if (!r.ok) {
        const text = await r.text();
        if (r.status === 400) {
          setErrorMsg("Please enter a full name.");
        } else if (r.status === 401) {
          setErrorMsg("You are not authorized to search.");
        } else if (r.status === 403) {
          setErrorMsg("Patient found, but intake is not completed yet.");
        } else if (r.status === 404) {
          setErrorMsg("No matching patient found. Check spelling and spacing.");
        } else if (r.status >= 500) {
          setErrorMsg("Server error. Please try again in a moment.");
        } else {
          setErrorMsg(`Search failed (${r.status}). ${text || ""}`);
        }
        setShowTip(true);
        return;
      }
      const data = await r.json();
      router.push(`/report/${data.patient.user.id}`);
    } catch (err) {
      console.error("Error searching patient:", err);
      setErrorMsg("Network error. Please try again.");
      setShowTip(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-[100svh] grid place-items-center overflow-hidden px-3 pb-[env(safe-area-inset-bottom)] pt-[calc(env(safe-area-inset-top)+16px)]"
      style={{
        WebkitTapHighlightColor: "transparent",
        background:
          "linear-gradient(to top,rgba(188, 255, 196, 1), rgba(241, 255, 245, 1), rgba(255, 255, 255, 1))",
      }}
    >
      {/* Background visuals */}
      <Garden bloom={0.6} />

      {/* Center card */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-3xl px-4 sm:px-5"
      >
        <div className="rounded-3xl border border-gray-200 bg-white/95 shadow-md backdrop-blur-sm">
          <div className="p-5 sm:p-6 md:p-8">
            {/* Header */}
            <div className="mb-4 flex items-center gap-3">
              <Image
                src={logo}
                alt="Integrative Psych Logo"
                width={64}
                height={64}
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                priority
              />
              <div>
                <h1
                  className={`${dm_serif.className} text-2xl sm:text-3xl font-semibold tracking-tight text-slate-700`}
                >
                  {`Welcome, ${name.split(" ")[0]}`}
                </h1>
                <p className="mt-1 text-[11px] sm:text-sm text-gray-500">
                  Integrative Psych Clinician Report
                </p>
              </div>
            </div>

            {/* Conditional rendering: Admin sees patient list, others see search */}
            {isAdmin ? (
              <div className="space-y-3">
                {loadingPatients ? (
                  <div className="py-8 text-center">
                    <div
                      style={{ borderTopColor: intPsychTheme.secondary }}
                      className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-slate-300 border-t-transparent"
                    ></div>
                    <p className="mt-3 text-sm text-slate-600">
                      Loading patients...
                    </p>
                  </div>
                ) : allPatients.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-500">
                    No patients found
                  </div>
                ) : (
                  <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                    <p className="text-slate-700">{`# of Patients: ${allPatients.length}`}</p>
                    {allPatients.map((patient) => {
                      const profileData = patient.profile?.json || {};
                      const firstName = patient.profile?.firstName || "";
                      const lastName = patient.profile?.lastName || "";
                      const age = patient.profile?.age || "—";
                      const dob = profileData.dob || "—";
                      const pronouns = profileData.pronouns?.[0]?.label || "—";

                      return (
                        <button
                          key={patient.id}
                          onClick={() => router.push(`/report/${patient.id}`)}
                          className="w-full p-4 rounded-xl cursor-pointer border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors text-left group"
                        >
                          <div className="flex items-center gap-3">
                            {/* Profile Picture */}
                            {patient.image ? (
                              <img
                                src={patient.image}
                                alt={`${firstName}'s Profile`}
                                className="h-12 w-12 rounded-full object-cover flex-none"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div
                                style={{
                                  background: intPsychTheme.secondary,
                                }}
                                className="flex h-12 w-12 items-center justify-center rounded-full text-white text-lg font-medium flex-none"
                              >
                                {firstName?.[0] || "P"}
                              </div>
                            )}

                            {/* Patient Info */}
                            <div className="flex-1 min-w-0">
                              <div
                                className={`${dm_serif.className} text-lg font-semibold tracking-tight truncate group-hover:text-slate-900`}
                                style={{ color: intPsychTheme.primary }}
                              >
                                {firstName} {lastName}
                              </div>
                              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
                                <span className="flex items-center gap-1">
                                  <UserIcon className="h-3 w-3" />
                                  Age {age}
                                </span>
                                <span>•</span>
                                <span>{pronouns}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="h-3 w-3" />
                                  {dob}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Search */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-medium text-slate-700">
                    Search Patient
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:flex sm:flex-row sm:gap-3 min-w-0">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Patient Full Name (e.g., Mary Anne Smith)"
                      aria-label="Patient full name"
                      autoComplete="name"
                      className="w-full flex-1 min-w-0 h-12 rounded-xl border border-gray-300 bg-white/70 backdrop-blur px-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") searchPatient();
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 1.5px ${intPsychTheme.secondary}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = "";
                      }}
                    />

                    <button
                      type="button"
                      aria-label="Search patient"
                      className="w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 rounded-full px-4 sm:px-5 font-medium text-white transition-all duration-200 cursor-pointer disabled:opacity-50 sm:mt-0 mt-1.5"
                      style={{
                        background: `linear-gradient(0deg, ${intPsychTheme.primary}, ${intPsychTheme.accent})`,
                        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
                        transition:
                          "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), filter 0.2s",
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform =
                          "scale(1.04)";
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform =
                          "";
                      }}
                      onClick={searchPatient}
                      disabled={loading}
                    >
                      <Search className="h-5 w-5" />
                      <span className="hidden sm:inline">
                        {loading ? "Searching…" : "Search"}
                      </span>
                    </button>
                  </div>

                  {showTip && errorMsg && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="mt-3 w-full rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-rose-700 text-sm shadow-sm"
                    >
                      {errorMsg}
                    </div>
                  )}
                </div>

                <p className="text-[11px] mt-3 sm:text-xs text-slate-600">
                  Tip: Enter the patient's full name exactly as written in the
                  intake (case and spacing).
                </p>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
