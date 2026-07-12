"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Modal } from "./ui/Modal";
import { parseDayKey } from "@/lib/dates";
import { MOODS } from "@/lib/palette";

function moodGlyph(id: string) {
  return MOODS.find((m) => m.id === id)?.glyph ?? "";
}

export function DayEntriesSheet({
  date,
  open,
  onClose,
}: {
  date: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const entries = useQuery(
    api.logs.logsByDay,
    date ? { date } : "skip"
  );

  const label = date
    ? parseDayKey(date).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{label}</h2>
        {entries === undefined ? (
          <p className="text-text-muted">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="text-text-muted">Nothing logged this day.</p>
        ) : (
          <ul className="space-y-3">
            {entries.map((e) => (
              <li
                key={e._id}
                className="rounded-xl border border-border bg-surface-raised p-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: e.flameColor }}
                  />
                  <span className="text-sm font-medium">{e.flameName}</span>
                  <span className="ml-auto text-lg">{moodGlyph(e.mood)}</span>
                </div>
                {e.milestoneHit && (
                  <p className="mt-1 text-xs font-medium text-gold">
                    ✦ {e.milestoneHit}
                  </p>
                )}
                {e.journalText && (
                  <p className="mt-1 text-sm text-text">{e.journalText}</p>
                )}
                {e.aiAnswerGiven && (
                  <p className="mt-1 text-sm text-text-muted italic">
                    “{e.aiAnswerGiven}”
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
