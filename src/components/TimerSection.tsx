"use client";

import { motion } from "framer-motion";
import HourglassIcon from "./HourglassIcon";

const siteCompletion = [
  { name: "Dallas", done: 72 },
  { name: "Berlin", done: 45 },
  { name: "Seattle", done: 91 },
  { name: "Warsaw", done: 33 },
];

export default function TimerSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
      className="dashboard-card flex flex-col items-center justify-center gap-4"
    >
      <div className="flex flex-col items-center gap-2">
        <HourglassIcon />
      </div>
      <div className="flex w-full flex-col gap-2">
        {siteCompletion.map((site, i) => (
          <motion.div
            key={site.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#8c8c8c]">{site.name}</span>
              <span className="font-medium">{site.done}%</span>
            </div>
            <div className="h-1 rounded-full bg-zinc-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${site.done}%` }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-[#e2f1a6]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
