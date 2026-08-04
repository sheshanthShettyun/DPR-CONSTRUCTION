"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Layers, Building2, Users, Clock, Check } from "lucide-react";

const buildingSvgs: Record<string, React.ReactNode> = {
  tower: (
    <svg className="h-full w-full" fill="none" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <path d="M180 250 V120 H260 V250" stroke="#5a6e2f" strokeWidth="2.2"/>
      <path d="M260 250 V80 H330 V250" stroke="#5a6e2f" strokeWidth="2.2"/>
      <path d="M180 140 H260 M180 160 H260 M180 180 H260" stroke="#5a6e2f" strokeWidth="1.4" opacity="0.7"/>
      <path d="M260 100 H330 M260 120 H330 M260 140 H330 M260 160 H330 M260 180 H330 M260 200 H330 M260 220 H330 M260 240 H330" stroke="#5a6e2f" strokeWidth="1.4" opacity="0.7"/>
      <path d="M330 180 L370 60 M330 190 L380 65" stroke="#5a6e2f" strokeWidth="2.2"/>
      <path d="M280 80 L390 40" stroke="#5a6e2f" strokeWidth="2.2"/>
      <path d="M370 60 V250 M380 65 V250" stroke="#5a6e2f" strokeWidth="2.2"/>
      <circle cx="140" cy="225" r="12" stroke="#5a6e2f" strokeWidth="2.2"/>
      <path d="M140 237 V250" stroke="#5a6e2f" strokeWidth="2.2"/>
      <path d="M100 250 H420" stroke="#5a6e2f" strokeWidth="2.2"/>
    </svg>
  ),
  factory: (
    <svg className="h-full w-full" fill="none" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <path d="M120 250 V180 H180 V250" stroke="#5a6e2f" strokeWidth="2.2"/>
      <path d="M180 250 V140 H250 V250" stroke="#5a6e2f" strokeWidth="2.2"/>
      <path d="M250 250 V120 H290 V250" stroke="#5a6e2f" strokeWidth="2.2"/>
      <path d="M200 140 H230 M200 160 H230 M200 180 H230 M200 200 H230 M200 220 H230 M200 240 H230" stroke="#5a6e2f" strokeWidth="1.4" opacity="0.7"/>
      <path d="M220 90 L240 70 L260 90" stroke="#5a6e2f" strokeWidth="2.2"/>
      <path d="M340 130 V250 M340 150 H350 M340 170 H350 M340 190 H350 M340 210 H350 M340 230 H350 M340 240 H350" stroke="#5a6e2f" strokeWidth="1.4" opacity="0.6"/>
      <path d="M100 250 H400" stroke="#5a6e2f" strokeWidth="2.2"/>
    </svg>
  ),
  residential: (
    <svg className="h-full w-full" fill="none" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <path d="M80 250 V180 L140 140 L200 180 V250" stroke="#5a6e2f" strokeWidth="2.2"/>
      <path d="M100 250 V195 L140 170 L180 195 V250" stroke="#5a6e2f" strokeWidth="1.6"/>
      <path d="M220 250 V170 L280 130 L340 170 V250" stroke="#5a6e2f" strokeWidth="2.2"/>
      <path d="M250 250 V180 L280 160 L310 180 V250" stroke="#5a6e2f" strokeWidth="1.6"/>
      <circle cx="170" cy="220" r="8" stroke="#5a6e2f" strokeWidth="1.6"/>
      <path d="M170 228 V250" stroke="#5a6e2f" strokeWidth="1.6"/>
      <path d="M80 250 H360" stroke="#5a6e2f" strokeWidth="2.2"/>
    </svg>
  ),
};

const projects = [
  { id: "building-a", name: "Meridian Heights — Tower B", location: "Dallas, TX", date: "Dec 2026", progress: 62, equipment: 412, crew: 128, status: "In Progress", modules: [1, 1, 1, 0, 0, 0], svgType: "tower" as const },
  { id: "building-b", name: "Harbour Vista — Phase 2", location: "Berlin, DE", date: "Mar 2027", progress: 45, equipment: 287, crew: 94, status: "In Progress", modules: [1, 1, 0, 0, 0, 0], svgType: "factory" as const },
  { id: "building-c", name: "Riverside Industrial Park", location: "Warsaw, PL", date: "Oct 2026", progress: 91, equipment: 156, crew: 52, status: "Near Completion", modules: [1, 1, 1, 1, 1, 0], svgType: "residential" as const },
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
          transition={{ duration: 0.4, delay: 0.06 + i * 0.12, ease: [0, 0, 0.2, 1] }}
          className="relative flex w-full max-w-[480px] flex-col overflow-hidden rounded-xl border border-white/[0.04] bg-[#1a1a1a] p-4"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-28 w-[45%] opacity-55">
            {buildingSvgs[p.svgType]}
          </div>

          <div className="relative z-10">
            <div className="inline-flex w-fit items-center gap-1 rounded-full border border-[#e2f1a6]/15 bg-[#121212]/40 px-2 py-0.5">
              <Layers size={10} strokeWidth={2.5} className="text-[#e2f1a6]" />
              <span className="text-[10px] font-medium text-[#e2f1a6]">Active</span>
            </div>

            <h2 className="mt-3 max-w-[200px] text-[18px] font-bold leading-[1.05] tracking-tight text-white">
              {p.name}
            </h2>

            <div className="mt-2 flex items-center gap-2.5 text-[11px] text-[#8e8e8e]">
              <span className="flex items-center gap-1">
                <MapPin size={12} strokeWidth={1.5} />
                {p.location}
              </span>
              <span className="h-1 w-1 rounded-full bg-[#8e8e8e]/40" />
              <span className="flex items-center gap-1">
                <Calendar size={12} strokeWidth={1.5} />
                {p.date}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3">
              {[
                { icon: Building2, value: p.equipment, label: "Equipment" },
                { icon: Users, value: p.crew, label: "Crew" },
                { icon: Clock, value: p.status, label: "Status" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.03]">
                    <Icon size={12} strokeWidth={1.5} className="text-[#e2f1a6]" />
                  </div>
                  <div className="text-sm font-bold text-white">{value}</div>
                  <div className="text-[10px] text-[#8e8e8e]">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#1f1f1f] p-2.5">
              <div className="flex items-center gap-2.5 pl-0.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#333] bg-[#121212]">
                  <Layers size={12} strokeWidth={2} className="text-[#e2f1a6]" />
                </div>
                <div>
                  <div className="text-[10px] text-[#8e8e8e]">Modules</div>
                  <div className="text-sm font-bold text-white">
                    {p.modules.filter(Boolean).length}/{p.modules.length}
                  </div>
                </div>
                <div className="flex items-center">
                  {p.modules.map((done, j) => (
                    <span key={j} className="flex items-center">
                      {done ? (
                        <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#e2f1a6]">
                          <Check size={7} strokeWidth={3.5} className="text-black" />
                        </span>
                      ) : (
                        <span className="h-3 w-3 rounded-full border border-[#333] bg-[#121212]" />
                      )}
                      {j < p.modules.length - 1 && (
                        <span className={`mx-0.5 h-px w-3 ${done && p.modules[j + 1] ? "bg-[#e2f1a6]" : "bg-[#333]"}`} />
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex h-[56px] w-[56px] items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 68 68">
                    <circle cx="34" cy="34" fill="none" r="27" stroke="#2a2a2a" strokeWidth="5" />
                    <motion.circle
                      cx="34" cy="34" fill="none" r="27"
                      stroke={p.progress > 80 ? "#10b981" : "#e2f1a6"} strokeWidth="5" strokeLinecap="round"
                      strokeDasharray="169.6"
                      initial={{ strokeDashoffset: 169.6 }}
                      animate={{ strokeDashoffset: 169.6 - (p.progress / 100) * 169.6 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                  <span className="absolute text-[11px] font-bold text-white">{p.progress}%</span>
                </div>

                <motion.button
                  onClick={() => onSelect(p.id)}
                  whileHover={{ gap: 6 }}
                  className="group flex items-center gap-1.5 rounded-lg bg-[#e2f1a6] px-3.5 py-2 text-[11px] font-semibold text-black transition-colors hover:bg-[#d4f05a]"
                >
                  Go
                  <ArrowRight size={12} strokeWidth={2.5} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
