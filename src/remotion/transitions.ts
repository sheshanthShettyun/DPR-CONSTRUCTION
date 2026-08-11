import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const useFadeUp = (delay = 0, distance = 28) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    fps,
    frame: frame - delay,
    config: { damping: 220, stiffness: 120, mass: 0.8 },
  });
  const clamped = Math.min(Math.max(progress, 0), 1);
  return {
    opacity: clamped,
    transform: `translateY(${(1 - clamped) * distance}px)`,
  };
};

export const useFadeIn = (delay = 0, length = 12) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + length], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return opacity;
};

export const useScaleIn = (delay = 0, distance = 12) => {
  const frame = useCurrentFrame();
  const progress = spring({
    fps: 30,
    frame: frame - delay,
    config: { damping: 200, stiffness: 130, mass: 0.9 },
  });
  const clamped = Math.min(Math.max(progress, 0), 1);
  return {
    opacity: clamped,
    transform: `translateY(${(1 - clamped) * distance}px) scale(${0.96 + clamped * 0.04})`,
  };
};
