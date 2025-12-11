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
  const [insights, setInsights] = useState<ClinicalInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
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
        setInsights(data.insights);
        console.log(data.insights);
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
            <span className="text-xs bg-[#ffa44033] h-5 w-5 items-center justify-center flex font-medium text-slate-600 rounded-full">
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
          {/* Left Column */}
          <div className="space-y-4">
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
                ) : insights ? (
                  <div className="divide-y divide-slate-200">
                    {Object.entries(insights).map(([key, items]) =>
                      renderCategory(key, items)
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 mb-1">
                      No insights available
                    </h4>
                    <p className="text-slate-500">
                      Clinical insights will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section B: Potential Diagnoses (Placeholder) */}
            <div className="rounded-2xl bg-white border border-slate-200 border-b-4 overflow-hidden opacity-60">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3
                      className={`${dm_serif.className} text-xl text-slate-700`}
                    >
                      Potential Diagnoses
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Differential diagnosis with rule-in/rule-out criteria
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
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

          {/* Right Column - Treatment Plans (spans 2 rows) */}
          <div className="xl:row-span-2">
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
