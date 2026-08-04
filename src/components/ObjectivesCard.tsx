"use client";

import { motion } from "framer-motion";
import { Clipboard, Calendar, Check } from "lucide-react";

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
      className="dashboard-card flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03]">
          <Clipboard size={15} strokeWidth={1.8} className="text-[#e2f1a6]" />
        </div>
        <div>
          <h2 className="text-[15px] font-bold leading-tight tracking-tight text-white">Objectives</h2>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-[#8c8c8c]">
            <Calendar size={12} strokeWidth={1.8} />
            <span>August 23</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {tasks.map((task, i) => (
          <div
            key={task.title}
            className={`flex items-center justify-between py-2.5 ${
              i < tasks.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <div className="min-w-0 pr-2">
              <h3 className={`text-[13px] font-medium truncate ${task.done ? "text-[#8c8c8c] line-through" : "text-white"}`}>
                {task.title}
              </h3>
              <p className="mt-0.5 text-[11px] text-[#8c8c8c]">{task.time}</p>
            </div>
            <button
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                task.done ? "bg-[#e2f1a6]" : "border border-[#2d2d2d] hover:border-[#8c8c8c]"
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
