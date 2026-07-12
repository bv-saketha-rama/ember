*This is a submission for the [Weekend Challenge: Passion Edition](https://dev.to/challenges/weekend-2026-07-09)*

# Ember: tend the things you're building, and watch them burn

![Ember cover - a phoenix flame on a dark canvas](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/dev.to/assets/cover.png)

## What I Built

**[Ember](https://github.com/bv-saketha-rama/ember)** is a passion tracker for the things people want to keep alive: writing, running, music, learning, or a side project.

The idea came from a frustration with traditional habit trackers. A missed day can turn a useful tool into a guilt machine: the streak breaks, the counter goes back to zero, and the work that came before it feels invisible.

Ember uses a different metaphor. Every passion becomes a living flame. You give it a name, a color, and a reason for existing. When you show up, it grows through five stages:

![The five Ember flame stages](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/docs/flames/stages.svg)

**Spark -> Flame -> Blaze -> Beacon -> Phoenix**

The goal is not to be perfect. The goal is to make returning feel worthwhile.

## The core features

### 1. Flames that visibly grow

Every flame is driven by distinct days tended, not by raw clicks or a fragile streak counter:

- Flame at 7 distinct days
- Blaze at 20 days
- Beacon at 50 days
- Phoenix at 100 days

Each stage has its own visual language: scale, glow, flicker, extra tongues, ember particles, and eventually a phoenix silhouette.

![Flames growing from Spark to Phoenix](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/dev.to/assets/flame-growth.png)

### 2. Consistency instead of streaks

Ember measures how many distinct days were tended in the trailing 25-day window. That means one missed day does not erase the previous month of effort.

The flame also has a live life state:

- **Burning:** recently tended and fully bright.
- **Grace:** a short absence dims the flame but keeps its stage.
- **Decayed:** a longer absence lowers the visual stage temporarily.

The underlying progress is never destructively reset. The moment you log again, the flame comes back.

### 3. A calendar that shows a full life

The calendar makes consistency visible without turning it into a leaderboard. A day can show one flame, or several flames braided together when multiple passions were tended on the same date.

![A calendar with real flame silhouettes and braided activity](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/dev.to/assets/calendar-braided.png)

### 4. A journal that remembers the work

Logging a day can be as quick as choosing a mood. If you want to say more, Ember also stores an optional reflection and any AI check-in answer.

The journal then becomes a quiet record of what actually happened: the small wins, the rough days, the milestones, and the reasons you kept going.

![Journal entries from several passions](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/dev.to/assets/journal-checkins.png)

## How the AI is useful

The AI is not a generic chatbot bolted onto the side of the app. It has two focused jobs: help a new flame discover its reason, and make daily reflection easier.

### AI onboarding: turning setup into a conversation

When a user creates a flame, Ember asks three questions about its origin story. Gemini rewrites each question using:

- The name of the flame.
- The user's previous answers.
- A specific conversational intent for that step: why they started, what the passion could mean in their life, and what “good enough” success would feel like.

That makes the setup feel less like filling out metadata and more like explaining something meaningful to a supportive friend.

### AI check-ins: a gentle prompt for today

When logging a day, the user can ask Ember for a personal check-in. Gemini receives the flame's name, current stage, number of tended days, and original answers. It then asks one short question that connects today's effort back to the reason the flame was lit.

![Ember AI asks a gentle journaling check-in](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/dev.to/assets/ai-journal-checkin.png)

The AI prompt is deliberately optional. A mood tap is always enough, and the journal field is always available without answering the AI question. The feature adds reflection when it is useful; it never becomes another obligation.

### Responsible integration

Gemini runs through a server-side Convex action. The API key is stored as a Convex environment variable and never reaches the browser. If the key is missing or the request fails, Ember falls back to concise handwritten questions, so the core experience still works.

## Demo

**Live app:** [ember-two-sigma.vercel.app](https://ember-two-sigma.vercel.app)

{% embed https://github.com/bv-saketha-rama/ember %}

The main flow is:

1. Sign in and create a flame.
2. Choose its color and answer three questions about its story.
3. Log a mood, optional AI answer, and optional journal entry.
4. Watch the flame grow and celebrate stage milestones.
5. Review the calendar and journal whenever you want to look back.

![A well-tended Ember dashboard](https://raw.githubusercontent.com/bv-saketha-rama/ember/main/dev.to/assets/dashboard-used.png)

## How I Built It

**Stack:** Next.js 16, React 19, Convex, Clerk, Google Gemini 2.5 Flash, Tailwind CSS v4, Motion, Vitest, and Remotion.

### Mechanics first

The flame behavior lives in a small pure module, [`convex/stages.ts`](https://github.com/bv-saketha-rama/ember/blob/main/convex/stages.ts). It calculates stage thresholds, the rolling consistency score, grace, decay, and the effective visual stage. Because those rules are pure, they are covered by 18 unit tests and can be reasoned about independently from the UI.

### The flame is the interface

[`components/flame/Flame.tsx`](https://github.com/bv-saketha-rama/ember/blob/main/components/flame/Flame.tsx) is a stage-aware animated SVG component driven by Motion. Beacon uses a dominant central flame with narrower side tongues, while Phoenix switches to a firebird silhouette. [`BraidedFlame.tsx`](https://github.com/bv-saketha-rama/ember/blob/main/components/flame/BraidedFlame.tsx) keeps multiple colors visually separate when several passions share a day.

### Reactive backend and private AI

Convex provides reactive queries and mutations for flames and logs. Clerk scopes the data to the signed-in user. Gemini is called only from [`convex/ai.ts`](https://github.com/bv-saketha-rama/ember/blob/main/convex/ai.ts), which keeps the secret off the client and gives the UI a predictable fallback path.

## Prize Categories

### Best Use of Google AI

Ember uses Google Gemini 2.5 Flash in a focused, human-centered way. It turns flame creation into a contextual three-question conversation and offers optional daily prompts that remember the user's original motivation. The AI adds warmth and continuity while leaving the user in control of what they share.

## Try it

If you have something you're trying to keep alive - a project, practice, or personal goal - [light a flame](https://ember-two-sigma.vercel.app) and see what progress feels like when it is allowed to be forgiving.
