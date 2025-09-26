// app/report/components/DetailPanels.tsx
"use client";
import React from "react";
import { KV, Gauge } from "./ui";
import { ProfileJson } from "../types";

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
          label="Diet"
          value={data.dietType?.map((d: any) => d.label).join(", ") || "—"}
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Occupation"
          value={<span title={data.jobDetails}>{data.jobDetails}</span>}
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <KV
          label="Alcohol"
          value={`Every ${
            data.alcoholFrequency?.replace("few_", "few ") || "—"
          } · ~${data.drinksPerOccasion || "—"} drinks`}
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
          label="Hobbies"
          value={<span title={data.hobbies}>{data.hobbies}</span>}
        />
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

export function AssessmentsDetail({ data }: { data: ProfileJson }) {
  const gad = scoreSum(data.assessments?.gad7);
  const phq = scoreSum(data.assessments?.phq9);
  const pss = scoreSum(data.assessments?.stress);
  const asrs = scoreSum(data.assessments?.asrs5);
  const ptsdYes = Object.values(data.assessments?.ptsd ?? {}).filter(
    (v: any) => String(v).toLowerCase() === "yes"
  ).length;
  const ace = scoreSum(data.assessments?.aceResilience);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Gauge
          label="GAD-7"
          score={gad}
          max={21}
          caption="0–4 min · 5–9 mild · 10–14 mod · 15–21 sev"
        />
        <Gauge
          label="PHQ-9"
          score={phq}
          max={27}
          caption="0–4 min · 5–9 mild · 10–14 mod · 15–27 sev"
        />
        <Gauge label="PSS-4" score={pss} max={16} caption="0–16 stress" />
        <Gauge label="ASRS-5" score={asrs} max={24} caption="screen only" />
        <Gauge label="PTSD flags" score={ptsdYes} max={5} caption="# yes" />
        <Gauge
          label="ACE Resilience"
          score={ace}
          max={26}
          caption="protective"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          ["GAD-7 (raw)", data.assessments?.gad7],
          ["PHQ-9 (raw)", data.assessments?.phq9],
          ["ASRS-5 (raw)", data.assessments?.asrs5],
          ["PSS-4 (raw)", data.assessments?.stress],
          ["PTSD screener", data.assessments?.ptsd],
          ["ACE Resilience", data.assessments?.aceResilience],
        ].map(([title, payload], i) => (
          <section
            key={i}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3"
          >
            <h4 className="mb-1 text-[13px] font-semibold text-slate-900">
              {title}
            </h4>
            <pre className="text-[12px] text-slate-700">
              {JSON.stringify(payload ?? {}, null, 2)}
            </pre>
          </section>
        ))}
      </div>
    </div>
  );
}
