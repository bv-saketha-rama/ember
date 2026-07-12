"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Flame } from "@/components/flame/Flame";
import { AiBadge } from "@/components/ui/AiThinking";
import { FLAME_COLORS, type Stage } from "@/lib/palette";

// The interactive Remotion walkthrough is browser-only (canvas/timing APIs), so
// load it lazily and skip it during SSR.
const DemoPlayer = dynamic(
  () => import("@/components/landing/DemoPlayer").then((m) => m.DemoPlayer),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-border bg-surface/60 text-sm text-text-muted">
        Loading walkthrough…
      </div>
    ),
  },
);

// The four things a new user does, mirrored by the interactive demo above.
const STEPS: { n: string; title: string; body: string; ai?: boolean }[] = [
  {
    n: "01",
    title: "Light a flame",
    body: "Name a passion you want to tend and pick its color. Ember AI then asks you three short questions about your why — so the flame carries your story.",
    ai: true,
  },
  {
    n: "02",
    title: "Check in daily",
    body: "One tap on a mood is enough. Want to go deeper? Ember AI writes you a personal check-in question based on this flame — always optional, never a gate.",
    ai: true,
  },
  {
    n: "03",
    title: "Watch it grow",
    body: "Every day you show up, the flame climbs through five stages — Spark, Flame, Blaze, Beacon, Phoenix — glowing brighter and moving livelier as it goes.",
  },
  {
    n: "04",
    title: "Miss a day? Grace.",
    body: "Step away and the flame dims to a waiting ember instead of resetting to zero. It's consistency over the last 25 days, not fragile streaks. Return and it's whole again.",
  },
];

// The stage showcase: one flame per stage, each in a distinct palette color,
// grown enough to read as that stage.
const SHOWCASE: { stage: Stage; color: string; days: number }[] = [
  { stage: "Spark", color: FLAME_COLORS[0].hex, days: 3 },
  { stage: "Flame", color: FLAME_COLORS[1].hex, days: 10 },
  { stage: "Blaze", color: FLAME_COLORS[2].hex, days: 30 },
  { stage: "Beacon", color: FLAME_COLORS[3].hex, days: 65 },
  { stage: "Phoenix", color: FLAME_COLORS[4].hex, days: 120 },
];

// Tracks viewport width so the flames can scale with the screen (phone → desktop).
function useViewportWidth() {
  // Start at the desktop breakpoint so server and first client render agree.
  const [width, setWidth] = useState(1280);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

export default function LandingPage() {
  const vw = useViewportWidth();
  // Grow the hero and each showcase flame with the viewport, capped on desktop.
  const heroSize = vw < 480 ? 132 : vw < 768 ? 160 : vw < 1024 ? 184 : 208;
  const stageSize = vw < 400 ? 60 : vw < 640 ? 72 : vw < 1024 ? 92 : 112;

  return (
    <main className="relative flex min-h-full flex-col overflow-hidden bg-canvas text-text">
      {/* Ambient ember glow behind everything. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,53,0.22), transparent 65%)",
          filter: "blur(20px)",
        }}
      />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <span className="text-xl font-semibold tracking-tight text-ember">
          Ember
        </span>
        <div className="flex items-center gap-2 text-sm">
          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="rounded-full px-4 py-1.5 text-text-muted transition hover:text-text">
                Sign in
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="rounded-full px-4 py-1.5 text-text-muted transition hover:text-text"
            >
              Enter Ember →
            </Link>
          </Show>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pb-20 pt-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Flame
            color={FLAME_COLORS[0].hex}
            stage="Blaze"
            daysLogged={30}
            consistencyScore={0.85}
            size={heroSize}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-6 max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          Tend the things you&apos;re building.
          <br />
          <span className="text-ember">Watch them burn.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.6 }}
          className="mt-5 max-w-xl text-lg text-text-muted"
        >
          Ember turns each passion into a living flame. Show up and it grows from
          a spark to a phoenix; step away and it dims — no guilt, just grace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Show when="signed-out">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="rounded-xl bg-ember px-6 py-3 text-sm font-medium text-black transition hover:brightness-110">
                Get started
              </button>
            </SignUpButton>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-text transition hover:bg-surface-raised">
                Sign in
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="rounded-xl bg-ember px-6 py-3 text-sm font-medium text-black transition hover:brightness-110"
            >
              Enter Ember →
            </Link>
          </Show>
        </motion.div>
      </section>

      {/* Stage showcase — Spark → Phoenix. */}
      <section className="relative z-10 border-t border-border bg-surface/40 px-5 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-center text-sm uppercase tracking-widest text-text-muted">
            Every flame has five stages
          </p>
          <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-8 sm:gap-x-10">
            {SHOWCASE.map(({ stage, color, days }, i) => (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex flex-col items-center gap-2"
              >
                <Flame
                  color={color}
                  stage={stage}
                  daysLogged={days}
                  consistencyScore={0.8}
                  size={stageSize}
                />
                <span className="text-sm font-medium">{stage}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive walkthrough — the Remotion "how it works" reel, playable. */}
      <section className="relative z-10 border-t border-border px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-widest text-text-muted">
              See it in motion
            </p>
            <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              How Ember works
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-text-muted">
              A one-minute walkthrough of the whole loop. Play it, or scrub to
              any step — it&apos;s running live in your browser.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <DemoPlayer />
          </motion.div>
        </div>
      </section>

      {/* The four steps, spelled out. */}
      <section className="relative z-10 border-t border-border bg-surface/40 px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Four steps, then let it burn
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="rounded-2xl border border-border bg-canvas/60 p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-ember">{s.n}</span>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  {s.ai && <AiBadge />}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Where the AI lives — make Gemini's role explicit and reassuring. */}
      <section className="relative z-10 border-t border-border px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <AiBadge label="Powered by Gemini" />
          </div>
          <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Where the AI comes in
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-muted">
            Ember uses Google Gemini for two small, human moments: the three
            questions it asks when you light a flame, and the personal check-in
            it can offer when you log a day. It never scores or judges you — it
            just helps you notice <em>why</em> a thing matters.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-text-muted/80">
            Every AI call runs on our server, never in your browser — your API
            keys and your words stay private.
          </p>
          <div className="mt-8">
            <Show when="signed-out">
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="rounded-xl bg-ember px-6 py-3 text-sm font-medium text-black transition hover:brightness-110">
                  Light your first flame
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="rounded-xl bg-ember px-6 py-3 text-sm font-medium text-black transition hover:brightness-110"
              >
                Enter Ember →
              </Link>
            </Show>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-5 py-6 text-center text-xs text-text-muted">
        Ember · tend your passions
      </footer>
    </main>
  );
}
