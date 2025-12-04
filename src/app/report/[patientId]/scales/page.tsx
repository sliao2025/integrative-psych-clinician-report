"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { intPsychTheme } from "@/app/components/theme";
import { DM_Serif_Text, DM_Sans } from "next/font/google";
import Drawer from "@/app/components/Drawer";
import ScaleDetailDrawer from "@/app/components/ScaleDetailDrawer";
import { Gauge } from "@/app/components/Report/ui";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

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
}

const SCALE_TYPES = [
  { value: "phq9", label: "PHQ-9 (Depression)" },
  { value: "gad7", label: "GAD-7 (Anxiety)" },
  { value: "pss4", label: "PSS-4 (Stress)" },
  { value: "ptsd", label: "PC-PTSD-5 (Trauma)" },
  { value: "asrs5", label: "ASRS-5 (ADHD)" },
  { value: "aceResilience", label: "ACE Resilience" },
  { value: "crafft", label: "CRAFFT (Substance Use)" },
];

export default function ScalesPage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = params;
  const [scales, setScales] = useState<Scale[]>([]);
  const [pendingScales, setPendingScales] = useState<Scale[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedType, setSelectedType] = useState(SCALE_TYPES[0].value);
  const [dueDate, setDueDate] = useState("");
  const [selectedScale, setSelectedScale] = useState<Scale | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchScales();
  }, [patientId]);

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
    if (!severity) return "bg-slate-100 text-slate-700 border-slate-200";
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
      crafft: 6,
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
      aceResilience: "ACE Resilience",
      crafft: "CRAFFT",
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
      crafft: "2+ yes = high risk",
    };
    return captions[type] || "";
  };

  return (
    <div
      className={`mx-auto max-w-[1400px] px-4 sm:px-6 pb-20 ${dm_sans.className}`}
    >
      <div className="mt-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
            <ClipboardList
              className="w-6 h-6"
              style={{ color: intPsychTheme.primary }}
            />
          </div>
          <div>
            <h2
              className={`${dm_serif.className} text-3xl font-normal`}
              style={{ color: intPsychTheme.primary }}
            >
              Scales
            </h2>
            <p className="text-sm text-slate-500">
              Assign new scales and view patient history
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assign Scale Card */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 border-b-4 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Send className="w-5 h-5" />
                </div>
                <h3
                  className={`${dm_serif.className} text-xl`}
                  style={{ color: intPsychTheme.primary }}
                >
                  Assign Scale
                </h3>
              </div>

              <form onSubmit={handleSendScale} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Scale Type
                  </label>
                  <Listbox value={selectedType} onChange={setSelectedType}>
                    <div className="relative">
                      <ListboxButton className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-10 text-left text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
                        <span className="block truncate">
                          {
                            SCALE_TYPES.find((t) => t.value === selectedType)
                              ?.label
                          }
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDown
                            className="h-4 w-4 text-slate-400"
                            aria-hidden="true"
                          />
                        </span>
                      </ListboxButton>
                      <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg border border-slate-200 ring-opacity-5 focus:outline-none sm:text-sm">
                        {SCALE_TYPES.map((type) => (
                          <ListboxOption
                            key={type.value}
                            value={type.value}
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
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Due Date (Optional)
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500 placeholder-slate-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  style={{ backgroundColor: intPsychTheme.secondary }}
                  className="w-full cursor-pointer flex items-center border-b-4 border-orange-300/90 justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium shadow-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>

          {/* Right Column: Pending & Completed Scales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Scales Section */}
            {pendingScales.length > 0 && (
              <div className="rounded-2xl bg-white shadow-sm border border-slate-200 border-b-4 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3
                    className={`${dm_serif.className} text-xl`}
                    style={{ color: intPsychTheme.primary }}
                  >
                    Pending Scales
                  </h3>
                  <span className="text-sm font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                    {pendingScales.length} Awaiting Completion
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {pendingScales.map((scale) => {
                    const isOverdue =
                      scale.dueDate && new Date(scale.dueDate) < new Date();
                    return (
                      <div
                        key={scale.id}
                        className="p-6 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold text-slate-900 uppercase tracking-wide text-sm">
                                {getScaleLabel(scale.assessmentType)}
                              </span>
                              {isOverdue && (
                                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-700 border border-rose-200">
                                  <AlertCircle className="w-3 h-3" />
                                  Overdue
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-slate-600">
                              {scale.assignedAt && (
                                <span className="flex items-center gap-1">
                                  <Send className="w-3 h-3" />
                                  Assigned {formatDate(scale.assignedAt)}
                                </span>
                              )}
                              {scale.dueDate && (
                                <span
                                  className={`flex items-center gap-1 ${
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
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
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
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 border-b-4 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3
                  className={`${dm_serif.className} text-xl`}
                  style={{ color: intPsychTheme.primary }}
                >
                  Completed Scales
                </h3>
                <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  {scales.length} Total
                </span>
              </div>

              {loading ? (
                <div className="p-12 flex justify-center">
                  <div
                    style={{ borderTopColor: intPsychTheme.secondary }}
                    className="rounded-full h-12 w-12 mx-auto border-4 border-gray-300 border-t-4 border-t-transparent animate-spin"
                  ></div>
                </div>
              ) : scales.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-medium text-slate-900 mb-1">
                    No scales found
                  </h4>
                  <p className="text-slate-500">
                    Completed scales will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {scales.map((scale) => (
                    <button
                      key={scale.id}
                      onClick={() => setSelectedScale(scale)}
                      className="w-full cursor-pointer text-left p-6 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Left: Gauge and Meta Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {scale.completedAt
                                ? formatDate(scale.completedAt)
                                : "—"}
                            </span>
                          </div>

                          {/* Gauge Visualization */}
                          {scale.totalScore !== null && (
                            <div className="max-w">
                              <Gauge
                                label={getScaleLabel(scale.assessmentType)}
                                score={scale.totalScore}
                                max={getMaxScore(scale.assessmentType)}
                                caption={getScaleCaption(scale.assessmentType)}
                                showTicker={true}
                              />
                            </div>
                          )}

                          {scale.totalScore === null && (
                            <div className="text-sm text-slate-500">
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
        </div>
      </div>

      <Drawer
        isOpen={!!selectedScale}
        onClose={() => setSelectedScale(null)}
        title={
          selectedScale
            ? `${selectedScale.assessmentType.toUpperCase()} Details`
            : ""
        }
      >
        {selectedScale && <ScaleDetailDrawer scale={selectedScale} />}
      </Drawer>
    </div>
  );
}
