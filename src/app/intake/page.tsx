"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Flag, Loader2 } from "lucide-react";
import TopNav from "@/components/TopNav";

interface FormState {
  name: string;
  location: string;
  projectType: string;
  budget: string;
  startDate: string;
  targetDate: string;
  crewSize: string;
  scale: string;
  siteConditions: string;
}

interface Risk {
  id: number;
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  category: string;
}

interface Milestone {
  id: number;
  title: string;
  date: string;
  phasePct: number;
}

interface IntakeResult {
  id: string;
  name: string;
  risks: Risk[];
  milestones: Milestone[];
}

const projectTypes = ["Residential", "Commercial", "Industrial", "Infrastructure"];
const siteConditionOptions = ["Standard", "Urban", "Remote", "Coastal", "Seismic Zone", "Flood Zone"];

const severityStyles: Record<string, { text: string; bg: string; border: string }> = {
  High: { text: "text-rose-300", bg: "bg-rose-500/10", border: "border-rose-300/20" },
  Medium: { text: "text-amber-300", bg: "bg-amber-300/10", border: "border-amber-300/20" },
  Low: { text: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-300/20" },
};

const initialForm: FormState = {
  name: "",
  location: "",
  projectType: "Commercial",
  budget: "",
  startDate: "",
  targetDate: "",
  crewSize: "",
  scale: "",
  siteConditions: "Standard",
};

export default function IntakePage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IntakeResult | null>(null);

  const update = (key: keyof FormState, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.location || !form.startDate || !form.targetDate) {
      setError("Please fill in name, location, start date, and target date.");
      return;
    }
    if (new Date(form.targetDate) <= new Date(form.startDate)) {
      setError("Target date must be after the start date.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          location: form.location,
          projectType: form.projectType,
          budget: Number(form.budget) || 0,
          startDate: form.startDate,
          targetDate: form.targetDate,
          crewSize: Number(form.crewSize) || 0,
          scale: Number(form.scale) || 1,
          siteConditions: form.siteConditions,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate assessment");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong generating the assessment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setResult(null);
    setForm(initialForm);
  };

  return (
    <div className="min-h-screen p-8">
      <TopNav />

      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Project Risk & Milestone Assessment</h1>
          <p className="mt-1 text-sm text-[#8c8c8c]">
            Enter basic project details to generate an initial risk profile and phase milestones.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={handleSubmit}
              className="dashboard-card flex flex-col gap-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <Field label="Project Name">
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Meridian Heights — Tower B"
                    className="input"
                  />
                </Field>
                <Field label="Location">
                  <input
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="Dallas, TX"
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Project Type">
                  <select
                    value={form.projectType}
                    onChange={(e) => update("projectType", e.target.value)}
                    className="input"
                  >
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Site Conditions">
                  <select
                    value={form.siteConditions}
                    onChange={(e) => update("siteConditions", e.target.value)}
                    className="input"
                  >
                    {siteConditionOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Start Date">
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => update("startDate", e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Target Completion Date">
                  <input
                    type="date"
                    value={form.targetDate}
                    onChange={(e) => update("targetDate", e.target.value)}
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Budget (USD)">
                  <input
                    type="number"
                    min={0}
                    value={form.budget}
                    onChange={(e) => update("budget", e.target.value)}
                    placeholder="4500000"
                    className="input"
                  />
                </Field>
                <Field label="Crew Size">
                  <input
                    type="number"
                    min={0}
                    value={form.crewSize}
                    onChange={(e) => update("crewSize", e.target.value)}
                    placeholder="120"
                    className="input"
                  />
                </Field>
                <Field label="Scale (k sqft)">
                  <input
                    type="number"
                    min={1}
                    value={form.scale}
                    onChange={(e) => update("scale", e.target.value)}
                    placeholder="180"
                    className="input"
                  />
                </Field>
              </div>

              {error && (
                <div className="rounded-lg border border-rose-300/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#e2f1a6] py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {submitting && <Loader2 size={15} className="animate-spin" />}
                {submitting ? "Generating…" : "Generate Assessment"}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{result.name}</h2>
                <button
                  onClick={reset}
                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-[#8c8c8c] transition-colors hover:bg-white/10 hover:text-white"
                >
                  New Assessment
                </button>
              </div>

              <div className="dashboard-card flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#8c8c8c]">
                  <AlertTriangle size={15} className="text-[#e2f1a6]" />
                  Identified Risks
                </div>
                <div className="flex flex-col gap-2">
                  {result.risks.map((risk) => {
                    const s = severityStyles[risk.severity];
                    return (
                      <div key={risk.id} className="flex items-start justify-between gap-3 rounded-lg bg-[#1f1f1f] p-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-[13px] font-medium text-white">{risk.title}</h4>
                            <span className="rounded bg-[#2A2A2A] px-1.5 py-0.5 text-[9px] font-medium text-[#8c8c8c]">
                              {risk.category}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-[#8c8c8c]">{risk.description}</p>
                        </div>
                        <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium ${s.text} ${s.bg} ${s.border}`}>
                          {risk.severity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="dashboard-card flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#8c8c8c]">
                  <Flag size={15} className="text-[#e2f1a6]" />
                  Milestones
                </div>
                <div className="flex flex-col gap-2">
                  {result.milestones.map((m, i) => (
                    <div key={m.id} className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] p-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#e2f1a6]/30 text-[10px] font-semibold text-[#e2f1a6]">
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[13px] font-medium text-white">{m.title}</h4>
                        <p className="text-[11px] text-[#8c8c8c]">{m.date}</p>
                      </div>
                      <span className="text-[11px] font-medium text-[#8c8c8c]">{m.phasePct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .input {
          background-color: #111111;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 13px;
          color: white;
          width: 100%;
        }
        .input:focus {
          outline: none;
          border-color: #e2f1a6;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-[#8c8c8c]">{label}</span>
      {children}
    </label>
  );
}
