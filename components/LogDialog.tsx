"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "motion/react";
import { MOODS, type Mood } from "@/lib/palette";
import { dayKey } from "@/lib/dates";
import { Modal } from "./ui/Modal";
import { AiBadge, AiThinking, AiShimmerLines } from "./ui/AiThinking";

export function LogDialog({
  flameId,
  flameName,
  open,
  onClose,
}: {
  flameId: Id<"flames"> | null;
  flameName: string;
  open: boolean;
  onClose: () => void;
}) {
  const logEntry = useMutation(api.logs.logEntry);
  const getCheckin = useAction(api.ai.generateCheckinQuestion);

  const [mood, setMood] = useState<Mood | null>(null);
  const [checkin, setCheckin] = useState<string>("");
  const [loadingCheckin, setLoadingCheckin] = useState(false);
  const [aiAnswer, setAiAnswer] = useState("");
  const [journal, setJournal] = useState("");
  const [saving, setSaving] = useState(false);
  const [milestone, setMilestone] = useState<string | null>(null);

  function reset() {
    setMood(null);
    setCheckin("");
    setAiAnswer("");
    setJournal("");
    setMilestone(null);
  }

  async function loadCheckin() {
    if (!flameId) return;
    setLoadingCheckin(true);
    try {
      setCheckin(await getCheckin({ flameId }));
    } finally {
      setLoadingCheckin(false);
    }
  }

  async function submit() {
    if (!flameId || !mood) return;
    setSaving(true);
    const result = await logEntry({
      flameId,
      date: dayKey(),
      mood,
      journalText: journal.trim() || undefined,
      aiQuestionAsked: checkin || undefined,
      aiAnswerGiven: aiAnswer.trim() || undefined,
    });
    setSaving(false);
    if (result?.milestone) {
      setMilestone(result.milestone); // celebrate, then let the user close
    } else {
      reset();
      onClose();
    }
  }

  function close() {
    reset();
    onClose();
  }

  if (milestone) {
    return (
      <Modal open={open} onClose={close}>
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <motion.div
            initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="text-5xl"
          >
            ✦
          </motion.div>
          <div>
            <h2 className="text-xl font-semibold text-gold">{milestone}!</h2>
            <p className="mt-1 text-sm text-text-muted">
              {flameName} just grew into a new form. Keep it burning.
            </p>
          </div>
          <button
            onClick={close}
            className="rounded-xl bg-ember px-5 py-2 text-sm font-medium text-black"
          >
            Beautiful
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={close}>
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">How was {flameName} today?</h2>
          <p className="mt-1 text-sm text-text-muted">
            A tap is enough. Say more only if you feel like it.
          </p>
        </div>

        {/* Fast path: mood taps. */}
        <div className="grid grid-cols-3 gap-3">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-4 transition ${
                mood === m.id
                  ? "border-ember bg-surface-raised"
                  : "border-border hover:border-text-muted"
              }`}
            >
              <span className="text-2xl">{m.glyph}</span>
              <span className="text-xs text-text-muted">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Optional AI enrichment — never a gate. */}
        {checkin ? (
          <div className="rounded-xl border border-ember/40 bg-ember/5 p-3">
            <AiBadge />
            <p className="mt-2 text-sm">{checkin}</p>
            <textarea
              value={aiAnswer}
              onChange={(e) => setAiAnswer(e.target.value)}
              rows={2}
              placeholder="Optional…"
              className="mt-2 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-ember"
            />
          </div>
        ) : loadingCheckin ? (
          <div className="rounded-xl border border-ember/40 bg-ember/5 p-3">
            <AiThinking label="Ember is writing a check-in for you" />
            <div className="mt-2">
              <AiShimmerLines lines={2} />
            </div>
          </div>
        ) : (
          <button
            onClick={loadCheckin}
            className="group flex w-full items-center gap-2 rounded-xl border border-dashed border-ember/40 bg-ember/5 px-3 py-2.5 text-left text-sm text-text transition hover:border-ember hover:bg-ember/10"
          >
            <AiBadge />
            <span className="text-text-muted group-hover:text-text">
              Get a personal check-in question →
            </span>
          </button>
        )}

        {/* Always-visible optional journal. */}
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          rows={3}
          placeholder="Anything you want to remember about today…"
          className="w-full resize-none rounded-xl border border-border bg-surface-raised px-4 py-3 outline-none focus:border-ember"
        />

        <div className="flex justify-between">
          <button onClick={close} className="rounded-xl px-4 py-2 text-sm text-text-muted hover:text-text">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!mood || saving}
            className="rounded-xl bg-ember px-5 py-2 text-sm font-medium text-black disabled:opacity-40"
          >
            {saving ? "Saving…" : "Log it"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
