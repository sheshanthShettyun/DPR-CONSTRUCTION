"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, TriangleAlert } from "lucide-react";
import { ITEMS, RECIPES, type DayPlan, type Inventory } from "@/lib/dprOptimizer";

const DEFAULT_INV: Inventory = { cementBags: 40, waterLitres: 3000, aggregateKg: 8000, dieselLitres: 120, crew: 8 };

export default function OptimizerPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [inv, setInv] = useState<Inventory>(DEFAULT_INV);
  const [picked, setPicked] = useState<string[]>(["slab-pour-100", "dewater-pit3", "compaction-bay2"]);
  const [plan, setPlan] = useState<DayPlan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) setPlan(null);
  }, [open ]);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const run = async () => {
    setLoading(true);
    const r = await fetch("/api/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskIds: picked, inventory: inv }),
    });
    setPlan(await r.json());
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="dashboard-card max-h-[85vh] w-full max-w-[560px] overflow-y-auto"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-[#e2f1a6]" />
                <h2 className="text-[15px] font-medium tracking-wide text-white">DPR Optimizer</h2>
              </div>
              <button onClick={onClose} className="text-[#8c8c8c] transition-colors hover:text-white">
                <X size={16} />
              </button>
            </div>

            <p className="mb-4 text-[12px] leading-relaxed text-[#8c8c8c]">
              Enter what&apos;s on site. The estimator plans today&apos;s tasks, flags shortages, and projects XP.
            </p>

            <div className="mb-5 grid grid-cols-2 gap-2.5">
              {ITEMS.map(({ key, label }) => (
                <label key={key} className="flex flex-col gap-1.5 rounded-xl bg-[#1f1f1f] p-3">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#8c8c8c]">{label}</span>
                  <input
                    type="number"
                    min={0}
                    value={inv[key]}
                    onChange={(e) => setInv({ ...inv, [key]: Math.max(0, Number(e.target.value) || 0) })}
                    className="w-full bg-transparent text-lg font-bold text-white outline-none"
                  />
                </label>
              ))}
            </div>

            <div className="mb-5 flex flex-col gap-1.5">
              {RECIPES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => toggle(r.id)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${
                    picked.includes(r.id) ? "bg-[#e2f1a6]/10" : "bg-[#1f1f1f] hover:bg-[#242424]"
                  }`}
                >
                  <span className="text-[13px] text-white">{r.title}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-[11px] text-[#e2f1a6]">+{r.baseXp} XP</span>
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full ${picked.includes(r.id) ? "bg-[#e2f1a6]" : "border border-white/10"}`}>
                      {picked.includes(r.id) && <Check size={10} strokeWidth={3.5} className="text-black" />}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={run}
              disabled={loading || picked.length === 0}
              className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#e2f1a6] px-4 py-2.5 text-[13px] font-semibold text-black transition-colors hover:bg-[#d4f05a] disabled:opacity-40"
            >
              <Sparkles size={14} />
              {loading ? "Planning…" : "Generate today's plan"}
            </button>

            {plan && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-xl bg-[#1f1f1f] p-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#8c8c8c]">Projected cost</div>
                    <div className="text-xl font-bold text-white">${plan.totals.estimate.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-[#8c8c8c]">Projected XP</div>
                    <div className="text-xl font-bold text-[#e2f1a6]">+{plan.totals.xp}</div>
                  </div>
                </div>

                {plan.shortages.length > 0 && (
                  <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-amber-300">
                      <TriangleAlert size={13} />
                      Request from depot
                    </div>
                    {plan.shortages.map((s) => (
                      <div key={s.item} className="flex justify-between text-[12px] text-white">
                        <span className="capitalize">{s.item.replace(/([A-Z])/g, " $1")}</span>
                        <span>
                          need {s.need.toLocaleString()} <span className="text-[#8c8c8c]">(have {s.have.toLocaleString()})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {plan.tasks.map((t, i) => (
                  <div key={t.id} className="flex items-center justify-between rounded-xl bg-[#1f1f1f] px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[10px] font-bold text-[#8c8c8c]">
                        {i + 1}
                      </span>
                      <div>
                        <div className="text-[13px] text-white">{t.title}</div>
                        {t.status === "short" && (
                          <div className="text-[11px] text-amber-300">
                            short: {Object.entries(t.gaps).map(([k, v]) => `${v} ${k}`).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${t.status === "clear" ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-300" : "border-amber-300/20 bg-amber-300/10 text-amber-300"}`}>
                      {t.status === "clear" ? `+${t.xp} XP` : "blocked"}
                    </span>
                  </div>
                ))}
                <p className="text-[11px] text-[#6b7280]">Do clear tasks first in listed order; blocked tasks unlock after depot delivery.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
