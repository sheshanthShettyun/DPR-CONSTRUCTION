"use client";

import { useEffect, useRef, useState } from "react";

const CYCLE_MS = 9000;

export default function HourglassIcon({ progress: fixedProgress, size = 200 }: { progress?: number; size?: number }) {
  const [progress, setProgress] = useState(fixedProgress ?? 0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (fixedProgress !== undefined) {
      setProgress(fixedProgress / 100);
      return;
    }
    startRef.current = performance.now();
    const tick = (now: number) => {
      const p = ((now - startRef.current) % CYCLE_MS) / CYCLE_MS;
      setProgress(p);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [fixedProgress]);

  const totalSec = 9;
  const remaining = Math.ceil(totalSec * (1 - progress));
  const label = fixedProgress !== undefined ? `${Math.round(progress * 100)}%` : (remaining === 0 ? "0s" : `${remaining}s`);

  // ── Geometry ───────────────────────────────────────────────────────────────
  const W = 400;
  const H = 500;
  const cx = 200;
  const topY = 75;
  const bottomY = 325;
  const waistY = 200;
  const topHW = 116;
  const botHW = 104;
  const waistHW = 10;
  const r = 22;

  // Single continuous clockwise path — smooth cubic curves through the waist
  const d = [
    `M ${cx - topHW + r},${topY}`,
    `L ${cx + topHW - r},${topY}`,
    `Q ${cx + topHW},${topY} ${cx + topHW},${topY + r}`,
    `C ${cx + topHW},${topY + 34} ${cx + waistHW},${waistY - 30} ${cx + waistHW},${waistY}`,
    `C ${cx + waistHW},${waistY + 28} ${cx + botHW},${bottomY - 36} ${cx + botHW},${bottomY - r}`,
    `Q ${cx + botHW},${bottomY} ${cx + botHW - r},${bottomY}`,
    `L ${cx - botHW + r},${bottomY}`,
    `Q ${cx - botHW},${bottomY} ${cx - botHW},${bottomY - r}`,
    `C ${cx - botHW},${bottomY - 36} ${cx - waistHW},${waistY + 28} ${cx - waistHW},${waistY}`,
    `C ${cx - waistHW},${waistY - 30} ${cx - topHW},${topY + 34} ${cx - topHW},${topY + r}`,
    `Q ${cx - topHW},${topY} ${cx - topHW + r},${topY}`,
    "Z",
  ].join(" ");

  // ── Fill levels (strictly linear — gravity) ────────────────────────────────
  const upperH = (1 - progress) * (waistY - topY);
  const lowerT = bottomY - progress * (bottomY - waistY);

  return (
    <div className="flex items-center justify-center">
      <svg
        width={size}
        height={size * 1.25}
        viewBox={`0 0 ${W} ${H}`}
        style={{ display: "block" }}
        aria-label="Hourglass timer"
      >
        <defs>
          <clipPath id="hg">
            <path d={d} />
          </clipPath>
          <linearGradient id="g-up" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2fbcd" />
            <stop offset="100%" stopColor="#e2f1a6" />
          </linearGradient>
          <linearGradient id="g-lo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbe37e" />
            <stop offset="100%" stopColor="#a8c24a" />
          </linearGradient>
          <radialGradient id="g-lit" cx="50%" cy="18%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.055" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g-shd" cx="50%" cy="85%" r="55%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path d={d} fill="#121212" />

        {upperH > 0.5 && (
          <rect x={0} y={topY} width={W} height={upperH} fill="url(#g-up)" clipPath="url(#hg)" />
        )}
        {lowerT < bottomY - 0.5 && (
          <rect x={0} y={lowerT} width={W} height={bottomY - lowerT} fill="url(#g-lo)" clipPath="url(#hg)" />
        )}

        <path d={d} fill="url(#g-lit)" />
        <path d={d} fill="url(#g-shd)" />

        <text
          x={cx}
          y={408}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize="17"
          fontWeight="500"
          letterSpacing="0.14em"
          fill="#e2f1a6"
          opacity="0.6"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
