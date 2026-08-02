"use client";

import { motion } from "framer-motion";
import { Box, Zap, Droplets, HardHat, Container, Wrench } from "lucide-react";

const categories = [
  {
    title: "Power & Utilities",
    icon: Zap,
    items: [
      { name: "Diesel Generator CAT XQ200", spec: "200 kW · 1,203 hrs", status: "Active" },
      { name: "Portable Generator Honda", spec: "5.5 kW · 340 hrs", status: "Active" },
      { name: "Transformer Unit TX-400", spec: "400 kVA · Site B", status: "Standby" },
      { name: "Solar Light Tower", spec: "4×100W LED · Bay 2", status: "Active" },
    ],
  },
  {
    title: "Water & Plumbing",
    icon: Droplets,
    items: [
      { name: "Water Pump WP-880", spec: "880 L/min · Diesel", status: "Active" },
      { name: "De-watering System", spec: "4 pumps · Pit 3", status: "Active" },
      { name: "Portable Water Tank", spec: "10,000L · Refilled 07/28", status: "Full" },
    ],
  },
  {
    title: "Site Structures",
    icon: Container,
    items: [
      { name: "Portable Office Unit A", spec: "20ft · 4 desks · AC", status: "Occupied" },
      { name: "Portable Office Unit B", spec: "20ft · Meeting room", status: "Occupied" },
      { name: "Storage Container S1", spec: "40ft · Locked · Bay 1", status: "Secure" },
      { name: "Storage Container S2", spec: "20ft · Bay 3", status: "50% Full" },
    ],
  },
  {
    title: "Safety Equipment",
    icon: HardHat,
    items: [
      { name: "First Aid Station", spec: "Bay 2 · Fully stocked", status: "Ready" },
      { name: "Fire Extinguishers", spec: "12 units · All zones", status: "Inspected" },
      { name: "PPE Inventory", spec: "48 sets · Helmets/Vests", status: "Available" },
      { name: "Fall Arrest Systems", spec: "24 units · Site A", status: "Certified" },
    ],
  },
  {
    title: "Tools & Equipment",
    icon: Wrench,
    items: [
      { name: "Concrete Mixer CM-450", spec: "450L · Electric", status: "In Use" },
      { name: "Compactor Plate", spec: "Honda GX160 · 90kg", status: "Available" },
      { name: "Welding Rig Lincoln", spec: "400A · Diesel", status: "Active" },
      { name: "Air Compressor", spec: "185 CFM · Trailer mount", status: "Standby" },
    ],
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500",
  Standby: "bg-amber-500",
  Available: "bg-emerald-500",
  Occupied: "bg-blue-500",
  Secure: "bg-emerald-500",
  Ready: "bg-emerald-500",
  Inspected: "bg-emerald-500",
  Certified: "bg-emerald-500",
  "In Use": "bg-[#e2f1a6]",
  Full: "bg-emerald-500",
  "50% Full": "bg-amber-500",
};

export default function OnSiteView() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
          className="dashboard-card flex flex-col gap-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e2f1a6]/10">
                <cat.icon size={18} className="text-[#e2f1a6]" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-white">{cat.title}</h3>
                <p className="text-[11px] text-[#8c8c8c]">{cat.items.length} items on site</p>
              </div>
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
