import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  flames: defineTable({
    userId: v.string(), // Clerk subject
    name: v.string(),
    color: v.string(), // hex from the fixed palette
    originStory: v.array(
      v.object({ question: v.string(), answer: v.string() })
    ),
    createdAt: v.number(),
    // Cached derived state (recomputed on each log write / read as needed).
    daysLogged: v.number(), // distinct days with a log
    currentStage: v.string(),
    consistencyScore: v.number(), // 0..1
    lastLogDate: v.optional(v.string()), // "YYYY-MM-DD"
  }).index("by_user", ["userId"]),

  logs: defineTable({
    flameId: v.id("flames"),
    userId: v.string(),
    date: v.string(), // "YYYY-MM-DD" local day key
    mood: v.string(), // energized | okay | rough
    journalText: v.optional(v.string()),
    aiQuestionAsked: v.optional(v.string()),
    aiAnswerGiven: v.optional(v.string()),
    milestoneHit: v.optional(v.string()), // e.g. "Reached Blaze"
    createdAt: v.number(),
  })
    .index("by_flame", ["flameId"])
    .index("by_flame_date", ["flameId", "date"])
    .index("by_user_date", ["userId", "date"]),
});
