"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Fuel, Package, Users, Zap, Shield, Truck, HardHat, type LucideIcon } from "lucide-react";

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

export default function ExpensesCard() {
  const [data, setData] = useState<ExpensesData | null>(null);

  useEffect(() => {
    fetch("/api/expenses").then((r) => r.json()).then(setData);
  }, []);

  if (!data || !data.summary) return null;
  const { categories, summary, stats } = data;

  const statsCards = stats
    ? [
        { label: "Largest", value: `$${stats.largest.amount}`, sub: `${stats.largest.name} · ${stats.largest.pct}%` },
        { label: "Smallest", value: `$${stats.smallest.amount}`, sub: `${stats.smallest.name} · ${stats.smallest.pct}%` },
        { label: "Most Volatile", value: `$${stats.mostVolatile.amount}`, sub: `${stats.mostVolatile.name} · $${stats.mostVolatile.changeAmount}↑` },
        { label: "Most Stable", value: `$${stats.mostStable.amount}`, sub: `${stats.mostStable.name} · $${stats.mostStable.changeAmount} change` },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="dashboard-card flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[9px] font-medium uppercase tracking-wider text-[#8c8c8c]">
            <span>Monthly Expenses</span>
            <span className="h-1 w-1 rounded-full bg-[#8c8c8c]/40" />
            <span>{summary.month}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[30px] font-bold tracking-tight text-white">${summary.totalSpent.toLocaleString()}</span>
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

      <div className="flex gap-1.5">
        <span className="rounded-full bg-[#1f1f1f] px-2.5 py-1 text-[9px] text-[#8c8c8c]">
          Potential Savings: <span className="font-medium text-white">${summary.potentialSavings}/mo</span>
        </span>
        <span className="rounded-full bg-amber-900/20 px-2.5 py-1 text-[9px] text-amber-500">
          Savings Rate: <span className="font-medium">{summary.savingsRatePct}% / {summary.savingsTargetPct}% target</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {statsCards.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 rounded-xl bg-[#1f1f1f] p-3">
            <span className="text-[9px] font-medium uppercase tracking-wider text-[#8c8c8c]">{s.label}</span>
            <span className="text-lg font-bold text-white">{s.value}</span>
            <span className="text-[9px] text-[#8c8c8c]">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 rounded-xl bg-[#1f1f1f] p-3">
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
    </motion.div>
  );
}
