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
}

export default function OrderCard({ id, from, to, flag, sub, load, status, color, onClick }: Props) {
  const c = colorMap[color];
  const site = `${from} → ${to}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
      className="dashboard-card"
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="font-bold">{id}</span>
        <div className="flex items-center gap-2 text-[10px] text-[#8c8c8c]">Job Site</div>
      </div>
      <div className="mb-6 space-y-3">
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
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
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
            {status}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
