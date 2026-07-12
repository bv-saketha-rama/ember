*This is a submission for [Weekend Challenge: Passion Edition](https://dev.to/challenges/weekend-2026-07-09)*

## What I Built

**[Ember](https://github.com/your-username/ember) — tend the things you're building, and watch them burn.** 🔥

Every habit tracker I've used treats a missed day like a moral failure: your streak snaps back to zero and you feel bad enough to quit. That never matched how *passions* actually work. They don't die when you skip a Tuesday — they smoulder, and wait.

So I built Ember around a single metaphor: **each passion is a living flame.** You give it a name, a color, and a reason for existing. Every day you show up, you log a moment, and the flame grows — from a tiny **Spark**, to a steady **Flame**, a roaring **Blaze**, a towering **Beacon**, and finally a golden **Phoenix**.

![The five flame stages](docs/flames/stages.svg)

The twist is what happens when life gets in the way. Ember measures **consistency**, not streaks — "you've shown up 18 of the last 25 days" — so one gap never erases your progress. Miss a couple of days and your flame doesn't die; it dims to a warm ember and waits for you. That's the whole emotional thesis: **grace, not guilt.**

To make it feel personal rather than mechanical, the onboarding is a short *conversation* — Google Gemini phrases three warm questions about why this passion matters to you, and later offers gentle daily check-ins that remember your stage and your original "why."

## Demo

<!-- ▶️ DEMO SLOT: live link + walkthrough GIF/video go here -->

**🔗 Live app:** _<deploy URL — coming from Vercel>_

**🎥 Walkthrough:** _<demo GIF/video embed>_

A quick tour of the flow:
1. **Land** on a branded page and sign in — Clerk auth is embedded right in the app (email or Google), no redirect to a hosted portal.
2. **Light a flame** — name it, pick a color, and answer three Gemini-phrased questions about your "why."
3. **Log a day** — tap a mood, optionally answer an AI check-in, jot a reflection. Watch the flame grow and celebrate milestones.
4. **Look back** — the **calendar** shows your flame-days (with braided colors when you tend several at once) and the **journal** collects every reflection.

## Code

{% embed https://github.com/your-username/ember %}

The whole thing is open source. A few files worth a look:
- [`convex/stages.ts`](convex/stages.ts) — the pure, unit-tested flame mechanics (stage thresholds, consistency score, grace/decay).
- [`convex/ai.ts`](convex/ai.ts) — the server-side Gemini action for onboarding + check-ins.
- [`components/flame/Flame.tsx`](components/flame/Flame.tsx) — the stage-aware animated SVG flame.

## How I Built It

**Stack:** Next.js 16 (App Router) · Convex · Clerk · Google Gemini (`gemini-2.5-flash`) · Tailwind CSS v4 · Motion.

**The flame is the product, so I started with the mechanics.** All the logic — how many distinct days move you between stages, how consistency is scored over a 25-day window, how a gap dims or decays a flame — lives in one dependency-free module (`convex/stages.ts`) with 18 Vitest tests. Everything else renders off that. Grace and decay are computed *live on read* from the last-log date, so nothing destructive is ever written; the moment you return, your flame is whole again.

**Rendering flames that feel alive.** Each stage has its own visual parameters — base scale, flicker speed, glow radius, number of tongues, whether ember particles rise. `Flame.tsx` is a single SVG component driven by Motion springs; Beacon splits into three tongues, Phoenix becomes a golden bird, and a dimmed ember state covers grace/decay. When you log multiple passions on one day, `BraidedFlame.tsx` twists their distinct colors together — no muddy blending, just a braid.

**Google AI, held server-side.** This was a hard rule: the Gemini API key must *never* reach the browser. So every AI call goes through a Convex `"use node"` action (`convex/ai.ts`). The client calls `useAction(api.ai.generateOnboardingQuestion)`, Convex holds `GEMINI_API_KEY` as an environment variable and makes the outbound request, and if the key is missing or the call fails it degrades gracefully to hand-written fallback questions. Gemini gets a consistent "warm friend, one short question, no preamble" system prompt plus the flame's name and prior answers, which is what makes onboarding feel like a chat instead of a form.

**Auth that stays in the app.** Clerk is wired to Convex via `ConvexProviderWithClerk` and a `convex` JWT template, and I deliberately kept the sign-in/up UI embedded (modals over the landing page) rather than bouncing users to Clerk's hosted portal — every flame and log is scoped to the Clerk user id on the backend.

**Interesting decision: consistency, not streaks.** It would have been easier to store a `streak` integer and reset it on a miss. Choosing a rolling-window consistency score instead changed the entire feel of the app — it's forgiving by construction, and it's what lets the "grace" state exist without any nagging.

## Prize Categories

**Best Use of Google AI** — Google Gemini (`gemini-2.5-flash`) powers Ember's whole voice: it turns a flat setup form into a warm three-question conversation about *why* a passion matters, and delivers daily check-ins that reference your stage and origin story. Crucially, it's integrated the responsible way — entirely server-side through Convex actions, with the API key never exposed to the client and graceful fallbacks when it's unavailable.

<!-- Thanks for participating! -->
