import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  PHOENIX_BIRD,
  STAGE_VISUALS,
  TEARDROP,
  TEARDROP_CORE,
  displayColor,
  type Stage,
} from "./palette";

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) + amt);
  const g = Math.min(255, ((n >> 8) & 255) + amt);
  const b = Math.min(255, (n & 255) + amt);
  return `rgb(${r},${g},${b})`;
}

interface FlameProps {
  stage: Stage;
  baseColor: string;
  size?: number;
  // Multiply the intrinsic stage scale (used for growth animation within a stage).
  scale?: number;
  // 0..1 — dims the flame toward an ember (grace/decay preview).
  dim?: number;
  seed?: number;
}

export const Flame: React.FC<FlameProps> = ({
  stage,
  baseColor,
  size = 260,
  scale = 1,
  dim = 0,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = STAGE_VISUALS[stage];
  const color = displayColor(baseColor, stage);
  const t = frame / fps;

  // Flicker: gentle vertical + width wobble, livelier at higher stages.
  const speed = 6 - v.glow; // livelier as glow grows
  const flick = Math.sin(t * speed + seed) * 0.5 + Math.sin(t * speed * 1.7 + seed) * 0.5;
  const wob = 1 + flick * 0.03;
  const rise = -flick * 4;

  const uid = `${stage}-${seed}`;
  const dimF = 1 - dim * 0.75;
  const s = v.baseScale * scale;

  // Beacon: a dominant central flame flanked by two small tongues at the base.
  const tongues =
    stage === "Beacon"
      ? [
          { dx: -22, s: 0.40 },
          { dx: 22, s: 0.40 },
          { dx: 0, s: 1 },
        ]
      : [{ dx: 0, s: 1 }];

  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 100 140"
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        <radialGradient id={`grad-${uid}`} cx="50%" cy="72%" r="62%">
          <stop offset="0%" stopColor={lighten(color, 90)} />
          <stop offset="45%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity={0.75} />
        </radialGradient>
        <filter id={`glow-${uid}`} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation={4 * v.glow * dimF} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* soft ground glow */}
      <ellipse
        cx="50"
        cy="118"
        rx={34 * s}
        ry={12 * s}
        fill={color}
        opacity={0.18 * dimF}
        style={{ filter: `blur(${6 * v.glow}px)` }}
      />

      <g
        transform={`translate(50 92) scale(${s * wob} ${s * (2 - wob)}) translate(-50 -92) translate(0 ${rise})`}
        style={{ filter: `url(#glow-${uid})`, opacity: dimF }}
      >
        {stage === "Phoenix" ? (
          <>
            <path d={PHOENIX_BIRD} fill={`url(#grad-${uid})`} />
            <path
              d={PHOENIX_BIRD}
              fill={lighten(color, 60)}
              opacity={0.35}
              transform="translate(50 84) scale(0.58) translate(-50 -84)"
            />
          </>
        ) : (
          <>
            {tongues.map(({ dx, s: ts }, i) => (
              <path
                key={i}
                d={TEARDROP}
                fill={`url(#grad-${uid})`}
                opacity={ts === 1 ? 1 : 0.95}
                transform={`translate(${50 + dx} 128) scale(${ts}) translate(-50 -128)`}
              />
            ))}
            <path d={TEARDROP_CORE} fill={lighten(color, 110)} opacity={0.9 * dimF} />
          </>
        )}
      </g>

      {/* ember particles */}
      {v.particles &&
        [0, 1, 2, 3].map((i) => {
          const p = ((t * 0.35 + i * 0.27 + seed * 0.1) % 1);
          const x = 50 + Math.sin(t * 1.6 + i * 2) * 12;
          const y = 96 - p * 78;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={1.6 - p}
              fill={lighten(color, 120)}
              opacity={(1 - p) * 0.8 * dimF}
            />
          );
        })}
    </svg>
  );
};
