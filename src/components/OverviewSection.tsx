"use client";

import { motion } from "framer-motion";
import { Box, Users, DollarSign, TrendingUp, Clock, Hammer } from "lucide-react";

const stats = [
  { label: "Total Equipment", value: "1,556", icon: Box, change: "+12 this week" },
  { label: "Active Personnel", value: "248", icon: Users, change: "98% dispatched" },
  { label: "Monthly Budget", value: "$842k", icon: DollarSign, change: "23% remaining" },
  { label: "Site Efficiency", value: "94.2%", icon: TrendingUp, change: "+2.1% vs last month" },
];

const recent = [
  { id: "#US045861", action: "Dispatched to Houston, TX", time: "14 min ago", status: "amber" },
  { id: "#EP0111454", action: "Delivered to Paris, FR", time: "38 min ago", status: "emerald" },
  { id: "#US045860", action: "Picked up in Seattle, WA", time: "1 hour ago", status: "orange" },
  { id: "#EP045840", action: "En route to Prague, CZ", time: "2 hours ago", status: "amber" },
  { id: "#MD020384", action: "Maintenance check complete", time: "3 hours ago", status: "emerald" },
];

const statusColors: Record<string, string> = {
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  orange: "bg-orange-500",
};

export default function OverviewSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2 }}
            className="dashboard-card"
          >
            <div className="mb-4 flex items-center justify-between">
              <stat.icon size={18} className="text-[#e2f1a6]" strokeWidth={2} />
              <span className="text-[10px] text-[#8c8c8c]">{stat.change}</span>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-sm text-[#8c8c8c]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="dashboard-card col-span-2"
        >
          <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
            <Clock size={18} className="text-[#e2f1a6]" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recent.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${statusColors[item.status]}`} />
                  <div>
                    <p className="text-sm font-semibold">{item.id}</p>
                    <p className="text-xs text-[#8c8c8c]">{item.action}</p>
                  </div>
                </div>
                <span className="text-xs text-[#6b7280]">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="dashboard-card"
        >
          <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
            <Hammer size={18} className="text-[#e2f1a6]" />
            Active Sites
          </h3>
          <div className="space-y-4">
            {[
              { name: "Dallas Downtown", progress: 72, status: "On Track" },
              { name: "Berlin Central", progress: 45, status: "Delayed" },
              { name: "Seattle Waterfront", progress: 91, status: "Ahead" },
              { name: "Warsaw Industrial", progress: 33, status: "On Track" },
            ].map((site, i) => (
              <motion.div
                key={site.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{site.name}</span>
                  <span className={`${
                    site.status === "Ahead" ? "text-emerald-500" :
                    site.status === "Delayed" ? "text-amber-500" :
                    "text-[#8c8c8c]"
                  }`}>
                    {site.status}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${site.progress}%` }}
                    transition={{ duration: 0.7, delay: 0.6 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${
                      site.status === "Ahead" ? "bg-emerald-500" :
                      site.status === "Delayed" ? "bg-amber-500" :
                      "bg-[#e2f1a6]"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
