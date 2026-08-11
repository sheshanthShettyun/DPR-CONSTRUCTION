"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

export interface ProjectData {
  id: string;
  name: string;
  location: string;
  targetDate: string;
  progress: number;
  equipment: number;
  crew: number;
  status: string;
  svgType: "tower" | "factory" | "residential";
  modules: number[];
}

interface Props {
  projects: ProjectData[];
  onSelect: (id: string) => void;
}

export default function ProjectsView({ projects, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {projects.map((p, i) => (
        <motion.article
          key={p.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 + i * 0.12, ease: [0, 0, 0.2, 1] }}
          className="flex flex-col justify-between gap-8 rounded-xl bg-[#1a1a1a] p-6 lg:flex-row lg:items-center lg:gap-12 lg:p-8"
        >
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[#e2f1a6]">
              <span className="h-2 w-2 rounded-full bg-[#e2f1a6]" />
              Active
            </div>
            <h2 className="text-2xl font-semibold text-white">{p.name}</h2>
            <div className="flex items-center gap-4 text-sm text-[#8c8c8c]">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} strokeWidth={2} />
                {p.location}
              </div>
              <span className="h-1 w-1 rounded-full bg-[#8c8c8c]/40" />
              <div className="flex items-center gap-1.5">
                <Calendar size={16} strokeWidth={2} />
                {p.targetDate}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 lg:flex-nowrap lg:gap-10">
            <div className="flex items-center">
              <div className="pr-6 lg:pr-10">
                <div className="mb-1 text-xl font-bold text-white">{p.equipment}</div>
                <div className="text-sm text-[#8c8c8c]">Equipment</div>
              </div>
              <div className="px-6 lg:px-10">
                <div className="mb-1 text-xl font-bold text-white">{p.crew}</div>
                <div className="text-sm text-[#8c8c8c]">Crew</div>
              </div>
              <div className="px-6 lg:px-10">
                <div className="mb-1 text-lg font-medium text-white">{p.status}</div>
                <div className="text-sm text-[#8c8c8c]">Status</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-2xl font-bold text-[#e2f1a6]">{p.progress}%</div>
              <motion.button
                onClick={() => onSelect(p.id)}
                whileHover={{ gap: 6 }}
                className="flex items-center gap-2 rounded-lg bg-[#e2f1a6] px-5 py-2.5 font-semibold text-black transition-colors hover:bg-[#d4f05a]"
              >
                View Project
                <ArrowRight size={16} strokeWidth={2} />
              </motion.button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
