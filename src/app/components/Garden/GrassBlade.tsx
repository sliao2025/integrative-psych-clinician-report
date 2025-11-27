import React, { memo, useId } from "react";
import { seededRandom } from "./random";

function GrassBlade({
  h = 24,
  bend = 6,
  baseWidth = 2,
  tipWidth = 1, // Increased tipWidth for less taper
  swayDelay,
  swayDuration,
}: {
  h?: number;
  bend?: number;
  baseWidth?: number;
  tipWidth?: number;
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
      : 3.2 + seededRandom(`${reactId}-duration`) * 2.0;

  const top = 56 - h;
  const centerX = 6;
  const halfBase = baseWidth / 2;
  const halfTip = tipWidth / 2;

  // Left and right base points
  const leftBase = centerX - halfBase;
  const rightBase = centerX + halfBase;

  // Left and right tip points (less difference from base)
  const leftTip = centerX - halfTip;
  const rightTip = centerX + halfTip;
  const tipY = top;

  // Control points for left and right curves (less aggressive curve)
  const leftCtrlX = centerX - bend * 0.7;
  const rightCtrlX = centerX + bend * 0.7;
  const ctrlY = top + h - h / 2.2;

  return (
    <svg
      width={12}
      height={56}
      viewBox={`0 ${top} 12 ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g
        className="gb-tip-sway"
        style={{
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      >
        <path
          d={`
                        M ${leftBase} ${top + h}
                        C ${leftCtrlX} ${ctrlY}, ${leftTip} ${ctrlY}, ${leftTip} ${tipY}
                        L ${rightTip} ${tipY}
                        C ${rightTip} ${ctrlY}, ${rightCtrlX} ${ctrlY}, ${rightBase} ${
            top + h
          }
                        Z
                    `}
          fill="#3ed24cff"
        />
      </g>
      <style jsx>{`
        .gb-tip-sway {
          transform-origin: 50% 92%; /* near the base so the tip moves more */
          transform-box: fill-box;
          animation: gb-sway 4.5s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes gb-sway {
          0%,
          100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }
      `}</style>
    </svg>
  );
}

export default memo(GrassBlade);
