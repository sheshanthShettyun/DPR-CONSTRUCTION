"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Box, Shield, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen text-[#e5e2e1]" style={{ backgroundColor: "#121212" }}>
      <nav className="fixed left-1/2 top-6 z-50 flex w-[90%] max-w-5xl -translate-x-1/2 items-center justify-between rounded-2xl bg-white px-5 py-2.5 text-black shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-3">
          <span className="text-[18px] font-bold tracking-tight">DPR Construction</span>
        </div>
        <div className="flex items-center gap-1">
          {["Dashboard", "Fleet", "Assets", "Progress"].map((item) => (
            <Link
              key={item}
              className="rounded-[10px] px-3 py-1.5 text-[13px] font-medium text-[#444] transition-all duration-200 hover:bg-black hover:text-white"
              href={item === "Dashboard" ? "/overview" : "#"}
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>

      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 pb-24 pt-48 text-center">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/hero-steel.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            filter: "blur(3px)",
          }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.25)" }} />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48" style={{ background: "linear-gradient(to bottom, transparent, #121212)" }} />

        <div className="z-10 mx-auto flex max-w-4xl flex-col items-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-white mix-blend-difference md:text-[72px]"
          >
            Track with absolute<br />confidence
          </motion.h1>

          <div className="flex w-full max-w-4xl items-center justify-center gap-12 py-12">
            <div className="opacity-40">
              <svg className="text-white" fill="none" height="48" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="48">
                <path d="M3 21h18M9 21V3l12 6v6l-12 6M9 9h12" />
              </svg>
            </div>
            <div className="text-[80px] font-bold uppercase tracking-tighter text-white">DPR</div>
            <div className="opacity-40">
              <svg className="text-white" fill="none" height="48" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="48">
                <path d="M2 20h20M7 20v-4a5 5 0 0 1 10 0v4M12 7V3m-4 4 8 8" />
                <circle cx="12" cy="9" r="6" />
              </svg>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl text-[20px] leading-relaxed text-[#c4c7c8] mix-blend-difference"
          >
            The operations management platform for modern construction. Track fleet, manage assets, and monitor site progress in real-time.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
