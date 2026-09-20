"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
  amber: { bg: "bg-amber-900/20", text: "text-amber-500", dot: "bg-amber-500" },
  emerald: { bg: "bg-emerald-900/20", text: "text-emerald-500", dot: "bg-emerald-500" },
  orange: { bg: "bg-orange-900/20", text: "text-orange-500", dot: "bg-orange-500" },
};

interface Props {
  id: string;
  from: string;
  to: string;
  flag: string;
  sub: string;
  load: string;
  status: string;
  color: string;
  onClick: () => void;
  onStatusChange?: (id: string, status: string) => void;
}

const STATUSES = ["Picked Up", "In Transit", "Delayed", "Delivered", "Maintenance"];

export default function OrderCard({ id, from, to, flag, sub, load, status, color, onClick, onStatusChange }: Props) {
  const c = colorMap[color] ?? colorMap.emerald;
  const site = `${from} → ${to}`;

  const changeStatus = async (next: string) => {
    if (next === status) return;
    await fetch(`/api/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    onStatusChange?.(id, next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
      className="dashboard-card"
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="font-bold">{id}</span>
        <div className="flex items-center gap-2 text-[10px] text-[#8c8c8c]">Job Site</div>
      </div>
      <div className="mb-5 space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-[#8c8c8c]">Job Site</span>
          <span className="font-medium">{site} <span className="ml-1">{flag}</span></span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8c8c8c]">Subcontractor</span>
          <span className="font-medium">{sub}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8c8c8c]">Load Cap</span>
          <span className="font-medium">{load}</span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/5 pt-3.5">
        <span className="text-[10px] uppercase tracking-wider text-[#8c8c8c]">Job Site</span>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-[10px] font-medium text-[#8c8c8c] transition-colors hover:bg-white/10 hover:text-white"
          >
            Track
            <ArrowUpRight size={11} />
          </motion.button>
          <div className={`status-chip ${c.bg} ${c.text}`}>
            <div className={`status-dot ${c.dot}`} />
            {onStatusChange ? (
              <select
                value={STATUSES.includes(status) ? status : "In Transit"}
                onChange={(e) => changeStatus(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                title="Change status"
                className="cursor-pointer appearance-none bg-transparent pr-3 outline-none [&>option]:bg-[#1a1a1a]"
                style={{ backgroundImage: "none" }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              status
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
