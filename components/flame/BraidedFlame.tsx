"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { TEARDROP } from "./flameShapes";

// 2-3 distinct colored tongues twisting around one shared base. Colors stay
// visually separate (no muddy blending). One color renders as a single flame.
export function BraidedFlame({
  colors,
  size = 40,
  animate = true,
}: {
  colors: string[];
  size?: number;
  animate?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const strands = colors.slice(0, 3);
  if (strands.length === 0) return null;

  // Horizontal spread of the strands' upper halves; they cross to "braid".
  const spread = strands.length === 1 ? 0 : 12;

  return (
    <div style={{ width: size, height: size }} className="relative flex items-end justify-center">
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 65%, ${strands[0]}55, transparent 65%)`,
          filter: "blur(4px)",
        }}
      />
      <svg viewBox="0 0 100 140" width={size} height={size} style={{ overflow: "visible" }}>
        {strands.map((c, i) => {
          const base = strands.length === 1 ? 0 : (i - (strands.length - 1) / 2) * spread;
          return (
            <motion.g
              key={i}
              style={{ originY: 1 }}
              transform={`translate(${base} 0) scale(${strands.length === 1 ? 1 : 0.7})`}
              animate={
                animate
                  ? {
                      x: [0, -base * 1.4, 0, base * 1.4, 0],
                      scaleY: [1, 1.06, 1],
                    }
                  : {}
              }
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            >
              <defs>
                <linearGradient id={`b-${uid}-${i}`} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={c} />
                  <stop offset="100%" stopColor={c} stopOpacity="0.85" />
                </linearGradient>
              </defs>
              <path d={TEARDROP} fill={`url(#b-${uid}-${i})`} opacity={0.92} />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
