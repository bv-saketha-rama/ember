"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MainShell } from "@/components/MainShell";
import { BraidedFlame } from "@/components/flame/BraidedFlame";
import { DayEntriesSheet } from "@/components/DayEntriesSheet";
import { dayKey } from "@/lib/dates";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const month = monthKey(cursor);
  const summary =
    (useQuery(api.logs.monthSummary, { month }) as
      | Record<string, string[]>
      | undefined) ?? {};

  const year = cursor.getFullYear();
  const m = cursor.getMonth();
  const firstWeekday = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const today = dayKey();

  const cells: (string | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${month}-${String(d).padStart(2, "0")}`);
  }

  const label = cursor.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <MainShell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor(new Date(year, m - 1, 1))}
            className="rounded-lg bg-surface px-3 py-1.5 text-sm hover:bg-surface-raised"
          >
            ‹
          </button>
          <span className="w-40 text-center text-sm text-text-muted">{label}</span>
          <button
            onClick={() => setCursor(new Date(year, m + 1, 1))}
            className="rounded-lg bg-surface px-3 py-1.5 text-sm hover:bg-surface-raised"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="pb-1 text-center text-xs text-text-muted">
            {w}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const colors = summary[day] ?? [];
          const isToday = day === today;
          const dayNum = Number(day.slice(-2));
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(day)}
              className={`flex aspect-square flex-col items-center justify-between rounded-xl border p-1.5 transition ${
                isToday ? "border-ember" : "border-border"
              } ${colors.length ? "bg-surface" : "bg-surface/40 hover:bg-surface"}`}
            >
              <span className="self-start text-[11px] text-text-muted">
                {dayNum}
              </span>
              <div className="flex flex-1 items-center justify-center">
                {colors.length > 0 ? (
                  <BraidedFlame colors={colors} size={34} />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-border" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <DayEntriesSheet
        date={selectedDay}
        open={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
      />
    </MainShell>
  );
}
