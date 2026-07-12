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

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// A dim vignette background shared by every scene.
const Bg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 90% at 50% 40%, #1b1622 0%, ${CANVAS} 60%, #060509 100%)`,
    }}
  />
);

const fade = (frame: number, dur: number, hold = 12) =>
  interpolate(
    frame,
    [0, hold, dur - hold, dur],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

// A pinned uppercase eyebrow at the top of a scene (never collides with art).
const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      top: 66,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: SANS,
      fontSize: 22,
      letterSpacing: 5,
      color: "#8A7F97",
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

// ── Scene 1: brand intro ────────────────────────────────────────────────
const Intro: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  const o = fade(frame, dur);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `translateY(${(1 - rise) * 30}px)` }}>
        <Flame stage="Flame" baseColor={COLORS.ember} size={240} />
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 96,
          color: TEXT,
          fontWeight: 700,
          marginTop: 12,
          letterSpacing: -2,
        }}
      >
        Ember
      </div>
      <div style={{ fontFamily: SANS, fontSize: 30, color: "#B9AEC4", marginTop: 6 }}>
        Tend the things you're building. Watch them burn.
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: growth through the five stages ─────────────────────────────
const STAGE_DAYS: Record<Stage, number> = {
  Spark: 1,
  Flame: 9,
  Blaze: 24,
  Beacon: 63,
  Phoenix: 100,
};

const Growth: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const per = dur / STAGES.length;
  const idx = Math.min(STAGES.length - 1, Math.floor(frame / per));
  const stage = STAGES[idx];
  const local = frame - idx * per;
  const pop = spring({ frame: local, fps, config: { damping: 14, mass: 0.6 }, durationInFrames: 30 });
  const o = fade(frame, dur, 14);

  // animated day counter that eases toward the stage's day value
  const day = Math.round(interpolate(local, [0, per * 0.6], [0, STAGE_DAYS[stage]], {
    extrapolateRight: "clamp",
  }));

  const color =
    stage === "Spark"
      ? COLORS.ember
      : stage === "Flame"
      ? COLORS.sapphire
      : stage === "Blaze"
      ? COLORS.violet
      : stage === "Beacon"
      ? COLORS.emerald
      : COLORS.crimson;

  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Eyebrow>Show up. It grows.</Eyebrow>
      {/* centered flame, nudged up so it clears the bottom label zone */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `translateY(-36px) scale(${0.92 + pop * 0.08})` }}>
          <Flame stage={stage} baseColor={color} size={224} seed={idx} />
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: 74,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: SERIF, fontSize: 58, color: TEXT, fontWeight: 700 }}>
          {stage}
        </div>
        <div style={{ fontFamily: SANS, fontSize: 26, color: "#B9AEC4", marginTop: 2 }}>
          {day} {day === 1 ? "day" : "days"} tended
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "center" }}>
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

// ── Scene 3: grace, not guilt ───────────────────────────────────────────
const Grace: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const o = fade(frame, dur);
  // dim up (miss days) then relight (return)
  const dim = interpolate(
    frame,
    [0, dur * 0.4, dur * 0.62, dur * 0.8],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const caption =
    frame < dur * 0.55
      ? "Miss a few days…"
      : frame < dur * 0.78
      ? "…it dims to an ember and waits."
      : "You return — it's whole again.";
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Eyebrow>Grace, not guilt</Eyebrow>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: "translateY(-30px)" }}>
          <Flame stage="Blaze" baseColor={COLORS.ember} size={224} dim={dim} />
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: 84,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: SERIF, fontSize: 40, color: TEXT, height: 52 }}>{caption}</div>
        <div style={{ fontFamily: SANS, fontSize: 22, color: "#8A7F97", marginTop: 4 }}>
          Consistency, not streaks — logged 18 of the last 25 days
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: braided flames ─────────────────────────────────────────────
const Braid: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const o = fade(frame, dur);
  const cols = [COLORS.ember, COLORS.emerald, COLORS.sapphire];
  const spread = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: o }}>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 22,
          letterSpacing: 4,
          color: "#8A7F97",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Braided flames
      </div>
      <div style={{ position: "relative", width: 520, height: 360 }}>
        {cols.map((c, i) => {
          const off = (i - 1) * 120 * spread;
          const sway = Math.sin(frame / 12 + i * 2) * 10;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 260 - 130 + off + sway,
                top: 20,
                transform: `scale(${0.9})`,
              }}
            >
              <Flame stage="Flame" baseColor={c} size={260} seed={i * 3} />
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 40, color: TEXT, marginTop: 8 }}>
        Tend several in a day — they twist together.
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: outro ──────────────────────────────────────────────────────
const Outro: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  const o = fade(frame, dur, 14);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `translateY(${(1 - rise) * 24}px)` }}>
        <Flame stage="Phoenix" baseColor={COLORS.crimson} size={220} />
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 72, color: TEXT, fontWeight: 700, marginTop: 8 }}>
        Ember
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 30,
          color: "#FF6B35",
          marginTop: 10,
          fontWeight: 600,
        }}
      >
        ember-two-sigma.vercel.app
      </div>
      <div style={{ fontFamily: SANS, fontSize: 20, color: "#8A7F97", marginTop: 8 }}>
        Next.js · Convex · Clerk · Google Gemini
      </div>
    </AbsoluteFill>
  );
};

export const Walkthrough: React.FC = () => {
  // frames (30fps)
  const s1 = 75; // intro 2.5s
  const s2 = 270; // growth 9s
  const s3 = 105; // grace 3.5s
  const s4 = 75; // braid 2.5s
  const s5 = 90; // outro 3s
  let at = 0;
  const seq = (dur: number) => {
    const from = at;
    at += dur;
    return { from, durationInFrames: dur };
  };
  const a = seq(s1), b = seq(s2), c = seq(s3), d = seq(s4), e = seq(s5);
  return (
    <AbsoluteFill style={{ backgroundColor: CANVAS }}>
      <Bg />
      <Sequence {...a}>
        <Intro dur={s1} />
      </Sequence>
      <Sequence {...b}>
        <Growth dur={s2} />
      </Sequence>
      <Sequence {...c}>
        <Grace dur={s3} />
      </Sequence>
      <Sequence {...d}>
        <Braid dur={s4} />
      </Sequence>
      <Sequence {...e}>
        <Outro dur={s5} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const DURATION = 75 + 270 + 105 + 75 + 90;
