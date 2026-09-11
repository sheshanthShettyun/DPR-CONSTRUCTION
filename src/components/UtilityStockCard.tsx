"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import OptimizerPanel from "@/components/OptimizerPanel";

interface Stock {
  totalItems: number;
  available: number;
  lowStock: number;
}

export default function UtilityStockCard() {
  const [stock, setStock] = useState<Stock | null>(null);
  const [optOpen, setOptOpen] = useState(false);

  useEffect(() => {
    fetch("/api/utility-stock").then((r) => r.json()).then(setStock);
  }, []);

  if (!stock) return null;
  const pct = stock.totalItems > 0 ? Math.round((stock.available / stock.totalItems) * 100) : 0;
  const lowPct = stock.totalItems > 0 ? Math.round((stock.lowStock / stock.totalItems) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="dashboard-card flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <h2 className="text-[15px] font-medium tracking-wide text-[#8c8c8c]">Utility in Stock</h2>
        <button onClick={() => setOptOpen(true)} className="text-[#8c8c8c] transition-colors hover:text-white" title="Open DPR Optimizer">
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div>
        <div className="mb-2 text-[28px] font-bold leading-none tracking-tight text-white">{stock.totalItems}</div>
        <div className="text-[15px] font-medium text-[#8c8c8c]">Total items</div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between">
          <div className="text-[15px] text-[#8c8c8c]">
            <span className="mr-1 font-semibold text-white">{stock.available}</span> available
          </div>
          <div className="text-[15px] text-[#8c8c8c]">
            <span className="mr-1 font-semibold text-white">{stock.lowStock}</span> low stock
          </div>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#333]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 h-full rounded-full bg-[#e2f1a6]"
          />
        </div>
      </div>
      {/* Stock breakdown */}
      <div className="flex flex-col gap-2.5 border-t border-white/5 pt-3">
        <span className="text-[9px] font-medium uppercase tracking-wider text-[#8c8c8c]">Stock breakdown</span>
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e2f1a6]" />
            <span className="flex-1 text-[12px] text-[#8c8c8c]">Available</span>
            <span className="text-[12px] font-medium text-white">{stock.available}</span>
            <span className="w-9 text-right text-[11px] text-[#6b7280]">{pct}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-[#e2f1a6]"
            />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="flex-1 text-[12px] text-[#8c8c8c]">Low stock</span>
            <span className="text-[12px] font-medium text-white">{stock.lowStock}</span>
            <span className="w-9 text-right text-[11px] text-[#6b7280]">{lowPct}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${lowPct}%` }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <button
        onClick={() => setOptOpen(true)}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-[#1f1f1f] py-1.5 text-[10px] font-medium text-[#8c8c8c] transition-colors hover:bg-white/[0.04] hover:text-white"
      >
        Plan restock
        <ArrowUpRight size={12} strokeWidth={2.5} />
      </button>
      <OptimizerPanel open={optOpen} onClose={() => setOptOpen(false)} />
    </motion.div>
  );
}
