"use client";

import { motion } from "framer-motion";
import { Truck, Wrench, Package } from "lucide-react";

const equipment = [
  {
    title: "Leased Out Equipment",
    icon: Truck,
    items: [
      { name: "Excavator CAT 320", spec: "Leased to TNA Groups · Until Aug 15", status: "Active Lease" },
      { name: "Dump Truck CAT 745", spec: "Leased to MEGAONE · Until Sep 02", status: "Active Lease" },
      { name: "Bulldozer D6T", spec: "Leased to BVI GROUP · Until Aug 28", status: "Pending Return" },
    ],
  },
  {
    title: "In Transit — External",
    icon: Package,
    items: [
      { name: "Steel Beams A992", spec: "Shipped from US Steel Corp · ETA Aug 10", status: "In Transit" },
      { name: "Concrete Blocks", spec: "200 units · Supplier: CEMEX", status: "Delayed" },
      { name: "Scaffolding System", spec: "40m x 12m · Shipped from Germany", status: "Customs" },
    ],
  },
  {
    title: "Returned / Depot",
    icon: Wrench,
    items: [
      { name: "Generator Honda 5.5kW", spec: "Returned Jul 28 · Awaiting inspection", status: "In Queue" },
      { name: "Welding Rig Lincoln", spec: "Returned Jul 25 · Under repair", status: "Servicing" },
      { name: "Air Compressor", spec: "Returned Jul 30 · Ready for reassign", status: "Available" },
    ],
  },
];

const statusColors: Record<string, string> = {
  "Active Lease": "bg-emerald-500",
  "Pending Return": "bg-amber-500",
  "In Transit": "bg-[#e2f1a6]",
  "Delayed": "bg-orange-500",
  "Customs": "bg-amber-500",
  "In Queue": "bg-zinc-500",
  "Servicing": "bg-amber-500",
  "Available": "bg-emerald-500",
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
          className="dashboard-card flex flex-col gap-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e2f1a6]/10">
              <cat.icon size={18} className="text-[#e2f1a6]" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white">{cat.title}</h3>
              <p className="text-[11px] text-[#8c8c8c]">{cat.items.length} items off site</p>
            </div>
          </div>

          <div className="space-y-3">
            {cat.items.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3.5 py-2.5"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-[13px] font-medium text-white">{item.name}</p>
                  <p className="mt-0.5 text-[11px] text-[#8c8c8c]">{item.spec}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${statusColors[item.status] || "bg-zinc-500"}`} />
                  <span className="text-[10px] text-[#8c8c8c]">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
