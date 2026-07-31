"use client";

import { motion } from "framer-motion";

export default function TimerSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
      className="dashboard-card relative col-span-2 flex items-center justify-between overflow-hidden"
    >
      <div className="z-10 max-w-[50%]">
        <h2 className="mb-2 text-2xl font-bold leading-tight text-white">Daily Progress Sync</h2>
        <p className="mb-6 text-sm text-emerald-500/80">
          Automated routing updates will trigger in the next cycle. Ensure all cargos are finalized.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3 font-bold text-black transition-all hover:bg-emerald-400"
        >
          Sync Reports
        </motion.button>
      </div>
      <div className="relative flex h-full w-1/2 items-center justify-center">
        <div className="relative flex h-48 w-48 items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-emerald-900/30 blur-2xl" />
          <motion.img
            alt="Timer"
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 h-32 w-32 object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtLa4hMJuoNP-wQAZA_rOPV9MlVYCcZpmdk9OTvobx9zhWpmIbPEtywfqnKFAVP5_JKV2e1s8YAlS8QkN3JarOK9pHfoXkGyXRFFjiXTO2oC3jPR8pQ-h9lFdx_2INhSP-j3xK_eTTcISD-_ysb0Cy7dB-Pc3SJrTThdOTSnjdEhH6DH9-avy3JRMP2NBJ-eDzOxFY7ZIZpsgti_EpAsNvRzHGL-Oi2QpJlw-c50I-2gBr-pjnY_8xeNEIMCKdRAsL8A"
          />
          <svg className="absolute bottom-4 right-12 z-30 h-6 w-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.13 14.56L15.03 16.46L13.62 17.88L11.72 15.98V20H9.72V12H17.72V14H13.63L13.13 14.56Z" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
