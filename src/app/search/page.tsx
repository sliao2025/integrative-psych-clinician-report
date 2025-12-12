"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import Garden from "@/app/components/Garden/Garden";
import logo from "@/assets/IP_Logo.png";
import { intPsychTheme } from "@/app/components/theme";
import { DM_Serif_Text } from "next/font/google";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  CalendarDays,
  User as UserIcon,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Check,
  FileDown,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DM_Sans } from "next/font/google";
import { CLINICIANS } from "@/app/components/text";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });
const dm_sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

type Patient = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  clinician: string | null;
  profile: {
    firstName: string | null;
    lastName: string | null;
    age: string | null;
    json: any;
    firstSubmittedAt: string | null;
  } | null;
};

type SortOption = "date" | "name" | "age";

export default function ClinicianHome() {
  const router = useRouter();
  const { data: session } = useSession();
  const name = session?.user?.name ?? "Clinician";
  const email = session?.user?.email ?? "";

  // Determine if current user is one of the designated clinicians
  const currentClinician = CLINICIANS.find((c) => c.email === email);
  const isRestrictedClinician =
    !!currentClinician && email !== "rsultan@psych-nyc.com";

  // Only these users can download PDFs
  const canDownloadPdf = [
    "sliao@psych-nyc.com",
    "dgray@psych-nyc.com",
    "yherbst@psych-nyc.com",
    "emacmanus@psych-nyc.com",
  ].includes(email);

  const [patientName, setPatientName] = useState("");
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  // Filtering & Sorting state
  const [sortParams, setSortParams] = useState<{
    by: SortOption;
    asc: boolean;
  }>({ by: "date", asc: false });
  const [filterClinician, setFilterClinician] = useState<string>("all");
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);
  const [downloadingPatientId, setDownloadingPatientId] = useState<
    string | null
  >(null);
  const [successPdfPatientId, setSuccessPdfPatientId] = useState<string | null>(
    null
  );

  // Handle PDF download
  const handleDownloadPdf = async (e: React.MouseEvent, patientId: string) => {
    e.stopPropagation(); // Prevent navigation to patient page
    if (downloadingPatientId) return;

    setDownloadingPatientId(patientId);
    setSuccessPdfPatientId(null); // Clear any previous success state
    try {
      const res = await fetch(`/api/pdf/download?userId=${patientId}`);
      if (!res.ok) throw new Error("Failed to download PDF");

      // Extract filename from Content-Disposition header
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = "Intake_Report.pdf";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessPdfPatientId(patientId);
      setTimeout(() => setSuccessPdfPatientId(null), 3000);
    } catch (err) {
      console.error("Error downloading PDF:", err);
    } finally {
      setDownloadingPatientId(null);
    }
  };

  // Fetch all patients on mount
  useEffect(() => {
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

    if (email) {
      fetchPatients();
    }
  }, [email]);

  // Filter and Sort Logic
  const filteredPatients = useMemo(() => {
    let result = [...allPatients];

    // 1. Search Filter (Dynamic as user types)
    if (patientName.trim()) {
      const query = patientName.toLowerCase();
      result = result.filter((p) => {
        const fullName =
          `${p.profile?.firstName} ${p.profile?.lastName}`.toLowerCase();
        return fullName.includes(query);
      });
    }

    // 2. Role-based & Clinician Filter
    if (isRestrictedClinician) {
      // If user is a restricted clinician, ONLY show their own patients
      // Map email to clinician name from CLINICIANS list
      // Note: This relies on exact name matching between DB 'clinician' field and CLINICIANS const
      result = result.filter((p) => p.clinician === currentClinician?.name);
    } else {
      // If regular admin/staff, allow filtering by selected clinician
      if (filterClinician !== "all") {
        result = result.filter((p) => p.clinician === filterClinician);
      }
    }

    // 3. Sorting
    result.sort((a, b) => {
      let valA: any = "";
      let valB: any = "";

      switch (sortParams.by) {
        case "name":
          valA = `${a.profile?.firstName} ${a.profile?.lastName}`.toLowerCase();
          valB = `${b.profile?.firstName} ${b.profile?.lastName}`.toLowerCase();
          break;
        case "age":
          // Convert age to number for sorting, fallback to 0
          valA = parseInt(a.profile?.age || "0", 10);
          valB = parseInt(b.profile?.age || "0", 10);
          break;
        case "date":
        default:
          valA = new Date(a.profile?.firstSubmittedAt || 0).getTime();
          valB = new Date(b.profile?.firstSubmittedAt || 0).getTime();
          break;
      }

      if (valA < valB) return sortParams.asc ? -1 : 1;
      if (valA > valB) return sortParams.asc ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    allPatients,
    patientName,
    isRestrictedClinician,
    currentClinician,
    filterClinician,
    sortParams,
  ]);

  const toggleSort = (option: SortOption) => {
    setSortParams((prev) => ({
      by: option,
      asc: prev.by === option ? !prev.asc : true, // Default to ascending for new sort, toggle otherwise
    }));
  };

  // Scroll indicator logic
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const atTop = el.scrollTop < 10;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    setShowTopArrow(!atTop);
    setShowBottomArrow(!atBottom);
  };

  // Check scroll on resize or content change
  useEffect(() => {
    const el = document.getElementById("patient-list-container");
    if (el) {
      const hasScroll = el.scrollHeight > el.clientHeight;
      if (!hasScroll) {
        setShowTopArrow(false);
        setShowBottomArrow(false);
      } else {
        // Initial check
        const atTop = el.scrollTop < 10;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
        setShowTopArrow(!atTop);
        setShowBottomArrow(!atBottom);
      }
    }
  }, [filteredPatients, loadingPatients]);

  // Prepare options for Listbox
  const clinicianOptions = [
    { value: "all", label: "All Clinicians" },
    ...CLINICIANS.map((c) => ({ value: c.name, label: c.name })),
  ];

  return (
    <main
      className="relative min-h-[100svh] grid place-items-center overflow-hidden px-3 pb-[env(safe-area-inset-bottom)] pt-[calc(env(safe-area-inset-top)+16px)]"
      style={{
        WebkitTapHighlightColor: "transparent",
        background:
          "linear-gradient(to top, rgb(171, 248, 158), rgb(242, 255, 241), rgba(255, 255, 255, 1))",
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
        <div
          className={`rounded-4xl border border-slate-200 border-b-4 bg-white shadow-sm ${dm_sans.className}`}
        >
          <div className="p-5 sm:p-6 md:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
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

            {/* Search & Filter Controls */}
            <div className="space-y-4 mb-6">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search
                    className="h-5 w-5"
                    style={{ color: intPsychTheme.primary }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search patients by name..."
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Clinician Filter (Only for non-restricted users) */}
                {!isRestrictedClinician && (
                  <div className="relative min-w-[200px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <Filter
                        className="h-4 w-4"
                        style={{ color: intPsychTheme.primary }}
                      />
                    </div>
                    <Listbox
                      value={filterClinician}
                      onChange={setFilterClinician}
                    >
                      <div className="relative">
                        <ListboxButton className="block w-full pl-10 pr-8 py-2.5 text-left text-sm text-slate-500 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer">
                          <span className="block truncate">
                            {
                              clinicianOptions.find(
                                (c) => c.value === filterClinician
                              )?.label
                            }
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown
                              className="h-4 w-4 text-slate-400"
                              aria-hidden="true"
                            />
                          </span>
                        </ListboxButton>
                        <ListboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg border border-slate-200  ring-opacity-5 focus:outline-none sm:text-sm">
                          {clinicianOptions.map((option) => (
                            <ListboxOption
                              key={option.value}
                              value={option.value}
                              className={({ active, selected }) =>
                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-blue-50 text-blue-900"
                                    : "text-slate-900"
                                }`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {option.label}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                      <Check
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </div>
                    </Listbox>
                  </div>
                )}

                {/* Sort Options */}
                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: "date", label: "Date" },
                    { id: "name", label: "Name" },
                    { id: "age", label: "Age" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => toggleSort(opt.id as SortOption)}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${
                        sortParams.by === opt.id
                          ? `bg-${intPsychTheme.primary} text-slate-800 border-slate-300 bg-slate-100`
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                      {sortParams.by === opt.id ? (
                        sortParams.asc ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center px-1 mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Patients ({filteredPatients.length})
              </span>
            </div>
            {/* Patient List */}
            <div className="space-y-2">
              {loadingPatients ? (
                <div className="py-12 text-center">
                  <div
                    style={{ borderTopColor: intPsychTheme.secondary }}
                    className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-slate-300 border-t-transparent"
                  ></div>
                  <p className="mt-3 text-sm text-slate-600">
                    Loading patients...
                  </p>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                    <UserIcon
                      className="h-8 w-8"
                      style={{ color: intPsychTheme.accentLight }}
                    />
                  </div>
                  <p className="text-slate-500 font-medium">
                    No patients found
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <div className="relative max-h-[60vh] flex flex-col">
                  {/* Top scroll indicator */}
                  {showTopArrow && (
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10 flex items-start justify-center pointer-events-none">
                      <div className="animate-bounce bg-white p-[2px] rounded-full shadow-md mt-1">
                        <ArrowUp className="h-5 w-5 text-[#0072ce]" />
                      </div>
                    </div>
                  )}

                  <div
                    id="patient-list-container"
                    onScroll={handleScroll}
                    className="overflow-y-auto pr-1 -mr-1 space-y-3 scrollbar-hide pb-8 pt-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {filteredPatients.map((patient) => {
                      const profileData = patient.profile?.json || {};
                      const firstName = patient.profile?.firstName || "";
                      const lastName = patient.profile?.lastName || "";
                      const age = patient.profile?.age || "—";
                      const dob = profileData.dob || "—";
                      const pronouns = profileData.pronouns?.[0]?.label || "—";
                      const clinicianName = patient.clinician || "Unassigned";
                      const submittedDate = patient.profile?.firstSubmittedAt
                        ? new Date(
                            patient.profile.firstSubmittedAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—";

                      return (
                        <button
                          key={patient.id}
                          onClick={() => router.push(`/report/${patient.id}`)}
                          className="w-full p-4 rounded-2xl cursor-pointer border border-slate-200 border-b-4 hover:bg-slate-50 active:border-b-0 active:translate-y-1 transition-all text-left group relative"
                        >
                          <div className="flex items-start gap-4">
                            {/* Profile Picture */}
                            <div className="flex-none">
                              {patient.image ? (
                                <img
                                  src={patient.image}
                                  alt={`${firstName}'s Profile`}
                                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div
                                  style={{
                                    background: intPsychTheme.secondary,
                                  }}
                                  className="flex h-12 w-12 items-center justify-center rounded-full text-white text-lg font-medium shadow-sm"
                                >
                                  {firstName?.[0] || "P"}
                                </div>
                              )}
                            </div>

                            {/* Patient Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <h3
                                    className={`${dm_serif.className} text-lg font-semibold tracking-tight text-slate-800 group-hover:text-slate-900 truncate`}
                                    style={{ color: intPsychTheme.primary }}
                                  >
                                    {firstName} {lastName}
                                  </h3>
                                  {/* Clinician Name Display */}
                                  <div className="text-xs font-medium text-slate-500 mb-1">
                                    Patient of:{" "}
                                    <span className="text-slate-700">
                                      {clinicianName}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
                                <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                                  <UserIcon
                                    className="h-3 w-3"
                                    style={{ color: intPsychTheme.primary }}
                                  />
                                  Age {age}
                                </span>
                                <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                                  <CalendarDays
                                    className="h-3 w-3"
                                    style={{ color: intPsychTheme.primary }}
                                  />
                                  Intake: {submittedDate}
                                </span>
                                <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                                  <CalendarDays
                                    className="h-3 w-3"
                                    style={{ color: intPsychTheme.primary }}
                                  />
                                  DOB: {dob}
                                </span>
                                <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {pronouns}
                                </span>
                              </div>
                            </div>

                            {/* Download PDF Button - only for authorized users */}
                            {canDownloadPdf && (
                              <div className="flex-none self-center relative group/download">
                                <button
                                  onClick={(e) =>
                                    handleDownloadPdf(e, patient.id)
                                  }
                                  disabled={downloadingPatientId === patient.id}
                                  className={
                                    successPdfPatientId === patient.id
                                      ? "bg-green-50 text-green-600 p-2 rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50"
                                      : "p-2 rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50"
                                  }
                                  aria-label="Download Intake PDF"
                                >
                                  {successPdfPatientId === patient.id ? (
                                    <Check className="h-5 w-5" />
                                  ) : downloadingPatientId === patient.id ? (
                                    <Loader2
                                      className="h-5 w-5 animate-spin"
                                      style={{ color: intPsychTheme.primary }}
                                    />
                                  ) : (
                                    <FileDown
                                      className="h-5 w-5"
                                      style={{ color: intPsychTheme.primary }}
                                    />
                                  )}
                                </button>
                                {/* Tooltip - positioned to the left */}
                                <div
                                  className={`absolute text-right right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 text-xs font-medium ${
                                    successPdfPatientId === patient.id
                                      ? "bg-green-50 text-green-600"
                                      : "bg-slate-800 text-white"
                                  } rounded-md opacity-0 invisible group-hover/download:opacity-100 group-hover/download:visible transition-all whitespace-nowrap pointer-events-none z-50`}
                                >
                                  {successPdfPatientId === patient.id ? (
                                    <p>Downloaded</p>
                                  ) : (
                                    <p>Download</p>
                                  )}
                                  <p>Intake</p>
                                  <div
                                    className={`${
                                      successPdfPatientId
                                        ? "border-l-green-50"
                                        : "border-l-slate-800"
                                    } absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent`}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom scroll indicator */}
                  {showBottomArrow && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 flex items-end justify-center pointer-events-none">
                      <div className="animate-bounce bg-white p-[2px] rounded-full shadow-md mb-1">
                        <ArrowDown className="h-5 w-5 text-[#0072ce]" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
