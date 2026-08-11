import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Lottie } from "@remotion/lottie";
import {
  ArrowUpRight,
  Calendar,
  Check,
  Flame,
  Fuel,
  Package,
  PanelLeftOpen,
  SlidersHorizontal,
  Truck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import hourglassAnimation from "../../lib/hourglass-animation.json";
import { COLORS, RADIUS } from "../theme";
import { inter } from "../fonts";
import { useFadeIn, useFadeUp } from "../transitions";
import { AppChrome } from "../components/AppChrome";
import { CountUp } from "../components/CountUp";
import { ProgressBar } from "../components/ProgressBar";
import { expenseCategories, expenseSummary, levelStreak, objectives, utilityStock } from "../data";

const label = (text: string, color = COLORS.muted, size = 11) => ({
  margin: 0,
  fontSize: size,
  fontWeight: 600,
  letterSpacing: "0.16em",
  color,
  textTransform: "uppercase" as const,
});

const LevelStreakCard = ({ delay }: { delay: number }) => {
  const anim = useFadeUp(delay);
  return (
    <div
      style={{
        ...anim,
        gridColumn: "span 2",
        backgroundColor: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.card,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 20,
        fontFamily: inter,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={label("Level")}>Level</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 56, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em", color: COLORS.white }}>
              {levelStreak.level}
            </span>
            <span style={{ fontSize: 28, fontWeight: 500, color: COLORS.muted }}>/{levelStreak.levelTotal}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <p style={label("Streak")}>Streak</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Flame size={30} strokeWidth={2.5} color={COLORS.accent} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 38, fontWeight: 600, lineHeight: 1, color: COLORS.accent }}>{levelStreak.streak}</span>
              <span style={{ fontSize: 18, fontWeight: 500, color: COLORS.muted }}>days</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 28 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <ProgressBar pct={49.6} delay={delay + 26} height={8} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 15, fontWeight: 500 }}>
            <span style={label("XP", COLORS.muted, 11)}>XP</span>
            <span style={{ color: COLORS.white }}>
              <CountUp to={levelStreak.xp} delay={delay + 26} format={(n) => n.toLocaleString()} />{" "}
              <span style={{ color: COLORS.muted }}>/ {levelStreak.xpTotal.toLocaleString()}</span>
            </span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <ProgressBar pct={40} delay={delay + 34} height={8} color="#f59e0b" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 15, fontWeight: 500 }}>
            <span style={label("To Next", COLORS.muted, 11)}>To Next</span>
            <span style={{ color: COLORS.white }}>
              <span style={{ fontWeight: 600 }}>{levelStreak.toNext.toLocaleString()}</span>{" "}
              <span style={{ color: COLORS.muted }}>XP</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const UtilityStockCard = ({ delay }: { delay: number }) => {
  const anim = useFadeUp(delay);
  const pct = Math.round((utilityStock.available / utilityStock.totalItems) * 100);
  return (
    <div
      style={{
        ...anim,
        backgroundColor: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.card,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 16,
        fontFamily: inter,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: "0.01em", color: COLORS.muted }}>Utility in Stock</span>
        <ArrowUpRight size={18} strokeWidth={2.5} color={COLORS.muted} />
      </div>
      <div>
        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", color: COLORS.white }}>
          <CountUp to={utilityStock.totalItems} delay={delay + 24} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 500, color: COLORS.muted, marginTop: 8 }}>Total items</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 15 }}>
          <span style={{ color: COLORS.muted }}>
            <span style={{ fontWeight: 600, color: COLORS.white }}>
              <CountUp to={utilityStock.available} delay={delay + 30} />
            </span>{" "}
            available
          </span>
          <span style={{ color: COLORS.muted }}>
            <span style={{ fontWeight: 600, color: COLORS.white }}>
              <CountUp to={utilityStock.lowStock} delay={delay + 36} />
            </span>{" "}
            low stock
          </span>
        </div>
        <ProgressBar pct={pct} delay={delay + 32} height={8} />
      </div>
    </div>
  );
};

const ObjectivesCard = ({ delay }: { delay: number }) => {
  const anim = useFadeUp(delay);
  return (
    <div
      style={{
        ...anim,
        backgroundColor: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.card,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        fontFamily: inter,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: "0.01em", color: COLORS.muted }}>Objectives</span>
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 500, color: COLORS.muted }}>
          <Calendar size={15} strokeWidth={1.8} />
          {objectives[0].dueDate}
        </span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
        {objectives.map((t, i) => (
          <div
            key={t.title}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 0",
              borderBottom: i < objectives.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}
          >
            <div style={{ minWidth: 0, paddingRight: 10 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 500,
                  color: t.done ? COLORS.faint : COLORS.muted,
                  textDecoration: t.done ? "line-through" : "none",
                }}
              >
                {t.title}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: COLORS.faint }}>{t.time}</p>
            </div>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                backgroundColor: t.done ? COLORS.accent : "transparent",
                border: t.done ? "none" : "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {t.done && <Check size={13} strokeWidth={3} color="#000000" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HourglassCard = ({ delay }: { delay: number }) => {
  const anim = useFadeUp(delay);
  return (
    <div
      style={{
        ...anim,
        backgroundColor: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.card,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontFamily: inter,
      }}
    >
      <Lottie animationData={hourglassAnimation} loop style={{ width: 190, height: 190 }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.white }}>
          <CountUp to={62} delay={delay + 26} />
          <span style={{ color: COLORS.accent }}>%</span>
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.muted, textAlign: "center" }}>
          Meridian Heights — Tower B · Progress
        </span>
      </div>
    </div>
  );
};

const ExpensesCard = ({ delay }: { delay: number }) => {
  const anim = useFadeUp(delay);
  const topCategories = expenseCategories.filter((c) => c.name !== "Other").slice(0, 6);
  const stats = [
    { label: "Largest", value: `$${expenseCategories[0].amount}`, sub: `${expenseCategories[0].name} · ${expenseCategories[0].pct}%` },
    { label: "Smallest", value: `$${expenseCategories[8].amount}`, sub: `${expenseCategories[8].name} · ${expenseCategories[8].pct}%` },
    { label: "Most Volatile", value: `$${expenseCategories[2].amount}`, sub: `Materials · $450↑` },
    { label: "Most Stable", value: `$${expenseCategories[0].amount}`, sub: `Equipment · $0 change` },
  ];
  return (
    <div
      style={{
        ...anim,
        backgroundColor: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.card,
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: inter,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <span style={label("Monthly Expenses", COLORS.muted, 10)}>Monthly Expenses</span>
            <span style={{ width: 4, height: 4, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.4)" }} />
            <span style={label(expenseSummary.month, COLORS.muted, 10)}>{expenseSummary.month}</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.02em", color: COLORS.white }}>
              $<CountUp to={expenseSummary.totalSpent} delay={delay + 30} format={(n) => n.toLocaleString()} />
            </span>
            <span style={{ fontSize: 13, color: COLORS.muted }}>USD</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: expenseSummary.sparklineTotal }).map((_, j) => (
              <div
                key={j}
                style={{
                  width: 8,
                  height: 16,
                  borderRadius: 3,
                  backgroundColor: j < expenseSummary.sparklineFilled ? COLORS.accent : "rgba(255,255,255,0.05)",
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: 11, color: COLORS.muted }}>
            <span style={{ color: COLORS.white }}>
              $<CountUp to={expenseSummary.totalSpent} delay={delay + 34} format={(n) => n.toLocaleString()} />
            </span>{" "}
            / ${expenseSummary.budget.toLocaleString()} BUDGET
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <span style={{ padding: "5px 11px", borderRadius: 999, backgroundColor: "#1f1f1f", fontSize: 11, color: COLORS.muted }}>
          Potential Savings: <span style={{ fontWeight: 500, color: COLORS.white }}>${expenseSummary.potentialSavings}/mo</span>
        </span>
        <span style={{ padding: "5px 11px", borderRadius: 999, backgroundColor: "rgba(217,119,6,0.2)", fontSize: 11, color: "#f59e0b" }}>
          Savings Rate: <span style={{ fontWeight: 500 }}>{expenseSummary.savingsRatePct}% / {expenseSummary.savingsTargetPct}% target</span>
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 3, padding: 11, borderRadius: 12, backgroundColor: "#1f1f1f" }}>
            <span style={label(s.label, COLORS.muted, 9)}>{s.label}</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: COLORS.white }}>{s.value}</span>
            <span style={{ fontSize: 11, color: COLORS.muted }}>{s.sub}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.muted }}>
          <span>Category</span>
          <span>Share</span>
          <span style={{ textAlign: "right" }}>Amount</span>
        </div>
        {topCategories.map((cat, i) => {
          const Icon =
            cat.name === "Equipment"
              ? Wrench
              : cat.name === "Fuel & Energy"
                ? Fuel
                : cat.name === "Materials"
                  ? Package
                  : cat.name === "Labor"
                    ? Users
                    : cat.name === "Utilities"
                      ? Zap
                      : Truck;
          return (
            <div key={cat.name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={13} strokeWidth={1.5} color={COLORS.muted} />
                <span style={{ fontSize: 12, color: COLORS.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cat.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 999, backgroundColor: "#27272a" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(cat.pct * 2.5, 100)}%`,
                      backgroundColor: cat.color,
                      borderRadius: 999,
                      transformOrigin: "left",
                    }}
                  >
                    <div style={{ height: "100%" }} />
                  </div>
                </div>
                <span style={{ width: 30, fontSize: 11, color: COLORS.muted }}>{cat.pct}%</span>
              </div>
              <span style={{ textAlign: "right", fontSize: 12, fontWeight: 500, color: COLORS.white }}>
                $<CountUp to={cat.amount} delay={delay + 44 + i * 6} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const frame = useCurrentFrame();
  const chromeIn = useFadeIn(0, 12);
  const header = useFadeUp(6, 18);
  const gridScale = interpolate(frame, [120, 160], [1, 1.025], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.appBg, fontFamily: inter, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 55% 40% at 75% 0%, rgba(226,241,166,0.06), transparent 70%)",
        }}
      />
      <div style={{ opacity: chromeIn, transform: `translateY(${(1 - chromeIn) * -24}px)` }}>
        <AppChrome />
      </div>

      <div
        style={{
          position: "absolute",
          top: 92,
          left: 40,
          right: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: header.opacity,
          transform: header.transform,
          fontFamily: inter,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.white }}>All Projects</span>
          <span style={{ padding: "3px 10px", borderRadius: 6, backgroundColor: COLORS.card, fontSize: 14, color: COLORS.muted }}>3 active</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.card, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.muted }}>
            <Calendar size={20} />
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.card, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.muted }}>
            <SlidersHorizontal size={18} />
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#000000" }}>
            <PanelLeftOpen size={20} />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 160,
          left: 40,
          right: 40,
          display: "grid",
          gridTemplateColumns: "8fr 9fr 8fr",
          gridTemplateRows: "250px 560px",
          gap: 20,
          transform: `scale(${gridScale})`,
          transformOrigin: "center top",
        }}
      >
        <LevelStreakCard delay={18} />
        <UtilityStockCard delay={28} />
        <ObjectivesCard delay={40} />
        <HourglassCard delay={46} />
        <ExpensesCard delay={52} />
      </div>
    </AbsoluteFill>
  );
};
