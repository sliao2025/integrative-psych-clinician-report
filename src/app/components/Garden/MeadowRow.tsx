import React, { useMemo, memo } from "react";
import FlowerCluster from "./FlowerCluster";

// Deterministic pseudo-random in [0,1) from an integer key (xorshift-ish)
function rand01(key: number) {
  let x = key >>> 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return (x >>> 0) / 4294967296; // 2^32
}

function MeadowRow({
  count = 8,
  flip = false,
  scale = 1,
  colors = ["#f43f5e", "#e11d48", "#fb7185"],
  progress = 0,
  seed,
}: {
  count?: number;
  flip?: boolean;
  scale?: number;
  colors?: string[];
  progress?: number; // 0..1
  seed: string;
}) {
  const clamped = Math.max(0, Math.min(1, progress));

  // Stable visibility order per mount, recompute only if count/flip change
  const ranks = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed =
        ((i + 1) * 1315423911) ^ (count * 2654435761) ^ (flip ? 0x9e3779b9 : 0);
      return rand01(seed);
    });
  }, [count, flip]);

  return (
    <div
      className="pointer-events-none w-full grid"
      style={{
        gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        transform: `scale(${scale})`,
      }}
      aria-hidden={true}
    >
      {Array.from({ length: count }).map((_, i) => {
        const r = ranks[i] ?? 0;
        const visible = r < clamped;
        const delayMs = Math.floor(r * 300);
        return (
          <div
            key={i}
            className={`garden-sway ${
              i % 2 ? "sway-fast" : "sway-slow"
            } flex items-end justify-center ${
              flip && i % 2 ? "scale-x-[-1]" : ""
            }`}
            style={{
              animationDelay: `${(i % 6) * 0.3}s`,
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateY(0) scale(1)"
                : "translateY(12px) scale(0.95)",
            }}
          >
            <FlowerCluster
              colors={colors}
              flip={flip && i % 2 === 0}
              seed={`${seed}-cluster-${i}`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default memo(MeadowRow);
