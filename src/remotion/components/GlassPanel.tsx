import React from "react";
import { COLORS, RADIUS } from "../theme";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
  padding?: number;
}

export const GlassPanel = ({ children, glass = false, padding = 20, style, ...rest }: Props) => {
  return (
    <div
      {...rest}
      style={{
        backgroundColor: glass ? "rgba(26, 26, 26, 0.72)" : COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.card,
        padding,
        backdropFilter: glass ? "blur(18px)" : undefined,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
