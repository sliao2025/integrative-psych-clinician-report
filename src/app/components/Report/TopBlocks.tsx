// app/report/components/TopBlocks.tsx
"use client";
import {
  CalendarDays,
  Mail as MailIcon,
  Phone as PhoneIcon,
  User,
} from "lucide-react";
import { KV } from "./ui";
import { ProfileJson } from "../types";
import React from "react";
import { DM_Serif_Text } from "next/font/google";
import { intPsychTheme } from "../theme";
import { FaExpand } from "react-icons/fa";

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
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
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
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-indigo-600 text-white text-base sm:text-lg font-semibold flex-none">
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
                label="Sex"
                value="Male"
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
                label="Phone"
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
                label="Email"
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
        className="absolute top-3 right-3 inline-flex items-center justify-center h-6 w-8 rounded-lg border border-slate-200 bg-white/70 backdrop-blur-sm text-slate-700 hover:bg-slate-100 active:bg-slate-200"
        aria-label="Expand demographics"
      >
        <FaExpand className="h-3 w-3" />
      </button>
    </div>
  );
}
