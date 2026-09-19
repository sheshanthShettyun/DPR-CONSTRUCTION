"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import OptimizerPanel from "@/components/OptimizerPanel";

interface Stock {
  totalItems: number;
  available: number;
  lowStock: number;
}

export default function UtilityStockCard() {
  const [stock, setStock] = useState<Stock | null>(null);
  const [optOpen, setOptOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ totalItems: 0, available: 0, lowStock: 0 });

  const refresh = () => fetch("/api/utility-stock").then((r) => r.json()).then(setStock);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, []);

  const openManage = () => {
    if (stock) setForm({ totalItems: stock.totalItems, available: stock.available, lowStock: stock.lowStock });
    setManageOpen(true);
  };

  const saveManage = async () => {
    await fetch("/api/utility-stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalItems: Math.max(0, Number(form.totalItems) || 0),
        available: Math.max(0, Number(form.available) || 0),
        lowStock: Math.max(0, Number(form.lowStock) || 0),
      }),
    });
    setManageOpen(false);
    refresh();
  };

  if (!stock) return null;
  const pct = stock.totalItems > 0 ? Math.round((stock.available / stock.totalItems) * 100) : 0;
  const lowPct = stock.totalItems > 0 ? Math.round((stock.lowStock / stock.totalItems) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="dashboard-card flex min-w-0 flex-col gap-4 self-stretch xl:row-span-2"
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
      {/* Stock preview items */}
      <div className="flex flex-col gap-2 border-t border-white/5 pt-3">
        <span className="text-[9px] font-medium uppercase tracking-wider text-[#8c8c8c]">Preview</span>
        <div className="rounded-xl bg-[#1f1f1f] p-2.5">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e2f1a6]" />
            <span className="flex-1 text-[12px] text-white">Available units</span>
            <span className="text-[12px] font-semibold text-white">{stock.available}</span>
            <span className="rounded-full bg-[#e2f1a6]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#e2f1a6]">{pct}%</span>
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
        <div className="rounded-xl bg-[#1f1f1f] p-2.5">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="flex-1 text-[12px] text-white">Low-stock units</span>
            <span className="text-[12px] font-semibold text-white">{stock.lowStock}</span>
            <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500">{lowPct}%</span>
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

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setOptOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#1f1f1f] py-1.5 text-[10px] font-medium text-[#8c8c8c] transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          Plan restock
          <ArrowUpRight size={12} strokeWidth={2.5} />
        </button>
        <button
          onClick={openManage}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#1f1f1f] py-1.5 text-[10px] font-medium text-[#8c8c8c] transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          Manage stock
        </button>
      </div>

      <button
        onClick={() => window.open("/api/utility-stock/pdf", "_blank")}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-[#101010] py-1.5 text-[10px] font-medium text-[#e2f1a6] transition-colors hover:bg-[#1a1a1a] hover:text-white"
        title="Download as PDF"
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#e2f1a6"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 3h14" />
          <path d="L3 11h6a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4h-6" />
          <line x1="9" y1="20" x2="9.01" y2="20" />
          <line x1="15" y1="20" x2="15.01" y2="20" />
        </svg>
        Download PDF
      </button>
      <OptimizerPanel open={optOpen} onClose={() => setOptOpen(false)} />

      {mounted &&
        createPortal(
          manageOpen && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
              onClick={() => setManageOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="dashboard-card w-full max-w-[380px]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[15px] font-medium tracking-wide text-white">Manage stock</h2>
                  <button onClick={() => setManageOpen(false)} className="text-[#8c8c8c] transition-colors hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex flex-col gap-2.5">
                  {(
                    [
                      ["totalItems", "Total items"],
                      ["available", "Available units"],
                      ["lowStock", "Low-stock units"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between rounded-xl bg-[#1f1f1f] px-3 py-2.5">
                      <span className="text-[12px] text-[#8c8c8c]">{label}</span>
                      <input
                        type="number"
                        min={0}
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                        className="w-24 rounded bg-black/40 px-2 py-1 text-right text-[13px] font-semibold text-white outline-none"
                      />
                    </label>
                  ))}
                </div>
                <button
                  onClick={saveManage}
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#e2f1a6] py-2 text-[13px] font-semibold text-black transition-colors hover:bg-[#d4f05a]"
                >
                  Save changes
                </button>
              </div>
            </div>
          ),
          document.body
        )}
    </motion.div>
  );
}
