export type Clinician = {
  name: string;
  email: string;
};

export type EngineNextRequest = {
  scaleCode?: string;
  theta?: number | null;
  responses: { itemId: string; value: number }[];
  items: {
    id: string;
    scaleId?: string | null;
    params: { a: number; b: number; c?: number; d?: number };
  }[];
};
export type EngineNextResponse = {
  nextItemId?: string | null;
  stop: boolean;
  theta?: number;
  se?: number;
};

export type Option = { label: string; value: string };

export type StateSetter<T> = (value: T | ((prev: T) => T)) => void;

export type Medication = {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  prescriber: string;
  comments: string;
};

export type Allergy = {
  name: string;
  reaction: string;
};

export type Hospitalization = {
  hospitalName: string;
  location: string;
  date: string;
  reason: string;
};

export type InjuryDetails = {
  injuryList: string;
  explanation: string;
};

// ---- New explicit content types for text-or-audio fields ----
export type AudioAttachment = {
  /** public URL or local blob URL returned by the recorder */
  url: string;
  /** GCS file path (e.g., "userId/storyNarrative-1234567890.webm") */
  fileName?: string;
  /** optional metadata from recorder */
  durationSec?: number;
  mimeType?: string;
  sizeBytes?: number;
  /** ISO timestamp of when the file was uploaded to GCS */
  uploadedAt?: string;
  /** Full transcription text from transcription service */
  transcription?: string;
  /** Transcription chunks with timestamps (from transcription service) */
  chunks?: Array<{ text: string; timestamp: [number, number] }>;
  /** ISO timestamp of when transcription completed */
  transcribedAt?: string;
  /** Translation (if applicable) */
  translation?: string;
};

/** Rich input that can hold written text, an audio recording, or both */
export type RichResponse = {
  text?: string;
  audio?: AudioAttachment;
};

export type SetAActions = (mutate: (draft: Profile) => void) => void;
// -------------------------------------------------------------

// ---- C-SSRS Screen (Recent) ----
export type CssrsScreen = {
  wishDead: string; // Q1
  thoughts: string; // Q2
  methodHow: string; // Q3
  intention: string; // Q4
  plan: string; // Q5
  behavior: string; // Q6
  behavior3mo: string; // Q6 timing follow-up
};

export type AdultAssessments = {
  suicide: {
    wishDead: string;
    thoughts: string;
    methodHow: string;
    intention: string;
    plan: string;
    behavior: string;
    behavior3mo: string;
  };
  phq9: {
    phq1: string;
    phq2: string;
    phq3: string;
    phq4: string;
    phq5: string;
    phq6: string;
    phq7: string;
    phq8: string;
    phq9: string;
  };
  gad7: {
    gad1: string;
    gad2: string;
    gad3: string;
    gad4: string;
    gad5: string;
    gad6: string;
    gad7: string;
  };
  selfHarm: { pastMonth: string; lifetime: string };
  crafft: {
    partA: {
      daysAlcohol: string;
      daysMarijuana: string;
      daysOther: string;
    };
    partB: {
      car: string;
      relax: string;
      alone: string;
      forget: string;
      familyFriends: string;
      trouble: string;
    };
  };
  asrs5: {
    asrs1: string;
    asrs2: string;
    asrs3: string;
    asrs4: string;
    asrs5: string;
    asrs6: string;
  };
  ptsd: {
    ptsd1: string;
    ptsd2: string;
    ptsd3: string;
    ptsd4: string;
    ptsd5: string;
  };
  aceResilience: {
    r01: string;
    r02: string;
    r03: string;
    r04: string;
    r05: string;
    r06: string;
    r07: string;
    r08: string;
    r09: string;
    r10: string;
    r11: string;
    r12: string;
    r13: string;
  };
  ymrs: {
    ymrs1: string;
    ymrs2: string;
    ymrs3: string;
    ymrs4: string;
    ymrs5: string;
    ymrs6: string;
    ymrs7: string;
    ymrs8: string;
    ymrs9: string;
    ymrs10: string;
    ymrs11: string;
  };
  stress: { pss1: string; pss2: string; pss3: string; pss4: string };
  ybocs?: Record<string, string>;
  hama?: Record<string, string>;
  hamd?: Record<string, string>;
  bprs?: Record<string, string>;
};
// ===== Child & Adult flexible assessment typing (preparation only) =====
// Columbia DISC Teen Depression Scale (Ages 11+) — Teen self-report & Parent-report
// Items are 22 yes/no questions scored 0/1 within the past 4 weeks (present state).
// Reference bands are included for optional scoring metadata. fileciteturn0file0

export type DiscTeenItemKey =
  | "dtds01"
  | "dtds02"
  | "dtds03"
  | "dtds04"
  | "dtds05"
  | "dtds06"
  | "dtds07"
  | "dtds08"
  | "dtds09"
  | "dtds10"
  | "dtds11"
  | "dtds12"
  | "dtds13"
  | "dtds14"
  | "dtds15"
  | "dtds16"
  | "dtds17"
  | "dtds18"
  | "dtds19"
  | "dtds20"
  | "dtds21"
  | "dtds22";

/** DISC Teen Depression Scale response (0/1 as strings to match existing patterns) */
export type DiscTeenResponses = {
  [K in DiscTeenItemKey]: string; // "0" | "1" | ""
};

/** Teen self-report (required for child workflow) */
export type DiscTeenSelf = {
  form: "self";
  responses: DiscTeenResponses;
};

/** Parent-report (optional adjunct) */
export type DiscTeenParent = {
  form: "parent";
  responses: DiscTeenResponses;
};

// SNAP‑IV 26‑Item (0–3: Not at all → Very much)
export type SnapItemKey =
  | "snap01"
  | "snap02"
  | "snap03"
  | "snap04"
  | "snap05"
  | "snap06"
  | "snap07"
  | "snap08"
  | "snap09"
  | "snap10"
  | "snap11"
  | "snap12"
  | "snap13"
  | "snap14"
  | "snap15"
  | "snap16"
  | "snap17"
  | "snap18"
  | "snap19"
  | "snap20"
  | "snap21"
  | "snap22"
  | "snap23"
  | "snap24"
  | "snap25"
  | "snap26";

/** SNAP response values stored as strings to match existing Likert pattern */
export type SnapCollateralResponse = {
  id: string; // unique ID for this response
  informantName: string; // "Mrs. Smith", "Coach Johnson"
  informantRelation: string; // "parent", "teacher", "coach", etc.
  submittedAt: string; // ISO timestamp
  responses: SnapResponses; // reuse existing SNAP responses type
};
export type SnapValue = "" | "0" | "1" | "2" | "3";
export type SnapResponses = { [K in SnapItemKey]: SnapValue };
export type SnapScale = { responses: SnapResponses };

/** Child assessment set: replaces PHQ-9 with DISC Teen Depression Scale; all other adult measures retained or adjusted later. */
// SCARED (Screen for Child Anxiety Related Disorders) — 41 items, 0–2
export type ScaredItemKey =
  | "scared01"
  | "scared02"
  | "scared03"
  | "scared04"
  | "scared05"
  | "scared06"
  | "scared07"
  | "scared08"
  | "scared09"
  | "scared10"
  | "scared11"
  | "scared12"
  | "scared13"
  | "scared14"
  | "scared15"
  | "scared16"
  | "scared17"
  | "scared18"
  | "scared19"
  | "scared20"
  | "scared21"
  | "scared22"
  | "scared23"
  | "scared24"
  | "scared25"
  | "scared26"
  | "scared27"
  | "scared28"
  | "scared29"
  | "scared30"
  | "scared31"
  | "scared32"
  | "scared33"
  | "scared34"
  | "scared35"
  | "scared36"
  | "scared37"
  | "scared38"
  | "scared39"
  | "scared40"
  | "scared41";
export type ScaredValue = "" | "0" | "1" | "2";
export type ScaredResponses = { [K in ScaredItemKey]: ScaredValue };
export type ScaredSelf = { form: "self"; responses: ScaredResponses };
export type ScaredParent = { form: "parent"; responses: ScaredResponses };

export type ChildAssessments = {
  /** Columbia DISC Teen Depression Scale */
  discTeen: {
    self: DiscTeenSelf;
    /** Optional additional informant */
    parent?: DiscTeenParent;
  };
  /** SNAP‑IV ADHD (26 items) */
  snap: SnapScale;
  snapCollateral: SnapCollateralResponse[];
  /** SCARED anxiety scale (self + optional parent) */
  scared: {
    self: ScaredSelf;
    parent?: ScaredParent;
  };
  cssrs?: CssrsScreen;
};

/**
 * Discriminated union to support age-specific assessment payloads without changing existing callers yet.
 * NOTE: Profile.assessments still uses `Assessments` for now to avoid breaking current code.
 * When ready to switch, change `Profile.assessments` to `AgeAwareAssessments`.
 */
export type AgeAwareAssessments =
  | { kind: "adult"; data: AdultAssessments }
  | { kind: "child"; data: ChildAssessments };

// Type guards (optional helpers for future use)
export function isChildAssessments(
  a: any,
): a is { kind: "child"; data: ChildAssessments } {
  return (
    a &&
    a.kind === "child" &&
    a.data &&
    typeof a.data === "object" &&
    "discTeen" in a.data
  );
}
export function isAdultAssessments(
  a: any,
): a is { kind: "adult"; data: AdultAssessments } {
  return (
    a &&
    a.kind === "adult" &&
    a.data &&
    typeof a.data === "object" &&
    "phq9" in a.data
  );
}
// ======================================================================

// ---- Report output (patient-facing) ----
export type ReportInterpretations = {
  gad7: string;
  phq9: string;
  pss4: string;
  asrs5: string;
  ptsd: string;
  crafft: string;
  ace: string;
};

export type ReportInterpretationsChild = {
  discChild: string;
  discParent: string;
  snapInattention: string;
  snapHyperactivity: string;
  snapOpposition: string;
  scaredChild: string;
  scaredParent: string;
};

export type SummaryPair = {
  reason_for_eval: string;
  background: string;
};

export type PatientReport = {
  summary: SummaryPair;
  interpretations: ReportInterpretations | ReportInterpretationsChild;
};
// ---------------------------------------

// ---- Social graph ----
export type Relationship = {
  id: string;
  name: string; // e.g., "Alex"
  role: string; // e.g., "Friend", "Mom"
  strength: "really_bad" | "not_great" | "pretty_good" | "really_good";
  happy: boolean;
};

// --- Child: Prenatal & Birth History ---
export type ChildPrenatalHistory = {
  // Pregnancy & labor
  pregnancyHealthy?: boolean; // Q53
  fullTerm?: boolean; // Q54
  laborType?: "spontaneous" | "induced" | ""; // Q55
  // Birth stats
  birthWeight?: string; // Q56 (free text like "7 lb 8 oz" or grams)
  // Maternal exposures / complications (yes/no with conditional details)
  hasComplications?: boolean; // Q57
  complicationsDetails?: string; // Q57 follow-up
  hadMedsDuringPregnancy?: boolean; // Q58
  medsDuringPregnancyDetails?: string; // Q58 follow-up
  hadAlcoholDuringPregnancy?: boolean; // Q59
  alcoholDuringPregnancyDetails?: string; // Q59 follow-up
  hadDrugsDuringPregnancy?: boolean; // Q60
  drugsDuringPregnancyDetails?: string; // Q60 follow-up
  motherSmokedDuringPregnancy?: boolean; // Q61
  motherSmokedDuringPregnancyDetails?: string; // Q61 follow-up
  // Delivery & presentation
  deliveryNormal?: boolean; // Q62 (No → capture problems below)
  deliveryProblems?: string; // Q62 follow‑up
  presentationAtBirth?: "head" | "feet" | ""; // Q63
  troubleStartingToBreathe?: boolean; // Q64
  // Neonatal course & feeding
  jaundiced?: boolean; // Q65
  jaundiceTreatmentRequired?: boolean; // Q65a (required treatment?)
  jaundiceTreatmentDetails?: string; // Q65b follow‑up if treatment required
  feedingMethod?: "bottle" | "breast" | "both" | ""; // Q66
  breastFeedingDuration?: string; // Q66 follow‑up
  hadFeedingProblems?: boolean; // Q67
  feedingProblemsDetails?: string; // Q67 follow-up
  gainedWeightWell?: boolean; // Q68
  hadEarlyProblems?: boolean; // Q69
  earlyProblemsDetails?: string; // Q69 follow-up
  // Parity
  totalPregnancies?: number; // Q70
  liveBirths?: number; // Q71
  birthOrder?: number; // Q72
};

// --- Child: Past Mental Health & Psychiatric History ---
export type ChildPsychiatricHistory = {
  /** Multi-select of treatment kinds (Option[] to match Listbox pattern elsewhere) */
  treatmentKinds: Option[];
  /** Date string (yyyy-mm-dd) for first treatment entry */
  firstTreatmentDate?: string;
  /** Free-text details for each modality, shown when that modality is selected */
  individualDetails?: string;
  groupDetails?: string;
  familyCouplesDetails?: string;
  otherDetails?: string;
};

// --- Child: Developmental History ---
export type ChildDevelopmentalHistory = {
  // Temperament / activity level
  activityLevel?: "active" | "active_but_calm" | "passive" | "other" | "";
  activityLevelOther?: string;
  // Early affective style
  earlyAffectiveStyle?: "cuddly" | "irritable" | "withdrawn" | "other" | "";
  earlyAffectiveStyleOther?: string;
  // Crying frequency
  cryingPattern?: "easily_frequently" | "reasonable" | "seldom" | "other" | "";
  cryingPatternOther?: string;
  // Soothing when upset
  soothingWhenUpset?:
    | "soothed_easily"
    | "difficult_to_soothe"
    | "average"
    | "other"
    | "";
  soothingWhenUpsetOther?: string;
  // Free-text responses
  responseToBeingHeld?: string; // Describe child's response to being held (Q78)
  reactionToStrangers?: "friendly" | "indifferent" | "fearful" | ""; // Q79
  eatingHabitsNotes?: string; // Q80
  sleepingHabitsNotes?: string; // Q81
};

// --- Child: Developmental Milestones ---
export type ChildDevelopmentalMilestones = {
  motor: string[]; // multi-select
  language: string[]; // multi-select
  adaptive: string[]; // multi-select
  notes?: string; // optional free text if needed later
};

export type Profile = {
  maxVisited: number;
  updatedAt?: string; // ISO string from DB for Optimistic Locking
  isChild: boolean | null;

  // Contact Section
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  contactNumber: string;
  dob: string;

  // Child Contact Section
  parent1FirstName?: string;
  parent1LastName?: string;
  parent2FirstName?: string;
  parent2LastName?: string;
  parentOccupation?: string;
  parentEmployer?: string;
  parentEducation?: string;

  // Profile Section
  pronouns: Option[];
  height: { feet: number | null; inches: number | null };
  weightLbs: number | null;
  genderIdentity: string;
  sexualOrientation: Option[];
  ethnicity: Option[];
  religion: Option[];

  // Adult Profile Section
  highestDegree?: string;
  isMarried?: boolean;
  timesMarried?: number;
  isSexuallyActive?: boolean;
  sexualPartners?: string;
  dietType?: Option[];
  alcoholFrequency?: string;
  drinksPerOccasion?: string;
  substancesUsed?: Option[];
  isEmployed?: boolean;
  jobDetails?: string;
  hobbies?: string;
  hasFirearm?: boolean;
  dailyMobileScreenTime?: number;

  // Child Profile Section
  schoolInfo?: {
    schoolName?: string;
    schoolPhoneNumber?: string;
    yearsAtSchool?: number;
    grade?: string;
    hasRepeatedGrade?: boolean; // "yes" | "no" | ""
    repeatedGradeDetail?: string;
    hasSpecialClasses?: boolean; // "yes" | "no" | ""
    specialClassesDetail?: string;
    hasSpecialServices?: boolean; // "yes" | "no" | ""
    specialServicesDetail?: string;
    academicGrades?: string;
  };
  relationshipsAbilities?: {
    teachersPeersRelationship?: string;
    childAbilityWorkIndependently?: "good" | "average" | "poor" | "";
    childAbilityOrganizeSelf?: "good" | "average" | "poor" | "";
    childAttendance?: "good" | "average" | "poor" | "";
    hadTruancyProceedings?: boolean;
    truancyProceedingsDetail?: string;
    receivedSchoolCounseling?: boolean;
    schoolCounselingDetail?: string;
    activitiesInterestsStrengths?: string;
    otherConcerns?: string;
  };

  // Screen Section
  moodChanges: string[];
  behaviorChanges: string[];
  thoughtChanges: string[];

  // Story Section
  storyNarrative: RichResponse;
  goals: RichResponse;
  livingSituation: RichResponse;
  cultureContext?: RichResponse;
  hasReceivedMentalHealthTreatment: boolean;
  therapyDuration: string;
  previousDiagnosis: string;
  prevTreatmentSummary?: RichResponse;
  familyHistoryElaboration?: RichResponse;
  familyHistory: string[];

  // Child Story Section
  fatherSideMedicalIssues?: string;
  motherSideMedicalIssues?: string;

  // Adult Story Section
  upbringingEnvironments?: RichResponse;
  likedChildhood?: boolean;
  childhoodNegativeReason?: RichResponse;
  upbringingWhoWith?: RichResponse;

  // Relationship Section
  relationships: Relationship[];

  // Medical Section
  currentMedications: Medication[];
  previousMedications: Medication[];
  medicalAllergies: Allergy[];
  previousHospitalizations: Hospitalization[];
  previousInjuries?: InjuryDetails | null;

  // --- Child-only: Neuropsychological testing history & Medical History ---
  childMedicalHistory?: {
    // Neuropsychological testing (existing)
    hasNeuropsychTesting: boolean;
    neuropsychEvalDate: string;
    neuropsychEvalReason: string;
    neuropsychEvaluationsPerformed: string;
    // --- Medical History (new) ---
    psychiatricHospitalized?: boolean;
    psychiatricHospitalizationDetails?: string;
    suicideThoughtsEver?: boolean;
    suicideThoughtsLastTimePlan?: string;
    suicideAttemptEver?: boolean;
    suicideAttemptDetails?: string;
    selfHarmEver?: boolean;
    selfHarmStill?: boolean;
    selfHarmFrequencyDetails?: string;
    substanceUseEver?: boolean;
    substanceUseDetails?: string;
    medicalConditions?: string[];
    medicalConditionsOther?: string;
    immunizationsUpToDate?: boolean;
    recentPhysicalExam?: string;
    physicalExamDetails?: string;
  };

  // --- Child: Prenatal & Birth History ---
  childPrenatalHistory?: ChildPrenatalHistory;

  // --- Child: Past Mental Health & Psychiatric History ---
  childPsychiatricHistory?: ChildPsychiatricHistory;

  // --- Child: Developmental History ---
  childDevelopmentalHistory?: ChildDevelopmentalHistory;
  // --- Child: Developmental Milestones ---
  childDevelopmentalMilestones?: ChildDevelopmentalMilestones;

  // Assessments Section
  assessments: AgeAwareAssessments;

  // Follow-up Questions Section
  followupQuestions?: {
    question1: {
      question: string;
      answer: RichResponse;
    };
    question2: {
      question: string;
      answer: RichResponse;
    };
    question3: {
      question: string;
      answer: RichResponse;
    };
  };

  // Generated patient-facing report (optional; filled after submit)
  report?: PatientReport;
};
