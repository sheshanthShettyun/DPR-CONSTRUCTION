"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Box, Truck, BarChart3, ChevronDown } from "lucide-react";

export default function Home() {
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    let raf: number;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setBgOffset({
          x: (e.clientX / window.innerWidth - 0.5) * -6,
          y: (e.clientY / window.innerHeight - 0.5) * -6,
        });
      });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  const features = [
    { icon: MapPin, label: "Real-time tracking" },
    { icon: Box, label: "Asset management" },
    { icon: Truck, label: "Fleet operations" },
    { icon: BarChart3, label: "Site insights" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080808" }}>
      <nav className="fixed left-1/2 top-0 z-50 flex w-[90%] max-w-5xl -translate-x-1/2 items-center justify-between rounded-b-2xl bg-white/[0.06] px-5 py-2 backdrop-blur-xl" style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}>
        <span className="text-[16px] font-medium tracking-tight text-white/90">DPR Construction</span>
        <div className="flex items-center gap-1">
          {["Dashboard", "Fleet", "Assets", "Progress"].map((item) => (
            <Link
              key={item}
              className="flex items-center rounded-[10px] px-3 text-[13px] font-medium text-white/60 transition-all duration-200 hover:bg-white/[0.08] hover:text-white/90"
              style={{ height: 32 }}
              href={item === "Dashboard" ? "/overview" : "#"}
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>

      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/hero-steel.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(3.6px)",
            transform: `translate(${bgOffset.x}px, ${bgOffset.y}px) scale(1.02)`,
          }}
        />
        <div className="absolute inset-0 bg-black/[0.15]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48" style={{
          background: "linear-gradient(to bottom, transparent, #080808)",
        }} />

        <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-col px-8" style={{ paddingTop: 56 }}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-semibold leading-[0.9] tracking-[-0.03em] text-white"
            style={{
              fontSize: "clamp(40px, 5.5vw, 80px)",
              maxWidth: 680,
              textShadow: "0 0 80px rgba(0,0,0,0.4)",
              marginBottom: 28,
              fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
            }}
          >
            Track with absolute<br />confidence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[16px] font-light leading-[1.65] text-white/75"
            style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", maxWidth: 440, marginBottom: 36 }}
          >
            The operations management platform for modern construction. Track fleet, manage assets, and monitor site progress in real-time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-5"
            style={{ marginBottom: 56 }}
          >
            <Link
              href="/overview"
              className="flex h-[48px] items-center gap-2.5 rounded-xl bg-white px-7 text-[14px] font-semibold tracking-tight text-black shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-px hover:bg-[#f2f2f2]"
              style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}
            >
              Get Started
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <div className="mb-5 h-px w-full max-w-[520px] bg-white/[0.06]" />
            <div className="flex items-center gap-0">
              {features.map(({ icon: Icon, label }, i) => (
                <span key={label} className="flex items-center">
                  {i > 0 && <span className="mx-4 h-3 w-px bg-white/[0.08]" />}
                  <span className="flex items-center gap-2 text-[12px] font-medium tracking-tight text-white/55">
                    <Icon size={14} strokeWidth={1.6} />
                    {label}
                  </span>
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <ChevronDown size={16} className="text-white/12" strokeWidth={1.5} />
        </motion.div>
      </section>
    </div>
  );
}
