"use client";

import { motion } from "framer-motion";
import { Wrench, Fuel, Package, Users, Zap, Shield, Truck, HardHat } from "lucide-react";

const categories = [
  { name: "Equipment", icon: Wrench, amount: "$2,400", pct: 38.5, color: "bg-rose-500" },
  { name: "Fuel & Energy", icon: Fuel, amount: "$920", pct: 14.7, color: "bg-amber-500" },
  { name: "Materials", icon: Package, amount: "$680", pct: 10.9, color: "bg-indigo-400" },
  { name: "Labor", icon: Users, amount: "$580", pct: 9.3, color: "bg-yellow-600" },
  { name: "Utilities", icon: Zap, amount: "$420", pct: 6.7, color: "bg-[#e2f1a6]" },
  { name: "Safety & Compliance", icon: Shield, amount: "$340", pct: 5.4, color: "bg-purple-500" },
  { name: "Fleet", icon: Truck, amount: "$510", pct: 8.2, color: "bg-emerald-400" },
  { name: "PPE & Gear", icon: HardHat, amount: "$280", pct: 4.5, color: "bg-blue-400" },
  { name: "Other", icon: Wrench, amount: "$110", pct: 1.8, color: "bg-zinc-400" },
];

const statsCards = [
  { label: "Largest", value: "$2,400", sub: "Equipment · 38.5%" },
  { label: "Smallest", value: "$110", sub: "Other · 1.8%" },
  { label: "Most Volatile", value: "$680", sub: "Materials · $450↑" },
  { label: "Most Stable", value: "$280", sub: "PPE · $0 change" },
];

export default function ExpensesCard() {
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
            <span>Feb 2026</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[30px] font-bold tracking-tight text-white">$6,240</span>
            <span className="text-[11px] text-[#8c8c8c]">USD</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-0.5">
            {[...Array(16)].map((_, j) => (
              <div key={j} className={`h-3 w-2 rounded-sm ${j < 13 ? "bg-[#e2f1a6]" : "bg-white/5"}`} />
            ))}
          </div>
          <div className="text-[9px] text-[#8c8c8c]">
            <span className="text-white">$6,240</span> / $7,800 BUDGET
          </div>
        </div>
      </div>

      <div className="flex gap-1.5">
        <span className="rounded-full bg-[#1f1f1f] px-2.5 py-1 text-[9px] text-[#8c8c8c]">
          Potential Savings: <span className="font-medium text-white">$680/mo</span>
        </span>
        <span className="rounded-full bg-amber-900/20 px-2.5 py-1 text-[9px] text-amber-500">
          Savings Rate: <span className="font-medium">8.2% / 20% target</span>
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
        {categories.map((cat) => (
          <div key={cat.name} className="grid grid-cols-[2fr_1fr_1fr] items-center py-1">
            <div className="flex items-center gap-2">
              <cat.icon size={12} strokeWidth={1.5} className="text-[#8c8c8c]" />
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
            <span className="text-right text-[12px] font-medium text-white">{cat.amount}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
