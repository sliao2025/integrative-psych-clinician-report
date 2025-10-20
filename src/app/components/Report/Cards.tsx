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
  moodChangeOptions,
  thoughtChangeOptions,
  behaviorChangeOptions,
} from "../text";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";

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
          Story
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
              {data.isChild ? "Academic Grades" : "Upbringing Environments"}
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-800 whitespace-pre-line break-words line-clamp-2">
              {data.isChild
                ? data.schoolInfo.academicGrades
                : data.upbringingEnvironments?.text || "—"}
            </p>
          </div>

          <div>
            <div className="text-[12px] font-medium text-slate-600">
              {data.isChild
                ? "Activities/Interests/Strengths"
                : "Upbringing — Who With"}
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-800 whitespace-pre-line break-words line-clamp-2">
              {data.isChild
                ? data.relationshipsAbilities?.activitiesInterestsStrengths
                : data.upbringingWhoWith?.text || "—"}
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
          Suicide Risk
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
  // Styled numeric tick for PolarRadiusAxis (0–100 labels)
  const CustomRadarChartTick = (props: any) => {
    const { x, y, payload } = props || {};
    const xx = typeof x === "number" ? x : 0;
    const yy = typeof y === "number" ? y : 0;
    const W = 30;
    const H = 16;
    return (
      <g transform={`translate(${xx - W / 2}, ${yy - H / 2})`}>
        <foreignObject width={W} height={H}>
          <div
            className="rounded-full bg-white border border-slate-200 py-0.5 text-[10px] leading-none text-slate-600 flex items-center justify-center"
            style={{ transform: "translateZ(0)" }}
          >
            {payload?.value}
          </div>
        </foreignObject>
      </g>
    );
  };

  // Determine if using new or legacy schema
  const assessments = data.assessments;
  const isNewSchema =
    assessments?.kind === "adult" || assessments?.kind === "child";
  const isChild = data.isChild || assessments?.kind === "child";

  // Legacy adult schema (backward compatibility)
  if (!isNewSchema && !isChild) {
    const gad = scoreSum(assessments?.gad7);
    const phq = scoreSum(assessments?.phq9);
    const pss = scoreSum(assessments?.stress);
    const asrs = scoreSum(assessments?.asrs5);
    const ptsdYes = Object.values(assessments?.ptsd ?? {}).filter(
      (v: any) => String(v).toLowerCase() === "yes"
    ).length;
    const ace = scoreSum(assessments?.aceResilience);

    const crafftKeys = [
      "car",
      "relax",
      "alone",
      "forget",
      "familyFriends",
      "trouble",
    ] as const;
    const crafftB = (assessments?.crafft?.partB ?? {}) as Record<string, any>;
    const crafft = crafftKeys.reduce(
      (n, k) => n + (String(crafftB[k] ?? "").toLowerCase() === "yes" ? 1 : 0),
      0
    );

    const radarData = [
      {
        subject: "Anxiety (GAD-7)",
        pct: Math.round((gad / 21) * 100),
        raw: gad,
        max: 21,
      },
      {
        subject: "Depression (PHQ-9)",
        pct: Math.round((phq / 27) * 100),
        raw: phq,
        max: 27,
      },
      {
        subject: "Stress (PSS-4)",
        pct: Math.round((pss / 16) * 100),
        raw: pss,
        max: 16,
      },
      {
        subject: "Adult ADHD (ASRS-5)",
        pct: Math.round((asrs / 24) * 100),
        raw: asrs,
        max: 24,
      },
      {
        subject: "Substance Risk (CRAFFT)",
        pct: Math.round((crafft / 6) * 100),
        raw: crafft,
        max: 6,
      },
      {
        subject: "PTSD Flags",
        pct: Math.round((ptsdYes / 5) * 100),
        raw: ptsdYes,
        max: 5,
      },
      {
        subject: "ACE Resilience",
        pct: Math.round((ace / 52) * 100),
        raw: ace,
        max: 52,
      },
    ];

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
        <div className="mt-4">
          <div className="w-full" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsRadarChart
                data={radarData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                className="size-full font-medium text-slate-700 [&_.recharts-polar-grid]:text-slate-200 [&_.recharts-text]:text-xs"
              >
                <PolarGrid stroke="currentColor" className="text-slate-200" />
                <PolarAngleAxis
                  dataKey="subject"
                  tickLine={false}
                  axisLine={false}
                  tick={({ x, y, textAnchor, index, payload, ...props }) => (
                    <text
                      x={x}
                      y={
                        index === 0
                          ? Number(y) - 14
                          : index === 3 || index === 4
                          ? Number(y) + 10
                          : Number(y)
                      }
                      textAnchor={textAnchor}
                      {...props}
                      className={cx(
                        "recharts-text recharts-polar-angle-axis-tick-value",
                        props.className
                      )}
                    >
                      <tspan
                        dy="0em"
                        className="fill-utility-gray-700 text-xs font-medium"
                      >
                        {payload.value}
                      </tspan>
                    </text>
                  )}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={(props) => <CustomRadarChartTick {...props} />}
                  axisLine={false}
                />
                <ReTooltip
                  formatter={(value, _name, props) => {
                    const p = props?.payload as
                      | { pct: number; raw: number; max: number }
                      | undefined;
                    return p
                      ? [`${p.raw} / ${p.max} (${p.pct}%)`, "Score"]
                      : [String(value), "Score"];
                  }}
                  labelFormatter={(label) => String(label)}
                  wrapperStyle={{ fontSize: 12 }}
                  wrapperClassName="rounded-lg shadow-lg"
                />
                <Radar
                  name="% of max"
                  dataKey="pct"
                  isAnimationActive={false}
                  className="text-[#0072ce]"
                  stroke="currentColor"
                  strokeWidth={2}
                  fill="currentColor"
                  fillOpacity={0.18}
                  strokeLinejoin="round"
                />
              </RechartsRadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-700">
            <Pill tone="info">GAD-7: {gad}/21</Pill>
            <Pill tone="info">PHQ-9: {phq}/27</Pill>
            <Pill tone="info">PSS-4: {pss}/16</Pill>
            <Pill tone="info">ASRS-5: {asrs}/24</Pill>
            <Pill tone="info">CRAFFT: {crafft}/6</Pill>
            <Pill tone="info">PTSD: {ptsdYes}/5</Pill>
            <Pill tone="info">ACE: {ace}/52</Pill>
          </div>
        </div>
      </Card>
    );
  }

  // New adult schema
  if (isNewSchema && assessments.kind === "adult") {
    const adultData = assessments.data;
    const gad = scoreSum(adultData?.gad7);
    const phq = scoreSum(adultData?.phq9);
    const pss = scoreSum(adultData?.stress);
    const asrs = scoreSum(adultData?.asrs5);
    const ptsdYes = Object.values(adultData?.ptsd ?? {}).filter(
      (v: any) => String(v).toLowerCase() === "yes"
    ).length;
    const ace = scoreSum(adultData?.aceResilience);

    const crafftKeys = [
      "car",
      "relax",
      "alone",
      "forget",
      "familyFriends",
      "trouble",
    ] as const;
    const crafftB = (adultData?.crafft?.partB ?? {}) as Record<string, any>;
    const crafft = crafftKeys.reduce(
      (n, k) => n + (String(crafftB[k] ?? "").toLowerCase() === "yes" ? 1 : 0),
      0
    );

    const radarData = [
      {
        subject: "Anxiety (GAD-7)",
        pct: Math.round((gad / 21) * 100),
        raw: gad,
        max: 21,
      },
      {
        subject: "Depression (PHQ-9)",
        pct: Math.round((phq / 27) * 100),
        raw: phq,
        max: 27,
      },
      {
        subject: "Stress (PSS-4)",
        pct: Math.round((pss / 16) * 100),
        raw: pss,
        max: 16,
      },
      {
        subject: "Adult ADHD (ASRS-5)",
        pct: Math.round((asrs / 24) * 100),
        raw: asrs,
        max: 24,
      },
      {
        subject: "Substance Risk (CRAFFT)",
        pct: Math.round((crafft / 6) * 100),
        raw: crafft,
        max: 6,
      },
      {
        subject: "PTSD Flags",
        pct: Math.round((ptsdYes / 5) * 100),
        raw: ptsdYes,
        max: 5,
      },
      {
        subject: "ACE Resilience",
        pct: Math.round((ace / 52) * 100),
        raw: ace,
        max: 52,
      },
    ];

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
        <div className="mt-4">
          <div className="w-full" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsRadarChart
                data={radarData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                className="size-full font-medium text-slate-700 [&_.recharts-polar-grid]:text-slate-200 [&_.recharts-text]:text-xs"
              >
                <PolarGrid stroke="currentColor" className="text-slate-200" />
                <PolarAngleAxis
                  dataKey="subject"
                  tickLine={false}
                  axisLine={false}
                  tick={({ x, y, textAnchor, index, payload, ...props }) => (
                    <text
                      x={x}
                      y={
                        index === 0
                          ? Number(y) - 14
                          : index === 3 || index === 4
                          ? Number(y) + 10
                          : Number(y)
                      }
                      textAnchor={textAnchor}
                      {...props}
                      className={cx(
                        "recharts-text recharts-polar-angle-axis-tick-value",
                        props.className
                      )}
                    >
                      <tspan
                        dy="0em"
                        className="fill-utility-gray-700 text-xs font-medium"
                      >
                        {payload.value}
                      </tspan>
                    </text>
                  )}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={(props) => <CustomRadarChartTick {...props} />}
                  axisLine={false}
                />
                <ReTooltip
                  formatter={(value, _name, props) => {
                    const p = props?.payload as
                      | { pct: number; raw: number; max: number }
                      | undefined;
                    return p
                      ? [`${p.raw} / ${p.max} (${p.pct}%)`, "Score"]
                      : [String(value), "Score"];
                  }}
                  labelFormatter={(label) => String(label)}
                  wrapperStyle={{ fontSize: 12 }}
                  wrapperClassName="rounded-lg shadow-lg"
                />
                <Radar
                  name="% of max"
                  dataKey="pct"
                  isAnimationActive={false}
                  className="text-[#0072ce]"
                  stroke="currentColor"
                  strokeWidth={2}
                  fill="currentColor"
                  fillOpacity={0.18}
                  strokeLinejoin="round"
                />
              </RechartsRadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-700">
            <Pill tone="info">GAD-7: {gad}/21</Pill>
            <Pill tone="info">PHQ-9: {phq}/27</Pill>
            <Pill tone="info">PSS-4: {pss}/16</Pill>
            <Pill tone="info">ASRS-5: {asrs}/24</Pill>
            <Pill tone="info">CRAFFT: {crafft}/6</Pill>
            <Pill tone="info">PTSD: {ptsdYes}/5</Pill>
            <Pill tone="info">ACE: {ace}/52</Pill>
          </div>
        </div>
      </Card>
    );
  }

  // Child schema
  if (isNewSchema && assessments.kind === "child") {
    const childData = assessments.data;

    // DISC Teen Depression (self-report)
    const discSelf = childData?.discTeen?.self?.responses ?? {};
    const discSelfScore = Object.values(discSelf).reduce(
      (sum: number, val: any): number => sum + (val === "1" ? 1 : 0),
      0 as number
    ) as number;

    // DISC Teen Depression (parent-report, if available)
    const discParent = childData?.discTeen?.parent?.responses ?? {};
    const discParentScore = Object.values(discParent).reduce(
      (sum: number, val: any): number => sum + (val === "1" ? 1 : 0),
      0 as number
    ) as number;
    const hasParentDisc = Object.keys(discParent).length > 0;

    // SNAP-IV scores
    const snapResponses = childData?.snap ?? {};
    const snapInattention = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(
      (sum, i) =>
        sum + (Number(snapResponses[`snap${String(i).padStart(2, "0")}`]) || 0),
      0
    );
    const snapHyperactivity = [10, 11, 12, 13, 14, 15, 16, 17, 18].reduce(
      (sum, i) =>
        sum + (Number(snapResponses[`snap${String(i).padStart(2, "0")}`]) || 0),
      0
    );
    const snapOpposition = [19, 20, 21, 22, 23, 24, 25, 26].reduce(
      (sum, i) =>
        sum + (Number(snapResponses[`snap${String(i).padStart(2, "0")}`]) || 0),
      0
    );

    // SCARED (self-report)
    const scaredSelf = childData?.scared?.self?.responses ?? {};
    const scaredSelfScore = Object.values(scaredSelf).reduce(
      (sum: number, val: any): number => sum + (Number(val) || 0),
      0 as number
    ) as number;

    // SCARED (parent-report, if available)
    const scaredParent = childData?.scared?.parent?.responses ?? {};
    const scaredParentScore = Object.values(scaredParent).reduce(
      (sum: number, val: any): number => sum + (Number(val) || 0),
      0 as number
    ) as number;
    const hasParentScared = Object.keys(scaredParent).length > 0;

    const radarData = [
      {
        subject: "DISC Self-Report",
        pct: Math.round((discSelfScore / 22) * 100),
        raw: discSelfScore,
        max: 22,
      },
      ...(hasParentDisc
        ? [
            {
              subject: "DISC Parent-Report",
              pct: Math.round((discParentScore / 22) * 100),
              raw: discParentScore,
              max: 22,
            },
          ]
        : []),
      {
        subject: "SNAP Inattention",
        pct: Math.round((snapInattention / 27) * 100),
        raw: snapInattention,
        max: 27,
      },
      {
        subject: "SNAP Hyperactivity",
        pct: Math.round((snapHyperactivity / 27) * 100),
        raw: snapHyperactivity,
        max: 27,
      },
      {
        subject: "SNAP Opposition",
        pct: Math.round((snapOpposition / 24) * 100),
        raw: snapOpposition,
        max: 24,
      },
      {
        subject: "SCARED Self-Report",
        pct: Math.round((scaredSelfScore / 82) * 100),
        raw: scaredSelfScore,
        max: 82,
      },
      ...(hasParentScared
        ? [
            {
              subject: "SCARED Parent-Report",
              pct: Math.round((scaredParentScore / 82) * 100),
              raw: scaredParentScore,
              max: 82,
            },
          ]
        : []),
    ];

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
        <div className="mt-4">
          <div className="w-full" style={{ height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsRadarChart
                data={radarData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                className="size-full font-medium text-slate-700 [&_.recharts-polar-grid]:text-slate-200 [&_.recharts-text]:text-xs"
              >
                <PolarGrid stroke="currentColor" className="text-slate-200" />
                <PolarAngleAxis
                  dataKey="subject"
                  tickLine={false}
                  axisLine={false}
                  tick={({ x, y, textAnchor, index, payload, ...props }) => (
                    <text
                      x={x}
                      y={
                        index === 0
                          ? Number(y) - 14
                          : index === 3 || index === 4
                          ? Number(y) + 10
                          : Number(y)
                      }
                      textAnchor={textAnchor}
                      {...props}
                      className={cx(
                        "recharts-text recharts-polar-angle-axis-tick-value",
                        props.className
                      )}
                    >
                      <tspan
                        dy="0em"
                        className="fill-utility-gray-700 text-xs font-medium"
                      >
                        {payload.value}
                      </tspan>
                    </text>
                  )}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={(props) => <CustomRadarChartTick {...props} />}
                  axisLine={false}
                />
                <ReTooltip
                  formatter={(value, _name, props) => {
                    const p = props?.payload as
                      | { pct: number; raw: number; max: number }
                      | undefined;
                    return p
                      ? [`${p.raw} / ${p.max} (${p.pct}%)`, "Score"]
                      : [String(value), "Score"];
                  }}
                  labelFormatter={(label) => String(label)}
                  wrapperStyle={{ fontSize: 12 }}
                  wrapperClassName="rounded-lg shadow-lg"
                />
                <Radar
                  name="% of max"
                  dataKey="pct"
                  isAnimationActive={false}
                  className="text-[#0072ce]"
                  stroke="currentColor"
                  strokeWidth={2}
                  fill="currentColor"
                  fillOpacity={0.18}
                  strokeLinejoin="round"
                />
              </RechartsRadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-700">
            <Pill tone="info">DISC (Self): {discSelfScore}/22</Pill>
            {hasParentDisc && (
              <Pill tone="info">DISC (Parent): {discParentScore}/22</Pill>
            )}
            <Pill tone="info">SNAP Inatt: {snapInattention}/27</Pill>
            <Pill tone="info">SNAP Hyper: {snapHyperactivity}/27</Pill>
            <Pill tone="info">SNAP Opp: {snapOpposition}/24</Pill>
            <Pill tone="info">SCARED (Self): {scaredSelfScore}/82</Pill>
            {hasParentScared && (
              <Pill tone="info">SCARED (Parent): {scaredParentScore}/82</Pill>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Fallback
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
      <p className="text-[13px] text-slate-500">No assessment data available</p>
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

  // Helper to map values to labels
  const mapValsToLabels = (
    vals: string[] | undefined,
    options: { value: string; label: string }[]
  ) =>
    (vals ?? [])
      .map((v) => options.find((o) => o.value === v)?.label ?? v)
      .filter(Boolean);

  // For children, get two-week screener data
  const moodChangesList = data.isChild
    ? mapValsToLabels(
        data.moodChanges as string[] | undefined,
        moodChangeOptions
      )
    : [];
  const thoughtChangesList = data.isChild
    ? mapValsToLabels(
        data.thoughtChanges as string[] | undefined,
        thoughtChangeOptions
      )
    : [];
  const behaviorChangesList = data.isChild
    ? mapValsToLabels(
        data.behaviorChanges as string[] | undefined,
        behaviorChangeOptions
      )
    : [];

  const MAX_PILLS_TO_SHOW = 2;

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
      {!data.isChild && (
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

          <KV label="Education" value={educationLabel} />
          <KV
            label="Hobbies"
            value={<span title={data.hobbies}>{data.hobbies}</span>}
          />
          <KV
            label="Positive childhood"
            value={data.likedChildhood ? "Yes" : "No"}
          />

          <KV
            label="Sexual Orientation"
            value={
              data.sexualOrientation?.map((s: any) => s.label).join(", ") || "—"
            }
          />
        </div>
      )}

      {/* Two-Week Screener for Children */}
      {data.isChild && (
        <>
          <KV
            label="Sexual Orientation"
            value={
              data.sexualOrientation?.map((s: any) => s.label).join(", ") || "—"
            }
          />
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-[12px] font-medium text-slate-900 mb-1">
              2-Week Screen
            </h4>
            <div className="space-y-3">
              {/* Mood Changes */}
              <div>
                <div className="text-[11px] font-medium text-slate-600 mb-1.5">
                  Mood
                </div>
                {moodChangesList.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {moodChangesList
                      .slice(0, MAX_PILLS_TO_SHOW)
                      .map((label, i) => (
                        <Pill key={i} tone="info">
                          {label}
                        </Pill>
                      ))}
                    {moodChangesList.length > MAX_PILLS_TO_SHOW && (
                      <Pill tone="warn">
                        +{moodChangesList.length - MAX_PILLS_TO_SHOW} more
                      </Pill>
                    )}
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-400">None</p>
                )}
              </div>

              {/* Thought Changes */}
              <div>
                <div className="text-[11px] font-medium text-slate-600 mb-1.5">
                  Thoughts
                </div>
                {thoughtChangesList.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {thoughtChangesList
                      .slice(0, MAX_PILLS_TO_SHOW)
                      .map((label, i) => (
                        <Pill key={i} tone="info">
                          {label}
                        </Pill>
                      ))}
                    {thoughtChangesList.length > MAX_PILLS_TO_SHOW && (
                      <Pill tone="warn">
                        +{thoughtChangesList.length - MAX_PILLS_TO_SHOW} more
                      </Pill>
                    )}
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-400">None</p>
                )}
              </div>

              {/* Behavior Changes */}
              <div>
                <div className="text-[11px] font-medium text-slate-600 mb-1.5">
                  Behavior
                </div>
                {behaviorChangesList.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {behaviorChangesList
                      .slice(0, MAX_PILLS_TO_SHOW)
                      .map((label, i) => (
                        <Pill key={i} tone="info">
                          {label}
                        </Pill>
                      ))}
                    {behaviorChangesList.length > MAX_PILLS_TO_SHOW && (
                      <Pill tone="warn">
                        +{behaviorChangesList.length - MAX_PILLS_TO_SHOW} more
                      </Pill>
                    )}
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-400">None</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
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

export function MedicalHistoryCard({
  data,
  onOpen,
  className,
}: {
  data: ProfileJson;
  onOpen: () => void;
  className?: string;
}) {
  if (!data.isChild) return null;

  const hasMedicalHistory =
    data.childMedicalHistory?.hasNeuropsychTesting ||
    data.childMedicalHistory?.psychiatricHospitalized ||
    data.childMedicalHistory?.suicideThoughtsEver ||
    data.childMedicalHistory?.suicideAttemptEver ||
    data.childMedicalHistory?.selfHarmEver ||
    data.childMedicalHistory?.substanceUseEver ||
    (data.childMedicalHistory?.medicalConditions &&
      data.childMedicalHistory.medicalConditions.length > 0);

  const hasPrenatalHistory =
    data.childPrenatalHistory?.pregnancyHealthy !== undefined ||
    data.childPrenatalHistory?.fullTerm !== undefined;

  const hasDevelopmentalHistory =
    data.childDevelopmentalHistory?.activityLevel ||
    data.childDevelopmentalHistory?.earlyAffectiveStyle;

  const hasPsychiatricHistory =
    data.childPsychiatricHistory?.treatmentKinds &&
    data.childPsychiatricHistory.treatmentKinds.length > 0;

  const hasAnyHistory =
    hasMedicalHistory ||
    hasPrenatalHistory ||
    hasDevelopmentalHistory ||
    hasPsychiatricHistory;

  return (
    <Card
      title={
        <>
          <HeartPulse className="h-4 w-4" />
          Medical History
        </>
      }
      onExpand={onOpen}
      className={className}
    >
      {hasAnyHistory ? (
        <div className="space-y-2 text-[13px]">
          {hasPsychiatricHistory && (
            <div className="flex items-start justify-between py-1">
              <span className="text-slate-600">Previous Treatment</span>
              <span className="text-slate-900 text-right max-w-[200px]">
                {data.childPsychiatricHistory?.treatmentKinds
                  ?.map((t: any) => t.label)
                  .join(", ") || "—"}
              </span>
            </div>
          )}
          {data.childMedicalHistory?.hasNeuropsychTesting && (
            <div className="flex items-start justify-between py-1">
              <span className="text-slate-600">Neuropsych Testing</span>
              <Pill tone="info">Completed</Pill>
            </div>
          )}
          {data.childMedicalHistory?.psychiatricHospitalized && (
            <div className="flex items-start justify-between py-1">
              <span className="text-slate-600">Psychiatric Hosp.</span>
              <Pill tone="warn">Yes</Pill>
            </div>
          )}
          {(data.childMedicalHistory?.suicideThoughtsEver ||
            data.childMedicalHistory?.suicideAttemptEver) && (
            <div className="flex items-start justify-between py-1">
              <span className="text-slate-600">Suicide History</span>
              <Pill tone="danger">
                {data.childMedicalHistory?.suicideAttemptEver
                  ? "Attempt"
                  : "Thoughts"}
              </Pill>
            </div>
          )}
          {data.childMedicalHistory?.selfHarmEver && (
            <div className="flex items-start justify-between py-1">
              <span className="text-slate-600">Self-Harm</span>
              <Pill
                tone={
                  data.childMedicalHistory?.selfHarmStill ? "danger" : "warn"
                }
              >
                {data.childMedicalHistory?.selfHarmStill ? "Current" : "Past"}
              </Pill>
            </div>
          )}
          {hasPrenatalHistory && (
            <div className="flex items-start justify-between py-1">
              <span className="text-slate-600">Birth History</span>
              <span className="text-slate-900">
                {data.childPrenatalHistory?.fullTerm ? "Full term" : "Preterm"}
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[13px] text-slate-500">
          No medical history reported
        </p>
      )}
    </Card>
  );
}
