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
    baseScale: 1.12, // firebird spans the full width, so it needs less scale
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

// A firebird silhouette for Phoenix: smooth upswept wings, a central crest,
// and a forked flame tail. Symmetric about x=50; reads cleanly even at small
// sizes (the earlier scalloped path muddled into a daffodil shape).
export const PHOENIX_BIRD =
  "M50 6 C 53 20, 54 30, 57 40 C 68 26, 84 20, 96 22 C 86 34, 76 44, 68 56 C 64 74, 61 86, 60 96 C 66 106, 70 114, 70 120 C 62 118, 55 120, 50 134 C 45 120, 38 118, 30 120 C 30 114, 34 106, 40 96 C 39 86, 36 74, 32 56 C 24 44, 14 34, 4 22 C 16 20, 32 26, 43 40 C 46 30, 47 20, 50 6 Z";

export function isPhoenix(stage: Stage): boolean {
  return stage === "Phoenix";
}

export function stageIndex(stage: Stage): number {
  return STAGES.indexOf(stage);
}
