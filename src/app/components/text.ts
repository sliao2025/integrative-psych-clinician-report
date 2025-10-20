import { Option } from "./types";
// DISC Teen Depression questions (child self-report)
export const DISC_CHILD_QUESTIONS: Record<string, string> = {
  dtds01: "Have you often felt sad or depressed?",
  dtds02:
    "Have you felt like nothing is fun for you and you just aren't interested in anything?",
  dtds03:
    "Have you often felt grouchy or irritable and often in a bad mood, when even little things would make you mad?",
  dtds04: "Have you lost weight, more than just a few pounds?",
  dtds05: "Have you lost your appetite or often felt less like eating?",
  dtds06: "Have you gained a lot of weight, more than just a few pounds?",
  dtds07:
    "Have you felt much hungrier than usual or eaten a lot more than usual?",
  dtds08:
    "Have you had trouble sleeping – that is, trouble falling asleep, staying asleep, or waking up too early?",
  dtds09: "Have you slept more during the day than you usually do?",
  dtds10:
    "Have you often felt slowed down … like you walked or talked much slower than you usually do?",
  dtds11:
    "Have you often felt restless … like you just had to keep walking around?",
  dtds12: "Have you had less energy than you usually do?",
  dtds13: "Has doing even little things made you feel really tired?",
  dtds14: "Have you often blamed yourself for bad things that happened?",
  dtds15:
    "Have you felt you couldn't do anything well or that you weren't as good looking or as smart as other people?",
  dtds16:
    "Has it seemed like you couldn't think as clearly or as fast as usual?",
  dtds17:
    "Have you often had trouble keeping your mind on your schoolwork/work or other things?",
  dtds18:
    "Has it often been hard for you to make up your mind or to make decisions?",
  dtds19:
    "Have you often thought about death or about people who had died or about being dead yourself?",
  dtds20: "Have you thought seriously about killing yourself?",
  dtds21:
    "Have you EVER, in your WHOLE LIFE, tried to kill yourself or made a suicide attempt?",
  dtds22: "Have you tried to kill yourself in the last four weeks?",
};

// DISC Teen Depression questions (parent report)
export const DISC_PARENT_QUESTIONS: Record<string, string> = {
  dtds01: "Has your child often seemed sad or depressed?",
  dtds02:
    "Has it seemed like nothing was fun for your child and they just weren't interested in anything?",
  dtds03:
    "Has your child often been grouchy or irritable and often in a bad mood, when even little things would make them mad?",
  dtds04: "Has your child lost weight, more than just a few pounds?",
  dtds05:
    "Has it seemed like your child lost their appetite or ate a lot less than usual?",
  dtds06: "Has your child gained a lot of weight, more than just a few pounds?",
  dtds07:
    "Has it seemed like your child felt much hungrier than usual or ate a lot more than usual?",
  dtds08:
    "Has your child had trouble sleeping – that is, trouble falling asleep, staying asleep, or waking up too early?",
  dtds09: "Has your child slept more during the day than they usually do?",
  dtds10:
    "Has your child seemed to do things like walking or talking much more slowly than usual?",
  dtds11:
    "Has your child often seemed restless … like they just had to keep walking around?",
  dtds12: "Has your child seemed to have less energy than they usually do?",
  dtds13:
    "Has doing even little things seemed to make your child feel really tired?",
  dtds14:
    "Has your child often blamed themselves for bad things that happened?",
  dtds15:
    "Has your child said they couldn't do anything well or that they weren't as good looking or as smart as other people?",
  dtds16:
    "Has it seemed like your child couldn't think as clearly or as fast as usual?",
  dtds17:
    "Has your child often seemed to have trouble keeping their mind on their schoolwork/work or other things?",
  dtds18:
    "Has it often seemed hard for your child to make up their mind or to make decisions?",
  dtds19:
    "Has your child said they often thought about death or about people who had died or about being dead themselves?",
  dtds20: "Has your child talked seriously about killing themselves?",
  dtds21: "Has your child tried to kill themselves in the last four weeks?",
  dtds22:
    "Has your child EVER, in their WHOLE LIFE, tried to kill themselves or made a suicide attempt?",
};

// SNAP-IV questions
export const SNAP_QUESTIONS: Record<string, string> = {
  snap01:
    "Often fails to give close attention to details or makes careless mistakes in schoolwork or tasks",
  snap02:
    "Often has difficulty sustaining attention in tasks or play activities",
  snap03: "Often does not seem to listen when spoken to directly",
  snap04:
    "Often does not follow through on instructions and fails to finish schoolwork, chores, or duties",
  snap05: "Often has difficulty organizing tasks and activities",
  snap06:
    "Often avoids, dislikes, or reluctantly engages in tasks requiring sustained mental effort",
  snap07:
    "Often loses things necessary for activities (e.g., toys, school assignments, pencils or books)",
  snap08: "Often is distracted by extraneous stimuli",
  snap09: "Often is forgetful in daily activities",
  snap10: "Often fidgets with hands or feet or squirms in seat",
  snap11:
    "Often leaves seat in classroom or in other situations in which remaining seated is expected",
  snap12:
    "Often runs about or climbs excessively in situations in which it is inappropriate",
  snap13:
    "Often has difficulty playing or engaging in leisure activities quietly",
  snap14: 'Often is "on the go" or often acts as if "driven by a motor"',
  snap15: "Often talks excessively",
  snap16: "Often blurts out answers before questions have been completed",
  snap17: "Often has difficulty awaiting turn",
  snap18:
    "Often interrupts or intrudes on others (e.g., butts into conversations/games)",
  snap19: "Often loses temper",
  snap20: "Often argues with adults",
  snap21: "Often actively defies or refuses adult requests or rules",
  snap22: "Often deliberately does things that annoy other people",
  snap23: "Often blames others for his or her mistakes or misbehaviour",
  snap24: "Often is touchy or easily annoyed by others",
  snap25: "Often is angry and resentful",
  snap26: "Often is spiteful or vindictive",
};

// SCARED questions (child self-report)
export const SCARED_CHILD_QUESTIONS: Record<string, string> = {
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
  scared39:
    "I feel nervous when I am with other children or adults and I have to do something while they watch me (for example: read aloud, speak, play a game, play a sport)",
  scared40:
    "I feel nervous when I am going to parties, dances, or any place where there will be people that I don't know well",
  scared41: "I am shy",
};

// SCARED questions (parent report)
export const SCARED_PARENT_QUESTIONS: Record<string, string> = {
  scared01: "When my child feels frightened, it is hard for him/her to breathe",
  scared02: "My child gets headaches when he/she is at school",
  scared03: "My child doesn't like to be with people he/she doesn't know well",
  scared04: "My child gets scared if he/she sleeps away from home",
  scared05: "My child worries about other people liking him/her",
  scared06: "When my child gets frightened, he/she feels like passing out",
  scared07: "My child is nervous",
  scared08: "My child follows me wherever I go",
  scared09: "People tell me that my child looks nervous",
  scared10: "My child feels nervous with people he/she doesn't know well",
  scared11: "My child gets stomachaches at school",
  scared12:
    "When my child gets frightened, he/she feels like he/she is going crazy",
  scared13: "My child worries about sleeping alone",
  scared14: "My child worries about being as good as other kids",
  scared15:
    "When he/she gets frightened, he/she feels like things are not real",
  scared16:
    "My child has nightmares about something bad happening to his/her parents",
  scared17: "My child worries about going to school",
  scared18: "When my child gets frightened, his/her heart beats fast",
  scared19: "He/she gets shaky",
  scared20: "My child has nightmares about something bad happening to him/her",
  scared21: "My child worries about things working out for him/her",
  scared22: "When my child gets frightened, he/she sweats a lot",
  scared23: "My child is a worrier",
  scared24: "My child gets really frightened for no reason at all",
  scared25: "My child is afraid to be alone in the house",
  scared26:
    "It is hard for my child to talk with people he/she doesn't know well",
  scared27:
    "When my child gets frightened, he/she feels like he/she is choking",
  scared28: "People tell me that my child worries too much",
  scared29: "My child doesn't like to be away from his/her family",
  scared30: "My child is afraid of having anxiety (or panic) attacks",
  scared31:
    "My child worries that something bad might happen to his/her parents",
  scared32: "My child feels shy with people he/she doesn't know well",
  scared33: "My child worries about what is going to happen in the future",
  scared34: "When my child gets frightened, he/she feels like throwing up",
  scared35: "My child worries about how well he/she does things",
  scared36: "My child is scared to go to school",
  scared37: "My child worries about things that have already happened",
  scared38: "When my child gets frightened, he/she feels dizzy",
  scared39:
    "My child feels nervous when he/she is with other children or adults and he/she has to do something while they watch him/her (for example: read aloud, speak, play a game, play a sport)",
  scared40:
    "My child feels nervous when he/she is going to parties, dances, or any place where there will be people that he/she doesn't know well",
  scared41: "My child is shy",
};
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

/** CRAFFT 2.1 — Part A (screening, numeric responses) */
export const CRAFFT_PARTA_QUESTIONS: Record<string, string> = {
  daysAlcohol:
    "On how many days did you drink more than a few sips of beer, wine, or any drink containing alcohol?",
  daysMarijuana:
    "On how many days did you use marijuana (weed, oil, vapes, edibles)?",
  daysOther:
    "On how many days did you use anything else to get high (for example, other illegal drugs, prescription medications, or over-the-counter medications)?",
};

/** CRAFFT 2.1 — Part B (six yes/no items) */
export const CRAFFT_QUESTIONS: Record<string, string> = {
  car: "Have you ever ridden in a CAR driven by someone (including yourself) who was high or had been using alcohol or drugs?",
  relax:
    "Do you ever use alcohol or drugs to RELAX, feel better about yourself, or fit in?",
  alone:
    "Do you ever use alcohol or drugs while you are by yourself, or ALONE?",
  forget: "Do you ever FORGET things you did while using alcohol or drugs?",
  familyFriends:
    "Do your FAMILY or FRIENDS ever tell you that you should cut down on your drinking or drug use?",
  trouble:
    "Have you ever gotten into TROUBLE while you were using alcohol or drugs?",
};

export const moodChangeOptions: Option[] = [
  { value: "sad", label: "Feeling significantly sad or down" },
  { value: "tired", label: "Significant tiredness" },
  { value: "mood_swings", label: "Drastic mood changes (high/low)" },
  { value: "low_self_esteem", label: "Low self esteem" },
  { value: "guilt", label: "Excessive guilt" },
  { value: "none", label: "🚫 None of the above" },
];

export const behaviorChangeOptions: Option[] = [
  { value: "withdrawal", label: "Withdrawal from friends/activities" },
  { value: "substances", label: "Problems with alcohol or drug use" },
  { value: "eating", label: "Significant changes in eating habits" },
  { value: "anger", label: "Excessive anger/violence" },
  { value: "daily_problems", label: "Unable to deal with daily problems" },
  { value: "none", label: "🚫 None of the above" },
];

export const thoughtChangeOptions: Option[] = [
  { value: "concentration", label: "Inability to concentrate" },
  { value: "detachment", label: "Detachment from reality" },
  { value: "disconnected", label: "Feeling disconnected from others" },
  { value: "worry", label: "Excessive worry/fear" },
  { value: "suicidal", label: "Suicidal thinking" },
  { value: "none", label: "🚫 None of the above" },
];

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
