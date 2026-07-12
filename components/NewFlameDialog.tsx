"use client";

import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FLAME_COLORS } from "@/lib/palette";
import { Modal } from "./ui/Modal";
import { Flame } from "./flame/Flame";

type QA = { question: string; answer: string };

export function NewFlameDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const generate = useAction(api.ai.generateOnboardingQuestion);
  const createFlame = useMutation(api.flames.createFlame);

  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(FLAME_COLORS[0].hex);
  const [step, setStep] = useState(-1); // -1 = setup, 0..2 = questions
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<QA[]>([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [saving, setSaving] = useState(false);

  function reset() {
    setName("");
    setColor(FLAME_COLORS[0].hex);
    setStep(-1);
    setQuestion("");
    setAnswer("");
    setAnswers([]);
  }

  // Fetch the (AI-phrased) question whenever we advance to a question step.
  useEffect(() => {
    if (step < 0 || step > 2) return;
    let cancelled = false;
    setLoadingQ(true);
    setQuestion("");
    generate({ step, flameName: name, priorAnswers: answers })
      .then((q) => !cancelled && setQuestion(q))
      .catch(() => !cancelled && setQuestion(""))
      .finally(() => !cancelled && setLoadingQ(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function startConversation() {
    if (!name.trim()) return;
    setStep(0);
  }

  async function submitAnswer() {
    const qa = { question: question || "(question)", answer: answer.trim() };
    const next = [...answers, qa];
    setAnswers(next);
    setAnswer("");
    if (step < 2) {
      setStep(step + 1);
    } else {
      setSaving(true);
      await createFlame({ name: name.trim(), color, originStory: next });
      setSaving(false);
      reset();
      onClose();
    }
  }

  function close() {
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={close}>
      {step < 0 ? (
        <div className="space-y-5">
          <div className="flex justify-center">
            <Flame color={color} stage="Spark" size={90} daysLogged={0} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Light a new flame</h2>
            <p className="mt-1 text-sm text-text-muted">
              Name the thing you want to tend, and pick its color.
            </p>
          </div>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startConversation()}
            placeholder="e.g. Running, Music, Writing…"
            className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 outline-none focus:border-ember"
          />
          <div className="flex flex-wrap gap-3">
            {FLAME_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.hex)}
                aria-label={c.name}
                className="h-9 w-9 rounded-full transition"
                style={{
                  background: c.hex,
                  outline: color === c.hex ? `2px solid ${c.hex}` : "none",
                  outlineOffset: 3,
                  boxShadow: color === c.hex ? `0 0 16px ${c.hex}` : "none",
                }}
              />
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={close} className="rounded-xl px-4 py-2 text-sm text-text-muted hover:text-text">
              Cancel
            </button>
            <button
              onClick={startConversation}
              disabled={!name.trim()}
              className="rounded-xl bg-ember px-4 py-2 text-sm font-medium text-black disabled:opacity-40"
            >
              Begin
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Flame color={color} stage="Spark" size={56} daysLogged={0} />
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">
                {name} · question {step + 1} of 3
              </p>
              <p className="mt-1 min-h-[2.5rem] font-medium leading-snug">
                {loadingQ ? (
                  <span className="text-text-muted">thinking…</span>
                ) : (
                  question
                )}
              </p>
            </div>
          </div>
          <textarea
            autoFocus
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Take your time…"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-surface-raised px-4 py-3 outline-none focus:border-ember"
          />
          <div className="flex justify-between">
            <button onClick={close} className="rounded-xl px-4 py-2 text-sm text-text-muted hover:text-text">
              Cancel
            </button>
            <button
              onClick={submitAnswer}
              disabled={saving}
              className="rounded-xl bg-ember px-5 py-2 text-sm font-medium text-black disabled:opacity-50"
            >
              {saving ? "Lighting…" : step < 2 ? "Next" : "Light it"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
