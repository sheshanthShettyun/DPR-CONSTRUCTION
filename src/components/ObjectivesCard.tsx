"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check } from "lucide-react";
import { XP_PER_OBJECTIVE } from "@/lib/xp";

interface Objective {
  id: number;
  title: string;
  time: string;
  done: boolean;
  dueDate: string;
}

export default function ObjectivesCard({ projectId }: { projectId?: string | null }) {
  const [tasks, setTasks] = useState<Objective[]>([]);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
  const refresh = () => fetch(`/api/objectives${qs}`).then((r) => r.json()).then(setTasks);

  useEffect(() => {
    refresh();
  }, [projectId]);

  const toggleDone = async (task: Objective) => {
    const next = !task.done;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: next } : t)));
    await fetch(`/api/objectives/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: next }),
    });
    const xpRes = await fetch("/api/xp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta: next ? XP_PER_OBJECTIVE : -XP_PER_OBJECTIVE }),
    });
    const xp = await xpRes.json().catch(() => null);
    window.dispatchEvent(new CustomEvent("dpr:refresh", { detail: { leveledUp: xp?.leveledUp ?? false } }));
  };

  const addTask = async () => {
    if (!newTitle.trim()) return;
    await fetch("/api/objectives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), time: "Today", done: false, dueDate: "", projectId: projectId ?? null }),
    });
    setNewTitle("");
    setAdding(false);
    refresh();
  };

  const removeTask = async (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/objectives/${id}`, { method: "DELETE" });
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const dueDates = [...new Set(tasks.map((t) => t.dueDate).filter(Boolean))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="dashboard-card flex min-h-[196px] flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-medium tracking-wide text-[#8c8c8c]">Objectives</h2>
            <button
              onClick={() => setAdding((a) => !a)}
              title="Add objective"
              className="flex h-4 w-4 items-center justify-center rounded-full bg-white/5 text-[12px] leading-none text-[#8c8c8c] transition-colors hover:bg-[#e2f1a6] hover:text-black"
            >
              +
            </button>
          </div>
          <p className="mt-1 text-[11px] text-[#6b7280]">
            {completedCount} of {tasks.length} completed
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#8c8c8c]">
          <Calendar size={13} strokeWidth={1.8} />
          <span>
            {dueDates[0] ?? ""}
            {dueDates.length > 1 ? ` +${dueDates.length - 1} more` : ""}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center divide-y divide-white/5">
        {adding && (
          <div className="flex items-center gap-2 py-1.5">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
                if (e.key === "Escape") setAdding(false);
              }}
              placeholder="New objective…"
              className="min-w-0 flex-1 rounded-lg bg-black/40 px-2.5 py-1.5 text-[13px] text-white placeholder:text-[#52525b] outline-none"
            />
            <button
              onClick={addTask}
              className="rounded-lg bg-[#e2f1a6] px-2.5 py-1.5 text-[12px] font-semibold text-black transition-colors hover:bg-[#d4f05a]"
            >
              Add
            </button>
          </div>
        )}
        {tasks.map((task) => (
          <div key={task.id} className="group/task flex items-center justify-between py-1.5">
            <div className="min-w-0 pr-2">
              <h3 className={`truncate text-[13px] font-medium ${task.done ? "text-[#6b7280] line-through" : "text-[#8c8c8c]"}`}>
                {task.title}
              </h3>
              <p className="mt-0.5 text-[11px] text-[#6b7280]">{task.time}</p>
            </div>
            <button
              onClick={() => toggleDone(task)}
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                task.done ? "bg-[#e2f1a6]" : "border border-white/10 hover:border-white/25"
              }`}
            >
              {task.done && <Check size={13} strokeWidth={3} className="text-black" />}
            </button>
            <button
              onClick={() => removeTask(task.id)}
              title="Delete objective"
              className="ml-1.5 flex-shrink-0 text-white/0 transition-colors hover:text-rose-300 group-hover/task:text-white/25"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
