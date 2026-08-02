"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, MapPin, Truck, Wrench, Archive } from "lucide-react";

interface Props {
  active: string;
  onChange: (id: string) => void;
}

const filters = [
  { id: "Transit", icon: Truck, count: 338 },
  { id: "Utilities", icon: MapPin, count: 412 },
  { id: "Maintenance", icon: Wrench, count: 147 },
  { id: "Off-Site", icon: Archive, count: 659 },
];

export default function FilterSidebar({ active, onChange }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0, width: hovered ? 180 : 56 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-shrink-0 flex-col items-center gap-0.5 overflow-hidden rounded-2xl bg-[#1a1a1a] py-3"
    >
      {filters.map(({ id, icon: Icon, count }) => (
        <motion.button
          key={id}
          onClick={() => onChange(id)}
          whileHover={{ x: hovered ? 3 : 0, scale: hovered ? 1.02 : 1.1 }}
          whileTap={{ scale: 0.92 }}
          className={`flex items-center transition-all ${
            hovered
              ? "w-full gap-3 rounded-xl px-3 py-2.5"
              : "h-10 w-10 justify-center rounded-full"
          } ${
            active === id
              ? "bg-[#e2f1a6] text-black"
              : hovered
                ? "text-[#8c8c8c] hover:bg-zinc-800 hover:text-white"
                : "text-[#6b7280] hover:bg-zinc-800 hover:text-white"
          }`}
        >
          <Icon size={16} strokeWidth={2} />
          {hovered && (
            <>
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: 0.06 }}
                className="whitespace-nowrap text-sm font-medium"
              >
                {id}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ml-auto text-[10px] opacity-50"
              >
                {count}
              </motion.span>
            </>
          )}
        </motion.button>
      ))}
    </motion.aside>
  );
}
