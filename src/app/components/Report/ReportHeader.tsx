"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, RefreshCw, Check } from "lucide-react";
import { intPsychTheme } from "../theme";
import { useWeather } from "@/app/lib/hooks/useWeather";
import WeatherWidget from "../WeatherWidget";

export default function ReportHeader({ patientId }: { patientId?: string }) {
  const { weather } = useWeather();
  const router = useRouter();
  const [loadingSentiment, setLoadingSentiment] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [successSentiment, setSuccessSentiment] = useState(false);
  const [successSummary, setSuccessSummary] = useState(false);

  const handleRefreshSentiment = async () => {
    if (!patientId || loadingSentiment) return;
    setLoadingSentiment(true);
    setSuccessSentiment(false);
    try {
      const res = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: patientId }),
      });
      if (!res.ok) throw new Error("Failed to analyze sentiment");
      setSuccessSentiment(true);
      setTimeout(() => setSuccessSentiment(false), 3000);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSentiment(false);
    }
  };

  const handleRefreshSummary = async () => {
    if (!patientId || loadingSummary) return;
    setLoadingSummary(true);
    setSuccessSummary(false);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: patientId }),
      });
      if (!res.ok) throw new Error("Failed to summarize");
      setSuccessSummary(true);
      setTimeout(() => setSuccessSummary(false), 3000);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="px-6 h-16 flex items-center justify-between">
        {/* Left: Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/search" className="group z-10 shrink-0">
            <span
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-slate-50"
              style={{ color: intPsychTheme.primary }}
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to Search
            </span>
          </Link>
        </div>

        {/* Right: Actions & Weather */}
        <div className="flex items-center gap-6">
          {patientId && (
            <div className="flex items-center gap-2 border-r border-slate-200 pr-6 mr-2">
              <button
                onClick={handleRefreshSentiment}
                disabled={loadingSentiment || successSentiment}
                className={`group flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all disabled:opacity-100 ${
                  successSentiment
                    ? "bg-green-50 text-green-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0072ce]"
                }`}
                title="Recompute Sentiment Analysis"
              >
                {loadingSentiment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : successSentiment ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                  {successSentiment ? "Updated" : "Refresh Sentiment"}
                </span>
              </button>
              <button
                onClick={handleRefreshSummary}
                disabled={loadingSummary || successSummary}
                className={`group flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all disabled:opacity-100 ${
                  successSummary
                    ? "bg-green-50 text-green-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0072ce]"
                }`}
                title="Recompute Summary"
              >
                {loadingSummary ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : successSummary ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                  {successSummary ? "Updated" : "Refresh Summary"}
                </span>
              </button>
            </div>
          )}

          <WeatherWidget weather={weather} />
        </div>
      </div>
    </header>
  );
}
