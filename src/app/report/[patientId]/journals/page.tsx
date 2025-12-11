"use client";

import { useState, useEffect, use } from "react";
import {
  BookOpen,
  Calendar,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { intPsychTheme } from "@/app/components/theme";
import { DM_Serif_Text, DM_Sans } from "next/font/google";
import Drawer from "@/app/components/Drawer";

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });
const dm_sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

interface JournalEntry {
  id: string;
  content: string;
  mood: number;
  sentimentResult: any;
  createdAt: string;
  updatedAt: string;
}

export default function JournalsPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

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
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 8) return <Smile className="w-5 h-5 text-emerald-500" />;
    if (mood >= 5) return <Meh className="w-5 h-5 text-amber-500" />;
    return <Frown className="w-5 h-5 text-rose-500" />;
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (mood >= 5) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getSentimentLabel = (sentimentResult: any) => {
    if (!sentimentResult) return null;
    const label = sentimentResult.label || sentimentResult.sentiment;
    if (!label) return null;

    const colors: Record<string, string> = {
      positive: "text-emerald-600",
      negative: "text-rose-600",
      neutral: "text-slate-600",
    };

    const icons: Record<string, React.JSX.Element> = {
      positive: <TrendingUp className="w-4 h-4" />,
      negative: <TrendingDown className="w-4 h-4" />,
      neutral: <Meh className="w-4 h-4" />,
    };

    return (
      <div
        className={`flex items-center gap-1.5 text-xs font-medium ${
          colors[label.toLowerCase()] || "text-slate-600"
        }`}
      >
        {icons[label.toLowerCase()]}
        {label}
      </div>
    );
  };

  const truncateText = (text: string, lines: number = 3) => {
    const allLines = text.split("\n");
    if (allLines.length <= lines) {
      return { preview: text, isTruncated: false };
    }
    const preview = allLines.slice(0, lines).join("\n");
    return { preview: preview + "...", isTruncated: true };
  };

  return (
    <div
      className={`mx-auto max-w-[1400px] px-4 sm:px-6 pb-20 ${dm_sans.className}`}
    >
      <div className="mt-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
            <BookOpen
              className="w-6 h-6"
              style={{ color: intPsychTheme.primary }}
            />
          </div>
          <div>
            <h2
              className={`${dm_serif.className} text-3xl font-normal`}
              style={{ color: intPsychTheme.primary }}
            >
              Patient Journals
            </h2>
            <p className="text-sm text-slate-500">
              View patient journal entries and mood tracking
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 border-b-4 overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div
                style={{ borderTopColor: intPsychTheme.secondary }}
                className="rounded-full h-12 w-12 mx-auto border-4 border-gray-300 border-t-4 border-t-transparent animate-spin"
              ></div>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-rose-400" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 mb-1">
                Error loading entries
              </h4>
              <p className="text-slate-500">{error}</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 mb-1">
                No journal entries found
              </h4>
              <p className="text-slate-500">
                Journal entries will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {entries.map((entry) => {
                const { preview, isTruncated } = truncateText(entry.content);
                return (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className="w-full text-left p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Header: Date, Mood, Sentiment */}
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600 font-medium">
                            {formatDate(entry.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {entry.sentimentResult &&
                            getSentimentLabel(entry.sentimentResult)}

                          <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getMoodColor(
                              entry.mood
                            )}`}
                          >
                            {getMoodIcon(entry.mood)}
                            <span className="text-xs font-bold">
                              Mood: {entry.mood}/10
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="prose prose-sm max-w-none">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap line-clamp-3">
                          {preview}
                        </p>
                        {isTruncated && (
                          <p
                            className={`text-sm text-[${intPsychTheme.accent}] font-medium mt-2`}
                          >
                            Click to read more →
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Drawer for full content */}
      <Drawer
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title={selectedEntry ? formatDate(selectedEntry.createdAt) : ""}
      >
        {selectedEntry && (
          <div className="space-y-6">
            {/* Mood and Sentiment Info */}
            <div className="flex items-center gap-4 flex-wrap pb-4 border-b border-slate-200">
              {selectedEntry.sentimentResult && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Sentiment:</span>
                  {getSentimentLabel(selectedEntry.sentimentResult)}
                </div>
              )}

              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getMoodColor(
                  selectedEntry.mood
                )}`}
              >
                {getMoodIcon(selectedEntry.mood)}
                <span className="text-xs font-bold">
                  Mood: {selectedEntry.mood}/10
                </span>
              </div>
            </div>

            {/* Full Content */}
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedEntry.content}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
