import React, { memo, useMemo, useId } from "react";
import { seededRandom } from "./random";

function GardenFlower({
  size = 22, // smaller default size
  color = "#f43f5e",
  tilt = 0,
  swayDelay,
  swayDuration,
}: {
  size?: number;
  color?: string;
  tilt?: number;
  swayDelay?: number; // seconds (can be negative)
  swayDuration?: number; // seconds
}) {
  const reactId = useId();
  const delay =
    typeof swayDelay === "number"
      ? swayDelay
      : seededRandom(`${reactId}-delay`) * 3 - 1.5;
  const duration =
    typeof swayDuration === "number"
      ? swayDuration
      : 2.6 + seededRandom(`${reactId}-duration`) * 1.8;

  // Precompute petals once per (size,color) so DOM is stable
  const petals = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => {
      const angle = i * 72 * (Math.PI / 180);
      const cx = 16 + Math.sin(angle) * 5.5;
      const cy = 14 - Math.cos(angle) * 5.5;
      return (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={3.2}
          ry={6.5}
          fill={color}
          fillOpacity={0.85}
          transform={`rotate(${i * 72}, ${cx}, ${cy})`}
        />
      );
    });
  }, [color]);

  return (
    <svg
      width={size}
      height={size * 1.9}
      viewBox="0 0 32 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ display: "block", transform: `rotate(${tilt}deg)` }}
    >
      {/* stem */}
      <path
        d="M16 22v34"
        stroke="#16a34a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* one leaf only */}
      <path
        d="M16 36c-5-2-8 1-9 5 3-1 6 1 9 3"
        fill="#22c55e"
        fillOpacity="0.85"
      />
      {/* flower head (sways) */}
      <g
        className="gf-head-sway"
        style={{
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      >
        {petals}
        <circle cx="16" cy="14" r="4.2" fill={color} />
        <circle cx="16" cy="14" r="2" fill="#fff" />
      </g>
      <style jsx>{`
        .gf-head-sway {
          transform-origin: 16px 22px; /* pivot at top of stem */
          transform-box: fill-box;
          animation: gf-sway 3s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes gf-sway {
          0%,
          100% {
            transform: rotate(-4.75deg);
          }
          50% {
            transform: rotate(4.75deg);
          }
        }
      `}</style>
    </svg>
  );
}

export default memo(GardenFlower);
