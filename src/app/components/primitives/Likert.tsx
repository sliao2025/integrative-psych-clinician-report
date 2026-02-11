"use client";

import React from "react";
import { intPsychTheme, sigmundTheme, theme } from "../theme";

type Props = {
  id?: string;
  label?: string | React.ReactNode;
  value: string;
  onChange: (v: string | number) => void;
  options?: { key: string | number; label: string | number }[];
};

const Likert: React.FC<Props> = ({ id, label, value, onChange, options }) => {
  return (
    <div className="rounded-2xl border border-stone-300 p-4 bg-stone-50">
      <div className={`text-stone-800 ${label ? "mb-3" : "mb-0"}`}>{label}</div>
      <div className="grid grid-cols-2  gap-2">
        {options?.map((o) => {
          // console.log(o.key, "key");
          // console.log(value, "value");
          return (
            <button
              key={o.key}
              onClick={() => onChange(o.key)}
              className={`rounded-xl border border-b-4 px-3 py-2 text-sm transition ${
                value === o.key
                  ? "border-transparent border-b-black/20 text-white"
                  : "border-stone-300 text-stone-700 hover:border-stone-400"
              }`}
              style={
                value === o.key
                  ? {
                      background: `linear-gradient(90deg, ${sigmundTheme.primary}, ${sigmundTheme.accent})`,
                    }
                  : {}
              }
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Likert;
