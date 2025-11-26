// src/app/components/decor/Garden.tsx

import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import VinesTop from "./VinesTop";
import MeadowRow from "./MeadowRow";
import FlowerCluster from "./FlowerCluster";
import { intPsychTheme } from "../theme";

/* ------------------ Main exported frames ------------------ */

function GardenFrame({ bloom = 0 }: { bloom?: number }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Multi-layered decorative garden with broad coverage and varied sway speeds.
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden={true}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* soft, taller ground gradient across bottom ~45% of screen */}
      <div className="absolute inset-x-0 bottom-0" />

      {/* Background layer: large, lighter clusters spread tall for coverage */}
      <div className="absolute inset-x-0 bottom-0 h-[52%] opacity-60">
        <div className="mx-auto max-w-7xl px-2 space-y-6">
          <MeadowRow
            count={14}
            scale={1.2}
            progress={bloom}
            colors={[intPsychTheme.accent, "#cfe8ff", "#8ec5ff"]}
            seed="row-bg-1-v2"
          />
          <MeadowRow
            count={16}
            flip
            scale={2.5}
            progress={bloom}
            colors={[intPsychTheme.alternate, intPsychTheme.accent, "#bfd9f2"]}
            seed="row-bg-2-v2"
          />
        </div>
      </div>

      {/* Midground layer */}
      <div className="absolute inset-x-0 bottom-0 h-[46%] opacity-80">
        <div className="mx-auto max-w-6xl px-3 space-y-4">
          <MeadowRow
            count={12}
            scale={1.5}
            progress={bloom}
            colors={[intPsychTheme.secondary, "#ffd7a3", "#ffbe6b"]}
            seed="row-mid-1-v2"
          />
          <MeadowRow
            count={9}
            flip
            scale={2.75}
            progress={bloom}
            colors={[
              intPsychTheme.secondary,
              intPsychTheme.alternate,
              "#ff9966",
            ]}
            seed="row-mid-2-v2"
          />
        </div>
      </div>

      {/* Foreground layer: densest at the base for a lush look */}
      <div className="absolute inset-x-0 bottom-0 h-[34%] opacity-100">
        <div className="mx-auto max-w-5xl px-4 space-y-3">
          <MeadowRow
            count={10}
            scale={3}
            progress={bloom}
            colors={[
              intPsychTheme.primary,
              intPsychTheme.secondary,
              intPsychTheme.accent,
            ]}
            seed="row-fg-1-v2"
          />
          <MeadowRow
            count={11}
            flip
            scale={3.5}
            progress={bloom}
            colors={[
              intPsychTheme.accent,
              intPsychTheme.alternate,
              intPsychTheme.secondary,
            ]}
            seed="row-fg-2-v2"
          />
          <MeadowRow
            count={12}
            flip
            scale={4}
            progress={bloom}
            colors={[
              intPsychTheme.alternate,
              intPsychTheme.primary,
              intPsychTheme.accent,
            ]}
            seed="row-fg-3-v2"
          />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[10%] opacity-100">
        <div className="mx-auto max-w-5xl px-4 space-y-3">
          <MeadowRow
            count={10}
            scale={4.5}
            progress={bloom}
            colors={[
              intPsychTheme.primary,
              intPsychTheme.secondary,
              intPsychTheme.accent,
            ]}
            seed="row-bot-1-v2"
          />
          <MeadowRow
            count={10}
            scale={5.5}
            progress={bloom}
            colors={[
              intPsychTheme.primary,
              intPsychTheme.secondary,
              intPsychTheme.accent,
            ]}
            seed="row-bot-2-v2"
          />
        </div>
      </div>

      {/* Top accents */}
      {/* <VinesTop /> */}

      <style jsx>{`
        .garden-sway {
          animation: garden-sway 5.6s ease-in-out infinite;
        }
        .sway-slow {
          animation-duration: 6.6s;
        }
        .sway-med {
          animation-duration: 5.2s;
        }
        .sway-fast {
          animation-duration: 4.2s;
        }

        @keyframes garden-sway {
          0%,
          100% {
            transform: translateY(0) rotate(-1.2deg);
          }
          50% {
            transform: translateY(-2px) rotate(1.2deg);
          }
        }

        .garden-drift {
          animation: garden-drift 20s linear infinite;
        }
        @keyframes garden-drift {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(6px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </motion.div>
  );
}

export default memo(GardenFrame);
