"use client";

import { motion } from "framer-motion";
import { Zap, Droplets, HardHat, Building2, Container, Wrench, Sun, Flame, Heart, Plug } from "lucide-react";

const categories = [
  {
    title: "Power & Utilities",
    icon: Zap,
    items: [
      { name: "Diesel Generator CAT XQ200", spec: "200 kW · 1,203 hrs", status: "Active", chipColor: "emerald", icon: Plug },
      { name: "Portable Generator Honda", spec: "5.5 kW · 340 hrs", status: "Active", chipColor: "emerald", icon: Zap },
      { name: "Transformer Unit TX-400", spec: "400 kVA · Site B", status: "Standby", chipColor: "amber", icon: Zap },
      { name: "Solar Light Tower", spec: "4×100W LED · Bay 2", status: "Active", chipColor: "emerald", icon: Sun },
    ],
  },
  {
    title: "Water & Plumbing",
    icon: Droplets,
    items: [
      { name: "Water Pump WP-880", spec: "880 L/min · Diesel", status: "Active", chipColor: "emerald", icon: Droplets },
      { name: "De-watering System", spec: "4 pumps · Pit 3", status: "Active", chipColor: "emerald", icon: Droplets },
      { name: "Portable Water Tank", spec: "10,000L · Refilled 07/28", status: "Full", chipColor: "emerald", icon: Droplets },
    ],
  },
  {
    title: "Site Structures",
    icon: Container,
    items: [
      { name: "Portable Office Unit A", spec: "20ft · 4 desks · AC", status: "Occupied", chipColor: "blue", icon: Building2 },
      { name: "Portable Office Unit B", spec: "20ft · Meeting room", status: "Occupied", chipColor: "blue", icon: Building2 },
      { name: "Storage Container S1", spec: "40ft · Locked · Bay 1", status: "Secure", chipColor: "emerald", icon: Container },
      { name: "Storage Container S2", spec: "20ft · Bay 3", status: "50% Full", chipColor: "amber", icon: Container },
    ],
  },
  {
    title: "Safety Equipment",
    icon: HardHat,
    items: [
      { name: "First Aid Station", spec: "Bay 2 · Fully stocked", status: "Ready", chipColor: "emerald", icon: Heart },
      { name: "Fire Extinguishers", spec: "12 units · All zones", status: "Inspected", chipColor: "emerald", icon: Flame },
      { name: "PPE Inventory", spec: "48 sets · Helmets/Vests", status: "Available", chipColor: "emerald", icon: HardHat },
      { name: "Fall Arrest Systems", spec: "24 units · Site A", status: "Certified", chipColor: "emerald", icon: HardHat },
    ],
  },
  {
    title: "Tools & Equipment",
    icon: Wrench,
    items: [
      { name: "Concrete Mixer CM-450", spec: "450L · Electric", status: "In Use", chipColor: "yellow", icon: Wrench },
      { name: "Compactor Plate", spec: "Honda GX160 · 90kg", status: "Available", chipColor: "emerald", icon: Wrench },
      { name: "Welding Rig Lincoln", spec: "400A · Diesel", status: "Active", chipColor: "emerald", icon: Wrench },
      { name: "Air Compressor", spec: "185 CFM · Trailer mount", status: "Standby", chipColor: "amber", icon: Wrench },
    ],
  },
];

const chipColors: Record<string, { bg: string; text: string; dot: string }> = {
  emerald: { bg: "bg-emerald-900/20", text: "text-emerald-500", dot: "bg-emerald-500" },
  amber: { bg: "bg-amber-900/20", text: "text-amber-500", dot: "bg-amber-500" },
  yellow: { bg: "bg-[#e2f1a6]/10", text: "text-[#e2f1a6]", dot: "bg-[#e2f1a6]" },
  blue: { bg: "bg-blue-900/20", text: "text-blue-400", dot: "bg-blue-400" },
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
                <div className="flex items-center gap-2.5">
                  <item.icon size={14} strokeWidth={1.8} className="text-[#52525b]" />
                  <div>
                    <p className="text-sm text-white">{item.name}</p>
                    <p className="text-xs text-[#8c8c8c]">{item.spec}</p>
                  </div>
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
