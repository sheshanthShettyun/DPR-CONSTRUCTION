"use client";

import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

const CYCLE_S = 10;
const ROTATE_S = 0.7;

export default function HourglassIcon() {
  const [progress, setProgress] = useState(0);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const ctrl = animate(0, 1, {
      duration: CYCLE_S,
      repeat: Infinity,
      ease: "linear",
      repeatDelay: ROTATE_S + 0.3,
      onUpdate: setProgress,
    });
    const interval = setInterval(() => setRotate((r) => r + 180), (CYCLE_S + 0.3) * 1000);
    return () => { ctrl.stop(); clearInterval(interval); };
  }, []);

  const p = progress;
  const percent = Math.round(p * 100);

  const glassD = "M 28,14 C 28,4 72,4 72,14 C 72,32 60,44 52,48 Q 50,50 48,48 C 40,44 28,32 28,14 Z M 28,106 C 28,116 72,116 72,106 C 72,88 60,76 52,72 Q 50,70 48,72 C 40,76 28,88 28,106 Z";

  const topFillH = (1 - p) * 44;
  const craterDepth = Math.max(0, (p * 0.8) * 32);
  const craterCY = 56 - topFillH + craterDepth * 0.5;

  const topSandStartY = 56 - topFillH;
  const topSandPath = topFillH > 1
    ? `M 28,${topSandStartY} Q 50,${craterCY} 72,${topSandStartY} L 72,14 C 72,4 28,4 28,14 Z`
    : "";

  const bottomPeakH = Math.min(p * 1.25 * 44, 44);
  const bottomPeakCY = 105 - bottomPeakH;
  const bottomSpread = bottomPeakH < 1 ? 0 : Math.min(0.7 * bottomPeakH, 22);
  const bottomY = 105 - bottomPeakH * 0.5;

  const bottomSandPath = bottomPeakH > 0.5
    ? `M ${50 - bottomSpread},${bottomY} Q 50,${105 - bottomPeakH} ${50 + bottomSpread},${bottomY} L 72,106 C 72,116 28,116 28,106 Z`
    : "";

  const streamY = 56 + p * 8;
  const streamH = Math.max(1, (1 - Math.abs(p - 0.5) * 2) * 8);

  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-1.5"
    >
      <motion.div
        animate={{ rotate }}
        transition={{ duration: ROTATE_S, ease: "easeInOut" }}
      >
        <svg width="60" height="82" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="glassClip">
              <path d={glassD} />
            </clipPath>
          </defs>

          <g clipPath="url(#glassClip)">
            {topSandPath && <path d={topSandPath} fill="#e2f1a6" opacity="0.9" />}
            {bottomSandPath && <path d={bottomSandPath} fill="#e2f1a6" opacity="0.95" />}
          </g>

          <rect x="49" y={streamY} width="2" height={streamH} rx="0.5" fill="#e2f1a6" opacity="0.7" clipPath="url(#glassClip)" />

          <path d={glassD} fill="rgba(255,255,255,0.03)" stroke="#52525b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <div className="flex items-baseline gap-1">
        <span className="text-base font-bold text-white">{percent}%</span>
        <span className="text-[9px] text-[#8c8c8c]">complete</span>
      </div>
    </motion.div>
  );
}
