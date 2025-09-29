// app/report/components/DetailPanels.tsx
"use client";
import React from "react";
import { KV, Gauge } from "./ui";
import { ProfileJson } from "../types";
import {
  ACE_RESILIENCE_QUESTIONS,
  ASRS5_QUESTIONS,
  GAD7_QUESTIONS,
  PHQ9_QUESTIONS,
  PSS4_QUESTIONS,
  PTSD_QUESTIONS,
} from "../text";

const scoreSum = (obj: Record<string, any> = {}) =>
  Object.values(obj).reduce(
    (a, v) => a + (typeof v === "string" ? Number(v) || 0 : v || 0),
    0
  );

export function SafetyDetail({ data }: { data: ProfileJson }) {
  const s = data.assessments?.suicide;
  const selfHarm = data.assessments?.selfHarm;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-[13px]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <KV
            label="Suicidal thoughts"
            value={s?.thoughts === "no" ? "Denied" : "Reported"}
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <KV
            label="Wish to be dead"
            value={s?.wishDead === "no" ? "Denied" : "Reported"}
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <KV label="Plan" value={s?.plan?.trim() || "None"} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <KV label="Intention" value={s?.intention?.trim() || "None"} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <KV
            label="Recent self-harm"
            value={selfHarm?.pastMonth === "no" ? "No" : "Yes"}
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <KV
            label="Lifetime self-harm"
            value={selfHarm?.lifetime === "no" ? "No" : "Yes"}
          />
        </div>
      </div>
    </div>
  );
}

export function MedsDetail({ data }: { data: ProfileJson }) {
  const meds = data.currentMedications ?? [];
  const prev = data.previousMedications ?? [];
  return (
    <div className="space-y-4">
      {meds.length ? (
        <ul className="space-y-3">
          {meds.map((m: any, i: number) => (
            <li
              key={i}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
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
      {prev.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <h4 className="mb-1 text-[13px] font-semibold text-slate-900">
            Previous medications
          </h4>
          <ul className="list-disc pl-5 text-[13px] text-slate-700">
            {prev.map((m: any, i: number) => (
              <li key={i}>{m.name}</li>
            ))}
          </ul>
        </div>
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
  return (
    <div className="space-y-3">
      {data.previousHospitalizations?.length ? (
        <ul className="space-y-3">
          {data.previousHospitalizations.map((h: any, i: number) => (
            <li
              key={i}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
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
        <p className="text-[13px] text-slate-500">None reported</p>
      )}
    </div>
  );
}

export function RelationshipsDetail({ data }: { data: ProfileJson }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(data.relationships ?? []).map((r: any) => (
        <div
          key={r.id}
          className={`rounded-xl border p-3 ${
            r.strength === "really_good"
              ? "border-emerald-200 bg-emerald-50"
              : r.strength === "pretty_good"
              ? "border-green-200 bg-green-50"
              : r.strength === "not_great"
              ? "border-amber-200 bg-amber-50"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-slate-900">
              {r.name} • {r.role}
            </p>
            <span className="text-[12px] text-slate-600">
              {r.happy ? "Happy" : "Strained"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FamilyDetail({ data }: { data: ProfileJson }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(data.familyHistory ?? []).map((d: any, i: number) => (
          <span
            key={i}
            className="rounded-full bg-slate-100 px-3 py-1 text-[12px]"
          >
            {d}
          </span>
        ))}
      </div>
      {data.familyHistoryElaboration?.text && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[13px] text-slate-700">
            {data.familyHistoryElaboration.text}
          </p>
        </div>
      )}
    </div>
  );
}

export function GlanceDetail({ data }: { data: ProfileJson }) {
  return (
    <div className="grid grid-cols-2 gap-4 text-[13px]">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Occupation"
          value={<span title={data.jobDetails}>{data.jobDetails}</span>}
          truncate={false}
          className="gap-10"
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Hobbies"
          value={<span title={data.hobbies}>{data.hobbies}</span>}
          truncate={false}
          className="gap-10"
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Diet"
          value={data.dietType?.map((d: any) => d.label).join(", ") || "—"}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Alcohol"
          value={`Every ${
            data.alcoholFrequency?.replace("few_", "few ") || "—"
          } · ~${data.drinksPerOccasion || "—"} drinks each time`}
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Sexually active"
          value={data.isSexuallyActive ? "Yes" : "No"}
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV label="Partners" value={data.sexualPartners || "—"} />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Orientation"
          value={
            data.sexualOrientation?.map((s: any) => s.label).join(", ") || "—"
          }
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV label="Education" value={data.highestDegree || "—"} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Positive childhood"
          value={data.likedChildhood ? "Yes" : "No"}
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV label="Therapy duration" value={data.therapyDuration || "—"} />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Substances"
          value={
            Array.isArray((data as any).substancesUsed)
              ? (data as any).substancesUsed.map((x: any) => x.label).join(", ")
              : "—"
          }
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Mood changes"
          value={(data.moodChanges || []).join(", ") || "—"}
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Thought changes"
          value={(data.thoughtChanges || []).join(", ") || "—"}
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Behavior changes"
          value={(data.behaviorChanges || []).join(", ") || "—"}
        />
      </div>
    </div>
  );
}

// Replace your existing AssessmentsDetail export with this:

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
      key: "0",
      label: "Definitely true",
      bg: "bg-emerald-100",
      text: "text-emerald-800",
    },
    {
      key: "1",
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
      key: "3",
      label: "Probably not true",
      bg: "bg-orange-100",
      text: "text-orange-800",
    },
    {
      key: "4",
      label: "Definitely not true",
      bg: "bg-rose-100",
      text: "text-rose-800",
    },
  ];

  // --- helpers ---
  const optFor = (
    opts: readonly Opt[],
    key: string | number | undefined | null
  ): Opt | undefined => {
    if (key === undefined || key === null || key === "") return undefined;
    const s = String(key);
    return opts.find((o) => o.key === s);
  };

  const scoreSum = (obj: Record<string, any> = {}) =>
    Object.values(obj).reduce(
      (a, v) => a + (typeof v === "string" ? Number(v) || 0 : v || 0),
      0
    );

  // --- computed scores ---
  const gadScore = scoreSum(A.gad7);
  const phqScore = scoreSum(A.phq9);
  const pssScore = scoreSum(A.stress);
  const asrsScore = scoreSum(A.asrs5);
  const ptsdYes = Object.values(A.ptsd ?? {}).filter(
    (v: any) => String(v).toLowerCase() === "yes"
  ).length;
  const aceScore = scoreSum(A.aceResilience);

  // --- layout helper for a gauge + question list ---
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
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 grid items-center gap-3 md:grid-cols-[220px,1fr]">
          <Gauge label={label} score={score} max={max} caption={caption} />
          <div>
            {headerNote ? (
              <h4 className="text-[13px] font-semibold text-slate-900 mb-1">
                {headerNote}
              </h4>
            ) : null}
            <ul className="text-[13px] text-slate-800 space-y-1.5">
              {Object.entries(questions).map(([k, q]) => {
                const ans = (answers as any)?.[k];
                const opt = optFor(options, ans);
                return (
                  <li key={k} className="flex justify-between">
                    <div className="flex gap-2 lg:w-xl md:w-sm sm:w-2xs">
                      <span className="shrink-0 text-slate-500">•</span>
                      <span className="flex-1">{q}</span>
                    </div>
                    <div>
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
    <div className="space-y-5">
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
        caption="higher = more adverse childhood experiences"
        questions={ACE_RESILIENCE_QUESTIONS}
        answers={A.aceResilience}
        options={aceTrue5}
      />
    </div>
  );
}
