"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Wrench, Fuel, Package, Users, Zap, Shield, Truck, HardHat, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Wrench, Fuel, Package, Users, Zap, Shield, Truck, HardHat };

interface Category {
  id: number;
  name: string;
  amount: number;
  pct: number;
  color: string;
  icon: string;
  changeAmount: number;
}

interface Summary {
  month: string;
  totalSpent: number;
  budget: number;
  potentialSavings: number;
  savingsRatePct: number;
  savingsTargetPct: number;
  sparklineFilled: number;
  sparklineTotal: number;
}

interface ExpensesData {
  categories: Category[];
  summary: Summary | null;
  stats: { largest: Category; smallest: Category; mostVolatile: Category; mostStable: Category } | null;
}

function StatBox({ label, value, sub, category, color }: { label: string; value: string; sub: string; category?: Category; color?: string }) {
  const [flipped, setFlipped] = useState(false);
  const Icon = category ? (iconMap[category.icon] ?? Wrench) : null;

  return (
    <div
      className="group relative cursor-pointer perspective-[600px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{ rotateX: flipped ? 180 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="flex flex-col gap-1 rounded-xl bg-[#1f1f1f] p-3"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-[9px] font-medium uppercase tracking-wider text-[#8c8c8c]">{label}</span>
          <span className="text-lg font-bold text-white">{value}</span>
          <span className="text-[9px] text-[#8c8c8c]">{sub}</span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)", background: color ?? "#1f1f1f" }}
        >
          {Icon && <Icon size={20} strokeWidth={1.5} className="text-white" />}
          <span className="text-[11px] font-semibold text-white">{category?.name}</span>
          <span className="text-lg font-bold text-white">${category?.amount}</span>
          <span className="text-[9px] text-white/70">{category?.pct}% of budget</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function ExpensesCard() {
  const [data, setData] = useState<ExpensesData | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch("/api/expenses").then((r) => r.json()).then(setData);
  }, []);

  if (!data || !data.summary) return null;
  const { categories, summary, stats } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="dashboard-card flex flex-col gap-3.5"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[9px] font-medium uppercase tracking-wider text-[#8c8c8c]">
            <span>Monthly Expenses</span>
            <span className="h-1 w-1 rounded-full bg-[#8c8c8c]/40" />
            <span>{summary.month}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-bold tracking-tight text-white">${summary.totalSpent.toLocaleString()}</span>
            <span className="text-[11px] text-[#8c8c8c]">USD</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-0.5">
            {[...Array(summary.sparklineTotal)].map((_, j) => (
              <div key={j} className={`h-3 w-2 rounded-sm ${j < summary.sparklineFilled ? "bg-[#e2f1a6]" : "bg-white/5"}`} />
            ))}
          </div>
          <div className="text-[9px] text-[#8c8c8c]">
            <span className="text-white">${summary.totalSpent.toLocaleString()}</span> / ${summary.budget.toLocaleString()} BUDGET
          </div>
        </div>
      </div>

      {/* Savings badges */}
      <div className="flex gap-1.5">
        <span className="rounded-full bg-[#1f1f1f] px-2.5 py-1 text-[9px] text-[#8c8c8c]">
          Potential Savings: <span className="font-medium text-white">${summary.potentialSavings}/mo</span>
        </span>
        <span className="rounded-full bg-amber-900/20 px-2.5 py-1 text-[9px] text-amber-500">
          Savings Rate: <span className="font-medium">{summary.savingsRatePct}% / {summary.savingsTargetPct}% target</span>
        </span>
      </div>

      {/* Stats grid with flip cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <StatBox label="Largest" value={`$${stats.largest.amount}`} sub={`${stats.largest.name} · ${stats.largest.pct}%`} category={stats.largest} color="rgba(226,241,166,0.15)" />
          <StatBox label="Smallest" value={`$${stats.smallest.amount}`} sub={`${stats.smallest.name} · ${stats.smallest.pct}%`} category={stats.smallest} color="rgba(226,241,166,0.10)" />
          <StatBox label="Most Volatile" value={`$${stats.mostVolatile.amount}`} sub={`${stats.mostVolatile.name} · $${stats.mostVolatile.changeAmount}↑`} category={stats.mostVolatile} color="rgba(245,158,11,0.12)" />
          <StatBox label="Most Stable" value={`$${stats.mostStable.amount}`} sub={`${stats.mostStable.name} · $${stats.mostStable.changeAmount} change`} category={stats.mostStable} color="rgba(100,116,139,0.12)" />
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-[#1f1f1f] py-1.5 text-[10px] font-medium text-[#8c8c8c] transition-colors hover:bg-white/[0.04] hover:text-white"
      >
        {expanded ? "Collapse" : "View All Categories"}
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={12} />
        </motion.span>
      </button>

      {/* Expanded category table */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {expanded && (
            <div className="flex max-h-[220px] flex-col gap-2.5 overflow-y-auto rounded-xl bg-[#1f1f1f] p-3 pr-2 no-scrollbar">
              <div className="mb-1 grid grid-cols-[2fr_1fr_1fr] text-[9px] font-medium uppercase tracking-wider text-[#8c8c8c]">
                <span>Category</span>
                <span>Share</span>
                <span className="text-right">Amount</span>
              </div>
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon] ?? Wrench;
                return (
                  <div key={cat.id} className="grid grid-cols-[2fr_1fr_1fr] items-center py-1">
                    <div className="flex items-center gap-2">
                      <Icon size={12} strokeWidth={1.5} className="text-[#8c8c8c]" />
                      <span className="text-[12px] text-white">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 pr-1">
                      <div className="h-1.5 flex-1 rounded-full bg-zinc-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(cat.pct * 2.5, 100)}%` }}
                          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full rounded-full ${cat.color}`}
                        />
                      </div>
                      <span className="w-8 text-[9px] text-[#8c8c8c]">{cat.pct}%</span>
                    </div>
                    <span className="text-right text-[12px] font-medium text-white">${cat.amount}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
