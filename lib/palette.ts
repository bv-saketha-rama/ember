// Ember design tokens + flame mechanics constants.
// Shared by both the client (rendering) and Convex (stage computation).

export const CANVAS = "#0D0B10";
export const SURFACE = "#17141C";
export const TEXT = "#F5F1E8";

// The 6 user-selectable flame colors. Gold is intentionally NOT here — it is
// reserved for the Phoenix stage and applied automatically, never picked.
export const FLAME_COLORS = [
  { id: "ember", name: "Ember Orange", hex: "#FF6B35" },
  { id: "sapphire", name: "Sapphire", hex: "#3A86FF" },
  { id: "violet", name: "Violet", hex: "#8338EC" },
  { id: "emerald", name: "Emerald", hex: "#06D6A0" },
  { id: "crimson", name: "Crimson", hex: "#EF476F" },
  { id: "cyan", name: "Cyan", hex: "#00B4D8" },
] as const;

export const PHOENIX_GOLD = "#FFD60A";

export type FlameColorHex = (typeof FLAME_COLORS)[number]["hex"];

export const STAGES = ["Spark", "Flame", "Blaze", "Beacon", "Phoenix"] as const;
export type Stage = (typeof STAGES)[number];

// Lower bound (in distinct days logged) for each stage.
export const STAGE_FLOORS: Record<Stage, number> = {
  Spark: 0,
  Flame: 7,
  Blaze: 20,
  Beacon: 50,
  Phoenix: 100,
};

export const MOODS = [
  { id: "energized", label: "Energized", glyph: "\u{1F525}" },
  { id: "okay", label: "Okay", glyph: "\u{1F642}" },
  { id: "rough", label: "Rough", glyph: "\u{1F327}️" },
] as const;

export type Mood = (typeof MOODS)[number]["id"];

// Grace / decay model (in whole days since last log).
export const GRACE_START = 2; // dim to ember glow at a 2-day gap
export const DECAY_START = 5; // drop back one stage at a 5+ day gap
export const CONSISTENCY_WINDOW = 25; // "logged X of the last 25 days"

// The display color for a flame given its stage: Phoenix always burns gold.
export function displayColor(baseHex: string, stage: Stage): string {
  return stage === "Phoenix" ? PHOENIX_GOLD : baseHex;
}
