// app/report/components/DetailPanels.tsx
"use client";
import React from "react";
import {
  KV,
  Gauge,
  Pill,
  AudioPlayer,
  ScrollableBox,
  CopyButton,
  HealthBar,
} from "./ui";
import { ProfileJson } from "../types";
import {
  ACE_RESILIENCE_QUESTIONS,
  ASRS5_QUESTIONS,
  GAD7_QUESTIONS,
  PHQ9_QUESTIONS,
  PSS4_QUESTIONS,
  PTSD_QUESTIONS,
  moodChangeOptions,
  behaviorChangeOptions,
  thoughtChangeOptions,
  alcoholFrequencyOptions,
  drinksPerOccasionOptions,
  degreeOptions,
  CRAFFT_PARTA_QUESTIONS,
  CRAFFT_QUESTIONS,
  genderOptions,
  SCARED_PARENT_QUESTIONS,
  DISC_CHILD_QUESTIONS,
  DISC_PARENT_QUESTIONS,
  SCARED_CHILD_QUESTIONS,
  SNAP_QUESTIONS,
} from "../text";
import {
  ChevronDown,
  ChevronUp,
  MessageSquareText,
  Pencil,
} from "lucide-react";

const scoreSum = (obj: Record<string, any> = {}) =>
  Object.values(obj).reduce(
    (a, v) => a + (typeof v === "string" ? Number(v) || 0 : v || 0),
    0
  );
const labelFor = (
  options: { value: string; label: string }[],
  value?: string | null
) =>
  value ? options.find((o) => o.value === value)?.label ?? value : undefined;

// Format phone number to XXX-XXX-XXXX
const formatPhoneNumber = (phone?: string) => {
  if (!phone) return "—";
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");
  // Format as XXX-XXX-XXXX if we have 10 digits
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  // Return original if not 10 digits
  return phone;
};

// Inside DetailPanels.tsx

export function GoalsDetail({ data }: { data: ProfileJson }) {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
      data-field="goals"
    >
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-900">
          Presenting Goals
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {/* Audio Response - First */}
        {data.goals?.audio?.fileName && (
          <AudioPlayer data={data} fieldName="goals" label="" />
        )}

        {/* Written Response - Second */}
        {data.goals?.text && (
          <div className="relative py-2 px-3 bg-slate-50/50 border border-slate-200/60 rounded-lg">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Pencil className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <h4 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                  Written Response
                </h4>
              </div>
              <CopyButton text={data.goals.text} />
            </div>
            <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
              {data.goals.text}
            </p>
          </div>
        )}

        {!data.goals?.text && !data.goals?.audio?.fileName && (
          <p className="text-[13px] text-slate-400">—</p>
        )}
      </div>
    </div>
  );
}

export function DemographicsDetail({ data }: { data: ProfileJson }) {
  const educationLabel =
    (labelFor(degreeOptions, data.parentEducation) as string | undefined) ??
    "—";
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Name"
            value={`${data.firstName} ${data.lastName}`}
            truncate={false}
          />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Pronouns"
            value={data.pronouns?.[0]?.label}
            truncate={false}
          />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV label="Age" value={data.age} truncate={false} />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV label="DOB" value={data.dob ? data.dob : "—"} />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV label="Phone" value={formatPhoneNumber(data.contactNumber)} />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV label="Email" value={data.email} />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Gender Identity"
            value={labelFor(genderOptions, data.genderIdentity)}
            truncate={false}
            alignRight={false}
          />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Ethnicity"
            value={data.ethnicity?.map((e: any) => e.label).join(", ")}
            truncate={false}
          />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Religion"
            value={data.religion?.map((r: any) => r.label).join(", ")}
            truncate={false}
          />
        </div>
        {!data.isChild && (
          <>
            <div className="rounded-xl border border-slate-200 p-3">
              <KV
                label="Marital"
                value={
                  data.isMarried
                    ? (() => {
                        function ordinal(n: number) {
                          const s = ["th", "st", "nd", "rd"],
                            v = n % 100;
                          return (
                            n +
                            (s[
                              v % 10 === 1 && v !== 11
                                ? 1
                                : v % 10 === 2 && v !== 12
                                ? 2
                                : v % 10 === 3 && v !== 13
                                ? 3
                                : 0
                            ] || "th") +
                            " Marriage"
                          );
                        }
                        if (
                          typeof data.timesMarried === "number" &&
                          data.timesMarried > 0
                        ) {
                          return `Married | ${ordinal(data.timesMarried)}`;
                        }
                        return "Married";
                      })()
                    : "Single"
                }
                truncate={false}
              />
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <KV
                label="Employment"
                value={data.isEmployed ? "Employed" : "Unemployed"}
                truncate={false}
              />
            </div>
          </>
        )}

        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Height"
            value={`${data.height?.feet || 0}'${data.height?.inches || 0}"`}
            truncate={false}
          />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Weight"
            value={data.weightLbs ? `${data.weightLbs} lb` : "—"}
            truncate={false}
          />
        </div>
      </div>

      {data.isChild && (
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-3 text-md font-semibold text-slate-800">
            Parent/Guardian Information
          </h3>
          <KV
            label="Parent/Guardian 1 Name"
            value={`${data.parent1FirstName} ${data.parent1LastName}`}
          />
          <KV
            label="Parent/Guardian 2 Name"
            value={`${data.parent2FirstName} ${data.parent2LastName}`}
          />
          <KV
            label="Parent/Guardian Occupation"
            value={data.parentOccupation}
          />
          <KV label="Parent/Guardian Employer" value={data.parentEmployer} />
          <KV label="Parent Education" value={educationLabel} />
        </div>
      )}
    </div>
  );
}

export function SafetyDetail({ data }: { data: ProfileJson }) {
  const assessments = data.assessments;
  const isNewSchema =
    assessments?.kind === "adult" || assessments?.kind === "child";
  const isChild = data.isChild || assessments?.kind === "child";

  // Adult suicide data
  const adultSuicide = !isChild
    ? isNewSchema
      ? (assessments as any)?.data?.suicide
      : assessments?.suicide
    : null;

  const selfHarm = !isChild
    ? isNewSchema
      ? (assessments as any)?.data?.selfHarm
      : assessments?.selfHarm
    : null;

  // Child CSSRS data
  const cssrs = isChild
    ? isNewSchema
      ? (assessments as any)?.data?.cssrs
      : assessments?.cssrs
    : null;

  const showMethodHow = cssrs?.thoughts === "yes";
  const showIntention = cssrs?.thoughts === "yes";
  const showPlan = cssrs?.thoughts === "yes";
  const showBehavior3mo = cssrs?.behavior === "yes";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-[13px]">
        {!isChild ? (
          <>
            {/* Adult Suicide Assessment */}
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-baseline justify-between gap-10 py-1.5">
                <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                  Suicidal thoughts
                </span>
                <Pill
                  tone={adultSuicide?.thoughts !== "yes" ? "success" : "danger"}
                >
                  {adultSuicide?.thoughts !== "yes" ? "Denied" : "Reported"}
                </Pill>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-baseline justify-between gap-10 py-1.5">
                <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                  Wish to be dead
                </span>
                <Pill
                  tone={adultSuicide?.wishDead !== "yes" ? "success" : "danger"}
                >
                  {adultSuicide?.wishDead !== "yes" ? "Denied" : "Reported"}
                </Pill>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-baseline justify-between gap-10 py-1.5">
                <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                  Plan
                </span>
                <Pill
                  tone={
                    adultSuicide?.plan?.trim() !== "yes" ? "success" : "danger"
                  }
                >
                  {adultSuicide?.plan?.trim() !== "yes"
                    ? "No Plan"
                    : "Has Plan"}
                </Pill>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-baseline justify-between gap-10 py-1.5">
                <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                  Intention
                </span>
                <Pill
                  tone={
                    adultSuicide?.intention?.trim() !== "yes"
                      ? "success"
                      : "danger"
                  }
                >
                  {adultSuicide?.intention?.trim() !== "yes"
                    ? "No Intent"
                    : "Has Intent"}
                </Pill>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-baseline justify-between gap-10 py-1.5">
                <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                  Recent self-harm
                </span>
                <Pill
                  tone={selfHarm?.pastMonth !== "yes" ? "success" : "danger"}
                >
                  {selfHarm?.pastMonth !== "yes" ? "No" : "Yes"}
                </Pill>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-baseline justify-between gap-10 py-1.5">
                <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                  Lifetime self-harm
                </span>
                <Pill
                  tone={selfHarm?.lifetime !== "yes" ? "success" : "danger"}
                >
                  {selfHarm?.lifetime !== "yes" ? "No" : "Yes"}
                </Pill>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Child CSSRS Assessment */}
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-baseline justify-between gap-10 py-1.5">
                <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                  Wished dead or not wake up
                </span>
                <Pill
                  tone={
                    cssrs?.wishDead === "yes"
                      ? "danger"
                      : cssrs?.wishDead === "no"
                      ? "success"
                      : "info"
                  }
                >
                  {cssrs?.wishDead === "yes"
                    ? "Yes"
                    : cssrs?.wishDead === "no"
                    ? "No"
                    : "—"}
                </Pill>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-baseline justify-between gap-10 py-1.5">
                <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                  Thoughts of killing self (past month)
                </span>
                <Pill
                  tone={
                    cssrs?.thoughts === "yes"
                      ? "danger"
                      : cssrs?.thoughts === "no"
                      ? "success"
                      : "info"
                  }
                >
                  {cssrs?.thoughts === "yes"
                    ? "Yes"
                    : cssrs?.thoughts === "no"
                    ? "No"
                    : "—"}
                </Pill>
              </div>
            </div>

            {showMethodHow && (
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-baseline justify-between gap-10 py-1.5">
                  <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                    Thinking about method
                  </span>
                  <Pill
                    tone={
                      cssrs?.methodHow === "yes"
                        ? "danger"
                        : cssrs?.methodHow === "no"
                        ? "success"
                        : "info"
                    }
                  >
                    {cssrs?.methodHow === "yes"
                      ? "Yes"
                      : cssrs?.methodHow === "no"
                      ? "No"
                      : "—"}
                  </Pill>
                </div>
              </div>
            )}

            {showIntention && (
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-baseline justify-between gap-10 py-1.5">
                  <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                    Intention to act
                  </span>
                  <Pill
                    tone={
                      cssrs?.intention === "yes"
                        ? "danger"
                        : cssrs?.intention === "no"
                        ? "success"
                        : "info"
                    }
                  >
                    {cssrs?.intention === "yes"
                      ? "Yes"
                      : cssrs?.intention === "no"
                      ? "No"
                      : "—"}
                  </Pill>
                </div>
              </div>
            )}

            {showPlan && (
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-baseline justify-between gap-10 py-1.5">
                  <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                    Worked out plan details
                  </span>
                  <Pill
                    tone={
                      cssrs?.plan === "yes"
                        ? "danger"
                        : cssrs?.plan === "no"
                        ? "success"
                        : "info"
                    }
                  >
                    {cssrs?.plan === "yes"
                      ? "Yes"
                      : cssrs?.plan === "no"
                      ? "No"
                      : "—"}
                  </Pill>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-baseline justify-between gap-10 py-1.5">
                <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                  Ever done/prepared anything to end life
                </span>
                <Pill
                  tone={
                    cssrs?.behavior === "yes"
                      ? "danger"
                      : cssrs?.behavior === "no"
                      ? "success"
                      : "info"
                  }
                >
                  {cssrs?.behavior === "yes"
                    ? "Yes"
                    : cssrs?.behavior === "no"
                    ? "No"
                    : "—"}
                </Pill>
              </div>
            </div>

            {showBehavior3mo && (
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-baseline justify-between gap-10 py-1.5">
                  <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
                    Within past 3 months
                  </span>
                  <Pill
                    tone={
                      cssrs?.behavior3mo === "yes"
                        ? "danger"
                        : cssrs?.behavior3mo === "no"
                        ? "success"
                        : "info"
                    }
                  >
                    {cssrs?.behavior3mo === "yes"
                      ? "Yes"
                      : cssrs?.behavior3mo === "no"
                      ? "No"
                      : "—"}
                  </Pill>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function StoryDetail({
  data,
  highlightField,
}: {
  data: ProfileJson;
  highlightField?: string;
}) {
  // Auto-scroll to highlighted field when modal opens
  React.useEffect(() => {
    if (highlightField) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        // Try to find element by data-field attribute first
        let element = document.querySelector(
          `[data-field="${highlightField}"]`
        );

        // If not found, try the dotted notation variants
        if (!element) {
          // Map dotted notation to non-dotted for data-field lookup
          const fieldMap: Record<string, string> = {
            "followupQuestions.question1": "followupQuestion1",
            "followupQuestions.question2": "followupQuestion2",
            "followupQuestions.question3": "followupQuestion3",
          };
          const mappedField = fieldMap[highlightField];
          if (mappedField) {
            element = document.querySelector(`[data-field="${mappedField}"]`);
          }
        }

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [highlightField]);

  // Gather fields
  console.log(data);
  const story = data.storyNarrative?.text?.trim();
  const storyAudioPath = data.storyNarrative?.audio?.fileName;
  const living = data.livingSituation?.text?.trim();
  const livingAudioPath = data.livingSituation?.audio?.fileName;
  const culture = data.cultureContext?.text?.trim();
  const cultureAudioPath = data.cultureContext?.audio?.fileName;
  const hasCulture = Boolean(culture || cultureAudioPath);

  const grewWith = data.upbringingWhoWith?.text?.trim();
  const env = data.upbringingEnvironments?.text?.trim();

  const famHistoryList = Array.isArray(data.familyHistory)
    ? (data.familyHistory as string[]).filter((s) => !!s && s.trim().length > 0)
    : [];

  const famElaboration = data.familyHistoryElaboration?.text?.trim();
  const childhoodComment =
    !data.likedChildhood && data.childhoodNegativeReason?.text
      ? data.childhoodNegativeReason.text.trim()
      : "";

  // Schooling/abilities helpers
  const triLabel = (v?: string) =>
    v === "good"
      ? "Good"
      : v === "average"
      ? "Average"
      : v === "poor"
      ? "Poor"
      : "—";
  const triTone = (v?: string) =>
    v === "good"
      ? "success"
      : v === "average"
      ? "warn"
      : v === "poor"
      ? "danger"
      : "info";
  const yn = (b: unknown) =>
    typeof b === "boolean" ? (b ? "Yes" : "No") : "—";

  return (
    <div className="space-y-5">
      <section
        className={`grid gap-4 ${
          hasCulture ? "lg:grid-cols-2" : "lg:grid-cols-2"
        }`}
      >
        {/* Story */}
        <div
          className={`${!hasCulture ? "col-span-2" : "col-span-2"} ${
            highlightField === "storyNarrative"
              ? "ring-2 ring-blue-400 ring-offset-2 rounded-xl"
              : ""
          }`}
          data-field="storyNarrative"
        >
          <ScrollableBox title="Story" className="h-[400px]">
            <div className="space-y-4">
              {/* Audio Response - First */}
              {storyAudioPath && (
                <AudioPlayer data={data} fieldName="storyNarrative" label="" />
              )}

              {/* Written Response - Second */}
              {story && (
                <div className="relative py-2 px-3 bg-slate-50/50 border border-slate-200/60 rounded-lg">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Pencil className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <h4 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                        Written Response
                      </h4>
                    </div>
                    <CopyButton text={story} />
                  </div>
                  <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                    {story}
                  </p>
                </div>
              )}

              {!story && !storyAudioPath && (
                <p className="text-[13px] text-slate-400">—</p>
              )}
            </div>
          </ScrollableBox>
        </div>

        {/* Living Situation */}
        <div
          className={`${
            !hasCulture ? "col-span-2" : "col-span-2 sm:col-span-1"
          } ${
            highlightField === "livingSituation"
              ? "ring-2 ring-blue-400 ring-offset-2 rounded-xl"
              : ""
          }`}
          data-field="livingSituation"
        >
          <ScrollableBox title="Living Situation" className="h-[400px]">
            <div className="space-y-4">
              {/* Audio Response - First */}
              {livingAudioPath && (
                <AudioPlayer data={data} fieldName="livingSituation" label="" />
              )}

              {/* Written Response - Second */}
              {living && (
                <div className="relative py-2 px-3 bg-slate-50/50 border border-slate-200/60 rounded-lg">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Pencil className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <h4 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                        Written Response
                      </h4>
                    </div>
                    <CopyButton text={living} />
                  </div>
                  <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                    {living}
                  </p>
                </div>
              )}

              {!living && !livingAudioPath && (
                <p className="text-[13px] text-slate-400">—</p>
              )}
            </div>
          </ScrollableBox>
        </div>

        {/* Cultural Context */}
        {hasCulture && (
          <div
            className={`col-span-2 sm:col-span-1 ${
              highlightField === "cultureContext"
                ? "ring-2 ring-blue-400 ring-offset-2 rounded-xl"
                : ""
            }`}
            data-field="cultureContext"
          >
            <ScrollableBox title="Cultural / Context" className="h-[400px]">
              <div className="space-y-4">
                {/* Audio Response - First */}
                {cultureAudioPath && (
                  <AudioPlayer
                    data={data}
                    fieldName="cultureContext"
                    label=""
                  />
                )}

                {/* Written Response - Second */}
                {culture && (
                  <div className="relative py-2 px-3 bg-slate-50/50 border border-slate-200/60 rounded-lg">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Pencil className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <h4 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                          Written Response
                        </h4>
                      </div>
                      <CopyButton text={culture} />
                    </div>
                    <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                      {culture}
                    </p>
                  </div>
                )}

                {!culture && !cultureAudioPath && (
                  <p className="text-[13px] text-slate-400">—</p>
                )}
              </div>
            </ScrollableBox>
          </div>
        )}
      </section>

      <h3 className="mb-3 text-sm font-semibold tracking-wide text-slate-900">
        {!data.isChild ? "Upbringing" : "Family History"}
      </h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div
          className={`rounded-xl border border-slate-200 bg-white overflow-hidden ${
            highlightField === "upbringingWhoWith"
              ? "ring-2 ring-blue-400 ring-offset-2"
              : ""
          }`}
          data-field="upbringingWhoWith"
        >
          <ScrollableBox
            title={
              data.isChild
                ? "Medical Issues (Father Side)"
                : "Who the patient grew up with"
            }
            className="border-0 h-40"
          >
            <div className="relative">
              {((data.isChild &&
                data.fatherSideMedicalIssues &&
                data.fatherSideMedicalIssues !== "—") ||
                (!data.isChild && grewWith && grewWith !== "—")) && (
                <div className="absolute top-0 right-0">
                  <CopyButton
                    text={
                      data.isChild
                        ? data.fatherSideMedicalIssues
                        : grewWith || ""
                    }
                  />
                </div>
              )}
              <p className="whitespace-pre-wrap text-[13px] text-slate-700 leading-relaxed">
                {data.isChild ? data.fatherSideMedicalIssues : grewWith || "—"}
              </p>
            </div>
          </ScrollableBox>
        </div>
        <div
          className={`rounded-xl border border-slate-200 bg-white overflow-hidden ${
            highlightField === "upbringingEnvironments"
              ? "ring-2 ring-blue-400 ring-offset-2"
              : ""
          }`}
          data-field="upbringingEnvironments"
        >
          <ScrollableBox
            title={
              data.isChild
                ? "Medical Issues (Mother Side)"
                : "Upbringing Environments"
            }
            className="border-0 h-40"
          >
            <div className="relative">
              {((data.isChild &&
                data.motherSideMedicalIssues &&
                data.motherSideMedicalIssues !== "—") ||
                (!data.isChild && env && env !== "—")) && (
                <div className="absolute top-0 right-0">
                  <CopyButton
                    text={
                      data.isChild ? data.motherSideMedicalIssues : env || ""
                    }
                  />
                </div>
              )}
              <p className="whitespace-pre-wrap text-[13px] text-slate-700 leading-relaxed">
                {data.isChild ? data.motherSideMedicalIssues : env || "—"}
              </p>
            </div>
          </ScrollableBox>
        </div>
      </div>

      <section
        className={`mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden ${
          highlightField === "familyHistoryElaboration"
            ? "ring-2 ring-blue-400 ring-offset-2"
            : ""
        }`}
        data-field="familyHistoryElaboration"
      >
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h4 className="text-sm font-semibold text-slate-900">
            Family Mental Health History
          </h4>
        </div>
        <div className="p-4">
          <div className="grid gap-4 md:grid-cols-[1fr_3fr]">
            <div>
              {famHistoryList.length ? (
                <div className="flex flex-wrap gap-2">
                  {famHistoryList.map((d, i) => (
                    <Pill key={i} tone="info">
                      {d}
                    </Pill>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-slate-500">None reported</p>
              )}
            </div>
            <div className="md:border-l md:border-slate-200 md:pl-4 relative">
              {famElaboration && famElaboration !== "—" && (
                <div className="absolute top-0 right-0">
                  <CopyButton text={famElaboration} />
                </div>
              )}
              <p className="whitespace-pre-wrap text-[13px] text-slate-700 leading-relaxed">
                {famElaboration || "—"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schooling block for children */}
      {data.isChild && (
        <section className="mt-4 space-y-4">
          <h3 className="text-sm font-semibold tracking-wide text-slate-900">
            Schooling
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {/* School Info */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h4 className="text-sm font-semibold text-slate-900">
                  School Info
                </h4>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <KV
                    label="School name"
                    value={data.schoolInfo?.schoolName || "—"}
                    truncate={false}
                  />
                  <KV
                    label="Phone"
                    value={data.schoolInfo?.schoolPhoneNumber || "—"}
                  />
                  <KV
                    label="Years at school"
                    value={
                      typeof data.schoolInfo?.yearsAtSchool === "number"
                        ? `${data.schoolInfo!.yearsAtSchool} years`
                        : "—"
                    }
                  />
                  <KV label="Grade" value={data.schoolInfo?.grade || "—"} />
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <span className="text-[12px] text-slate-600">
                      Repeated a grade
                    </span>
                    <Pill
                      tone={triTone(
                        data.schoolInfo?.hasRepeatedGrade ? "poor" : undefined
                      )}
                    >
                      {yn(data.schoolInfo?.hasRepeatedGrade)}
                    </Pill>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <span className="text-[12px] text-slate-600">
                      Special classes
                    </span>
                    <Pill
                      tone={
                        data.schoolInfo?.hasSpecialClasses ? "warn" : "info"
                      }
                    >
                      {yn(data.schoolInfo?.hasSpecialClasses)}
                    </Pill>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <span className="text-[12px] text-slate-600">
                      Special services
                    </span>
                    <Pill
                      tone={
                        data.schoolInfo?.hasSpecialServices ? "warn" : "info"
                      }
                    >
                      {yn(data.schoolInfo?.hasSpecialServices)}
                    </Pill>
                  </div>
                </div>
                {(data.schoolInfo?.repeatedGradeDetail ||
                  data.schoolInfo?.specialClassesDetail ||
                  data.schoolInfo?.specialServicesDetail) && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {data.schoolInfo?.repeatedGradeDetail ? (
                      <div className="relative rounded-xl border border-slate-200 p-2">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h5 className="text-[12px] font-medium text-slate-600">
                            Repeated grade · Reason
                          </h5>
                          <CopyButton
                            text={data.schoolInfo.repeatedGradeDetail}
                          />
                        </div>
                        <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                          {data.schoolInfo.repeatedGradeDetail}
                        </p>
                      </div>
                    ) : null}
                    {data.schoolInfo?.specialClassesDetail ? (
                      <div className="relative rounded-xl border border-slate-200 p-2">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h5 className="text-[12px] font-medium text-slate-600">
                            Special classes · Info
                          </h5>
                          <CopyButton
                            text={data.schoolInfo.specialClassesDetail}
                          />
                        </div>
                        <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                          {data.schoolInfo.specialClassesDetail}
                        </p>
                      </div>
                    ) : null}
                    {data.schoolInfo?.specialServicesDetail ? (
                      <div className="relative rounded-xl border border-slate-200 p-2 sm:col-span-2">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h5 className="text-[12px] font-medium text-slate-600">
                            Special services · Info
                          </h5>
                          <CopyButton
                            text={data.schoolInfo.specialServicesDetail}
                          />
                        </div>
                        <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                          {data.schoolInfo.specialServicesDetail}
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Relationships & Abilities */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h4 className="text-sm font-semibold text-slate-900">
                  Relationships & Abilities
                </h4>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <span className="text-[12px] text-slate-600">
                      Works independently
                    </span>
                    <Pill
                      tone={triTone(
                        data.relationshipsAbilities
                          ?.childAbilityWorkIndependently
                      )}
                    >
                      {triLabel(
                        data.relationshipsAbilities
                          ?.childAbilityWorkIndependently
                      )}
                    </Pill>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <span className="text-[12px] text-slate-600">
                      Organizes self
                    </span>
                    <Pill
                      tone={triTone(
                        data.relationshipsAbilities?.childAbilityOrganizeSelf
                      )}
                    >
                      {triLabel(
                        data.relationshipsAbilities?.childAbilityOrganizeSelf
                      )}
                    </Pill>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <span className="text-[12px] text-slate-600">
                      Attendance
                    </span>
                    <Pill
                      tone={triTone(
                        data.relationshipsAbilities?.childAttendance
                      )}
                    >
                      {triLabel(data.relationshipsAbilities?.childAttendance)}
                    </Pill>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                      <span className="text-[12px] text-slate-600">
                        Truancy proceedings
                      </span>
                      <Pill
                        tone={
                          data.relationshipsAbilities?.hadTruancyProceedings
                            ? "danger"
                            : "info"
                        }
                      >
                        {yn(data.relationshipsAbilities?.hadTruancyProceedings)}
                      </Pill>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                      <span className="text-[12px] text-slate-600">
                        School counseling
                      </span>
                      <Pill
                        tone={
                          data.relationshipsAbilities?.receivedSchoolCounseling
                            ? "warn"
                            : "info"
                        }
                      >
                        {yn(
                          data.relationshipsAbilities?.receivedSchoolCounseling
                        )}
                      </Pill>
                    </div>
                  </div>
                  <div className="relative rounded-xl border border-slate-200 p-2">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h5 className="text-[12px] font-medium text-slate-600">
                        Teacher/Peer Relationships
                      </h5>
                      {data.relationshipsAbilities?.teachersPeersRelationship &&
                        data.relationshipsAbilities
                          .teachersPeersRelationship !== "—" && (
                          <CopyButton
                            text={
                              data.relationshipsAbilities
                                .teachersPeersRelationship
                            }
                          />
                        )}
                    </div>
                    <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                      {data.relationshipsAbilities?.teachersPeersRelationship ||
                        "—"}
                    </p>
                  </div>
                  {data.relationshipsAbilities?.truancyProceedingsDetail ? (
                    <div className="relative rounded-xl border border-slate-200 p-2">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h5 className="text-[12px] font-medium text-slate-600">
                          Truancy proceedings · detail
                        </h5>
                        <CopyButton
                          text={
                            data.relationshipsAbilities.truancyProceedingsDetail
                          }
                        />
                      </div>
                      <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                        {data.relationshipsAbilities.truancyProceedingsDetail}
                      </p>
                    </div>
                  ) : null}
                  {data.relationshipsAbilities?.schoolCounselingDetail ? (
                    <div className="relative rounded-xl border border-slate-200 p-2">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h5 className="text-[12px] font-medium text-slate-600">
                          School counseling · detail
                        </h5>
                        <CopyButton
                          text={
                            data.relationshipsAbilities.schoolCounselingDetail
                          }
                        />
                      </div>
                      <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                        {data.relationshipsAbilities.schoolCounselingDetail}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Narrative fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Academic grades
                  </h4>
                </div>
                <div className="p-4 relative">
                  {data.schoolInfo?.academicGrades &&
                    data.schoolInfo.academicGrades !== "—" && (
                      <div className="absolute top-2 right-2">
                        <CopyButton text={data.schoolInfo.academicGrades} />
                      </div>
                    )}
                  <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {data.schoolInfo?.academicGrades || "—"}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Activities / interests / strengths
                  </h4>
                </div>
                <div className="p-4 relative">
                  {data.relationshipsAbilities?.activitiesInterestsStrengths &&
                    data.relationshipsAbilities.activitiesInterestsStrengths !==
                      "—" && (
                      <div className="absolute top-2 right-2">
                        <CopyButton
                          text={
                            data.relationshipsAbilities
                              .activitiesInterestsStrengths
                          }
                        />
                      </div>
                    )}
                  <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {data.relationshipsAbilities
                      ?.activitiesInterestsStrengths || "—"}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden md:col-span-2">
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Other concerns
                  </h4>
                </div>
                <div className="p-4 relative">
                  {data.relationshipsAbilities?.otherConcerns &&
                    data.relationshipsAbilities.otherConcerns !==
                      "No other concerns reported." && (
                      <div className="absolute top-2 right-2">
                        <CopyButton
                          text={data.relationshipsAbilities.otherConcerns}
                        />
                      </div>
                    )}
                  <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {data.relationshipsAbilities?.otherConcerns ||
                      "No other concerns reported."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Follow-up Questions Section */}
      {data.followupQuestions && (
        <section className="mt-4 space-y-4">
          <h3 className="text-sm font-semibold tracking-wide text-slate-900">
            Follow-up Questions
          </h3>

          {data.followupQuestions.question1 && (
            <div
              className={`rounded-xl border border-slate-200 bg-white overflow-hidden ${
                highlightField === "followupQuestion1" ||
                highlightField === "followupQuestions.question1"
                  ? "ring-2 ring-blue-400 ring-offset-2"
                  : ""
              }`}
              data-field="followupQuestion1"
            >
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h4 className="text-sm font-semibold text-slate-900">
                  Question 1
                </h4>
                <p className="mt-1 text-[12px] text-slate-600 italic">
                  {data.followupQuestions.question1.question}
                </p>
              </div>
              <div className="p-4">
                {data.followupQuestions.question1.answer?.text?.trim() && (
                  <div className="relative py-2 px-3 bg-slate-50/50 border border-slate-200/60 rounded-lg mb-3">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Pencil className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <h4 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                          Written Response
                        </h4>
                      </div>
                      <CopyButton
                        text={data.followupQuestions.question1.answer.text.trim()}
                      />
                    </div>
                    <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                      {data.followupQuestions.question1.answer.text.trim()}
                    </p>
                  </div>
                )}
                {data.followupQuestions.question1.answer?.audio?.fileName && (
                  <AudioPlayer
                    data={{
                      question1Answer: data.followupQuestions.question1.answer,
                    }}
                    fieldName="question1Answer"
                    label=""
                  />
                )}
                {!data.followupQuestions.question1.answer?.text?.trim() &&
                  !data.followupQuestions.question1.answer?.audio?.fileName && (
                    <p className="text-[13px] text-slate-400">—</p>
                  )}
              </div>
            </div>
          )}

          {data.followupQuestions.question2 && (
            <div
              className={`rounded-xl border border-slate-200 bg-white overflow-hidden ${
                highlightField === "followupQuestion2" ||
                highlightField === "followupQuestions.question2"
                  ? "ring-2 ring-blue-400 ring-offset-2"
                  : ""
              }`}
              data-field="followupQuestion2"
            >
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h4 className="text-sm font-semibold text-slate-900">
                  Question 2
                </h4>
                <p className="mt-1 text-[12px] text-slate-600 italic">
                  {data.followupQuestions.question2.question}
                </p>
              </div>
              <div className="p-4">
                {data.followupQuestions.question2.answer?.text?.trim() && (
                  <div className="relative py-2 px-3 bg-slate-50/50 border border-slate-200/60 rounded-lg mb-3">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Pencil className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <h4 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                          Written Response
                        </h4>
                      </div>
                      <CopyButton
                        text={data.followupQuestions.question2.answer.text.trim()}
                      />
                    </div>
                    <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                      {data.followupQuestions.question2.answer.text.trim()}
                    </p>
                  </div>
                )}
                {data.followupQuestions.question2.answer?.audio?.fileName && (
                  <AudioPlayer
                    data={{
                      question2Answer: data.followupQuestions.question2.answer,
                    }}
                    fieldName="question2Answer"
                    label=""
                  />
                )}
                {!data.followupQuestions.question2.answer?.text?.trim() &&
                  !data.followupQuestions.question2.answer?.audio?.fileName && (
                    <p className="text-[13px] text-slate-400">—</p>
                  )}
              </div>
            </div>
          )}

          {data.followupQuestions.question3 && (
            <div
              className={`rounded-xl border border-slate-200 bg-white overflow-hidden ${
                highlightField === "followupQuestion3" ||
                highlightField === "followupQuestions.question3"
                  ? "ring-2 ring-blue-400 ring-offset-2"
                  : ""
              }`}
              data-field="followupQuestion3"
            >
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h4 className="text-sm font-semibold text-slate-900">
                  Question 3
                </h4>
                <p className="mt-1 text-[12px] text-slate-600 italic">
                  {data.followupQuestions.question3.question}
                </p>
              </div>
              <div className="p-4">
                {data.followupQuestions.question3.answer?.text?.trim() && (
                  <div className="relative py-2 px-3 bg-slate-50/50 border border-slate-200/60 rounded-lg mb-3">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Pencil className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <h4 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                          Written Response
                        </h4>
                      </div>
                      <CopyButton
                        text={data.followupQuestions.question3.answer.text.trim()}
                      />
                    </div>
                    <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                      {data.followupQuestions.question3.answer.text.trim()}
                    </p>
                  </div>
                )}
                {data.followupQuestions.question3.answer?.audio?.fileName && (
                  <AudioPlayer
                    data={{
                      question3Answer: data.followupQuestions.question3.answer,
                    }}
                    fieldName="question3Answer"
                    label=""
                  />
                )}
                {!data.followupQuestions.question3.answer?.text?.trim() &&
                  !data.followupQuestions.question3.answer?.audio?.fileName && (
                    <p className="text-[13px] text-slate-400">—</p>
                  )}
              </div>
            </div>
          )}
        </section>
      )}

      {childhoodComment && (
        <div
          className={`mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden ${
            highlightField === "childhoodNegativeReason"
              ? "ring-2 ring-blue-400 ring-offset-2"
              : ""
          }`}
          data-field="childhoodNegativeReason"
        >
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h4 className="text-sm font-semibold text-slate-900">
              Negative Childhood Comments
            </h4>
          </div>
          <div className="p-4 relative">
            <div className="absolute top-2 right-2">
              <CopyButton text={childhoodComment} />
            </div>
            <p className="whitespace-pre-wrap text-[13px] text-slate-700 leading-relaxed">
              {childhoodComment}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function MedsDetail({ data }: { data: ProfileJson }) {
  const meds = data.currentMedications ?? [];
  const prev = data.previousMedications ?? [];
  return (
    <div className="space-y-3">
      <h3 className="text-md font-semibold text-slate-800">Current</h3>
      {meds.length ? (
        <ul className="space-y-3">
          {meds.map((m: any, i: number) => (
            <li key={i} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-slate-900">
                  {m.name} · {m.dosage}
                </p>
                <span className="text-[12px] text-slate-500">
                  {m.frequency}
                </span>
              </div>
              <p className="text-[12px] text-slate-600">
                {m.purpose}
                {m.prescriber ? ` — ${m.prescriber}` : ""}
              </p>
              {m.comments && (
                <p className="mt-1 text-[12px] text-slate-500">{m.comments}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-slate-500">
          No current medications reported.
        </p>
      )}
      <h3 className="text-md font-semibold text-slate-800">Previous</h3>
      {prev.length ? (
        <ul className="space-y-3">
          {prev.map((m: any, i: number) => (
            <li key={i} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-slate-900">
                  {m.name} · {m.dosage}
                </p>
                <span className="text-[12px] text-slate-500">
                  {m.frequency}
                </span>
              </div>
              <p className="text-[12px] text-slate-600">
                {m.purpose}
                {m.prescriber ? ` — ${m.prescriber}` : ""}
              </p>
              {m.comments && (
                <p className="mt-1 text-[12px] text-slate-500">{m.comments}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-slate-500">
          No current medications reported.
        </p>
      )}
    </div>
  );
}

export function AllergiesDetail({ data }: { data: ProfileJson }) {
  return (
    <div className="space-y-3">
      {data.medicalAllergies?.length ? (
        <ul className="space-y-3">
          {data.medicalAllergies.map((a: any, i: number) => (
            <li
              key={i}
              className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{a.name}</span>
                <span className="text-[12px]">{a.reaction}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-slate-500">None reported</p>
      )}
    </div>
  );
}

export function HospitalizationsDetail({ data }: { data: ProfileJson }) {
  const hasHosp =
    Array.isArray(data.previousHospitalizations) &&
    data.previousHospitalizations.length > 0;
  const inj = data.previousInjuries ?? null;
  const injHasContent =
    !!inj &&
    (Boolean(inj.injuryList && inj.injuryList.trim().length) ||
      Boolean(inj.explanation && inj.explanation.trim().length));

  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-2 text-md font-semibold text-slate-900">
          Hospitalizations
        </h3>
        {hasHosp ? (
          <ul className="space-y-3">
            {data.previousHospitalizations!.map((h: any, i: number) => (
              <li key={i} className="rounded-xl border border-slate-200 p-3">
                <p className="text-[13px] font-medium text-slate-900">
                  {h.hospitalName}
                </p>
                <p className="text-[12px] text-slate-600">
                  {h.date ? new Date(h.date).toLocaleDateString() : "—"} —{" "}
                  {h.location}
                </p>
                <p className="text-[12px] text-slate-600">{h.reason}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-slate-500">
            No hospitalizations reported
          </p>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-md font-semibold text-slate-900">Injuries</h3>
        {injHasContent ? (
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="relative">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-[13px] font-semibold text-slate-900">
                    Injury List
                  </h4>
                  {inj!.injuryList && inj!.injuryList !== "—" && (
                    <CopyButton text={inj!.injuryList} />
                  )}
                </div>
                <p className="whitespace-pre-wrap text-[13px] text-slate-800">
                  {inj!.injuryList || "—"}
                </p>
              </div>
              <div className="md:border-l md:border-slate-200 md:pl-4 relative">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-[13px] font-semibold text-slate-900">
                    Explanation
                  </h4>
                  {inj!.explanation && inj!.explanation !== "—" && (
                    <CopyButton text={inj!.explanation} />
                  )}
                </div>
                <p className="whitespace-pre-wrap text-[13px] text-slate-800">
                  {inj!.explanation || "—"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-slate-500">No injuries reported</p>
        )}
      </section>
    </div>
  );
}

export function RelationshipsDetail({ data }: { data: ProfileJson }) {
  type Strength = "really_bad" | "not_great" | "pretty_good" | "really_good";

  const strengthLevel = (s: Strength): number => {
    switch (s) {
      case "really_good":
        return 4;
      case "pretty_good":
        return 3;
      case "not_great":
        return 2;
      case "really_bad":
        return 1;
      default:
        return 0;
    }
  };

  const strengthLabel = (s: Strength) =>
    s === "really_good"
      ? "Really good"
      : s === "pretty_good"
      ? "Pretty good"
      : s === "not_great"
      ? "Not great"
      : "Really bad";

  const strengthStyles = (s: Strength) => {
    switch (s) {
      case "really_good":
        return "border-emerald-200 bg-emerald-50";
      case "pretty_good":
        return "border-green-200 bg-green-50/50";
      case "not_great":
        return "border-amber-200 bg-amber-50/50";
      default:
        return "border-rose-200 bg-rose-50/50";
    }
  };

  const moodBadge = (happy: boolean) => {
    const tone = happy ? "success" : "danger";
    const label = happy ? "Happy" : "Unhappy";
    return <Pill tone={tone}>{label}</Pill>;
  };

  const items = Array.isArray(data.relationships) ? data.relationships : [];
  if (!items.length) {
    return <p className="text-[13px] text-slate-500">None reported</p>;
  }

  // Group items
  const strong = items.filter((r: any) => r.strength === "really_good");
  const moderate = items.filter((r: any) => r.strength === "pretty_good");
  const strained = items.filter(
    (r: any) => r.strength === "not_great" || r.strength === "really_bad"
  );

  const renderSection = (title: string, relationships: any[]) => {
    if (!relationships.length) return null;
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2">
          {title}
        </h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relationships.map((r: any) => (
            <div
              key={r.id}
              className={`rounded-xl border p-4 transition-all hover:shadow-sm ${strengthStyles(
                r.strength
              )}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-slate-900 truncate">
                    {r.name}
                  </p>
                  <p className="text-[12px] font-medium text-slate-600">
                    {r.role}
                  </p>
                </div>
                <div className="shrink-0">{moodBadge(Boolean(r.happy))}</div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-black/5">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Connection
                </span>
                <HealthBar level={strengthLevel(r.strength)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderSection("Strong Connections", strong)}
      {renderSection("Moderate Connections", moderate)}
      {renderSection("Strained / Difficult", strained)}
    </div>
  );
}

export function PrevTreatmentDetail({ data }: { data: ProfileJson }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h4 className="text-[13px] font-semibold text-slate-900">Summary</h4>
          {data.prevTreatmentSummary?.text && (
            <CopyButton text={data.prevTreatmentSummary.text} />
          )}
        </div>
        <p className="whitespace-pre-wrap text-[13px] text-slate-800">
          {data.prevTreatmentSummary?.text || "—"}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
            Length of treatment
          </h4>
          <p className="text-[13px] text-slate-800">
            {data.therapyDuration || "—"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
            Previous diagnosis
          </h4>
          <p className="text-[13px] text-slate-800">
            {data.previousDiagnosis || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function GlanceDetail({ data }: { data: ProfileJson }) {
  const mapValsToLabels = (
    vals: string[] | undefined,
    options: { value: string; label: string }[]
  ) =>
    (vals ?? [])
      .map((v) => options.find((o) => o.value === v)?.label ?? v)
      .filter(Boolean);
  const educationLabel =
    (labelFor(degreeOptions, data.highestDegree) as string | undefined) ?? "—";
  const alcoholFreqLabel = labelFor(
    alcoholFrequencyOptions,
    data.alcoholFrequency
  );
  const drinksLabel = labelFor(
    drinksPerOccasionOptions,
    data.drinksPerOccasion
  );
  let alcoholValue = "—";
  if (alcoholFreqLabel) {
    if ((data.alcoholFrequency ?? "") === "none") {
      alcoholValue = alcoholFreqLabel;
    } else {
      alcoholValue = `${alcoholFreqLabel} · ~${
        drinksLabel ?? "—"
      } drinks each time`;
    }
  }

  const moodChangesList = mapValsToLabels(
    data.moodChanges as string[] | undefined,
    moodChangeOptions
  );
  const thoughtChangesList = mapValsToLabels(
    data.thoughtChanges as string[] | undefined,
    thoughtChangeOptions
  );
  const behaviorChangesList = mapValsToLabels(
    data.behaviorChanges as string[] | undefined,
    behaviorChangeOptions
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
        {!data.isChild && (
          <>
            <div className="rounded-xl border border-slate-200 p-3">
              <KV
                label="Occupation"
                value={<span title={data.jobDetails}>{data.jobDetails}</span>}
                truncate={false}
              />
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <KV
                label="Hobbies"
                value={<span title={data.hobbies}>{data.hobbies}</span>}
                truncate={false}
              />
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <KV
                label="Diet"
                value={
                  data.dietType?.map((d: any) => d.label).join(", ") || "—"
                }
                truncate={false}
              />
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <KV label="Alcohol" value={alcoholValue} truncate={false} />
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <KV
                label="Sexually active"
                value={data.isSexuallyActive ? "Yes" : "No"}
              />
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <KV label="Partners" value={data.sexualPartners || "—"} />
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <KV label="Education" value={educationLabel} />
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <KV
                label="Positive childhood"
                value={data.likedChildhood ? "Yes" : "No"}
              />
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <KV
                label="Substances"
                value={
                  Array.isArray((data as any).substancesUsed)
                    ? (data as any).substancesUsed
                        .map((x: any) => x.label)
                        .join(", ")
                    : "—"
                }
                truncate={false}
              />
            </div>
          </>
        )}
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Sexual Orientation"
            value={
              data.sexualOrientation?.map((s: any) => s.label).join(", ") || "—"
            }
          />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Has a Firearm"
            value={
              typeof data.hasFirearm === "boolean"
                ? data.hasFirearm
                  ? "Yes"
                  : "No"
                : "—"
            }
          />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Daily Mobile Screen Time"
            value={data.dailyMobileScreenTime + " hrs" || "—"}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-slate-900">
          2-Week Screen
        </h3>

        <div className="grid gap-3 md:grid-cols-3">
          {/* Mood Changes */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <h4 className="mb-2 text-[13px] font-medium text-slate-900">
              Mood Changes
            </h4>
            {moodChangesList.length ? (
              <div className="flex flex-wrap gap-2">
                {moodChangesList.map((label, i) => (
                  <Pill key={i} tone="info">
                    {label}
                  </Pill>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-slate-500">None reported</p>
            )}
          </div>

          {/* Thought Changes */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <h4 className="mb-2 text-[13px] font-medium text-slate-900">
              Thought Changes
            </h4>
            {thoughtChangesList.length ? (
              <div className="flex flex-wrap gap-2">
                {thoughtChangesList.map((label, i) => (
                  <Pill key={i} tone="info">
                    {label}
                  </Pill>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-slate-500">None reported</p>
            )}
          </div>

          {/* Behavior Changes */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <h4 className="mb-2 text-[13px] font-medium text-slate-900">
              Behavior Changes
            </h4>
            {behaviorChangesList.length ? (
              <div className="flex flex-wrap gap-2">
                {behaviorChangesList.map((label, i) => (
                  <Pill key={i} tone="info">
                    {label}
                  </Pill>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-slate-500">None reported</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScalesDetail({ data }: { data: ProfileJson }) {
  const assessments = data.assessments;
  const isNewSchema =
    assessments?.kind === "adult" || assessments?.kind === "child";
  const isChild = data.isChild || assessments?.kind === "child";

  // --- Likert option maps with colors ---
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

  const snap0to3: readonly Opt[] = [
    {
      key: "0",
      label: "Not at all",
      bg: "bg-emerald-100",
      text: "text-emerald-800",
    },
    {
      key: "1",
      label: "Just a little",
      bg: "bg-yellow-100",
      text: "text-yellow-800",
    },
    {
      key: "2",
      label: "Quite a bit",
      bg: "bg-orange-100",
      text: "text-orange-800",
    },
    {
      key: "3",
      label: "Very much",
      bg: "bg-rose-100",
      text: "text-rose-800",
    },
  ];

  const scared0to2: readonly Opt[] = [
    {
      key: "0",
      label: "Not true/Hardly ever",
      bg: "bg-emerald-100",
      text: "text-emerald-800",
    },
    {
      key: "1",
      label: "Somewhat/Sometimes",
      bg: "bg-yellow-100",
      text: "text-yellow-800",
    },
    {
      key: "2",
      label: "Very true/Often",
      bg: "bg-rose-100",
      text: "text-rose-800",
    },
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

  const reversePssLikertValue = (value: any) => {
    if (value === undefined || value === null || value === "") return value;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return value;
    return String(4 - numeric);
  };

  const pssValueTransformers: Record<string, (value: any) => any> = {
    pss2: reversePssLikertValue,
    pss3: reversePssLikertValue,
  };

  const preferRawValue = (raw: any, fallback: any) =>
    raw === undefined || raw === null || raw === "" ? fallback : raw;

  const pssColorValueTransformers: Record<
    string,
    (rawValue: any, transformedValue: any) => any
  > = {
    pss2: (rawValue, transformedValue) =>
      preferRawValue(rawValue, transformedValue),
    pss3: (rawValue, transformedValue) =>
      preferRawValue(rawValue, transformedValue),
  };

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

  function Block({
    label,
    score,
    max,
    caption,
    questions,
    answers,
    options,
    headerNote,
    valueTransformers,
    colorValueTransformers,
  }: {
    label: string;
    score: number;
    max: number;
    caption: string;
    questions: Record<string, string>;
    answers: Record<string, any> | undefined;
    options: readonly Opt[];
    headerNote?: string;
    valueTransformers?: Record<string, (value: any) => any>;
    colorValueTransformers?: Record<
      string,
      (rawValue: any, transformedValue: any) => any
    >;
  }) {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [showTopArrow, setShowTopArrow] = React.useState(false);
    const [showBottomArrow, setShowBottomArrow] = React.useState(false);

    const checkScroll = () => {
      const el = scrollRef.current;
      if (!el) return;

      const hasScroll = el.scrollHeight > el.clientHeight;
      if (!hasScroll) {
        setShowTopArrow(false);
        setShowBottomArrow(false);
        return;
      }

      const atTop = el.scrollTop < 10;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;

      setShowTopArrow(!atTop);
      setShowBottomArrow(!atBottom);
    };

    React.useEffect(() => {
      checkScroll();
      const el = scrollRef.current;
      if (el) {
        el.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);
        return () => {
          el.removeEventListener("scroll", checkScroll);
          window.removeEventListener("resize", checkScroll);
        };
      }
    }, [questions]);

    return (
      <section className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 min-w-0 flex flex-col max-h-[600px]">
        {/* Sticky header with gauge */}
        <div className="flex-shrink-0 mb-3 pb-3 border-b border-slate-200 bg-white">
          <div className="grid items-center gap-3 md:grid-cols-[200px,1fr] lg:grid-cols-[220px,1fr] min-w-0">
            <Gauge label={label} score={score} max={max} caption={caption} />
            {headerNote && (
              <h4 className="text-[13px] font-semibold text-slate-900">
                {headerNote}
              </h4>
            )}
          </div>
        </div>

        {/* Scrollable questions with arrow indicators */}
        <div className="relative flex-1 min-h-0">
          {/* Top scroll indicator */}
          {showTopArrow && (
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10 flex items-start justify-center pointer-events-none">
              <div className="animate-bounce bg-white p-[2px] rounded-full shadow-md">
                <ChevronUp />
              </div>
            </div>
          )}

          <div
            ref={scrollRef}
            className="h-full overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <ul className="text-[12px] sm:text-[13px] text-slate-800 divide-y divide-slate-200 break-words">
              {Object.entries(questions).map(([k, q]) => {
                const rawValue = (answers as any)?.[k];
                const adjustedValue = valueTransformers?.[k]
                  ? valueTransformers[k](rawValue)
                  : rawValue;
                const colorValue = colorValueTransformers?.[k]
                  ? colorValueTransformers[k](rawValue, adjustedValue)
                  : adjustedValue;
                const labelOpt = optFor(options, adjustedValue);
                const colorOpt = optFor(options, colorValue);
                return (
                  <li
                    key={k}
                    className="flex items-start justify-between gap-2 sm:gap-3 py-2 first:pt-0 last:pb-0"
                  >
                    <div className="flex gap-2 flex-1 min-w-0">
                      <span className="shrink-0 text-slate-500">•</span>
                      <span className="flex-1 min-w-0 break-words">{q}</span>
                    </div>
                    <div className="shrink-0">
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-[11px] sm:text-[12px] ${
                          colorOpt?.bg ?? "bg-slate-100"
                        } ${colorOpt?.text ?? "text-slate-700"}`}
                      >
                        {labelOpt?.label ?? "—"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom scroll indicator */}
          {showBottomArrow && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 flex items-end justify-center pointer-events-none">
              <div className="animate-bounce bg-white p-[2px] rounded-full shadow-md">
                <ChevronDown />
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Legacy adult schema
  if (!isNewSchema && !isChild) {
    const A = assessments ?? {};
    const gadScore = scoreSum(A.gad7);
    const phqScore = scoreSum(A.phq9);
    const pssScore = scoreSum(A.stress);
    const asrsScore = scoreSum(A.asrs5);
    const ptsdYes = Object.values(A.ptsd ?? {}).filter(
      (v: any) => String(v).toLowerCase() === "yes"
    ).length;
    const aceScore = scoreSum(A.aceResilience);

    const crafftKeys = [
      "car",
      "relax",
      "alone",
      "forget",
      "familyFriends",
      "trouble",
    ] as const;
    const crafftB = (A.crafft?.partB ?? {}) as Record<string, any>;
    const crafftScore = crafftKeys.reduce(
      (n, k) => n + (String(crafftB[k] ?? "").toLowerCase() === "yes" ? 1 : 0),
      0
    );

    function CRAFFTBlock() {
      const pA = (A.crafft?.partA ?? {}) as Record<string, any>;
      const pB = (A.crafft?.partB ?? {}) as Record<string, any>;

      return (
        <section className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 min-w-0">
          <div className="mb-3 grid items-start gap-3 md:grid-cols-[200px,1fr] lg:grid-cols-[220px,1fr] min-w-0">
            <Gauge
              label="CRAFFT 2.1"
              score={crafftScore}
              max={6}
              caption="Count of 'Yes' responses (max 6). Part A shows days of use."
            />
            <div className="min-w-0 overflow-hidden">
              <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                During the past 12 months
              </h4>

              {/* Part A: Days of use */}
              <div className="mb-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {Object.entries(CRAFFT_PARTA_QUESTIONS).map(([k, q]) => (
                  <div
                    key={k}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-2"
                  >
                    <div className="text-[11px] sm:text-[12px] text-slate-600 mb-1 leading-snug">
                      {q}
                    </div>
                    <div className="text-[12px] sm:text-[13px] font-semibold text-slate-900">
                      {pA?.[k] !== undefined && pA?.[k] !== ""
                        ? `${pA[k]} days`
                        : "—"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Part B: Yes/No items */}
              <ul className="text-[12px] sm:text-[13px] text-slate-800 divide-y divide-slate-200 break-words">
                {Object.entries(CRAFFT_QUESTIONS).map(([k, q]) => {
                  const ans = pB?.[k];
                  const opt = optFor(yesNo, ans);
                  return (
                    <li
                      key={k}
                      className="flex items-start justify-between gap-2 sm:gap-3 py-2 first:pt-0 last:pb-0"
                    >
                      <div className="flex gap-2 flex-1 min-w-0">
                        <span className="shrink-0 text-slate-500">•</span>
                        <span className="flex-1 min-w-0 break-words">{q}</span>
                      </div>
                      <div className="shrink-0">
                        <span
                          className={`ml-2 rounded-full px-2 py-0.5 text-[11px] sm:text-[12px] ${
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
        </section>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3 min-w-0">
        <Block
          label="GAD-7"
          score={gadScore}
          max={21}
          caption="0–4 minimal · 5–9 mild · 10–14 moderate · 15–21 severe"
          questions={GAD7_QUESTIONS}
          answers={A.gad7}
          options={freq0to3}
          headerNote="Over the last 2 weeks"
        />
        <Block
          label="PHQ-9"
          score={phqScore}
          max={27}
          caption="0–4 minimal · 5–9 mild · 10–14 moderate · 15–19 moderately severe · 20-27 severe"
          questions={PHQ9_QUESTIONS}
          answers={A.phq9}
          options={freq0to3}
          headerNote="Over the last 2 weeks"
        />
        <Block
          label="PSS-4"
          score={pssScore}
          max={16}
          caption="higher = more stress"
          questions={PSS4_QUESTIONS}
          answers={A.stress}
          options={pss0to4}
          valueTransformers={pssValueTransformers}
          colorValueTransformers={pssColorValueTransformers}
        />
        <Block
          label="ASRS-5"
          score={asrsScore}
          max={24}
          caption=">14 = possible ADHD symptoms · <14 = ADHD less likely"
          questions={ASRS5_QUESTIONS}
          answers={A.asrs5}
          options={asrs0to4}
        />
        <Block
          label="PTSD flags"
          score={ptsdYes}
          max={5}
          caption="Count of 'Yes' responses"
          questions={PTSD_QUESTIONS}
          answers={A.ptsd}
          options={yesNo}
        />
        <Block
          label="ACE Resilience"
          score={aceScore}
          max={Object.keys(ACE_RESILIENCE_QUESTIONS).length * 4}
          caption="higher = more resilience"
          questions={ACE_RESILIENCE_QUESTIONS}
          answers={A.aceResilience}
          options={aceTrue5}
        />

        {/* CRAFFT: full-width last row */}
        <div className="md:col-span-2 2xl:col-span-3">
          <CRAFFTBlock />
        </div>
      </div>
    );
  }

  // New adult schema
  if (isNewSchema && assessments.kind === "adult") {
    const A = assessments.data;
    const gadScore = scoreSum(A?.gad7);
    const phqScore = scoreSum(A?.phq9);
    const pssScore = scoreSum(A?.stress);
    const asrsScore = scoreSum(A?.asrs5);
    const ptsdYes = Object.values(A?.ptsd ?? {}).filter(
      (v: any) => String(v).toLowerCase() === "yes"
    ).length;
    const aceScore = scoreSum(A?.aceResilience);

    const crafftKeys = [
      "car",
      "relax",
      "alone",
      "forget",
      "familyFriends",
      "trouble",
    ] as const;
    const crafftB = (A?.crafft?.partB ?? {}) as Record<string, any>;
    const crafftScore = crafftKeys.reduce(
      (n, k) => n + (String(crafftB[k] ?? "").toLowerCase() === "yes" ? 1 : 0),
      0
    );

    function CRAFFTBlock() {
      const pA = (A?.crafft?.partA ?? {}) as Record<string, any>;
      const pB = (A?.crafft?.partB ?? {}) as Record<string, any>;

      return (
        <section className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 min-w-0">
          <div className="mb-3 grid items-start gap-3 md:grid-cols-[200px,1fr] lg:grid-cols-[220px,1fr] min-w-0">
            <Gauge
              label="CRAFFT 2.1"
              score={crafftScore}
              max={6}
              caption="Count of 'Yes' responses (max 6). Part A shows days of use."
            />
            <div className="min-w-0 overflow-hidden">
              <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                During the past 12 months
              </h4>

              <div className="mb-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {Object.entries(CRAFFT_PARTA_QUESTIONS).map(([k, q]) => (
                  <div
                    key={k}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-2"
                  >
                    <div className="text-[11px] sm:text-[12px] text-slate-600 mb-1 leading-snug">
                      {q}
                    </div>
                    <div className="text-[12px] sm:text-[13px] font-semibold text-slate-900">
                      {pA?.[k] !== undefined && pA?.[k] !== ""
                        ? `${pA[k]} days`
                        : "—"}
                    </div>
                  </div>
                ))}
              </div>

              <ul className="text-[12px] sm:text-[13px] text-slate-800 divide-y divide-slate-200 break-words">
                {Object.entries(CRAFFT_QUESTIONS).map(([k, q]) => {
                  const ans = pB?.[k];
                  const opt = optFor(yesNo, ans);
                  return (
                    <li
                      key={k}
                      className="flex items-start justify-between gap-2 sm:gap-3 py-2 first:pt-0 last:pb-0"
                    >
                      <div className="flex gap-2 flex-1 min-w-0">
                        <span className="shrink-0 text-slate-500">•</span>
                        <span className="flex-1 min-w-0 break-words">{q}</span>
                      </div>
                      <div className="shrink-0">
                        <span
                          className={`ml-2 rounded-full px-2 py-0.5 text-[11px] sm:text-[12px] ${
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
        </section>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3 min-w-0">
        <Block
          label="GAD-7"
          score={gadScore}
          max={21}
          caption="0–4 minimal · 5–9 mild · 10–14 moderate · 15–21 severe"
          questions={GAD7_QUESTIONS}
          answers={A?.gad7}
          options={freq0to3}
          headerNote="Over the last 2 weeks"
        />
        <Block
          label="PHQ-9"
          score={phqScore}
          max={27}
          caption="0–4 minimal · 5–9 mild · 10–14 moderate · 15–19 moderately severe · 20-27 severe"
          questions={PHQ9_QUESTIONS}
          answers={A?.phq9}
          options={freq0to3}
          headerNote="Over the last 2 weeks"
        />
        <Block
          label="PSS-4"
          score={pssScore}
          max={16}
          caption="higher = more stress"
          questions={PSS4_QUESTIONS}
          answers={A?.stress}
          options={pss0to4}
          valueTransformers={pssValueTransformers}
          colorValueTransformers={pssColorValueTransformers}
        />
        <Block
          label="ASRS-5"
          score={asrsScore}
          max={24}
          caption=">14 = possible ADHD symptoms · <14 = ADHD less likely"
          questions={ASRS5_QUESTIONS}
          answers={A?.asrs5}
          options={asrs0to4}
        />
        <Block
          label="PTSD flags"
          score={ptsdYes}
          max={5}
          caption="Count of 'Yes' responses"
          questions={PTSD_QUESTIONS}
          answers={A?.ptsd}
          options={yesNo}
        />
        <Block
          label="ACE Resilience"
          score={aceScore}
          max={Object.keys(ACE_RESILIENCE_QUESTIONS).length * 4}
          caption="higher = more resilience"
          questions={ACE_RESILIENCE_QUESTIONS}
          answers={A?.aceResilience}
          options={aceTrue5}
        />

        <div className="md:col-span-2 2xl:col-span-3">
          <CRAFFTBlock />
        </div>
      </div>
    );
  }

  // Child schema
  if (isNewSchema && assessments.kind === "child") {
    const childData = assessments.data;

    // DISC Teen Depression scores
    const discSelf = childData?.discTeen?.self?.responses ?? {};
    const discSelfScore = Object.values(discSelf).reduce(
      (sum: number, val: any): number => sum + (val === "1" ? 1 : 0),
      0 as number
    ) as number;
    const discParent = childData?.discTeen?.parent?.responses ?? {};
    const discParentScore = Object.values(discParent).reduce(
      (sum: number, val: any): number => sum + (val === "1" ? 1 : 0),
      0 as number
    ) as number;
    const hasParentDisc = Object.keys(discParent).length > 0;

    // SNAP-IV scores
    const snapResponses = childData?.snap ?? {};
    const snapTotal = Object.values(snapResponses).reduce(
      (sum: number, val: any): number => sum + (Number(val) || 0),
      0 as number
    ) as number;

    // SNAP-IV Subscales
    const snapInattention = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(
      (sum, i) =>
        sum +
        (Number(
          snapResponses[
            `snap${String(i).padStart(2, "0")}` as keyof typeof snapResponses
          ]
        ) || 0),
      0
    );
    const snapHyperactivity = [10, 11, 12, 13, 14, 15, 16, 17, 18].reduce(
      (sum, i) =>
        sum +
        (Number(
          snapResponses[
            `snap${String(i).padStart(2, "0")}` as keyof typeof snapResponses
          ]
        ) || 0),
      0
    );
    const snapOpposition = [19, 20, 21, 22, 23, 24, 25, 26].reduce(
      (sum, i) =>
        sum +
        (Number(
          snapResponses[
            `snap${String(i).padStart(2, "0")}` as keyof typeof snapResponses
          ]
        ) || 0),
      0
    );

    // SCARED scores
    const scaredSelf = childData?.scared?.self?.responses ?? {};
    const scaredSelfScore = Object.values(scaredSelf).reduce(
      (sum: number, val: any): number => sum + (Number(val) || 0),
      0 as number
    ) as number;
    const scaredParent = childData?.scared?.parent?.responses ?? {};
    const scaredParentScore = Object.values(scaredParent).reduce(
      (sum: number, val: any): number => sum + (Number(val) || 0),
      0 as number
    ) as number;
    const hasParentScared = Object.keys(scaredParent).length > 0;

    return (
      <div className="space-y-4 min-w-0">
        {/* DISC and SCARED in 2-column grid */}
        <div className="grid gap-4 md:grid-cols-2 min-w-0">
          {/* DISC Teen Depression - Self Report */}
          <Block
            label="DISC (Self)"
            score={discSelfScore}
            max={22}
            caption="Columbia DISC Teen Depression Scale · 0-11 unlikely · 12+ possible MDD"
            questions={DISC_CHILD_QUESTIONS}
            answers={discSelf}
            options={yesNo}
            headerNote="Teen self-report (past 4 weeks)"
          />

          {/* DISC Teen Depression - Parent Report */}
          {hasParentDisc && (
            <Block
              label="DISC (Parent)"
              score={discParentScore}
              max={22}
              caption="Parent-report version · 0-11 unlikely · 12+ possible MDD"
              questions={DISC_PARENT_QUESTIONS}
              answers={discParent}
              options={yesNo}
              headerNote="Parent report (past 4 weeks)"
            />
          )}

          {/* SCARED - Self Report */}
          <Block
            label="SCARED (Self)"
            score={scaredSelfScore}
            max={82}
            caption="Screen for Child Anxiety · 0-24 low · 25+ significant anxiety symptoms"
            questions={SCARED_CHILD_QUESTIONS}
            answers={scaredSelf}
            options={scared0to2}
            headerNote="Child self-report"
          />

          {/* SCARED - Parent Report */}
          {hasParentScared && (
            <Block
              label="SCARED (Parent)"
              score={scaredParentScore}
              max={82}
              caption="Parent version · 0-24 low · 25+ significant anxiety symptoms"
              questions={SCARED_PARENT_QUESTIONS}
              answers={scaredParent}
              options={scared0to2}
              headerNote="Parent report"
            />
          )}
        </div>

        {/* SNAP-IV: Three separate subscale boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Block
            label="SNAP ADHD: Inattention"
            score={snapInattention}
            max={27}
            caption="<13 not significant · 13-17 mild · 18-22 moderate · 23-27 severe"
            questions={Object.fromEntries(
              [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
                const k = `snap${String(i).padStart(2, "0")}`;
                return [k, SNAP_QUESTIONS[k as keyof typeof SNAP_QUESTIONS]];
              })
            )}
            answers={snapResponses}
            options={snap0to3}
          />

          <Block
            label="SNAP ADHD: Hyperactivity"
            score={snapHyperactivity}
            max={27}
            caption="<13 not significant · 13-17 mild · 18-22 moderate · 23-27 severe"
            questions={Object.fromEntries(
              [10, 11, 12, 13, 14, 15, 16, 17, 18].map((i) => {
                const k = `snap${String(i).padStart(2, "0")}`;
                return [k, SNAP_QUESTIONS[k as keyof typeof SNAP_QUESTIONS]];
              })
            )}
            answers={snapResponses}
            options={snap0to3}
          />

          <Block
            label="SNAP ADHD: Opposition"
            score={snapOpposition}
            max={24}
            caption="<8 not significant · 8-13 mild · 14-18 moderate · 19-24 severe"
            questions={Object.fromEntries(
              [19, 20, 21, 22, 23, 24, 25, 26].map((i) => {
                const k = `snap${String(i).padStart(2, "0")}`;
                return [k, SNAP_QUESTIONS[k as keyof typeof SNAP_QUESTIONS]];
              })
            )}
            answers={snapResponses}
            options={snap0to3}
          />
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[13px] text-slate-500">No assessment data available</p>
    </div>
  );
}

export function MedicalHistoryDetail({ data }: { data: ProfileJson }) {
  if (!data.isChild) return null;

  const yn = (val?: boolean) => (val ? "Yes" : "No");

  return (
    <div className="space-y-4">
      {/* Neuropsych Evaluations */}
      {data.childMedicalHistory?.hasNeuropsychTesting && (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-md font-semibold text-slate-900">
            Neuropsychological Testing
          </h3>
          <div className="space-y-3">
            <KV
              label="Date of Evaluation"
              value={
                data.childMedicalHistory?.neuropsychEvalDate
                  ? new Date(
                      data.childMedicalHistory.neuropsychEvalDate
                    ).toLocaleDateString()
                  : "—"
              }
            />
            {data.childMedicalHistory?.neuropsychEvalReason && (
              <div className="relative">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[12px] font-medium text-slate-600">
                    Reason for Evaluation
                  </div>
                  <CopyButton
                    text={data.childMedicalHistory.neuropsychEvalReason}
                  />
                </div>
                <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                  {data.childMedicalHistory.neuropsychEvalReason}
                </p>
              </div>
            )}
            {data.childMedicalHistory?.neuropsychEvaluationsPerformed && (
              <div className="relative">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[12px] font-medium text-slate-600">
                    Evaluations Performed
                  </div>
                  <CopyButton
                    text={
                      data.childMedicalHistory.neuropsychEvaluationsPerformed
                    }
                  />
                </div>
                <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                  {data.childMedicalHistory.neuropsychEvaluationsPerformed}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Past Mental Health & Psychiatric History */}
      {data.childPsychiatricHistory?.treatmentKinds &&
        data.childPsychiatricHistory.treatmentKinds.length > 0 && (
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-md font-semibold text-slate-900">
              Past Mental Health Treatment
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-[12px] font-medium text-slate-600 mb-1">
                  Treatment Types
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.childPsychiatricHistory.treatmentKinds.map(
                    (t: any, i: number) => (
                      <Pill key={i} tone="info">
                        {t.label}
                      </Pill>
                    )
                  )}
                </div>
              </div>
              {data.childPsychiatricHistory?.firstTreatmentDate && (
                <KV
                  label="First Treatment Date"
                  value={new Date(
                    data.childPsychiatricHistory.firstTreatmentDate
                  ).toLocaleDateString()}
                />
              )}
              {data.childPsychiatricHistory?.individualDetails && (
                <div className="relative">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="text-[12px] font-medium text-slate-600">
                      Individual Psychotherapy Details
                    </div>
                    <CopyButton
                      text={data.childPsychiatricHistory.individualDetails}
                    />
                  </div>
                  <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                    {data.childPsychiatricHistory.individualDetails}
                  </p>
                </div>
              )}
              {data.childPsychiatricHistory?.groupDetails && (
                <div className="relative">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="text-[12px] font-medium text-slate-600">
                      Group Psychotherapy Details
                    </div>
                    <CopyButton
                      text={data.childPsychiatricHistory.groupDetails}
                    />
                  </div>
                  <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                    {data.childPsychiatricHistory.groupDetails}
                  </p>
                </div>
              )}
              {data.childPsychiatricHistory?.familyCouplesDetails && (
                <div className="relative">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="text-[12px] font-medium text-slate-600">
                      Family/Couples Therapy Details
                    </div>
                    <CopyButton
                      text={data.childPsychiatricHistory.familyCouplesDetails}
                    />
                  </div>
                  <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                    {data.childPsychiatricHistory.familyCouplesDetails}
                  </p>
                </div>
              )}
              {data.childPsychiatricHistory?.otherDetails && (
                <div className="relative">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="text-[12px] font-medium text-slate-600">
                      Other Treatment Details
                    </div>
                    <CopyButton
                      text={data.childPsychiatricHistory.otherDetails}
                    />
                  </div>
                  <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                    {data.childPsychiatricHistory.otherDetails}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

      {/* Medical History */}
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-md font-semibold text-slate-900">
          Medical History
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Psychiatric Hospitalization */}
          {data.childMedicalHistory?.psychiatricHospitalized !== undefined && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 relative">
              <KV
                label="Psychiatric Hospitalization"
                value={yn(data.childMedicalHistory.psychiatricHospitalized)}
              />
              {data.childMedicalHistory.psychiatricHospitalized &&
                data.childMedicalHistory.psychiatricHospitalizationDetails && (
                  <>
                    <div className="absolute top-2 right-2">
                      <CopyButton
                        text={
                          data.childMedicalHistory
                            .psychiatricHospitalizationDetails
                        }
                      />
                    </div>
                    <p className="mt-2 text-[12px] text-slate-700 whitespace-pre-wrap">
                      {
                        data.childMedicalHistory
                          .psychiatricHospitalizationDetails
                      }
                    </p>
                  </>
                )}
            </div>
          )}

          {/* Suicide Thoughts */}
          {data.childMedicalHistory?.suicideThoughtsEver !== undefined && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 relative">
              <KV
                label="Suicidal Thoughts"
                value={yn(data.childMedicalHistory.suicideThoughtsEver)}
              />
              {data.childMedicalHistory.suicideThoughtsEver &&
                data.childMedicalHistory.suicideThoughtsLastTimePlan && (
                  <>
                    <div className="absolute top-2 right-2">
                      <CopyButton
                        text={
                          data.childMedicalHistory.suicideThoughtsLastTimePlan
                        }
                      />
                    </div>
                    <p className="mt-2 text-[12px] text-slate-700 whitespace-pre-wrap">
                      {data.childMedicalHistory.suicideThoughtsLastTimePlan}
                    </p>
                  </>
                )}
            </div>
          )}

          {/* Suicide Attempt */}
          {data.childMedicalHistory?.suicideAttemptEver !== undefined && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 relative">
              <KV
                label="Suicide Attempt"
                value={yn(data.childMedicalHistory.suicideAttemptEver)}
              />
              {data.childMedicalHistory.suicideAttemptEver &&
                data.childMedicalHistory.suicideAttemptDetails && (
                  <>
                    <div className="absolute top-2 right-2">
                      <CopyButton
                        text={data.childMedicalHistory.suicideAttemptDetails}
                      />
                    </div>
                    <p className="mt-2 text-[12px] text-slate-700 whitespace-pre-wrap">
                      {data.childMedicalHistory.suicideAttemptDetails}
                    </p>
                  </>
                )}
            </div>
          )}

          {/* Self-Harm */}
          {data.childMedicalHistory?.selfHarmEver !== undefined && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 relative">
              <KV
                label="Self-Harm History"
                value={yn(data.childMedicalHistory.selfHarmEver)}
              />
              {data.childMedicalHistory.selfHarmEver && (
                <>
                  <KV
                    label="Currently Self-Harming"
                    value={yn(data.childMedicalHistory.selfHarmStill)}
                  />
                  {data.childMedicalHistory.selfHarmStill &&
                    data.childMedicalHistory.selfHarmFrequencyDetails && (
                      <>
                        <div className="absolute top-2 right-2">
                          <CopyButton
                            text={
                              data.childMedicalHistory.selfHarmFrequencyDetails
                            }
                          />
                        </div>
                        <p className="mt-2 text-[12px] text-slate-700 whitespace-pre-wrap">
                          {data.childMedicalHistory.selfHarmFrequencyDetails}
                        </p>
                      </>
                    )}
                </>
              )}
            </div>
          )}

          {/* Substance Use */}
          {data.childMedicalHistory?.substanceUseEver !== undefined && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 relative">
              <KV
                label="Substance Use"
                value={yn(data.childMedicalHistory.substanceUseEver)}
              />
              {data.childMedicalHistory.substanceUseEver &&
                data.childMedicalHistory.substanceUseDetails && (
                  <>
                    <div className="absolute top-2 right-2">
                      <CopyButton
                        text={data.childMedicalHistory.substanceUseDetails}
                      />
                    </div>
                    <p className="mt-2 text-[12px] text-slate-700 whitespace-pre-wrap">
                      {data.childMedicalHistory.substanceUseDetails}
                    </p>
                  </>
                )}
            </div>
          )}

          {/* Immunizations */}
          {data.childMedicalHistory?.immunizationsUpToDate !== undefined && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <KV
                label="Immunizations Up to Date"
                value={yn(data.childMedicalHistory.immunizationsUpToDate)}
              />
            </div>
          )}

          {/* Physical Exam */}
          {data.childMedicalHistory?.recentPhysicalExam && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <KV
                label="Most Recent Physical Exam"
                value={new Date(
                  data.childMedicalHistory.recentPhysicalExam
                ).toLocaleDateString()}
              />
              {data.childMedicalHistory.physicalExamDetails && (
                <p className="mt-2 text-[12px] text-slate-700 whitespace-pre-wrap">
                  {data.childMedicalHistory.physicalExamDetails}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Medical Conditions */}
        {data.childMedicalHistory?.medicalConditions &&
          data.childMedicalHistory.medicalConditions.length > 0 &&
          !data.childMedicalHistory.medicalConditions.includes("none") && (
            <div className="mt-4">
              <div className="text-[12px] font-medium text-slate-600 mb-2">
                Medical Conditions
              </div>
              <div className="flex flex-wrap gap-2">
                {data.childMedicalHistory.medicalConditions.map(
                  (condition: string, i: number) => (
                    <Pill key={i} tone="info">
                      {condition
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </Pill>
                  )
                )}
              </div>
              {data.childMedicalHistory.medicalConditionsOther && (
                <p className="mt-2 text-[12px] text-slate-700">
                  Other: {data.childMedicalHistory.medicalConditionsOther}
                </p>
              )}
            </div>
          )}
      </section>

      {/* Prenatal & Birth History */}
      {(data.childPrenatalHistory?.pregnancyHealthy !== undefined ||
        data.childPrenatalHistory?.fullTerm !== undefined) && (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-md font-semibold text-slate-900">
            Prenatal &amp; Birth History
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.childPrenatalHistory?.pregnancyHealthy !== undefined && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Healthy Pregnancy"
                  value={yn(data.childPrenatalHistory.pregnancyHealthy)}
                />
              </div>
            )}
            {data.childPrenatalHistory?.fullTerm !== undefined && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Full Term"
                  value={yn(data.childPrenatalHistory.fullTerm)}
                />
              </div>
            )}
            {data.childPrenatalHistory?.laborType && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Labor Type"
                  value={
                    data.childPrenatalHistory.laborType
                      .charAt(0)
                      .toUpperCase() +
                    data.childPrenatalHistory.laborType.slice(1)
                  }
                />
              </div>
            )}
            {data.childPrenatalHistory?.birthWeight && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Birth Weight"
                  value={data.childPrenatalHistory.birthWeight}
                />
              </div>
            )}
            {data.childPrenatalHistory?.presentationAtBirth && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Presentation"
                  value={
                    data.childPrenatalHistory.presentationAtBirth === "head"
                      ? "Head first"
                      : "Feet first"
                  }
                />
              </div>
            )}
            {data.childPrenatalHistory?.troubleStartingToBreathe !==
              undefined && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Trouble Breathing at Birth"
                  value={yn(data.childPrenatalHistory.troubleStartingToBreathe)}
                />
              </div>
            )}
            {data.childPrenatalHistory?.jaundiced !== undefined && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Jaundiced"
                  value={yn(data.childPrenatalHistory.jaundiced)}
                />
                {data.childPrenatalHistory.jaundiced &&
                  data.childPrenatalHistory.jaundiceTreatmentRequired && (
                    <p className="mt-2 text-[12px] text-slate-700">
                      Treatment:{" "}
                      {data.childPrenatalHistory.jaundiceTreatmentDetails ||
                        "Yes"}
                    </p>
                  )}
              </div>
            )}
            {data.childPrenatalHistory?.feedingMethod && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Feeding Method"
                  value={
                    data.childPrenatalHistory.feedingMethod
                      .charAt(0)
                      .toUpperCase() +
                    data.childPrenatalHistory.feedingMethod.slice(1)
                  }
                />
                {data.childPrenatalHistory.breastFeedingDuration && (
                  <p className="mt-1 text-[12px] text-slate-700">
                    Duration: {data.childPrenatalHistory.breastFeedingDuration}
                  </p>
                )}
              </div>
            )}
            {data.childPrenatalHistory?.gainedWeightWell !== undefined && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Gained Weight Well"
                  value={yn(data.childPrenatalHistory.gainedWeightWell)}
                />
              </div>
            )}
            {data.childPrenatalHistory?.totalPregnancies !== undefined && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Total Pregnancies"
                  value={data.childPrenatalHistory.totalPregnancies}
                />
              </div>
            )}
            {data.childPrenatalHistory?.liveBirths !== undefined && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Live Births"
                  value={data.childPrenatalHistory.liveBirths}
                />
              </div>
            )}
            {data.childPrenatalHistory?.birthOrder !== undefined && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Birth Order"
                  value={data.childPrenatalHistory.birthOrder}
                />
              </div>
            )}
          </div>

          {/* Complications */}
          {data.childPrenatalHistory?.hasComplications &&
            data.childPrenatalHistory.complicationsDetails && (
              <div className="relative mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[12px] font-medium text-amber-900">
                    Pregnancy Complications
                  </div>
                  <CopyButton
                    text={data.childPrenatalHistory.complicationsDetails}
                  />
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.complicationsDetails}
                </p>
              </div>
            )}

          {/* Medications During Pregnancy */}
          {data.childPrenatalHistory?.hadMedsDuringPregnancy &&
            data.childPrenatalHistory.medsDuringPregnancyDetails && (
              <div className="relative mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[12px] font-medium text-slate-900">
                    Medications During Pregnancy
                  </div>
                  <CopyButton
                    text={data.childPrenatalHistory.medsDuringPregnancyDetails}
                  />
                </div>
                <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                  {data.childPrenatalHistory.medsDuringPregnancyDetails}
                </p>
              </div>
            )}

          {/* Alcohol During Pregnancy */}
          {data.childPrenatalHistory?.hadAlcoholDuringPregnancy &&
            data.childPrenatalHistory.alcoholDuringPregnancyDetails && (
              <div className="relative mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[12px] font-medium text-amber-900">
                    Alcohol During Pregnancy
                  </div>
                  <CopyButton
                    text={
                      data.childPrenatalHistory.alcoholDuringPregnancyDetails
                    }
                  />
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.alcoholDuringPregnancyDetails}
                </p>
              </div>
            )}

          {/* Drugs During Pregnancy */}
          {data.childPrenatalHistory?.hadDrugsDuringPregnancy &&
            data.childPrenatalHistory.drugsDuringPregnancyDetails && (
              <div className="relative mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[12px] font-medium text-amber-900">
                    Drugs During Pregnancy
                  </div>
                  <CopyButton
                    text={data.childPrenatalHistory.drugsDuringPregnancyDetails}
                  />
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.drugsDuringPregnancyDetails}
                </p>
              </div>
            )}

          {/* Smoking During Pregnancy */}
          {data.childPrenatalHistory?.motherSmokedDuringPregnancy &&
            data.childPrenatalHistory.motherSmokedDuringPregnancyDetails && (
              <div className="relative mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[12px] font-medium text-amber-900">
                    Smoking During Pregnancy
                  </div>
                  <CopyButton
                    text={
                      data.childPrenatalHistory
                        .motherSmokedDuringPregnancyDetails
                    }
                  />
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.motherSmokedDuringPregnancyDetails}
                </p>
              </div>
            )}

          {/* Delivery Problems */}
          {data.childPrenatalHistory?.deliveryNormal === false &&
            data.childPrenatalHistory.deliveryProblems && (
              <div className="relative mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[12px] font-medium text-amber-900">
                    Delivery Problems
                  </div>
                  <CopyButton
                    text={data.childPrenatalHistory.deliveryProblems}
                  />
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.deliveryProblems}
                </p>
              </div>
            )}

          {/* Feeding Problems */}
          {data.childPrenatalHistory?.hadFeedingProblems &&
            data.childPrenatalHistory.feedingProblemsDetails && (
              <div className="relative mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[12px] font-medium text-amber-900">
                    Feeding Problems
                  </div>
                  <CopyButton
                    text={data.childPrenatalHistory.feedingProblemsDetails}
                  />
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.feedingProblemsDetails}
                </p>
              </div>
            )}

          {/* Early Problems */}
          {data.childPrenatalHistory?.hadEarlyProblems &&
            data.childPrenatalHistory.earlyProblemsDetails && (
              <div className="relative mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[12px] font-medium text-amber-900">
                    Early Problems (First Week/Month/Year)
                  </div>
                  <CopyButton
                    text={data.childPrenatalHistory.earlyProblemsDetails}
                  />
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.earlyProblemsDetails}
                </p>
              </div>
            )}
        </section>
      )}

      {/* Developmental History */}
      {(data.childDevelopmentalHistory?.activityLevel ||
        data.childDevelopmentalHistory?.earlyAffectiveStyle) && (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-md font-semibold text-slate-900">
            Developmental History
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.childDevelopmentalHistory?.activityLevel && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Activity Level"
                  value={
                    data.childDevelopmentalHistory.activityLevel === "other"
                      ? data.childDevelopmentalHistory.activityLevelOther ||
                        "Other"
                      : data.childDevelopmentalHistory.activityLevel
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")
                  }
                />
              </div>
            )}
            {data.childDevelopmentalHistory?.earlyAffectiveStyle && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Affective Style"
                  value={
                    data.childDevelopmentalHistory.earlyAffectiveStyle ===
                    "other"
                      ? data.childDevelopmentalHistory
                          .earlyAffectiveStyleOther || "Other"
                      : data.childDevelopmentalHistory.earlyAffectiveStyle
                          .charAt(0)
                          .toUpperCase() +
                        data.childDevelopmentalHistory.earlyAffectiveStyle.slice(
                          1
                        )
                  }
                />
              </div>
            )}
            {data.childDevelopmentalHistory?.cryingPattern && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Crying Pattern"
                  value={
                    data.childDevelopmentalHistory.cryingPattern === "other"
                      ? data.childDevelopmentalHistory.cryingPatternOther ||
                        "Other"
                      : data.childDevelopmentalHistory.cryingPattern
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")
                  }
                />
              </div>
            )}
            {data.childDevelopmentalHistory?.soothingWhenUpset && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Soothing When Upset"
                  value={
                    data.childDevelopmentalHistory.soothingWhenUpset === "other"
                      ? data.childDevelopmentalHistory.soothingWhenUpsetOther ||
                        "Other"
                      : data.childDevelopmentalHistory.soothingWhenUpset
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")
                  }
                />
              </div>
            )}
            {data.childDevelopmentalHistory?.reactionToStrangers && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <KV
                  label="Reaction to Strangers"
                  value={
                    data.childDevelopmentalHistory.reactionToStrangers
                      .charAt(0)
                      .toUpperCase() +
                    data.childDevelopmentalHistory.reactionToStrangers.slice(1)
                  }
                />
              </div>
            )}
          </div>

          {data.childDevelopmentalHistory?.responseToBeingHeld && (
            <div className="mt-4 rounded-xl border border-slate-200  p-3">
              <div className="text-[12px] font-medium text-slate-600 mb-1">
                Response to Being Held
              </div>
              <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                {data.childDevelopmentalHistory.responseToBeingHeld}
              </p>
            </div>
          )}

          {data.childDevelopmentalHistory?.eatingHabitsNotes && (
            <div className="mt-4 rounded-xl border border-slate-200  p-3">
              <div className="text-[12px] font-medium text-slate-600 mb-1">
                Eating Habits
              </div>
              <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                {data.childDevelopmentalHistory.eatingHabitsNotes}
              </p>
            </div>
          )}

          {data.childDevelopmentalHistory?.sleepingHabitsNotes && (
            <div className="mt-4 rounded-xl border border-slate-200  p-3">
              <div className="text-[12px] font-medium text-slate-600 mb-1">
                Sleeping Habits
              </div>
              <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                {data.childDevelopmentalHistory.sleepingHabitsNotes}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Developmental Milestones */}
      {(data.childDevelopmentalMilestones?.motor ||
        data.childDevelopmentalMilestones?.language ||
        data.childDevelopmentalMilestones?.adaptive) && (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-md font-semibold text-slate-900">
            Developmental Milestones (Later Than Expected)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.childDevelopmentalMilestones?.motor &&
              data.childDevelopmentalMilestones.motor.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[12px] font-semibold text-slate-900 mb-2">
                    Motor
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.childDevelopmentalMilestones.motor.map(
                      (m: string, i: number) => (
                        <Pill key={i} tone="warn">
                          {m
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </Pill>
                      )
                    )}
                  </div>
                </div>
              )}

            {data.childDevelopmentalMilestones?.language &&
              data.childDevelopmentalMilestones.language.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[12px] font-semibold text-slate-900 mb-2">
                    Language
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.childDevelopmentalMilestones.language.map(
                      (l: string, i: number) => (
                        <Pill key={i} tone="warn">
                          {l
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </Pill>
                      )
                    )}
                  </div>
                </div>
              )}

            {data.childDevelopmentalMilestones?.adaptive &&
              data.childDevelopmentalMilestones.adaptive.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[12px] font-semibold text-slate-900 mb-2">
                    Adaptive
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.childDevelopmentalMilestones.adaptive.map(
                      (a: string, i: number) => (
                        <Pill key={i} tone="warn">
                          {a
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </Pill>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>

          {data.childDevelopmentalMilestones?.notes && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[12px] font-medium text-slate-600 mb-1">
                Additional Notes
              </div>
              <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                {data.childDevelopmentalMilestones.notes}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
