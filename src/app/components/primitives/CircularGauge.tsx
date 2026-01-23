"use client";

import React, { useEffect, useState } from "react";

import { intPsychTheme, sigmundTheme } from "../theme";

interface CircularGaugeProps {
  /** Score from 0 to 100 */
  score: number;
  /** Size of the component in pixels */
  size?: number;
  /** Whether to animate the score on mount */
  animate?: boolean;
  /** Optional label to display below the gauge */
  label?: string;
  /** Whether to show the label below the gauge */
  showLabel?: boolean;
  /** Whether the gauge is in a loading state */
  isLoading?: boolean;
}

/**
 * Gets a color based on the score (0-100)
 * Lower scores are more muted, higher scores are more vibrant
 */
const getScoreColor = (score: number): string => {
  if (score >= 70) {
    return "#16a34a"; // Green - positive
  } else if (score >= 50) {
    return "#84cc16"; // Blue - neutral-positive
  } else if (score >= 30) {
    return intPsychTheme.secondary; // Orange - neutral
  } else {
    return intPsychTheme.alternate; // Rose - needs attention
  }
};

/**
 * Gets a descriptive label for the score
 */
const getScoreLabel = (score: number): string => {
  if (score >= 70) {
    return "Positive";
  } else if (score >= 50) {
    return "Balanced";
  } else if (score >= 30) {
    return "Mixed";
  } else {
    return "Negative";
  }
};

export default function CircularGauge({
  score,
  size = 160,
  animate = true,
  label,
  showLabel = true,
  isLoading = false,
}: CircularGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const targetScore = score;

  // Animation effect
  useEffect(() => {
    if (!animate) {
      setDisplayScore(targetScore);
      return;
    }

    // Animate from 0 to target score
    const duration = 1000; // 1 second
    const startTime = Date.now();
    const startScore = 0;
    const endScore = targetScore;

    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentScore = Math.round(
        startScore + (endScore - startScore) * eased
      );
      setDisplayScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animateScore);
      }
    };

    requestAnimationFrame(animateScore);
  }, [targetScore, animate]);

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Arc goes from 135 degrees (bottom-left) to 405 degrees (bottom-right) = 270 degrees total
  const startAngle = 135;
  const endAngle = 405;
  const totalArc = endAngle - startAngle; // 270 degrees

  // Calculate the arc for the progress
  const progressAngle = startAngle + (displayScore / 100) * totalArc;

  // Convert degrees to radians for calculations
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  // Calculate arc path
  const describeArc = (startDegrees: number, endDegrees: number): string => {
    const startRad = toRadians(startDegrees);
    const endRad = toRadians(endDegrees);

    const startX = center + radius * Math.cos(startRad);
    const startY = center + radius * Math.sin(startRad);
    const endX = center + radius * Math.cos(endRad);
    const endY = center + radius * Math.sin(endRad);

    const largeArcFlag = endDegrees - startDegrees > 180 ? 1 : 0;

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  const scoreColor = getScoreColor(displayScore);
  const scoreLabel = label || `${getScoreLabel(displayScore)} Tone`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size * 0.7 }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
          style={{ marginTop: -size * 0.15 }}
        >
          {/* Background arc */}
          <path
            d={describeArc(startAngle, endAngle)}
            fill="none"
            stroke={sigmundTheme.border}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress arc */}
          {!isLoading && displayScore > 0 && (
            <path
              d={describeArc(startAngle, progressAngle)}
              fill="none"
              stroke={scoreColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
              }}
            />
          )}
        </svg>

        {/* Score display in center */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ marginTop: size * 0.08 }}
        >
          <span
            className="font-bold text-[#1c1917] leading-none"
            style={{ fontSize: size * 0.32 }}
          >
            {isLoading ? "-" : displayScore}
          </span>
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <div className="flex items-center gap-2 mt-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: scoreColor }}
          />
          <span className="text-sm font-medium text-stone-500">
            {scoreLabel}
          </span>
        </div>
      )}
    </div>
  );
}
