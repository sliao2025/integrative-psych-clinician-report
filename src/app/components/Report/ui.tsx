"use client";
import React from "react";
import { intPsychTheme, theme } from "../theme";
import { FaExpand, FaExpandAlt } from "react-icons/fa";
import { DM_Serif_Text } from "next/font/google";

const dm_serif = DM_Serif_Text({
  subsets: ["latin"],
  weight: ["400"],
});

export const cx = (...c: any[]) => c.filter(Boolean).join(" ");

export function Backdrop({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
      aria-hidden
    />
  );
}

export function CenterModal({
  title,
  onClose,
  children,
  maxWidth = "max-w-4xl",
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4">
      <Backdrop onClose={onClose} />
      <div className={`relative z-50 w-full ${maxWidth}`}>
        <div className="rounded-xl sm:rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
          <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100">
            <h3
              className={`${dm_serif.className} text-base sm:text-lg font-semibold`}
              style={{ color: intPsychTheme.primary }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="cursor-pointer font-semibold rounded-md px-2 py-1 text-slate-500 hover:bg-red-100"
            >
              ✕
            </button>
          </header>
          <div className="max-h-[80vh] sm:max-h-[75vh] overflow-y-auto p-4 sm:p-6 text-[13px] sm:text-sm leading-relaxed text-slate-700 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Card({
  className,
  children,
  onExpand,
  title,
}: {
  className?: string;
  children: React.ReactNode;
  onExpand?: () => void;
  title?: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "group overflow-hidden relative block w-full break-inside-avoid rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-3 sm:p-4 text-left shadow-sm transition",
        "transform will-change-transform duration-150 ease-out hover:scale-[1.005] sm:hover:scale-[1.01]",
        className
      )}
    >
      {title && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <div
            className={`${dm_serif.className} flex items-center gap-2 text-slate-900 text-md sm:text-base md:text-lg tracking-tight leading-snug sm:leading-[1.4]`}
            style={{ color: intPsychTheme.primary }}
          >
            {title}
          </div>
          {onExpand && (
            <button
              type="button"
              onClick={onExpand}
              className="cursor-pointer rounded-lg border border-slate-200 px-2 py-1 text-[12px] font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200"
            >
              <FaExpand className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "info",
  className,
}: {
  children: React.ReactNode;
  tone?: "success" | "warn" | "danger" | "info";
  className?: string;
}) {
  const map: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warn: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        map[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function KV({
  label,
  value,
  tooltip,
  truncate = true,
  alignRight = true,
  className,
}: {
  label: string;
  value?: React.ReactNode;
  tooltip?: string;
  truncate?: boolean;
  alignRight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex items-baseline justify-between gap-10 py-1.5",
        className
      )}
    >
      <span className="flex text-[12px] font-medium tracking-normal text-slate-500">
        {label}
      </span>
      <span
        title={typeof value === "string" ? tooltip || String(value) : tooltip}
        className={`text-[12px] sm:text-[13px] text-slate-900 ${
          alignRight ? "text-right" : ""
        } ${
          truncate ? "max-w-[12rem] sm:max-w-[18rem] truncate" : "break-words"
        }`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

export function Gauge({
  label,
  score,
  max,
  caption,
}: {
  label: string;
  score: number;
  max: number;
  caption?: string;
}) {
  const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
  const v = clamp01(score / max);
  const pct = Math.round(v * 1000) / 10; // one-decimal precision
  const pctClamped = Math.max(0, Math.min(100, pct));
  const isMin = pctClamped === 0;
  const isMax = pctClamped === 100;

  return (
    <div className="flex w-full flex-col">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[16px] font-bold text-slate-700">{label}</p>
        <span className="text-[16px] font-bold text-slate-700">
          {score}/{max}
        </span>
      </div>

      {/* Track */}
      <div className="relative h-3 w-full rounded-full bg-slate-200/80">
        {/* Filled gradient up to score */}
        <div
          className="h-3 rounded-full"
          style={{
            width: `${pctClamped}%`,
            background:
              "linear-gradient(90deg, #b8e7f8ff 0%, #3a9ce2ff 50%, #05539cff 100%)",
          }}
        />

        {/* Ticker at score position */}
        <div
          className="pointer-events-none rounded-full absolute -top-1 h-5 w-3 bg-white border border-slate-300 shadow-sm"
          style={
            isMax
              ? { right: 0 }
              : isMin
              ? { left: 0 }
              : { left: `calc(${pctClamped}% - 6px)` }
          }
          aria-hidden="true"
        />
      </div>

      {caption && <p className="mt-1 text-[12px] text-slate-500">{caption}</p>}
    </div>
  );
}
