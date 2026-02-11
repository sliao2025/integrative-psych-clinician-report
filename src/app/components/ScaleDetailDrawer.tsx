"use client";

import React, { useState } from "react";
import {
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  PSS4_QUESTIONS,
  PTSD_QUESTIONS,
  ASRS5_QUESTIONS,
  CRAFFT_QUESTIONS,
  CRAFFT_PARTA_QUESTIONS,
  ACE_RESILIENCE_QUESTIONS,
  SELF_HARM_QUESTIONS,
  AQ10_QUESTIONS,
  MDQ_QUESTIONS,
  YMRS_QUESTIONS,
  YMRS_OPTIONS,
  YBOCS_QUESTIONS,
  YBOCS_OPTIONS,
  HAM_A_QUESTIONS,
  HAM_A_OPTIONS,
  HAM_A_DESCRIPTIONS,
  HAM_D_QUESTIONS,
  HAM_D_OPTIONS,
  HAM_D_DESCRIPTIONS,
  BPRS_QUESTIONS,
  BPRS_OPTIONS,
  BPRS_DESCRIPTIONS,
} from "./text";

const SCALE_SCORING_CRITERIA: Record<string, string> = {
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
import { Eye, Lock, EyeOff } from "lucide-react";

import { DM_Serif_Text } from "next/font/google";
import { sigmundTheme } from "./theme";
import { Checkbox } from "./Report/ui";

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });

interface ScaleDetailDrawerProps {
  scale: {
    id: string;
    assessmentType: string;
    totalScore: number | null;
    severity: string | null;
    responses: Record<string, any>;
    canPatientView?: boolean | null;
  };
  patientId: string;
  onVisibilityChange?: (id: string, canPatientView: boolean) => void;
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
  key: string | number | undefined | null,
): Opt | undefined => {
  if (key === undefined || key === null || key === "") return undefined;
  const s = String(key);
  return opts.find((o) => o.key === s);
};

export default function ScaleDetailDrawer({
  scale,
  patientId,
  onVisibilityChange,
}: ScaleDetailDrawerProps) {
  const {
    id,
    assessmentType,
    totalScore,
    severity,
    responses,
    canPatientView = false,
  } = scale;
  const [isVisible, setIsVisible] = useState(canPatientView ?? false);
  const [updating, setUpdating] = useState(false);

  const handleToggleVisibility = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/clinician/scales/${patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId: id, canPatientView: !isVisible }),
      });
      if (res.ok) {
        setIsVisible(!isVisible);
        onVisibilityChange?.(id, !isVisible);
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
    } finally {
      setUpdating(false);
    }
  };

  const VisibilityToggle = () => (
    <div className="mt-3">
      <Checkbox
        checked={isVisible}
        onChange={handleToggleVisibility}
        label="Patient Visibility"
        color="#10b981"
        uncheckedColor="#ef4444"
        loading={updating}
        icon={
          isVisible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )
        }
        cursor="default"
      />
    </div>
  );

  const getAssessmentInfo = () => {
    switch (assessmentType.toLowerCase()) {
      case "phq9":
        return {
          name: "PHQ-9",
          fullName: "Patient Health Questionnaire",
          questions: PHQ9_QUESTIONS,
          answers: responses.phq9 || responses,
          options: freq0to3,
          headerNote: "Over the last 2 weeks",
        };
      case "gad7":
        return {
          name: "GAD-7",
          fullName: "Generalized Anxiety Disorder Scale",
          questions: GAD7_QUESTIONS,
          answers: responses.gad7 || responses,
          options: freq0to3,
          headerNote: "Over the last 2 weeks",
        };
      case "pss4":
        return {
          name: "PSS-4",
          fullName: "Perceived Stress Scale",
          questions: PSS4_QUESTIONS,
          answers: responses.stress || responses,
          options: pss0to4,
        };
      case "ptsd":
        return {
          name: "PC-PTSD-5",
          fullName: "Post-Traumatic Stress Disorder Screen",
          questions: PTSD_QUESTIONS,
          answers: responses.ptsd || responses,
          options: yesNo,
        };
      case "asrs5":
        return {
          name: "ASRS-5",
          fullName: "Adult ADHD Self-Report Scale",
          questions: ASRS5_QUESTIONS,
          answers: responses.asrs5 || responses,
          options: asrs0to4,
        };
      case "aceresilience":
      case "aceResilience":
        return {
          name: "ACE-Resilience",
          fullName: "Adverse Childhood Experiences Resilience Scale",
          questions: ACE_RESILIENCE_QUESTIONS,
          answers:
            responses.aceResilience || responses.aceresilience || responses,
          options: aceTrue5,
        };
      case "crafft":
        return {
          name: "CRAFFT",
          fullName: "Substance Use Screening",
          questions: null,
          answers: responses.crafft || responses,
          options: yesNo,
        };
      case "selfharm":
      case "self_harm": // Handle potential key variations
      case "selfHarm":
        return {
          name: "Self-Harm",
          fullName: "Self-Harm Screening",
          questions: SELF_HARM_QUESTIONS,
          answers: responses.selfHarm || responses,
          options: yesNo,
        };
      case "aq10":
        return {
          name: "AQ-10",
          fullName: "Autism Spectrum Quotient-10",
          questions: AQ10_QUESTIONS,
          answers: responses.aq10 || responses,
          options: [
            {
              key: "0",
              label: "Definitely Disagree",
              bg: "bg-emerald-100",
              text: "text-emerald-800",
            },
            {
              key: "1",
              label: "Slightly Disagree",
              bg: "bg-lime-100",
              text: "text-lime-800",
            },
            {
              key: "2",
              label: "Slightly Agree",
              bg: "bg-yellow-100",
              text: "text-yellow-800",
            },
            {
              key: "3",
              label: "Definitely Agree",
              bg: "bg-rose-100",
              text: "text-rose-800",
            },
          ],
        };
      case "mdq":
        return {
          name: "MDQ",
          fullName: "Mood Disorder Questionnaire",
          questions: MDQ_QUESTIONS,
          answers: responses.mdq || responses,
          options: yesNo,
        };
      case "ymrs":
        return {
          name: "YMRS",
          fullName: "Young Mania Rating Scale",
          questions: YMRS_QUESTIONS,
          answers: responses.ymrs || responses,
          options: [], // Not used due to getOptions
          getOptions: (k: string) => {
            const opts = YMRS_OPTIONS[k] || [];
            return opts.map((o) => {
              const val = parseInt(o.key);
              let bg = "bg-stone-100";
              let text = "text-stone-700";
              if (val === 0) {
                bg = "bg-emerald-100";
                text = "text-emerald-800";
              } else if (val === 1) {
                bg = "bg-lime-100";
                text = "text-lime-800";
              } else if (val === 2) {
                bg = "bg-yellow-100";
                text = "text-yellow-800";
              } else if (val === 3) {
                bg = "bg-orange-100";
                text = "text-orange-800";
              } else if (val >= 4) {
                bg = "bg-rose-100";
                text = "text-rose-800";
              }
              return { ...o, bg, text };
            });
          },
        };
      case "ybocs":
        return {
          name: "YBOCS",
          fullName: "Yale-Brown Obsessive Compulsive Scale",
          questions: YBOCS_QUESTIONS,
          answers: responses.ybocs || responses,
          options: [],
          getOptions: (k: string) => {
            const opts = YBOCS_OPTIONS[k] || [];
            return opts.map((o) => {
              const val = parseInt(o.key);
              let bg = "bg-stone-100";
              let text = "text-stone-700";
              if (val === 0) {
                bg = "bg-emerald-100";
                text = "text-emerald-800";
              } else if (val === 1) {
                bg = "bg-lime-100";
                text = "text-lime-800";
              } else if (val === 2) {
                bg = "bg-yellow-100";
                text = "text-yellow-800";
              } else if (val === 3) {
                bg = "bg-orange-100";
                text = "text-orange-800";
              } else if (val >= 4) {
                bg = "bg-rose-100";
                text = "text-rose-800";
              }
              return { ...o, bg, text };
            });
          },
        };
      case "hama":
        return {
          name: "HAM-A",
          fullName: "Hamilton Anxiety Rating Scale",
          questions: HAM_A_QUESTIONS,
          answers: responses.hama || responses,
          options: (HAM_A_OPTIONS.default || []).map((o) => {
            const val = parseInt(o.key);
            let bg = "bg-stone-100";
            let text = "text-stone-700";
            if (val === 0) {
              bg = "bg-emerald-100";
              text = "text-emerald-800";
            } else if (val === 1) {
              bg = "bg-lime-100";
              text = "text-lime-800";
            } else if (val === 2) {
              bg = "bg-yellow-100";
              text = "text-yellow-800";
            } else if (val === 3) {
              bg = "bg-orange-100";
              text = "text-orange-800";
            } else if (val >= 4) {
              bg = "bg-rose-100";
              text = "text-rose-800";
            }
            return { ...o, bg, text };
          }),
          descriptions: HAM_A_DESCRIPTIONS,
        };
      case "hamd":
        return {
          name: "HAM-D",
          fullName: "Hamilton Depression Rating Scale",
          questions: HAM_D_QUESTIONS,
          answers: responses.hamd || responses,
          options: [],
          getOptions: (k: string) => {
            const opts = HAM_D_OPTIONS[k] || [];
            return opts.map((o) => {
              const val = parseInt(o.key);
              let bg = "bg-stone-100";
              let text = "text-stone-700";
              if (val === 0) {
                bg = "bg-emerald-100";
                text = "text-emerald-800";
              } else if (val === 1) {
                bg = "bg-lime-100";
                text = "text-lime-800";
              } else if (val === 2) {
                bg = "bg-yellow-100";
                text = "text-yellow-800";
              } else if (val === 3) {
                bg = "bg-orange-100";
                text = "text-orange-800";
              } else if (val >= 4) {
                bg = "bg-rose-100";
                text = "text-rose-800";
              }
              return { ...o, bg, text };
            });
          },
          descriptions: HAM_D_DESCRIPTIONS,
        };
      case "bprs":
        return {
          name: "BPRS",
          fullName: "Brief Psychiatric Rating Scale",
          questions: BPRS_QUESTIONS,
          answers: responses.bprs || responses,
          options: (BPRS_OPTIONS.default || []).map((o) => {
            const val = parseInt(o.key);
            let bg = "bg-stone-100";
            let text = "text-stone-700";
            if (val <= 1) {
              bg = "bg-emerald-100";
              text = "text-emerald-800";
            } else if (val <= 3) {
              bg = "bg-lime-100";
              text = "text-lime-800";
            } else if (val <= 5) {
              bg = "bg-yellow-100";
              text = "text-yellow-800";
            } else {
              bg = "bg-rose-100";
              text = "text-rose-800";
            }
            return { ...o, bg, text };
          }),
          descriptions: BPRS_DESCRIPTIONS,
        };
      default:
        return null;
    }
  };

  const getScoringCriteria = () => {
    return (
      SCALE_SCORING_CRITERIA[assessmentType] ||
      SCALE_SCORING_CRITERIA[assessmentType.toLowerCase()]
    );
  };

  const info = getAssessmentInfo();

  if (!info) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Scale type not recognized.</p>
      </div>
    );
  }

  if (assessmentType.toLowerCase() === "crafft") {
    const crafftData = responses.crafft || responses;
    const partA = crafftData.partA || {};
    const partB = crafftData.partB || {};

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <h3
              className={`${dm_serif.className} text-2xl sm:text-3xl text-stone-900 mb-1`}
              style={{ color: sigmundTheme.accent }}
            >
              {info.name}
            </h3>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">
              {info.fullName}
            </p>
            {getScoringCriteria() && (
              <p className="text-[10px] sm:text-xs font-medium text-stone-400 mt-1">
                Scoring: {getScoringCriteria()}
              </p>
            )}
            <VisibilityToggle />
          </div>
          {totalScore !== null && (
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 flex flex-col items-center min-w-[100px]">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">
                  Score
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-stone-900">
                  {totalScore}
                </span>
              </div>
              {severity && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                  {severity}
                </span>
              )}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">
            Part A: Days of Use (Past 12 months)
          </h4>
          <div className="flex flex-col gap-3">
            {Object.entries(CRAFFT_PARTA_QUESTIONS).map(([k, q]) => (
              <div
                key={k}
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-4 transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="text-sm font-medium text-stone-600 leading-snug max-w-[70%]">
                  {q}
                </div>
                <div className="text-xl font-bold text-stone-900">
                  {partA?.[k] !== undefined && partA?.[k] !== ""
                    ? `${partA[k]} days`
                    : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">
            Part B: Screening Questions
          </h4>
          <ul className="space-y-3">
            {Object.entries(CRAFFT_QUESTIONS).map(([k, q]) => {
              const ans = partB?.[k];
              const opt = optFor(yesNo, ans);
              return (
                <li
                  key={k}
                  className="flex items-start justify-between gap-4 p-5 rounded-xl border border-stone-100 bg-white"
                >
                  <div className="flex gap-4 flex-1 min-w-0">
                    <span className="shrink-0 text-stone-300 font-bold mt-1">
                      •
                    </span>
                    <span className="flex-1 min-w-0 text-md font-medium text-stone-700 leading-relaxed">
                      {q}
                    </span>
                  </div>
                  <div className="shrink-0 mt-1">
                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                        opt?.bg ?? "bg-stone-100"
                      } ${opt?.text ?? "text-stone-700"}`}
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

  if (assessmentType.toLowerCase() === "mdq") {
    const mdqData = responses.mdq || responses;

    const impactOptions = [
      {
        key: "0",
        label: "No Problem",
        bg: "bg-emerald-100",
        text: "text-emerald-800",
      },
      {
        key: "1",
        label: "Minor Problem",
        bg: "bg-yellow-100",
        text: "text-yellow-800",
      },
      {
        key: "2",
        label: "Moderate Problem",
        bg: "bg-orange-100",
        text: "text-orange-800",
      },
      {
        key: "3",
        label: "Serious Problem",
        bg: "bg-rose-100",
        text: "text-rose-800",
      },
    ];

    return (
      <div className="space-y-8">
        <div className="flex items-start justify-between border-b border-stone-100 pb-6">
          <div>
            <h3
              className={`${dm_serif.className} text-3xl text-stone-900 mb-1`}
              style={{ color: sigmundTheme.accent }}
            >
              {info.name}
            </h3>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">
              {info.fullName}
            </p>
            {getScoringCriteria() && (
              <p className="text-[10px] sm:text-xs font-medium text-stone-400 mt-1">
                Scoring: {getScoringCriteria()}
              </p>
            )}
            <VisibilityToggle />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 flex flex-col items-center min-w-[100px]">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">
                Result
              </span>
              <span className="text-xl font-bold text-stone-900">
                {severity || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Part 1 */}
        <div>
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">
            Part 1: Symptoms
          </h4>
          <p className="text-sm text-stone-500 mb-4 italic">
            Has there ever been a period of time when you were not your usual
            self and...
          </p>
          <ul className="space-y-3">
            {Object.entries(MDQ_QUESTIONS).map(([k, q]) => {
              const ans = mdqData[k];
              const opt = optFor(yesNo, ans);
              return (
                <li
                  key={k}
                  className="flex items-start justify-between gap-4 p-5 rounded-xl border border-stone-100 bg-white"
                >
                  <div className="flex gap-4 flex-1 min-w-0">
                    <span className="shrink-0 text-stone-300 font-bold mt-1">
                      •
                    </span>
                    <span className="flex-1 min-w-0 text-md font-medium text-stone-700 leading-relaxed">
                      {q}
                    </span>
                  </div>
                  <div className="shrink-0 mt-1">
                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                        opt?.bg ?? "bg-stone-100"
                      } ${opt?.text ?? "text-stone-700"}`}
                    >
                      {opt?.label ?? "—"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Part 2 */}
        <div>
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">
            Part 2: Co-occurrence
          </h4>
          <div className="flex items-start justify-between gap-4 p-5 rounded-xl border border-stone-100 bg-white">
            <div className="flex-1 min-w-0 text-md font-medium text-stone-700 leading-relaxed">
              If you checked YES to more than one of the above, have several of
              these ever happened during the same period of time?
            </div>
            <div className="shrink-0 mt-1">
              {(() => {
                const ans = mdqData.cooccurrence;
                const opt = optFor(yesNo, ans);
                return (
                  <span
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                      opt?.bg ?? "bg-stone-100"
                    } ${opt?.text ?? "text-stone-700"}`}
                  >
                    {opt?.label ?? "—"}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Part 3 */}
        <div>
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">
            Part 3: Impact
          </h4>
          <div className="flex items-start justify-between gap-4 p-5 rounded-xl border border-stone-100 bg-white">
            <div className="flex-1 min-w-0 text-md font-medium text-stone-700 leading-relaxed">
              How much of a problem did any of these cause you — like being able
              to work; having family, money or legal troubles; getting into
              arguments or fights?
            </div>
            <div className="shrink-0 mt-1">
              {(() => {
                const ans = mdqData.impact;
                const opt = optFor(impactOptions, ans);
                return (
                  <span
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                      opt?.bg ?? "bg-stone-100"
                    } ${opt?.text ?? "text-stone-700"}`}
                  >
                    {opt?.label ?? "—"}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
        <div>
          <h3
            className={`${dm_serif.className} text-2xl sm:text-3xl text-stone-900 mb-1`}
            style={{ color: sigmundTheme.accent }}
          >
            {info.name}
          </h3>
          <p className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">
            {info.fullName}
          </p>
          {getScoringCriteria() && (
            <p className="text-[10px] sm:text-xs font-medium text-stone-400 mt-1">
              Scoring: {getScoringCriteria()}
            </p>
          )}
          {info.headerNote && (
            <p className="text-xs font-medium text-stone-400 italic mt-2">
              ({info.headerNote})
            </p>
          )}
          <VisibilityToggle />
        </div>
        {totalScore !== null && (
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 flex flex-col items-center min-w-[100px]">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">
                {info.name === "MDQ" ? "Result" : "Score"}
              </span>
              <span
                className={`font-bold text-stone-900 ${
                  info.name === "MDQ"
                    ? "text-lg sm:text-xl"
                    : "text-3xl sm:text-4xl"
                }`}
              >
                {info.name === "MDQ" ? severity || "—" : totalScore}
              </span>
            </div>
            {severity && info.name !== "MDQ" && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                {severity}
              </span>
            )}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">
          Question Responses
        </h4>
        <ul className="space-y-3">
          {(info.questions ? Object.entries(info.questions) : []).map(
            ([k, q]) => {
              const ans = (info.answers as any)?.[k];
              const opts = (info as any).getOptions?.(k) ?? info.options ?? [];
              const opt = optFor(opts, ans);
              const description = (info as any).descriptions?.[k];
              return (
                <li
                  key={k}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-stone-100 bg-white transition-all hover:border-stone-200"
                >
                  <div className="flex gap-4 flex-1 min-w-0">
                    <span className="shrink-0 text-stone-300 font-bold mt-1">
                      •
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-md font-medium text-stone-700 leading-relaxed">
                        {q}
                      </span>
                      {description && (
                        <p className="text-xs text-stone-400 mt-1 italic leading-relaxed">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 mt-1">
                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                        opt?.bg ?? "bg-stone-100"
                      } ${opt?.text ?? "text-stone-700"}`}
                    >
                      {opt?.label ?? "—"}
                    </span>
                  </div>
                </li>
              );
            },
          )}
        </ul>
      </div>
    </div>
  );
}
