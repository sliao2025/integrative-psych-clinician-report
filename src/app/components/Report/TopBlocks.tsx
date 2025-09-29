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
  console.log(data.dob);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {patientDbData.image ? (
            <img
              src={patientDbData.image}
              alt={`${data.firstName}'s Profile Photo`}
              className="h-12 w-12 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white text-lg font-semibold">
              {data.firstName?.[0] || "P"}
            </div>
          )}

          <div>
            <div
              className={`text-3xl ${dm_serif.className} font-semibold tracking-tight text-slate-900`}
              style={{ color: intPsychTheme.primary }}
            >
              {data.firstName} {data.lastName}
            </div>
            <div className="mt-0.5 text-[13px] text-slate-600">
              Age {data.age} • {data.pronouns?.[0]?.label}
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <User
                className="h-4 w-4 "
                style={{ color: intPsychTheme.primary }}
              />
              <KV label="Sex" value="Male" truncate={false} />
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays
                className="h-4 w-4 "
                style={{ color: intPsychTheme.primary }}
              />
              <KV
                label="DOB"
                value={data.dob ? data.dob : "—"}
                truncate={false}
              />
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon
                className="h-4 w-4 "
                style={{ color: intPsychTheme.primary }}
              />
              <KV label="Phone" value={data.contactNumber} truncate={false} />
            </div>
            <div className="flex items-center gap-2">
              <MailIcon
                className="h-4 w-4 "
                style={{ color: intPsychTheme.primary }}
              />
              <KV label="Email" value={data.email} truncate={false} />
            </div>
          </div>
          <button
            type="button"
            onClick={onOpen}
            className="cursor-pointer ml-6 h-1/3 rounded-lg border border-slate-200 px-2 py-1 text-[12px] font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200"
          >
            <FaExpand className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
