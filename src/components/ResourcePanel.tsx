"use client";

import { motion } from "framer-motion";
import { Users, GraduationCap, CircleHelp, Handshake, FileText, TrendingUp, ArrowUpRight } from "lucide-react";

const links = [
  { icon: CircleHelp, title: "Help Center", desc: "Explore our detailed documentation..." },
  { icon: Handshake, title: "Partner Directory", desc: "Find the perfect partner to support..." },
  { icon: FileText, title: "Blog", desc: "Access popular guides & stories ab..." },
  { icon: TrendingUp, title: "Use Cases", desc: "Get inspired by all the ways you ca..." },
];

export default function ResourcePanel() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="flex w-72 flex-shrink-0 flex-col space-y-4 pr-4"
    >
      <div className="flex space-x-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.03 }}
          className="right-sidebar-item-bg flex flex-1 cursor-pointer flex-col items-center justify-center rounded-3xl p-4 transition hover:bg-gray-200"
        >
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm">
            <Users size={18} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-bold text-gray-900">Community</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.03 }}
          className="right-sidebar-item-bg flex flex-1 cursor-pointer flex-col items-center justify-center rounded-3xl p-4 transition hover:bg-gray-200"
        >
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm">
            <GraduationCap size={18} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-bold text-gray-900">Academy</span>
        </motion.div>
      </div>
      {links.map((link, i) => (
        <motion.div
          key={link.title}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ x: -4 }}
          className="right-sidebar-item-bg group relative cursor-pointer rounded-3xl p-6 transition hover:bg-gray-200"
        >
          <ArrowUpRight className="absolute right-6 top-6 text-sm text-gray-400 transition-colors group-hover:text-gray-600" size={14} />
          <link.icon size={18} className="mb-3 block text-gray-600" />
          <h4 className="mb-1 font-bold text-gray-900">{link.title}</h4>
          <p className="text-sm leading-relaxed text-gray-500">{link.desc}</p>
        </motion.div>
      ))}
    </motion.aside>
  );
}
