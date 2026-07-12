// Pure flame mechanics — shared by mutations (to cache) and queries (to read).
// No Convex bindings here so it stays trivially testable and importable.
import {
  STAGES,
  STAGE_FLOORS,
  GRACE_START,
  DECAY_START,
  CONSISTENCY_WINDOW,
  type Stage,
} from "../lib/palette";
import { daysBetween, dayKey } from "../lib/dates";

// Stage purely from distinct days logged.
export function computeStage(daysLogged: number): Stage {
  if (daysLogged >= STAGE_FLOORS.Phoenix) return "Phoenix";
  if (daysLogged >= STAGE_FLOORS.Beacon) return "Beacon";
  if (daysLogged >= STAGE_FLOORS.Blaze) return "Blaze";
  if (daysLogged >= STAGE_FLOORS.Flame) return "Flame";
  return "Spark";
}

// Consistency = distinct days logged within the trailing window / window.
export function consistencyScore(
  loggedDayKeys: Iterable<string>,
  today: string = dayKey()
): number {
  const set = new Set(loggedDayKeys);
  let hits = 0;
  for (let i = 0; i < CONSISTENCY_WINDOW; i++) {
    const d = new Date();
    d.setTime(Date.parse(today.replace(/-/g, "/")));
    d.setDate(d.getDate() - i);
    if (set.has(dayKey(d))) hits++;
  }
  return Math.min(1, hits / CONSISTENCY_WINDOW);
}

export type FlameLifeState = "burning" | "grace" | "decayed";

// Live grace/decay derived from the gap since the last log. Never mutates
// stored state — the visual dim and any stage drop are computed on read.
export function lifeState(
  lastLogDate: string | undefined,
  today: string = dayKey()
): { state: FlameLifeState; gap: number } {
  if (!lastLogDate) return { state: "burning", gap: 0 };
  const gap = daysBetween(lastLogDate, today);
  if (gap >= DECAY_START) return { state: "decayed", gap };
  if (gap >= GRACE_START) return { state: "grace", gap };
  return { state: "burning", gap };
}

// Effective stage after applying decay: a long gap drops the flame back one
// stage (its daysLogged is treated as the previous stage's floor).
export function effectiveStage(
  daysLogged: number,
  lastLogDate: string | undefined,
  today: string = dayKey()
): { stage: Stage; dimmed: boolean } {
  const stored = computeStage(daysLogged);
  const { state } = lifeState(lastLogDate, today);
  if (state === "decayed") {
    const idx = STAGES.indexOf(stored);
    const dropped = STAGES[Math.max(0, idx - 1)];
    return { stage: dropped, dimmed: true };
  }
  return { stage: stored, dimmed: state === "grace" };
}
