"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, FileText, Trash2 } from "lucide-react";

interface Entry {
  id: number;
  filename: string;
  kind: string;
  createdAt: string;
}

export default function DownloadHistoryModal({
  open,
  onClose,
  projectId,
}: {
  open: boolean;
  onClose: () => void;
  projectId?: string | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<Entry[]>([]);

  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
  const refresh = () => fetch(`/api/downloads${qs}`).then((r) => r.json()).then(setItems);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) refresh();
  }, [open ]);

  const removeOne = async (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/downloads/${id}`, { method: "DELETE" });
  };

  const clearAll = async () => {
    if (!window.confirm("Clear all download history for this project?")) return;
    setItems([]);
    await fetch(`/api/downloads${qs}`, { method: "DELETE" });
  };

  if (!mounted) return null;

  return createPortal(
    open && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} className="dashboard-card w-full max-w-[420px]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[15px] font-medium tracking-wide text-white">
              <FileText size={15} className="text-[#e2f1a6]" />
              Download history
            </h2>
            <button onClick={onClose} className="text-[#8c8c8c] transition-colors hover:text-white">
              <X size={16} />
            </button>
          </div>
          {items.length === 0 ? (
            <p className="rounded-xl bg-[#1f1f1f] px-3 py-5 text-center text-[12px] text-[#6b7280]">
              No downloads yet — exported PDFs will appear here.
            </p>
          ) : (
            <>
              <div className="mb-3 flex max-h-[280px] flex-col gap-1.5 overflow-y-auto">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center gap-2.5 rounded-xl bg-[#1f1f1f] px-3 py-2.5">
                    <FileText size={14} className="flex-shrink-0 text-[#8c8c8c]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-white">{it.filename}</p>
                      <p className="text-[10px] text-[#6b7280]">
                        {new Date(it.createdAt).toLocaleString("en-US", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => removeOne(it.id)}
                      title="Remove from history"
                      className="p-1 text-white/20 transition-colors hover:text-rose-300"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={clearAll}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#1f1f1f] py-2 text-[12px] font-medium text-[#8c8c8c] transition-colors hover:bg-rose-500/10 hover:text-rose-300"
              >
                <Trash2 size={13} />
                Clear history
              </button>
            </>
          )}
        </div>
      </div>
    ),
    document.body
  );
}
