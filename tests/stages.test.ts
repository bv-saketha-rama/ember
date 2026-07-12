import { describe, it, expect } from "vitest";
import {
  computeStage,
  consistencyScore,
  lifeState,
  effectiveStage,
} from "../convex/stages";
import { lastNDays, addDays } from "../lib/dates";

describe("computeStage — boundaries by distinct days logged", () => {
  it("maps day counts to the right stage at each threshold", () => {
    expect(computeStage(0)).toBe("Spark");
    expect(computeStage(6)).toBe("Spark");
    expect(computeStage(7)).toBe("Flame");
    expect(computeStage(19)).toBe("Flame");
    expect(computeStage(20)).toBe("Blaze");
    expect(computeStage(49)).toBe("Blaze");
    expect(computeStage(50)).toBe("Beacon");
    expect(computeStage(99)).toBe("Beacon");
    expect(computeStage(100)).toBe("Phoenix");
    expect(computeStage(365)).toBe("Phoenix");
  });
});

describe("consistencyScore — logged days within trailing 25-day window", () => {
  const today = "2026-07-12";

  it("is 0 with no logs", () => {
    expect(consistencyScore([], today)).toBe(0);
  });

  it("is capped at 1 when every day in the window is logged", () => {
    const all = lastNDays(25, today);
    expect(consistencyScore(all, today)).toBe(1);
  });

  it("counts 20 of the last 25 days as 0.8", () => {
    const twenty = lastNDays(25, today).slice(0, 20);
    expect(consistencyScore(twenty, today)).toBeCloseTo(0.8, 5);
  });

  it("ignores logs older than the window", () => {
    const old = [addDays(today, -40), addDays(today, -30)];
    expect(consistencyScore(old, today)).toBe(0);
  });
});

describe("lifeState — grace/decay from the gap since last log", () => {
  const today = "2026-07-12";

  it("burns with no prior log", () => {
    expect(lifeState(undefined, today).state).toBe("burning");
  });

  it("burns at a 0-1 day gap", () => {
    expect(lifeState(today, today).state).toBe("burning");
    expect(lifeState(addDays(today, -1), today).state).toBe("burning");
  });

  it("enters grace at a 2-4 day gap", () => {
    expect(lifeState(addDays(today, -2), today).state).toBe("grace");
    expect(lifeState(addDays(today, -4), today).state).toBe("grace");
  });

  it("decays at a 5+ day gap", () => {
    expect(lifeState(addDays(today, -5), today).state).toBe("decayed");
    expect(lifeState(addDays(today, -30), today).state).toBe("decayed");
  });
});

describe("effectiveStage — decay drops one stage and dims", () => {
  const today = "2026-07-12";

  it("keeps the stored stage while burning", () => {
    const res = effectiveStage(25, addDays(today, -1), today); // Blaze
    expect(res.stage).toBe("Blaze");
    expect(res.dimmed).toBe(false);
  });

  it("dims but keeps the stage during grace", () => {
    const res = effectiveStage(25, addDays(today, -3), today);
    expect(res.stage).toBe("Blaze");
    expect(res.dimmed).toBe(true);
  });

  it("drops one stage and dims when decayed", () => {
    const res = effectiveStage(25, addDays(today, -6), today); // Blaze -> Flame
    expect(res.stage).toBe("Flame");
    expect(res.dimmed).toBe(true);
  });

  it("never drops below Spark", () => {
    const res = effectiveStage(2, addDays(today, -10), today); // Spark stays Spark
    expect(res.stage).toBe("Spark");
  });
});
