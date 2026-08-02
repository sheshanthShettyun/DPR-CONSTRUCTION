"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, MapPin, Truck, Wrench, Archive, Plus } from "lucide-react";

interface Props {
  active: string;
  onChange: (id: string) => void;
}

const filters = [
  { id: "All Transit", icon: LayoutDashboard, count: 1556 },
  { id: "Transit", icon: Truck, count: 338 },
  { id: "Utilities", icon: MapPin, count: 412 },
  { id: "Maintenance", icon: Wrench, count: 147 },
  { id: "Off-Site", icon: Archive, count: 659 },
];

export default function FilterSidebar({ active, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const handleEnter = () => {
    clearTimeout(timer.current);
    setHovered(true);
  };

  const handleLeave = () => {
    timer.current = setTimeout(() => setHovered(false), 150);
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-w-[56px] flex-shrink-0 flex-col items-center overflow-visible pt-[50px]"
    >
      <div className="flex flex-col items-center">
        <motion.button
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a] text-[#8c8c8c] hover:text-white"
        >
          <Plus size={16} strokeWidth={2.5} />
        </motion.button>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 overflow-hidden"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <motion.div
            animate={{ width: hovered ? 176 : 56 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-0.5 overflow-hidden rounded-2xl bg-[#1a1a1a] py-2"
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
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.12 }}
                      className="whitespace-nowrap text-sm font-medium"
                    >
                      {id}
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 }}
                      className="ml-auto text-[10px] opacity-50"
                    >
                      {count}
                    </motion.span>
                  </>
                )}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}
      </div>
    </motion.aside>
  );
}
