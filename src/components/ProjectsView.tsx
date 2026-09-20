"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Plus, X } from "lucide-react";

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
  onChanged?: () => void;
}

const inputCls =
  "w-full rounded-lg bg-black/40 px-3 py-2 text-[13px] text-white placeholder:text-[#52525b] outline-none";

export default function ProjectsView({ projects, onSelect, onChanged }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", targetDate: "", equipment: "", crew: "", status: "Active" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const removeProject = async (id: string, name: string) => {
    if (!window.confirm(`Delete project "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
    onChanged?.();
  };

  const addProject = async () => {
    setError("");
    if (!form.name.trim() || !form.location.trim()) {
      setError("Project name and location are required");
      return;
    }
    setBusy(true);
    const r = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: `p_${Date.now().toString(36)}`,
        name: form.name.trim().slice(0, 80),
        location: form.location.trim().slice(0, 80),
        targetDate: form.targetDate || new Date().toISOString().split("T")[0],
        progress: 0,
        equipment: Math.max(0, Number(form.equipment) || 0),
        crew: Math.max(0, Number(form.crew) || 0),
        status: form.status,
        svgType: "tower",
        modules: [],
      }),
    });
    setBusy(false);
    if (!r.ok) {
      setError("Could not create the project");
      return;
    }
    setForm({ name: "", location: "", targetDate: "", equipment: "", crew: "", status: "Active" });
    setAddOpen(false);
    onChanged?.();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-[#8c8c8c]">{projects.length} project{projects.length === 1 ? "" : "s"}</span>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#e2f1a6] px-3.5 py-2 text-[12px] font-semibold text-black transition-colors hover:bg-[#d4f05a]"
        >
          <Plus size={14} strokeWidth={2.5} />
          Add Project
        </button>
      </div>
      {projects.map((p, i) => (
        <motion.article
          key={p.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 + i * 0.12, ease: [0, 0, 0.2, 1] }}
          className="relative flex flex-col justify-between gap-8 rounded-xl bg-[#1a1a1a] p-6 lg:flex-row lg:items-center lg:gap-12 lg:p-8"
        >
          <button
            onClick={() => removeProject(p.id, p.name)}
            title={`Delete ${p.name}`}
            className="absolute right-4 top-4 text-white/20 transition-colors hover:text-rose-300"
          >
            <X size={16} />
          </button>
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
      {typeof document !== "undefined" &&
        createPortal(
          addOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => setAddOpen(false)}>
              <div onClick={(e) => e.stopPropagation()} className="dashboard-card w-full max-w-[420px]">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[15px] font-medium tracking-wide text-white">Add project</h2>
                  <button onClick={() => setAddOpen(false)} className="text-[#8c8c8c] transition-colors hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Project name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="eg. Site C, Whitefield" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Location</label>
                    <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="eg. Bengaluru" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Target date</label>
                      <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className={`${inputCls} [color-scheme:dark]`} />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Status</label>
                      <input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="Active" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Equipment</label>
                      <input type="number" min={0} value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} placeholder="0" className={inputCls} />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#8c8c8c]">Crew</label>
                      <input type="number" min={0} value={form.crew} onChange={(e) => setForm({ ...form, crew: e.target.value })} placeholder="0" className={inputCls} />
                    </div>
                  </div>
                </div>
                {error && <p className="mt-3 text-[12px] text-rose-300">{error}</p>}
                <button
                  onClick={addProject}
                  disabled={busy}
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#e2f1a6] py-2.5 text-[13px] font-semibold text-black transition-colors hover:bg-[#d4f05a] disabled:opacity-50"
                >
                  {busy ? "Creating…" : "Create Project"}
                </button>
              </div>
            </div>
          ),
          document.body
        )}
    </div>
  );
}
