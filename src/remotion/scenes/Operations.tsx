import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  ArrowUpRight,
  Box,
  Calendar,
  CircleDot,
  MessageSquare,
  Paperclip,
  Plus,
  Ship,
  Truck,
  Wrench,
} from "lucide-react";
import { COLORS, RADIUS } from "../theme";
import { inter } from "../fonts";
import { SceneHeader } from "../components/SceneHeader";
import { Background } from "../components/Background";
import { assetHeavyMachinery, orders, taskColumns } from "../data";

const useWindowFade = (start: number, end: number, fadeLen = 12) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [start, start + fadeLen], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const b = interpolate(frame, [end - fadeLen, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(a, b);
};

const levelStyles: Record<string, { text: string; bg: string; border: string }> = {
  Plenty: { text: "#6ee7b7", bg: "rgba(16,185,129,0.1)", border: "rgba(110,231,183,0.2)" },
  Low: { text: "#fcd34d", bg: "rgba(252,211,77,0.1)", border: "rgba(252,211,77,0.2)" },
  Critical: { text: "#fda4af", bg: "rgba(244,63,94,0.1)", border: "rgba(253,164,175,0.2)" },
};

const chipTone: Record<string, { text: string; bg: string; dot: string }> = {
  emerald: { text: "#10b981", bg: "rgba(16,185,129,0.12)", dot: "#10b981" },
  amber: { text: "#f59e0b", bg: "rgba(245,158,11,0.12)", dot: "#f59e0b" },
  lime: { text: COLORS.accent, bg: "rgba(226,241,166,0.1)", dot: COLORS.accent },
  orange: { text: "#f97316", bg: "rgba(249,115,22,0.12)", dot: "#f97316" },
  zinc: { text: "#a1a1aa", bg: "rgba(161,161,170,0.12)", dot: "#a1a1aa" },
};

const StatusChip = ({ label, tone }: { label: string; tone: string }) => {
  const t = chipTone[tone] ?? chipTone.zinc;
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 999,
        backgroundColor: t.bg,
        color: t.text,
        fontSize: 13,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: t.dot }} />
      {label}
    </span>
  );
};

const TaskColumnPanel = ({ index }: { index: number }) => {
  const col = taskColumns[index];
  return (
    <div
      style={{
        backgroundColor: COLORS.cardMid,
        borderRadius: RADIUS.md,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.05)",
        fontFamily: inter,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 18px",
          backgroundColor: COLORS.cardDeep,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CircleDot size={15} color={COLORS.muted} />
          <span style={{ fontSize: 16, fontWeight: 500, color: "#f1f1f1" }}>{col.title}</span>
          <span style={{ fontSize: 13, color: COLORS.muted }}>{col.cards.length}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 7,
              backgroundColor: "#2a2a2a",
              color: COLORS.white,
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <Plus size={11} />
            Add Utility
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {col.cards.map((card, i) => {
          const s = levelStyles[card.level];
          return (
            <div
              key={card.title}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "13px 18px",
                borderTop: i === 0 ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ minWidth: 0, flex: 1, paddingRight: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#f1f1f1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {card.title}
                </div>
                <div style={{ marginTop: 3, fontSize: 12, color: COLORS.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {card.desc}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <span style={{ padding: "2px 8px", borderRadius: 5, backgroundColor: "#2a2a2a", fontSize: 11, fontWeight: 500, color: COLORS.muted }}>
                  {card.type}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: COLORS.muted }}>
                  <Calendar size={12} />
                  {card.date}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.muted }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <MessageSquare size={12} />
                    {card.comments}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Paperclip size={12} />
                    {card.files}
                  </span>
                </span>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 6,
                    border: `1px solid ${s.border}`,
                    backgroundColor: s.bg,
                    color: s.text,
                    fontSize: 11,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {card.level}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UtilitiesSubFrame = () => {
  const opacity = useWindowFade(0, 58);
  return (
    <div style={{ position: "absolute", inset: 0, opacity, transform: `translateY(${(1 - opacity) * 18}px)` }}>
      <div style={{ padding: "70px 120px 0" }}>
        <SceneHeader label="Site Operations · Utilities" delay={2} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 120,
          right: 120,
          bottom: 60,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 22,
        }}
      >
        <TaskColumnPanel index={0} />
        <TaskColumnPanel index={1} />
        <TaskColumnPanel index={2} />
        <TaskColumnPanel index={3} />
      </div>
    </div>
  );
};

const AssetDetailPanel = () => {
  const cat = assetHeavyMachinery;
  return (
    <div
      style={{
        backgroundColor: COLORS.card,
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: RADIUS.card,
        padding: 26,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        fontFamily: inter,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 19, fontWeight: 700, color: COLORS.white }}>Asset Details</span>
        <span style={{ display: "flex", gap: 8, color: COLORS.muted, fontSize: 16 }}>···</span>
      </div>
      <div>
        <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.muted }}>
          Category
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "11px 14px",
            borderRadius: 10,
            backgroundColor: "#18181b",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: COLORS.accent }} />
            <span style={{ fontSize: 15, fontWeight: 500, color: COLORS.white }}>{cat.category}</span>
          </span>
          <span style={{ color: COLORS.muted, fontSize: 13 }}>▾</span>
        </div>
      </div>
      <div>
        <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.muted }}>
          Asset ID
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "11px 14px",
            borderRadius: 10,
            backgroundColor: "#18181b",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.white }}>{cat.id}</span>
          <span style={{ color: COLORS.muted, fontSize: 13 }}>▾</span>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px 14px",
          padding: 14,
          borderRadius: 12,
          backgroundColor: "rgba(24,24,27,0.6)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {cat.fields.map(([key, value]) => (
          <div key={key}>
            <div style={{ fontSize: 11, textTransform: "uppercase", color: COLORS.muted }}>{key}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.white, marginTop: 2 }}>{value}</div>
          </div>
        ))}
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase", color: COLORS.muted }}>Status</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#10b981", marginTop: 2 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: "#10b981" }} /> Active
          </div>
        </div>
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.muted }}>
          Attachments
        </div>
        <div style={{ display: "flex", gap: 9 }}>
          {cat.tools.map((tool) => (
            <span
              key={tool.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 12px",
                borderRadius: 10,
                backgroundColor: "#27272a",
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.white,
              }}
            >
              <Box size={14} color={COLORS.muted} />
              {tool.id}
              <span style={{ fontSize: 11, fontWeight: 400, color: COLORS.muted }}>{tool.weight}</span>
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 0",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {[
          ["Type", cat.type],
          ["Weight", cat.weight],
          ["Est. Cost", cat.cost],
        ].map(([key, value]) => (
          <div key={key}>
            <div style={{ fontSize: 11, textTransform: "uppercase", color: COLORS.muted }}>{key}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: key === "Est. Cost" ? COLORS.accent : COLORS.white, marginTop: 3 }}>
              {value}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "13px 0",
          borderRadius: 12,
          backgroundColor: COLORS.accent,
          color: "#000000",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: inter,
        }}
      >
        <Plus size={16} />
        Log Activity
      </div>
    </div>
  );
};

const OffSiteCard = ({
  title,
  tone,
  items,
}: {
  title: string;
  tone: React.ReactNode;
  items: { name: string; spec: string; status: string; tone: string; icon: React.ReactNode }[];
}) => {
  return (
    <div
      style={{
        backgroundColor: COLORS.card,
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: RADIUS.card,
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        fontFamily: inter,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ color: COLORS.accent, fontSize: 16 }}>{tone}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.white }}>{title}</span>
        </span>
        <span style={{ fontSize: 12, color: COLORS.muted }}>{items.length} items</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item, i) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <span style={{ color: COLORS.faint, fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, color: COLORS.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.spec}</div>
              </div>
            </div>
            <StatusChip label={item.status} tone={item.tone} />
          </div>
        ))}
      </div>
    </div>
  );
};

const AssetsSubFrame = () => {
  const opacity = useWindowFade(48, 112);
  const leased = [
    { name: "Excavator CAT 320", spec: "Leased to TNA Groups · Until Aug 15", status: "Active Lease", tone: "emerald" as const, icon: <Wrench size={14} /> },
    { name: "Dump Truck CAT 745", spec: "Leased to MEGAONE · Until Sep 02", status: "Active Lease", tone: "emerald" as const, icon: <Truck size={14} /> },
    { name: "Bulldozer D6T", spec: "Leased to BVI GROUP · Until Aug 28", status: "Pending Return", tone: "amber" as const, icon: <Wrench size={14} /> },
  ];
  const incoming = [
    { name: "Steel Beams A992", spec: "Shipped from US Steel Corp · ETA Aug 10", status: "In Transit", tone: "lime" as const, icon: <Box size={14} /> },
    { name: "Concrete Blocks", spec: "200 units · Supplier: CEMEX", status: "Delayed", tone: "orange" as const, icon: <Box size={14} /> },
    { name: "Scaffolding System", spec: "40m x 12m · Shipped from Germany", status: "Customs", tone: "amber" as const, icon: <Ship size={14} /> },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity, transform: `translateY(${(1 - opacity) * 18}px)` }}>
      <div style={{ padding: "70px 120px 0" }}>
        <SceneHeader label="Assets · Equipment" delay={50} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 120,
          right: 120,
          bottom: 60,
          display: "flex",
          gap: 24,
        }}
      >
        <div style={{ flex: 1.15 }}>
          <AssetDetailPanel />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
          <OffSiteCard title="Leased Out Equipment" tone={<Truck size={15} />} items={leased} />
          <OffSiteCard title="In Transit — External" tone={<Box size={15} />} items={incoming} />
        </div>
      </div>
    </div>
  );
};

const OrderSummaryCard = () => {
  const order = orders[0];
  return (
    <div
      style={{
        backgroundColor: COLORS.card,
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: RADIUS.card,
        padding: 26,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        fontFamily: inter,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 19, fontWeight: 700, color: COLORS.white }}>{order.id}</span>
        <span style={{ fontSize: 12, color: COLORS.muted }}>Job Site</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
          <span style={{ color: COLORS.muted }}>Job Site</span>
          <span style={{ fontWeight: 500, color: COLORS.white }}>
            {order.from} → {order.to} <span>{order.flag}</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
          <span style={{ color: COLORS.muted }}>Subcontractor</span>
          <span style={{ fontWeight: 500, color: COLORS.white }}>{order.sub}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
          <span style={{ color: COLORS.muted }}>Load Cap</span>
          <span style={{ fontWeight: 500, color: COLORS.white }}>{order.load}</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.muted }}>Job Site</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.05)",
              fontSize: 12,
              fontWeight: 500,
              color: COLORS.muted,
            }}
          >
            Track
            <ArrowUpRight size={12} />
          </span>
          <StatusChip label={order.status} tone={order.color} />
        </div>
      </div>
    </div>
  );
};

const TransitTrackingPanel = () => {
  const frame = useCurrentFrame();
  const order = orders[0];
  const w = 1040;
  const startX = 110;
  const gap = (w - 220) / (order.stages.length - 1);
  const positions = order.stages.map((_, i) => startX + i * gap);
  const activeIdx = 2;
  const reveal = interpolate(frame, [108, 146], [startX, positions[activeIdx]], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const truckX = Math.min(reveal, positions[activeIdx]) - 24;

  return (
    <div
      style={{
        backgroundColor: COLORS.card,
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: RADIUS.card,
        padding: "28px 30px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        fontFamily: inter,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.14em", color: COLORS.accent }}>TRANSIT TRACKING</span>
        <StatusChip label={order.status} tone={order.color} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 24,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          paddingBottom: 16,
        }}
      >
        {[
          ["ETA", order.eta],
          ["DISTANCE", order.distance],
          ["CARGO", order.load],
        ].map(([key, value], i) => (
          <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 24, flex: i < 2 ? undefined : 1 }}>
            {i > 0 && <div style={{ width: 1, height: 40, backgroundColor: "rgba(255,255,255,0.05)" }} />}
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", color: COLORS.muted }}>{key}</div>
              <div style={{ fontSize: 17, fontWeight: 500, color: COLORS.white, marginTop: 6 }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "relative", height: 250, width: w }}>
        <div style={{ position: "absolute", left: startX, right: startX, top: 64, height: 2, backgroundColor: "#27272a" }} />
        <div
          style={{
            position: "absolute",
            left: startX,
            top: 64,
            height: 2,
            width: Math.max(0, reveal - startX),
            backgroundColor: COLORS.accent,
          }}
        />
        <div style={{ position: "absolute", left: truckX, top: 30, opacity: 1, zIndex: 2 }}>
          <Truck size={40} color={COLORS.accent} strokeWidth={2} />
        </div>
        {order.stages.map((stage, i) => {
          const done = stage.done;
          const active = stage.active;
          const isStart = i === 0;
          const isEnd = i === order.stages.length - 1;
          return (
            <div key={stage.label} style={{ position: "absolute", left: positions[i] - 60, width: 120, top: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <div style={{ position: "absolute", top: 59 }}>
                <div
                  style={{
                    width: done ? 14 : 14,
                    height: done ? 14 : 14,
                    borderRadius: 999,
                    backgroundColor: done ? COLORS.accent : "#18181b",
                    border: done ? "none" : "2px solid #52525b",
                    marginLeft: 60 - 7,
                  }}
                />
              </div>
              <div style={{ position: "absolute", top: 84, display: "flex", flexDirection: "column", alignItems: "center", width: 120 }}>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? COLORS.white : COLORS.muted }}>{stage.label}</span>
                <span style={{ fontSize: 13, color: COLORS.faint, marginTop: 4 }}>{stage.time}</span>
                {isStart && <span style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>{order.from}</span>}
                {isEnd && <span style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>{order.to}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TransitSubFrame = () => {
  const opacity = useWindowFade(102, 160);
  return (
    <div style={{ position: "absolute", inset: 0, opacity, transform: `translateY(${(1 - opacity) * 18}px)` }}>
      <div style={{ padding: "70px 120px 0" }}>
        <SceneHeader label="Fleet · Live Transit" delay={104} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 120,
          right: 120,
          bottom: 60,
          display: "flex",
          gap: 24,
        }}
      >
        <div style={{ width: 430, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <OrderSummaryCard />
          <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", padding: "0 8px" }}>
            {orders.slice(0, 3).map((o) => (
              <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: chipTone[o.color]?.dot ?? COLORS.muted }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.muted }}>{o.id}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <TransitTrackingPanel />
        </div>
      </div>
    </div>
  );
};

export const Operations = () => {
  return (
    <AbsoluteFill style={{ fontFamily: inter, overflow: "hidden" }}>
      <Background imageOpacity={0.1}>
        <UtilitiesSubFrame />
        <AssetsSubFrame />
        <TransitSubFrame />
      </Background>
    </AbsoluteFill>
  );
};
