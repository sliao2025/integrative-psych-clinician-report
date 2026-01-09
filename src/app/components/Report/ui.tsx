"use client";
import React from "react";
import { intPsychTheme } from "../theme";
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
  Copy,
  Check,
  Loader2,
  Pencil,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";

const dm_serif = DM_Serif_Text({
  subsets: ["latin"],
  weight: ["400"],
});

export const cx = (...c: any[]) => c.filter(Boolean).join(" ");

// Copy to clipboard button component
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [tooltipPosition, setTooltipPosition] = React.useState({
    top: 0,
    left: 0,
  });
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const updateTooltipPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 36, // Position above button
        left: rect.left + rect.width / 2, // Center horizontally
      });
    }
  };

  const handleMouseEnter = () => {
    updateTooltipPosition();
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleCopy}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative flex items-center justify-center h-7 w-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all cursor-pointer"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-700" />
        )}
      </button>

      {/* Tooltip rendered at root level with fixed positioning */}
      {showTooltip && (
        <div
          className="fixed pointer-events-none transition-opacity z-[9999]"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div
            className="px-2.5 py-1.5 text-white text-[11px] rounded-md whitespace-nowrap shadow-lg relative"
            style={{ backgroundColor: intPsychTheme.primary }}
          >
            {copied ? "Copied!" : "Copy"}
            <span
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
              style={{ backgroundColor: intPsychTheme.primary }}
            ></span>
          </div>
        </div>
      )}
    </>
  );
}

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
        "group overflow-hidden relative block w-full break-inside-avoid rounded-2xl bg-white p-4 sm:p-6 text-left transition-all duration-300",
        "border border-slate-200 border-b-4",
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
  src,
  className,
}: {
  data?: any;
  fieldName?: string;
  label?: string;
  src?: string;
  className?: string;
}) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [playbackRate, setPlaybackRate] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isBuffering, setIsBuffering] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  // Determine source
  const finalSrc = React.useMemo(() => {
    if (src) return src;
    if (data && fieldName) {
      const fileName = data[fieldName]?.audio?.fileName;
      if (fileName) {
        return `/api/audio?fileName=${encodeURIComponent(fileName)}`;
      }
    }
    return "";
  }, [src, data, fieldName]);

  // Determine transcription
  const transcription = React.useMemo(() => {
    if (!data || !fieldName) return null;
    const field = data[fieldName];
    // Check likely paths for transcription
    if (typeof field?.audio?.transcription === "string")
      return field.audio.transcription;
    if (typeof field?.audio?.transcription?.text === "string")
      return field.audio.transcription.text;
    if (typeof field?.transcription === "string") return field.transcription;
    return null;
  }, [data, fieldName]);

  // Handle full download for seeking support
  React.useEffect(() => {
    if (!finalSrc) return;

    let active = true;
    let objUrl: string | null = null;
    const audio = audioRef.current;

    const fetchAudio = async () => {
      try {
        setIsLoading(true);
        // Reset state
        setCurrentTime(0);
        setDuration(0);

        const res = await fetch(finalSrc);
        if (!res.ok) throw new Error("Failed to load audio");

        const blob = await res.blob();
        if (!active) return;

        objUrl = URL.createObjectURL(blob);
        if (audio) {
          audio.src = objUrl;
          audio.load();
        }
      } catch (err) {
        console.error("Error loading audio:", err);
        setIsLoading(false);
      }
    };

    fetchAudio();

    return () => {
      active = false;
      if (objUrl) {
        URL.revokeObjectURL(objUrl);
      }
      if (audio) {
        audio.src = "";
      }
    };
  }, [finalSrc]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      const d = audio.duration;
      // If duration is Infinity (common with webm), we can try to fix strictly if we used a library,
      // but usually full download helps browser determine it, or we treat it as unknown.
      if (Number.isFinite(d)) {
        setDuration(d);
      } else {
        // Fallback: we might be able to get it from the blob size if CBR, but for VBR it's hard.
        // We'll leave it as 0 or Infinity for now, handled by validDuration check.
        // Sometimes setting currentTime to a huge number and back triggers calculation, but that causes playback glitches.
        setDuration(0);
      }
      setIsLoading(false);
    };

    const setAudioTime = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => {
      setIsLoading(false);
      setIsBuffering(false);
    };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("durationchange", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("durationchange", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("ended", onEnded);
    };
  }, [isDragging]);

  if (!finalSrc) return null;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
  };

  const handleSeekStart = () => {
    setIsDragging(true);
  };

  const handleSeekEnd = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>
  ) => {
    setIsDragging(false);
    const time = Number((e.currentTarget as HTMLInputElement).value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Specific handler for mouse up / touch end to commit the change
  const onCommitMove = (e: any) => {
    setIsDragging(false);
    const time = Number(e.target.value);
    if (audioRef.current && Number.isFinite(time)) {
      audioRef.current.currentTime = time;
    }
  };

  const cycleSpeed = () => {
    const rates = [1, 1.25, 1.5, 1.75, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time) || time === 0) return "--:--";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const showLoading = isLoading || isBuffering;
  const validDuration = Number.isFinite(duration) ? duration : 0;

  return (
    <div className={cx("flex flex-col gap-2 rounded-2xl bg-white", className)}>
      <audio
        ref={audioRef}
        // src removed here as it is managed by useEffect
        preload="metadata"
        onLoadStart={() => setIsLoading(true)}
      />

      <div className="flex items-center gap-4">
        {/* Play Button */}
        <button
          onClick={togglePlay}
          // Only disable if we are strictly loading the file (duration might still be 0 if unknown)
          disabled={isLoading}
          className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-b-4 text-white hover:translate-y-[1px] active:translate-y-[2px] active:border-b-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: intPsychTheme.secondary,
            borderColor: intPsychTheme.secondaryDark,
          }}
        >
          {showLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="h-6 w-6 fill-current ml-1" />
          )}
        </button>

        {/* Controls */}
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>
              {formatTime(currentTime)} / {formatTime(validDuration)}
            </span>
            <button
              onClick={cycleSpeed}
              className="rounded-md px-1.5 py-0.5 hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
            >
              {playbackRate}x
            </button>
          </div>

          <div className="group relative flex h-5 items-center">
            {/* Background Track */}
            <div className="absolute h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full transition-all duration-100 ease-linear"
                style={{
                  width: `${
                    validDuration > 0 ? (currentTime / validDuration) * 100 : 0
                  }%`,
                  backgroundColor: intPsychTheme.secondary,
                }}
              />
            </div>

            {/* Input Range */}
            <input
              type="range"
              min={0}
              max={validDuration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeekChange}
              onMouseDown={handleSeekStart}
              onMouseUp={onCommitMove}
              onTouchStart={handleSeekStart}
              onTouchEnd={onCommitMove}
              disabled={validDuration === 0 && !isLoading}
              className="absolute z-20 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />

            {/* Visible Thumb */}
            <div
              className="pointer-events-none absolute z-10 h-4 w-4 rounded-full border-2 bg-white shadow transition-transform duration-100 ease-linear group-hover:scale-110"
              style={{
                left: `${
                  validDuration > 0 ? (currentTime / validDuration) * 100 : 0
                }%`,
                borderColor: intPsychTheme.secondary,
                transform: `translateX(-50%)`,
                opacity: validDuration > 0 ? 1 : 0,
              }}
            />
          </div>
        </div>
      </div>

      {transcription && (
        <div className="relative mt-2 py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Transcription
              </h4>
            </div>
            <CopyButton text={transcription} />
          </div>
          <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
            {transcription}
          </p>
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
        "rounded-xl border border-slate-200 flex flex-col overflow-hidden",
        className
      )}
    >
      {/* Header with dark background */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex-shrink-0">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      </div>

      {/* Scrollable content area */}
      <div className="relative flex-1 min-h-0 p-4">
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

export function SentimentChart({
  data,
  height = 250,
  onSliceClick,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
  onSliceClick?: (name: string) => void;
}) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined
  );

  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  // Custom label render function for external labels
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
    if (percent === 0) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-[13px] text-slate-700 font-medium"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div
      style={{ width: "100%", height }}
      className="relative flex items-center justify-center font-medium text-slate-700"
      onMouseLeave={onPieLeave}
    >
      {/* Always visible center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
        <span className="text-sm font-semibold tracking-wider uppercase text-slate-700">
          Sentiment
        </span>
      </div>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            // @ts-expect-error: Recharts types might be outdated, activeIndex is valid
            activeIndex={activeIndex}
            activeShape={(props: any) => {
              const {
                cx,
                cy,
                innerRadius,
                outerRadius,
                startAngle,
                endAngle,
                fill,
              } = props;
              return (
                <Sector
                  cx={cx}
                  cy={cy}
                  innerRadius={innerRadius}
                  outerRadius={outerRadius + 6}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  fill={fill}
                  fillOpacity={0.65}
                  stroke={fill}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  cornerRadius={2}
                />
              );
            }}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            onClick={(data) => onSliceClick?.(data.name)}
            paddingAngle={4}
            cornerRadius={2}
            stroke="none"
            className="cursor-pointer focus:outline-none"
            label={renderCustomizedLabel}
            labelLine={false}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                fillOpacity={0.5}
                stroke={entry.color}
                strokeWidth={2}
                strokeLinejoin="round"
                className="transition-all duration-300 ease-out"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value} / ${total} sentences`,
              name,
            ]}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
              color: "#334155",
              padding: "8px 12px",
            }}
            itemStyle={{ color: "#334155", padding: 0 }}
            cursor={false}
            isAnimationActive={false}
            wrapperStyle={{ pointerEvents: "none", outline: "none" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HealthBar({
  level,
  max = 4,
  className,
}: {
  level: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={cx("flex gap-1", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={cx(
            "h-1.5 w-6 rounded-full transition-colors",
            i < level ? "bg-emerald-500" : "bg-slate-200"
          )}
        />
      ))}
    </div>
  );
}
