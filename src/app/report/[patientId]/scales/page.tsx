"use client";

import React, { useState, useEffect, use } from "react";
import {
  ClipboardList,
  Plus,
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronDown,
  Check,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Hourglass,
  ClipboardCheck,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { intPsychTheme, sigmundTheme } from "@/app/components/theme";
import { usePatientSettings } from "@/app/contexts/PatientSettingsContext";
import { DM_Serif_Text, DM_Sans } from "next/font/google";
import Drawer from "@/app/components/Drawer";
import ScaleDetailDrawer from "@/app/components/ScaleDetailDrawer";
import { Gauge, Checkbox } from "@/app/components/Report/ui";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import YMRSForm from "@/app/components/Scales/Adult/YMRSForm";
import YBOCSForm from "@/app/components/Scales/Adult/YBOCSForm";
import HAMAForm from "@/app/components/Scales/Adult/HAMAForm";
import HAMDForm from "@/app/components/Scales/Adult/HAMDForm";
import BPRSForm from "@/app/components/Scales/Adult/BPRSForm";
import { SetAActions } from "@/app/lib/types";
import { getMDQSeverity } from "@/app/lib/utils";
import useSound from "use-sound";

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });
const dm_sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

interface Scale {
  id: string;
  assessmentType: string;
  totalScore: number | null;
  completedAt: string | null;
  requestedBy: string | null;
  dueDate: string | null;
  assignedAt?: string | null;
  responses: Record<string, any>;
  severity: string | null;
  canPatientView?: boolean | null;
}

const ASSIGNABLE_SCALE_TYPES = [
  { value: "phq9", label: "PHQ-9 (Depression)" },
  { value: "gad7", label: "GAD-7 (Anxiety)" },
  { value: "pss4", label: "PSS-4 (Stress)" },
  { value: "ptsd", label: "PC-PTSD-5 (Trauma)" },
  { value: "asrs5", label: "ASRS-5 (ADHD)" },
  { value: "aceResilience", label: "Ace Resilience" },
  { value: "crafft", label: "CRAFFT (Substance Use)" },
  { value: "selfHarm", label: "Self Harm" },
  { value: "aq10", label: "AQ-10 (Autism)" },
  { value: "mdq", label: "MDQ (Bipolar)" },
];

const CLINICIAN_SCALE_TYPES = [
  { value: "ymrs", label: "YMRS (Mania)" },
  { value: "ybocs", label: "YBOCS (OCD)" },
  { value: "hama", label: "HAM-A (Anxiety)" },
  { value: "hamd", label: "HAM-D (Depression)" },
  { value: "bprs", label: "BPRS (Psychosis)" },
];

const SCALE_TYPES = [...ASSIGNABLE_SCALE_TYPES, ...CLINICIAN_SCALE_TYPES];

export default function ScalesPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  const { settings, toggleSetting } = usePatientSettings();
  const [scales, setScales] = useState<Scale[]>([]);
  const [pendingScales, setPendingScales] = useState<Scale[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedType, setSelectedType] = useState(
    ASSIGNABLE_SCALE_TYPES[0].value,
  );
  const [selectedClinicianType, setSelectedClinicianType] = useState(
    CLINICIAN_SCALE_TYPES[0].value,
  );
  const [dueDate, setDueDate] = useState("");
  const [selectedScale, setSelectedScale] = useState<Scale | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [administerSuccessMessage, setAdministerSuccessMessage] = useState<
    string | null
  >(null);

  // Administration State
  const [administeringType, setAdministeringType] = useState<string | null>(
    null,
  );
  const [assessmentData, setAssessmentData] = useState<any>({
    assessments: { kind: "adult", data: {} },
  });
  const [submitting, setSubmitting] = useState(false);
  const [playComplete] = useSound("/sfx/neutral-positive-button-click.wav");

  // setA helper
  const setA: SetAActions = (mutate) => {
    setAssessmentData((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      mutate(next);
      return next;
    });
  };

  const handleAdministerSubmit = async () => {
    if (!administeringType) return;
    setSubmitting(true);
    try {
      // Calculate score
      const data = assessmentData.assessments.data[administeringType] || {};
      const score = Object.values(data).reduce(
        (acc: number, val: any) => acc + (parseInt(val) || 0),
        0,
      );

      const res = await fetch(`/api/clinician/scales/${patientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentType: administeringType,
          responses: { [administeringType]: data },
          totalScore: score,
        }),
      });

      if (res.ok) {
        setAdministerSuccessMessage("Assessment submitted successfully");
        setAdministeringType(null); // Close drawer
        setAssessmentData({
          assessments: { kind: "adult", data: {} },
        }); // Reset
        setTimeout(() => setAdministerSuccessMessage(null), 3000);
      } else {
        console.error("Failed to submit assessment");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtering state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState<
    "all" | "visible" | "hidden"
  >("all");
  const [updatingVisibility, setUpdatingVisibility] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchScales();
  }, [patientId, successMessage, administerSuccessMessage]);

  const fetchScales = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/clinician/scales/${patientId}`);
      if (res.ok) {
        const data = await res.json();
        setScales(data.scales || []);
        setPendingScales(data.pendingScales || []);
      }
    } catch (error) {
      console.error("Failed to fetch scales", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendScale = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/clinician/scales/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          assessmentType: selectedType,
          dueDate: dueDate || null,
        }),
      });

      if (res.ok) {
        setSuccessMessage("Scale assigned successfully");
        setDueDate("");
        // Optionally refresh list if we were showing pending scales
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        console.error("Failed to send scale");
      }
    } catch (error) {
      console.error("Error sending scale", error);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSeverityColor = (severity?: string | null) => {
    if (!severity) return "bg-stone-100 text-stone-700 border-stone-200";
    const s = severity.toLowerCase();
    if (s.includes("severe") || s.includes("high"))
      return "bg-rose-50 text-rose-700 border-rose-200";
    if (s.includes("moderate"))
      return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const getMaxScore = (type: string): number => {
    const maxScores: Record<string, number> = {
      phq9: 27,
      gad7: 21,
      pss4: 16,
      ptsd: 5,
      asrs5: 20,
      aceResilience: 56,
      aceresilience: 56,
      crafft: 6,
      selfHarm: 2,
      selfharm: 2,
      aq10: 10,
      mdq: 13,
      ymrs: 60,
      ybocs: 40,
      hama: 56,
      hamd: 52,
      bprs: 126,
    };
    return maxScores[type] || 100;
  };

  const getScaleLabel = (type: string): string => {
    const labels: Record<string, string> = {
      phq9: "PHQ-9",
      gad7: "GAD-7",
      pss4: "PSS-4",
      ptsd: "PC-PTSD-5",
      asrs5: "ASRS-5",
      aceResilience: "Ace Resilience",
      aceresilience: "Ace Resilience",
      crafft: "CRAFFT",
      selfHarm: "Self Harm",
      selfharm: "Self Harm",
      aq10: "AQ-10",
      mdq: "MDQ",
      ymrs: "YMRS",
      ybocs: "YBOCS",
      hama: "HAM-A",
      hamd: "HAM-D",
      bprs: "BPRS",
    };
    return labels[type] || type.toUpperCase();
  };

  const getScaleCaption = (type: string): string => {
    const captions: Record<string, string> = {
      phq9: "0–4 minimal · 5–9 mild · 10–14 moderate · 15–19 moderately severe · 20-27 severe",
      gad7: "0–4 minimal · 5–9 mild · 10–14 moderate · 15–21 severe",
      pss4: "higher = more stress",
      ptsd: "Count of 'Yes' responses",
      asrs5: ">14 = possible ADHD symptoms · <14 = ADHD less likely",
      aceResilience: "higher = more resilience",
      aceresilience: "higher = more resilience",
      crafft: "2+ yes = high risk",
      selfHarm: "any yes = positive",
      selfharm: "any yes = positive",
      aq10: "6+ = consider referral",
      mdq: "7+ symptoms & impact = positive",
      ymrs: "higher = more severe mania",
      ybocs:
        "0–7 subclinical · 8–15 mild · 16–23 moderate · 24–31 severe · 32–40 extreme",
      hama: "<17 mild · 18–24 mild to moderate · 25–30 moderate to severe · 31–56 severe to very severe",
      hamd: "0–7 no depression · 8–16 mild · 17–23 moderate · ≥24 severe",
      bprs: "Higher score = more severe pathology",
    };
    return captions[type] || "";
  };

  const filteredScales = scales.filter((scale) => {
    const scaleDate = scale.completedAt ? new Date(scale.completedAt) : null;
    const matchesType =
      filterType === "all" ||
      scale.assessmentType.toLowerCase() === filterType.toLowerCase();
    const matchesStartDate =
      !startDate || (scaleDate && scaleDate >= new Date(startDate));
    const matchesEndDate =
      !endDate || (scaleDate && scaleDate <= new Date(endDate));
    const matchesVisibility =
      filterVisibility === "all" ||
      (filterVisibility === "visible" && scale.canPatientView) ||
      (filterVisibility === "hidden" && !scale.canPatientView);

    return (
      matchesType && matchesStartDate && matchesEndDate && matchesVisibility
    );
  });

  const handleToggleVisibilityFromList = async (
    scaleId: string,
    currentValue: boolean | undefined | null,
  ) => {
    setUpdatingVisibility(scaleId);
    try {
      const res = await fetch(`/api/clinician/scales/${patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: scaleId,
          canPatientView: !currentValue,
        }),
      });
      if (res.ok) {
        setScales((prev) =>
          prev.map((s) =>
            s.id === scaleId ? { ...s, canPatientView: !currentValue } : s,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
    } finally {
      setUpdatingVisibility(null);
    }
  };

  return (
    <div
      className={`mx-auto max-w-[1600px] xl:max-w-[2000px] px-4 sm:px-6 pb-20 ${dm_sans.className}`}
    >
      <div className="mt-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center">
              <ClipboardList
                className="w-6 h-6"
                style={{ color: sigmundTheme.accent }}
              />
            </div>
            <div>
              <h2
                className={`${dm_serif.className} text-3xl font-normal`}
                style={{ color: sigmundTheme.accent }}
              >
                Scales
              </h2>
              <p className="text-sm text-stone-500">
                Assign new scales and view patient history
              </p>
            </div>
          </div>
          {/* Patient Visibility Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-stone-400">
              {settings.scalesEnabled
                ? "Visible to patient"
                : "Hidden from patient"}
            </span>
            <button
              type="button"
              onClick={() => toggleSetting("scalesEnabled")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                settings.scalesEnabled ? "bg-emerald-500" : "bg-stone-300"
              }`}
              title={`Patient can${settings.scalesEnabled ? "" : "not"} see Scales`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  settings.scalesEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Pending & Completed Scales */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pending Scales Section */}
            {pendingScales.length > 0 && (
              <div className="rounded-2xl bg-white border border-stone-200 border-b-4 overflow-hidden">
                <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 border-1 border-stone-200 rounded-md">
                      <Hourglass
                        style={{ color: sigmundTheme.secondary }}
                        className="w-5 h-5"
                      />
                    </div>
                    <h3
                      className={`${dm_serif.className} text-xl`}
                      style={{ color: sigmundTheme.accent }}
                    >
                      Pending Scales
                    </h3>
                  </div>
                  <span className="text-sm font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200  ">
                    {pendingScales.length} Awaiting Completion
                  </span>
                </div>

                <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto scrollbar-visible">
                  {pendingScales.map((scale) => {
                    const isOverdue =
                      scale.dueDate && new Date(scale.dueDate) < new Date();
                    return (
                      <div
                        key={scale.id}
                        className="p-6 hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold text-stone-700 tracking-wide text-lg">
                                {getScaleLabel(scale.assessmentType)}
                              </span>
                              {isOverdue && (
                                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-700 border border-rose-200 whitespace-nowrap">
                                  <AlertCircle className="w-3 h-3" />
                                  Overdue
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-stone-600">
                              {scale.assignedAt && (
                                <span
                                  style={{
                                    backgroundColor: sigmundTheme.primaryLight,
                                  }}
                                  className="flex rounded-full px-2 py-1 items-center gap-1 whitespace-nowrap"
                                >
                                  <Send className="w-3 h-3" />
                                  Assigned {formatDate(scale.assignedAt)}
                                </span>
                              )}
                              {scale.dueDate && (
                                <span
                                  style={{
                                    backgroundColor: sigmundTheme.primaryLight,
                                  }}
                                  className={`flex rounded-full px-2 py-1 items-center gap-1 whitespace-nowrap ${
                                    isOverdue ? "text-rose-600 font-medium" : ""
                                  }`}
                                >
                                  <CalendarIcon className="w-3 h-3" />
                                  Due {formatDate(scale.dueDate)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-stone-500 px-3 py-1.5 rounded-full border border-stone-200 whitespace-nowrap">
                              Awaiting Patient Response
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Scales Section */}
            <div className="rounded-2xl bg-white border border-stone-200 border-b-4 overflow-hidden">
              <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 border-1 border-stone-200 rounded-md">
                    <ClipboardCheck
                      style={{ color: sigmundTheme.secondary }}
                      className="w-5 h-5"
                    />
                  </div>
                  <h3
                    className={`${dm_serif.className} text-xl`}
                    style={{ color: sigmundTheme.accent }}
                  >
                    Completed Scales
                  </h3>
                </div>
                <span className="text-sm font-medium text-stone-500 bg-white px-3 py-1 rounded-full border border-stone-200  ">
                  {filteredScales.length}{" "}
                  {filteredScales.length === 1 ? "Scale" : "Scales"}
                </span>
              </div>

              {/* Filter Bar */}
              <div className="p-4 bg-stone-50/30 border-b border-stone-100 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Scale:
                  </span>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="text-xs font-medium bg-white border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-300"
                  >
                    <option value="all">All Scales</option>
                    {SCALE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {getScaleLabel(type.value)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    From:
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-xs font-medium bg-white border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    To:
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-xs font-medium bg-white border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Visibility:
                  </span>
                  <select
                    value={filterVisibility}
                    onChange={(e) =>
                      setFilterVisibility(
                        e.target.value as "all" | "visible" | "hidden",
                      )
                    }
                    className="text-xs font-medium bg-white border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-300"
                  >
                    <option value="all">All</option>
                    <option value="visible">Visible to Patient</option>
                    <option value="hidden">Hidden from Patient</option>
                  </select>
                </div>

                {(filterType !== "all" ||
                  startDate ||
                  endDate ||
                  filterVisibility !== "all") && (
                  <button
                    onClick={() => {
                      setFilterType("all");
                      setStartDate("");
                      setEndDate("");
                      setFilterVisibility("all");
                    }}
                    className="text-[10px] bg-red-50 hover:bg-red-100 cursor-pointer p-2 rounded-full font-bold text-rose-500 uppercase tracking-wider hover:text-rose-600 ml-auto"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {loading ? (
                <div className="p-12 flex justify-center">
                  <div
                    style={{ borderTopColor: intPsychTheme.secondary }}
                    className="rounded-full h-12 w-12 mx-auto border-4 border-gray-300 border-t-4 border-t-transparent animate-spin"
                  ></div>
                </div>
              ) : filteredScales.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-stone-400" />
                  </div>
                  <h4 className="text-lg font-medium text-stone-900 mb-1">
                    No matching scales
                  </h4>
                  <p className="text-stone-500">Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto scrollbar-visible">
                  {filteredScales.map((scale) => (
                    <button
                      key={scale.id}
                      onClick={() =>
                        setSelectedScale({
                          ...scale,
                          severity:
                            scale.severity ||
                            (scale.assessmentType === "mdq"
                              ? getMDQSeverity(scale.responses)
                              : scale.severity),
                        })
                      }
                      className="w-full cursor-pointer text-left p-6 hover:bg-stone-50 transition-colors group"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Left: Gauge and Meta Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
                            <span className="text-xs border border-stone-200 p-2 rounded-lg text-stone-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {scale.completedAt
                                ? formatDate(scale.completedAt)
                                : "—"}
                            </span>
                            {/* Visibility Checkbox */}
                            <div onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={!!scale.canPatientView}
                                onChange={() =>
                                  handleToggleVisibilityFromList(
                                    scale.id,
                                    scale.canPatientView,
                                  )
                                }
                                label="Patient Visibility"
                                color="#10b981"
                                uncheckedColor="#ef4444"
                                loading={updatingVisibility === scale.id}
                                icon={
                                  scale.canPatientView ? (
                                    <Eye className="w-4 h-4" />
                                  ) : (
                                    <EyeOff className="w-4 h-4" />
                                  )
                                }
                                cursor="default"
                              />
                            </div>
                          </div>

                          {/* Gauge Visualization */}
                          {scale.totalScore !== null &&
                            scale.assessmentType !== "mdq" && (
                              <div className="max-w">
                                <Gauge
                                  label={getScaleLabel(scale.assessmentType)}
                                  score={scale.totalScore}
                                  max={getMaxScore(scale.assessmentType)}
                                  caption={getScaleCaption(
                                    scale.assessmentType,
                                  )}
                                  showTicker={true}
                                />
                              </div>
                            )}

                          {scale.assessmentType === "mdq" &&
                            (scale.severity ||
                              getMDQSeverity(scale.responses)) && (
                              <div className="flex w-full flex-col">
                                <div className="mb-1 flex items-center justify-between">
                                  <p className="text-lg sm:text-xl font-bold text-stone-700">
                                    {getScaleLabel(scale.assessmentType)}
                                  </p>
                                  <div>
                                    <span
                                      className={`text-xl font-bold ${
                                        (scale.severity ||
                                          getMDQSeverity(scale.responses)) ===
                                        "Positive"
                                          ? "text-rose-700"
                                          : "text-emerald-700"
                                      }`}
                                    >
                                      {scale.severity ||
                                        getMDQSeverity(scale.responses)}{" "}
                                      Screen
                                    </span>
                                  </div>
                                </div>
                                <p className="mt-1 text-[12px] text-stone-500">
                                  Positive Screen: 7+ symptoms (Q1) AND Yes to
                                  Q2 AND Moderate/Serious Problem (Q3)
                                </p>
                              </div>
                            )}

                          {scale.totalScore === null && (
                            <div className="text-sm text-stone-500">
                              No score available
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            {/* Assign Scale Card */}
            <div className="relative lg:sticky top-24 space-y-6 z-30">
              <div className="rounded-2xl bg-white border border-stone-200 border-b-4 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 border-1 border-stone-200 rounded-md">
                    <Send
                      style={{ color: sigmundTheme.secondary }}
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3
                      className={`${dm_serif.className} text-xl`}
                      style={{ color: sigmundTheme.accent }}
                    >
                      Assign Scale
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      For patients to complete
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSendScale} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Scale Type
                    </label>
                    <Listbox value={selectedType} onChange={setSelectedType}>
                      <div className="relative">
                        <ListboxButton className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-3 pr-10 text-left text-sm text-stone-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
                          <span className="block truncate">
                            {
                              SCALE_TYPES.find((t) => t.value === selectedType)
                                ?.label
                            }
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown
                              className="h-4 w-4 text-stone-400"
                              aria-hidden="true"
                            />
                          </span>
                        </ListboxButton>
                        <ListboxOptions className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg border border-stone-200 ring-opacity-5 focus:outline-none sm:text-sm">
                          {ASSIGNABLE_SCALE_TYPES.map((type) => (
                            <ListboxOption
                              key={type.value}
                              value={type.value}
                              className={({ active, selected }) =>
                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-blue-50 text-blue-900"
                                    : "text-stone-900"
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
                                    {type.label}
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

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Due Date (Optional)
                    </label>
                    <div className="relative">
                      {/* <CalendarIcon className="absolute left-3 top-1/2 -transtone-y-1/2 w-4 h-4 text-stone-500" /> */}
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-3 pr-3 text-sm text-stone-900 focus:border-blue-500 focus:ring-blue-500 placeholder-stone-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      backgroundColor: sigmundTheme.secondary,
                      borderColor: sigmundTheme.secondaryDark,
                    }}
                    onClick={() => playComplete()}
                    className="w-full cursor-pointer flex items-center border-b-4 justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium hover:brightness-105 active:border-b-0 active:transtone-y-[2px] hover:transtone-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      "Sending..."
                    ) : (
                      <>
                        Assign to Patient
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {successMessage && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {successMessage}
                    </div>
                  )}
                </form>
              </div>
              {/* Administer Scale Card */}
              <div className="rounded-2xl bg-white border border-stone-200 border-b-4 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 border-1 border-stone-200 rounded-md">
                    <ClipboardList
                      style={{ color: sigmundTheme.secondary }}
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3
                      className={`${dm_serif.className} text-xl`}
                      style={{ color: sigmundTheme.accent }}
                    >
                      Administer Scale
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      Clinician administered, not patient facing
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Scale Type
                    </label>
                    <Listbox
                      value={selectedClinicianType}
                      onChange={setSelectedClinicianType}
                    >
                      <div className="relative">
                        <ListboxButton className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-3 pr-10 text-left text-sm text-stone-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
                          <span className="block truncate">
                            {
                              CLINICIAN_SCALE_TYPES.find(
                                (t) => t.value === selectedClinicianType,
                              )?.label
                            }
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown
                              className="h-4 w-4 text-stone-400"
                              aria-hidden="true"
                            />
                          </span>
                        </ListboxButton>
                        <ListboxOptions className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg border border-stone-200 ring-opacity-5 focus:outline-none sm:text-sm">
                          {CLINICIAN_SCALE_TYPES.map((type) => (
                            <ListboxOption
                              key={type.value}
                              value={type.value}
                              className={({ active, selected }) =>
                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-blue-50 text-blue-900"
                                    : "text-stone-900"
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
                                    {type.label}
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

                  <button
                    onClick={() => {
                      setAdministeringType(selectedClinicianType);
                    }}
                    style={{
                      backgroundColor: sigmundTheme.accent,
                      borderColor: sigmundTheme.accentDark,
                    }}
                    className="w-full cursor-pointer flex items-center border-b-4 border-orange-300/90 justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium hover:brightness-115 active:border-b-0 active:transtone-y-[2px] hover:transtone-y-[-2px] transition-all"
                  >
                    Begin Evaluation
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {administerSuccessMessage && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {administerSuccessMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <Drawer isOpen={!!selectedScale} onClose={() => setSelectedScale(null)}>
        {selectedScale && (
          <ScaleDetailDrawer
            scale={selectedScale}
            patientId={patientId}
            onVisibilityChange={(id, newVisibility) => {
              // Update local state
              setScales((prev) =>
                prev.map((s) =>
                  s.id === id ? { ...s, canPatientView: newVisibility } : s,
                ),
              );
              setSelectedScale((prev) =>
                prev ? { ...prev, canPatientView: newVisibility } : null,
              );
            }}
          />
        )}
      </Drawer>

      {/* Administration Drawer */}
      <Drawer
        isOpen={!!administeringType}
        onClose={() => setAdministeringType(null)}
      >
        <div className="p-6 pb-24">
          <h2 className={`${dm_serif.className} text-3xl mb-2 text-stone-800`}>
            Administer{" "}
            {{
              ymrs: "Young Mania Rating Scale",
              ybocs: "Yale-Brown Obsessive Compulsive Scale",
              hama: "Hamilton Anxiety Rating Scale",
              hamd: "Hamilton Depression Rating Scale",
              bprs: "Brief Psychiatric Rating Scale",
            }[administeringType || ""] || administeringType?.toUpperCase()}
          </h2>
          <p className="text-stone-500 mb-6">Complete the assessment below.</p>

          {administeringType === "ymrs" && (
            <YMRSForm a={assessmentData.assessments.data} setA={setA} />
          )}
          {administeringType === "ybocs" && (
            <YBOCSForm a={assessmentData.assessments.data} setA={setA} />
          )}
          {administeringType === "hama" && (
            <HAMAForm a={assessmentData.assessments.data} setA={setA} />
          )}
          {administeringType === "hamd" && (
            <HAMDForm a={assessmentData.assessments.data} setA={setA} />
          )}
          {administeringType === "bprs" && (
            <BPRSForm a={assessmentData.assessments.data} setA={setA} />
          )}

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setAdministeringType(null)}
              className="flex-1 py-3 border border-stone-300 rounded-xl font-bold uppercase tracking-wider text-xs bg-white text-stone-600"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleAdministerSubmit();
                playComplete();
              }}
              disabled={submitting}
              style={{
                backgroundColor: sigmundTheme.primary,
                borderColor: sigmundTheme.primaryDark,
              }}
              className="flex-1 py-3 border-b-4 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-stone-800 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit Assessment"}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
