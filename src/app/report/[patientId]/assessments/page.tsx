"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Plus,
  Calendar as CalendarIcon,
  ChevronRight,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { intPsychTheme } from "@/app/components/theme";
import { DM_Serif_Text, DM_Sans } from "next/font/google";
import Drawer from "@/app/components/Drawer";
import AssessmentDetailDrawer from "@/app/components/AssessmentDetailDrawer";
import { Gauge } from "@/app/components/Report/ui";

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });
const dm_sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

interface Assessment {
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

const ASSESSMENT_TYPES = [
  { value: "phq9", label: "PHQ-9 (Depression)" },
  { value: "gad7", label: "GAD-7 (Anxiety)" },
  { value: "pss4", label: "PSS-4 (Stress)" },
  { value: "ptsd", label: "PC-PTSD-5 (Trauma)" },
  { value: "asrs5", label: "ASRS-5 (ADHD)" },
  { value: "aceResilience", label: "ACE Resilience" },
  { value: "crafft", label: "CRAFFT (Substance Use)" },
];

export default function AssessmentsPage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = params;
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [pendingAssessments, setPendingAssessments] = useState<Assessment[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedType, setSelectedType] = useState(ASSESSMENT_TYPES[0].value);
  const [dueDate, setDueDate] = useState("");
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAssessments();
  }, [patientId]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/clinician/assessments/${patientId}`);
      if (res.ok) {
        const data = await res.json();
        setAssessments(data.assessments || []);
        setPendingAssessments(data.pendingAssessments || []);
      }
    } catch (error) {
      console.error("Failed to fetch assessments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/clinician/assessments/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          assessmentType: selectedType,
          dueDate: dueDate || null,
        }),
      });

      if (res.ok) {
        setSuccessMessage("Assessment assigned successfully");
        setDueDate("");
        // Optionally refresh list if we were showing pending assessments
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        console.error("Failed to send assessment");
      }
    } catch (error) {
      console.error("Error sending assessment", error);
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

  const getAssessmentLabel = (type: string): string => {
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

  const getAssessmentCaption = (type: string): string => {
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
      className={`mx-auto max-w-[1400px] px-4 sm:px-6 pt-8 pb-20 ${dm_sans.className}`}
    >
      <div className="mt-10 space-y-8">
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
              Assessments
            </h2>
            <p className="text-sm text-slate-500">
              Assign new assessments and view patient history
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assign Assessment Card */}
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
                  Assign Assessment
                </h3>
              </div>

              <form onSubmit={handleSendAssessment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Assessment Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {ASSESSMENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Due Date (Optional)
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-xl border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-blue-500"
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

          {/* Right Column: Pending & Completed Assessments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Assessments Section */}
            {pendingAssessments.length > 0 && (
              <div className="rounded-2xl bg-white shadow-sm border border-slate-200 border-b-4 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3
                    className={`${dm_serif.className} text-xl`}
                    style={{ color: intPsychTheme.primary }}
                  >
                    Pending Assessments
                  </h3>
                  <span className="text-sm font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                    {pendingAssessments.length} Awaiting Completion
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {pendingAssessments.map((assessment) => {
                    const isOverdue =
                      assessment.dueDate &&
                      new Date(assessment.dueDate) < new Date();
                    return (
                      <div
                        key={assessment.id}
                        className="p-6 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold text-slate-900 uppercase tracking-wide text-sm">
                                {getAssessmentLabel(assessment.assessmentType)}
                              </span>
                              {isOverdue && (
                                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-700 border border-rose-200">
                                  <AlertCircle className="w-3 h-3" />
                                  Overdue
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-slate-600">
                              {assessment.assignedAt && (
                                <span className="flex items-center gap-1">
                                  <Send className="w-3 h-3" />
                                  Assigned {formatDate(assessment.assignedAt)}
                                </span>
                              )}
                              {assessment.dueDate && (
                                <span
                                  className={`flex items-center gap-1 ${
                                    isOverdue ? "text-rose-600 font-medium" : ""
                                  }`}
                                >
                                  <CalendarIcon className="w-3 h-3" />
                                  Due {formatDate(assessment.dueDate)}
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

            {/* Completed Assessments Section */}
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 border-b-4 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3
                  className={`${dm_serif.className} text-xl`}
                  style={{ color: intPsychTheme.primary }}
                >
                  Completed Assessments
                </h3>
                <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  {assessments.length} Total
                </span>
              </div>

              {loading ? (
                <div className="p-12 flex justify-center">
                  <div
                    style={{ borderTopColor: intPsychTheme.secondary }}
                    className="rounded-full h-12 w-12 mx-auto border-4 border-gray-300 border-t-4 border-t-transparent animate-spin"
                  ></div>
                </div>
              ) : assessments.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-medium text-slate-900 mb-1">
                    No assessments found
                  </h4>
                  <p className="text-slate-500">
                    Completed assessments will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {assessments.map((assessment) => (
                    <button
                      key={assessment.id}
                      onClick={() => setSelectedAssessment(assessment)}
                      className="w-full cursor-pointer text-left p-6 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Left: Gauge and Meta Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {assessment.completedAt
                                ? formatDate(assessment.completedAt)
                                : "—"}
                            </span>
                          </div>

                          {/* Gauge Visualization */}
                          {assessment.totalScore !== null && (
                            <div className="max-w">
                              <Gauge
                                label={getAssessmentLabel(
                                  assessment.assessmentType
                                )}
                                score={assessment.totalScore}
                                max={getMaxScore(assessment.assessmentType)}
                                caption={getAssessmentCaption(
                                  assessment.assessmentType
                                )}
                                showTicker={true}
                              />
                            </div>
                          )}

                          {assessment.totalScore === null && (
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
        isOpen={!!selectedAssessment}
        onClose={() => setSelectedAssessment(null)}
        title={
          selectedAssessment
            ? `${selectedAssessment.assessmentType.toUpperCase()} Details`
            : ""
        }
      >
        {selectedAssessment && (
          <AssessmentDetailDrawer assessment={selectedAssessment} />
        )}
      </Drawer>
    </div>
  );
}
