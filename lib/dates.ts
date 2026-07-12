// Local-timezone day keys. A log's "date" is the calendar day in the user's
// local timezone, stored as "YYYY-MM-DD" so comparisons are pure string math.

export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Whole-day gap between two day keys (b - a). Same day = 0.
export function daysBetween(a: string, b: string): number {
  const ms = parseDayKey(b).getTime() - parseDayKey(a).getTime();
  return Math.round(ms / 86_400_000);
}

// The N day keys ending today (inclusive), oldest first.
export function lastNDays(n: number, today: string = dayKey()): string[] {
  const base = parseDayKey(today);
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    out.push(dayKey(d));
  }
  return out;
}

export function addDays(key: string, delta: number): string {
  const d = parseDayKey(key);
  d.setDate(d.getDate() + delta);
  return dayKey(d);
}
