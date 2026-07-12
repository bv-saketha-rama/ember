<div align="center">

# 🔥 Ember

### Tend the things you're building. Watch them burn.

**Ember turns each passion into a living flame** — show up and it grows from a spark to a phoenix; step away and it dims. No streaks to shatter, no guilt. Just grace.

<img src="docs/flames/stages.svg" alt="The five flame stages: Spark, Flame, Blaze, Beacon, Phoenix" width="100%" />

*Built for the [Weekend Challenge: Passion Edition](https://dev.to/challenges/weekend-2026-07-09).*

</div>

---

## What is Ember?

Most habit trackers punish you: miss a day and your streak resets to zero. Ember rejects that. Every passion you're nurturing — writing, guitar, running, a side project — becomes a **flame** with its own color and origin story. You log a moment each day, and the flame *grows*. Life happens and you skip a few days? It dims into a soft ember and waits for you — it doesn't die.

The result is a calm, living dashboard of the things that matter to you, and a gentle nudge to keep them alive.

## ✨ Features

- **🔥 Living flames** — each passion is an animated flame that visibly grows through five stages as you show up.
- **🎨 A conversation, not a form** — new flames are born through a warm 3-question onboarding, phrased on the fly by **Google Gemini**, that captures *why* this matters to you.
- **🌡️ Consistency over streaks** — progress is measured as "logged X of the last 25 days," so one missed day never wipes your effort.
- **🕊️ Grace, not guilt** — miss two days and the flame dims to a warm ember; it only steps back a stage after a longer absence, and recovers the moment you return.
- **🪢 Braided flames** — log more than one passion on the same day and the calendar shows their colors twisting together, celebrating a full day.
- **🤖 AI check-ins** — an optional daily prompt from Gemini that references your stage and origin story — like a friend who remembers why you started.
- **📅 Calendar & journal** — a month view of your flame-days and a searchable feed of every reflection you've written.
- **🔒 Private by design** — the Gemini key never touches the browser; all AI runs server-side in Convex.

## 🌱 The flame system

Every flame moves through five stages, driven by the number of **distinct days** you've logged — not raw time.

<div align="center">
<table>
<tr>
<td align="center"><img src="docs/flames/spark.svg" width="80" /><br/><b>Spark</b><br/><sub>day 0</sub></td>
<td align="center"><img src="docs/flames/flame.svg" width="80" /><br/><b>Flame</b><br/><sub>7 days</sub></td>
<td align="center"><img src="docs/flames/blaze.svg" width="80" /><br/><b>Blaze</b><br/><sub>20 days</sub></td>
<td align="center"><img src="docs/flames/beacon.svg" width="80" /><br/><b>Beacon</b><br/><sub>50 days</sub></td>
<td align="center"><img src="docs/flames/phoenix.svg" width="80" /><br/><b>Phoenix</b><br/><sub>100 days</sub></td>
</tr>
</table>
</div>

- **Growth is front-loaded** — big, visible gains early (Spark → Flame), then size flattens and the reward shifts to glow, faster flicker, extra tongues (Beacon), and ember particles.
- **Consistency score** (`0–1`) = distinct days logged in the trailing 25-day window ÷ 25. It drives the flame's glow brightness.
- **Grace & decay** are computed *live* on read, never stored destructively:
  - `0–1 day` gap → **burning** 🔥
  - `2–4 day` gap → **grace** (dims to a warm ember, keeps its stage) 🕯️
  - `5+ day` gap → **decayed** (drops one stage visually, dims) — snaps back the instant you log again.

All of this lives in a tiny, fully unit-tested pure module (`convex/stages.ts`).

## 🧱 Tech stack

| Layer | Choice | Why |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 | Modern RSC app, fast HMR |
| **Backend / DB** | [Convex](https://convex.dev) | Reactive queries, serverless functions, live sync |
| **Auth** | [Clerk](https://clerk.com) (Email + Google only) | Embedded in-app auth via `ConvexProviderWithClerk` |
| **AI** | [Google Gemini](https://ai.google.dev) `gemini-2.5-flash` | Warm, on-brand copy — free tier, server-side only |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) (`@theme` in CSS) | Design tokens for the Ember palette |
| **Motion** | [Motion](https://motion.dev) (Framer Motion) | The flames' flicker, glow, and growth springs |
| **Testing** | [Vitest](https://vitest.dev) | 18 unit tests over the flame mechanics |

## 🏗️ How it works

```
Browser (Next.js / React)
   │  useQuery / useMutation / useAction   (Convex React + Clerk JWT)
   ▼
Convex  ──────────────────────────────────────────────
   ├─ queries/mutations   flames.ts · logs.ts   (per-user, Clerk-scoped)
   ├─ pure mechanics       stages.ts             (stage · consistency · grace)
   └─ "use node" action    ai.ts ──► Google Gemini API
                                       ▲
                     GEMINI_API_KEY  ──┘  (Convex env var — never sent to the client)
```

> **Security note.** The Gemini API key is held only as a Convex environment variable and is used exclusively inside a server-side Convex action (`convex/ai.ts`). It is **never** bundled into the browser. The client calls `useAction(api.ai.…)`, and Convex makes the outbound request.

### Project structure

```
app/
  page.tsx              Landing page (public) — hero flame + modal Clerk auth
  dashboard/            "Ideas" — your grid of flames (protected)
  calendar/             Month view with braided flame-days
  journal/              Searchable reflection feed
  sign-in · sign-up/    Embedded Clerk pages
components/
  flame/                Flame.tsx · BraidedFlame.tsx · flameShapes.ts (SVG art)
  FlameCard · LogDialog · NewFlameDialog · Nav · MainShell · ...
convex/
  schema.ts             flames + logs tables
  flames.ts · logs.ts   per-user queries & mutations
  stages.ts             pure, tested flame mechanics
  ai.ts                 "use node" Gemini action (onboarding + check-ins)
  auth.config.ts        Clerk ↔ Convex JWT config
lib/
  palette.ts            design tokens + mechanics constants
  dates.ts              local-tz day-key helpers
tests/                  Vitest specs for dates + stages
```

## 🚀 Getting started

### Prerequisites

- **Node.js 18+**
- Free accounts: [Convex](https://convex.dev), [Clerk](https://clerk.com), and a [Google AI Studio](https://aistudio.google.com/app/apikey) key.

### 1. Install

```bash
git clone <your-repo-url> ember
cd ember
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in your Clerk keys and Convex URLs in `.env.local`. See `.env.example` for the full annotated list.

### 3. Set up Convex

```bash
npx convex dev        # creates your deployment, writes CONVEX_* vars, watches functions
```

Then set the two **server-side** secrets (these live in Convex, never in the browser):

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-subdomain>.clerk.accounts.dev
npx convex env set GEMINI_API_KEY <your-gemini-key>
```

### 4. Configure Clerk

- In the Clerk dashboard, enable **Email** and **Google** sign-in only (disable other providers).
- Create a **JWT template named `convex`** with the claim `{ "aud": "convex" }`.

### 5. Run

```bash
npm run dev           # in another terminal, alongside `npx convex dev`
```

Open **http://localhost:3000** and light your first flame. 🔥

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npx convex dev` | Convex backend (run alongside `dev`) |

## ✅ Testing

The flame mechanics — stage thresholds, consistency scoring, grace/decay — are pure functions with **18 unit tests**:

```bash
npm run test
```

## ☁️ Deployment

1. **Convex** — `npx convex deploy` for a production deployment, and set `CLERK_JWT_ISSUER_DOMAIN` + `GEMINI_API_KEY` on it via `npx convex env set … --prod`.
2. **Vercel** — import the repo and add every variable from `.env.example` (the `NEXT_PUBLIC_*` and `CLERK_SECRET_KEY` values) in the project settings. Point `NEXT_PUBLIC_CONVEX_URL` at your production Convex deployment.

```bash
vercel            # preview
vercel --prod     # production
```

---

<div align="center">
<sub>🔥 <b>Ember</b> · tend your passions · built with Next.js, Convex, Clerk & Google Gemini</sub>
</div>
