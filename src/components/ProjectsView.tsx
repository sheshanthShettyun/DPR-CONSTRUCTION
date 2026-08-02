"use client";

import { motion } from "framer-motion";
import { Building2, ChevronRight } from "lucide-react";

const projects = [
  {
    id: "building-a",
    name: "Meridian Heights — Tower B",
    location: "Dallas, TX",
    progress: 62,
    status: "In Progress",
    equipment: 412,
    crew: 128,
    eta: "Dec 2026",
  },
  {
    id: "building-b",
    name: "Harbour Vista — Phase 2",
    location: "Berlin, DE",
    progress: 45,
    status: "In Progress",
    equipment: 287,
    crew: 94,
    eta: "Mar 2027",
  },
  {
    id: "building-c",
    name: "Riverside Industrial Park",
    location: "Warsaw, PL",
    progress: 91,
    status: "Near Completion",
    equipment: 156,
    crew: 52,
    eta: "Oct 2026",
  },
];

interface Props {
  onSelect: (id: string) => void;
}

export default function ProjectsView({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}
          onClick={() => onSelect(p.id)}
          className="dashboard-card flex cursor-pointer flex-col gap-5"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <Building2 size={15} className="text-[#e2f1a6]" strokeWidth={1.8} />
              <div>
                <h3 className="text-[15px] font-bold text-white">{p.name}</h3>
                <p className="text-[11px] text-[#8c8c8c]">{p.location} · {p.eta}</p>
              </div>
            </div>
            <ChevronRight size={16} className="mt-1 text-[#52525b]" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <span className="text-[#8c8c8c]">Progress</span>
                <span className="font-medium text-white">{p.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.progress}%` }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full ${
                    p.status === "Near Completion" ? "bg-emerald-500" : "bg-[#e2f1a6]"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-lg bg-white/[0.03] p-3">
            <div>
              <p className="text-[10px] uppercase text-[#8c8c8c]">Equipment</p>
              <p className="text-sm font-bold text-white">{p.equipment}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-[#8c8c8c]">Crew</p>
              <p className="text-sm font-bold text-white">{p.crew}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-[#8c8c8c]">Status</p>
              <p className={`text-xs font-semibold ${p.status === "Near Completion" ? "text-emerald-500" : "text-[#e2f1a6]"}`}>
                {p.status}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
