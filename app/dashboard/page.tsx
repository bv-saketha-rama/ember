"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { AnimatePresence, motion } from "motion/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MainShell } from "@/components/MainShell";
import { FlameCard, type FlameView } from "@/components/FlameCard";
import { NewFlameDialog } from "@/components/NewFlameDialog";
import { LogDialog } from "@/components/LogDialog";
import { Flame } from "@/components/flame/Flame";

export default function IdeasPage() {
  const flames = useQuery(api.flames.listFlames) as FlameView[] | undefined;
  const [newOpen, setNewOpen] = useState(false);
  const [logTarget, setLogTarget] = useState<{
    id: Id<"flames">;
    name: string;
  } | null>(null);

  return (
    <MainShell>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your flames</h1>
          <p className="mt-1 text-text-muted">
            The things you&apos;re keeping alive. Tend them and watch them grow.
          </p>
        </div>
        <button
          onClick={() => setNewOpen(true)}
          className="rounded-xl bg-ember px-4 py-2.5 text-sm font-medium text-black transition hover:brightness-110"
        >
          + New Flame
        </button>
      </div>

      {flames === undefined ? (
        <p className="text-text-muted">Kindling…</p>
      ) : flames.length === 0 ? (
        <EmptyState onNew={() => setNewOpen(true)} />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {flames.map((f) => (
              <FlameCard
                key={f._id}
                flame={f}
                onLog={() =>
                  setLogTarget({ id: f._id as Id<"flames">, name: f.name })
                }
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <NewFlameDialog open={newOpen} onClose={() => setNewOpen(false)} />
      <LogDialog
        open={logTarget !== null}
        flameId={logTarget?.id ?? null}
        flameName={logTarget?.name ?? ""}
        onClose={() => setLogTarget(null)}
      />
    </MainShell>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-border py-16 text-center">
      <Flame color="#FF6B35" stage="Spark" size={100} daysLogged={0} />
      <div>
        <h2 className="text-lg font-medium">No flames yet</h2>
        <p className="mt-1 max-w-sm text-text-muted">
          Every passion starts as a spark. Light your first one and give it a
          reason to burn.
        </p>
      </div>
      <button
        onClick={onNew}
        className="rounded-xl bg-ember px-5 py-2.5 text-sm font-medium text-black"
      >
        Light your first flame
      </button>
    </div>
  );
}
