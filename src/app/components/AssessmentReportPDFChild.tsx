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
const DISC_0_1 = [
  { key: "0", label: "No", bg: "#d1fae5", text: "#065f46" },
  { key: "1", label: "Yes", bg: "#ffe4e6", text: "#9f1239" },
];

const SNAP_0_3 = [
  { key: "0", label: "Not at all", bg: "#d1fae5", text: "#065f46" },
  { key: "1", label: "Just a little", bg: "#fef9c3", text: "#854d0e" },
  { key: "2", label: "Quite a bit", bg: "#ffedd5", text: "#9a3412" },
  { key: "3", label: "Very much", bg: "#ffe4e6", text: "#9f1239" },
];

const SCARED_0_2 = [
  { key: "0", label: "Not true/Hardly ever", bg: "#d1fae5", text: "#065f46" },
  { key: "1", label: "Somewhat/Sometimes", bg: "#fef9c3", text: "#854d0e" },
  { key: "2", label: "Very true/Often", bg: "#ffe4e6", text: "#9f1239" },
];

const YES_NO = [
  { key: "yes", label: "Yes", bg: "#ffe4e6", text: "#9f1239" },
  { key: "no", label: "No", bg: "#f1f5f9", text: "#334155" },
  { key: "1", label: "Yes", bg: "#ffe4e6", text: "#9f1239" },
  { key: "0", label: "No", bg: "#f1f5f9", text: "#334155" },
];

// --- Label Mapping Dictionaries for snake_case -> Human Readable ---
const MEDICAL_CONDITIONS_LABELS: Record<string, string> = {
  head_injury: "Head injury / loss of consciousness",
  seizures: "Seizures / convulsions",
  other_neuro: "Other neurological problems",
  ent: "Ear, nose or throat problems",
  dental: "Dental problems",
  asthma: "Asthma",
  chest: "Chest problems",
  gi: "Stomach or bowel problems / soiling",
  urinary: "Urinary or bladder / wetting",
  gyn_menses: "Gynecological / menstrual",
  heart: "Heart problems",
  liver_kidney: "Liver / kidney problems",
  skin: "Skin problems",
  joint_limb: "Joint / limb problems",
  rheumatic_strep: "Rheumatic fever / strep infections",
  hearing_vision: "Hearing / vision problems",
  endocrine_growth: "Growth / endocrine problems",
  accidents_fractures: "Serious accidents / fractures",
  measles_mumps: "Childhood measles / mumps",
  chicken_pox: "Chicken pox",
  other: "Other",
  none: "None",
};

const MILESTONE_MOTOR_LABELS: Record<string, string> = {
  rolled_front_back_4mo: "Rolled front/back (4 mo)",
  sit_with_support_6mo: "Sit with support (6 mo)",
  sit_alone_9mo: "Sit alone (9 mo)",
  pull_to_stand_10mo: "Pull to stand (10 mo)",
  crawling_10_12mo: "Crawling (10–12 mo)",
  walks_alone_10_18mo: "Walks alone (10–18 mo)",
  running_15_24mo: "Running (15–24 mo)",
  tricycle_3y: "Tricycle (3 yrs)",
  bicycle_5_7y: "Bicycle (5–7 yrs)",
};

const MILESTONE_LANGUAGE_LABELS: Record<string, string> = {
  smiling_4_6w: "Smiling (4–6 wks)",
  cooing_3mo: "Cooing (3 mo)",
  babbling_6mo: "Babbling (6 mo)",
  jargon_10_14mo: "Jargon (10–14 mo)",
  first_word_12mo: "First word (12 mo)",
  follows_1step_15mo: "Follows 1-step commands (15 mo)",
  two_word_combo_22mo: "2 word combo (22 mo)",
  three_word_sentence_3y: "3 word sentence (3 years)",
  speech_problems: "Speech Problems",
};

const MILESTONE_ADAPTIVE_LABELS: Record<string, string> = {
  mouthing_3mo: "Mouthing (3 mo)",
  transfers_objects_6mo: "Transfers objects (6 mo)",
  picks_up_raisin_11_12mo: "Picks up raisin (11–12 mo)",
  scribble_15mo: "Scribble (15 mo)",
  drinks_from_cup_10mo: "Drinks from cup (10 mo)",
  uses_spoon_12_15mo: "Uses spoon (12–15 mo)",
  washes_hands: "Washes hands",
  undresses: "Undresses",
  bladder_trained: "Bladder trained",
  bowel_trained: "Bowel trained",
};

const DEVELOPMENTAL_HISTORY_LABELS: Record<string, string> = {
  active: "Active",
  active_but_calm: "Active but calm",
  passive: "Passive",
  cuddly: "Cuddly",
  irritable: "Irritable",
  withdrawn: "Withdrawn",
  easily_frequently: "Easily & Frequently",
  reasonable: "Reasonable Amount",
  seldom: "Seldom",
  soothed_easily: "Soothed Easily",
  difficult_to_soothe: "Difficult to Soothe",
  average: "Average",
  friendly: "Friendly",
  indifferent: "Indifferent",
  fearful: "Fearful",
  other: "Other",
};

/** Helper to convert snake_case values to human-readable labels */
const formatLabel = (
  value: string | undefined | null,
  labelMap?: Record<string, string>
): string => {
  if (!value) return "—";
  if (labelMap && labelMap[value]) return labelMap[value];
  // Fallback: convert snake_case to Title Case
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// --- Question Maps ---
const DISC_CHILD_QUESTIONS: Record<string, string> = {
  dtds01: "Have you often felt sad or depressed?",
  dtds02: "Felt like nothing is fun and you aren't interested in anything?",
  dtds03: "Often felt grouchy or irritable and often in a bad mood?",
  dtds04: "Have you lost weight, more than just a few pounds?",
  dtds05: "Have you lost your appetite or often felt less like eating?",
  dtds06: "Have you gained a lot of weight, more than just a few pounds?",
  dtds07: "Felt much hungrier than usual or eaten a lot more than usual?",
  dtds08:
    "Trouble sleeping – falling asleep, staying asleep, or waking too early?",
  dtds09: "Have you slept more during the day than you usually do?",
  dtds10: "Often felt slowed down – walked or talked much slower than usual?",
  dtds11: "Often felt restless – like you just had to keep walking around?",
  dtds12: "Have you had less energy than you usually do?",
  dtds13: "Has doing even little things made you feel really tired?",
  dtds14: "Have you often blamed yourself for bad things that happened?",
  dtds15: "Felt you couldn't do anything well or weren't as good as others?",
  dtds16: "Seemed like you couldn't think as clearly or as fast as usual?",
  dtds17: "Often had trouble keeping your mind on schoolwork or other things?",
  dtds18: "Often been hard to make up your mind or make decisions?",
  dtds19: "Often thought about death or about being dead yourself?",
  dtds20: "Have you thought seriously about killing yourself?",
  dtds21: "Have you EVER tried to kill yourself or made a suicide attempt?",
  dtds22: "Have you tried to kill yourself in the last four weeks?",
};

const SNAP_QUESTIONS: Record<string, string> = {
  snap01:
    "Often fails to give close attention to details or makes careless mistakes",
  snap02:
    "Often has difficulty sustaining attention in tasks or play activities",
  snap03: "Often does not seem to listen when spoken to directly",
  snap04:
    "Often does not follow through on instructions and fails to finish schoolwork",
  snap05: "Often has difficulty organizing tasks and activities",
  snap06: "Often avoids tasks requiring sustained mental effort",
  snap07: "Often loses things necessary for activities",
  snap08: "Often is distracted by extraneous stimuli",
  snap09: "Often is forgetful in daily activities",
  snap10: "Often fidgets with hands or feet or squirms in seat",
  snap11: "Often leaves seat when remaining seated is expected",
  snap12: "Often runs about or climbs excessively inappropriately",
  snap13:
    "Often has difficulty playing or engaging in leisure activities quietly",
  snap14: "Often is 'on the go' or acts as if 'driven by a motor'",
  snap15: "Often talks excessively",
  snap16: "Often blurts out answers before questions have been completed",
  snap17: "Often has difficulty awaiting turn",
  snap18: "Often interrupts or intrudes on others",
  snap19: "Often loses temper",
  snap20: "Often argues with adults",
  snap21: "Often actively defies or refuses adult requests or rules",
  snap22: "Often deliberately does things that annoy other people",
  snap23: "Often blames others for his or her mistakes or misbehaviour",
  snap24: "Often is touchy or easily annoyed by others",
  snap25: "Often is angry and resentful",
  snap26: "Often is spiteful or vindictive",
};

const SCARED_CHILD_QUESTIONS: Record<string, string> = {
  scared01: "When I feel frightened, it is hard for me to breathe",
  scared02: "I get headaches when I am at school",
  scared03: "I don't like to be with people I don't know well",
  scared04: "I get scared if I sleep away from home",
  scared05: "I worry about other people liking me",
  scared06: "When I get frightened, I feel like passing out",
  scared07: "I am nervous",
  scared08: "I follow my mother or father wherever they go",
  scared09: "People tell me that I look nervous",
  scared10: "I feel nervous with people I don't know well",
  scared11: "I get stomachaches at school",
  scared12: "When I get frightened, I feel like I am going crazy",
  scared13: "I worry about sleeping alone",
  scared14: "I worry about being as good as other kids",
  scared15: "When I get frightened, I feel like things are not real",
  scared16: "I have nightmares about something bad happening to my parents",
  scared17: "I worry about going to school",
  scared18: "When I get frightened, my heart beats fast",
  scared19: "I get shaky",
  scared20: "I have nightmares about something bad happening to me",
  scared21: "I worry about things working out for me",
  scared22: "When I get frightened, I sweat a lot",
  scared23: "I am a worrier",
  scared24: "I get really frightened for no reason at all",
  scared25: "I am afraid to be alone in the house",
  scared26: "It is hard for me to talk with people I don't know well",
  scared27: "When I get frightened, I feel like I am choking",
  scared28: "People tell me that I worry too much",
  scared29: "I don't like to be away from my family",
  scared30: "I am afraid of having anxiety (or panic) attacks",
  scared31: "I worry that something bad might happen to my parents",
  scared32: "I feel shy with people I don't know well",
  scared33: "I worry about what is going to happen in the future",
  scared34: "When I get frightened, I feel like throwing up",
  scared35: "I worry about how well I do things",
  scared36: "I am scared to go to school",
  scared37: "I worry about things that have already happened",
  scared38: "When I get frightened, I feel dizzy",
  scared39: "I feel nervous when others watch me do something",
  scared40: "I feel nervous going to parties with people I don't know well",
  scared41: "I am shy",
};

// DISC Teen Depression questions (parent report)
const DISC_PARENT_QUESTIONS: Record<string, string> = {
  dtds01: "Has your child often seemed sad or depressed?",
  dtds02: "Has it seemed like nothing was fun for your child?",
  dtds03: "Has your child often been grouchy or irritable?",
  dtds04: "Has your child lost weight, more than just a few pounds?",
  dtds05: "Has your child lost their appetite or ate less than usual?",
  dtds06: "Has your child gained a lot of weight?",
  dtds07: "Has your child felt much hungrier than usual?",
  dtds08: "Has your child had trouble sleeping?",
  dtds09: "Has your child slept more during the day than usual?",
  dtds10: "Has your child seemed to walk or talk much more slowly?",
  dtds11: "Has your child often seemed restless?",
  dtds12: "Has your child seemed to have less energy than usual?",
  dtds13: "Has doing little things made your child feel tired?",
  dtds14: "Has your child blamed themselves for bad things?",
  dtds15: "Has your child said they couldn't do anything well?",
  dtds16: "Has it seemed like your child couldn't think as clearly?",
  dtds17: "Has your child had trouble keeping their mind on things?",
  dtds18: "Has it been hard for your child to make decisions?",
  dtds19: "Has your child said they thought about death?",
  dtds20: "Has your child talked seriously about killing themselves?",
  dtds21: "Has your child tried to kill themselves in the last 4 weeks?",
  dtds22: "Has your child EVER tried to kill themselves?",
};

// SCARED questions (parent report)
const SCARED_PARENT_QUESTIONS: Record<string, string> = {
  scared01: "When my child feels frightened, it is hard for them to breathe",
  scared02: "My child gets headaches when at school",
  scared03: "My child doesn't like to be with people they don't know well",
  scared04: "My child gets scared if they sleep away from home",
  scared05: "My child worries about other people liking them",
  scared06: "When my child gets frightened, they feel like passing out",
  scared07: "My child is nervous",
  scared08: "My child follows me wherever I go",
  scared09: "People tell me that my child looks nervous",
  scared10: "My child feels nervous with people they don't know well",
  scared11: "My child gets stomachaches at school",
  scared12: "When my child gets frightened, they feel like going crazy",
  scared13: "My child worries about sleeping alone",
  scared14: "My child worries about being as good as other kids",
  scared15: "When frightened, my child feels like things are not real",
  scared16: "My child has nightmares about something bad happening to parents",
  scared17: "My child worries about going to school",
  scared18: "When my child gets frightened, their heart beats fast",
  scared19: "My child gets shaky",
  scared20: "My child has nightmares about something bad happening to them",
  scared21: "My child worries about things working out for them",
  scared22: "When my child gets frightened, they sweat a lot",
  scared23: "My child is a worrier",
  scared24: "My child gets really frightened for no reason at all",
  scared25: "My child is afraid to be alone in the house",
  scared26: "It is hard for my child to talk with people they don't know",
  scared27: "When my child gets frightened, they feel like choking",
  scared28: "People tell me that my child worries too much",
  scared29: "My child doesn't like to be away from family",
  scared30: "My child is afraid of having anxiety (or panic) attacks",
  scared31: "My child worries something bad might happen to parents",
  scared32: "My child feels shy with people they don't know well",
  scared33: "My child worries about what is going to happen in the future",
  scared34: "When my child gets frightened, they feel like throwing up",
  scared35: "My child worries about how well they do things",
  scared36: "My child is scared to go to school",
  scared37: "My child worries about things that have already happened",
  scared38: "When my child gets frightened, they feel dizzy",
  scared39: "My child feels nervous when others watch them do something",
  scared40: "My child feels nervous going to parties with unknown people",
  scared41: "My child is shy",
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
  value?: string | number | null | boolean;
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>
      {value === true ? "Yes" : value === false ? "No" : value || "—"}
    </Text>
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

// Response Pill
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

export const AssessmentReportPDFChild = ({
  profile,
}: {
  profile: ProfileJson;
}) => {
  const fullName = `${profile.firstName || ""} ${
    profile.lastName || ""
  }`.trim();

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
    if (assessments && assessments.kind === "child") {
      if (assessments.data.cssrs?.thoughts === "yes")
        risks.push("Suicidal Thoughts");
      if (assessments.data.cssrs?.wishDead === "yes")
        risks.push("Wish to be Dead");
    }
    // Check child medical history for safety concerns
    if (profile.childMedicalHistory?.suicideThoughtsEver)
      risks.push("History of Suicidal Thoughts");
    if (profile.childMedicalHistory?.suicideAttemptEver)
      risks.push("History of Suicide Attempt");
    if (profile.childMedicalHistory?.selfHarmEver)
      risks.push("History of Self Harm");
    return risks;
  };
  const safetyRisks = getSafetyRisk();

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

  // Child assessment data
  const childAssessments =
    profile.assessments?.kind === "child" ? profile.assessments.data : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              Child Intake Assessment Report
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

        {/* Parent/Guardian Info */}
        {(profile.parent1FirstName || profile.parent2FirstName) && (
          <View style={styles.section}>
            <SectionHeader title="Parent/Guardian Info" />
            {profile.parent1FirstName && (
              <KV
                label="Parent 1"
                value={`${profile.parent1FirstName} ${
                  profile.parent1LastName || ""
                }`}
              />
            )}
            {profile.parent2FirstName && (
              <KV
                label="Parent 2"
                value={`${profile.parent2FirstName} ${
                  profile.parent2LastName || ""
                }`}
              />
            )}
            <KV label="Occupation" value={profile.parentOccupation} />
            <KV label="Employer" value={profile.parentEmployer} />
            <KV label="Education" value={profile.parentEducation} />
          </View>
        )}

        {/* School Information */}
        {profile.schoolInfo && (
          <View style={styles.section}>
            <SectionHeader title="School Information" />
            <KV label="School Name" value={profile.schoolInfo.schoolName} />
            <KV label="Phone" value={profile.schoolInfo.schoolPhoneNumber} />
            <KV label="Grade" value={profile.schoolInfo.grade} />
            <KV
              label="Years at School"
              value={profile.schoolInfo.yearsAtSchool}
            />
            <KV
              label="Academic Grades"
              value={profile.schoolInfo.academicGrades}
            />
            <KV
              label="Repeated Grade"
              value={profile.schoolInfo.hasRepeatedGrade}
            />
            {profile.schoolInfo.hasRepeatedGrade && (
              <KV
                label="Repeat Details"
                value={profile.schoolInfo.repeatedGradeDetail}
              />
            )}
            <KV
              label="Special Classes"
              value={profile.schoolInfo.hasSpecialClasses}
            />
            {profile.schoolInfo.hasSpecialClasses && (
              <KV
                label="Special Class Details"
                value={profile.schoolInfo.specialClassesDetail}
              />
            )}
            <KV
              label="Special Services"
              value={profile.schoolInfo.hasSpecialServices}
            />
            {profile.schoolInfo.hasSpecialServices && (
              <KV
                label="Service Details"
                value={profile.schoolInfo.specialServicesDetail}
              />
            )}
          </View>
        )}

        {/* Relationships & Abilities */}
        {profile.relationshipsAbilities && (
          <View style={styles.section}>
            <SectionHeader title="School Relationships & Abilities" />
            <RichTextBlock
              label="Teacher/Peer Relationships"
              text={profile.relationshipsAbilities.teachersPeersRelationship}
            />
            <KV
              label="Work Independently"
              value={
                profile.relationshipsAbilities.childAbilityWorkIndependently
              }
            />
            <KV
              label="Organize Self"
              value={profile.relationshipsAbilities.childAbilityOrganizeSelf}
            />
            <KV
              label="Attendance"
              value={profile.relationshipsAbilities.childAttendance}
            />
            <KV
              label="Truancy Proceedings"
              value={profile.relationshipsAbilities.hadTruancyProceedings}
            />
            <KV
              label="School Counseling"
              value={profile.relationshipsAbilities.receivedSchoolCounseling}
            />
            <RichTextBlock
              label="Activities & Strengths"
              text={profile.relationshipsAbilities.activitiesInterestsStrengths}
            />
            <RichTextBlock
              label="Other Concerns"
              text={profile.relationshipsAbilities.otherConcerns}
            />
          </View>
        )}

        {/* At a Glance */}
        <View style={styles.section}>
          <SectionHeader title="At a Glance" />
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
          <RichTextBlock text={profile.goals?.text} />
          {!profile.goals?.text && (
            <Text
              style={{
                fontStyle: "italic",
                color: intPsychTheme.textMuted,
                fontSize: 9,
              }}
            >
              No written goals provided.
            </Text>
          )}
        </View>

        {/* Story */}
        <View style={styles.section}>
          <SectionHeader title="Story & History" />
          <RichTextBlock
            label="Story Narrative"
            text={profile.storyNarrative?.text}
          />
          <RichTextBlock
            label="Living Situation"
            text={profile.livingSituation?.text}
          />
          <RichTextBlock
            label="Cultural Context"
            text={profile.cultureContext?.text}
          />
          <RichTextBlock
            label="Family History"
            text={profile.familyHistoryElaboration?.text}
          />
          {profile.fatherSideMedicalIssues && (
            <RichTextBlock
              label="Father's Side Medical Issues"
              text={profile.fatherSideMedicalIssues}
            />
          )}
          {profile.motherSideMedicalIssues && (
            <RichTextBlock
              label="Mother's Side Medical Issues"
              text={profile.motherSideMedicalIssues}
            />
          )}
        </View>
      </Page>

      {/* Page 2 */}
      <Page size="A4" style={styles.page}>
        {/* Medical History */}
        {profile.childMedicalHistory && (
          <View style={styles.section}>
            <SectionHeader title="Medical History" />
            <KV
              label="Psychiatric Hospitalized"
              value={profile.childMedicalHistory.psychiatricHospitalized}
            />
            {profile.childMedicalHistory.psychiatricHospitalized && (
              <RichTextBlock
                label="Hospitalization Details"
                text={
                  profile.childMedicalHistory.psychiatricHospitalizationDetails
                }
              />
            )}

            {/* Suicide Thoughts */}
            <KV
              label="Suicidal Thoughts Ever"
              value={profile.childMedicalHistory.suicideThoughtsEver}
            />
            {profile.childMedicalHistory.suicideThoughtsEver && (
              <RichTextBlock
                label="Suicide Thoughts Details"
                text={profile.childMedicalHistory.suicideThoughtsLastTimePlan}
              />
            )}

            {/* Suicide Attempt */}
            <KV
              label="Suicide Attempt Ever"
              value={profile.childMedicalHistory.suicideAttemptEver}
            />
            {profile.childMedicalHistory.suicideAttemptEver && (
              <RichTextBlock
                label="Suicide Attempt Details"
                text={profile.childMedicalHistory.suicideAttemptDetails}
              />
            )}

            {/* Self-Harm */}
            <KV
              label="Self-Harm History"
              value={profile.childMedicalHistory.selfHarmEver}
            />
            {profile.childMedicalHistory.selfHarmEver && (
              <>
                <KV
                  label="Currently Self-Harming"
                  value={profile.childMedicalHistory.selfHarmStill}
                />
                {profile.childMedicalHistory.selfHarmStill && (
                  <RichTextBlock
                    label="Self-Harm Details"
                    text={profile.childMedicalHistory.selfHarmFrequencyDetails}
                  />
                )}
              </>
            )}

            <KV
              label="Substance Use Ever"
              value={profile.childMedicalHistory.substanceUseEver}
            />
            {profile.childMedicalHistory.substanceUseEver && (
              <RichTextBlock
                label="Substance Details"
                text={profile.childMedicalHistory.substanceUseDetails}
              />
            )}
            <KV
              label="Immunizations Up to Date"
              value={profile.childMedicalHistory.immunizationsUpToDate}
            />
            <KV
              label="Recent Physical Exam"
              value={profile.childMedicalHistory.recentPhysicalExam}
            />
            {profile.childMedicalHistory.physicalExamDetails && (
              <RichTextBlock
                label="Physical Exam Notes"
                text={profile.childMedicalHistory.physicalExamDetails}
              />
            )}
            {profile.childMedicalHistory.medicalConditions &&
              profile.childMedicalHistory.medicalConditions.length > 0 && (
                <>
                  <Text style={styles.subSectionTitle}>Medical Conditions</Text>
                  {profile.childMedicalHistory.medicalConditions.map(
                    (cond, i) => (
                      <Text
                        key={i}
                        style={{ fontSize: 9, marginLeft: 8, marginBottom: 2 }}
                      >
                        • {formatLabel(cond, MEDICAL_CONDITIONS_LABELS)}
                      </Text>
                    )
                  )}
                  {profile.childMedicalHistory.medicalConditionsOther && (
                    <Text
                      style={{
                        fontSize: 9,
                        marginLeft: 8,
                        marginTop: 4,
                        color: intPsychTheme.textMuted,
                      }}
                    >
                      Other:{" "}
                      {profile.childMedicalHistory.medicalConditionsOther}
                    </Text>
                  )}
                </>
              )}
          </View>
        )}

        {/* Neuropsych Testing */}
        {profile.childMedicalHistory?.hasNeuropsychTesting && (
          <View style={styles.section}>
            <SectionHeader title="Neuropsychological Testing" />
            <KV
              label="Eval Date"
              value={profile.childMedicalHistory.neuropsychEvalDate}
            />
            <RichTextBlock
              label="Reason"
              text={profile.childMedicalHistory.neuropsychEvalReason}
            />
            <RichTextBlock
              label="Evaluations Performed"
              text={profile.childMedicalHistory.neuropsychEvaluationsPerformed}
            />
          </View>
        )}

        {/* Past Mental Health Treatment */}
        {profile.childPsychiatricHistory?.treatmentKinds &&
          profile.childPsychiatricHistory.treatmentKinds.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Past Mental Health Treatment" />
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                {profile.childPsychiatricHistory.treatmentKinds.map(
                  (t: any, i: number) => (
                    <View
                      key={i}
                      style={{
                        backgroundColor: intPsychTheme.accentLight,
                        borderRadius: 8,
                        paddingTop: 4,
                        paddingBottom: 2,
                        paddingHorizontal: 8,
                        marginRight: 4,
                        marginBottom: 4,
                      }}
                    >
                      <Text
                        style={{ fontSize: 8, color: intPsychTheme.primary }}
                      >
                        {t.label}
                      </Text>
                    </View>
                  )
                )}
              </View>
              {profile.childPsychiatricHistory.firstTreatmentDate && (
                <KV
                  label="First Treatment Date"
                  value={profile.childPsychiatricHistory.firstTreatmentDate}
                />
              )}
              <RichTextBlock
                label="Individual Therapy Details"
                text={profile.childPsychiatricHistory.individualDetails}
              />
              <RichTextBlock
                label="Group Therapy Details"
                text={profile.childPsychiatricHistory.groupDetails}
              />
              <RichTextBlock
                label="Family/Couples Therapy Details"
                text={profile.childPsychiatricHistory.familyCouplesDetails}
              />
              <RichTextBlock
                label="Other Treatment Details"
                text={profile.childPsychiatricHistory.otherDetails}
              />
            </View>
          )}

        {/* Prenatal & Birth History */}
        {profile.childPrenatalHistory && (
          <View style={styles.section}>
            <SectionHeader title="Prenatal & Birth History" />
            <KV
              label="Pregnancy Healthy"
              value={profile.childPrenatalHistory.pregnancyHealthy}
            />
            <KV
              label="Full Term"
              value={profile.childPrenatalHistory.fullTerm}
            />
            <KV
              label="Labor Type"
              value={profile.childPrenatalHistory.laborType}
            />
            <KV
              label="Birth Weight"
              value={profile.childPrenatalHistory.birthWeight}
            />
            <KV
              label="Delivery Normal"
              value={profile.childPrenatalHistory.deliveryNormal}
            />
            {!profile.childPrenatalHistory.deliveryNormal && (
              <RichTextBlock
                label="Delivery Problems"
                text={profile.childPrenatalHistory.deliveryProblems}
              />
            )}
            <KV
              label="Complications"
              value={profile.childPrenatalHistory.hasComplications}
            />
            {profile.childPrenatalHistory.hasComplications && (
              <RichTextBlock
                label="Complication Details"
                text={profile.childPrenatalHistory.complicationsDetails}
              />
            )}
            <KV
              label="Trouble Breathing at Birth"
              value={profile.childPrenatalHistory.troubleStartingToBreathe}
            />
            <KV
              label="Jaundiced"
              value={profile.childPrenatalHistory.jaundiced}
            />
            <KV
              label="Feeding Method"
              value={profile.childPrenatalHistory.feedingMethod}
            />
          </View>
        )}

        {/* Developmental History */}
        {profile.childDevelopmentalHistory && (
          <View style={styles.section}>
            <SectionHeader title="Developmental History" />
            <KV
              label="Activity Level"
              value={formatLabel(
                profile.childDevelopmentalHistory.activityLevel,
                DEVELOPMENTAL_HISTORY_LABELS
              )}
            />
            <KV
              label="Early Affective Style"
              value={formatLabel(
                profile.childDevelopmentalHistory.earlyAffectiveStyle,
                DEVELOPMENTAL_HISTORY_LABELS
              )}
            />
            <KV
              label="Crying Pattern"
              value={formatLabel(
                profile.childDevelopmentalHistory.cryingPattern,
                DEVELOPMENTAL_HISTORY_LABELS
              )}
            />
            <KV
              label="Soothing When Upset"
              value={formatLabel(
                profile.childDevelopmentalHistory.soothingWhenUpset,
                DEVELOPMENTAL_HISTORY_LABELS
              )}
            />
            <KV
              label="Reaction to Strangers"
              value={formatLabel(
                profile.childDevelopmentalHistory.reactionToStrangers,
                DEVELOPMENTAL_HISTORY_LABELS
              )}
            />
            <RichTextBlock
              label="Response to Being Held"
              text={profile.childDevelopmentalHistory.responseToBeingHeld}
            />
            <RichTextBlock
              label="Eating Habits"
              text={profile.childDevelopmentalHistory.eatingHabitsNotes}
            />
            <RichTextBlock
              label="Sleeping Habits"
              text={profile.childDevelopmentalHistory.sleepingHabitsNotes}
            />
          </View>
        )}

        {/* Developmental Milestones */}
        {profile.childDevelopmentalMilestones && (
          <View style={styles.section}>
            <SectionHeader title="Developmental Milestones" />
            <Text
              style={{
                fontSize: 8,
                color: intPsychTheme.textMuted,
                marginBottom: 8,
                fontStyle: "italic",
              }}
            >
              (Milestones that occurred later than the stated age)
            </Text>
            {profile.childDevelopmentalMilestones.motor?.length > 0 && (
              <>
                <Text style={styles.subSectionTitle}>Motor</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {profile.childDevelopmentalMilestones.motor.map((m, i) => (
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
                      <Text style={{ fontSize: 8 }}>
                        {formatLabel(m, MILESTONE_MOTOR_LABELS)}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
            {profile.childDevelopmentalMilestones.language?.length > 0 && (
              <>
                <Text style={styles.subSectionTitle}>Language</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {profile.childDevelopmentalMilestones.language.map((m, i) => (
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
                      <Text style={{ fontSize: 8 }}>
                        {formatLabel(m, MILESTONE_LANGUAGE_LABELS)}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
            {profile.childDevelopmentalMilestones.adaptive?.length > 0 && (
              <>
                <Text style={styles.subSectionTitle}>Adaptive</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {profile.childDevelopmentalMilestones.adaptive.map((m, i) => (
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
                      <Text style={{ fontSize: 8 }}>
                        {formatLabel(m, MILESTONE_ADAPTIVE_LABELS)}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* Medications */}
        <View style={styles.section}>
          <SectionHeader title="Current Medications" />
          {profile.currentMedications &&
          profile.currentMedications.length > 0 ? (
            profile.currentMedications.map((med, i) => (
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
            ))
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
                "Strained/Difficult",
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
              No relationships added.
            </Text>
          )}
        </View>
      </Page>

      {/* Page 3: Assessment Scales - Depression & Anxiety */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <SectionHeader title="Assessment Scales" />
          <Text
            style={{
              fontSize: 9,
              color: intPsychTheme.textMuted,
              marginBottom: 12,
              fontStyle: "italic",
            }}
          >
            Child Assessment Report • 7 Scales: DISC (Self & Parent), SCARED
            (Self & Parent), SNAP-IV (Inattention, Hyperactivity, Opposition)
          </Text>

          {childAssessments && (
            <>
              {/* 1. DISC Teen Depression - Self Report */}
              <PdfGauge
                label="1. DISC Depression (Child Self-Report)"
                score={scoreSum(
                  childAssessments.discTeen?.self?.responses || {}
                )}
                max={22}
                caption="Columbia DISC Teen Depression Scale • 0-11 unlikely • 12+ possible MDD"
              />
              {Object.entries(DISC_CHILD_QUESTIONS).map(([key, q]) => (
                <QuestionResponse
                  key={key}
                  question={q}
                  answer={
                    childAssessments.discTeen?.self?.responses?.[
                      key as keyof typeof childAssessments.discTeen.self.responses
                    ]
                  }
                  options={DISC_0_1}
                />
              ))}

              {/* 2. DISC Teen Depression - Parent Report */}
              {childAssessments.discTeen?.parent?.responses &&
                Object.keys(childAssessments.discTeen.parent.responses).length >
                  0 && (
                  <View style={{ marginTop: 20 }}>
                    <PdfGauge
                      label="2. DISC Depression (Parent Report)"
                      score={scoreSum(
                        childAssessments.discTeen?.parent?.responses || {}
                      )}
                      max={22}
                      caption="Parent-report version • 0-11 unlikely • 12+ possible MDD"
                    />
                    {Object.entries(DISC_PARENT_QUESTIONS).map(([key, q]) => (
                      <QuestionResponse
                        key={key}
                        question={q}
                        answer={
                          childAssessments.discTeen?.parent?.responses?.[
                            key as keyof typeof childAssessments.discTeen.parent.responses
                          ]
                        }
                        options={DISC_0_1}
                      />
                    ))}
                  </View>
                )}

              {/* 3. SCARED Anxiety - Self Report */}
              <View style={{ marginTop: 20 }}>
                <PdfGauge
                  label="3. SCARED Anxiety (Child Self-Report)"
                  score={scoreSum(
                    childAssessments.scared?.self?.responses || {}
                  )}
                  max={82}
                  caption="Screen for Child Anxiety • 0-24 low • 25+ significant anxiety symptoms"
                />
                {Object.entries(SCARED_CHILD_QUESTIONS).map(([key, q]) => (
                  <QuestionResponse
                    key={key}
                    question={q}
                    answer={
                      childAssessments.scared?.self?.responses?.[
                        key as keyof typeof childAssessments.scared.self.responses
                      ]
                    }
                    options={SCARED_0_2}
                  />
                ))}
              </View>

              {/* 4. SCARED Anxiety - Parent Report */}
              {childAssessments.scared?.parent?.responses &&
                Object.keys(childAssessments.scared.parent.responses).length >
                  0 && (
                  <View style={{ marginTop: 20 }}>
                    <PdfGauge
                      label="4. SCARED Anxiety (Parent Report)"
                      score={scoreSum(
                        childAssessments.scared?.parent?.responses || {}
                      )}
                      max={82}
                      caption="Parent version • 0-24 low • 25+ significant anxiety symptoms"
                    />
                    {Object.entries(SCARED_PARENT_QUESTIONS).map(([key, q]) => (
                      <QuestionResponse
                        key={key}
                        question={q}
                        answer={
                          childAssessments.scared?.parent?.responses?.[
                            key as keyof typeof childAssessments.scared.parent.responses
                          ]
                        }
                        options={SCARED_0_2}
                      />
                    ))}
                  </View>
                )}
            </>
          )}

          {!childAssessments && (
            <Text
              style={{
                fontSize: 9,
                color: intPsychTheme.textMuted,
                fontStyle: "italic",
              }}
            >
              No child assessment data available.
            </Text>
          )}
        </View>
      </Page>

      {/* Page 4: SNAP-IV ADHD Subscales */}
      {childAssessments && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <SectionHeader title="SNAP-IV ADHD Assessment" />

            {/* 5. SNAP Inattention */}
            <PdfGauge
              label="5. SNAP-IV: Inattention"
              score={[1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(
                (sum, i) =>
                  sum +
                  (Number(
                    (childAssessments.snap as any)?.[
                      `snap${String(i).padStart(2, "0")}`
                    ]
                  ) || 0),
                0
              )}
              max={27}
              caption="<13 not significant • 13-17 mild • 18-22 moderate • 23-27 severe"
            />
            {Object.entries(SNAP_QUESTIONS)
              .slice(0, 9)
              .map(([key, q]) => (
                <QuestionResponse
                  key={key}
                  question={q}
                  answer={(childAssessments.snap as any)?.[key]}
                  options={SNAP_0_3}
                />
              ))}

            {/* 6. SNAP Hyperactivity/Impulsivity */}
            <View style={{ marginTop: 20 }}>
              <PdfGauge
                label="6. SNAP-IV: Hyperactivity/Impulsivity"
                score={[10, 11, 12, 13, 14, 15, 16, 17, 18].reduce(
                  (sum, i) =>
                    sum +
                    (Number(
                      (childAssessments.snap as any)?.[
                        `snap${String(i).padStart(2, "0")}`
                      ]
                    ) || 0),
                  0
                )}
                max={27}
                caption="<13 not significant • 13-17 mild • 18-22 moderate • 23-27 severe"
              />
              {Object.entries(SNAP_QUESTIONS)
                .slice(9, 18)
                .map(([key, q]) => (
                  <QuestionResponse
                    key={key}
                    question={q}
                    answer={(childAssessments.snap as any)?.[key]}
                    options={SNAP_0_3}
                  />
                ))}
            </View>

            {/* 7. SNAP Oppositional Defiant */}
            <View style={{ marginTop: 20 }}>
              <PdfGauge
                label="7. SNAP-IV: Oppositional Defiant"
                score={[19, 20, 21, 22, 23, 24, 25, 26].reduce(
                  (sum, i) =>
                    sum +
                    (Number(
                      (childAssessments.snap as any)?.[
                        `snap${String(i).padStart(2, "0")}`
                      ]
                    ) || 0),
                  0
                )}
                max={24}
                caption="<8 not significant • 8-13 mild • 14-18 moderate • 19-24 severe"
              />
              {Object.entries(SNAP_QUESTIONS)
                .slice(18)
                .map(([key, q]) => (
                  <QuestionResponse
                    key={key}
                    question={q}
                    answer={(childAssessments.snap as any)?.[key]}
                    options={SNAP_0_3}
                  />
                ))}
            </View>

            {/* C-SSRS if present */}
            {childAssessments.cssrs && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.gaugeLabel}>C-SSRS Safety Screen</Text>
                <QuestionResponse
                  question="Wish to be dead"
                  answer={childAssessments.cssrs.wishDead}
                  options={YES_NO}
                />
                <QuestionResponse
                  question="Suicidal thoughts"
                  answer={childAssessments.cssrs.thoughts}
                  options={YES_NO}
                />
                <QuestionResponse
                  question="Method/how"
                  answer={childAssessments.cssrs.methodHow}
                  options={YES_NO}
                />
                <QuestionResponse
                  question="Intention to act"
                  answer={childAssessments.cssrs.intention}
                  options={YES_NO}
                />
                <QuestionResponse
                  question="Plan"
                  answer={childAssessments.cssrs.plan}
                  options={YES_NO}
                />
                <QuestionResponse
                  question="Suicidal behavior"
                  answer={childAssessments.cssrs.behavior}
                  options={YES_NO}
                />
              </View>
            )}
          </View>
        </Page>
      )}
    </Document>
  );
};
