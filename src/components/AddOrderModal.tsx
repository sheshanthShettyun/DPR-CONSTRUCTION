"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Truck } from "lucide-react";

const inputCls =
  "w-full rounded-lg bg-black/40 px-3 py-2 text-[13px] text-white placeholder:text-[#52525b] outline-none";

const STATUSES = ["In Transit", "Picked Up", "Delivered"];

export default function AddOrderModal({
  open,
  onClose,
  onAdded,
  projectId,
}: {
  open: boolean;
  onClose: () => void;
  onAdded?: () => void;
  projectId?: string | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ from: "", to: "", load: "", eta: "", distance: "", status: "In Transit" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setForm({ from: "", to: "", load: "", eta: "", distance: "", status: "In Transit" });
      setError("");
    }
  }, [open ]);

  const submit = async () => {
    setError("");
    if (!form.from.trim() || !form.to.trim()) {
      setError("Origin and destination are required");
      return;
    }
    setBusy(true);
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: `#ORD${Date.now().toString(36).toUpperCase()}`,
        projectId: projectId ?? null,
        from: form.from.trim().slice(0, 80),
        to: form.to.trim().slice(0, 80),
        flag: "🚚",
        sub: form.load.trim() ? form.load.trim().slice(0, 80) : "General freight",
        load: form.load.trim() ? form.load.trim().slice(0, 40) : "—",
        status: form.status,
        color: "emerald",
        eta: form.eta || "TBD",
        distance: form.distance.trim() || "—",
        stages: [
          { label: "Booked", time: "now", done: true },
          { label: "Picked Up", time: "—", done: form.status !== "In Transit" ? true : false, active: form.status === "In Transit" },
          { label: "Delivered", time: "—", done: form.status === "Delivered", active: form.status === "Delivered" },
        ],
      }),
    });
    setBusy(false);
    if (!r.ok) {
      setError("Could not create the order");
      return;
    }
    window.dispatchEvent(new Event("dpr:refresh"));
    onAdded?.();
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    open && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} className="dashboard-card w-full max-w-[420px]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[15px] font-medium tracking-wide text-white">
              <Truck size={15} className="text-[#e2f1a6]" />
              Add transit order
            </h2>
            <button onClick={onClose} className="text-[#8c8c8c] transition-colors hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">From</label>
              <input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} placeholder="eg. Dallas, TX" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">To</label>
              <input value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} placeholder="eg. Houston, TX" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Cargo / Load</label>
              <input value={form.load} onChange={(e) => setForm({ ...form, load: e.target.value })} placeholder="eg. 650 kg" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">ETA</label>
              <input value={form.eta} onChange={(e) => setForm({ ...form, eta: e.target.value })} placeholder="eg. 2 days" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Distance</label>
              <input value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} placeholder="eg. 240 mi" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={`${inputCls} bg-black/40`}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="mt-3 text-[12px] text-rose-300">{error}</p>}
          <button
            onClick={submit}
            disabled={busy}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#e2f1a6] py-2.5 text-[13px] font-semibold text-black transition-colors hover:bg-[#d4f05a] disabled:opacity-50"
          >
            {busy ? "Creating…" : "Create Order"}
          </button>
        </div>
      </div>
    ),
    document.body
  );
}
