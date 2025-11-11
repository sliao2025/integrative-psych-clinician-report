// app/report/components/TopBlocks.tsx
"use client";
import {
  CalendarDays,
  Mail as MailIcon,
  Phone as PhoneIcon,
  User,
  Eye,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  MessageCircleMore,
  UserRound,
  Laugh,
  Frown,
  Meh,
  Smile,
  MapPin,
} from "lucide-react";
import { KV, Gauge } from "./ui";
import { ProfileJson } from "../types";
import React, { useEffect, useState } from "react";
import { DM_Serif_Text } from "next/font/google";
import { intPsychTheme } from "../theme";
import { genderOptions } from "../text";

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });

export function DemographicsHeader({
  data,
  patientDbData,
  onOpen,
}: {
  data: ProfileJson;
  patientDbData: any;
  onOpen: () => void;
}) {
  const labelFor = (
    options: { value: string; label: string }[],
    value?: string | null
  ) =>
    value ? options.find((o) => o.value === value)?.label ?? value : undefined;
  return (
    <div className="relative rounded-2xl border border-slate-300 bg-white p-4 sm:p-5">
      <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5 items-start">
        {/* Left: Avatar + Name */}
        <div className="col-span-12 md:col-span-4 lg:col-span-7 flex items-center gap-3 min-w-0">
          {patientDbData.image ? (
            <img
              src={patientDbData.image}
              alt={`${data.firstName}'s Profile Photo`}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover flex-none"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              style={{ background: intPsychTheme.secondary }}
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-white sm:text-xl font-medium flex-none"
            >
              {data.firstName?.[0] || "P"}
            </div>
          )}
          <div className="min-w-0">
            <div
              className={`text-xl sm:text-2xl md:text-3xl ${dm_serif.className} font-semibold tracking-tight text-slate-900 truncate`}
              style={{ color: intPsychTheme.primary }}
            >
              {data.firstName} {data.lastName}
            </div>
            <div className="mt-0.5 text-[12px] sm:text-[13px] text-slate-600 truncate">
              Age {data.age} • {data.pronouns?.[0]?.label}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="col-span-12 xl:col-span-5 xl:mr-15">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <User
                className="h-4 w-4 flex-none"
                style={{ color: intPsychTheme.primary }}
              />
              <KV
                label="Gender Identity"
                value={labelFor(genderOptions, data.genderIdentity)}
                truncate={false}
                alignRight={false}
                className="flex-1 min-w-0"
              />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <CalendarDays
                className="h-4 w-4 flex-none"
                style={{ color: intPsychTheme.primary }}
              />
              <KV
                label="DOB"
                value={data.dob ? data.dob : "—"}
                truncate={false}
                alignRight={false}
                className="flex-1 min-w-0"
              />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <PhoneIcon
                className="h-4 w-4 flex-none"
                style={{ color: intPsychTheme.primary }}
              />
              <KV
                label={data.isChild ? "Parent/Guardian Phone" : "Phone"}
                value={data.contactNumber}
                truncate={false}
                alignRight={false}
                className="flex-1 min-w-0"
              />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <MailIcon
                className="h-4 w-4 flex-none"
                style={{ color: intPsychTheme.primary }}
              />
              <KV
                label={data.isChild ? "Parent/Guardian Email" : "Email"}
                value={data.email}
                truncate={false}
                alignRight={false}
                className="flex-1 min-w-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Absolute Expand button */}
      <button
        type="button"
        onClick={onOpen}
        className="absolute top-3 right-3 cursor-pointer flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] sm:text-[12px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:bg-slate-200 transition-all hover:shadow"
        aria-label="Expand demographics"
      >
        <Eye className="h-4 w-4" />
      </button>
    </div>
  );
}

// Field name to readable label mapping
const fieldLabels: Record<string, string> = {
  livingSituation: "Living Situation",
  storyNarrative: "Story/Narrative",
  goals: "Presenting Goals",
  cultureContext: "Cultural Context",
  upbringingEnvironments: "Upbringing",
  upbringingWhoWith: "Upbringing",
  childhoodNegativeReason: "Childhood",
  familyHistoryElaboration: "Family History",
  "followupQuestions.question1": "Follow-up Question 1",
  "followupQuestions.question2": "Follow-up Question 2",
  "followupQuestions.question3": "Follow-up Question 3",
};

interface SentimentSentence {
  sentence: string;
  field: string;
  label: "positive" | "neutral" | "negative";
  score: number;
  scores: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface SentimentResult {
  sentences: SentimentSentence[];
  average_score: number;
  total_sentences: number;
  breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface Summary {
  identification: string;
  chief_complaint: string;
}

export function InsightsBlock({
  userId,
  data,
  onNavigate,
}: {
  userId: string;
  data?: any;
  onNavigate?: (field: string, sentence: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentResult | null>(
    null
  );
  const [summaryData, setSummaryData] = useState<Summary | null>(null);
  const [positiveIndex, setPositiveIndex] = useState(0);
  const [negativeIndex, setNegativeIndex] = useState(0);
  const [loadingPhrase, setLoadingPhrase] = useState(0);

  const loadingPhrases = [
    "Analyzing patient responses...",
    "Processing emotional patterns...",
    "Identifying key insights...",
    "Evaluating sentiment distribution...",
    "Synthesizing clinical observations...",
    "Extracting meaningful patterns...",
    "Generating comprehensive analysis...",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check if sentiment and summary already exist in profile data
        const existingSentiment = data?.sentimentAnalysis;
        const existingSummary = data?.summary;

        // If both exist, use cached data
        if (existingSentiment && existingSummary) {
          setSentimentData(existingSentiment);
          setSummaryData(existingSummary);
          setLoading(false);
          return;
        }

        // Fetch only missing data
        const promises = [];

        if (!existingSentiment) {
          promises.push(
            fetch("/api/sentiment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId }),
            })
              .then((res) => res.json())
              .then((responseData) => {
                if (responseData.success && responseData.result) {
                  setSentimentData(responseData.result);
                }
              })
          );
        } else {
          setSentimentData(existingSentiment);
        }

        if (!existingSummary) {
          promises.push(
            fetch("/api/summarize", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId }),
            })
              .then((res) => res.json())
              .then((responseData) => {
                if (responseData.success && responseData.summary) {
                  setSummaryData(responseData.summary);
                }
              })
          );
        } else {
          setSummaryData(existingSummary);
        }

        await Promise.all(promises);
      } catch (err: any) {
        console.error("Insights error:", err);
        setError(err.message || "Failed to load insights");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, data]);

  // Rotate loading phrases
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingPhrase((prev) => (prev + 1) % loadingPhrases.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading, loadingPhrases.length]);

  if (loading) {
    return (
      <div className="relative rounded-2xl border border-slate-300 bg-white p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit
            className="h-5 w-5"
            style={{ color: intPsychTheme.primary }}
          />
          <div>
            <h2
              className={`text-xl sm:text-2xl ${dm_serif.className} font-semibold tracking-tight`}
              style={{ color: intPsychTheme.primary }}
            >
              Clinical Insights
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
              Generating AI-powered clinical insights
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 space-y-5">
          {/* Simple Spinner */}
          <div
            style={{ borderTopColor: intPsychTheme.secondary }}
            className="rounded-full h-10 w-10 border-4 border-gray-200 border-t-4 animate-spin"
          />

          {/* Rotating Text with Fade Transition */}
          <div className="relative h-6 flex items-center justify-center overflow-hidden w-full">
            {loadingPhrases.map((phrase, index) => (
              <p
                key={index}
                className={`absolute text-sm font-medium transition-all duration-500 ${
                  index === loadingPhrase
                    ? "opacity-100 translate-y-0"
                    : index < loadingPhrase
                    ? "opacity-0 -translate-y-4"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ color: intPsychTheme.primary }}
              >
                {phrase}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !sentimentData) {
    return (
      <div className="relative rounded-2xl border border-slate-300 bg-white p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit
            className="h-5 w-5"
            style={{ color: intPsychTheme.primary }}
          />
          <div>
            <h2
              className={`text-xl sm:text-2xl ${dm_serif.className} font-semibold tracking-tight`}
              style={{ color: intPsychTheme.primary }}
            >
              Clinical Insights
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
              Analyzing emotional tone of patient responses
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            {error || "No sentiment data available"}
          </p>
        </div>
      </div>
    );
  }

  // Get top 5 positive and negative sentences
  const positiveSentences = sentimentData.sentences
    .filter((s) => s.label === "positive")
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const negativeSentences = sentimentData.sentences
    .filter((s) => s.label === "negative")
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const SentenceCard = ({
    sentence,
    type,
  }: {
    sentence: SentimentSentence;
    type: "positive" | "negative";
  }) => {
    const percentage = Math.round(sentence.score * 100);
    const bgColor = type === "positive" ? "bg-emerald-50" : "bg-rose-50";
    const borderColor =
      type === "positive" ? "border-emerald-200" : "border-rose-200";
    const hoverBgColor =
      type === "positive" ? "hover:bg-emerald-100" : "hover:bg-rose-100";
    const textColor =
      type === "positive" ? "text-emerald-900" : "text-rose-900";
    const accentColor =
      type === "positive" ? "text-emerald-700" : "text-rose-700";
    const iconColor = type === "positive" ? "#059669" : "#dc2626";
    const fieldLabel = fieldLabels[sentence.field] || sentence.field;

    return (
      <button
        type="button"
        onClick={() => onNavigate?.(sentence.field, sentence.sentence)}
        className={`w-full text-left ${bgColor} ${hoverBgColor} ${borderColor} border rounded-xl p-3.5 sm:p-4 transition-all hover:shadow-lg hover:border-opacity-80 cursor-pointer hover:scale-[1.02] active:scale-[0.98] group relative`}
      >
        {/* Click indicator */}
        <div
          className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${accentColor}`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {type === "positive" ? (
              <TrendingUp className="h-5 w-5" style={{ color: iconColor }} />
            ) : (
              <TrendingDown className="h-5 w-5" style={{ color: iconColor }} />
            )}
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <p
              className={`${textColor} text-[13px] sm:text-sm leading-relaxed mb-2.5`}
            >
              "{sentence.sentence}"
            </p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span
                className={`${accentColor} text-[11px] sm:text-xs font-medium flex items-center gap-1`}
              >
                <MapPin className="h-3 w-3" />
                {fieldLabel}
              </span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 sm:w-20 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      type === "positive" ? "bg-emerald-600" : "bg-rose-600"
                    } rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span
                  className={`${accentColor} text-[11px] sm:text-xs font-bold tabular-nums`}
                >
                  {percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div
          className={`mt-2 pt-2 border-t ${
            type === "positive" ? "border-emerald-200/50" : "border-rose-200/50"
          } opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          <p
            className={`text-[10px] sm:text-[11px] ${accentColor} font-medium text-center`}
          >
            Click to view in full context →
          </p>
        </div>
      </button>
    );
  };

  return (
    <>
      {/* Patient Summary Section */}
      {summaryData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Patient Bio */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3
              className={`${dm_serif.className} text-md sm:text-base md:text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2`}
            >
              <UserRound
                className="h-5 w-5"
                style={{ color: intPsychTheme.primary }}
              />
              Patient Bio
            </h3>
            <p className="text-[13px] sm:text-sm text-slate-700 leading-relaxed">
              {summaryData.identification}
            </p>
          </div>

          {/* Chief Complaint */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3
              className={`${dm_serif.className} text-md sm:text-base md:text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2`}
            >
              <MessageCircleMore
                className="h-5 w-5"
                style={{ color: intPsychTheme.primary }}
              />
              Chief Complaint
            </h3>
            <p className="text-[13px] sm:text-sm text-slate-700 leading-relaxed">
              {summaryData.chief_complaint}
            </p>
          </div>
        </div>
      )}

      {/* Sentiment Analysis Section */}
      {sentimentData && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          {/* Section Title */}
          <div className="mb-3">
            <h3
              className={`${dm_serif.className} text-md sm:text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2`}
            >
              <TrendingUp className="h-4 w-4 text-slate-600" />
              Emotional Tone Analysis
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {sentimentData.total_sentences} sentences analyzed across all
              responses
            </p>
          </div>

          {/* Summary Stats - Always visible when sentiment exists */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {/* Positive */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Smile className="h-5 w-5 text-emerald-500" />
                  <span className="text-[13px] sm:text-sm  font-semibold text-emerald-900">
                    Positive
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-emerald-900">
                  {Math.round(
                    (sentimentData.breakdown.positive /
                      sentimentData.total_sentences) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-emerald-100 mb-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500"
                  style={{
                    width: `${Math.round(
                      (sentimentData.breakdown.positive /
                        sentimentData.total_sentences) *
                        100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-emerald-700">
                {sentimentData.breakdown.positive} sentences
              </p>
            </div>

            {/* Negative */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Frown className="h-5 w-5 text-rose-400" />
                  <span className="text-[13px] sm:text-sm font-semibold text-rose-900">
                    Negative
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-rose-900">
                  {Math.round(
                    (sentimentData.breakdown.negative /
                      sentimentData.total_sentences) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-rose-100 mb-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-rose-300 to-rose-400"
                  style={{
                    width: `${Math.round(
                      (sentimentData.breakdown.negative /
                        sentimentData.total_sentences) *
                        100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-rose-700">
                {sentimentData.breakdown.negative} sentences
              </p>
            </div>

            {/* Neutral */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Meh className="h-5 w-5 text-slate-400" />
                  <span className="text-[13px] sm:text-sm font-semibold text-slate-900">
                    Neutral
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {Math.round(
                    (sentimentData.breakdown.neutral /
                      sentimentData.total_sentences) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-slate-200 mb-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-slate-300 to-slate-400"
                  style={{
                    width: `${Math.round(
                      (sentimentData.breakdown.neutral /
                        sentimentData.total_sentences) *
                        100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-600">
                {sentimentData.breakdown.neutral} sentences
              </p>
            </div>
          </div>

          {/* Sentence Details - Carousel */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Positive Column - Carousel */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-emerald-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Most Positive Sentences
                </h3>
                {positiveSentences.length > 0 && (
                  <span className="text-xs text-emerald-700 font-medium">
                    {positiveIndex + 1} of {positiveSentences.length}
                  </span>
                )}
              </div>
              {positiveSentences.length > 0 ? (
                <div className="relative">
                  <SentenceCard
                    sentence={positiveSentences[positiveIndex]}
                    type="positive"
                  />
                  {positiveSentences.length > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <button
                        onClick={() =>
                          setPositiveIndex((prev) =>
                            prev === 0 ? positiveSentences.length - 1 : prev - 1
                          )
                        }
                        className="flex items-center justify-center h-8 w-8 rounded-full border border-emerald-300 bg-white hover:bg-emerald-50 transition-colors"
                        aria-label="Previous positive sentence"
                      >
                        <ChevronLeft className="h-4 w-4 text-emerald-700" />
                      </button>
                      <div className="flex gap-1.5">
                        {positiveSentences.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPositiveIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === positiveIndex
                                ? "w-6 bg-emerald-600"
                                : "w-2 bg-emerald-300 hover:bg-emerald-400"
                            }`}
                            aria-label={`Go to positive sentence ${idx + 1}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          setPositiveIndex((prev) =>
                            prev === positiveSentences.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="flex items-center justify-center h-8 w-8 rounded-full border border-emerald-300 bg-white hover:bg-emerald-50 transition-colors"
                        aria-label="Next positive sentence"
                      >
                        <ChevronRight className="h-4 w-4 text-emerald-700" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-sm text-slate-600">
                    No positive sentences found
                  </p>
                </div>
              )}
            </div>

            {/* Negative Column - Carousel */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-rose-900 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Most Negative Sentences
                </h3>
                {negativeSentences.length > 0 && (
                  <span className="text-xs text-rose-700 font-medium">
                    {negativeIndex + 1} of {negativeSentences.length}
                  </span>
                )}
              </div>
              {negativeSentences.length > 0 ? (
                <div className="relative">
                  <SentenceCard
                    sentence={negativeSentences[negativeIndex]}
                    type="negative"
                  />
                  {negativeSentences.length > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <button
                        onClick={() =>
                          setNegativeIndex((prev) =>
                            prev === 0 ? negativeSentences.length - 1 : prev - 1
                          )
                        }
                        className="flex items-center justify-center h-8 w-8 rounded-full border border-rose-300 bg-white hover:bg-rose-50 transition-colors"
                        aria-label="Previous negative sentence"
                      >
                        <ChevronLeft className="h-4 w-4 text-rose-700" />
                      </button>
                      <div className="flex gap-1.5">
                        {negativeSentences.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setNegativeIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === negativeIndex
                                ? "w-6 bg-rose-600"
                                : "w-2 bg-rose-300 hover:bg-rose-400"
                            }`}
                            aria-label={`Go to negative sentence ${idx + 1}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          setNegativeIndex((prev) =>
                            prev === negativeSentences.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="flex items-center justify-center h-8 w-8 rounded-full border border-rose-300 bg-white hover:bg-rose-50 transition-colors"
                        aria-label="Next negative sentence"
                      >
                        <ChevronRight className="h-4 w-4 text-rose-700" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-sm text-slate-600">
                    No negative sentences found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
