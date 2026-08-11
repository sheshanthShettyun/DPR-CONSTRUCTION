import React from "react";
import { COLORS } from "../theme";

interface Props {
  image?: string;
  imageOpacity?: number;
  glowColor?: string;
  children?: React.ReactNode;
}

export const Background = ({ image, imageOpacity = 0.25, glowColor = COLORS.accent, children }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: COLORS.bg,
        overflow: "hidden",
      }}
    >
      {image ? (
        <img
          src={image}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imageOpacity,
            filter: "blur(4px) saturate(0.7)",
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 45% at 50% 0%, ${glowColor}0d, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(8,8,8,0.1), rgba(8,8,8,0.92) 88%)",
        }}
      />
      {children}
    </div>
  );
};
