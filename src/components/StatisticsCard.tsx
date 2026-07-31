"use client";

import { motion } from "framer-motion";
import { TrendingUp, ChevronDown } from "lucide-react";
import BarChart from "./BarChart";

export default function StatisticsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      className="card-bg flex flex-1 flex-col rounded-3xl border border-gray-100 p-6 shadow-sm"
    >
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xl font-bold text-gray-900">
            <TrendingUp size={18} strokeWidth={2} />
            <span>Statistics</span>
          </div>
          <div className="ml-4 flex items-center space-x-4 text-sm font-medium text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-gray-900" />
              <span>Operations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-yellow-accent" />
              <span>Data transfer</span>
            </div>
          </div>
        </div>
        <div className="flex cursor-pointer items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700">
          <span>2025</span>
          <ChevronDown size={12} className="ml-2" />
        </div>
      </div>
      <BarChart />
    </motion.div>
  );
}
