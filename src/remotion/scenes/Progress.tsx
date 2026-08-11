import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { COLORS, RADIUS } from "../theme";
import { inter } from "../fonts";
import { useFadeUp } from "../transitions";
import { CountUp } from "../components/CountUp";
import { SceneHeader } from "../components/SceneHeader";
import { Background } from "../components/Background";
import { projects } from "../data";

const ProjectRow = ({ index }: { index: number }) => {
  const p = projects[index];
  const delay = 10 + index * 18;
  const anim = useFadeUp(delay, 34);
  return (
    <div
      style={{
        ...anim,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.card,
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: RADIUS.card,
        padding: "30px 34px",
        gap: 40,
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        fontFamily: inter,
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: COLORS.accent }} />
          <span style={{ fontSize: 15, fontWeight: 500, color: COLORS.accent }}>Active</span>
        </div>
        <h2 style={{ margin: 0, fontSize: 33, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.white }}>
          {p.name}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 17, color: COLORS.muted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <MapPin size={18} strokeWidth={2} />
            {p.location}
          </span>
          <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.4)" }} />
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Calendar size={18} strokeWidth={2} />
            {p.targetDate}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <div>
            <div style={{ fontSize: 27, fontWeight: 700, color: COLORS.white }}>
              <CountUp to={p.equipment} delay={delay + 22} />
            </div>
            <div style={{ fontSize: 15, color: COLORS.muted, marginTop: 4 }}>Equipment</div>
          </div>
          <div>
            <div style={{ fontSize: 27, fontWeight: 700, color: COLORS.white }}>
              <CountUp to={p.crew} delay={delay + 24} />
            </div>
            <div style={{ fontSize: 15, color: COLORS.muted, marginTop: 4 }}>Crew</div>
          </div>
          <div>
            <div style={{ fontSize: 21, fontWeight: 500, color: COLORS.white }}>{p.status}</div>
            <div style={{ fontSize: 15, color: COLORS.muted, marginTop: 4 }}>Status</div>
          </div>
        </div>

        <div style={{ width: 1, height: 56, backgroundColor: "rgba(255,255,255,0.08)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.02em", color: COLORS.accent }}>
            <CountUp to={p.progress} delay={delay + 20} />
            %
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              height: 46,
              padding: "0 20px",
              borderRadius: 10,
              backgroundColor: COLORS.accent,
              color: "#000000",
              fontSize: 16,
              fontWeight: 600,
              fontFamily: inter,
            }}
          >
            View Project
            <ArrowRight size={17} strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProgressScene = () => {
  return (
    <AbsoluteFill style={{ fontFamily: inter }}>
      <Background image={staticFile("hero-steel.jpg")} imageOpacity={0.14}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "92px 120px 40px",
            gap: 26,
          }}
        >
          <div style={{ alignSelf: "flex-start", marginBottom: 10 }}>
            <SceneHeader label="Project Progress" delay={4} />
          </div>
          {projects.map((_, i) => (
            <ProjectRow key={projects[i].id} index={i} />
          ))}
        </div>
      </Background>
    </AbsoluteFill>
  );
};
