import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Flame } from "./Flame";
import { CANVAS, COLORS, STAGES, TEXT, type Stage } from "./palette";

// An interactive, in-browser walkthrough of *using* Ember: the four things a
// new user does, with the AI moments called out explicitly. Rendered by
// @remotion/player on the landing page (scrub / play / pause).

const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const MUTED = "#B9AEC4";
const FAINT = "#8A7F97";
const EMBER = "#FF6B35";

const Bg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 90% at 50% 38%, #1b1622 0%, ${CANVAS} 62%, #060509 100%)`,
    }}
  />
);

const fade = (frame: number, dur: number, hold = 12) =>
  interpolate(frame, [0, hold, dur - hold, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ── The AI attribution chip, matching the in-app <AiBadge>. ───────────────
const AiChip: React.FC<{ label?: string; scale?: number }> = ({
  label = "Ember AI",
  scale = 1,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8 * scale,
      padding: `${6 * scale}px ${14 * scale}px`,
      borderRadius: 999,
      border: `${1.5 * scale}px solid rgba(255,107,53,0.5)`,
      background: "rgba(255,107,53,0.12)",
      color: EMBER,
      fontFamily: SANS,
      fontSize: 20 * scale,
      fontWeight: 600,
      letterSpacing: 1.5 * scale,
      textTransform: "uppercase",
    }}
  >
    <Spark size={20 * scale} />
    {label}
  </div>
);

const Spark: React.FC<{ size?: number }> = ({ size = 20 }) => {
  const frame = useCurrentFrame();
  const r = Math.sin(frame / 9) * 10;
  const s = 1 + Math.sin(frame / 7) * 0.12;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${r}deg) scale(${s})` }}
    >
      <path
        d="M12 2c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7Z"
        fill="url(#chip-spark)"
      />
      <circle cx="19" cy="5" r="1.5" fill="#FFD60A" />
      <defs>
        <linearGradient id="chip-spark" x1="5" y1="19" x2="19" y2="5">
          <stop offset="0%" stopColor={EMBER} />
          <stop offset="100%" stopColor="#FFD60A" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// A pinned step header: "STEP n" eyebrow + a big title.
const StepHead: React.FC<{ n: number; title: string }> = ({ n, title }) => (
  <div style={{ position: "absolute", top: 54, left: 0, right: 0, textAlign: "center" }}>
    <div
      style={{
        fontFamily: SANS,
        fontSize: 20,
        letterSpacing: 5,
        color: FAINT,
        textTransform: "uppercase",
      }}
    >
      Step {n} of 4
    </div>
    <div
      style={{
        fontFamily: SERIF,
        fontSize: 52,
        color: TEXT,
        fontWeight: 700,
        marginTop: 8,
      }}
    >
      {title}
    </div>
  </div>
);

// A soft card container used for the UI mocks.
const Card: React.FC<{
  children: React.ReactNode;
  width?: number;
  glow?: boolean;
}> = ({ children, width = 460, glow }) => (
  <div
    style={{
      width,
      borderRadius: 20,
      border: glow ? "1.5px solid rgba(255,107,53,0.5)" : "1px solid #2a2432",
      background: glow ? "rgba(255,107,53,0.06)" : "rgba(23,20,28,0.9)",
      padding: 24,
      fontFamily: SANS,
      boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
    }}
  >
    {children}
  </div>
);

// ── Intro ────────────────────────────────────────────────────────────────
const Intro: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 36 });
  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", opacity: fade(frame, dur) }}
    >
      <div style={{ transform: `translateY(${(1 - rise) * 26}px)` }}>
        <Flame stage="Flame" baseColor={COLORS.ember} size={200} />
      </div>
      <div
        style={{ fontFamily: SERIF, fontSize: 72, color: TEXT, fontWeight: 700, marginTop: 8 }}
      >
        How Ember works
      </div>
      <div style={{ fontFamily: SANS, fontSize: 26, color: MUTED, marginTop: 8 }}>
        Four steps — and an AI that learns your <em>why</em>.
      </div>
    </AbsoluteFill>
  );
};

// ── Step 1: light a flame (name + color), AI asks about it ────────────────
const Step1: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 16 }, durationInFrames: 26 });
  const dots = ["#FF6B35", "#3A86FF", "#8338EC", "#06D6A0", "#EF476F", "#00B4D8"];
  return (
    <AbsoluteFill style={{ opacity: fade(frame, dur) }}>
      <StepHead n={1} title="Light a flame" />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 40, flexDirection: "row" }}
      >
        <div style={{ transform: `scale(${0.9 + pop * 0.1})` }}>
          <Flame stage="Spark" baseColor={COLORS.ember} size={210} />
        </div>
        <Card>
          <div style={{ fontSize: 15, color: FAINT, letterSpacing: 1, textTransform: "uppercase" }}>
            Name your passion
          </div>
          <div
            style={{
              marginTop: 10,
              borderRadius: 12,
              border: "1px solid #2a2432",
              background: "#0f0d13",
              padding: "14px 16px",
              fontSize: 24,
              color: TEXT,
            }}
          >
            Running
            <span style={{ opacity: (Math.sin(frame / 6) + 1) / 2, color: EMBER }}>|</span>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            {dots.map((c, i) => (
              <div
                key={c}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  background: c,
                  outline: i === 0 ? `2px solid ${c}` : "none",
                  outlineOffset: 3,
                  boxShadow: i === 0 ? `0 0 14px ${c}` : "none",
                }}
              />
            ))}
          </div>
          <div
            style={{
              marginTop: 22,
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: MUTED,
              fontSize: 18,
            }}
          >
            <AiChip scale={0.8} />
            asks 3 questions about your <em>why</em>.
          </div>
        </Card>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Step 2: check in daily — a tap, plus an optional AI question ───────────
const Step2: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const moods = [
    { g: "🔥", l: "Energized" },
    { g: "🙂", l: "Okay" },
    { g: "🌧️", l: "Rough" },
  ];
  const picked = frame > 22 ? 0 : -1;
  // The AI question types in, char by char.
  const q = "What pulled you to the run today?";
  const typed = Math.floor(interpolate(frame, [40, 92], [0, q.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  return (
    <AbsoluteFill style={{ opacity: fade(frame, dur) }}>
      <StepHead n={2} title="Check in — a tap is enough" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Card width={560}>
          <div style={{ display: "flex", gap: 14 }}>
            {moods.map((m, i) => (
              <div
                key={m.l}
                style={{
                  flex: 1,
                  borderRadius: 14,
                  border: `1px solid ${i === picked ? EMBER : "#2a2432"}`,
                  background: i === picked ? "rgba(255,107,53,0.08)" : "transparent",
                  padding: "16px 0",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 34 }}>{m.g}</div>
                <div style={{ fontSize: 15, color: MUTED, marginTop: 4 }}>{m.l}</div>
              </div>
            ))}
          </div>
          {/* AI check-in card */}
          <div
            style={{
              marginTop: 20,
              borderRadius: 14,
              border: "1.5px solid rgba(255,107,53,0.45)",
              background: "rgba(255,107,53,0.06)",
              padding: 18,
              opacity: interpolate(frame, [34, 46], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <AiChip scale={0.8} />
            <div style={{ marginTop: 12, fontSize: 24, color: TEXT, minHeight: 34 }}>
              {q.slice(0, typed)}
              {typed < q.length && (
                <span style={{ color: EMBER, opacity: (Math.sin(frame / 5) + 1) / 2 }}>|</span>
              )}
            </div>
            <div style={{ marginTop: 6, fontSize: 16, color: FAINT }}>
              Optional — answer only if you feel like it.
            </div>
          </div>
        </Card>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Step 3: it grows through the five stages ──────────────────────────────
const STAGE_DAYS: Record<Stage, number> = {
  Spark: 1,
  Flame: 9,
  Blaze: 24,
  Beacon: 63,
  Phoenix: 100,
};
const stageColor = (s: Stage) =>
  s === "Spark"
    ? COLORS.ember
    : s === "Flame"
      ? COLORS.sapphire
      : s === "Blaze"
        ? COLORS.violet
        : s === "Beacon"
          ? COLORS.emerald
          : COLORS.crimson;

const Step3: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const per = dur / STAGES.length;
  const idx = Math.min(STAGES.length - 1, Math.floor(frame / per));
  const stage = STAGES[idx];
  const local = frame - idx * per;
  const pop = spring({ frame: local, fps, config: { damping: 14, mass: 0.6 }, durationInFrames: 26 });
  const color = stageColor(stage);
  const day = Math.round(
    interpolate(local, [0, per * 0.6], [0, STAGE_DAYS[stage]], { extrapolateRight: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ opacity: fade(frame, dur, 14) }}>
      <StepHead n={3} title="Show up — it grows" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `translateY(-8px) scale(${0.92 + pop * 0.08})` }}>
          <Flame stage={stage} baseColor={color} size={210} seed={idx} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 70, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontSize: 46, color: TEXT, fontWeight: 700 }}>{stage}</div>
        <div style={{ fontFamily: SANS, fontSize: 22, color: MUTED, marginTop: 2 }}>
          {day} {day === 1 ? "day" : "days"} tended
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
          {STAGES.map((s, i) => (
            <div
              key={s}
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                background: i <= idx ? color : "#2a2432",
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Step 4: grace — miss days, it dims, then relights ─────────────────────
const Step4: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [0, dur * 0.4, dur * 0.62, dur * 0.82], [0, 0.85, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const caption =
    frame < dur * 0.55
      ? "Miss a few days…"
      : frame < dur * 0.8
        ? "…it dims to an ember and waits."
        : "You return — it's whole again.";
  return (
    <AbsoluteFill style={{ opacity: fade(frame, dur) }}>
      <StepHead n={4} title="Grace, not guilt" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: "translateY(-6px)" }}>
          <Flame stage="Blaze" baseColor={COLORS.ember} size={210} dim={dim} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 78, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontSize: 38, color: TEXT, height: 48 }}>{caption}</div>
        <div style={{ fontFamily: SANS, fontSize: 20, color: FAINT, marginTop: 4 }}>
          Consistency, not streaks — logged 18 of the last 25 days.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Outro CTA ─────────────────────────────────────────────────────────────
const Outro: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 36 });
  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", opacity: fade(frame, dur, 14) }}
    >
      <div style={{ transform: `translateY(${(1 - rise) * 22}px)` }}>
        <Flame stage="Phoenix" baseColor={COLORS.crimson} size={200} />
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 60, color: TEXT, fontWeight: 700, marginTop: 6 }}>
        Your turn.
      </div>
      <div style={{ fontFamily: SANS, fontSize: 24, color: MUTED, marginTop: 8 }}>
        Light your first flame — it takes a minute.
      </div>
    </AbsoluteFill>
  );
};

// Scene durations at 30fps.
const S = { intro: 66, s1: 132, s2: 132, s3: 210, s4: 120, outro: 78 };
export const HOWITWORKS_DURATION =
  S.intro + S.s1 + S.s2 + S.s3 + S.s4 + S.outro;
export const HOWITWORKS_FPS = 30;
export const HOWITWORKS_W = 1280;
export const HOWITWORKS_H = 720;

export const HowItWorks: React.FC = () => {
  let at = 0;
  const seq = (dur: number) => {
    const from = at;
    at += dur;
    return { from, durationInFrames: dur };
  };
  const a = seq(S.intro),
    b = seq(S.s1),
    c = seq(S.s2),
    d = seq(S.s3),
    e = seq(S.s4),
    f = seq(S.outro);
  return (
    <AbsoluteFill style={{ backgroundColor: CANVAS }}>
      <Bg />
      <Sequence {...a}>
        <Intro dur={S.intro} />
      </Sequence>
      <Sequence {...b}>
        <Step1 dur={S.s1} />
      </Sequence>
      <Sequence {...c}>
        <Step2 dur={S.s2} />
      </Sequence>
      <Sequence {...d}>
        <Step3 dur={S.s3} />
      </Sequence>
      <Sequence {...e}>
        <Step4 dur={S.s4} />
      </Sequence>
      <Sequence {...f}>
        <Outro dur={S.outro} />
      </Sequence>
    </AbsoluteFill>
  );
};
