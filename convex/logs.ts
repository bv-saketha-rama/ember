import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { computeStage, consistencyScore } from "./stages";
import { STAGE_FLOORS, type Stage } from "../lib/palette";

// Recompute and cache a flame's derived state from its full log history.
// Returns a milestone string if this write pushed the flame into a new stage.
async function recomputeFlame(
  ctx: any,
  flameId: Id<"flames">,
  prevStage: Stage
): Promise<string | undefined> {
  const logs = await ctx.db
    .query("logs")
    .withIndex("by_flame", (q: any) => q.eq("flameId", flameId))
    .collect();
  const days = new Set<string>(logs.map((l: any) => l.date));
  const daysLogged = days.size;
  const lastLogDate = [...days].sort().at(-1);
  const stage = computeStage(daysLogged);
  const score = consistencyScore(days);
  await ctx.db.patch(flameId, {
    daysLogged,
    currentStage: stage,
    consistencyScore: score,
    lastLogDate,
  });
  return stage !== prevStage &&
    STAGE_FLOORS[stage] > STAGE_FLOORS[prevStage]
    ? `Reached ${stage}`
    : undefined;
}

export const logEntry = mutation({
  args: {
    flameId: v.id("flames"),
    date: v.optional(v.string()), // defaults to today on the client
    mood: v.string(),
    journalText: v.optional(v.string()),
    aiQuestionAsked: v.optional(v.string()),
    aiAnswerGiven: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;
    const flame = await ctx.db.get(args.flameId);
    if (!flame || flame.userId !== userId) throw new Error("Flame not found");

    const date = args.date ?? new Date().toISOString().slice(0, 10);
    const prevStage = computeStage(flame.daysLogged);

    const logId = await ctx.db.insert("logs", {
      flameId: args.flameId,
      userId,
      date,
      mood: args.mood,
      journalText: args.journalText?.trim() || undefined,
      aiQuestionAsked: args.aiQuestionAsked,
      aiAnswerGiven: args.aiAnswerGiven?.trim() || undefined,
      milestoneHit: undefined,
      createdAt: Date.now(),
    });

    const milestone = await recomputeFlame(ctx, args.flameId, prevStage);
    if (milestone) await ctx.db.patch(logId, { milestoneHit: milestone });
    return { logId, milestone };
  },
});

// All of the current user's logs for a given day, with their flame's name/color.
export const logsByDay = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const logs = await ctx.db
      .query("logs")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", identity.subject).eq("date", date)
      )
      .collect();
    return Promise.all(
      logs.map(async (l) => {
        const flame = await ctx.db.get(l.flameId);
        return { ...l, flameName: flame?.name, flameColor: flame?.color };
      })
    );
  },
});

// Distinct log-days in a month → colors present each day (for the calendar).
export const monthSummary = query({
  args: { month: v.string() }, // "YYYY-MM"
  handler: async (ctx, { month }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return {};
    const logs = await ctx.db
      .query("logs")
      .withIndex("by_user_date", (q) => q.eq("userId", identity.subject))
      .collect();
    const byDay: Record<string, string[]> = {};
    for (const l of logs) {
      if (!l.date.startsWith(month)) continue;
      const flame = await ctx.db.get(l.flameId);
      if (!flame) continue;
      (byDay[l.date] ??= []).push(flame.color);
    }
    // De-dupe colors per day, cap at 3 distinct strands.
    for (const day of Object.keys(byDay)) {
      byDay[day] = [...new Set(byDay[day])].slice(0, 3);
    }
    return byDay;
  },
});

// Journal feed — newest first, optionally filtered to one flame.
export const journalFeed = query({
  args: { flameId: v.optional(v.id("flames")) },
  handler: async (ctx, { flameId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    let logs = await ctx.db
      .query("logs")
      .withIndex("by_user_date", (q) => q.eq("userId", identity.subject))
      .collect();
    if (flameId) logs = logs.filter((l) => l.flameId === flameId);
    logs.sort((a, b) => b.createdAt - a.createdAt);
    return Promise.all(
      logs.map(async (l) => {
        const flame = await ctx.db.get(l.flameId);
        return { ...l, flameName: flame?.name, flameColor: flame?.color };
      })
    );
  },
});

// Dev-only: seed backdated logs to fast-forward a flame through its stages.
export const seedBackdated = mutation({
  args: { flameId: v.id("flames"), days: v.number() },
  handler: async (ctx, { flameId, days }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const flame = await ctx.db.get(flameId);
    if (!flame || flame.userId !== identity.subject)
      throw new Error("Flame not found");
    const moods = ["energized", "okay", "rough"];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const date = d.toISOString().slice(0, 10);
      const existing = await ctx.db
        .query("logs")
        .withIndex("by_flame_date", (q) =>
          q.eq("flameId", flameId).eq("date", date)
        )
        .first();
      if (existing) continue;
      await ctx.db.insert("logs", {
        flameId,
        userId: identity.subject,
        date,
        mood: moods[i % 3],
        createdAt: Date.now() - i * 86_400_000,
      });
    }
    await recomputeFlame(ctx, flameId, computeStage(flame.daysLogged));
  },
});
