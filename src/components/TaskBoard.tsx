"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Ellipsis, MessageSquare, Paperclip, Calendar, CircleDot, Pencil } from "lucide-react";

interface TaskCard {
  id: number;
  title: string;
  desc: string;
  qty: number;
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

export default function TaskBoard({ projectId }: { projectId?: string | null }) {
  const [columns, setColumns] = useState<TaskColumn[]>([]);
  const [addingCol, setAddingCol] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", desc: "", level: "Plenty", qty: "" });
  const [newQty, setNewQty] = useState("");

  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
  const refresh = () => fetch(`/api/tasks${qs}`).then((r) => r.json()).then(setColumns);

  useEffect(() => {
    refresh();
  }, [projectId]);

  const addCard = async (columnId: number) => {
    if (!newTitle.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        columnId,
        projectId: projectId ?? null,
        title: newTitle.trim(),
        desc: "New utility item",
        qty: Math.max(0, Math.floor(Number(newQty) || 0)),
        date: new Date().toLocaleDateString(),
        level: "Plenty",
        type: "Utility",
      }),
    });
    setNewTitle("");
    setNewQty("");
    setAddingCol(null);
    refresh();
  };

  const removeCard = async (id: number) => {
    if (!window.confirm("Remove this utility?")) return;
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    refresh();
  };

  const startEdit = (card: TaskCard) => {
    setEditingId(card.id);
    setEditForm({ title: card.title, desc: card.desc, level: card.level, qty: String(card.qty ?? 0) });
  };

  const saveEdit = async (id: number) => {
    if (!editForm.title.trim()) return;
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editForm.title.trim(),
        desc: editForm.desc,
        level: editForm.level,
        qty: Math.max(0, Math.floor(Number(editForm.qty) || 0)),
      }),
    });
    setEditingId(null);
    refresh();
  };

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
              <button
                onClick={() => {
                  setAddingCol(col.id);
                  setNewTitle("");
                }}
                className="flex items-center gap-1 rounded-md bg-[#2A2A2A] px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-[#3A3A3A]"
              >
                <Plus size={11} />
                Add Utility
              </button>
              <button className="rounded-md p-1 text-[#8c8c8c] transition-colors hover:bg-[#2A2A2A]">
                <Ellipsis size={13} />
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            {addingCol === col.id && (
              <div className="flex items-center gap-2 px-3 py-2">
                <input
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addCard(col.id);
                    if (e.key === "Escape") setAddingCol(null);
                  }}
                  placeholder="New utility title…"
                  className="min-w-0 flex-[2] rounded-md bg-black/40 px-2.5 py-1.5 text-[13px] text-white placeholder:text-[#52525b] outline-none"
                />
                <input
                  type="number"
                  min={0}
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addCard(col.id);
                    if (e.key === "Escape") setAddingCol(null);
                  }}
                  placeholder="Qty"
                  className="w-20 rounded-md bg-black/40 px-2.5 py-1.5 text-[13px] text-white placeholder:text-[#52525b] outline-none"
                />
                <button
                  onClick={() => addCard(col.id)}
                  className="rounded-md bg-[#e2f1a6] px-2.5 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-[#d4f05a]"
                >
                  Add
                </button>
              </div>
            )}
            {col.cards.map((card) => {
              const s = levelStyles[card.level] ?? levelStyles.Plenty;
              if (editingId === card.id) {
                return (
                  <div key={card.id} className="flex items-center gap-2 px-3 py-2">
                    <input
                      autoFocus
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(card.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      placeholder="Title"
                      className="min-w-0 flex-1 rounded-md bg-black/40 px-2.5 py-1.5 text-[13px] text-white placeholder:text-[#52525b] outline-none"
                    />
                    <input
                      value={editForm.desc}
                      onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(card.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      placeholder="Details (specs)"
                      className="min-w-0 flex-1 rounded-md bg-black/40 px-2.5 py-1.5 text-[13px] text-white placeholder:text-[#52525b] outline-none"
                    />
                    <input
                      type="number"
                      min={0}
                      value={editForm.qty}
                      onChange={(e) => setEditForm({ ...editForm, qty: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(card.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      placeholder="Qty"
                      className="w-20 rounded-md bg-black/40 px-2.5 py-1.5 text-[13px] text-white placeholder:text-[#52525b] outline-none"
                    />
                    <select
                      value={editForm.level}
                      onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                      className="rounded-md bg-black/40 px-2 py-1.5 text-xs text-white outline-none"
                    >
                      {Object.keys(levelStyles).map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => saveEdit(card.id)}
                      className="rounded-md bg-[#e2f1a6] px-2.5 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-[#d4f05a]"
                    >
                      Save
                    </button>
                  </div>
                );
              }
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
                    {(card.qty ?? 0) > 0 && (
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white">
                        {card.qty} units
                      </span>
                    )}
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
                    <button
                      onClick={() => startEdit(card)}
                      title="Edit utility"
                      className="p-0.5 text-white/25 transition-colors hover:text-white"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => removeCard(card.id)}
                      title="Remove utility"
                      className="px-0.5 text-[14px] leading-none text-white/25 transition-colors hover:text-rose-300"
                    >
                      ×
                    </button>
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
