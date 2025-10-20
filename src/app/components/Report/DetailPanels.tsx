// app/report/components/DetailPanels.tsx
"use client";
import React from "react";
import { KV, Gauge, Pill } from "./ui";
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
} from "../text";

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
// Inside DetailPanels.tsx

export function DemographicsDetail({ data }: { data: ProfileJson }) {
  return (
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
        <KV label="Phone" value={data.contactNumber} />
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
  );
}

export function SafetyDetail({ data }: { data: ProfileJson }) {
  const s = data.assessments?.suicide;
  const selfHarm = data.assessments?.selfHarm;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-[13px]">
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Suicidal thoughts"
            value={s?.thoughts === "no" ? "Denied" : "Reported"}
          />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Wish to be dead"
            value={s?.wishDead === "no" ? "Denied" : "Reported"}
          />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV label="Plan" value={s?.plan?.trim() || "None"} />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV label="Intention" value={s?.intention?.trim() || "None"} />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Recent self-harm"
            value={selfHarm?.pastMonth === "no" ? "No" : "Yes"}
          />
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <KV
            label="Lifetime self-harm"
            value={selfHarm?.lifetime === "no" ? "No" : "Yes"}
          />
        </div>
      </div>
    </div>
  );
}

export function StoryDetail({ data }: { data: ProfileJson }) {
  // Gather fields
  const story = data.storyNarrative?.text?.trim();
  const living = data.livingSituation?.text?.trim();
  const culture = data.cultureContext?.text?.trim();
  const hasCulture = Boolean(culture);

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

  function Box({
    title,
    children,
  }: {
    title: string;
    children?: React.ReactNode;
  }) {
    return (
      <div className="rounded-xl max-h-80 overflow-auto border border-slate-200 p-4">
        <h4 className="mb-2 text-md font-semibold text-slate-900">{title}</h4>
        <div className="whitespace-pre-wrap text-[13px]">{children ?? "—"}</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section
        className={`grid gap-4 ${
          hasCulture ? "lg:grid-cols-3" : "lg:grid-cols-2"
        }`}
      >
        <Box title="Story">{story || "—"}</Box>
        <Box title="Living Situation">{living || "—"}</Box>
        {hasCulture && <Box title="Cultural / Context">{culture}</Box>}
      </section>

      <h3 className="mb-3 text-sm font-semibold tracking-wide text-slate-900">
        Upbringing
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200  p-4">
          <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
            Who the patient grew up with
          </h4>
          <p className="whitespace-pre-wrap text-[13px]">{grewWith || "—"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
            Upbringing Environments
          </h4>
          <p className="whitespace-pre-wrap text-[13px]">{env || "—"}</p>
        </div>
      </div>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="mb-3 text-[13px] font-semibold text-slate-900">
          Family History
        </h4>
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
          <div className="md:border-l md:border-slate-200 md:pl-4">
            <p className="whitespace-pre-wrap text-[13px]">
              {famElaboration || "—"}
            </p>
          </div>
        </div>
      </section>

      {childhoodComment && (
        <div className="mt-4 rounded-xl border border-slate-200 p-4">
          <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
            Childhood Comments
          </h4>
          <p className="whitespace-pre-wrap text-[13px]">{childhoodComment}</p>
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
              <div>
                <h4 className="mb-1 text-[13px] font-semibold text-slate-900">
                  Injury List
                </h4>
                <p className="whitespace-pre-wrap text-[13px] text-slate-800">
                  {inj!.injuryList || "—"}
                </p>
              </div>
              <div className="md:border-l md:border-slate-200 md:pl-4">
                <h4 className="mb-1 text-[13px] font-semibold text-slate-900">
                  Explanation
                </h4>
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
        return "border-green-200 bg-green-50";
      case "not_great":
        return "border-amber-200 bg-amber-50";
      default:
        return "border-rose-200 bg-rose-50";
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

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r: any) => (
          <div
            key={r.id}
            className={`rounded-xl border p-3 ${strengthStyles(r.strength)}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-slate-900 truncate">
                  {r.name} • {r.role}
                </p>
                <p className="text-[12px] text-slate-700">
                  {strengthLabel(r.strength)} relationship
                </p>
              </div>
              <div className="shrink-0">{moodBadge(Boolean(r.happy))}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PrevTreatmentDetail({ data }: { data: ProfileJson }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200 p-4">
        <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
          Summary
        </h4>
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
      .join(", ") || "—";
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

  return (
    <div className="grid grid-cols-2 gap-4 text-[13px]">
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
          value={data.dietType?.map((d: any) => d.label).join(", ") || "—"}
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
        <KV
          label="Orientation"
          value={
            data.sexualOrientation?.map((s: any) => s.label).join(", ") || "—"
          }
        />
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
              ? (data as any).substancesUsed.map((x: any) => x.label).join(", ")
              : "—"
          }
          truncate={false}
        />
      </div>
      <div className="rounded-xl border border-slate-200 p-3">
        <KV
          label="Mood changes"
          value={mapValsToLabels(
            data.moodChanges as string[] | undefined,
            moodChangeOptions
          )}
          truncate={false}
        />
      </div>
      <div className="rounded-xl border border-slate-200 p-3">
        <KV
          label="Thought changes"
          value={mapValsToLabels(
            data.thoughtChanges as string[] | undefined,
            thoughtChangeOptions
          )}
          truncate={false}
        />
      </div>
      <div className="rounded-xl border border-slate-200 p-3">
        <KV
          label="Behavior changes"
          value={mapValsToLabels(
            data.behaviorChanges as string[] | undefined,
            behaviorChangeOptions
          )}
          truncate={false}
        />
      </div>
    </div>
  );
}

export function AssessmentsDetail({ data }: { data: ProfileJson }) {
  const A = data.assessments ?? {};

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

  const yesNo: readonly Opt[] = [
    { key: "yes", label: "Yes", bg: "bg-rose-100", text: "text-rose-800" },
    { key: "no", label: "No", bg: "bg-slate-100", text: "text-slate-700" },
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

  function Block({
    label,
    score,
    max,
    caption,
    questions,
    answers,
    options,
    headerNote,
  }: {
    label: string;
    score: number;
    max: number;
    caption: string;
    questions: Record<string, string>;
    answers: Record<string, any> | undefined;
    options: readonly Opt[];
    headerNote?: string;
  }) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-4 min-w-0">
        <div className="mb-3 grid items-center gap-3 md:grid-cols-[220px,1fr] min-w-0">
          <Gauge label={label} score={score} max={max} caption={caption} />
          <div className="min-w-0 overflow-hidden">
            {headerNote ? (
              <h4 className="mb-1 text-[13px] font-semibold text-slate-900">
                {headerNote}
              </h4>
            ) : null}
            <ul className="text-[13px] text-slate-800 divide-y divide-slate-200 break-words">
              {Object.entries(questions).map(([k, q]) => {
                const ans = (answers as any)?.[k];
                const opt = optFor(options, ans);
                return (
                  <li
                    key={k}
                    className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0"
                  >
                    <div className="flex gap-2 flex-1 min-w-0">
                      <span className="shrink-0 text-slate-500">•</span>
                      <span className="flex-1 min-w-0 break-words">{q}</span>
                    </div>
                    <div className="shrink-0">
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-[12px] ${
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

  function CRAFFTBlock() {
    const pA = (A.crafft?.partA ?? {}) as Record<string, any>;
    const pB = (A.crafft?.partB ?? {}) as Record<string, any>;

    return (
      <section className="rounded-xl border border-slate-200 bg-white p-4 min-w-0">
        <div className="mb-3 grid items-start gap-3 md:grid-cols-[220px,1fr] min-w-0">
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
            <div className="mb-3 grid gap-2 md:grid-cols-3">
              {Object.entries(CRAFFT_PARTA_QUESTIONS).map(([k, q]) => (
                <div
                  key={k}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2"
                >
                  <div className="text-[12px] text-slate-600 mb-1 leading-snug">
                    {q}
                  </div>
                  <div className="text-[13px] font-semibold text-slate-900">
                    {pA?.[k] !== undefined && pA?.[k] !== ""
                      ? `${pA[k]} days`
                      : "—"}
                  </div>
                </div>
              ))}
            </div>

            {/* Part B: Yes/No items */}
            <ul className="text-[13px] text-slate-800 divide-y divide-slate-200 break-words">
              {Object.entries(CRAFFT_QUESTIONS).map(([k, q]) => {
                const ans = pB?.[k];
                const opt = optFor(yesNo, ans);
                return (
                  <li
                    key={k}
                    className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0"
                  >
                    <div className="flex gap-2 flex-1 min-w-0">
                      <span className="shrink-0 text-slate-500">•</span>
                      <span className="flex-1 min-w-0 break-words">{q}</span>
                    </div>
                    <div className="shrink-0">
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-[12px] ${
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
