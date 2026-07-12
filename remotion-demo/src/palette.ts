// Mirrors lib/palette.ts + components/flame/flameShapes.ts from the app so the
// demo flames are pixel-faithful to what ships.

export const CANVAS = "#0D0B10";
export const SURFACE = "#17141C";
export const TEXT = "#F5F1E8";
export const PHOENIX_GOLD = "#FFD60A";

export const STAGES = ["Spark", "Flame", "Blaze", "Beacon", "Phoenix"] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_FLOORS: Record<Stage, number> = {
  Spark: 0,
  Flame: 7,
  Blaze: 20,
  Beacon: 50,
  Phoenix: 100,
};

// User-selectable flame colors (gold is reserved for Phoenix).
export const COLORS = {
  ember: "#FF6B35",
  sapphire: "#3A86FF",
  violet: "#8338EC",
  emerald: "#06D6A0",
  crimson: "#EF476F",
  cyan: "#00B4D8",
} as const;

export interface StageVisual {
  baseScale: number;
  glow: number;
  tongues: number;
  particles: boolean;
}

export const STAGE_VISUALS: Record<Stage, StageVisual> = {
  Spark: { baseScale: 0.55, glow: 0.7, tongues: 1, particles: false },
  Flame: { baseScale: 0.95, glow: 1.0, tongues: 1, particles: false },
  Blaze: { baseScale: 1.18, glow: 1.4, tongues: 1, particles: true },
  Beacon: { baseScale: 1.32, glow: 1.8, tongues: 3, particles: true },
  Phoenix: { baseScale: 1.12, glow: 2.4, tongues: 1, particles: true },
};

export const TEARDROP =
  "M50 6 C 69 38, 88 60, 88 90 C 88 118, 71 134, 50 134 C 29 134, 12 118, 12 90 C 12 60, 31 38, 50 6 Z";
export const TEARDROP_CORE =
  "M50 40 C 62 62, 71 74, 71 95 C 71 115, 62 123, 50 123 C 38 123, 29 115, 29 95 C 29 74, 38 62, 50 40 Z";
export const PHOENIX_BIRD =
  "M50 6 C 53 20, 54 30, 57 40 C 68 26, 84 20, 96 22 C 86 34, 76 44, 68 56 C 64 74, 61 86, 60 96 C 66 106, 70 114, 70 120 C 62 118, 55 120, 50 134 C 45 120, 38 118, 30 120 C 30 114, 34 106, 40 96 C 39 86, 36 74, 32 56 C 24 44, 14 34, 4 22 C 16 20, 32 26, 43 40 C 46 30, 47 20, 50 6 Z";

export function displayColor(baseHex: string, stage: Stage): string {
  return stage === "Phoenix" ? PHOENIX_GOLD : baseHex;
}
