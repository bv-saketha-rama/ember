"use client";

import { motion } from "motion/react";

// A small, branded affordance that makes it obvious a question is being
// written *by AI* (Gemini, server-side) — not canned. Used while an ai.* action
// is in flight and as a persistent label above AI-authored questions.

// The little animated spark mark. Pulses + rotates gently so it reads as
// "thinking", and doubles as the AI attribution glyph.
export function AiSpark({ size = 16 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      animate={{ rotate: [0, 12, -8, 0], scale: [1, 1.15, 0.95, 1] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* four-point sparkle */}
      <path
        d="M12 2c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7Z"
        fill="url(#spark-grad)"
      />
      <circle cx="19" cy="5" r="1.4" fill="#FFD60A" />
      <defs>
        <linearGradient id="spark-grad" x1="5" y1="19" x2="19" y2="5">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FFD60A" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

// Persistent "Ember AI" attribution chip. Sits above AI-written questions so
// the user learns the questions are generated for them.
export function AiBadge({ label = "Ember AI" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/40 bg-ember/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ember">
      <AiSpark size={13} />
      {label}
    </span>
  );
}

// Three-dot "writing…" pulse, used inline while the model composes a question.
export function AiThinking({ label = "Ember is thinking" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-text-muted">
      <AiSpark size={15} />
      <span>{label}</span>
      <span className="inline-flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block h-1 w-1 rounded-full bg-ember"
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </span>
    </span>
  );
}

// Shimmering skeleton lines to occupy the space a generated question will fill,
// so the layout doesn't jump when the text arrives.
export function AiShimmerLines({ lines = 2 }: { lines?: number }) {
  return (
    <div className="space-y-2" aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="h-3 rounded-full bg-gradient-to-r from-ember/10 via-ember/25 to-ember/10 bg-[length:200%_100%]"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
          animate={{ backgroundPositionX: ["150%", "-50%"] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
