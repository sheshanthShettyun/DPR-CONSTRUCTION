"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Box, Shield, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen text-[#e5e2e1]" style={{ backgroundColor: "#121212" }}>
      <nav className="fixed left-1/2 top-6 z-50 flex w-[95%] max-w-6xl -translate-x-1/2 items-center justify-between rounded-full bg-white px-6 py-3 text-black shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-3">
          <span className="text-[20px] font-bold tracking-tight">DPR Construction</span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <Link className="text-[14px] font-semibold text-black" href="/overview">Dashboard</Link>
          <a className="text-[14px] font-medium text-[#444] transition-colors hover:text-black" href="#">Fleet</a>
          <a className="text-[14px] font-medium text-[#444] transition-colors hover:text-black" href="#">Assets</a>
          <a className="text-[14px] font-medium text-[#444] transition-colors hover:text-black" href="#">Progress</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/overview" className="rounded-full bg-black px-6 py-2.5 text-[12px] font-bold tracking-wide text-white transition-all hover:bg-neutral-800">START FOR FREE</Link>
        </div>
      </nav>

      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 pb-24 pt-48 text-center">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/hero-steel.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
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

      <section className="relative z-10 px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-[40px] tracking-tight text-white">Command your ecosystem.</h2>
            <p className="mx-auto max-w-xl text-[18px] leading-relaxed text-[#c4c7c8]">Every component of your construction operation unified into a single source of truth.</p>
          </div>
          <div className="mx-auto max-w-2xl rounded-2xl bg-[#201f1f] p-10 transition-all duration-300">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#353534]">
              <Box size={24} className="text-white" />
            </div>
            <h3 className="mb-3 text-[24px] font-semibold text-white">Asset Management</h3>
            <p className="text-[#c4c7c8]">Comprehensive database for tools, safety gear, and specialized materials.</p>
            <ul className="mt-8 space-y-3">
              <li className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
                <span className="text-[16px] font-medium text-white">Laser Scanners</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">Active</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                <span className="text-[16px] font-medium text-white">PPE Kit B-09</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#c4c7c8]">Storage</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-8 py-24">
        <div className="mx-auto max-w-7xl border-y border-white/10 py-16">
          <div className="grid grid-cols-2 gap-12 text-center lg:grid-cols-4">
            {[
              { value: "40%", label: "Efficiency Increase" },
              { value: "24/7", label: "Live Monitoring" },
              { value: "0", label: "Asset Loss Ratio" },
              { value: "12k+", label: "Active Assets" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="mb-2 text-[48px] tracking-tight text-white">{stat.value}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-8 py-24">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#201f1f] p-16 text-center">
          <h2 className="relative z-10 mb-6 text-[40px] tracking-tight text-white">Ready to transform your site operations?</h2>
          <p className="relative z-10 mx-auto mb-10 max-w-xl text-[18px] leading-relaxed text-[#c4c7c8]">
            Join the leaders in modern construction. Deploy the DPR platform across your entire fleet in under 24 hours.
          </p>
          <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/overview" className="rounded-full bg-white px-8 py-3.5 text-[14px] font-bold tracking-wide text-black transition-all hover:bg-gray-100">Get Started Now</Link>
            <button className="rounded-full border border-white/20 bg-transparent px-8 py-3.5 text-[14px] font-bold tracking-wide text-white transition-all hover:bg-white/5">Request Proposal</button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mt-12 w-full border-t border-white/5 px-8 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[20px] font-bold tracking-tight text-white">DPR Construction</span>
            </div>
            <p className="text-[14px] leading-relaxed text-[#c4c7c8]">Pioneering the future of digital-first construction management and operations intelligence.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-4">
            {[
              { title: "Company", links: ["About Us", "Careers", "Contact"] },
              { title: "Solutions", links: ["Fleet Tracking", "Asset Control", "Site Monitor"] },
              { title: "Resources", links: ["Case Studies", "API Docs", "Blog"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Security"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="mb-6 text-[14px] font-semibold text-white">{col.title}</h4>
                <ul className="space-y-4 text-[14px] text-[#c4c7c8]">
                  {col.links.map((link) => (
                    <li key={link}><a className="transition-colors hover:text-white" href="#">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center gap-6 border-t border-white/5 pt-12 md:flex-row md:justify-between">
          <p className="text-[12px] text-[#c4c7c8]">2026 DPR Construction Operations Management. All rights reserved.</p>
          <div className="flex gap-6">
            <Globe size={18} className="text-[#c4c7c8] transition-colors hover:text-white" />
            <Shield size={18} className="text-[#c4c7c8] transition-colors hover:text-white" />
          </div>
        </div>
      </footer>
    </div>
  );
}
