"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Ellipsis, MessageSquare, Paperclip, Calendar, CircleDot } from "lucide-react";

interface TaskCard {
  id: number;
  title: string;
  desc: string;
  date: string;
  comments: number;
  files: number;
  level: string;
  type: string;
}

interface TaskColumn {
  id: number;
  title: string;
  cards: TaskCard[];
}

const levelStyles: Record<string, { text: string; bg: string; border: string }> = {
  Plenty: { text: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-300/20" },
  Low: { text: "text-amber-300", bg: "bg-amber-300/10", border: "border-amber-300/20" },
  Critical: { text: "text-rose-300", bg: "bg-rose-500/10", border: "border-rose-300/20" },
};

export default function TaskBoard() {
  const [columns, setColumns] = useState<TaskColumn[]>([]);

  useEffect(() => {
    fetch("/api/tasks").then((r) => r.json()).then(setColumns);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3"
    >
      {columns.map((col) => (
        <div key={col.id} className="overflow-hidden rounded-lg bg-[#1C1C1C]">
          <div className="flex items-center justify-between bg-[#111111] px-3 py-2">
            <div className="flex items-center gap-2">
              <CircleDot size={13} className="text-[#8c8c8c]" />
              <h3 className="text-sm font-medium text-[#f1f1f1]">{col.title}</h3>
              <span className="text-xs text-[#8c8c8c]">{col.cards.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1 rounded-md bg-[#2A2A2A] px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-[#3A3A3A]">
                <Plus size={11} />
                Add Utility
              </button>
              <button className="rounded-md p-1 text-[#8c8c8c] transition-colors hover:bg-[#2A2A2A]">
                <Ellipsis size={13} />
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            {col.cards.map((card) => {
              const s = levelStyles[card.level];
              return (
                <div
                  key={card.id}
                  className="group flex cursor-pointer items-center justify-between px-3 py-2 transition-colors hover:bg-[#222222]"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <h4 className="truncate text-[13px] font-medium text-[#f1f1f1]">{card.title}</h4>
                    <p className="mt-0.5 truncate text-[11px] text-[#8c8c8c]">{card.desc}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded bg-[#2A2A2A] px-2 py-0.5 text-[10px] font-medium text-[#8c8c8c]">
                      {card.type}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] text-[#8c8c8c]">
                      <Calendar size={11} />
                      <span>{card.date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#8c8c8c]">
                      <span className="flex items-center gap-0.5">
                        <MessageSquare size={11} />
                        {card.comments}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Paperclip size={11} />
                        {card.files}
                      </span>
                    </div>

                    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${s.text} ${s.bg} ${s.border}`}>
                      {card.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
