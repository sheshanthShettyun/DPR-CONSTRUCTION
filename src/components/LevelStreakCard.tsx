"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, Star } from "lucide-react";

const XP_MILESTONES = [0, 20, 40, 60, 80, 100];

export default function LevelStreakCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="dashboard-card flex flex-col gap-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8c8c8c]">Level</span>
            <span className="flex items-center gap-1 rounded-full bg-[#a855f7]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#c084fc]">
              <Trophy size={9} strokeWidth={2.5} />
              Gold Tier
            </span>
          </div>
          <div className="relative flex items-baseline gap-1">
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -left-3 -top-3 h-16 w-16 rounded-full bg-[#a855f7]/25 blur-xl"
            />
            <span className="relative text-5xl font-semibold leading-none tracking-tight text-white">24</span>
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
              <span className="text-3xl font-semibold leading-none tracking-tight text-[#e2f1a6]">12</span>
              <span className="text-base font-medium text-[#8c8c8c]">days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "49.6%" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-[#a855f7] to-[#e2f1a6]"
            />
            {XP_MILESTONES.slice(1, -1).map((m) => (
              <span
                key={m}
                className="absolute top-0 h-full w-px bg-black/40"
                style={{ left: `${m}%` }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium">
            <span className="flex items-center gap-1 uppercase tracking-wider text-[#8c8c8c]">
              <Star size={10} strokeWidth={2.5} className="text-[#a855f7]" />
              XP
            </span>
            <div className="text-white">
              <span>1,240</span>
              <span className="text-[#8c8c8c]"> / 2,500</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "40%" }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-amber-500"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium">
            <span className="uppercase tracking-wider text-[#8c8c8c]">To Next</span>
            <div className="text-white">
              <span className="font-semibold">1,260</span>
              <span className="text-[#8c8c8c]"> XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-[#1f1f1f] px-3 py-2 text-[10px]">
        <span className="text-[#8c8c8c]">Next reward unlocks at</span>
        <span className="flex items-center gap-1 font-semibold text-[#c084fc]">
          <Trophy size={11} strokeWidth={2.5} />
          Level 25
        </span>
      </div>
    </motion.div>
  );
}
