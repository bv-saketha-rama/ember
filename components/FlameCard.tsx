"use client";

import { motion } from "motion/react";
import { Flame } from "./flame/Flame";
import type { Stage } from "@/lib/palette";

export interface FlameView {
  _id: string;
  name: string;
  color: string;
  daysLogged: number;
  consistencyScore: number;
  effectiveStage: Stage;
  dimmed: boolean;
  lifeState: "burning" | "grace" | "decayed";
  gap: number;
}

export function FlameCard({
  flame,
  onLog,
}: {
  flame: FlameView;
  onLog: () => void;
}) {
  const pct = Math.round(flame.consistencyScore * 100);
  const stateLabel =
    flame.lifeState === "decayed"
      ? "needs relighting"
      : flame.lifeState === "grace"
        ? "dimming — a log will revive it"
        : "burning";

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-5 text-center"
    >
      <div className="flex h-32 items-end">
        <Flame
          color={flame.color}
          stage={flame.effectiveStage}
          daysLogged={flame.daysLogged}
          consistencyScore={flame.consistencyScore}
          dimmed={flame.dimmed}
          size={120}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold leading-tight">{flame.name}</h3>
        <p className="text-sm text-text-muted">
          {flame.effectiveStage} · {flame.daysLogged} day
          {flame.daysLogged === 1 ? "" : "s"}
        </p>
      </div>

      {/* Consistency bar. */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-text-muted">
          <span>consistency</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: flame.effectiveStage === "Phoenix" ? "#FFD60A" : flame.color,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          />
        </div>
        <p className="mt-1 text-[11px] text-text-muted">{stateLabel}</p>
      </div>

      <button
        onClick={onLog}
        className="mt-1 w-full rounded-xl bg-surface-raised py-2 text-sm font-medium transition hover:bg-border"
      >
        Log today
      </button>
    </motion.div>
  );
}
