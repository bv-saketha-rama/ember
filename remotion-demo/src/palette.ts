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
  Phoenix: { baseScale: 1.46, glow: 2.4, tongues: 1, particles: true },
};

export const TEARDROP =
  "M50 6 C 69 38, 88 60, 88 90 C 88 118, 71 134, 50 134 C 29 134, 12 118, 12 90 C 12 60, 31 38, 50 6 Z";
export const TEARDROP_CORE =
  "M50 40 C 62 62, 71 74, 71 95 C 71 115, 62 123, 50 123 C 38 123, 29 115, 29 95 C 29 74, 38 62, 50 40 Z";
export const PHOENIX_BIRD =
  "M50 8 C 54 26, 58 34, 66 40 C 82 30, 96 34, 100 44 C 88 48, 78 56, 72 68 C 84 72, 92 82, 92 92 C 80 86, 68 88, 60 96 C 62 112, 56 126, 50 134 C 44 126, 38 112, 40 96 C 32 88, 20 86, 8 92 C 8 82, 16 72, 28 68 C 22 56, 12 48, 0 44 C 4 34, 18 30, 34 40 C 42 34, 46 26, 50 8 Z";

export function displayColor(baseHex: string, stage: Stage): string {
  return stage === "Phoenix" ? PHOENIX_GOLD : baseHex;
}
