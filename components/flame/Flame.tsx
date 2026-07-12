"use client";

import { useId, useMemo } from "react";
import { motion } from "motion/react";
import { type Stage, displayColor } from "@/lib/palette";
import {
  STAGE_VISUALS,
  growthScale,
  TEARDROP,
  TEARDROP_CORE,
  PHOENIX_BIRD,
  isPhoenix,
} from "./flameShapes";

// Lighten a hex color toward white by t in [0,1] — used for the hot core.
function lighten(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export interface FlameProps {
  color: string; // base palette hex
  stage: Stage;
  daysLogged?: number;
  consistencyScore?: number; // 0..1, drives glow brightness
  dimmed?: boolean; // grace / decay ember look
  size?: number; // px (bounding square)
  animate?: boolean;
}

export function Flame({
  color,
  stage,
  daysLogged = 0,
  consistencyScore = 0.5,
  dimmed = false,
  size = 120,
  animate = true,
}: FlameProps) {
  const uid = useId().replace(/:/g, "");
  const v = STAGE_VISUALS[stage];
  const hex = displayColor(color, stage);
  const scale = growthScale(stage, daysLogged) * (dimmed ? 0.82 : 1);
  const core = lighten(hex, 0.65);
  const glowStrength = (0.35 + consistencyScore * 0.65) * v.glow * (dimmed ? 0.3 : 1);

  const flicker = animate
    ? {
        y: [0, -v.flickerAmount, 0, -v.flickerAmount * 0.5, 0],
        scaleY: [1, 1.05, 0.98, 1.03, 1],
        scaleX: [1, 0.97, 1.02, 0.99, 1],
      }
    : {};
  const flickerT = {
    duration: v.flickerSpeed,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  // Which flame tongues to draw (Beacon splits into three). The side tongues
  // are small and flank the base so the central flame stays dominant — reads
  // as a beacon rather than a lumpy triple-blob.
  const tongues = useMemo(() => {
    if (isPhoenix(stage)) return [{ dx: 0, s: 1, phase: 0 }];
    if (v.tongues === 3)
      return [
        { dx: -22, s: 0.40, phase: 0.25 },
        { dx: 22, s: 0.40, phase: 0.5 },
        { dx: 0, s: 1, phase: 0 },
      ];
    return [{ dx: 0, s: 1, phase: 0 }];
  }, [stage, v.tongues]);

  return (
    <div
      style={{ width: size, height: size, opacity: dimmed ? 0.72 : 1 }}
      className="relative flex items-end justify-center"
    >
      {/* Soft radial glow behind the flame. */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 62%, ${hex}, transparent 62%)`,
          filter: `blur(${8 * glowStrength}px)`,
          opacity: 0.55 * glowStrength,
        }}
      />

      <motion.svg
        viewBox="0 0 100 140"
        width={size}
        height={size}
        style={{ overflow: "visible" }}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <defs>
          <linearGradient id={`body-${uid}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={hex} />
            <stop offset="55%" stopColor={hex} />
            <stop offset="100%" stopColor={core} stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id={`core-${uid}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={core} stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {isPhoenix(stage) ? (
          <motion.g animate={flicker} transition={flickerT}>
            <path d={PHOENIX_BIRD} fill={`url(#body-${uid})`} />
            <path d={PHOENIX_BIRD} fill={`url(#core-${uid})`} transform="translate(50 84) scale(0.58) translate(-50 -84)" opacity={0.42} />
          </motion.g>
        ) : (
          tongues.map((t, i) => (
            <motion.g
              key={i}
              style={{ originY: 1 }}
              animate={
                animate
                  ? {
                      y: [0, -v.flickerAmount * t.s, 0],
                      scaleY: [1, 1.06, 1],
                      scaleX: [1, 0.96, 1],
                    }
                  : {}
              }
              transition={{ ...flickerT, delay: t.phase * v.flickerSpeed }}
              transform={`translate(${50 + t.dx} 128) scale(${t.s}) translate(-50 -128)`}
            >
              <path d={TEARDROP} fill={`url(#body-${uid})`} />
              <path d={TEARDROP_CORE} fill={`url(#core-${uid})`} opacity={0.85} />
            </motion.g>
          ))
        )}
      </motion.svg>

      {/* Ember particles float up at Beacon+ (skipped when dimmed). */}
      {v.particles && animate && !dimmed && (
        <Particles color={core} size={size} />
      )}
    </div>
  );
}

function Particles({ color, size }: { color: string; size: number }) {
  const seeds = [0, 1, 2, 3, 4];
  return (
    <div className="pointer-events-none absolute inset-0 flex justify-center">
      {seeds.map((i) => {
        const x = (i - 2) * (size * 0.09);
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 3,
              height: 3,
              background: color,
              bottom: size * 0.3,
              left: `calc(50% + ${x}px)`,
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.9, 0], y: [-4, -size * 0.55] }}
            transition={{
              duration: 2 + (i % 3) * 0.6,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}
