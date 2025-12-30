import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from "@react-pdf/renderer";
import type { ProfileJson } from "@/app/components/types";
import { intPsychTheme } from "./theme";
import path from "path";
import fs from "fs";

// Load logo as base64 for server-side PDF rendering
// Try multiple paths to support both local dev and production deployments
const getLogoBase64 = () => {
  const possiblePaths = [
    // Production: public folder is copied to root
    path.join(process.cwd(), "public/IP_Logo.png"),
    // Local dev: src/assets folder
    path.join(process.cwd(), "src/assets/IP_Logo.png"),
    // Alternative production paths
    path.join(process.cwd(), "IP_Logo.png"),
    path.join(process.cwd(), ".next/static/media/IP_Logo.png"),
  ];

  for (const logoPath of possiblePaths) {
    try {
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        return `data:image/png;base64,${logoBuffer.toString("base64")}`;
      }
    } catch {
      // Try next path
    }
  }

  console.warn("Logo not found in any expected location");
  return "";
};
const LOGO_SRC = getLogoBase64();

// --- Likert Options with Colors ---
const FREQ_0_3 = [
  { key: "0", label: "Not at all", bg: "#d1fae5", text: "#065f46" },
  { key: "1", label: "Several days", bg: "#fef9c3", text: "#854d0e" },
  {
    key: "2",
    label: "More than half the days",
    bg: "#ffedd5",
    text: "#9a3412",
  },
  { key: "3", label: "Nearly every day", bg: "#ffe4e6", text: "#9f1239" },
];

const ASRS_0_4 = [
  { key: "0", label: "Never", bg: "#d1fae5", text: "#065f46" },
  { key: "1", label: "Rarely", bg: "#ecfccb", text: "#3f6212" },
  { key: "2", label: "Sometimes", bg: "#fef9c3", text: "#854d0e" },
  { key: "3", label: "Often", bg: "#ffedd5", text: "#9a3412" },
  { key: "4", label: "Very often", bg: "#ffe4e6", text: "#9f1239" },
];

const PSS_0_4 = [
  { key: "0", label: "Never", bg: "#d1fae5", text: "#065f46" },
  { key: "1", label: "Almost never", bg: "#ecfccb", text: "#3f6212" },
  { key: "2", label: "Sometimes", bg: "#fef9c3", text: "#854d0e" },
  { key: "3", label: "Fairly often", bg: "#ffedd5", text: "#9a3412" },
  { key: "4", label: "Very often", bg: "#ffe4e6", text: "#9f1239" },
];

const ACE_TRUE_5 = [
  { key: "4", label: "Definitely true", bg: "#d1fae5", text: "#065f46" },
  { key: "3", label: "Probably true", bg: "#ecfccb", text: "#3f6212" },
  { key: "2", label: "Not sure", bg: "#fef9c3", text: "#854d0e" },
  { key: "1", label: "Probably not true", bg: "#ffedd5", text: "#9a3412" },
  { key: "0", label: "Definitely not true", bg: "#ffe4e6", text: "#9f1239" },
];

const YES_NO = [
  { key: "yes", label: "Yes", bg: "#ffe4e6", text: "#9f1239" },
  { key: "no", label: "No", bg: "#f1f5f9", text: "#334155" },
  { key: "1", label: "Yes", bg: "#ffe4e6", text: "#9f1239" },
  { key: "0", label: "No", bg: "#f1f5f9", text: "#334155" },
];

// --- Question Maps ---
const PHQ9_QUESTIONS: Record<string, string> = {
  phq1: "Little interest or pleasure in doing things",
  phq2: "Feeling down, depressed, or hopeless",
  phq3: "Trouble falling or staying asleep, or sleeping too much",
  phq4: "Feeling tired or having little energy",
  phq5: "Poor appetite or overeating",
  phq6: "Feeling bad about yourself — or that you are a failure",
  phq7: "Trouble concentrating on things",
  phq8: "Moving or speaking slowly, or being fidgety/restless",
  phq9: "Thoughts that you would be better off dead",
};

const GAD7_QUESTIONS: Record<string, string> = {
  gad1: "Feeling nervous, anxious, or on edge",
  gad2: "Not being able to stop or control worrying",
  gad3: "Worrying too much about different things",
  gad4: "Trouble relaxing",
  gad5: "Being so restless that it is hard to sit still",
  gad6: "Becoming easily annoyed or irritable",
  gad7: "Feeling afraid as if something awful might happen",
};

const ASRS5_QUESTIONS: Record<string, string> = {
  asrs1: "Trouble wrapping up final details of a project",
  asrs2: "Difficulty getting things in order for organized tasks",
  asrs3: "Problems remembering appointments or obligations",
  asrs4: "Avoiding or delaying tasks that require thought",
  asrs5: "Fidgeting when sitting for a long time",
  asrs6: "Feeling overly active and compelled to do things",
};

const PSS4_QUESTIONS: Record<string, string> = {
  pss1: "Unable to control important things in life",
  pss2: "Confident about handling personal problems",
  pss3: "Felt that things were going your way",
  pss4: "Difficulties piling up so high you could not overcome them",
};

const PTSD_QUESTIONS: Record<string, string> = {
  ptsd1: "Nightmares or thought about traumatic event(s)",
  ptsd2: "Tried hard not to think about traumatic event(s)",
  ptsd3: "Constantly on guard, watchful, or easily startled",
  ptsd4: "Felt numb or detached from people/activities",
  ptsd5: "Felt guilty or unable to stop blaming yourself/others",
};

const ACE_RESILIENCE_QUESTIONS: Record<string, string> = {
  r01: "I believe that my mother loved me when I was little",
  r02: "I believe that my father loved me when I was little",
  r03: "Other people helped take care of me and seemed to love me",
  r04: "Someone in my family enjoyed playing with me as an infant",
  r05: "Relatives made me feel better if I was sad or worried",
  r06: "Neighbors or friends' parents seemed to like me",
  r07: "Teachers, coaches, or youth leaders were there to help me",
  r08: "Family, neighbors, and friends talked about making lives better",
  r09: "We had rules in our house and were expected to keep them",
  r10: "Could almost always find someone I trusted to talk to",
  r11: "People noticed I was capable and could get things done",
  r12: "I was independent and a go-getter",
  r13: "I believed that life is what you make it",
};

const CRAFFT_PARTA_QUESTIONS: Record<string, string> = {
  daysAlcohol: "Alcohol (beer, wine, liquor)",
  daysMarijuana: "Marijuana (weed, vapes, edibles)",
  daysOther: "Other substances to get high",
};

const CRAFFT_QUESTIONS: Record<string, string> = {
  car: "Ridden in a CAR driven by someone who was high",
  relax: "Use alcohol/drugs to RELAX or feel better",
  alone: "Use alcohol/drugs while ALONE",
  forget: "FORGET things while using alcohol/drugs",
  familyFriends: "FAMILY/FRIENDS tell you to cut down",
  trouble: "Gotten into TROUBLE while using",
};

// --- Styles ---
const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: intPsychTheme.text,
    backgroundColor: intPsychTheme.background,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: intPsychTheme.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "column",
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: intPsychTheme.primary,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 9,
    color: intPsychTheme.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  logo: {
    width: 50,
    height: 50,
  },
  section: {
    marginBottom: 14,
    padding: 14,
    backgroundColor: intPsychTheme.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderBottomWidth: 4,
    borderBottomColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: intPsychTheme.primary,
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 6,
    color: intPsychTheme.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  label: {
    width: "38%",
    fontSize: 9,
    color: intPsychTheme.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  value: {
    width: "62%",
    fontSize: 10,
    color: intPsychTheme.text,
    fontFamily: "Helvetica-Bold",
  },
  richTextContainer: {
    marginTop: 4,
    marginBottom: 8,
    paddingLeft: 10,
    paddingVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: intPsychTheme.secondary,
  },
  richTextValue: {
    fontSize: 10,
    color: intPsychTheme.text,
    lineHeight: 1.6,
  },
  likertRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  relationshipCard: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  strongRelationship: {
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
  },
  moderateRelationship: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  strainedRelationship: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  gaugeWrap: {
    marginTop: 6,
    marginBottom: 12,
    flexDirection: "column",
  },
  gaugeLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: intPsychTheme.primary,
    marginBottom: 4,
  },
  gaugeCaption: {
    fontSize: 8,
    color: intPsychTheme.textMuted,
    marginTop: 3,
  },
});

// --- Helper Components ---
const KV = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "—"}</Text>
  </View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const RichTextBlock = ({ label, text }: { label?: string; text?: string }) => {
  if (!text) return null;
  return (
    <View style={{ marginBottom: 10 }}>
      {label && (
        <Text style={[styles.label, { marginBottom: 4, width: "100%" }]}>
          {label}
        </Text>
      )}
      <View style={styles.richTextContainer}>
        <Text style={styles.richTextValue}>{text}</Text>
      </View>
    </View>
  );
};

const scoreSum = (obj: Record<string, any> = {}) =>
  Object.values(obj).reduce(
    (a, v) => a + (typeof v === "string" ? Number(v) || 0 : v || 0),
    0
  );

/**
 * Helper to extract text content from fields that may have:
 * - .text (typed text)
 * - .audio?.transcription (audio transcription)
 * - Both .text AND .audio?.transcription
 * Returns combined text or undefined if neither exists.
 */
const getTextOrTranscription = (
  field: { text?: string; audio?: { transcription?: string } } | undefined
): string | undefined => {
  if (!field) return undefined;
  const text = field.text?.trim();
  const transcription = field.audio?.transcription?.trim();

  if (text && transcription) {
    // If both exist, combine them with a separator
    return `${text}\n\n[Audio Transcription]:\n${transcription}`;
  }
  // Return whichever one exists
  return text || transcription || undefined;
};

// PDF Gauge Component with SVG gradient bar
const PdfGauge = ({
  label,
  score,
  max,
  caption,
}: {
  label: string;
  score: number;
  max: number;
  caption?: string;
}) => {
  const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const v = clamp01(max > 0 ? score / max : 0);
  const pct = Math.round(v * 1000) / 10;
  const W = 420;
  const H = 12;
  const corner = 6;
  const SVG_H = H + 6;
  const BAR_Y = 3;
  const TICK_W = 5;
  const rawX = (pct / 100) * W;
  const EDGE_PAD_PX = TICK_W / 2 + 1;
  const tickerX = Math.max(EDGE_PAD_PX, Math.min(W - EDGE_PAD_PX, rawX));
  const TICK_RX = 2.5;
  const TICK_Y = BAR_Y - 2;
  const TICK_H = H + 4;

  return (
    <View style={styles.gaugeWrap}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flexGrow: 1, paddingRight: 12 }}>
          <Text style={styles.gaugeLabel}>{label}</Text>
          <Svg width={W} height={SVG_H}>
            <Defs>
              <LinearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#B8E4DA" />
                <Stop offset="50%" stopColor="#3A9CE2" />
                <Stop offset="100%" stopColor="#05539C" />
              </LinearGradient>
            </Defs>
            <Rect
              x={0}
              y={BAR_Y}
              width={W}
              height={H}
              rx={corner}
              ry={corner}
              fill="#e5e7eb"
            />
            <Rect
              x={0}
              y={BAR_Y}
              width={W}
              height={H}
              rx={corner}
              ry={corner}
              fill="url(#barGrad)"
            />
            <Rect
              x={tickerX - TICK_W / 2}
              y={TICK_Y + 1}
              width={TICK_W}
              height={TICK_H}
              rx={TICK_RX}
              ry={TICK_RX}
              fill="#0f172a"
              opacity={0.18}
            />
            <Rect
              x={tickerX - TICK_W / 2}
              y={TICK_Y}
              width={TICK_W}
              height={TICK_H}
              rx={TICK_RX}
              ry={TICK_RX}
              fill="#ffffff"
            />
            <Rect
              x={tickerX - TICK_W / 2}
              y={TICK_Y}
              width={TICK_W}
              height={TICK_H}
              rx={TICK_RX}
              ry={TICK_RX}
              stroke="#94a3b8"
              strokeWidth={0.75}
            />
          </Svg>
        </View>
        <View style={{ minWidth: 35, alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Helvetica-Bold",
              color: "#05539C",
              lineHeight: 1.0,
            }}
          >
            {String(score)}
          </Text>
        </View>
      </View>
      {caption && <Text style={styles.gaugeCaption}>{caption}</Text>}
    </View>
  );
};

// Response Pill - narrower width
const QuestionResponse = ({
  question,
  answer,
  options,
}: {
  question: string;
  answer: any;
  options?: { key: string; label: string; bg: string; text: string }[];
}) => {
  let displayLabel = "—";
  let bg = "#f1f5f9";
  let textColor = "#334155";

  if (options) {
    const opt = options.find((o) => o.key === String(answer));
    if (opt) {
      displayLabel = opt.label;
      bg = opt.bg;
      textColor = opt.text;
    } else if (answer !== undefined && answer !== null && answer !== "") {
      displayLabel = String(answer);
    }
  } else {
    displayLabel = String(answer || "—");
  }

  return (
    <View style={styles.likertRow}>
      <Text
        style={{
          fontSize: 8,
          color: intPsychTheme.textMuted,
          width: "72%",
          lineHeight: 1.3,
        }}
      >
        {question}
      </Text>
      <View
        style={{
          backgroundColor: bg,
          borderRadius: 10,
          paddingTop: 4,
          paddingBottom: 2,
          paddingHorizontal: 8,
        }}
      >
        <Text
          style={{
            fontSize: 7,
            color: textColor,
            fontFamily: "Helvetica-Bold",
            textAlign: "center",
          }}
        >
          {displayLabel}
        </Text>
      </View>
    </View>
  );
};

// Relationship helpers
type Strength = "really_bad" | "not_great" | "pretty_good" | "really_good";

const strengthLabel = (s: Strength) => {
  switch (s) {
    case "really_good":
      return "Really good";
    case "pretty_good":
      return "Pretty good";
    case "not_great":
      return "Not great";
    case "really_bad":
      return "Really bad";
    default:
      return "Unknown";
  }
};

export const AssessmentReportPDFAdult = ({
  profile,
}: {
  profile: ProfileJson;
}) => {
  const fullName = `${profile.firstName || ""} ${
    profile.lastName || ""
  }`.trim();
  const isChild = profile.isChild;

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return "—";
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10)
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    return phone;
  };

  const getSafetyRisk = () => {
    const risks: string[] = [];
    const assessments = profile.assessments;
    if (assessments) {
      if (assessments.kind === "adult") {
        if (assessments.data.suicide?.thoughts === "yes")
          risks.push("Suicidal Thoughts");
        if (assessments.data.suicide?.wishDead === "yes")
          risks.push("Wish to be Dead");
        if (assessments.data.selfHarm?.pastMonth === "yes")
          risks.push("Self Harm (Past Month)");
      } else if (assessments.kind === "child") {
        if (assessments.data.cssrs?.thoughts === "yes")
          risks.push("Suicidal Thoughts");
        if (assessments.data.cssrs?.wishDead === "yes")
          risks.push("Wish to be Dead");
      }
    }
    return risks;
  };
  const safetyRisks = getSafetyRisk();

  // Extract adult assessments with proper typing
  const adultAssessments =
    profile.assessments?.kind === "adult" ? profile.assessments.data : null;

  const relationships = Array.isArray(profile.relationships)
    ? profile.relationships
    : [];
  const strongRelationships = relationships.filter(
    (r: any) => r.strength === "really_good"
  );
  const moderateRelationships = relationships.filter(
    (r: any) => r.strength === "pretty_good"
  );
  const strainedRelationships = relationships.filter(
    (r: any) => r.strength === "not_great" || r.strength === "really_bad"
  );

  const renderRelationshipGroup = (
    title: string,
    items: any[],
    styleType: "strong" | "moderate" | "strained"
  ) => {
    if (!items.length) return null;
    const cardStyle =
      styleType === "strong"
        ? styles.strongRelationship
        : styleType === "moderate"
        ? styles.moderateRelationship
        : styles.strainedRelationship;
    return (
      <View style={{ marginBottom: 10 }}>
        <Text style={[styles.subSectionTitle, { marginBottom: 6 }]}>
          {title}
        </Text>
        {items.map((rel: any, i: number) => (
          <View key={i} style={[styles.relationshipCard, cardStyle]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: intPsychTheme.text,
                }}
              >
                {rel.name}
              </Text>
              <View
                style={{
                  backgroundColor: rel.happy ? "#d1fae5" : "#fecaca",
                  paddingHorizontal: 8,
                  paddingTop: 4,
                  paddingBottom: 2,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 7,
                    color: rel.happy ? "#065f46" : "#991b1b",
                    fontFamily: "Helvetica-Bold",
                  }}
                >
                  {rel.happy ? "Happy" : "Unhappy"}
                </Text>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 8, color: intPsychTheme.textMuted }}>
                {rel.role}
              </Text>
              <Text style={{ fontSize: 8, color: intPsychTheme.textMuted }}>
                {strengthLabel(rel.strength)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              Adult Intake Assessment Report
            </Text>
            <Text style={styles.headerSubtitle}>
              Patient: {fullName} • Created:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          {LOGO_SRC && <Image style={styles.logo} src={LOGO_SRC} />}
        </View>

        {/* Safety Alert */}
        {safetyRisks.length > 0 && (
          <View
            style={[
              styles.section,
              { borderBottomColor: "#dc2626", backgroundColor: "#fef2f2" },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: "#991b1b" }]}>
              Safety Alerts
            </Text>
            {safetyRisks.map((risk, idx) => (
              <Text
                key={idx}
                style={{ color: "#991b1b", fontSize: 10, marginBottom: 3 }}
              >
                • {risk}
              </Text>
            ))}
          </View>
        )}

        {/* Patient Details */}
        <View style={styles.section}>
          <SectionHeader title="Patient Details" />
          <KV label="Name" value={fullName} />
          <KV label="Email" value={profile.email} />
          <KV label="Date of Birth" value={profile.dob} />
          <KV label="Age" value={profile.age} />
          <KV
            label="Contact"
            value={formatPhoneNumber(profile.contactNumber)}
          />
          <KV label="Gender" value={profile.genderIdentity} />
          <KV
            label="Pronouns"
            value={profile.pronouns?.map((p) => p.label).join(", ")}
          />
          <KV
            label="Ethnicity"
            value={profile.ethnicity?.map((e) => e.label).join(", ")}
          />
          <KV
            label="Religion"
            value={profile.religion?.map((r) => r.label).join(", ")}
          />
          {!isChild && (
            <>
              <KV
                label="Marital"
                value={profile.isMarried ? "Married" : "Single"}
              />
              <KV
                label="Employment"
                value={profile.isEmployed ? "Employed" : "Unemployed"}
              />
              <KV label="Education" value={profile.highestDegree} />
            </>
          )}
          <KV
            label="Height"
            value={`${profile.height?.feet || 0}'${
              profile.height?.inches || 0
            }"`}
          />
          <KV
            label="Weight"
            value={profile.weightLbs ? `${profile.weightLbs} lbs` : null}
          />
        </View>

        {/* At a Glance */}
        <View style={styles.section}>
          <SectionHeader title="At a Glance" />
          {!isChild && (
            <>
              <KV
                label="Diet"
                value={profile.dietType?.map((d) => d.label).join(", ")}
              />
              <KV label="Occupation" value={profile.jobDetails} />
            </>
          )}
          <Text style={styles.subSectionTitle}>2-Week Screen</Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}
          >
            {[
              ...(profile.moodChanges || []),
              ...(profile.thoughtChanges || []),
              ...(profile.behaviorChanges || []),
            ].length > 0 ? (
              [
                ...(profile.moodChanges || []),
                ...(profile.thoughtChanges || []),
                ...(profile.behaviorChanges || []),
              ].map((change, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: "#e2e8f0",
                    borderRadius: 8,
                    paddingTop: 4,
                    paddingBottom: 2,
                    paddingHorizontal: 8,
                    marginRight: 4,
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontSize: 8, color: intPsychTheme.text }}>
                    {change}
                  </Text>
                </View>
              ))
            ) : (
              <Text
                style={{
                  fontSize: 9,
                  color: intPsychTheme.textMuted,
                  fontStyle: "italic",
                }}
              >
                No significant changes reported.
              </Text>
            )}
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <SectionHeader title="Presenting Goals" />
          <RichTextBlock text={getTextOrTranscription(profile.goals)} />
          {!getTextOrTranscription(profile.goals) && (
            <Text
              style={{
                fontStyle: "italic",
                color: intPsychTheme.textMuted,
                fontSize: 9,
              }}
            >
              No goals provided.
            </Text>
          )}
        </View>

        {/* Follow-up Questions */}
        {profile.followupQuestions && (
          <View style={styles.section}>
            <SectionHeader title="Follow-up Questions" />
            {profile.followupQuestions.question1?.question && (
              <RichTextBlock
                label={profile.followupQuestions.question1.question}
                text={getTextOrTranscription(
                  profile.followupQuestions.question1.answer
                )}
              />
            )}
            {profile.followupQuestions.question2?.question && (
              <RichTextBlock
                label={profile.followupQuestions.question2.question}
                text={getTextOrTranscription(
                  profile.followupQuestions.question2.answer
                )}
              />
            )}
            {profile.followupQuestions.question3?.question && (
              <RichTextBlock
                label={profile.followupQuestions.question3.question}
                text={getTextOrTranscription(
                  profile.followupQuestions.question3.answer
                )}
              />
            )}
          </View>
        )}
        {/* Story */}
        <View style={styles.section}>
          <SectionHeader title="Story & History" />
          <RichTextBlock
            label="Story Narrative"
            text={getTextOrTranscription(profile.storyNarrative)}
          />
          <RichTextBlock
            label="Living Situation"
            text={getTextOrTranscription(profile.livingSituation)}
          />
          <RichTextBlock
            label="Cultural Context"
            text={getTextOrTranscription(profile.cultureContext)}
          />
          <RichTextBlock
            label="Upbringing"
            text={profile.upbringingWhoWith?.text}
          />
          <RichTextBlock
            label="Upbringing Environments"
            text={profile.upbringingEnvironments?.text}
          />
          {!isChild && profile.likedChildhood === false && (
            <RichTextBlock
              label="Childhood Negative Reason"
              text={profile.childhoodNegativeReason?.text}
            />
          )}
          <RichTextBlock
            label="Family History"
            text={profile.familyHistoryElaboration?.text}
          />
        </View>

        {/* Previous Treatment */}
        {!isChild && (
          <View style={styles.section}>
            <SectionHeader title="Previous Treatment" />
            <KV label="Therapy Duration" value={profile.therapyDuration} />
            <KV label="Prev. Diagnosis" value={profile.previousDiagnosis} />
            <RichTextBlock
              label="Treatment Summary"
              text={profile.prevTreatmentSummary?.text}
            />
          </View>
        )}

        {/* Medical History */}
        <View style={styles.section}>
          <SectionHeader title="Medical History" />
          {profile.currentMedications &&
          profile.currentMedications.length > 0 ? (
            <>
              <Text style={styles.subSectionTitle}>Current Medications</Text>
              {profile.currentMedications.map((med, i) => (
                <View
                  key={i}
                  style={{
                    marginBottom: 6,
                    paddingLeft: 8,
                    borderLeftWidth: 2,
                    borderLeftColor: intPsychTheme.secondary,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: "Helvetica-Bold",
                      color: intPsychTheme.text,
                    }}
                  >
                    {med.name} {med.dosage}
                  </Text>
                  <Text style={{ fontSize: 9, color: intPsychTheme.textMuted }}>
                    {med.frequency} • {med.purpose}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <Text
              style={{
                fontSize: 9,
                color: intPsychTheme.textMuted,
                fontStyle: "italic",
              }}
            >
              No current medications.
            </Text>
          )}
          {profile.medicalAllergies && profile.medicalAllergies.length > 0 && (
            <>
              <Text style={styles.subSectionTitle}>Allergies</Text>
              {profile.medicalAllergies.map((alg, i) => (
                <Text
                  key={i}
                  style={{
                    fontSize: 9,
                    marginLeft: 8,
                    color: intPsychTheme.text,
                  }}
                >
                  • {alg.name} ({alg.reaction})
                </Text>
              ))}
            </>
          )}
          {profile.previousHospitalizations &&
            profile.previousHospitalizations.length > 0 && (
              <>
                <Text style={styles.subSectionTitle}>Hospitalizations</Text>
                {profile.previousHospitalizations.map((hosp, i) => (
                  <View key={i} style={{ marginBottom: 4, marginLeft: 8 }}>
                    <Text style={{ fontSize: 9, color: intPsychTheme.text }}>
                      • {hosp.hospitalName} ({hosp.date}) - {hosp.reason}
                    </Text>
                  </View>
                ))}
              </>
            )}
        </View>

        {/* Relationships */}
        <View style={styles.section}>
          <SectionHeader title="Relationships" />
          {relationships.length > 0 ? (
            <>
              {renderRelationshipGroup(
                "Strong Connections",
                strongRelationships,
                "strong"
              )}
              {renderRelationshipGroup(
                "Moderate Connections",
                moderateRelationships,
                "moderate"
              )}
              {renderRelationshipGroup(
                "Strained / Difficult",
                strainedRelationships,
                "strained"
              )}
            </>
          ) : (
            <Text
              style={{
                fontSize: 9,
                color: intPsychTheme.textMuted,
                fontStyle: "italic",
              }}
            >
              No relationship details provided.
            </Text>
          )}
        </View>

        {/* Assessment Scales with Gauges */}
        <View style={styles.section} break>
          <SectionHeader title="Assessment Scales" />
          {adultAssessments && (
            <>
              {/* PHQ-9 */}
              <PdfGauge
                label="Depression (PHQ-9)"
                score={scoreSum(adultAssessments.phq9)}
                max={27}
                caption="0–4 minimal · 5–9 mild · 10–14 moderate · 15+ severe"
              />
              {Object.entries(PHQ9_QUESTIONS).map(([key, q]) => (
                <QuestionResponse
                  key={key}
                  question={q}
                  answer={adultAssessments.phq9?.[key]}
                  options={FREQ_0_3}
                />
              ))}

              {/* GAD-7 */}
              <PdfGauge
                label="Anxiety (GAD-7)"
                score={scoreSum(adultAssessments.gad7)}
                max={21}
                caption="0–4 minimal · 5–9 mild · 10–14 moderate · 15+ severe"
              />
              {Object.entries(GAD7_QUESTIONS).map(([key, q]) => (
                <QuestionResponse
                  key={key}
                  question={q}
                  answer={adultAssessments.gad7?.[key]}
                  options={FREQ_0_3}
                />
              ))}

              {/* ASRS-5 */}
              <PdfGauge
                label="Adult ADHD (ASRS-5)"
                score={scoreSum(adultAssessments.asrs5)}
                max={24}
                caption=">14 = possible ADHD symptoms"
              />
              {Object.entries(ASRS5_QUESTIONS).map(([key, q]) => (
                <QuestionResponse
                  key={key}
                  question={q}
                  answer={adultAssessments.asrs5?.[key]}
                  options={ASRS_0_4}
                />
              ))}

              {/* PSS-4 */}
              <PdfGauge
                label="Stress (PSS-4)"
                score={scoreSum(adultAssessments.stress)}
                max={16}
                caption="Higher = more stress"
              />
              {Object.entries(PSS4_QUESTIONS).map(([key, q]) => (
                <QuestionResponse
                  key={key}
                  question={q}
                  answer={adultAssessments.stress?.[key]}
                  options={PSS_0_4}
                />
              ))}

              {/* PTSD */}
              <PdfGauge
                label="PTSD Flags (PC-PTSD-5)"
                score={
                  Object.values(adultAssessments.ptsd || {}).filter(
                    (v) => String(v).toLowerCase() === "yes"
                  ).length
                }
                max={5}
                caption="Count of 'Yes' responses"
              />
              {Object.entries(PTSD_QUESTIONS).map(([key, q]) => (
                <QuestionResponse
                  key={key}
                  question={q}
                  answer={adultAssessments.ptsd?.[key]}
                  options={YES_NO}
                />
              ))}

              {/* ACE Resilience */}
              <PdfGauge
                label="ACE Resilience"
                score={scoreSum(adultAssessments.aceResilience)}
                max={52}
                caption="Higher = greater resilience"
              />
              {Object.entries(ACE_RESILIENCE_QUESTIONS).map(([key, q]) => (
                <QuestionResponse
                  key={key}
                  question={q}
                  answer={adultAssessments.aceResilience?.[key]}
                  options={ACE_TRUE_5}
                />
              ))}

              {/* CRAFFT */}
              <PdfGauge
                label="Substance Use Risk (CRAFFT)"
                score={[
                  "car",
                  "relax",
                  "alone",
                  "forget",
                  "familyFriends",
                  "trouble",
                ].reduce(
                  (acc, k) =>
                    acc +
                    (String(
                      adultAssessments.crafft?.partB?.[k] ?? ""
                    ).toLowerCase() === "yes"
                      ? 1
                      : 0),
                  0
                )}
                max={6}
                caption="Count of 'Yes' responses (Part B)"
              />
              {/* Part A: Days of substance use */}
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Helvetica-Bold",
                  color: intPsychTheme.textMuted,
                  marginTop: 8,
                  marginBottom: 4,
                }}
              >
                Substance Use in Past 12 Months
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                {Object.entries(CRAFFT_PARTA_QUESTIONS).map(([key, q]) => {
                  const days = adultAssessments.crafft?.partA?.[key];
                  return (
                    <View
                      key={key}
                      style={{
                        width: "32%",
                        marginRight: "1%",
                        marginBottom: 6,
                        padding: 8,
                        backgroundColor: "#f8fafc",
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: "#e2e8f0",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 7,
                          color: intPsychTheme.textMuted,
                          marginBottom: 2,
                        }}
                      >
                        {q}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "Helvetica-Bold",
                          color: intPsychTheme.text,
                        }}
                      >
                        {days !== undefined && days !== ""
                          ? `${days} days`
                          : "—"}
                      </Text>
                    </View>
                  );
                })}
              </View>
              {/* Part B: Yes/No questions */}
              {Object.entries(CRAFFT_QUESTIONS).map(([key, q]) => (
                <QuestionResponse
                  key={key}
                  question={q}
                  answer={adultAssessments.crafft?.partB?.[key]}
                  options={YES_NO}
                />
              ))}
            </>
          )}
          {!adultAssessments && (
            <Text
              style={{
                fontSize: 9,
                color: intPsychTheme.textMuted,
                fontStyle: "italic",
              }}
            >
              No assessment data available.
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};
