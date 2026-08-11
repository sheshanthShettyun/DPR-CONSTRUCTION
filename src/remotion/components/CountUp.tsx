import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface Props {
  to: number;
  delay?: number;
  format?: (value: number) => string;
  style?: React.CSSProperties;
}

export const CountUp = ({ to, delay = 0, format, style }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    fps,
    frame: frame - delay,
    config: { damping: 200, stiffness: 70, mass: 0.8 },
  });
  const clamped = Math.min(Math.max(progress, 0), 1);
  const value = Math.round(interpolate(clamped, [0, 1], [0, to]));
  return <span style={style}>{format ? format(value) : value}</span>;
};
