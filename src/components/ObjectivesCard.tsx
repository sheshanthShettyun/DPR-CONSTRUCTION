"use client";

import { motion } from "framer-motion";
import { Calendar, Check } from "lucide-react";

const tasks = [
  { title: "Daily Design Challenge", time: "09:00 - 09:30", done: true },
  { title: "Weekly Team Meet", time: "16:45 - 17:45", done: false },
  { title: "Teezaro Project Presentation", time: "19:15 - 20:00", done: false },
];

export default function ObjectivesCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="dashboard-card flex flex-col gap-5"
    >
      <div className="flex items-start justify-between">
        <h2 className="text-[15px] font-medium tracking-wide text-[#8c8c8c]">Objectives</h2>
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#8c8c8c]">
          <Calendar size={13} strokeWidth={1.8} />
          <span>Aug 23</span>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        {tasks.map((task) => (
          <div key={task.title} className="flex items-center justify-between py-2.5">
            <div className="min-w-0 pr-2">
              <h3 className={`truncate text-[13px] font-medium ${task.done ? "text-[#6b7280] line-through" : "text-[#8c8c8c]"}`}>
                {task.title}
              </h3>
              <p className="mt-0.5 text-[11px] text-[#6b7280]">{task.time}</p>
            </div>
            <button
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                task.done ? "bg-[#e2f1a6]" : "border border-white/10 hover:border-white/25"
              }`}
            >
              {task.done && <Check size={11} strokeWidth={3} className="text-black" />}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
