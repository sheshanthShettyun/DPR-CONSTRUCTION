"use client";

import { useRef, useState } from "react";
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

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const submitForm = async () => {
    setError("");
    setNotice("");
    setBusy(true);
    const r = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) {
      setError(d.error ?? "Something went wrong");
      return;
    }
    setStep("otp");
    if (!d.emailed) setNotice("Email delivery isn't configured — check the server console for your code.");
    setTimeout(() => boxes.current[0]?.focus(), 100);
  };

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < 5) boxes.current[i + 1]?.focus();
  };

  const verify = async (codeOverride?: string) => {
    const code = codeOverride ?? digits.join("");
    if (code.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }
    setError("");
    setBusy(true);
    const r = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) {
      setError(d.error ?? "Verification failed");
      return;
    }
    router.push("/overview");
  };

  const resend = async () => {
    setError("");
    setBusy(true);
    const r = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) {
      setError(d.error ?? "Could not resend");
      return;
    }
    setDigits(["", "", "", "", "", ""]);
    setNotice(d.emailed ? "A new code was sent to your email." : "Email delivery isn't configured — check the server console.");
    boxes.current[0]?.focus();
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
              <button
                onClick={() => document.getElementById("firstName")?.focus()}
                className="flex h-[48px] items-center gap-2.5 rounded-xl bg-white px-7 text-[14px] font-semibold tracking-tight text-black transition-all duration-200 hover:-translate-y-px hover:bg-[#f2f2f2]"
              >
                Get Started
                <ArrowRight size={15} strokeWidth={2} />
              </button>
              <a href="/login" className="text-[14px] font-medium text-white/85 transition-colors hover:text-white">
                Log in
              </a>
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
        >
          {step === "form" ? (
            <>
              <h2 className="text-center text-[26px] font-semibold tracking-tight">Sign Up Account</h2>
              <p className="mt-2 text-center text-[13px] text-[#8c8c8c]">Enter your personal data to create your account.</p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-white">First Name</label>
                  <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="eg. John" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-white">Last Name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="eg. Francisco" className={inputCls} />
                </div>
              </div>

              <div className="mt-4">
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
                      if (e.key === "Enter") submitForm();
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
                <p className="mt-1.5 text-[11px] text-[#8c8c8c]">Must be at least 8 characters.</p>
              </div>

              {error && <p className="mt-4 text-center text-[12px] text-rose-300">{error}</p>}
              {notice && <p className="mt-4 text-center text-[12px] text-amber-300">{notice}</p>}

              <button
                onClick={submitForm}
                disabled={busy}
                className="mt-6 w-full rounded-[10px] bg-white py-3 text-[14px] font-semibold text-black transition-colors hover:bg-[#e2f1a6] disabled:opacity-50"
              >
                {busy ? "Sending code…" : "Sign Up"}
              </button>

              <p className="mt-6 text-center text-[12px] text-[#8c8c8c]">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-white hover:text-[#e2f1a6]">
                  Log in
                </a>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-center text-[26px] font-semibold tracking-tight">Check your email</h2>
              <p className="mt-2 text-center text-[13px] text-[#8c8c8c]">
                We sent a 6-digit code to <span className="text-white">{email}</span>
              </p>

              <div className="mt-8 flex justify-center gap-2.5">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      boxes.current[i] = el;
                    }}
                    value={d}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digits[i] && i > 0) boxes.current[i - 1]?.focus();
                      if (e.key === "Enter") verify();
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                      if (text.length === 6) {
                        setDigits(text.split(""));
                        verify(text);
                      }
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    className="h-12 w-11 rounded-xl bg-[#1f1f1f] text-center text-lg font-bold text-white outline-none focus:bg-[#242424]"
                  />
                ))}
              </div>

              {error && <p className="mt-4 text-center text-[12px] text-rose-300">{error}</p>}
              {notice && <p className="mt-4 text-center text-[12px] text-amber-300">{notice}</p>}

              <button
                onClick={() => verify()}
                disabled={busy}
                className="mt-6 w-full rounded-[10px] bg-white py-3 text-[14px] font-semibold text-black transition-colors hover:bg-[#e2f1a6] disabled:opacity-50"
              >
                {busy ? "Verifying…" : "Verify & Create Account"}
              </button>

              <p className="mt-6 text-center text-[12px] text-[#8c8c8c]">
                Didn&apos;t get the code?{" "}
                <button onClick={resend} disabled={busy} className="font-medium text-white hover:text-[#e2f1a6]">
                  Resend
                </button>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
