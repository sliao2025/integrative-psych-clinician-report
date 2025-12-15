"use client";

import React, { useState, useEffect, use } from "react";
import {
  Lightbulb,
  FileText,
  Stethoscope,
  Calendar,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  MessageSquare,
  Sparkle,
  Sparkles,
} from "lucide-react";
import { intPsychTheme } from "@/app/components/theme";
import { DM_Serif_Text, DM_Sans } from "next/font/google";
import { Pill } from "@/app/components/Report/ui";
import ShinyText from "@/app/components/ShinyText";
import { motion, AnimatePresence } from "framer-motion";

// ... existing imports ...

// ... inside component ...

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });
const dm_sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

interface TreatmentPlanPageProps {
  params: Promise<{
    patientId: string;
  }>;
}

interface Recommendation {
  name: string;
  suggestion: string;
  reason: string;
  domain: string;
  related_diagnoses: string[];
  notes: string;
}

interface ClinicalInsights {
  interview_questions: Recommendation[];
  collateral_interviews: Recommendation[];
  labs_imaging: Recommendation[];
  vitals_and_physical_exam: Recommendation[];
  standardized_diagnostic_testing: Recommendation[];
  scales: Recommendation[];
  records_and_documents: Recommendation[];
  behavioral_monitoring_and_diaries: Recommendation[];
  specialist_consultations: Recommendation[];
  digital_and_passive_monitoring: Recommendation[];
}

interface Diagnosis {
  diagnosis: string;
  rule_in_criteria: string;
  rule_out_criteria: string;
  reasoning: string;
}

type SortMode = "category";

const LOADING_PHRASES = [
  "Analyzing patient data...",
  "Reviewing clinical history...",
  "Identifying assessment gaps...",
  "Generating recommendations...",
  "Preparing action items...",
];

const TreatmentPlanPage: React.FC<TreatmentPlanPageProps> = ({ params }) => {
  const { patientId } = use(params);
  const [actionItems, setActionItems] = useState<ClinicalInsights | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [expandedDiagnoses, setExpandedDiagnoses] = useState<
    Record<number, boolean>
  >({});
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    fetchInsights();
  }, [patientId]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/clinician/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: patientId }),
      });

      if (res.ok) {
        const data = await res.json();
        // Handle the new response structure with separate actionItems and diagnoses
        setActionItems(data.actionItems);
        setDiagnoses(data.diagnoses || []);
        console.log("Action Items:", data.actionItems);
        console.log("Diagnoses:", data.diagnoses);
      } else {
        setError("Failed to load clinical insights");
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
      setError("Failed to load clinical insights");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const categoryLabels: Record<string, string> = {
    interview_questions: "Interview Questions",
    collateral_interviews: "Collateral Interviews",
    labs_imaging: "Labs & Imaging",
    vitals_and_physical_exam: "Vitals & Physical Exam",
    standardized_diagnostic_testing: "Standardized Diagnostic Testing",
    scales: "Rating Scales",
    records_and_documents: "Records & Documents",
    behavioral_monitoring_and_diaries: "Behavioral Monitoring & Diaries",
    specialist_consultations: "Specialist Consultations",
    digital_and_passive_monitoring: "Digital & Passive Monitoring",
  };

  const renderRecommendation = (item: Recommendation, idx: number) => {
    return (
      <div
        key={idx}
        className="p-5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors space-y-4"
      >
        {/* Recommendation Name/Title */}
        <div>
          <h5 className="text-base font-bold text-slate-900 leading-snug">
            {item.name}
          </h5>
        </div>

        {/* Suggestion */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Recommendation:
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed pl-4 border-l-2 border-green-300">
            {item.suggestion}
          </p>
        </div>

        {/* Clinical Rationale */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Clinical Rationale:
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed pl-4 border-l-2 border-blue-200">
            {item.reason}
          </p>
        </div>

        {/* Domain */}
        {item.domain && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
              Domain:
            </span>
            <Pill tone="info" className="text-xs">
              {item.domain}
            </Pill>
          </div>
        )}

        {/* Related Diagnoses */}
        {item.related_diagnoses && item.related_diagnoses.length > 0 && (
          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
              Related Diagnoses:
            </span>
            <div className="flex flex-wrap gap-2">
              {item.related_diagnoses.map((diagnosis, i) => (
                <Pill key={i} tone="warn" className="text-xs">
                  {diagnosis}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* Additional Notes */}
        {item.notes && item.notes.trim() && (
          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
              Additional Notes:
            </span>
            <p className="text-xs text-slate-600 italic leading-relaxed pl-4 border-l-2 border-slate-200">
              {item.notes}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderCategory = (key: string, items: Recommendation[]) => {
    if (!items || items.length === 0) return null;

    const isExpanded = expandedCategories[key];

    return (
      <div key={key} className="bg-white cursor-pointer overflow-hidden">
        <button
          onClick={() => toggleCategory(key)}
          className="w-full cursor-pointer flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
        >
          <h4 className="text-sm font-normal text-slate-900">
            {categoryLabels[key] || key}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold bg-blue-100 h-6 w-6 items-center justify-center flex font-medium text-[#0072ce] rounded-full">
              {items.length}
            </span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-slate-200 p-4 space-y-3 bg-slate-50/50 max-h-[50vh] overflow-y-auto">
            {items.map((item, idx) => renderRecommendation(item, idx))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`mx-auto max-w-[1600px] xl:max-w-[2000px] px-4 sm:px-6 pb-20 ${dm_sans.className}`}
    >
      <div className="mt-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
            <Stethoscope
              className="w-6 h-6"
              style={{ color: intPsychTheme.primary }}
            />
          </div>
          <div>
            <h2
              className={`${dm_serif.className} text-3xl font-normal`}
              style={{ color: intPsychTheme.primary }}
            >
              Treatment Planning
            </h2>
            <p className="text-sm text-slate-500">
              AI-assisted clinical decision support
            </p>
          </div>
        </div>

        {/* Grid Layout: Action Items & Diagnoses on left, Treatment Plans on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Left Column */}
          <div className="space-y-4 lg:row-span-2">
            {/* Section A: Action Items */}
            <div className="rounded-2xl bg-white border border-slate-200 border-b-4 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <ClipboardCheck
                        className="w-5 h-5"
                        style={{ color: intPsychTheme.accent }}
                      />
                    </div>
                    <div>
                      <h3
                        className={`${dm_serif.className} text-xl`}
                        style={{ color: intPsychTheme.primary }}
                      >
                        Action Items
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">
                        Guidance for additional assessment and testing
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className=" ">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-6">
                    {/* Spinner */}
                    <div
                      style={{ borderTopColor: intPsychTheme.secondary }}
                      className="rounded-full h-12 w-12 border-4 border-gray-300 border-t-4 border-t-transparent animate-spin"
                    ></div>

                    {/* Shiny Text with Transition */}
                    <div className="h-8 relative flex items-center justify-center w-full">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentPhraseIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.5 }}
                          className="absolute"
                        >
                          <ShinyText
                            text={LOADING_PHRASES[currentPhraseIndex]}
                            disabled={false}
                            speed={3}
                            className="text-lg font-medium"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                ) : error ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="w-8 h-8 text-rose-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 mb-1">
                      Error loading insights
                    </h4>
                    <p className="text-slate-500">{error}</p>
                  </div>
                ) : actionItems ? (
                  <div className="divide-y divide-slate-200">
                    {Object.entries(actionItems).map(([key, items]) =>
                      renderCategory(key, items as Recommendation[])
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 mb-1">
                      No action items available
                    </h4>
                    <p className="text-slate-500">
                      Clinical action items will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            {/* Section B: Potential Diagnoses */}
            <div className="rounded-2xl bg-white border border-slate-200 border-b-4 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <FileText
                      className="w-5 h-5"
                      style={{ color: intPsychTheme.accent }}
                    />
                  </div>
                  <div>
                    <h3
                      className={`${dm_serif.className} text-xl`}
                      style={{ color: intPsychTheme.primary }}
                    >
                      Potential Diagnoses
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Differential diagnosis with rule-in/rule-out criteria
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 max-h-[50vh] overflow-y-auto">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-6">
                    {/* Spinner */}
                    <div
                      style={{ borderTopColor: intPsychTheme.secondary }}
                      className="rounded-full h-12 w-12 border-4 border-gray-300 border-t-4 border-t-transparent animate-spin"
                    ></div>

                    {/* Shiny Text with Transition */}
                    <div className="h-8 relative flex items-center justify-center w-full">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentPhraseIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.5 }}
                          className="absolute"
                        >
                          <ShinyText
                            text={LOADING_PHRASES[currentPhraseIndex]}
                            disabled={false}
                            speed={3}
                            className="text-lg font-medium"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                ) : diagnoses.length > 0 ? (
                  <div className="space-y-3">
                    {diagnoses.map((diagnosis, idx) => {
                      const isExpanded = expandedDiagnoses[idx];
                      return (
                        <div
                          key={idx}
                          className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
                        >
                          <button
                            onClick={() =>
                              setExpandedDiagnoses((prev) => ({
                                ...prev,
                                [idx]: !prev[idx],
                              }))
                            }
                            className="w-full cursor-pointer flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-[#0072ce] font-bold text-sm flex-shrink-0">
                                {idx + 1}
                              </div>
                              <h4 className="text-base text-slate-800 text-left">
                                {diagnosis.diagnosis}
                              </h4>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="border-t border-slate-200 p-4 space-y-4 bg-slate-50/50">
                              {/* Rule-In Criteria */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="text-xs font-bold text-green-800 uppercase tracking-wide">
                                    Rule-In Criteria
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed ml-1.5 pl-4 border-l-2 border-green-200">
                                  {diagnosis.rule_in_criteria}
                                </p>
                              </div>

                              {/* Rule-Out Criteria */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <XCircle className="w-4 h-4 text-red-600" />
                                  <span className="text-xs font-bold text-red-700 uppercase tracking-wide">
                                    Rule-Out Criteria
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed ml-1.5 pl-4 border-l-2 border-red-200">
                                  {diagnosis.rule_out_criteria}
                                </p>
                              </div>

                              {/* Reasoning */}
                              <div className="space-y-2 pt-2 border-t border-slate-200">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-[#0072ce]" />
                                  <span className="text-xs font-bold text-[#004684] uppercase tracking-wide">
                                    Clinical Reasoning
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed ml-1.5 pl-4 border-l-2 border-blue-200 italic">
                                  {diagnosis.reasoning}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <h4 className="text-base font-medium text-slate-700 mb-1">
                      No diagnoses available
                    </h4>
                    <p className="text-sm text-slate-500">
                      Potential diagnoses will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Treatment Plans (spans 2 rows) */}
          <div className="xl:row-span-3">
            <div className="rounded-2xl bg-white border border-slate-200 border-b-4 overflow-hidden opacity-60 h-full">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3
                      className={`${dm_serif.className} text-xl text-slate-700`}
                    >
                      Treatment Plans
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Session-by-session treatment protocols and interventions
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-12 flex items-center justify-center h-[calc(100%-88px)]">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-medium text-slate-700 mb-1">
                    Coming Soon
                  </h4>
                  <p className="text-slate-500">
                    This feature is currently under development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanPage;
