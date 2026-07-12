import { describe, it, expect } from "vitest";
import { dayKey, parseDayKey, daysBetween, lastNDays, addDays } from "../lib/dates";

describe("dates", () => {
  it("formats a day key as YYYY-MM-DD in local time", () => {
    expect(dayKey(new Date(2026, 6, 12))).toBe("2026-07-12");
    expect(dayKey(new Date(2026, 0, 1))).toBe("2026-01-01");
    expect(dayKey(new Date(2026, 11, 9))).toBe("2026-12-09");
  });

  it("round-trips through parseDayKey", () => {
    const key = "2026-03-05";
    expect(dayKey(parseDayKey(key))).toBe(key);
  });

  it("computes whole-day gaps", () => {
    expect(daysBetween("2026-07-12", "2026-07-12")).toBe(0);
    expect(daysBetween("2026-07-12", "2026-07-13")).toBe(1);
    expect(daysBetween("2026-07-10", "2026-07-17")).toBe(7);
    // crosses a month boundary
    expect(daysBetween("2026-06-30", "2026-07-01")).toBe(1);
  });

  it("addDays shifts correctly, including across months", () => {
    expect(addDays("2026-07-12", 1)).toBe("2026-07-13");
    expect(addDays("2026-07-31", 1)).toBe("2026-08-01");
    expect(addDays("2026-07-01", -1)).toBe("2026-06-30");
  });

  it("lastNDays returns N ascending keys ending today", () => {
    const days = lastNDays(5, "2026-07-12");
    expect(days).toHaveLength(5);
    expect(days).toEqual([
      "2026-07-08",
      "2026-07-09",
      "2026-07-10",
      "2026-07-11",
      "2026-07-12",
    ]);
  });
});
