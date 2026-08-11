import { AbsoluteFill, useCurrentFrame } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { COLORS } from "./theme";
import { Hero } from "./scenes/Hero";
import { Dashboard } from "./scenes/Dashboard";
import { ProgressScene } from "./scenes/Progress";
import { Operations } from "./scenes/Operations";
import { Outro } from "./scenes/Outro";

export const SCENE_DURATIONS = {
  hero: 130,
  dashboard: 160,
  progress: 190,
  operations: 160,
  outro: 170,
} as const;

const TRANSITION = 15;

export const TOTAL_FRAMES =
  SCENE_DURATIONS.hero +
  SCENE_DURATIONS.dashboard +
  SCENE_DURATIONS.progress +
  SCENE_DURATIONS.operations +
  SCENE_DURATIONS.outro -
  TRANSITION * 4;

const fadeTiming = () => linearTiming({ durationInFrames: TRANSITION });

const ProgressTicker = () => {
  const frame = useCurrentFrame();
  const pct = Math.min((frame / TOTAL_FRAMES) * 100, 100);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 3,
        zIndex: 100,
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.08)" }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: `${pct}%`,
          backgroundColor: COLORS.accent,
          boxShadow: "0 0 12px rgba(226,241,166,0.6)",
        }}
      />
    </div>
  );
};

export const Video = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hero}>
          <Hero />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fadeTiming()} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.dashboard}>
          <Dashboard />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fadeTiming()} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.progress}>
          <ProgressScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fadeTiming()} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.operations}>
          <Operations />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fadeTiming()} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.outro}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <ProgressTicker />
    </AbsoluteFill>
  );
};
