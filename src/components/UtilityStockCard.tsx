"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Upload, X, History } from "lucide-react";
import OptimizerPanel from "@/components/OptimizerPanel";
import ImportSheetModal from "@/components/ImportSheetModal";
import DownloadHistoryModal from "@/components/DownloadHistoryModal";

interface StockItem {
  title: string;
  qty: number;
  level: string;
}

interface Stock {
  totalItems: number;
  available: number;
  lowStock: number;
  lowItems?: StockItem[];
  topItems?: StockItem[];
}

export default function UtilityStockCard({ projectId }: { projectId?: string | null }) {
  const [stock, setStock] = useState<Stock | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [optOpen, setOptOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ totalItems: 0, available: 0, lowStock: 0 });

  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
  const refresh = () =>
    fetch(`/api/utility-stock${qs}`)
      .then((r) => r.json())
      .then((d) => {
        setStock(d);
        setLoaded(true);
      });

  useEffect(() => {
    setMounted(true);
    refresh();
    const h = () => refresh();
    window.addEventListener("dpr:refresh", h);
    return () => window.removeEventListener("dpr:refresh", h);
  }, [projectId]);

  const openManage = () => {
    if (stock) setForm({ totalItems: data.totalItems, available: data.available, lowStock: data.lowStock });
    setManageOpen(true);
  };

  const bump = async (delta: number) => {
    if (!stock && delta < 0) return;
    const base = stock ?? { totalItems: 0, available: 0, lowStock: 0 };
    const available = Math.max(0, base.available + delta);
    const totalItems = Math.max(0, base.totalItems + delta);
    setStock({ ...base, available, totalItems });
    await fetch("/api/utility-stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: projectId ?? null, available, totalItems }),
    });
    refresh();
  };

  const saveManage = async () => {    await fetch("/api/utility-stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: projectId ?? null,
        totalItems: Math.max(0, Number(form.totalItems) || 0),
        available: Math.max(0, Number(form.available) || 0),
        lowStock: Math.max(0, Number(form.lowStock) || 0),
      }),
    });
    setManageOpen(false);
    refresh();
  };

  if (!loaded) return null;
  const data: Stock = stock ?? { totalItems: 0, available: 0, lowStock: 0 };
  const pct = data.totalItems > 0 ? Math.round((data.available / data.totalItems) * 100) : 0;
  const lowPct = data.totalItems > 0 ? Math.round((data.lowStock / data.totalItems) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="dashboard-card flex min-w-0 flex-col gap-4 self-stretch xl:row-span-2"
    >
      <div className="flex items-start justify-between">
        <h2 className="text-[15px] font-medium tracking-wide text-[#8c8c8c]">Utility in Stock</h2>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setImportOpen(true)} className="text-[#8c8c8c] transition-colors hover:text-white" title="Import utilities sheet">
            <Upload size={14} strokeWidth={2.5} />
          </button>
          <button onClick={() => setOptOpen(true)} className="text-[#8c8c8c] transition-colors hover:text-white" title="Open DPR Optimizer">
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-end justify-between">
          <div>
            <div className="mb-2 text-[28px] font-bold leading-none tracking-tight text-white">{data.totalItems}</div>
            <div className="text-[15px] font-medium text-[#8c8c8c]">Total items</div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => bump(-1)}
              title="Remove one from stock"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1f1f1f] text-[14px] leading-none text-[#8c8c8c] transition-colors hover:bg-white/10 hover:text-white"
            >
              −
            </button>
            <button
              onClick={() => bump(1)}
              title="Add one to stock"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e2f1a6]/15 text-[14px] leading-none text-[#e2f1a6] transition-colors hover:bg-[#e2f1a6]/25"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between">
          <div className="text-[15px] text-[#8c8c8c]">
            <span className="mr-1 font-semibold text-white">{data.available}</span> available
          </div>
          <div className="text-[15px] text-[#8c8c8c]">
            <span className="mr-1 font-semibold text-white">{data.lowStock}</span> low stock
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
            <span className="text-[12px] font-semibold text-white">{data.available}</span>
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
            <span className="text-[12px] font-semibold text-white">{data.lowStock}</span>
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
          {(data.lowItems ?? []).length > 0 && (
            <div className="mt-1.5 flex flex-col gap-1">
              {(data.lowItems ?? []).map((it) => (
                <div key={it.title} className="flex items-center gap-2 text-[11px]">
                  <span className={`h-1 w-1 rounded-full ${it.level === "Critical" ? "bg-rose-400" : "bg-amber-500"}`} />
                  <span className="flex-1 truncate text-[#8c8c8c]">{it.title}</span>
                  <span className="font-medium text-amber-300">{it.qty} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {(data.topItems ?? []).length > 0 && (
          <div className="rounded-xl bg-[#1f1f1f] p-2.5">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e2f1a6]" />
              <span className="flex-1 text-[12px] text-white">Well stocked</span>
            </div>
            <div className="flex flex-col gap-1">
              {(data.topItems ?? []).map((it) => (
                <div key={it.title} className="flex items-center gap-2 text-[11px]">
                  <span className="flex-1 truncate text-[#8c8c8c]">{it.title}</span>
                  <span className="font-medium text-[#e2f1a6]">{it.qty} units</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex gap-2">
        <button
          onClick={() => {
            window.open(`/api/utility-stock/pdf${qs}`, "_blank");
            fetch("/api/downloads", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                filename: "Site_Operations_Report_" + new Date().toISOString().split("T")[0] + ".pdf",
                projectId: projectId ?? null,
                kind: "site-report",
              }),
            }).catch(() => {});
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#101010] py-1.5 text-[10px] font-medium text-[#e2f1a6] transition-colors hover:bg-[#1a1a1a] hover:text-white"
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
        <button
          onClick={() => setHistoryOpen(true)}
          title="Download history"
          className="flex items-center justify-center rounded-lg bg-[#101010] px-2.5 text-[#8c8c8c] transition-colors hover:bg-[#1a1a1a] hover:text-white"
        >
          <History size={13} />
        </button>
      </div>
      <DownloadHistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} projectId={projectId} />
      <OptimizerPanel open={optOpen} onClose={() => setOptOpen(false)} />
      <ImportSheetModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={() => {
          refresh();
          window.dispatchEvent(new Event("dpr:refresh"));
        }}
      />

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
