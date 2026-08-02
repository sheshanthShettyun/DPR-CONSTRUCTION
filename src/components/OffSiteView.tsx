"use client";

import { motion } from "framer-motion";
import { Truck, Package, Wrench } from "lucide-react";

const equipment = [
  {
    title: "Leased Out Equipment",
    icon: Truck,
    items: [
      { name: "Excavator CAT 320", spec: "Leased to TNA Groups · Until Aug 15", status: "Active Lease", chipColor: "emerald" },
      { name: "Dump Truck CAT 745", spec: "Leased to MEGAONE · Until Sep 02", status: "Active Lease", chipColor: "emerald" },
      { name: "Bulldozer D6T", spec: "Leased to BVI GROUP · Until Aug 28", status: "Pending Return", chipColor: "amber" },
    ],
  },
  {
    title: "In Transit — External",
    icon: Package,
    items: [
      { name: "Steel Beams A992", spec: "Shipped from US Steel Corp · ETA Aug 10", status: "In Transit", chipColor: "yellow" },
      { name: "Concrete Blocks", spec: "200 units · Supplier: CEMEX", status: "Delayed", chipColor: "orange" },
      { name: "Scaffolding System", spec: "40m x 12m · Shipped from Germany", status: "Customs", chipColor: "amber" },
    ],
  },
  {
    title: "Returned / Depot",
    icon: Wrench,
    items: [
      { name: "Generator Honda 5.5kW", spec: "Returned Jul 28 · Awaiting inspection", status: "In Queue", chipColor: "zinc" },
      { name: "Welding Rig Lincoln", spec: "Returned Jul 25 · Under repair", status: "Servicing", chipColor: "amber" },
      { name: "Air Compressor", spec: "Returned Jul 30 · Ready for reassign", status: "Available", chipColor: "emerald" },
    ],
  },
];

const chipColors: Record<string, { bg: string; text: string; dot: string }> = {
  emerald: { bg: "bg-emerald-900/20", text: "text-emerald-500", dot: "bg-emerald-500" },
  amber: { bg: "bg-amber-900/20", text: "text-amber-500", dot: "bg-amber-500" },
  yellow: { bg: "bg-[#e2f1a6]/10", text: "text-[#e2f1a6]", dot: "bg-[#e2f1a6]" },
  orange: { bg: "bg-orange-900/20", text: "text-orange-500", dot: "bg-orange-500" },
  zinc: { bg: "bg-zinc-900/30", text: "text-zinc-400", dot: "bg-zinc-400" },
};

export default function OffSiteView() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {equipment.map((cat, i) => (
        <motion.div
          key={cat.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
          className="dashboard-card flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <cat.icon size={14} strokeWidth={1.8} className="text-[#e2f1a6]" />
              <span className="font-bold">{cat.title}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#8c8c8c]">{cat.items.length} items</div>
          </div>

          <div className="flex flex-col gap-3">
            {cat.items.map((item) => (
              <div key={item.name} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="text-xs text-[#8c8c8c]">{item.spec}</p>
                </div>
                <div className={`status-chip ${chipColors[item.chipColor].bg} ${chipColors[item.chipColor].text}`}>
                  <div className={`status-dot ${chipColors[item.chipColor].dot}`} />
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
