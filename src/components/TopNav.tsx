"use client";

import { motion } from "framer-motion";
import { Search, Bell, ChevronDown } from "lucide-react";

const navItems = ["Overview", "Site Ops", "Personnel", "Documents", "Budget", "Safety"];

interface Props {
  activeNav: string;
  onNavChange: (item: string) => void;
}

export default function TopNav({ activeNav, onNavChange }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 flex items-center justify-between"
    >
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-2">
          <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-2xl font-bold tracking-tight">DPR.</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#8c8c8c] md:flex">
          {navItems.map((item, i) => (
            <motion.button
              key={item}
              onClick={() => onNavChange(item)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              whileHover={{ y: -1 }}
              className={`cursor-pointer transition-colors hover:text-white ${
                activeNav === item ? "border-b-2 border-white pb-1 text-white" : ""
              }`}
            >
              {item}
            </motion.button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="rounded-full bg-[#1a1a1a] p-2 text-white transition-colors hover:bg-zinc-800"
        >
          <Search size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="rounded-full bg-[#1a1a1a] p-2 text-white transition-colors hover:bg-zinc-800"
        >
          <Bell size={20} />
        </motion.button>
        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
          <div className="text-right">
            <p className="text-sm font-semibold">SRIYAAN</p>
            <p className="text-[10px] text-[#8c8c8c]">Dispatch Officer</p>
          </div>
          <img
            alt="User"
            className="h-10 w-10 rounded-xl object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvYSuMtkkQpKUCrW4JVW1OfL25_IkiYgAcVoECR0frTh-42V505H_gGWnABESPyx1nj79No0ghp73gkYSlcx8AeehcaPEr3hg8T7nAOgq9AcXclX4XoyG7D6V6oKvFdM8Ltd388UAUf9PJ_l-CVWq8IDnvZsNBtoxZO3AfN1-n_3BbIZQu_fmgQAYg8VEpcad0WkPFPZRxIvdyqbhqXz9uVSTKot-fk3udyZv3XdJDvdv1t1JdFDEG"
          />
          <ChevronDown size={16} className="text-[#8c8c8c]" />
        </div>
      </div>
    </motion.header>
  );
}
