"use client";

import React from "react";
import {
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  PSS4_QUESTIONS,
  PTSD_QUESTIONS,
  ASRS5_QUESTIONS,
  CRAFFT_QUESTIONS,
  CRAFFT_PARTA_QUESTIONS,
  ACE_RESILIENCE_QUESTIONS,
} from "./text";

interface AssessmentDetailDrawerProps {
  assessment: {
    assessmentType: string;
    totalScore: number | null;
    severity: string | null;
    responses: Record<string, any>;
  };
}

type Opt = { key: string; label: string; bg: string; text: string };

const freq0to3: readonly Opt[] = [
  {
    key: "0",
    label: "Not at all",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
  },
  {
    key: "1",
    label: "Several days",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  {
    key: "2",
    label: "More than half the days",
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
  {
    key: "3",
    label: "Nearly every day",
    bg: "bg-rose-100",
    text: "text-rose-800",
  },
];

const pss0to4: readonly Opt[] = [
  {
    key: "0",
    label: "Never",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
  },
  {
    key: "1",
    label: "Almost never",
    bg: "bg-lime-100",
    text: "text-lime-800",
  },
  {
    key: "2",
    label: "Sometimes",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  {
    key: "3",
    label: "Fairly often",
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
  { key: "4", label: "Very often", bg: "bg-rose-100", text: "text-rose-800" },
];

const asrs0to4: readonly Opt[] = [
  {
    key: "0",
    label: "Never",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
  },
  { key: "1", label: "Rarely", bg: "bg-lime-100", text: "text-lime-800" },
  {
    key: "2",
    label: "Sometimes",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  { key: "3", label: "Often", bg: "bg-orange-100", text: "text-orange-800" },
  { key: "4", label: "Very often", bg: "bg-rose-100", text: "text-rose-800" },
];

const yesNo: readonly Opt[] = [
  { key: "yes", label: "Yes", bg: "bg-rose-100", text: "text-rose-800" },
  { key: "no", label: "No", bg: "bg-slate-100", text: "text-slate-700" },
  { key: "1", label: "Yes", bg: "bg-rose-100", text: "text-rose-800" },
  { key: "0", label: "No", bg: "bg-slate-100", text: "text-slate-700" },
];

const aceTrue5: readonly Opt[] = [
  {
    key: "4",
    label: "Definitely true",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
  },
  {
    key: "3",
    label: "Probably true",
    bg: "bg-lime-100",
    text: "text-lime-800",
  },
  {
    key: "2",
    label: "Not sure",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  {
    key: "1",
    label: "Probably not true",
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
  {
    key: "0",
    label: "Definitely not true",
    bg: "bg-rose-100",
    text: "text-rose-800",
  },
];

const optFor = (
  opts: readonly Opt[],
  key: string | number | undefined | null
): Opt | undefined => {
  if (key === undefined || key === null || key === "") return undefined;
  const s = String(key);
  return opts.find((o) => o.key === s);
};

export default function AssessmentDetailDrawer({
  assessment,
}: AssessmentDetailDrawerProps) {
  const { assessmentType, totalScore, severity, responses } = assessment;

  const getAssessmentInfo = () => {
    // Handle both nested and flat response structures
    // Nested: { phq9: { phq1: "0", ... } }
    // Flat: { phq1: "0", phq2: "1", ... }
    
    switch (assessmentType.toLowerCase()) {
      case "phq9":
        return {
          name: "PHQ-9",
          fullName: "Patient Health Questionnaire",
          questions: PHQ9_QUESTIONS,
          answers: responses.phq9 || responses, // Try nested first, fallback to flat
          options: freq0to3,
          headerNote: "Over the last 2 weeks",
        };
      case "gad7":
        return {
          name: "GAD-7",
          fullName: "Generalized Anxiety Disorder Scale",
          questions: GAD7_QUESTIONS,
          answers: responses.gad7 || responses, // Try nested first, fallback to flat
          options: freq0to3,
          headerNote: "Over the last 2 weeks",
        };
      case "pss4":
        return {
          name: "PSS-4",
          fullName: "Perceived Stress Scale",
          questions: PSS4_QUESTIONS,
          answers: responses.stress || responses, // Try nested first, fallback to flat
          options: pss0to4,
        };
      case "ptsd":
        return {
          name: "PC-PTSD-5",
          fullName: "Post-Traumatic Stress Disorder Screen",
          questions: PTSD_QUESTIONS,
          answers: responses.ptsd || responses, // Try nested first, fallback to flat
          options: yesNo,
        };
      case "asrs5":
        return {
          name: "ASRS-5",
          fullName: "Adult ADHD Self-Report Scale",
          questions: ASRS5_QUESTIONS,
          answers: responses.asrs5 || responses, // Try nested first, fallback to flat
          options: asrs0to4,
        };
      case "aceResilience":
        return {
          name: "ACE Resilience",
          fullName: "Adverse Childhood Experiences Resilience Scale",
          questions: ACE_RESILIENCE_QUESTIONS,
          answers: responses.aceResilience || responses, // Try nested first, fallback to flat
          options: aceTrue5,
        };
      case "crafft":
        return {
          name: "CRAFFT",
          fullName: "Substance Use Screening",
          questions: null, // Special handling
          answers: responses.crafft || responses, // Try nested first, fallback to flat
          options: yesNo,
        };
      default:
        return null;
    }
  };

  const info = getAssessmentInfo();

  if (!info) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Assessment type not recognized.</p>
      </div>
    );
  }

  // Special handling for CRAFFT
  if (assessmentType.toLowerCase() === "crafft") {
    // Handle both nested and flat structures
    const crafftData = responses.crafft || responses;
    const partA = crafftData.partA || {};
    const partB = crafftData.partB || {};

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {info.name}
          </h3>
          <p className="text-sm text-gray-600">{info.fullName}</p>
          {totalScore !== null && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Score: {totalScore}
              </span>
              {severity && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {severity}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Part A: Days of use */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Part A: Days of Use (Past 12 months)
          </h4>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {Object.entries(CRAFFT_PARTA_QUESTIONS).map(([k, q]) => (
              <div
                key={k}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className="text-xs text-slate-600 mb-1 leading-snug">
                  {q}
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {partA?.[k] !== undefined && partA?.[k] !== ""
                    ? `${partA[k]} days`
                    : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part B: Yes/No items */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Part B: Screening Questions
          </h4>
          <ul className="space-y-2 text-sm text-slate-800">
            {Object.entries(CRAFFT_QUESTIONS).map(([k, q]) => {
              const ans = partB?.[k];
              const opt = optFor(yesNo, ans);
              return (
                <li
                  key={k}
                  className="flex items-start justify-between gap-3 py-2 border-b border-slate-100 last:border-0"
                >
                  <div className="flex gap-2 flex-1 min-w-0">
                    <span className="shrink-0 text-slate-500">•</span>
                    <span className="flex-1 min-w-0 break-words">{q}</span>
                  </div>
                  <div className="shrink-0">
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        opt?.bg ?? "bg-slate-100"
                      } ${opt?.text ?? "text-slate-700"}`}
                    >
                      {opt?.label ?? "—"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  // Standard assessment display
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {info.name}
        </h3>
        <p className="text-sm text-gray-600">{info.fullName}</p>
        {totalScore !== null && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Score: {totalScore}
            </span>
            {severity && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {severity}
              </span>
            )}
          </div>
        )}
        {info.headerNote && (
          <p className="text-xs text-gray-500 mt-1">{info.headerNote}</p>
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Question Responses
        </h4>
        <ul className="space-y-2 text-sm text-slate-800">
          {Object.entries(info.questions).map(([k, q]) => {
            const ans = (info.answers as any)?.[k];
            const opt = optFor(info.options, ans);
            return (
              <li
                key={k}
                className="flex items-start justify-between gap-3 py-2 border-b border-slate-100 last:border-0"
              >
                <div className="flex gap-2 flex-1 min-w-0">
                  <span className="shrink-0 text-slate-500">•</span>
                  <span className="flex-1 min-w-0 break-words">{q}</span>
                </div>
                <div className="shrink-0">
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      opt?.bg ?? "bg-slate-100"
                    } ${opt?.text ?? "text-slate-700"}`}
                  >
                    {opt?.label ?? "—"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

