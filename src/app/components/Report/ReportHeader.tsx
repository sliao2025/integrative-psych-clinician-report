"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Check,
  PanelLeft,
  FileDown,
} from "lucide-react";
import { intPsychTheme } from "../theme";
import { useWeather } from "@/app/lib/hooks/useWeather";
import WeatherWidget from "../WeatherWidget";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function ReportHeader({ patientId }: { patientId?: string }) {
  const { data: session } = useSession();
  const { weather } = useWeather();
  const router = useRouter();
  const { toggleMobile } = useSidebar();
  const [loadingSentiment, setLoadingSentiment] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [successSentiment, setSuccessSentiment] = useState(false);
  const [successSummary, setSuccessSummary] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [successPdf, setSuccessPdf] = useState(false);

  const userEmail = session?.user?.email || "";
  const isSliao = userEmail === "sliao@psych-nyc.com";
  const isDgrayOrYherbst =
    userEmail === "dgray@psych-nyc.com" ||
    userEmail === "yherbst@psych-nyc.com";

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

  const handleDownloadPdf = async () => {
    if (!patientId || loadingPdf) return;
    setLoadingPdf(true);
    setSuccessPdf(false);
    try {
      const res = await fetch(`/api/pdf/download?userId=${patientId}`);
      if (!res.ok) throw new Error("Failed to download PDF");

      // Extract filename from Content-Disposition header
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = "Intake_Report.pdf";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessPdf(true);
      setTimeout(() => setSuccessPdf(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPdf(false);
    }
  };

  const DownloadButton = ({ showLabel = true }: { showLabel?: boolean }) => (
    <div className="relative group">
      <button
        onClick={handleDownloadPdf}
        disabled={loadingPdf || successPdf}
        className={`group flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all disabled:opacity-100 ${
          successPdf
            ? "bg-green-50 text-green-600"
            : "text-slate-600 hover:bg-slate-50 hover:text-[#0072ce]"
        }`}
        title="Download Intake PDF"
      >
        {loadingPdf ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : successPdf ? (
          <Check className="h-4 w-4" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
        {showLabel && (
          <span className="hidden sm:inline">
            {successPdf ? "Downloaded" : "Download Intake"}
          </span>
        )}
      </button>
      {/* Tooltip - only show on small screens when label is hidden */}
      {!showLabel && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none sm:hidden">
          Download Intake
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Mobile Menu Toggle + Back Button */}
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Mobile sidebar toggle - only visible below sm breakpoint */}
          <button
            onClick={toggleMobile}
            className="sm:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Open sidebar"
          >
            <PanelLeft
              className="h-5 cursor-pointer w-5"
              style={{ color: intPsychTheme.primary }}
            />
          </button>

          <Link href="/search" className="group z-10 shrink-0">
            <span
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-slate-50"
              style={{ color: intPsychTheme.primary }}
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Back to Search</span>
              <span className="sm:hidden">Search</span>
            </span>
          </Link>
        </div>

        {/* Right: Actions & Weather */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* For sliao@psych-nyc.com - show refresh buttons and download after Refresh Summary (desktop only) */}
          {patientId && isSliao && (
            <div className="hidden sm:flex items-center gap-2 border-r border-slate-200 pr-6 mr-2">
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
              <DownloadButton showLabel={true} />
            </div>
          )}

          {/* For sliao - mobile only download button */}
          {patientId && isSliao && (
            <div className="flex sm:hidden items-center">
              <DownloadButton showLabel={false} />
            </div>
          )}

          {/* For dgray@psych-nyc.com and yherbst@psych-nyc.com - show download button to the left of weather */}
          {patientId && isDgrayOrYherbst && (
            <div className="flex items-center">
              <DownloadButton showLabel={true} />
            </div>
          )}

          <WeatherWidget weather={weather} />
        </div>
      </div>
    </header>
  );
}
