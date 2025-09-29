import { Option } from "./types";

// --- Question text (mirrors intake) ---
export const PHQ9_QUESTIONS: Record<string, string> = {
  phq1: "Little interest or pleasure in doing things",
  phq2: "Feeling down, depressed, or hopeless",
  phq3: "Trouble falling or staying asleep, or sleeping too much",
  phq4: "Feeling tired or having little energy",
  phq5: "Poor appetite or overeating",
  phq6: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  phq7: "Trouble concentrating on things, such as reading the newspaper or watching television",
  phq8: "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  phq9: "Thoughts that you would be better off dead, or of hurting yourself in some way",
};

export const GAD7_QUESTIONS: Record<string, string> = {
  gad1: "Feeling nervous, anxious, or on edge",
  gad2: "Not being able to stop or control worrying",
  gad3: "Worrying too much about different things",
  gad4: "Trouble relaxing",
  gad5: "Being so restless that it is hard to sit still",
  gad6: "Becoming easily annoyed or irritable",
  gad7: "Feeling afraid as if something awful might happen",
};

export const ASRS5_QUESTIONS: Record<string, string> = {
  asrs1:
    "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
  asrs2:
    "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
  asrs3:
    "How often do you have problems remembering appointments or obligations?",
  asrs4:
    "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
  asrs5:
    "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
  asrs6:
    "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
};

export const PSS4_QUESTIONS: Record<string, string> = {
  pss1: "In the last month, how often have you felt that you were unable to control the important things in your life?",
  pss2: "In the last month, how often have you felt confident about your ability to handle your personal problems?",
  pss3: "In the last month, how often have you felt that things were going your way?",
  pss4: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
};

export const PTSD_QUESTIONS: Record<string, string> = {
  ptsd1:
    "In the past month, have you had nightmares or thought about the traumatic event(s) when you did not want to?",
  ptsd2:
    "In the past month, have you tried hard not to think about the traumatic event(s) or went out of your way to avoid situations that reminded you of these event(s)?",
  ptsd3:
    "In the past month, have you been constantly on guard, watchful, or easily startled?",
  ptsd4:
    "In the past month, have you felt numb or detached from people, activities, or your surroundings?",
  ptsd5:
    "In the past month, have you felt guilty or unable to stop blaming yourself or others for the traumatic event(s) or any problems these event(s) may have caused?",
};

export const ACE_RESILIENCE_QUESTIONS: Record<string, string> = {
  r01: "I believe that my mother loved me when I was little.",
  r02: "I believe that my father loved me when I was little.",
  r03: "When I was little, other people helped my mother and father take care of me and they seemed to love me.",
  r04: "I’ve heard that when I was an infant someone in my family enjoyed playing with me, and I enjoyed it too.",
  r05: "When I was a child, there were relatives who made me feel better if I was sad or worried.",
  r06: "When I was a child, neighbors or my friends’ parents seemed to like me.",
  r07: "When I was a child, teachers, coaches, youth leaders or ministers were there to help me.",
  r08: "My family, neighbors and friends talked often about making our lives better.",
  r09: "We had rules in our house and were expected to keep them.",
  r10: "When I felt really bad, I could almost always find someone I trusted to talk to.",
  r11: "As a youth, people noticed that I was capable and could get things done.",
  r12: "I was independent and a go-getter.",
  r13: "I believed that life is what you make it.",
};

export const sexualOrientations: Option[] = [
  { label: "Asexual", value: "asexual" },
  { label: "Bisexual", value: "bisexual" },
  { label: "Homosexual or Gay", value: "homosexual" },
  { label: "Heterosexual or Straight", value: "heterosexual" },
  { label: "Queer", value: "queer" },
  { label: "Prefer not to disclose", value: "n/a" },
];

export const pronounOptions: Option[] = [
  { label: "He/Him/His", value: "he_him_his" },
  { label: "She/Her/Hers", value: "she_her_hers" },
  { label: "They/Their/Theirs", value: "they_their_theirs" },
  { label: "Ze/Zir/Zirs", value: "ze_zir_zirs" },
  { label: "Pronoun is not listed", value: "other" },
];

export const ethnicityOptions: Option[] = [
  { label: "African-American or Black", value: "black" },
  { label: "Asian or Pacific Islander", value: "asian_pacific_islander" },
  { label: "Hispanic, Latino or Spanish", value: "hispanic_latino_spanish" },
  { label: "Middle Eastern or North African", value: "mena" },
  {
    label: "Native American or Alaskan Native",
    value: "native_american_alaskan",
  },
  { label: "White or Caucasian", value: "white" },
  { label: "Prefer not to disclose", value: "na" },
  { label: "A race, ethnicity, or origin that is not listed", value: "other" },
];

export const religionOptions: Option[] = [
  { label: "Buddhist", value: "buddhism" },
  { label: "Christian", value: "christian" },
  { label: "Hindu", value: "hindu" },
  { label: "Jewish", value: "jewish" },
  { label: "Muslim", value: "muslim" },
  { label: "Non-religious", value: "non_religious" },
  { label: "Non-religious, but spiritual", value: "spiritual_not_religious" },
  { label: "Prefer not to disclose", value: "na" },
  { label: "Religion that is not listed", value: "other" },
];

export const genderOptions: Option[] = [
  { label: "CIS/Male", value: "cis_male" },
  { label: "CIS/Female", value: "cis_female" },
  { label: "Trans Male", value: "trans_male" },
  { label: "Trans Female", value: "trans_female" },
  { label: "Gender Fluid", value: "gender_fluid" },
  { label: "Prefer not to disclose", value: "na" },
];

export const genderLabel = (v: string) =>
  genderOptions.find((o) => o.value === v)?.label ?? "Choose…";

export const dietOptions: Option[] = [
  { label: "I generally try to eat healthy", value: "healthy" },
  { label: "I don't pay attention to my diet", value: "anything" },
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Pescatarian", value: "pescatarian" },
  { label: "Keto", value: "keto" },
  { label: "Paleo", value: "paleo" },
  { label: "DASH", value: "dash" },
  { label: "Mediterranean", value: "mediterranean" },
  { label: "Atkins", value: "atkins" },
];

export const alcoholFrequencyOptions: Option[] = [
  { label: "Daily", value: "daily" },
  { label: "Multiple times a week", value: "multi_week" },
  { label: "Once a week", value: "once_week" },
  { label: "Once every few weeks", value: "few_weeks" },
  { label: "Several times a year, on occasion", value: "several_year" },
  { label: "I don't drink", value: "none" },
];

export const drinksPerOccasionOptions: Option[] = [
  { label: "Less than 1", value: "lt1" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5 or more", value: "5plus" },
];

export const substanceOptions: Option[] = [
  { label: "Nicotine", value: "nicotine" },
  { label: "Ecstasy/Molly/MDMA", value: "mdma" },
  { label: "Non-prescribed Xanax/other sedatives", value: "sedatives" },
  { label: "Cocaine", value: "cocaine" },
  { label: "Non-prescribed opioids/pain pills", value: "opioids" },
  { label: "LSD/other psychedelics", value: "psychedelics" },
  { label: "Meth", value: "meth" },
  { label: "Non-prescribed marijuana", value: "marijuana" },
  { label: "Heroin", value: "heroin" },
  { label: "Non-prescribed adderall", value: "adderall" },
  { label: "None of the above", value: "none_of_above" },
  { label: "Other", value: "other" },
];

export const degreeOptions: Option[] = [
  { label: "Didn't complete high school", value: "no_high_school" },
  { label: "High school graduate", value: "high_school" },
  { label: "Some college, but no degree", value: "some_college" },
  { label: "Certificate (career and technical)", value: "certificate" },
  { label: "Associate's degree", value: "associates" },
  { label: "Bachelor's degree", value: "bachelors" },
  { label: "Master's degree", value: "masters" },
  { label: "Professional/doctorate degree", value: "doctorate" },
];
