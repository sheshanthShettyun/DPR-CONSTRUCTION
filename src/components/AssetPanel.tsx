"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Ellipsis, Box, Pencil, Trash2, Plus, X } from "lucide-react";

interface Props {
  onClose: () => void;
}

const categories: Record<string, { label: string; fields: [string, string][]; tools: { id: string; weight: string; size: string }[] }> = {
  "Heavy Machinery": {
    label: "Heavy Machinery",
    fields: [["Type", "Excavator"], ["Model", "CAT 320"], ["HP", "148 HP"], ["Fuel", "Diesel"], ["Hours", "2,846 hrs"], ["Operator", "TNA Groups"]],
    tools: [
      { id: "BCK-340", weight: "1,200kg", size: "XL" },
      { id: "HMR-112", weight: "680kg", size: "L" },
    ],
  },
  Vehicles: {
    label: "Vehicles",
    fields: [["Type", "Dump Truck"], ["Model", "CAT 745"], ["Load Cap", "41 tons"], ["Mileage", "52,400 mi"], ["VIN", "CAT0745DTPF..."], ["Driver", "MEGAONE"]],
    tools: [
      { id: "GPS-882", weight: "2kg", size: "S" },
      { id: "RDO-451", weight: "5kg", size: "S" },
    ],
  },
  "Power & Tools": {
    label: "Power & Tools",
    fields: [["Type", "Generator"], ["Model", "CAT XQ200"], ["Output", "200 kW"], ["Fuel", "Diesel"], ["Hours", "1,203 hrs"], ["Status", "In Use"]],
    tools: [
      { id: "CBL-201", weight: "30kg", size: "M" },
      { id: "PNL-667", weight: "15kg", size: "S" },
    ],
  },
  Safety: {
    label: "Safety Equipment",
    fields: [["Type", "Fall Arrest System"], ["Qty", "24 units"], ["Cert Date", "2026-01-15"], ["Expiry", "2027-01-15"], ["Location", "Site A"], ["Inspected", "2026-07-15"]],
    tools: [{ id: "HRN-045", weight: "1.2kg", size: "S" }],
  },
  "Temp Structures": {
    label: "Temporary Structures",
    fields: [["Type", "Scaffolding"], ["Size", "40m x 12m"], ["Installed", "2026-06-20"], ["Location", "Site B"], ["Condition", "Good"], ["Inspected", "2026-07-15"]],
    tools: [],
  },
  Materials: {
    label: "Materials",
    fields: [["Type", "Steel Beams"], ["Grade", "A992"], ["Quantity", "340 units"], ["Supplier", "US Steel Corp"], ["Delivered", "2026-07-10"], ["Lot #", "STL-A992-0710"]],
    tools: [],
  },
};

const categoryKeys = Object.keys(categories);

export default function AssetPanel({ onClose }: Props) {
  const [category, setCategory] = useState("Heavy Machinery");
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const cat = categories[category];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="dashboard-card flex w-72 flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Asset Details</h2>
        <div className="flex items-center gap-1">
          <motion.button whileHover={{ rotate: 90 }} className="text-[#8c8c8c] hover:text-white">
            <Ellipsis size={18} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="text-[#8c8c8c] hover:text-white">
            <X size={18} />
          </motion.button>
        </div>
      </div>

      <div ref={catRef} className="relative">
        <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Category</label>
        <motion.button
          whileTap={{ scale: 0.99 }}
          onClick={() => setCatOpen(!catOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e2f1a6]" />
            {cat.label}
          </div>
          <motion.span animate={{ rotate: catOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-[#8c8c8c]" />
          </motion.span>
        </motion.button>
        <AnimatePresence>
          {catOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 py-1 shadow-2xl"
            >
              {categoryKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => { setCategory(key); setCatOpen(false); }}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-zinc-800 ${
                    category === key ? "text-white" : "text-[#8c8c8c]"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${category === key ? "bg-[#e2f1a6]" : "bg-transparent"}`} />
                  {categories[key].label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Asset ID</label>
        <button className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5">
          <span className="text-sm font-bold">#US046584</span>
          <ChevronDown size={16} className="text-[#8c8c8c]" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl border border-white/5 bg-zinc-900/50 p-3">
        {cat.fields.map(([label, value]) => (
          <div key={label}>
            <p className="text-[10px] uppercase text-[#8c8c8c]">{label}</p>
            <p className="text-xs font-semibold text-white">{value}</p>
          </div>
        ))}
        <div>
          <p className="text-[10px] uppercase text-[#8c8c8c]">Status</p>
          <p className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
          </p>
        </div>
      </div>

      {cat.tools.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-wider text-[#8c8c8c]">
            {category === "Heavy Machinery" ? "Attachments" : "On-Board Tools"}
          </p>
          <div className="flex flex-wrap gap-2">
            {cat.tools.map((tool) => (
              <div key={tool.id} className="flex items-center gap-2 rounded-lg bg-zinc-800 px-2.5 py-2">
                <Box size={14} className="text-[#8c8c8c]" />
                <span className="text-xs font-bold">{tool.id}</span>
                <span className="text-[10px] text-[#8c8c8c]">{tool.weight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 border-t border-white/5 pt-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] uppercase text-[#8c8c8c]">Type</p>
            <p className="text-sm font-bold">{category === "Heavy Machinery" ? "Heavy" : "Standard"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-[#8c8c8c]">Weight</p>
            <p className="text-sm font-bold">{category === "Heavy Machinery" ? "22,450kg" : "275kg"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-[#8c8c8c]">Est. Cost</p>
            <p className="text-sm font-bold text-[#e2f1a6]">{category === "Heavy Machinery" ? "$180.5k" : "$8.2k"}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 rounded-xl border border-white/5 bg-zinc-900 py-3 text-sm font-bold hover:bg-zinc-800">Share</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 rounded-xl border border-white/5 bg-zinc-900 py-3 text-sm font-bold hover:bg-zinc-800">Checkout</motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e2f1a6] py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          <Plus size={18} />
          Log Activity
        </motion.button>
      </div>
    </div>
  );
}
