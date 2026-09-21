"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, MapPin, Box, Truck, BarChart3 } from "lucide-react";

const inputCls =
  "w-full rounded-[10px] bg-[#1f1f1f] px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#52525b] outline-none transition-colors focus:bg-[#242424]";

const FEATURES = [
  { icon: MapPin, label: "Real-time tracking" },
  { icon: Box, label: "Asset management" },
  { icon: Truck, label: "Fleet operations" },
  { icon: BarChart3, label: "Site insights" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [needsVerify, setNeedsVerify] = useState(false);

  const login = async () => {
    setError("");
    setNeedsVerify(false);
    setBusy(true);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) {
      setError(d.error ?? "Login failed");
      if (r.status === 403) setNeedsVerify(true);
      return;
    }
    router.push("/overview");
  };

  const resend = async () => {
    setError("");
    setBusy(true);
    const r = await fetch("/api/auth/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) {
      setError(d.error ?? "Could not resend code");
      return;
    }
    router.push(`/signup?verify=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex min-h-screen bg-[#0d0d0d] text-white">
      {/* Left photo card */}
      <div className="relative m-4 hidden w-[46%] overflow-hidden rounded-[28px] lg:block">
        <img src="/hero-steel.jpg" alt="Construction site" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="pt-14">
            <h1
              className="font-semibold leading-[0.9] tracking-[-0.03em] text-white"
              style={{
                fontSize: "clamp(40px, 5.5vw, 80px)",
                maxWidth: 680,
                textShadow: "0 0 80px rgba(0,0,0,0.4)",
                fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
              }}
            >
              Track with absolute
              <br />
              confidence
            </h1>
            <p className="mt-5 max-w-[420px] text-[15px] leading-relaxed text-white/75">
              The operations management platform for modern construction. Track fleet, manage assets, and monitor site
              progress in real-time.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <a
                href="/signup"
                className="flex h-[48px] items-center gap-2.5 rounded-xl bg-white px-7 text-[14px] font-semibold tracking-tight text-black transition-all duration-200 hover:-translate-y-px hover:bg-[#f2f2f2]"
              >
                Get Started
                <ArrowRight size={15} strokeWidth={2} />
              </a>
              <span className="text-[14px] font-medium text-white">Log in</span>
            </div>
          </div>
          <div className="flex items-center">
            {FEATURES.map(({ icon: Icon, label }, i) => (
              <span key={label} className="flex items-center">
                {i > 0 && <span className="mx-4 h-3 w-px bg-white/20" />}
                <span className="flex items-center gap-2 text-[12px] font-medium tracking-tight text-white/70">
                  <Icon size={14} strokeWidth={1.6} />
                  {label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px]"
          style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}
        >
          <h2 className="text-center text-[26px] font-semibold tracking-tight">Log In</h2>
          <p className="mt-2 text-center text-[13px] text-[#8c8c8c]">Enter your credentials to continue.</p>

          <div className="mt-8">
            <label className="mb-1.5 block text-[13px] font-semibold text-white">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="eg. johnfrans@gmail.com" type="email" className={inputCls} />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-[13px] font-semibold text-white">Password</label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                type={showPw ? "text" : "password"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") login();
                }}
                className={`${inputCls} pr-10`}
              />
              <button
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-white"
                title={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && <p className="mt-4 text-center text-[12px] text-rose-300">{error}</p>}
          {needsVerify && (
            <button
              onClick={resend}
              disabled={busy}
              className="mt-3 w-full rounded-[10px] bg-[#1f1f1f] py-2.5 text-[13px] font-medium text-[#e2f1a6] transition-colors hover:bg-[#242424] disabled:opacity-50"
            >
              {busy ? "Sending…" : "Resend verification code"}
            </button>
          )}

          <button
            onClick={login}
            disabled={busy}
            className="mt-6 w-full rounded-[10px] bg-white py-3 text-[14px] font-semibold text-black transition-colors hover:bg-[#e2f1a6] disabled:opacity-50"
          >
            {busy ? "Logging in…" : "Log In"}
          </button>

          <p className="mt-6 text-center text-[12px] text-[#8c8c8c]">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-medium text-white hover:text-[#e2f1a6]">
              Sign up
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
