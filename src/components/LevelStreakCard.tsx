"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

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
          <span className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#8c8c8c]">Level</span>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-semibold leading-none tracking-tight text-white">24</span>
            <span className="text-2xl font-medium text-[#8c8c8c]">/50</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#8c8c8c]">Streak</span>
          <div className="flex items-center gap-2">
            <Flame size={24} strokeWidth={2.5} className="text-[#e2f1a6]" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold leading-none tracking-tight text-[#e2f1a6]">12</span>
              <span className="text-base font-medium text-[#8c8c8c]">days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "49.6%" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-[#e2f1a6]"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium">
            <span className="uppercase tracking-wider text-[#8c8c8c]">XP</span>
            <div className="text-white">
              <span>1,240</span>
              <span className="text-[#8c8c8c]"> / 2,500</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
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
    </motion.div>
  );
}
