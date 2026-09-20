"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";

const STEPS = ["Mapping items…", "Updating expenses…", "Refreshing dashboard…"];

export default function ImportOverlay() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];
    const show = () => {
      setDone(false);
      setStep(0);
      setVisible(true);
      STEPS.forEach((_, i) => {
        timers.push(setTimeout(() => setStep(i), 400 + i * 600));
      });
    };
    const hide = () => {
      setDone(true);
      timers.push(setTimeout(() => setVisible(false), 600));
    };
    window.addEventListener("dpr:import-start", show);
    window.addEventListener("dpr:import-done", hide);
    return () => {
      window.removeEventListener("dpr:import-start", show);
      window.removeEventListener("dpr:import-done", hide);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="dashboard-card flex w-full max-w-[320px] flex-col items-center gap-4 px-8 py-8"
          >
            {done ? (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e2f1a6]/15 text-xl text-[#e2f1a6]">
                <Check size={20} strokeWidth={2.5} />
              </span>
            ) : (
              <Loader2 size={30} className="animate-spin text-[#e2f1a6]" strokeWidth={2} />
            )}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-[14px] font-semibold text-white">
                {done ? "Dashboard updated" : "Importing your sheet"}
              </span>
              {!done && (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={step}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-[12px] text-[#8c8c8c]"
                  >
                    {STEPS[step]}
                  </motion.span>
                </AnimatePresence>
              )}
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-[#e2f1a6]"
                initial={{ width: "4%" }}
                animate={{ width: done ? "100%" : `${18 + step * 32}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
