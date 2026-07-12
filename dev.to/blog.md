*This is a submission for the [Weekend Challenge: Passion Edition](https://dev.to/challenges/weekend-2026-07-09)*

# Ember — tend the things you&apos;re building, and watch them burn 🔥

![Ember cover — a phoenix flame on a dark canvas](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/dev.to/assets/cover.png)

## What I Built

**[Ember](https://github.com/bv-saketha-rama/ember)** is a passion tracker built around one idea: showing up should feel encouraging, even when life gets messy.

Habit trackers often make a missed day feel like failure. Ember treats a passion more like a fire. Every project, practice, or habit gets its own flame, color, and origin story. Tend it and it grows from **Spark** to **Flame**, **Blaze**, **Beacon**, and finally **Phoenix**.

![The five Ember flame stages](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/docs/flames/stages.svg)

The important twist is what happens when you miss a day. Ember measures consistency across the last 25 days instead of storing a brittle streak. A short gap dims the flame into a warm ember; a longer absence visually steps it back one stage. Log again and it returns immediately. No guilt, no reset — just a reason to come back.

![Flames growing from Spark to Phoenix](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/dev.to/assets/flame-growth.png)

## Demo

**Live app:** [ember-two-sigma.vercel.app](https://ember-two-sigma.vercel.app)

{% embed https://github.com/bv-saketha-rama/ember %}

The core flow is deliberately small:

1. Name a passion and choose its color.
2. Answer three short, Gemini-phrased questions about why it matters.
3. Log a mood and an optional reflection whenever you show up.
4. Watch the flame grow, review the calendar, and revisit the journal.

![A well-tended Ember dashboard](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/dev.to/assets/dashboard-used.png)

![A calendar with braided flame-days](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/dev.to/assets/calendar-braided.png)

![Journal entries with optional AI check-ins](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/dev.to/assets/journal-checkins.png)

## Code

The project is open source: [github.com/bv-saketha-rama/ember](https://github.com/bv-saketha-rama/ember).

- [`convex/stages.ts`](https://github.com/bv-saketha-rama/ember/blob/main/convex/stages.ts) contains the pure stage, consistency, grace, and decay mechanics.
- [`convex/ai.ts`](https://github.com/bv-saketha-rama/ember/blob/main/convex/ai.ts) keeps Gemini calls server-side.
- [`components/flame/Flame.tsx`](https://github.com/bv-saketha-rama/ember/blob/main/components/flame/Flame.tsx) renders the stage-aware animated SVG flame.
- [`components/flame/BraidedFlame.tsx`](https://github.com/bv-saketha-rama/ember/blob/main/components/flame/BraidedFlame.tsx) visualizes several passions tended on one day.

## How I Built It

**Stack:** Next.js 16, React 19, Convex, Clerk, Google Gemini 2.5 Flash, Tailwind CSS v4, Motion, Vitest, and Remotion.

### The mechanics came first

All flame behavior lives in a dependency-free module. Distinct logged days determine the stage; a rolling 25-day window determines consistency; the gap since the last log determines whether a flame is burning, in grace, or decayed. These values are computed live, so the database never needs a destructive “reset streak” mutation. The mechanics are covered by 18 Vitest tests.

### The flame is the interface

Each stage has its own scale, glow, flicker, tongues, and particle behavior. A single Motion-powered SVG component renders those visual states. Beacon grows multiple tongues, Phoenix becomes a golden bird, and grace/decay lower the glow without erasing the underlying work.

### Gemini makes setup feel human

Creating a flame is a short conversation rather than a form. A Convex server-side action asks Gemini for one warm question at a time, using the flame name and previous answers as context. The daily check-in uses the same pattern. The API key stays in Convex, never in the browser, and handwritten fallback questions keep the flow usable when Gemini is unavailable.

### Several passions can share a day

The calendar uses braided colors when multiple flames are logged on the same date. That makes a full day visible without turning the experience into a leaderboard or streak counter.

## Prize Categories

### Best Use of Google AI

Gemini powers Ember&apos;s onboarding conversation and optional daily check-ins. It is integrated through Convex actions, with server-side secrets and graceful fallbacks. The AI does not replace the product&apos;s mechanics; it gives the mechanics a warmer voice and helps each flame remember why it exists.

## Try it

If you have something you&apos;re trying to keep alive — writing, running, music, a side project — [light a flame](https://ember-two-sigma.vercel.app) and see what happens when progress is allowed to be forgiving.
