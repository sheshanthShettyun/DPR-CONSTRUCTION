"use client";

import { motion } from "framer-motion";
import { Plus, Ellipsis, MessageSquare, Paperclip, Calendar, CircleDot } from "lucide-react";

const columns = [
  {
    title: "Power & Utilities",
    cards: [
      { title: "Diesel Generator CAT XQ200", desc: "200 kW · 1,203 hrs runtime", date: "Jul 2", comments: 12, files: 2, level: "Plenty", type: "Generator" },
      { title: "Portable Generator Honda", desc: "5.5 kW · 340 hrs runtime", date: "Jul 5", comments: 8, files: 1, level: "Low", type: "Generator" },
      { title: "Transformer Unit TX-400", desc: "400 kVA · Site B · Standby", date: "Jul 7", comments: 3, files: 0, level: "Critical", type: "Transformer" },
    ],
  },
  {
    title: "Water & Plumbing",
    cards: [
      { title: "Water Pump WP-880", desc: "880 L/min · Diesel powered", date: "Jul 14", comments: 6, files: 1, level: "Plenty", type: "Pump" },
      { title: "De-watering System", desc: "4 pumps · Pit 3 · Active", date: "Jul 9", comments: 9, files: 3, level: "Low", type: "Pump" },
      { title: "Portable Water Tank", desc: "10,000L · Refilled 07/28", date: "Jul 11", comments: 2, files: 0, level: "Plenty", type: "Tank" },
    ],
  },
  {
    title: "Safety Equipment",
    cards: [
      { title: "First Aid Station", desc: "Bay 2 · Fully stocked", date: "Jul 2", comments: 5, files: 2, level: "Plenty", type: "Medical" },
      { title: "Fire Extinguishers", desc: "12 units · All zones", date: "Jul 6", comments: 14, files: 1, level: "Critical", type: "Fire" },
      { title: "PPE Inventory", desc: "48 sets · Helmets/Vests", date: "Jul 8", comments: 7, files: 4, level: "Low", type: "PPE" },
    ],
  },
  {
    title: "Tools & Equipment",
    cards: [
      { title: "Concrete Mixer CM-450", desc: "450L · Electric · In use", date: "Jul 3", comments: 11, files: 2, level: "Plenty", type: "Mixer" },
      { title: "Compactor Plate", desc: "Honda GX160 · 90kg", date: "Jul 5", comments: 4, files: 1, level: "Low", type: "Compactor" },
      { title: "Welding Rig Lincoln", desc: "400A · Diesel · Active", date: "Jul 10", comments: 8, files: 2, level: "Critical", type: "Welder" },
    ],
  },
];

const levelStyles: Record<string, { text: string; bg: string; border: string }> = {
  Plenty: { text: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-300/20" },
  Low: { text: "text-amber-300", bg: "bg-amber-300/10", border: "border-amber-300/20" },
  Critical: { text: "text-rose-300", bg: "bg-rose-500/10", border: "border-rose-300/20" },
};

export default function TaskBoard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3"
    >
      {columns.map((col) => (
        <div key={col.title} className="overflow-hidden rounded-lg bg-[#1C1C1C]">
          <div className="flex items-center justify-between bg-[#111111] px-3 py-2">
            <div className="flex items-center gap-2">
              <CircleDot size={13} className="text-[#8c8c8c]" />
              <h3 className="text-sm font-medium text-[#f1f1f1]">{col.title}</h3>
              <span className="text-xs text-[#8c8c8c]">{col.cards.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1 rounded-md bg-[#2A2A2A] px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-[#3A3A3A]">
                <Plus size={11} />
                Add Utility
              </button>
              <button className="rounded-md p-1 text-[#8c8c8c] transition-colors hover:bg-[#2A2A2A]">
                <Ellipsis size={13} />
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            {col.cards.map((card, i) => {
              const s = levelStyles[card.level];
              return (
                <div
                  key={card.title}
                  className="group flex cursor-pointer items-center justify-between px-3 py-2 transition-colors hover:bg-[#222222]"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <h4 className="truncate text-[13px] font-medium text-[#f1f1f1]">{card.title}</h4>
                    <p className="mt-0.5 truncate text-[11px] text-[#8c8c8c]">{card.desc}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded bg-[#2A2A2A] px-2 py-0.5 text-[10px] font-medium text-[#8c8c8c]">
                      {card.type}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] text-[#8c8c8c]">
                      <Calendar size={11} />
                      <span>{card.date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#8c8c8c]">
                      <span className="flex items-center gap-0.5">
                        <MessageSquare size={11} />
                        {card.comments}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Paperclip size={11} />
                        {card.files}
                      </span>
                    </div>

                    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${s.text} ${s.bg} ${s.border}`}>
                      {card.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
