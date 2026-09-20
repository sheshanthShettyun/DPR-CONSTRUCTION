"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, X } from "lucide-react";

interface Props {
  onClose: () => void;
  onOrdered?: () => void;
  projectId?: string | null;
}

const inputCls =
  "w-full rounded-lg bg-black/40 px-3 py-2 text-[13px] text-white placeholder:text-[#52525b] outline-none";

export default function QuickOrderPanel({ onClose, onOrdered, projectId }: Props) {
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [site, setSite] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    if (!item.trim() || !site.trim()) {
      setError("Utility item and delivery site are required");
      return;
    }
    const quantity = Math.max(1, Math.floor(Number(qty) || 1));
    setBusy(true);
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: `#EMG${Date.now().toString(36).toUpperCase()}`,
        projectId: projectId ?? null,
        from: "Central Depot",
        to: site.trim().slice(0, 60),
        flag: "🚨",
        sub: `${quantity} × ${item.trim().slice(0, 60)}`,
        load: `${quantity} units`,
        status: "In Transit",
        color: "orange",
        eta: neededBy || "ASAP",
        distance: "Local",
        stages: [
          { label: "Ordered", time: "now", done: true },
          { label: "Packed", time: "—", done: false },
          { label: "In Transit", time: "—", done: false, active: true },
        ],
      }),
    });
    setBusy(false);
    if (!r.ok) {
      setError("Could not place the order. Try again.");
      return;
    }
    window.dispatchEvent(new Event("dpr:refresh"));
    onOrdered?.();
    onClose();
  };

  return (
    <div className="dashboard-card flex w-96 flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-base font-bold">
          <Zap size={15} className="text-[#e2f1a6]" />
          Quick Order
        </h2>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="text-[#8c8c8c] hover:text-white">
          <X size={18} />
        </motion.button>
      </div>
      <p className="-mt-1 text-[11px] leading-relaxed text-[#8c8c8c]">
        Out of a utility? Fire an emergency stock order to your site. It shows up in the transit tracker instantly.
      </p>

      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Utility item</label>
        <input value={item} onChange={(e) => setItem(e.target.value)} placeholder="eg. Cement bags" className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Quantity</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="eg. 40"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Needed by</label>
          <input
            type="date"
            value={neededBy}
            onChange={(e) => setNeededBy(e.target.value)}
            className={`${inputCls} [color-scheme:dark]`}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Deliver to site</label>
        <input
          value={site}
          onChange={(e) => setSite(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="eg. Site B, Whitefield"
          className={inputCls}
        />
      </div>

      {error && <p className="text-[12px] text-rose-300">{error}</p>}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={submit}
        disabled={busy}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#e2f1a6] py-2.5 text-xs font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <Zap size={15} />
        {busy ? "Ordering…" : "Place Emergency Order"}
      </motion.button>
    </div>
  );
}
