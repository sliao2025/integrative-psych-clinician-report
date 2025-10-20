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
  SCARED_PARENT_QUESTIONS,
  DISC_CHILD_QUESTIONS,
  DISC_PARENT_QUESTIONS,
  SCARED_CHILD_QUESTIONS,
  SNAP_QUESTIONS,
} from "../text";
import { profile } from "console";

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
          hasCulture ? "lg:grid-cols-3" : "lg:grid-cols-2"
        }`}
      >
        <Box title="Story">{story || "—"}</Box>
        <Box title="Living Situation">{living || "—"}</Box>
        {hasCulture && <Box title="Cultural / Context">{culture}</Box>}
      </section>

      <h3 className="mb-3 text-sm font-semibold tracking-wide text-slate-900">
        {!data.isChild ? "Upbringing" : "Family History"}
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200  p-4">
          <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
            {data.isChild
              ? "Medical Issues (Father Side)"
              : "Who the patient grew up with"}
          </h4>
          <p className="whitespace-pre-wrap text-[13px]">
            {data.isChild ? data.fatherSideMedicalIssues : grewWith || "—"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
            {data.isChild
              ? "Medical Issues (Mother Side)"
              : "Upbringing Environments"}
          </h4>
          <p className="whitespace-pre-wrap text-[13px]">
            {data.isChild ? data.motherSideMedicalIssues : env || "—"}
          </p>
        </div>
      </div>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="mb-3 text-[13px] font-semibold text-slate-900">
          Family Mental Health History
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

      {/* Schooling block for children */}
      {data.isChild && (
        <section className="mt-4 space-y-4">
          <h3 className="text-sm font-semibold tracking-wide text-slate-900">
            Schooling
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {/* School Info */}
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                School Info
              </h4>
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
                  <span className="text-[12px] text-slate-700">
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
                  <span className="text-[12px] text-slate-700">
                    Special classes
                  </span>
                  <Pill
                    tone={data.schoolInfo?.hasSpecialClasses ? "warn" : "info"}
                  >
                    {yn(data.schoolInfo?.hasSpecialClasses)}
                  </Pill>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <span className="text-[12px] text-slate-700">
                    Special services
                  </span>
                  <Pill
                    tone={data.schoolInfo?.hasSpecialServices ? "warn" : "info"}
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
                    <div className="rounded-xl border border-slate-200 p-2">
                      <h5 className="mb-1 text-[12px] font-semibold text-slate-900">
                        Repeated grade · Reason
                      </h5>
                      <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                        {data.schoolInfo.repeatedGradeDetail}
                      </p>
                    </div>
                  ) : null}
                  {data.schoolInfo?.specialClassesDetail ? (
                    <div className="rounded-xl border border-slate-200 p-2">
                      <h5 className="mb-1 text-[12px] font-semibold text-slate-900">
                        Special classes · Info
                      </h5>
                      <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                        {data.schoolInfo.specialClassesDetail}
                      </p>
                    </div>
                  ) : null}
                  {data.schoolInfo?.specialServicesDetail ? (
                    <div className="rounded-xl border border-slate-200 p-2 sm:col-span-2">
                      <h5 className="mb-1 text-[12px] font-semibold text-slate-900">
                        Special services · Info
                      </h5>
                      <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                        {data.schoolInfo.specialServicesDetail}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Relationships & Abilities */}
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                Relationships & Abilities
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <span className="text-[12px] text-slate-700">
                    Works independently
                  </span>
                  <Pill
                    tone={triTone(
                      data.relationshipsAbilities?.childAbilityWorkIndependently
                    )}
                  >
                    {triLabel(
                      data.relationshipsAbilities?.childAbilityWorkIndependently
                    )}
                  </Pill>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <span className="text-[12px] text-slate-700">
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
                  <span className="text-[12px] text-slate-700">Attendance</span>
                  <Pill
                    tone={triTone(data.relationshipsAbilities?.childAttendance)}
                  >
                    {triLabel(data.relationshipsAbilities?.childAttendance)}
                  </Pill>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <span className="text-[12px] text-slate-700">
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
                    <span className="text-[12px] text-slate-700">
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
                <div className="rounded-xl border border-slate-200 p-2">
                  <h5 className="mb-1 text-[12px] font-semibold text-slate-900">
                    Teacher/Peer Relationships
                  </h5>
                  <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                    {data.relationshipsAbilities?.teachersPeersRelationship ||
                      "—"}
                  </p>
                </div>
                {data.relationshipsAbilities?.truancyProceedingsDetail ? (
                  <div className="rounded-xl border border-slate-200 p-2">
                    <h5 className="mb-1 text-[12px] font-semibold text-slate-900">
                      Truancy proceedings · detail
                    </h5>
                    <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                      {data.relationshipsAbilities.truancyProceedingsDetail}
                    </p>
                  </div>
                ) : null}
                {data.relationshipsAbilities?.schoolCounselingDetail ? (
                  <div className="rounded-xl border border-slate-200 p-2">
                    <h5 className="mb-1 text-[12px] font-semibold text-slate-900">
                      School counseling · detail
                    </h5>
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
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                Academic grades
              </h4>
              <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                {data.schoolInfo?.academicGrades || "—"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                Activities / interests / strengths
              </h4>
              <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                {data.relationshipsAbilities?.activitiesInterestsStrengths ||
                  "—"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 md:col-span-2">
              <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                Other concerns
              </h4>
              <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                {data.relationshipsAbilities?.otherConcerns ||
                  "No other concerns reported."}
              </p>
            </div>
          </div>
        </section>
      )}

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
      <div className="grid grid-cols-2 gap-4 text-[13px]">
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

export function AssessmentsDetail({ data }: { data: ProfileJson }) {
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
      <section className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 min-w-0">
        <div className="mb-3 grid items-center gap-3 md:grid-cols-[200px,1fr] lg:grid-cols-[220px,1fr] min-w-0">
          <Gauge label={label} score={score} max={max} caption={caption} />
          <div className="min-w-0 overflow-hidden">
            {headerNote ? (
              <h4 className="mb-1 text-[13px] font-semibold text-slate-900">
                {headerNote}
              </h4>
            ) : null}
            <ul className="text-[12px] sm:text-[13px] text-slate-800 divide-y divide-slate-200 break-words">
              {Object.entries(questions).map(([k, q]) => {
                const ans = (answers as any)?.[k];
                const opt = optFor(options, ans);
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
          {/* Inattention Subscale */}
          <section className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 min-w-0">
            <div className="mb-3">
              <Gauge
                label="SNAP ADHD: Inattention"
                score={snapInattention}
                max={27}
                caption="<13 not significant · 13-17 mild · 18-22 moderate · 23-27 severe"
              />
            </div>
            <div className="min-w-0 overflow-hidden">
              <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                Items 1-9 (0=Not at all, 3=Very much)
              </h4>
              <ul className="text-[12px] sm:text-[13px] text-slate-800 divide-y divide-slate-200 break-words">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
                  const k = `snap${String(i).padStart(2, "0")}`;
                  const q = SNAP_QUESTIONS[k as keyof typeof SNAP_QUESTIONS];
                  const ans = snapResponses[k as keyof typeof snapResponses];
                  const opt = optFor(snap0to3, ans);
                  return (
                    <li
                      key={k}
                      className="flex items-start justify-between gap-2 sm:gap-3 py-2 first:pt-0 last:pb-0"
                    >
                      <div className="flex gap-2 flex-1 min-w-0">
                        <span className="shrink-0 text-slate-500">{i}.</span>
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
          </section>

          {/* Hyperactivity Subscale */}
          <section className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 min-w-0">
            <div className="mb-3">
              <Gauge
                label="SNAP ADHD: Hyperactivity"
                score={snapHyperactivity}
                max={27}
                caption="<13 not significant · 13-17 mild · 18-22 moderate · 23-27 severe"
              />
            </div>
            <div className="min-w-0 overflow-hidden">
              <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                Items 10-18 (0=Not at all, 3=Very much)
              </h4>
              <ul className="text-[12px] sm:text-[13px] text-slate-800 divide-y divide-slate-200 break-words">
                {[10, 11, 12, 13, 14, 15, 16, 17, 18].map((i) => {
                  const k = `snap${String(i).padStart(2, "0")}`;
                  const q = SNAP_QUESTIONS[k as keyof typeof SNAP_QUESTIONS];
                  const ans = snapResponses[k as keyof typeof snapResponses];
                  const opt = optFor(snap0to3, ans);
                  return (
                    <li
                      key={k}
                      className="flex items-start justify-between gap-2 sm:gap-3 py-2 first:pt-0 last:pb-0"
                    >
                      <div className="flex gap-2 flex-1 min-w-0">
                        <span className="shrink-0 text-slate-500">{i}.</span>
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
          </section>

          {/* Opposition Subscale */}
          <section className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 min-w-0">
            <div className="mb-3">
              <Gauge
                label="SNAP ADHD: Opposition"
                score={snapOpposition}
                max={24}
                caption="<8 not significant · 8-13 mild · 14-18 moderate · 19-24 severe"
              />
            </div>
            <div className="min-w-0 overflow-hidden">
              <h4 className="mb-2 text-[13px] font-semibold text-slate-900">
                Items 19-26 (0=Not at all, 3=Very much)
              </h4>
              <ul className="text-[12px] sm:text-[13px] text-slate-800 divide-y divide-slate-200 break-words">
                {[19, 20, 21, 22, 23, 24, 25, 26].map((i) => {
                  const k = `snap${String(i).padStart(2, "0")}`;
                  const q = SNAP_QUESTIONS[k as keyof typeof SNAP_QUESTIONS];
                  const ans = snapResponses[k as keyof typeof snapResponses];
                  const opt = optFor(snap0to3, ans);
                  return (
                    <li
                      key={k}
                      className="flex items-start justify-between gap-2 sm:gap-3 py-2 first:pt-0 last:pb-0"
                    >
                      <div className="flex gap-2 flex-1 min-w-0">
                        <span className="shrink-0 text-slate-500">{i}.</span>
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
          </section>
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
              <div>
                <div className="text-[12px] font-medium text-slate-600 mb-1">
                  Reason for Evaluation
                </div>
                <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                  {data.childMedicalHistory.neuropsychEvalReason}
                </p>
              </div>
            )}
            {data.childMedicalHistory?.neuropsychEvaluationsPerformed && (
              <div>
                <div className="text-[12px] font-medium text-slate-600 mb-1">
                  Evaluations Performed
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
                <div>
                  <div className="text-[12px] font-medium text-slate-600 mb-1">
                    Individual Psychotherapy Details
                  </div>
                  <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                    {data.childPsychiatricHistory.individualDetails}
                  </p>
                </div>
              )}
              {data.childPsychiatricHistory?.groupDetails && (
                <div>
                  <div className="text-[12px] font-medium text-slate-600 mb-1">
                    Group Psychotherapy Details
                  </div>
                  <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                    {data.childPsychiatricHistory.groupDetails}
                  </p>
                </div>
              )}
              {data.childPsychiatricHistory?.familyCouplesDetails && (
                <div>
                  <div className="text-[12px] font-medium text-slate-600 mb-1">
                    Family/Couples Therapy Details
                  </div>
                  <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                    {data.childPsychiatricHistory.familyCouplesDetails}
                  </p>
                </div>
              )}
              {data.childPsychiatricHistory?.otherDetails && (
                <div>
                  <div className="text-[12px] font-medium text-slate-600 mb-1">
                    Other Treatment Details
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
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <KV
                label="Psychiatric Hospitalization"
                value={yn(data.childMedicalHistory.psychiatricHospitalized)}
              />
              {data.childMedicalHistory.psychiatricHospitalized &&
                data.childMedicalHistory.psychiatricHospitalizationDetails && (
                  <p className="mt-2 text-[12px] text-slate-700 whitespace-pre-wrap">
                    {data.childMedicalHistory.psychiatricHospitalizationDetails}
                  </p>
                )}
            </div>
          )}

          {/* Suicide Thoughts */}
          {data.childMedicalHistory?.suicideThoughtsEver !== undefined && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <KV
                label="Suicidal Thoughts"
                value={yn(data.childMedicalHistory.suicideThoughtsEver)}
              />
              {data.childMedicalHistory.suicideThoughtsEver &&
                data.childMedicalHistory.suicideThoughtsLastTimePlan && (
                  <p className="mt-2 text-[12px] text-slate-700 whitespace-pre-wrap">
                    {data.childMedicalHistory.suicideThoughtsLastTimePlan}
                  </p>
                )}
            </div>
          )}

          {/* Suicide Attempt */}
          {data.childMedicalHistory?.suicideAttemptEver !== undefined && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <KV
                label="Suicide Attempt"
                value={yn(data.childMedicalHistory.suicideAttemptEver)}
              />
              {data.childMedicalHistory.suicideAttemptEver &&
                data.childMedicalHistory.suicideAttemptDetails && (
                  <p className="mt-2 text-[12px] text-slate-700 whitespace-pre-wrap">
                    {data.childMedicalHistory.suicideAttemptDetails}
                  </p>
                )}
            </div>
          )}

          {/* Self-Harm */}
          {data.childMedicalHistory?.selfHarmEver !== undefined && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
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
                      <p className="mt-2 text-[12px] text-slate-700 whitespace-pre-wrap">
                        {data.childMedicalHistory.selfHarmFrequencyDetails}
                      </p>
                    )}
                </>
              )}
            </div>
          )}

          {/* Substance Use */}
          {data.childMedicalHistory?.substanceUseEver !== undefined && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <KV
                label="Substance Use"
                value={yn(data.childMedicalHistory.substanceUseEver)}
              />
              {data.childMedicalHistory.substanceUseEver &&
                data.childMedicalHistory.substanceUseDetails && (
                  <p className="mt-2 text-[12px] text-slate-700 whitespace-pre-wrap">
                    {data.childMedicalHistory.substanceUseDetails}
                  </p>
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
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-[12px] font-medium text-amber-900 mb-1">
                  Pregnancy Complications
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.complicationsDetails}
                </p>
              </div>
            )}

          {/* Medications During Pregnancy */}
          {data.childPrenatalHistory?.hadMedsDuringPregnancy &&
            data.childPrenatalHistory.medsDuringPregnancyDetails && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[12px] font-medium text-slate-900 mb-1">
                  Medications During Pregnancy
                </div>
                <p className="text-[13px] text-slate-800 whitespace-pre-wrap">
                  {data.childPrenatalHistory.medsDuringPregnancyDetails}
                </p>
              </div>
            )}

          {/* Alcohol During Pregnancy */}
          {data.childPrenatalHistory?.hadAlcoholDuringPregnancy &&
            data.childPrenatalHistory.alcoholDuringPregnancyDetails && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-[12px] font-medium text-amber-900 mb-1">
                  Alcohol During Pregnancy
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.alcoholDuringPregnancyDetails}
                </p>
              </div>
            )}

          {/* Drugs During Pregnancy */}
          {data.childPrenatalHistory?.hadDrugsDuringPregnancy &&
            data.childPrenatalHistory.drugsDuringPregnancyDetails && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-[12px] font-medium text-amber-900 mb-1">
                  Drugs During Pregnancy
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.drugsDuringPregnancyDetails}
                </p>
              </div>
            )}

          {/* Smoking During Pregnancy */}
          {data.childPrenatalHistory?.motherSmokedDuringPregnancy &&
            data.childPrenatalHistory.motherSmokedDuringPregnancyDetails && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-[12px] font-medium text-amber-900 mb-1">
                  Smoking During Pregnancy
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.motherSmokedDuringPregnancyDetails}
                </p>
              </div>
            )}

          {/* Delivery Problems */}
          {data.childPrenatalHistory?.deliveryNormal === false &&
            data.childPrenatalHistory.deliveryProblems && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-[12px] font-medium text-amber-900 mb-1">
                  Delivery Problems
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.deliveryProblems}
                </p>
              </div>
            )}

          {/* Feeding Problems */}
          {data.childPrenatalHistory?.hadFeedingProblems &&
            data.childPrenatalHistory.feedingProblemsDetails && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-[12px] font-medium text-amber-900 mb-1">
                  Feeding Problems
                </div>
                <p className="text-[13px] text-amber-900 whitespace-pre-wrap">
                  {data.childPrenatalHistory.feedingProblemsDetails}
                </p>
              </div>
            )}

          {/* Early Problems */}
          {data.childPrenatalHistory?.hadEarlyProblems &&
            data.childPrenatalHistory.earlyProblemsDetails && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-[12px] font-medium text-amber-900 mb-1">
                  Early Problems (First Week/Month/Year)
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
