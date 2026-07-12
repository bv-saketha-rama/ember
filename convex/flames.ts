import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { computeStage, effectiveStage, lifeState } from "./stages";

async function requireUser(ctx: { auth: { getUserIdentity: () => Promise<any> } }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity.subject as string;
}

export const listFlames = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;
    const flames = await ctx.db
      .query("flames")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return flames.map((f) => {
      const { stage, dimmed } = effectiveStage(f.daysLogged, f.lastLogDate);
      const { state, gap } = lifeState(f.lastLogDate);
      return { ...f, effectiveStage: stage, dimmed, lifeState: state, gap };
    });
  },
});

export const getFlame = query({
  args: { flameId: v.id("flames") },
  handler: async (ctx, { flameId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const flame = await ctx.db.get(flameId);
    if (!flame || flame.userId !== identity.subject) return null;
    const { stage, dimmed } = effectiveStage(flame.daysLogged, flame.lastLogDate);
    const { state, gap } = lifeState(flame.lastLogDate);
    return { ...flame, effectiveStage: stage, dimmed, lifeState: state, gap };
  },
});

export const createFlame = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    originStory: v.array(
      v.object({ question: v.string(), answer: v.string() })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    return await ctx.db.insert("flames", {
      userId,
      name: args.name.trim(),
      color: args.color,
      originStory: args.originStory,
      createdAt: Date.now(),
      daysLogged: 0,
      currentStage: computeStage(0),
      consistencyScore: 0,
      lastLogDate: undefined,
    });
  },
});

export const deleteFlame = mutation({
  args: { flameId: v.id("flames") },
  handler: async (ctx, { flameId }) => {
    const userId = await requireUser(ctx);
    const flame = await ctx.db.get(flameId);
    if (!flame || flame.userId !== userId) throw new Error("Not found");
    const logs = await ctx.db
      .query("logs")
      .withIndex("by_flame", (q) => q.eq("flameId", flameId))
      .collect();
    for (const log of logs) await ctx.db.delete(log._id);
    await ctx.db.delete(flameId);
  },
});
