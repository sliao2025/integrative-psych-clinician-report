"use client";
import React from "react";
import { intPsychTheme, theme } from "../theme";
import { FaExpand, FaExpandAlt } from "react-icons/fa";
import { DM_Serif_Text } from "next/font/google";
import {
  Pause,
  Play,
  MessageSquareText,
  Languages,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Eye,
} from "lucide-react";

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
  title: React.ReactNode;
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
        "group overflow-hidden relative block w-full break-inside-avoid rounded-2xl border-1 border-slate-300 bg-white backdrop-blur-sm p-3 sm:p-4 text-left transition",
        "transform will-change-transform",
        className
      )}
    >
      {title && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <div
            className={`${dm_serif.className} flex items-center gap-2 text-slate-900 text-md sm:text-base md:text-lg font-semibold tracking-tight leading-snug sm:leading-[1.4]`}
            style={{ color: intPsychTheme.primary }}
          >
            {title}
          </div>
          {onExpand && (
            <button
              type="button"
              onClick={onExpand}
              className="cursor-pointer flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] sm:text-[12px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:bg-slate-200 transition-all hover:shadow"
            >
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">Details</span>
              <Eye className="h-4 w-4" />
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
  backgroundColor,
  showTicker = true,
}: {
  label: string;
  score: number;
  max: number;
  caption?: string;
  backgroundColor?: string;
  showTicker?: boolean;
}) {
  const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
  const v = clamp01(score / max);
  const pct = Math.round(v * 1000) / 10; // one-decimal precision
  const pctClamped = Math.max(0, Math.min(100, pct));
  const isMin = pctClamped === 0;
  const isMax = pctClamped === 100;

  // Default gradient if no backgroundColor provided
  const defaultGradient =
    "linear-gradient(90deg, #b8e7f8ff 0%, #3a9ce2ff 50%, #05539cff 100%)";

  return (
    <div className="flex w-full flex-col">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-lg sm:text-xl font-bold text-slate-700">{label}</p>
        <span className="text-lg sm:text-xl font-bold text-slate-900">
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
            background: backgroundColor || defaultGradient,
          }}
        />

        {/* Ticker at score position */}
        {showTicker && (
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
        )}
      </div>

      {caption && <p className="mt-1 text-[12px] text-slate-500">{caption}</p>}
    </div>
  );
}

export function AudioPlayer({
  data,
  fieldName,
  label,
}: {
  data: any;
  fieldName: string;
  label?: string;
}) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const isSeekingRef = React.useRef(false);

  // Extract data from the fieldName
  const audioData = data[fieldName]?.audio;
  const fileName = audioData?.fileName;
  const transcription = audioData?.transcription;
  const translation = audioData?.translation;

  // Don't render if no file
  if (!fileName) return null;

  // Load audio metadata on mount to get duration
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || audio.src) return;

    setIsLoading(true);
    const url = `/api/audio?fileName=${encodeURIComponent(fileName)}`;
    audio.src = url;
    audio.load();
  }, [fileName]);

  // Smooth progress updates using requestAnimationFrame
  React.useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const updateProgress = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused && !audio.ended) {
        setCurrentTime(audio.currentTime);
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying]);
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err: any) {
      console.error("Error playing audio:", err);
      setError("Failed to play audio");
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    // Only update from timeupdate when not playing and not seeking
    if (audio && !isPlaying && !isSeekingRef.current) {
      setCurrentTime(audio.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
      setIsLoading(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      isSeekingRef.current = true;
      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);

      // Reset seeking flag after a short delay
      setTimeout(() => {
        isSeekingRef.current = false;
      }, 100);
    }
  };

  const handleError = () => {
    setError("Failed to load audio");
    setIsLoading(false);
    setIsPlaying(false);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Check if transcription is being processed
  const isProcessing = !transcription || transcription.trim() === "";
  const hasTranslation = translation && translation.trim() !== "";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
      />

      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          disabled={isLoading}
          className={cx(
            "flex-shrink-0 rounded-full p-2.5 transition-all",
            "border border-slate-200 bg-white shadow-sm",
            "hover:bg-slate-50 hover:shadow-md active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          style={{ color: intPsychTheme.primary }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : isPlaying ? (
            // Pause Icon
            <Pause className="h-4 w-4" />
          ) : (
            // Play Icon
            <Play className="h-4 w-4" />
          )}
        </button>

        {/* Progress and Time */}
        <div className="flex-1 min-w-0">
          {label && (
            <p className="text-[12px] font-medium text-slate-600 mb-1 truncate">
              {label}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono tabular-nums">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, #b8e7f8ff 0%, #3a9ce2ff 50%, #05539cff 100%)",
                  }}
                />
              </div>
              {/* Draggable thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg pointer-events-none transition-opacity"
                style={{
                  left: `calc(${progress}% - 6px)`,
                  opacity: duration ? 1 : 0,
                  background: intPsychTheme.secondary,
                }}
              />
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.0001"
                value={currentTime}
                onChange={handleSeek}
                disabled={!duration}
                className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                style={{ cursor: duration ? "pointer" : "not-allowed" }}
              />
            </div>
            <span className="text-[11px] text-slate-500 font-mono tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {error && <p className="mt-2 text-[11px] text-rose-600">{error}</p>}

      {/* Transcript Display */}
      {isProcessing ? (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start gap-2">
            <MessageSquareText className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Transcription processing...
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {/* Transcription */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <div className="flex items-start gap-2 mb-2">
              <MessageSquareText className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
              <h4 className="text-xs font-semibold text-slate-700">
                {hasTranslation ? "Original Language" : "Transcript"}
              </h4>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              <p className="break-words">{transcription}</p>
            </div>
          </div>

          {/* Translation (if exists) */}
          {hasTranslation && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start gap-2 mb-2">
                <Languages className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <h4 className="text-xs font-semibold text-blue-700">
                  English Translation
                </h4>
              </div>
              <div className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">
                <p className="break-words">{translation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ScrollableBox({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showTopArrow, setShowTopArrow] = React.useState(false);
  const [showBottomArrow, setShowBottomArrow] = React.useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const hasScroll = el.scrollHeight > el.clientHeight;
    if (!hasScroll) {
      setShowTopArrow(false);
      setShowBottomArrow(false);
      return;
    }

    const atTop = el.scrollTop < 10;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;

    setShowTopArrow(!atTop);
    setShowBottomArrow(!atBottom);
  };

  React.useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [children]);

  return (
    <div
      className={cx(
        "rounded-xl border border-slate-200 p-4 flex flex-col",
        className
      )}
    >
      <h4 className="mb-2 text-md font-semibold text-slate-900 flex-shrink-0">
        {title}
      </h4>

      <div className="relative flex-1 min-h-0">
        {/* Top scroll indicator */}
        {showTopArrow && (
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 flex items-start justify-center pointer-events-none">
            <div className="animate-bounce bg-white p-[2px] rounded-full shadow-md">
              <ChevronUp className="h-4 w-4 text-slate-600" />
            </div>
          </div>
        )}

        <div
          ref={scrollRef}
          className="h-full overflow-y-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={checkScroll}
        >
          <div className="whitespace-pre-wrap text-[13px]">
            {children ?? "—"}
          </div>
        </div>

        {/* Bottom scroll indicator */}
        {showBottomArrow && (
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10 flex items-end justify-center pointer-events-none">
            <div className="animate-bounce bg-white p-[2px] rounded-full shadow-md">
              <ChevronDown className="h-4 w-4 text-slate-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
