import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

interface Props {
  pct: number;
  delay?: number;
  color?: string;
  height?: number;
  trackColor?: string;
  radius?: number;
}

export const ProgressBar = ({
  pct,
  delay = 0,
  color = COLORS.accent,
  height = 6,
  trackColor = "rgba(255, 255, 255, 0.08)",
  radius = 999,
}: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    fps,
    frame: frame - delay,
    config: { damping: 200, stiffness: 55, mass: 0.9 },
  });
  const clamped = Math.min(Math.max(progress, 0), 1);
  return (
    <div
      style={{
        height,
        width: "100%",
        backgroundColor: trackColor,
        borderRadius: radius,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${clamped * pct}%`,
          backgroundColor: color,
          borderRadius: radius,
        }}
      />
    </div>
  );
};
