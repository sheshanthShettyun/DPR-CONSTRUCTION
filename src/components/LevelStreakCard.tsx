"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Star, RotateCcw } from "lucide-react";

interface XpState {
  level: number;
  xp: number;
  streakDays: number;
  threshold: number;
  progress: number;
}

export default function LevelStreakCard() {
  const [state, setState] = useState<XpState | null>(null);
  const [leveledUp, setLeveledUp] = useState(false);

  const refresh = () => fetch("/api/xp").then((r) => r.json()).then(setState);

  useEffect(() => {
    refresh();
    const h = (e: Event) => {
      const detail = (e as CustomEvent).detail as { leveledUp?: boolean } | undefined;
      if (detail?.leveledUp) {
        setLeveledUp(true);
        setTimeout(() => setLeveledUp(false), 2500);
      }
      refresh();
    };
    window.addEventListener("dpr:refresh", h);
    return () => window.removeEventListener("dpr:refresh", h);
  }, []);

  const reset = async () => {
    if (!window.confirm("Reset level, XP, and streak back to zero?")) return;
    await fetch("/api/xp/reset", { method: "POST" });
    refresh();
  };

  if (!state) return null;
  const toNext = Math.max(0, state.threshold - state.xp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="dashboard-card flex flex-col gap-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8c8c8c]">Level</span>
            <span className="flex items-center gap-1 rounded-full bg-[#e2f1a6]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#e2f1a6]">
              <Trophy size={9} strokeWidth={2.5} />
              Gold Tier
            </span>
            {leveledUp && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full bg-[#e2f1a6] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black"
              >
                Level up!
              </motion.span>
            )}
          </div>
          <div className="relative flex items-baseline gap-1">
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -left-3 -top-3 h-16 w-16 rounded-full bg-[#e2f1a6]/25 blur-xl"
            />
            <span className="relative text-5xl font-semibold leading-none tracking-tight text-white">{state.level}</span>
            <span className="relative text-2xl font-medium text-[#8c8c8c]">/50</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#8c8c8c]">Streak</span>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Flame size={24} strokeWidth={2.5} className="text-[#e2f1a6]" />
            </motion.div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold leading-none tracking-tight text-[#e2f1a6]">{state.streakDays}</span>
              <span className="text-base font-medium text-[#8c8c8c]">days</span>
            </div>
          </div>
          <button
            onClick={reset}
            title="Reset level, XP, and streak"
            className="mt-2 flex items-center gap-1 text-[10px] text-[#52525b] transition-colors hover:text-white"
          >
            <RotateCcw size={10} />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${state.progress}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-[#8c8c8c]"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium">
            <span className="flex items-center gap-1 uppercase tracking-wider text-[#8c8c8c]">
              <Star size={10} strokeWidth={2.5} className="text-[#e2f1a6]" />
              XP
            </span>
            <div className="text-white">
              <span>{state.xp.toLocaleString()}</span>
              <span className="text-[#8c8c8c]"> / {state.threshold.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${state.progress}%` }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-amber-500"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium">
            <span className="uppercase tracking-wider text-[#8c8c8c]">To Next</span>
            <div className="text-white">
              <span className="font-semibold">{toNext.toLocaleString()}</span>
              <span className="text-[#8c8c8c]"> XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-[#1f1f1f] px-3 py-2 text-[10px]">
        <span className="text-[#8c8c8c]">Next reward unlocks at</span>
        <span className="flex items-center gap-1 font-semibold text-[#e2f1a6]">
          <Trophy size={11} strokeWidth={2.5} />
          Level {Math.min(state.level + 1, 50)}
        </span>
      </div>
    </motion.div>
  );
}
