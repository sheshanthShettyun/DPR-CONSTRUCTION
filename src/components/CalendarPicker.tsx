"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Props {
  selected: Date | null;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export default function CalendarPicker({ selected, onSelect, onClose }: Props) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const days: (number | null)[] = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isSelected = (d: number) =>
    selected && d === selected.getDate() && month === selected.getMonth() && year === selected.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-2xl"
    >
      <div className="mb-3 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-lg p-1 text-[#8c8c8c] hover:bg-zinc-800 hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-white">
          {MONTHS[month]} {year}
        </span>
        <button onClick={nextMonth} className="rounded-lg p-1 text-[#8c8c8c] hover:bg-zinc-800 hover:text-white transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {DAYS.map((d) => (
          <span key={d} className="py-1 text-center text-[10px] font-medium text-[#6b7280]">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => {
              if (d) {
                onSelect(new Date(year, month, d));
                onClose();
              }
            }}
            disabled={!d}
            className={`aspect-square text-xs font-medium transition-colors ${
              !d
                ? "cursor-default"
                : isSelected(d)
                  ? "rounded-full bg-[#e2f1a6] text-black font-bold"
                  : isToday(d)
                    ? "rounded-full text-[#e2f1a6] hover:bg-zinc-800"
                    : "rounded-full text-[#8c8c8c] hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2 border-t border-white/5 pt-3">
        <button
          onClick={() => { onSelect(today); onClose(); }}
          className="flex-1 rounded-lg bg-zinc-800 py-1.5 text-[11px] font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          Today
        </button>
        <button
          onClick={() => { onSelect(null as any); onClose(); }}
          className="flex-1 rounded-lg bg-zinc-800 py-1.5 text-[11px] font-medium text-[#8c8c8c] hover:bg-zinc-700 hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>
    </motion.div>
  );
}
