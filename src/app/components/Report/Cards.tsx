// app/report/components/Cards.tsx
"use client";
import React from "react";
import {
  Activity,
  ClipboardList,
  ShieldAlert,
  Users as UsersIcon,
  BookOpen,
  Pill as PillIcon,
  Stethoscope,
  Syringe,
  FileText,
  Info,
  HeartPulse,
} from "lucide-react";
import { Card, Pill, KV, Gauge, cx } from "./ui";
import { ProfileJson } from "../types";
import {
  alcoholFrequencyOptions,
  degreeOptions,
  drinksPerOccasionOptions,
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

export function GoalsCard({
  data,
  onOpen,
  className,
}: {
  data: ProfileJson;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <Card
      className={className}
      title={
        <>
          <ClipboardList className="h-4 w-4" />
          Presenting Goal(s)
        </>
      }
      onExpand={onOpen}
    >
      <p className="whitespace-pre-line line-clamp-12 text-[13px] leading-relaxed text-slate-700">
        {data.goals?.text}
      </p>
    </Card>
  );
}

export function StoryCard({
  data,
  onOpen,
  className,
}: {
  data: ProfileJson;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <Card
      className={className}
      title={
        <>
          <BookOpen className="h-4 w-4" />
          Story / History
        </>
      }
      onExpand={onOpen}
    >
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Narrative spans full width for readability */}
          <div className="md:col-span-2">
            <div className="text-[12px] font-medium text-slate-600">
              Story Narrative
            </div>
            <p
              className="mt-1 text-[13px] leading-relaxed text-slate-800 whitespace-pre-line break-words line-clamp-3"
              title={data.storyNarrative?.text}
            >
              {data.storyNarrative?.text || "—"}
            </p>
          </div>

          <div>
            <div className="text-[12px] font-medium text-slate-600">
              Living Situation
            </div>
            <p
              className="mt-1 text-[13px] leading-relaxed text-slate-800 whitespace-pre-line break-words line-clamp-2"
              title={data.livingSituation?.text}
            >
              {data.livingSituation?.text || "—"}
            </p>
          </div>

          <div>
            <div className="text-[12px] font-medium text-slate-600">
              Upbringing Environments
            </div>
            <p
              className="mt-1 text-[13px] leading-relaxed text-slate-800 whitespace-pre-line break-words line-clamp-2"
              title={data.upbringingEnvironments?.text}
            >
              {data.upbringingEnvironments?.text || "—"}
            </p>
          </div>

          <div>
            <div className="text-[12px] font-medium text-slate-600">
              Upbringing — Who With
            </div>
            <p
              className="mt-1 text-[13px] leading-relaxed text-slate-800 whitespace-pre-line break-words line-clamp-2"
              title={data.upbringingWhoWith?.text}
            >
              {data.upbringingWhoWith?.text || "—"}
            </p>
          </div>

          <div>
            <div className="text-[12px] font-medium text-slate-600">
              Cultural Context
            </div>
            <p
              className="mt-1 text-[13px] leading-relaxed text-slate-800 whitespace-pre-line break-words line-clamp-2"
              title={data.cultureContext?.text}
            >
              {data.cultureContext?.text || "—"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SafetyCard({
  data,
  onOpen,
  className,
}: {
  data: ProfileJson;
  onOpen: () => void;
  className?: string;
}) {
  const s = data.assessments?.suicide;
  const acute =
    (s?.thoughts && s.thoughts !== "no") ||
    (s?.wishDead && s.wishDead !== "no") ||
    s?.plan?.trim() ||
    s?.intention?.trim();
  return (
    <Card
      title={
        <>
          <ShieldAlert className="h-4 w-4" />
          Risk & Safety
        </>
      }
      onExpand={onOpen}
      className={className}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-slate-800">
          {acute ? "Review urgently" : "No acute risk"}
        </span>
        <Pill tone={acute ? "danger" : "success"}>
          {acute ? "Alert" : "Stable"}
        </Pill>
      </div>
    </Card>
  );
}

export function AssessmentsCard({
  data,
  onOpen,
  className,
}: {
  data: ProfileJson;
  onOpen: () => void;
  className?: string;
}) {
  const gad = scoreSum(data.assessments?.gad7);
  const phq = scoreSum(data.assessments?.phq9);
  const pss = scoreSum(data.assessments?.stress);
  const asrs = scoreSum(data.assessments?.asrs5);
  const ptsdYes = Object.values(data.assessments?.ptsd ?? {}).filter(
    (v: any) => String(v).toLowerCase() === "yes"
  ).length;
  const ace = scoreSum(data.assessments?.aceResilience);

  return (
    <Card
      title={
        <>
          <Activity className="h-4 w-4" />
          Assessments
        </>
      }
      onExpand={onOpen}
      className={className}
    >
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Gauge
          label="GAD-7"
          score={gad}
          max={21}
          caption="0–4 minimal · 5–9 mild · 10–14 moderate · 15–21 severe"
        />
        <Gauge
          label="PHQ-9"
          score={phq}
          max={27}
          caption="0–4 minimal · 5–9 mild · 10–14 moderate · 15–19 moderately severe · 20-27 severe"
        />
        <Gauge
          label="PSS-4"
          score={pss}
          max={16}
          caption="higher = more stress"
        />
        {/* Hidden on small screens; visible from md and up */}
        <div className="hidden md:block">
          <Gauge
            label="ASRS-5"
            score={asrs}
            max={24}
            caption=">14 = possible ADHD symptoms · <14 = ADHD less likely"
          />
        </div>
        <div className="hidden md:block">
          <Gauge
            label="PTSD flags"
            score={ptsdYes}
            max={5}
            caption="higher = more PTSD symptoms"
          />
        </div>
        <div className="hidden md:block">
          <Gauge
            label="ACE Resilience"
            score={ace}
            max={52}
            caption="higher = resilience"
          />
        </div>
      </div>
    </Card>
  );
}

export function MedsCard({
  data,
  onOpen,
  className,
}: {
  data: ProfileJson;
  onOpen: () => void;
  className?: string;
}) {
  const meds = data.currentMedications ?? [];
  const has = meds.length > 0;
  return (
    <Card
      title={
        <>
          <PillIcon className="h-4 w-4" />
          Medications
        </>
      }
      onExpand={onOpen}
      className={className}
    >
      {has ? (
        <ul className="text-[13px] text-slate-800">
          {meds.slice(0, 2).map((m: any, i: number) => (
            <li key={i} className="flex items-center justify-between py-1.5">
              <span>
                {m.name} · {m.dosage}
              </span>
              <span className="text-[12px] text-slate-500">{m.frequency}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-slate-500">No current meds reported.</p>
      )}
    </Card>
  );
}

export function AllergiesCard({
  data,
  onOpen,
  className,
}: {
  data: ProfileJson;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <Card
      title={
        <>
          <Syringe className="h-4 w-4" />
          Allergies
        </>
      }
      onExpand={onOpen}
      className={className}
    >
      {data.medicalAllergies?.length ? (
        <div className="flex flex-wrap gap-2">
          {data.medicalAllergies.map((a: any, i: number) => (
            <span
              key={i}
              className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-[12px] text-zinc-700"
            >
              {a.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-slate-500">No allegies reported</p>
      )}
    </Card>
  );
}

export function RelationshipsCard({
  data,
  onOpen,
  className,
}: {
  data: ProfileJson;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <Card
      title={
        <>
          <UsersIcon className="h-4 w-4" />
          Relationships
        </>
      }
      onExpand={onOpen}
      className={className}
    >
      <div className="flex flex-wrap gap-2">
        {(data.relationships ?? []).slice(0, 6).map((r: any) => (
          <span
            key={r.id}
            className={cx(
              "rounded-full border px-3 py-1 text-[12px]",
              r.strength === "really_good" &&
                "border-emerald-200 bg-emerald-50 text-emerald-700",
              r.strength === "pretty_good" &&
                "border-green-200 bg-green-50 text-green-700",
              r.strength === "not_great" &&
                "border-amber-200 bg-amber-50 text-amber-700",
              r.strength === "really_bad" &&
                "border-red-200 bg-red-50 text-red-700"
            )}
          >
            {r.name} • {r.role}
          </span>
        ))}
      </div>
    </Card>
  );
}

export function GlanceCard({
  data,
  onOpen,
  className,
}: {
  data: ProfileJson;
  onOpen: () => void;
  className?: string;
}) {
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
    <Card
      title={
        <>
          <Info className="h-4 w-4" />
          At a Glance
        </>
      }
      onExpand={onOpen}
      className={className}
    >
      <div className="grid grid-cols-2 gap-3 text-[13px]">
        <KV
          label="Diet"
          value={data.dietType?.map((d: any) => d.label).join(", ") || "—"}
        />
        <KV
          label="Occupation"
          value={<span title={data.jobDetails}>{data.jobDetails}</span>}
        />
        <KV label="Alcohol" value={alcoholValue} truncate={false} />
        {!data.isSexuallyActive ? (
          <KV
            label="Sexually active"
            value={data.isSexuallyActive ? "Yes" : "No"}
          />
        ) : (
          <KV
            label="Substances"
            value={
              Array.isArray((data as any).substancesUsed)
                ? (data as any).substancesUsed
                    .map((x: any) => x.label)
                    .join(", ")
                : "—"
            }
          />
        )}

        <KV label="Sexual Partners" value={data.sexualPartners || "—"} />
        <KV
          label="Orientation"
          value={
            data.sexualOrientation?.map((s: any) => s.label).join(", ") || "—"
          }
        />
        <KV label="Education" value={educationLabel} />
        <KV
          label="Hobbies"
          value={<span title={data.hobbies}>{data.hobbies}</span>}
        />
        <KV
          label="Positive childhood"
          value={data.likedChildhood ? "Yes" : "No"}
        />
      </div>
    </Card>
  );
}

export function PrevTreatmentCard({
  data,
  onOpen,
  className,
}: {
  data: ProfileJson;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <Card
      title={
        <>
          <FileText className="h-4 w-4" />
          Previous Treatment
        </>
      }
      onExpand={onOpen}
      className={className}
    >
      {data.hasReceivedMentalHealthTreatment ? (
        <p className="line-clamp-4 text-[13px] whitespace-pre-line  leading-relaxed text-slate-700">
          {data.prevTreatmentSummary?.text}
        </p>
      ) : (
        <p className="text-[13px] text-slate-500">
          No previous treatment reported
        </p>
      )}
    </Card>
  );
}

export function HospitalizationsCard({
  data,
  onOpen,
  className,
}: {
  data: ProfileJson;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <Card
      title={
        <>
          <Stethoscope className="h-4 w-4" />
          Hospitalizations &amp; Injuries
        </>
      }
      onExpand={onOpen}
      className={className}
    >
      {data.previousHospitalizations?.length ? (
        <ul className="text-[13px] text-slate-800">
          {data.previousHospitalizations.map((h: any, i: number) => (
            <li key={i} className="flex items-center justify-between py-1.5">
              <span>{h.hospitalName}</span>
              <span className="text-[12px] text-slate-500">
                {h.date ? new Date(h.date).toLocaleDateString() : "—"} —{" "}
                {h.location}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-slate-500">
          No hospitalizations reported
        </p>
      )}
    </Card>
  );
}
