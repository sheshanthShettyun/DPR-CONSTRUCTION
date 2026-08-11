import React from "react";
import { useFadeIn } from "../transitions";
import { COLORS } from "../theme";
import { inter } from "../fonts";

export const SceneHeader = ({ label, delay = 0 }: { label: string; delay?: number }) => {
  const opacity = useFadeIn(delay, 10);
  return (
    <div
      style={{
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 10,
        alignSelf: "flex-start",
        padding: "10px 18px",
        borderRadius: 999,
        backgroundColor: "rgba(26, 26, 26, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(14px)",
        fontFamily: inter,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          backgroundColor: COLORS.accent,
        }}
      />
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.22em",
          color: COLORS.white,
        }}
      >
        {label}
      </span>
    </div>
  );
};
