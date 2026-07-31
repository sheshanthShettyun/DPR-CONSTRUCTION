"use client";

import { motion } from "framer-motion";
import { ChevronDown, Ellipsis, Box, Pencil, Trash2, Plus } from "lucide-react";

const tools = [
  { id: "CRG-571", weight: "150kg", size: "XL" },
  { id: "ELX-204", weight: "80kg", size: "M" },
  { id: "MED-882", weight: "45kg", size: "S" },
];

export default function AssetPanel() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="w-72 flex-shrink-0"
    >
      <div className="dashboard-card flex h-full flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Asset Details</h2>
          <motion.button whileHover={{ rotate: 90 }} className="text-[#8c8c8c] hover:text-white">
            <Ellipsis size={20} />
          </motion.button>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Asset ID</label>
          <div className="relative">
            <button className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-zinc-900 px-4 py-3">
              <span className="font-bold">#US046584</span>
              <ChevronDown size={16} className="text-[#8c8c8c]" />
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-2 rounded-xl border border-white/5 bg-zinc-900/50 p-3">
          <div>
            <p className="mb-1 text-[10px] uppercase text-[#8c8c8c]">Type</p>
            <div className="flex items-center gap-1 text-xs font-semibold">
              <Box size={12} />
              Truck
            </div>
          </div>
          <div>
            <p className="mb-1 text-[10px] uppercase text-[#8c8c8c]">Type</p>
            <p className="text-xs font-semibold">Electronics</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] uppercase text-[#8c8c8c]">Status</p>
            <p className="text-xs font-semibold">In Transit</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <p className="mb-4 text-[10px] uppercase tracking-wider text-[#8c8c8c]">On-Board Tools</p>
          <div className="space-y-4">
            {tools.map((tool) => (
              <div key={tool.id} className="group flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
                    <Box size={16} className="text-[#8c8c8c]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{tool.id}</p>
                    <p className="text-[10px] text-[#8c8c8c]">{tool.weight} • {tool.size}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-40 transition-opacity group-hover:opacity-100">
                  <button><Pencil size={14} /></button>
                  <button><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-white/5 pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] uppercase text-[#8c8c8c]">Type</p>
              <p className="text-sm font-bold">Type</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-[#8c8c8c]">Total Weight</p>
              <p className="text-sm font-bold">2,246kg</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-[#8c8c8c]">Est. Cost</p>
              <p className="text-sm font-bold text-[#e2f1a6]">$201.4k</p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 rounded-xl border border-white/5 bg-zinc-900 py-3 text-sm font-bold hover:bg-zinc-800">Share</motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 rounded-xl border border-white/5 bg-zinc-900 py-3 text-sm font-bold hover:bg-zinc-800">Checkout</motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e2f1a6] py-4 font-bold text-black transition-opacity hover:opacity-90"
          >
            <Plus size={20} />
            Log Activity
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}
