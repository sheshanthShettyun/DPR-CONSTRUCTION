import React from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { COLORS } from "../theme";
import { inter } from "../fonts";
import { Logo } from "./Logo";

const navItems = ["ALL", "Personnel", "Documents", "Budget", "Safety", "Risk Assessment"];

export const AppChrome = ({ style }: { style?: React.CSSProperties }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 92,
        padding: "0 40px",
        fontFamily: inter,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={30} />
          <span
            style={{
              fontFamily: inter,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "-0.02em",
              color: COLORS.white,
            }}
          >
            DPR
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {navItems.map((item) => (
            <span
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                height: 32,
                padding: "0 12px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                color: item === "ALL" ? COLORS.white : COLORS.muted,
                backgroundColor: item === "ALL" ? "rgba(255,255,255,0.04)" : "transparent",
              }}
            >
              {item}
            </span>
          ))}
        </nav>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            backgroundColor: COLORS.card,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.white,
          }}
        >
          <Search size={19} />
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            backgroundColor: COLORS.card,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.white,
          }}
        >
          <Bell size={19} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderLeft: "1px solid rgba(255,255,255,0.1)",
            paddingLeft: 16,
          }}
        >
          <div style={{ textAlign: "right", lineHeight: 1.3 }}>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: COLORS.white,
                fontFamily: inter,
              }}
            >
              SRIYAAN
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                color: COLORS.muted,
                fontFamily: inter,
              }}
            >
              Dispatch Officer
            </p>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "rgba(226, 241, 166, 0.16)",
              border: `1px solid rgba(226, 241, 166, 0.25)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.accent,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: inter,
            }}
          >
            S
          </div>
          <ChevronDown size={16} color={COLORS.muted} />
        </div>
      </div>
    </div>
  );
};
