"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import sigmund_logo from "../../../../public/Sigmund Window.png";

import { intPsychTheme } from "../theme";

interface LinearGaugeProps {
  /** Score from 0 to 100 */
  score: number;
  /** Whether to animate the score on mount */
  animate?: boolean;
  name?: string;
  /** Whether the gauge is in a loading state */
  isLoading?: boolean;
}

/**
 * Gets a color based on the score (0-100)
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
 * Gets Sigmund's descriptive label for the score
 */
const getSigmundMessage = (
  score: number,
  name: string,
  isLoading?: boolean
): string => {
  if (isLoading) {
    return `I am analyzing the emotional tone of ${name}'s entry...`;
  }
  if (score >= 70) {
    return `${name}'s words are charged with positivity!`;
  } else if (score >= 50) {
    return `There's a wonderful sense of balance in ${name}'s writing.`;
  } else if (score >= 30) {
    return `I detect a complex mix of feelings in ${name}'s words.`;
  } else {
    return `${name}'s reflections carry a weight of heavy emotions.`;
  }
};

export default function LinearGauge({
  score,
  animate = true,
  name = "Patient",
  isLoading = false,
}: LinearGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const targetScore = score;

  useEffect(() => {
    if (!animate) {
      setDisplayScore(targetScore);
      return;
    }

    const duration = 1000;
    const startTime = Date.now();
    const startScore = 0;
    const endScore = targetScore;

    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
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

  const scoreColor = getScoreColor(score);
  const message = getSigmundMessage(score, name, isLoading);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3">
        {/* Sigmund Logo Container */}
        <div className="flex-shrink-0 relative w-16 h-16 rounded-full overflow-hidden border-2 border-stone-200 bg-white shadow-sm z-10 transition-transform hover:scale-105">
          <Image
            src={sigmund_logo}
            alt="Sigmund"
            fill
            className="object-cover"
          />
        </div>

        {/* Speech Bubble and Score Container */}
        <div className="flex-1 flex items-center gap-6">
          {/* Speech Bubble */}
          <div className="relative bg-white border-2 border-stone-200 border-b-4 p-4 rounded-2xl ml-1 flex-1">
            {/* Improved Bubble Tail */}
            <div
              className="absolute left-[-10px] top-4 w-4 h-4 bg-white border-l-2 border-b-2 border-stone-200 rotate-45"
              style={{ borderRadius: "0 0 0 2px" }}
            />

            <p className="text-[#1c1917] font-medium text-base leading-snug relative z-10">
              {message}
            </p>
          </div>

          {/* Index Outside Bubble */}
          <div className="flex flex-col items-end justify-center min-w-[80px]">
            <div className="flex items-baseline gap-0.5">
              <span
                className="text-4xl font-bold tracking-tight"
                style={{ color: scoreColor }}
              >
                {isLoading ? "-" : displayScore}
              </span>
              {!isLoading && (
                <span className="text-stone-400 text-sm font-bold">/100</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-3 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
        <motion.div
          initial={{ width: 0 }}
          animate={
            isLoading
              ? {
                  width: ["0%", "100%", "0%"],
                  x: ["-100%", "100%", "100%"],
                }
              : { width: `${score}%`, x: 0 }
          }
          transition={
            isLoading
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : { duration: 1, ease: [0.22, 1, 0.36, 1] }
          }
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            backgroundColor: scoreColor,
            boxShadow: `0 0 8px ${scoreColor}40`,
            opacity: isLoading ? 0.3 : 1,
            width: isLoading ? "100%" : `${score}%`,
          }}
        />

        {/* Subtle markers */}
        <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-10">
          <div className="h-full w-px bg-stone-400" />
          <div className="h-full w-px bg-stone-400" />
          <div className="h-full w-px bg-stone-400" />
          <div className="h-full w-px bg-stone-400" />
          <div className="h-full w-px bg-stone-400" />
        </div>
      </div>
    </div>
  );
}
