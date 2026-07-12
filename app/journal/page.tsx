"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MainShell } from "@/components/MainShell";
import { MOODS } from "@/lib/palette";
import { parseDayKey } from "@/lib/dates";

function moodGlyph(id: string) {
  return MOODS.find((m) => m.id === id)?.glyph ?? "";
}

export default function JournalPage() {
  const flames = useQuery(api.flames.listFlames);
  const [filter, setFilter] = useState<Id<"flames"> | "all">("all");
  const feed = useQuery(
    api.logs.journalFeed,
    filter === "all" ? {} : { flameId: filter }
  );

  return (
    <MainShell>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Journal</h1>
          <p className="mt-1 text-text-muted">Everything you&apos;ve tended, looking back.</p>
        </div>
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value === "all" ? "all" : (e.target.value as Id<"flames">))
          }
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none"
        >
          <option value="all">All flames</option>
          {flames?.map((f) => (
            <option key={f._id} value={f._id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {feed === undefined ? (
        <p className="text-text-muted">Loading…</p>
      ) : feed.length === 0 ? (
        <p className="text-text-muted">
          No entries yet. Log a flame and it&apos;ll show up here.
        </p>
      ) : (
        <ul className="space-y-3">
          {feed.map((e) => (
            <li
              key={e._id}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center gap-2 text-sm">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: e.flameColor }}
                />
                <span className="font-medium">{e.flameName}</span>
                <span className="text-text-muted">
                  {parseDayKey(e.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="ml-auto text-lg">{moodGlyph(e.mood)}</span>
              </div>
              {e.milestoneHit && (
                <p className="mt-2 inline-block rounded-full bg-surface-raised px-2 py-0.5 text-xs font-medium text-gold">
                  ✦ {e.milestoneHit}
                </p>
              )}
              {e.aiQuestionAsked && e.aiAnswerGiven && (
                <div className="mt-2 border-l-2 border-border pl-3">
                  <p className="text-xs text-ember">{e.aiQuestionAsked}</p>
                  <p className="text-sm">{e.aiAnswerGiven}</p>
                </div>
              )}
              {e.journalText && (
                <p className="mt-2 text-sm leading-relaxed">{e.journalText}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </MainShell>
  );
}
