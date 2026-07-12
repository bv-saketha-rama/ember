"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-2.5-flash";

const TONE =
  "You are Ember, a warm, encouraging companion helping someone sustain a personal passion. " +
  "Be celebratory, curious, and non-judgmental. Never clinical or therapy-like — talk like a supportive friend. " +
  "Keep it to ONE short question (max ~25 words). Return only the question text, no preamble, no quotes.";

// The three fixed origin-story beats. Gemini rephrases each warmly using the
// flame name and prior answers so it feels conversational, not like a form.
const ONBOARDING_INTENTS = [
  "Ask what they are creating this flame for — the reason behind starting it.",
  "Ask what it would mean to them if this became a real part of their life.",
  "Ask what success would feel like here — not perfection, just good enough to feel right.",
];

const ONBOARDING_FALLBACKS = [
  "What are you creating this for?",
  "What would it mean to you if this became part of your life?",
  "What would feel like success here — not perfection, just... good?",
];

function client(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

async function ask(prompt: string, fallback: string): Promise<string> {
  const ai = client();
  if (!ai) return fallback;
  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });
    const text = res.text?.trim();
    return text && text.length > 0 ? text : fallback;
  } catch (e) {
    console.error("Gemini error", e);
    return fallback;
  }
}

export const generateOnboardingQuestion = action({
  args: {
    step: v.number(), // 0, 1, 2
    flameName: v.string(),
    priorAnswers: v.array(
      v.object({ question: v.string(), answer: v.string() })
    ),
  },
  handler: async (_ctx, { step, flameName, priorAnswers }) => {
    const idx = Math.max(0, Math.min(2, step));
    const fallback = ONBOARDING_FALLBACKS[idx];
    const context =
      priorAnswers.length > 0
        ? "So far they told you:\n" +
          priorAnswers
            .map((p) => `- Q: ${p.question}\n  A: ${p.answer}`)
            .join("\n")
        : "This is the first question.";
    const prompt = `${TONE}

They are creating a flame called "${flameName}" — something they want to nurture in their life.
${context}

Now: ${ONBOARDING_INTENTS[idx]}
Make the question feel personal to "${flameName}" and, if there are prior answers, gently build on them.`;
    return ask(prompt, fallback);
  },
});

export const generateCheckinQuestion = action({
  args: { flameId: v.id("flames") },
  handler: async (ctx, { flameId }): Promise<string> => {
    // `any` breaks the circular api type (api includes ai, which references api).
    const flame: any = await ctx.runQuery(api.flames.getFlame, { flameId });
    const fallback = "How did today feel?";
    if (!flame) return fallback;
    const origin = flame.originStory
      .map((p: any) => `- ${p.question} → ${p.answer}`)
      .join("\n");
    const prompt = `${TONE}

The flame is "${flame.name}". They've logged ${flame.daysLogged} day(s) and it's at the ${flame.effectiveStage} stage.
When they started, they said:
${origin || "(no origin story recorded)"}

Ask one warm check-in question about today that references their streak/stage and gently ties back to why they started. Do not be preachy.`;
    return ask(prompt, fallback);
  },
});
