import { STAGES, type Stage } from "@/lib/palette";

// Per-stage rendering + animation parameters. Growth is deliberately front-
// loaded: big visible gains early (Spark/Flame), then size flattens and the
// reward shifts to glow, flicker speed, and particles (Blaze onward).

export interface StageVisual {
  // Base scale of the flame body at the stage floor.
  baseScale: number;
  // Extra scale earned per day *within* this stage (shrinks at higher stages).
  perDayScale: number;
  // Cap of within-stage growth.
  maxExtra: number;
  flickerSpeed: number; // seconds per flicker cycle (lower = livelier)
  flickerAmount: number; // px of vertical travel
  glow: number; // base glow blur radius multiplier
  tongues: number; // number of flame tongues rendered
  particles: boolean; // ember particles float up
}

export const STAGE_VISUALS: Record<Stage, StageVisual> = {
  Spark: {
    baseScale: 0.45,
    perDayScale: 0.06,
    maxExtra: 0.36,
    flickerSpeed: 1.4,
    flickerAmount: 3,
    glow: 0.7,
    tongues: 1,
    particles: false,
  },
  Flame: {
    baseScale: 0.85,
    perDayScale: 0.018,
    maxExtra: 0.24,
    flickerSpeed: 1.15,
    flickerAmount: 4,
    glow: 1,
    tongues: 1,
    particles: false,
  },
  Blaze: {
    baseScale: 1.12,
    perDayScale: 0.004,
    maxExtra: 0.12,
    flickerSpeed: 0.85,
    flickerAmount: 6,
    glow: 1.4,
    tongues: 1,
    particles: false,
  },
  Beacon: {
    baseScale: 1.28,
    perDayScale: 0.002,
    maxExtra: 0.1,
    flickerSpeed: 0.7,
    flickerAmount: 7,
    glow: 1.8,
    tongues: 3,
    particles: true,
  },
  Phoenix: {
    baseScale: 1.4,
    perDayScale: 0,
    maxExtra: 0,
    flickerSpeed: 0.6,
    flickerAmount: 8,
    glow: 2.3,
    tongues: 1, // bird silhouette, drawn specially
    particles: true,
  },
};

import { STAGE_FLOORS } from "@/lib/palette";

// Overall render scale from total days logged, honoring the per-stage curve.
export function growthScale(stage: Stage, daysLogged: number): number {
  const v = STAGE_VISUALS[stage];
  const withinStage = Math.max(0, daysLogged - STAGE_FLOORS[stage]);
  const extra = Math.min(v.maxExtra, withinStage * v.perDayScale);
  return v.baseScale + extra;
}

// Classic teardrop flame outline in a 100x140 viewBox (tip up, base down).
// Body is deliberately broad (spans ~14–86) so flames read full, not thin.
export const TEARDROP =
  "M50 6 C 69 38, 88 60, 88 90 C 88 118, 71 134, 50 134 C 29 134, 12 118, 12 90 C 12 60, 31 38, 50 6 Z";

// Inner (hotter) core, a smaller teardrop that tracks the wider body.
export const TEARDROP_CORE =
  "M50 40 C 62 62, 71 74, 71 95 C 71 115, 62 123, 50 123 C 38 123, 29 115, 29 95 C 29 74, 38 62, 50 40 Z";

// A bird-like flame silhouette for Phoenix (wings sweeping up from a body).
export const PHOENIX_BIRD =
  "M50 8 C 54 26, 58 34, 66 40 C 82 30, 96 34, 100 44 C 88 48, 78 56, 72 68 C 84 72, 92 82, 92 92 C 80 86, 68 88, 60 96 C 62 112, 56 126, 50 134 C 44 126, 38 112, 40 96 C 32 88, 20 86, 8 92 C 8 82, 16 72, 28 68 C 22 56, 12 48, 0 44 C 4 34, 18 30, 34 40 C 42 34, 46 26, 50 8 Z";

export function isPhoenix(stage: Stage): boolean {
  return stage === "Phoenix";
}

export function stageIndex(stage: Stage): number {
  return STAGES.indexOf(stage);
}
