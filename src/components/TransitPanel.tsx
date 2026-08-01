"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import type { OrderData } from "@/lib/orders";

interface Props {
  order: OrderData;
}

const stages = [
  { label: "Loaded", time: "09:15", done: true },
  { label: "Dispatched", time: "10:40", done: true },
  { label: "In Transit", time: "11:30", done: true, active: true },
  { label: "Checkpoint", time: "13:25", done: false },
  { label: "Arriving", time: "14:50", done: false },
  { label: "Delivered", time: "16:30", done: false },
];

export default function TransitPanel({ order }: Props) {
  const { from, to, eta, distance, load, status, sub } = order;
  const doneCount = stages.filter((s) => s.done).length;
  const progress = Math.round((doneCount / stages.length) * 100);

  const stagePositions = [94, 250, 437, 587, 751, 916];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="dashboard-card flex w-full flex-col p-7"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3.5">
          <span className="text-xs font-semibold text-[#e2f1a6]">TRANSIT TRACKING</span>
          <div className="flex items-center gap-4">
            <span className="text-[15px] text-[#8c8c8c]">{from} → {to}</span>
            <span className="flex items-center gap-1.5 rounded-lg bg-[#e2f1a6]/10 px-[11px] py-1.5 text-xs font-medium text-[#e2f1a6]">
              {status}
              <span className="h-1.5 w-1.5 rounded-full bg-[#e2f1a6]" />
            </span>
          </div>
        </div>

        <div className="flex items-start pt-1">
          <div className="h-14 w-px bg-white/5" />
          <div className="flex flex-col gap-3 px-7">
            <span className="text-xs text-[#8c8c8c]">ETA</span>
            <span className="text-sm font-medium text-white">{eta}</span>
          </div>
          <div className="h-14 w-px bg-white/5" />
          <div className="flex flex-col gap-3 px-7">
            <span className="text-xs text-[#8c8c8c]">DISTANCE</span>
            <span className="text-sm font-medium text-white">{distance}</span>
          </div>
          <div className="h-14 w-px bg-white/5" />
          <div className="flex flex-col gap-3 px-7">
            <span className="text-xs text-[#8c8c8c]">CARGO</span>
            <span className="text-sm font-medium text-white">{load}</span>
          </div>
          <div className="h-14 w-px bg-white/5" />
          <div className="flex flex-col gap-3 pl-7">
            <span className="text-xs text-[#8c8c8c]">STATUS</span>
            <span className="text-sm font-medium text-white">{status}</span>
          </div>
        </div>
      </div>

      <div className="relative mt-[22px] h-[196px]">
        <div className="absolute left-[11px] top-[62px] h-[54px] w-[139px] rounded-tl-[54px] border-l-2 border-t-2 border-zinc-800" />
        <div className="absolute left-[152px] top-[62px] h-[2px] w-[347px] bg-[#e2f1a6]" />
        <div className="absolute left-[497px] top-[62px] h-[2px] w-[479px] bg-zinc-800" />
        <div className="absolute left-[976px] top-[62px] h-[54px] w-[139px] rounded-tr-[54px] border-r-2 border-t-2 border-zinc-800" />

        <div className="absolute left-[11px] top-[112px] h-2 w-2 rounded-full bg-[#e2f1a6]" />
        <div className="absolute left-[1111px] top-[112px] h-[7px] w-[7px] rounded-full bg-[#6b7280]" />

        {[147, 303, 640, 804, 969].map((x) => (
          <div key={x} className="absolute top-[55px] h-3.5 w-3.5 rounded-full bg-[#1a1a1a]" style={{ left: x }} />
        ))}

        <div className="absolute left-[485px] top-[51px] z-[2] flex h-6 w-6 items-center justify-center rounded-full bg-[#1a1a1a]">
          <div className="h-[9px] w-[9px] rounded-full bg-[#e2f1a6]" />
        </div>

        <motion.div
          className="absolute"
          style={{ left: 479, top: 3 }}
          animate={{ x: [0, 2, -1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Truck size={36} color="#e2f1a6" strokeWidth={2} />
        </motion.div>

        {[
          { x: 448, w: 16, o: 0.55 },
          { x: 438, w: 24, o: 0.4 },
          { x: 450, w: 13, o: 0.3 },
        ].map((s, i) => (
          <div key={i} className="absolute h-[2px] rounded-full bg-[#e2f1a6]" style={{ left: s.x, top: `${17 + i * 9}px`, width: s.w, opacity: s.o }} />
        ))}

        <div className="absolute left-0 top-[90px] flex h-[60px] w-full">
          {stages.map((s, i) => (
            <div
              key={s.label}
              className="flex w-[120px] flex-col items-center gap-2.5"
              style={{ position: "absolute", left: stagePositions[i] }}
            >
              <span className={`text-xs ${s.active ? "font-semibold text-white" : "font-medium text-[#8c8c8c]"}`}>{s.label}</span>
              <span className="text-xs text-[#6b7280]">{s.time}</span>
            </div>
          ))}
        </div>

        <span className="absolute left-[11px] top-[162px] text-xs text-[#8c8c8c]">{from}</span>
        <span className="absolute left-[1104px] top-[162px] text-xs text-[#8c8c8c]">{to}</span>
      </div>

      <div className="mt-[18px] h-px w-full bg-white/5" />

      <div className="flex items-start pt-[22px]">
        <div className="flex flex-col gap-3.5 pr-10">
          <span className="text-xs text-[#8c8c8c]">Overall Progress</span>
          <div className="flex items-center gap-[18px]">
            <span className="text-[28px] font-semibold text-white">{progress}%</span>
            <div className="h-2 w-[290px] overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-[#e2f1a6]"
              />
            </div>
          </div>
        </div>
        <div className="h-[58px] w-px bg-white/5" />
        <div className="flex flex-1 flex-col gap-3.5 pl-10">
          <span className="text-xs text-[#8c8c8c]">Current Stage</span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-white">{stages.find((s) => s.active)?.label || "—"}</span>
            <span className="text-xs text-[#8c8c8c]">{sub} handling transport.</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
