"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { intPsychTheme } from "../theme";
import { useWeather } from "@/app/lib/hooks/useWeather";
import WeatherWidget from "../WeatherWidget";

export default function ReportHeader() {
  const { weather } = useWeather();

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

        {/* Right: Weather */}
        <div className="flex items-center gap-6">
          <WeatherWidget weather={weather} />
        </div>
      </div>
    </header>
  );
}
