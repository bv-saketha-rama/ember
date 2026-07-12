"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Flame } from "@/components/flame/Flame";
import { FLAME_COLORS, type Stage } from "@/lib/palette";

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

      <footer className="relative z-10 px-5 py-6 text-center text-xs text-text-muted">
        Ember · tend your passions
      </footer>
    </main>
  );
}
