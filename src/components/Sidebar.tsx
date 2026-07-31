"use client";

import { motion } from "framer-motion";
import { Plus, Layers, Share2, Repeat, Link2, Globe, Ellipsis, BookOpen, Rocket, CircleHelp } from "lucide-react";

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sidebar-bg flex w-16 flex-shrink-0 flex-col items-center space-y-6 rounded-3xl py-4 text-gray-400"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-black"
      >
        <Plus size={20} strokeWidth={2.5} />
      </motion.button>

      {[
        { icon: Layers, active: false },
        { icon: Share2, active: false },
        { icon: Repeat, active: true },
        { icon: Link2, active: false },
        { icon: Globe, active: false },
        { icon: Ellipsis, active: false },
      ].map(({ icon: Icon, active }, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`transition-colors hover:text-white ${
            active ? "flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white" : ""
          }`}
        >
          <Icon size={18} strokeWidth={1.5} />
        </motion.button>
      ))}

      <div className="flex-grow" />

      {[
        { icon: BookOpen },
        { icon: Rocket },
        { icon: CircleHelp },
      ].map(({ icon: Icon }, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="transition-colors hover:text-white"
        >
          <Icon size={18} strokeWidth={1.5} />
        </motion.button>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.55 }}
        whileHover={{ scale: 1.1 }}
        className="mt-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-xs font-semibold text-white"
      >
        SS
      </motion.div>
    </motion.aside>
  );
}
