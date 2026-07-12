import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { Flame } from "./Flame";
import { CANVAS, COLORS, STAGES, TEXT, type Stage } from "./palette";

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const MUTED = "#B9AEC4";
const FAINT = "#8A7F97";

const Shell: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(100% 90% at 50% 0%, #211a29 0%, ${CANVAS} 65%)`, padding: 54, color: TEXT, fontFamily: SANS }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
      <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 700, color: COLORS.ember }}>Ember</div>
      <div style={{ display: "flex", gap: 12, color: MUTED, fontSize: 16 }}><span style={{ color: TEXT }}>Ideas</span><span>Calendar</span><span>Journal</span><span style={{ marginLeft: 10 }}>●</span></div>
    </div>
    <h1 style={{ fontFamily: SERIF, fontSize: 52, margin: 0 }}>{title}</h1>
    <p style={{ color: MUTED, fontSize: 22, marginTop: 8 }}>{subtitle}</p>
    {children}
  </AbsoluteFill>
);

const Card: React.FC<{ children: React.ReactNode; width?: number }> = ({ children, width = 330 }) => (
  <div style={{ width, minHeight: 330, border: "1px solid #2a2433", background: "rgba(23,20,28,.88)", borderRadius: 22, padding: 24, boxShadow: "0 22px 60px rgba(0,0,0,.35)" }}>{children}</div>
);

const FlameCard: React.FC<{ name: string; stage: Stage; color: string; days: number; score: string }> = ({ name, stage, color, days, score }) => (
  <Card>
    <div style={{ display: "flex", justifyContent: "center", height: 190 }}><Flame stage={stage} baseColor={color} size={140} seed={days} /></div>
    <div style={{ fontSize: 23, fontWeight: 600 }}>{name}</div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, color: MUTED, fontSize: 15 }}><span>{stage} · {days} days</span><span>{score}% consistency</span></div>
    <div style={{ height: 7, borderRadius: 8, background: "#2a2433", marginTop: 16 }}><div style={{ width: `${score}%`, height: "100%", borderRadius: 8, background: color }} /></div>
    <div style={{ marginTop: 20, color: COLORS.ember, fontSize: 14 }}>Log a moment →</div>
  </Card>
);

export const DevtoCover: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, #3a1e21 0%, ${CANVAS} 62%)`, alignItems: "center", justifyContent: "center", color: TEXT, fontFamily: SANS }}>
    <div style={{ transform: "translateY(-38px)" }}><Flame stage="Phoenix" baseColor={COLORS.crimson} size={250} /></div>
    <div style={{ fontFamily: SERIF, fontSize: 102, fontWeight: 700, marginTop: 4 }}>Ember</div>
    <div style={{ color: MUTED, fontSize: 30, marginTop: 12 }}>Tend the things you&apos;re building. Watch them burn.</div>
    <div style={{ color: COLORS.ember, fontSize: 19, letterSpacing: 4, textTransform: "uppercase", marginTop: 32 }}>Grace, not guilt.</div>
  </AbsoluteFill>
);

export const DevtoGrowth: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(100% 90% at 50% 20%, #251a2b 0%, ${CANVAS} 70%)`, alignItems: "center", justifyContent: "center", color: TEXT, fontFamily: SANS }}>
    <div style={{ position: "absolute", top: 48, textAlign: "center", fontFamily: SERIF, fontSize: 48 }}>Show up. It grows.</div>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 30, marginTop: 70 }}>
      {STAGES.map((stage, i) => <div key={stage} style={{ width: 180, textAlign: "center" }}><div style={{ height: 260, display: "flex", justifyContent: "center", alignItems: "flex-end" }}><Flame stage={stage} baseColor={[COLORS.ember, COLORS.sapphire, COLORS.violet, COLORS.emerald, COLORS.crimson][i]} size={150} seed={i} /></div><div style={{ fontFamily: SERIF, fontSize: 27 }}>{stage}</div><div style={{ color: MUTED, marginTop: 5 }}>{[0, 7, 20, 50, 100][i]} days</div></div>)}
    </div>
  </AbsoluteFill>
);

export const DevtoDashboard: React.FC = () => (
  <Shell title="Your flames" subtitle="The things you&apos;re keeping alive. Tend them and watch them grow.">
    <div style={{ display: "flex", gap: 22, marginTop: 26 }}>
      <FlameCard name="Writing" stage="Beacon" color={COLORS.violet} days={63} score="84" />
      <FlameCard name="Running" stage="Blaze" color={COLORS.ember} days={24} score="72" />
      <FlameCard name="Side project" stage="Flame" color={COLORS.sapphire} days={9} score="48" />
    </div>
  </Shell>
);

export const DevtoCalendar: React.FC = () => {
  const colors = [COLORS.ember, COLORS.sapphire, COLORS.violet, COLORS.emerald, COLORS.crimson];
  const marks = [1, 2, 3, 1, 2, 4, 3, 2, 0, 1, 3, 2, 4, 1, 0, 2, 3, 1, 2, 4, 0, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 3];
  return <Shell title="Calendar" subtitle="A month of showing up, seen at a glance.">
    <div style={{ marginTop: 24, padding: 26, borderRadius: 22, border: "1px solid #2a2433", background: "rgba(23,20,28,.88)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
        {["S", "M", "T", "W", "T", "F", "S", ...Array.from({ length: 35 }, (_, i) => i + 1)].map((value, i) => <div key={i} style={{ height: i < 7 ? 24 : 76, borderRadius: 12, border: i < 7 ? "none" : "1px solid #2a2433", color: i < 7 ? FAINT : TEXT, padding: i < 7 ? 0 : 8, fontSize: 14, textAlign: i < 7 ? "center" : "left" }}>{value}{i >= 7 && marks[i - 7] > 0 ? <div style={{ display: "flex", justifyContent: "center", alignItems: "end", height: 48, marginTop: -2 }}>{colors.slice(0, marks[i - 7]).map((c, j) => <div key={j} style={{ marginLeft: j === 0 ? 0 : -10, zIndex: j, transform: `translateY(${j % 2 ? 3 : 0}px)` }}><Flame stage={j === 0 ? "Flame" : "Spark"} baseColor={c} size={30} seed={i + j} /></div>)}</div> : <div style={{ display: "flex", justifyContent: "center", marginTop: 26, color: "#30293a" }}>•</div>}</div>)}
      </div>
    </div>
  </Shell>;
};

export const DevtoAiJournal: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(100% 90% at 50% 20%, #251a2b 0%, ${CANVAS} 70%)`, alignItems: "center", justifyContent: "center", color: TEXT, fontFamily: SANS }}>
    <div style={{ width: 650, border: "1px solid #2a2433", background: "rgba(23,20,28,.96)", borderRadius: 24, padding: 30, boxShadow: "0 28px 80px rgba(0,0,0,.5)" }}>
      <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700 }}>How was Running today?</div>
      <div style={{ color: MUTED, fontSize: 17, marginTop: 6 }}>A tap is enough. Say more only if you feel like it.</div>
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        {[{ glyph: "🔥", label: "Energized" }, { glyph: "🙂", label: "Okay" }, { glyph: "🌧️", label: "Rough" }].map((m, i) => <div key={m.label} style={{ flex: 1, border: `1px solid ${i === 0 ? COLORS.ember : "#2a2433"}`, background: i === 0 ? "rgba(255,107,53,.08)" : "transparent", borderRadius: 14, textAlign: "center", padding: "14px 6px" }}><div style={{ fontSize: 30 }}>{m.glyph}</div><div style={{ color: MUTED, fontSize: 14, marginTop: 4 }}>{m.label}</div></div>)}
      </div>
      <div style={{ marginTop: 20, border: "1px solid rgba(255,107,53,.5)", background: "rgba(255,107,53,.07)", borderRadius: 15, padding: 18 }}>
        <div style={{ color: COLORS.ember, fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>✦ EMBER AI</div>
        <div style={{ fontFamily: SERIF, fontSize: 25, marginTop: 12 }}>What pulled you to the run today?</div>
        <div style={{ color: FAINT, fontSize: 15, marginTop: 8 }}>Optional — answer only if you feel like it.</div>
        <div style={{ marginTop: 14, border: "1px solid #2a2433", borderRadius: 10, padding: 13, color: FAINT }}>I wanted to clear my head before the day started…</div>
      </div>
      <div style={{ marginTop: 18, border: "1px solid #2a2433", borderRadius: 12, padding: 15, color: FAINT }}>Anything you want to remember about today…</div>
      <div style={{ textAlign: "right", marginTop: 18, color: COLORS.ember, fontWeight: 600 }}>Log it →</div>
    </div>
  </AbsoluteFill>
);

export const DevtoJournal: React.FC = () => (
  <Shell title="Journal" subtitle="Everything you&apos;ve tended, looking back.">
    <div style={{ width: 920, marginTop: 24, display: "grid", gap: 14 }}>
      {[{ name: "Writing", color: COLORS.violet, date: "Jul 12", mood: "🔥", text: "Finished the opening section. It finally sounds like me." }, { name: "Running", color: COLORS.ember, date: "Jul 11", mood: "🙂", text: "A short run still counts. The point is keeping the door open." }, { name: "Side project", color: COLORS.sapphire, date: "Jul 10", mood: "🌧️", text: "Only fixed one small thing today, but the flame is still here." }].map((e) => <div key={e.name} style={{ border: "1px solid #2a2433", background: "rgba(23,20,28,.88)", borderRadius: 18, padding: 20 }}><div style={{ display: "flex", alignItems: "center", gap: 10, color: MUTED, fontSize: 15 }}><span style={{ width: 10, height: 10, borderRadius: 10, background: e.color }} /><strong style={{ color: TEXT }}>{e.name}</strong><span>{e.date}</span><span style={{ marginLeft: "auto", fontSize: 20 }}>{e.mood}</span></div><p style={{ margin: "12px 0 0", fontSize: 19, lineHeight: 1.5 }}>{e.text}</p></div>)}
    </div>
  </Shell>
);

export const DevtoShowcaseCompositions: React.FC = () => <>
  <Composition id="DevtoCover" component={DevtoCover} durationInFrames={1} fps={30} width={1600} height={900} />
  <Composition id="DevtoGrowth" component={DevtoGrowth} durationInFrames={1} fps={30} width={1600} height={900} />
  <Composition id="DevtoDashboard" component={DevtoDashboard} durationInFrames={1} fps={30} width={1600} height={1000} />
  <Composition id="DevtoCalendar" component={DevtoCalendar} durationInFrames={1} fps={30} width={1600} height={1000} />
  <Composition id="DevtoJournal" component={DevtoJournal} durationInFrames={1} fps={30} width={1600} height={1000} />
  <Composition id="DevtoAiJournal" component={DevtoAiJournal} durationInFrames={1} fps={30} width={1600} height={1000} />
</>;
