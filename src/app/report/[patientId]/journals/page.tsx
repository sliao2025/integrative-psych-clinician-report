"use client";

import PageLoadingSpinner from "@/app/components/PageLoadingSpinner";

import { useState, useEffect, use } from "react";
import { BookOpen, Calendar, TrendingUp, Meh as MehIcon } from "lucide-react";
import {
  FaRegFaceGrinStars,
  FaRegFaceSmileBeam,
  FaRegFaceMeh,
  FaRegFaceFrownOpen,
  FaRegFaceTired,
} from "react-icons/fa6";
import { intPsychTheme, sigmundTheme } from "@/app/components/theme";
import { usePatientSettings } from "@/app/contexts/PatientSettingsContext";
import { DM_Serif_Text, DM_Sans } from "next/font/google";
import Drawer from "@/app/components/Drawer";
import LinearGauge from "@/app/components/primitives/LinearGauge";
import CircularGauge from "@/app/components/primitives/CircularGauge";
import { RiInformation2Line } from "react-icons/ri";
import { useSession } from "next-auth/react";
import {
  LineChart,
  areaElementClasses,
  lineElementClasses,
  markElementClasses,
} from "@mui/x-charts/LineChart";
import { Checkbox } from "@/app/components/Report/ui";

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });
const dm_sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

interface EmotionTag {
  emotion: string;
  class: string;
  field?: string;
}

interface JournalEntry {
  id: string;
  content: string;
  mood: number;
  emotions?: EmotionTag[];
  sentimentResult: any;
  createdAt: string;
  updatedAt: string;
}

/**
 * Normalizes a score from -1 to 1 range to 0-100 range
 * -1 -> 0, 0 -> 50, 1 -> 100
 */
const normalizeScore = (score: number | undefined | null): number => {
  if (score === undefined || score === null) return 50;
  return Math.round(((score + 1) / 2) * 100);
};

export default function JournalsPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  const { settings, toggleSetting } = usePatientSettings();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const { data: session } = useSession();
  const firstName = session?.user?.name.split(" ")[0];

  const [activeTab, setActiveTab] = useState<"entries" | "trends">("entries");
  const [showSigmund, setShowSigmund] = useState(true);
  const [showMood, setShowMood] = useState(true);
  const [range, setRange] = useState<"7D" | "1M" | "3M" | "6M" | "1Y" | "All">(
    "All",
  );

  // Prepare chart data
  const chartData = entries
    .slice()
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map((e) => ({
      date: new Date(e.createdAt),
      mood: e.mood,
      sigmund: normalizeScore(e.sentimentResult?.average_score),
    }));

  const getFilteredData = () => {
    if (range === "All") return chartData;
    const now = new Date();
    const cutoff = new Date();
    if (range === "7D") cutoff.setDate(now.getDate() - 7);
    if (range === "1M") cutoff.setMonth(now.getMonth() - 1);
    if (range === "3M") cutoff.setMonth(now.getMonth() - 3);
    if (range === "6M") cutoff.setMonth(now.getMonth() - 6);
    if (range === "1Y") cutoff.setFullYear(now.getFullYear() - 1);

    return chartData.filter((d) => d.date >= cutoff);
  };

  const filteredChartData = getFilteredData();

  useEffect(() => {
    fetchJournalEntries();
  }, [patientId]);

  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/clinician/journal/${patientId}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      } else {
        setError("Failed to load journal entries");
      }
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      setError("Failed to load journal entries");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMoodIcon = (mood: number) => {
    switch (mood) {
      case 5:
        return <FaRegFaceGrinStars className="w-6 h-6 text-[#16a34a]" />;
      case 4:
        return <FaRegFaceSmileBeam className="w-6 h-6 text-[#84cc16]" />;
      case 3:
        return <FaRegFaceMeh className="w-6 h-6 text-[#ca8a04]" />;
      case 2:
        return <FaRegFaceFrownOpen className="w-6 h-6 text-[#ffa440]" />;
      case 1:
        return <FaRegFaceTired className="w-6 h-6 text-[#f43f5e]" />;
      default:
        return <FaRegFaceSmileBeam className="w-6 h-6 text-[#84cc16]" />;
    }
  };

  const getMoodLabel = (mood: number) => {
    switch (mood) {
      case 5:
        return "Amazing";
      case 4:
        return "Good";
      case 3:
        return "Meh";
      case 2:
        return "Bad";
      case 1:
        return "Terrible";
      default:
        return "Good";
    }
  };

  const getMoodEmoji = (mood: number) => {
    switch (mood) {
      case 5:
        return "🤩";
      case 4:
        return "😀";
      case 3:
        return "😐";
      case 2:
        return "☹️";
      case 1:
        return "😫";
      default:
        return "😀";
    }
  };

  const getMoodColor = (mood: number) => {
    switch (mood) {
      case 5:
        return {
          bg: "bg-[#f0fdf4]",
          text: "text-[#16a34a]",
          border: "border-[#bbf7d0]",
        };
      case 4:
        return {
          bg: "bg-[#f7fee7]",
          text: "text-[#84cc16]",
          border: "border-[#d9f99d]",
        };
      case 3:
        return {
          bg: "bg-[#fef9c3]",
          text: "text-[#ca8a04]",
          border: "border-[#fde047]",
        };
      case 2:
        return {
          bg: "bg-[#fff7ed]",
          text: "text-[#ffa440]",
          border: "border-[#fed7aa]",
        };
      case 1:
        return {
          bg: "bg-[#fff1f2]",
          text: "text-[#f43f5e]",
          border: "border-[#fecdd3]",
        };
      default:
        return {
          bg: "bg-[#f0fdf4]",
          text: "text-[#16a34a]",
          border: "border-[#bbf7d0]",
        };
    }
  };

  if (loading) {
    return <PageLoadingSpinner message="Loading journals..." />;
  }

  return (
    <div
      className={`mx-auto max-w-[1600px] xl:max-w-[2000px] px-4 sm:px-6 pb-20 ${dm_sans.className}`}
    >
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center">
              <BookOpen
                className="w-6 h-6"
                style={{ color: sigmundTheme.accent }}
              />
            </div>
            <div>
              <h2
                className={`${dm_serif.className} text-3xl font-normal`}
                style={{ color: sigmundTheme.accent }}
              >
                Patient Journals
              </h2>
              <p className="text-sm text-stone-500">
                View patient journal entries and mood tracking
              </p>
            </div>
          </div>
          {/* Patient Visibility Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-stone-400">
              {settings.journalEnabled
                ? "Visible to patient"
                : "Hidden from patient"}
            </span>
            <button
              type="button"
              onClick={() => toggleSetting("journalEnabled")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                settings.journalEnabled ? "bg-emerald-500" : "bg-stone-300"
              }`}
              title={`Patient can${settings.journalEnabled ? "" : "not"} see Journals`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  settings.journalEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`flex p-2 gap-2 border-b mb-8`}
        style={{
          borderColor: sigmundTheme.border,
          backgroundColor: sigmundTheme.background,
        }}
      >
        <button
          onClick={() => setActiveTab("entries")}
          style={{
            backgroundColor:
              activeTab === "entries" ? sigmundTheme.secondary : undefined,
            borderColor:
              activeTab === "entries" ? sigmundTheme.secondaryDark : undefined,
            color: activeTab === "entries" ? "#ffffff" : undefined,
          }}
          className={`cursor-pointer w-28 sm:w-32 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "entries"
              ? "shadow-sm border-b-4 translate-y-[-1px]"
              : "border-stone-200 border text-stone-400 hover:text-stone-600 hover:border-b-4 hover:translate-y-[-1px] active:border-b-1 active:translate-y-[1px] hover:border-stone-300 bg-white"
          }`}
        >
          Entries
        </button>
        <button
          onClick={() => setActiveTab("trends")}
          style={{
            backgroundColor:
              activeTab === "trends" ? sigmundTheme.secondary : undefined,
            borderColor:
              activeTab === "trends" ? sigmundTheme.secondaryDark : undefined,
            color: activeTab === "trends" ? "#ffffff" : undefined,
          }}
          className={`cursor-pointer w-28 sm:w-32 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "trends"
              ? "shadow-sm border-b-4 translate-y-[-1px]"
              : "border-stone-200 border text-stone-400 hover:text-stone-600 hover:border-b-4 hover:translate-y-[-1px] active:border-b-1 active:translate-y-[1px] hover:border-stone-300 bg-white"
          }`}
        >
          Trends
        </button>
      </div>

      {activeTab === "entries" ? (
        <>
          {error ? (
            <div className="bg-rose-50 rounded-2xl p-12 text-center border border-rose-200">
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-rose-400" />
              </div>
              <h4 className="text-lg font-medium text-stone-900 mb-1">
                Error loading entries
              </h4>
              <p className="text-stone-500">{error}</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-[#b2bfa233] rounded-2xl p-12 text-center border border-[#b2bfa2] border-dashed">
              <p className="text-stone-500 font-medium text-lg">
                No journal entries found for this patient.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2.5">
              {entries.map((entry) => {
                const moodColors = getMoodColor(entry.mood);
                const moodLabel = getMoodLabel(entry.mood);

                return (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className="bg-white rounded-xl border border-[#e7e5e4] border-b-4 p-5 cursor-pointer hover:border-[#b2bfa2] hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-1 transition-all group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div
                        className={`flex items-center gap-2 bg-[${sigmundTheme.background}] px-3 py-1.5 rounded-lg text-xs font-bold text-stone-500 uppercase tracking-wide border border-[${sigmundTheme.border}] whitespace-nowrap`}
                      >
                        <Calendar className="w-3 h-3" />
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>

                      <div className="flex items-center gap-2">
                        {entry.sentimentResult?.average_score !== undefined && (
                          <CircularGauge
                            score={normalizeScore(
                              entry.sentimentResult?.average_score,
                            )}
                            size={32}
                            showLabel={false}
                            animate={false}
                            isLoading={false}
                          />
                        )}
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${moodColors.bg} ${moodColors.text} text-xs font-bold uppercase border ${moodColors.border}`}
                        >
                          {getMoodIcon(entry.mood)}
                          {moodLabel}
                        </div>
                      </div>
                    </div>

                    <p className="text-stone-600 font-medium line-clamp-3 mb-4 leading-relaxed text-base">
                      {entry.content}
                    </p>

                    {/* Emotion Tags */}
                    {entry.emotions && entry.emotions.length > 0 && (
                      <div className="mb-4">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2 block">
                          Feelings and Emotions
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {entry.emotions.slice(0, 3).map((emotion, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-[#b2bfa233] text-[#426459] text-xs font-medium rounded-full border border-[#b2bfa2]"
                            >
                              {emotion.emotion}
                            </span>
                          ))}
                          {entry.emotions.length > 3 && (
                            <span
                              className={`px-2.5 py-1 bg-[${sigmundTheme.background}] text-stone-500 text-xs font-medium rounded-full border border-[${sigmundTheme.border}]`}
                            >
                              +{entry.emotions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <Checkbox
                label="Sigmund's Index"
                checked={showSigmund}
                onChange={setShowSigmund}
                color={sigmundTheme.accent}
              />
              <Checkbox
                label="Overall Mood"
                checked={showMood}
                onChange={setShowMood}
                color="#ffa440"
              />
            </div>

            <div className="flex gap-1 bg-stone-100 p-1 rounded-lg">
              {["7D", "1M", "3M", "6M", "1Y", "All"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r as any)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    range === r
                      ? "bg-white text-stone-800 border-b-3 border-stone-200"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-[400px]">
            {filteredChartData.length > 1 ? (
              <LineChart
                height={400}
                dataset={filteredChartData}
                sx={{
                  "& .MuiAreaElement-root": {
                    fillOpacity: 0.3,
                  },
                  '& .MuiAreaElement-root[data-id="sigmund"]': {
                    fill: "url('#sigmundGradient')",
                  },
                  '& .MuiAreaElement-root[data-id="mood"]': {
                    fill: "url('#moodGradient')",
                  },
                  "& .MuiLineElement-root": {
                    strokeWidth: 3,
                    strokeLinecap: "round",
                  },

                  // Font styling
                  ".MuiChartsAxis-tickLabel": {
                    fontFamily: `${dm_sans.style.fontFamily} !important`,
                    fontSize: "0.7rem",
                    fill: "#78716c", // stone-500
                    fontWeight: 500,
                  },
                  ".MuiChartsAxis-label": {
                    fontFamily: `${dm_sans.style.fontFamily} !important`,
                    fontWeight: 700,
                    fill: sigmundTheme.text,
                  },
                }}
                slotProps={{
                  legend: { hidden: true } as any,
                  tooltip: {
                    sx: {
                      fontFamily: dm_sans.style.fontFamily,
                    },
                  },
                }}
                slots={
                  {
                    axisContent: (props: any) => {
                      const { series, axisValue } = props;
                      return (
                        <div className="bg-white border border-stone-200 rounded-lg shadow-md z-50 min-w-[180px]">
                          <p className="text-sm text-stone-600 px-3 py-2 border-b border-stone-100 font-medium">
                            {new Date(axisValue).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            })}
                          </p>
                          <div className="flex flex-col py-1">
                            {series
                              .filter((s: any) => s.value !== null)
                              .map((s: any) => {
                                const isSigmund = s.dataKey === "sigmund";
                                const isMood = s.dataKey === "mood";
                                const value = s.value;

                                return (
                                  <div
                                    key={s.id}
                                    className="flex items-center justify-between px-3 py-1 gap-4"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-1 rounded-full"
                                        style={{ backgroundColor: s.color }}
                                      />
                                      <span className="text-xs text-stone-500 font-medium">
                                        {s.label}
                                      </span>
                                    </div>
                                    <div className="text-sm font-bold text-stone-700">
                                      {isSigmund && value}
                                      {isMood && (
                                        <div className="flex items-center gap-1">
                                          <span>{getMoodEmoji(value)}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    },
                  } as any
                }
                xAxis={[
                  {
                    dataKey: "date",
                    scaleType: "time",
                    valueFormatter: (date) =>
                      date.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
                    tickMinStep: 3600 * 1000 * 24,
                    tickLabelStyle: {
                      angle: 0,
                      textAnchor: "middle",
                      fontSize: 10,
                      fill: "#78716c",
                    },
                  },
                ]}
                yAxis={[
                  {
                    id: "sigmundAxis",
                    min: 0,
                    max: 100,
                    label: "Sigmund's Index",
                    scaleType: "linear",
                  },
                  {
                    id: "moodAxis",
                    min: 0.5, // Pad slightly
                    max: 5.5,
                    label: "Mood",
                    scaleType: "linear",
                    position: "right" as const,
                    valueFormatter: (value) => getMoodEmoji(value),
                    tickInterval: [1, 2, 3, 4, 5],
                  },
                ]}
                series={[
                  ...(showSigmund
                    ? [
                        {
                          id: "sigmund", // ID for targeting styles
                          dataKey: "sigmund",
                          label: "Sigmund's Index",
                          yAxisId: "sigmundAxis",
                          color: sigmundTheme.accent,
                          showMark: true,
                          area: true,
                          curve: "monotoneX" as const,
                        },
                      ]
                    : []),
                  ...(showMood
                    ? [
                        {
                          id: "mood", // ID for targeting styles
                          dataKey: "mood",
                          label: "Mood",
                          yAxisId: "moodAxis",
                          color: intPsychTheme.secondary,
                          showMark: true,
                          area: true,
                          curve: "stepAfter" as const,
                        },
                      ]
                    : []),
                ]}
                margin={{ left: 50, right: 60, bottom: 60 }}
                grid={{ horizontal: true }}
              >
                <defs>
                  <linearGradient
                    id="sigmundGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={sigmundTheme.accent}
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="100%"
                      stopColor={sigmundTheme.accent}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={intPsychTheme.secondary}
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="100%"
                      stopColor={intPsychTheme.secondary}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
              </LineChart>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-stone-400">
                <TrendingUp className="w-12 h-12 mb-2 opacity-50" />
                <p className="font-medium">
                  {entries.length > 1
                    ? "No entries found in this date range."
                    : "Not enough entries to show trends yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drawer for full content */}
      <Drawer isOpen={!!selectedEntry} onClose={() => setSelectedEntry(null)}>
        {selectedEntry && (
          <div className={`space-y-6 ${dm_sans.className}`}>
            {/* Header with date and mood */}
            <div
              className={`flex items-center justify-between border-b border-[${sigmundTheme.border}] pb-6`}
            >
              <div className="flex items-center gap-2">
                <div className="bg-[#f5f5f4] p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-stone-500" />
                </div>
                <span className="text-lg font-bold text-[#1c1917]">
                  {formatDate(selectedEntry.createdAt)}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  getMoodColor(selectedEntry.mood).bg
                } ${getMoodColor(selectedEntry.mood).border}`}
              >
                {getMoodIcon(selectedEntry.mood)}
                <span
                  className={`font-bold uppercase tracking-wide text-sm ${
                    getMoodColor(selectedEntry.mood).text
                  }`}
                >
                  {getMoodLabel(selectedEntry.mood)}
                </span>
              </div>
            </div>

            {/* Entry content */}
            <div>
              <h3
                className={`${dm_serif.className} text-2xl text-[#1c1917] mb-4`}
              >
                Entry Details
              </h3>
              <div
                className={`bg-[${sigmundTheme.background}] p-6 rounded-xl border border-[${sigmundTheme.border}] max-h-[40vh] overflow-y-auto scrollbar-visible`}
              >
                <p className="text-[#1c1917] whitespace-pre-wrap leading-relaxed text-lg font-medium">
                  {selectedEntry.content}
                </p>
              </div>
            </div>

            {/* Sigmund's Score Section */}
            {selectedEntry.sentimentResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3
                    className={`${dm_serif.className} text-2xl text-[#1c1917]`}
                  >
                    Sigmund's Index
                  </h3>
                  <div className="group relative">
                    <RiInformation2Line className="w-5 h-5 text-stone-400 cursor-help" />
                    <div className="border-b-4 absolute left-full top-1/2 -transtone-y-1/2 ml-3 w-80 p-4 bg-white text-[#1c1917] text-xs font-medium rounded-xl border border-stone-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
                      Sigmund's Index evaluates the emotional tone of each
                      sentence in the patient's entry and computes a composite
                      score.
                      {/* Arrow Tail */}
                      <div className="absolute right-full top-1/2 -transtone-y-1/2 w-3 h-3 bg-white border-l border-t border-stone-200 rotate-[-45deg] transtone-x-[7px]" />
                    </div>
                  </div>
                </div>

                <div
                  className={`bg-[${sigmundTheme.background}] p-6 rounded-xl border border-[${sigmundTheme.border}]`}
                >
                  <LinearGauge
                    score={normalizeScore(
                      selectedEntry.sentimentResult?.average_score,
                    )}
                    name={firstName}
                    isLoading={false}
                  />
                </div>
              </div>
            )}

            {/* Emotions Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className={`${dm_serif.className} text-2xl text-[#1c1917]`}>
                  Feelings and Emotions
                </h3>
                <div className="group relative">
                  <RiInformation2Line className="w-5 h-5 text-stone-400 cursor-help" />
                  <div className="border-b-4 absolute left-full top-1/2 -transtone-y-1/2 ml-3 w-80 p-4 bg-white text-[#1c1917] text-xs font-medium rounded-xl border border-stone-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
                    This analysis extracts the feelings and emotions you express
                    in your entry.
                    {/* Arrow Tail */}
                    <div className="absolute right-full top-1/2 -transtone-y-1/2 w-3 h-3 bg-white border-l border-t border-stone-200 rotate-[-45deg] transtone-x-[7px]" />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedEntry.emotions && selectedEntry.emotions.length > 0 ? (
                  selectedEntry.emotions.map((emotion, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[#b2bfa233] text-[#426459] text-sm font-medium rounded-full border border-[#b2bfa2]"
                    >
                      {emotion.emotion}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-stone-400 italic">
                    No emotions detected
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
