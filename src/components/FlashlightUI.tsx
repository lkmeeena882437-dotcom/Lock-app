"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Lock } from "lucide-react";
import { useFlashlightStore } from "@/store/useFlashlightStore";
import GlassCard from "./GlassCard";
import PremiumPaywall from "./PremiumPaywall";

const GlowingFlash = ({ active }: { active: boolean }) => (
  <div className="relative">
    <svg width="160" height="160" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M12 2 L12 8" stroke={active ? "url(#g)" : "#333"} strokeWidth={active ? "5" : "2"} className="transition-all duration-700" />
      <path d="M8 6 L12 2 L16 6" fill={active ? "#fbbf24" : "#333"} className="transition-all duration-700" />
      <rect x="9" y="8" width="6" height="10" rx="1.5" fill={active ? "#f59e0b" : "#262626"} stroke={active ? "#fde68a" : "#404040"} strokeWidth="1" className="transition-all duration-700" />
      <circle cx="12" cy="14" r="1.2" fill={active ? "#fff" : "#555"} className="transition-all duration-700" />
    </svg>
    <div className={`absolute -inset-10 rounded-full blur-[60px] transition-opacity duration-700 -z-10 ${active ? "opacity-60 bg-amber-400" : "opacity-10 bg-amber-900"}`} />
  </div>
);

export default function FlashlightUI() {
  const { isOn, turnOn, attemptTurnOff, paywallOpen, premium, checkPremiumValidity } = useFlashlightStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isPremiumValid = checkPremiumValidity();

  if (!mounted) return <div className="h-screen bg-[#030303]" />;

  return (
    <main className="relative w-full min-h-screen bg-[#030303] overflow-hidden text-white selection:bg-amber-500/30">
      {/* Ambient radial glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.1),transparent_60%)] pointer-events-none" />

      {/* Premium Badge */}
      <div className="absolute top-6 right-6 z-20">
        {isPremiumValid ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400 text-xs font-extrabold backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)] uppercase tracking-wider">
            <ShieldCheck size={14} />
            Premium
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/30 text-xs font-extrabold backdrop-blur-md uppercase tracking-wider">
            <Lock size={14} />
            Basic
          </div>
        )}
      </div>

      <section className="relative z-10 flex flex-col items-center min-h-screen px-6 py-24 md:py-32">
        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-auto pt-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-600 mb-3 drop-shadow-2xl">
            LUMINA
          </h1>
          <p className="text-white/20 text-sm font-medium tracking-[0.3em] uppercase">Flashlight Lock</p>
        </motion.div>

        {/* Icon */}
        <motion.div animate={{ scale: isOn ? [1, 1.04, 1] : 1 }} transition={{ duration: 2.5, repeat: isOn ? Infinity : 0, ease: "easeInOut" }} className="mb-10">
          <GlowingFlash active={isOn} />
        </motion.div>

        {/* Status */}
        <motion.div key={isOn ? "on" : "off"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-10 h-8 text-center">
          <span className={`text-sm md:text-base font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${isOn ? "text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]" : "text-white/30"}`}>
            {isOn ? "FLASHLIGHT IS ON" : "READY TO ILLUMINATE"}
          </span>
        </motion.div>

        {/* Main Control Card */}
        <div className="w-full max-w-[22rem] mb-12">
          <GlassCard className="p-8 md:p-10 flex flex-col items-center gap-6">
            <button
              onClick={() => (isOn ? attemptTurnOff() : turnOn())}
              className={`
                relative w-32 h-32 rounded-full flex items-center justify-center
                transition-all duration-300 active:scale-95 shadow-inner
                ${isOn
                  ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_60px_-10px_rgba(245,158,11,0.8)] ring-1 ring-amber-300/30"
                  : "bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/[0.08] hover:border-white/20 hover:shadow-[0_0_30px_-8px_rgba(255,255,255,0.05)]"
                }
              `}
              aria-label={isOn ? "Turn off flashlight" : "Turn on flashlight"}
            >
              {isOn && <span className="absolute inset-0 rounded-full bg-amber-200/40 animate-pulse" />}
              <Zap size={48} strokeWidth={2.5} className={`transition-transform duration-300 ${isOn ? "text-black rotate-[15deg]" : "text-white/20"}`} />
            </button>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {isOn ? "Turn OFF Flashlight" : "Turn ON Flashlight"}
              </h2>
              <p className="text-xs text-white/30 font-medium">
                {isOn ? (isPremiumValid ? "Premium Active • Unlocked" : "Requires Premium to disable") : "Free to activate"}
              </p>
            </div>

            {/* Lock Banner */}
            {isOn && !isPremiumValid && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full py-2.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 flex items-center justify-center gap-2 text-red-400 text-xs font-extrabold uppercase tracking-wide">
                <Lock size={14} />
                OFF Control Locked
              </motion.div>
            )}
          </GlassCard>
        </div>

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-[10px] text-white/10 font-medium tracking-[0.2em] uppercase">
          Immersive PWA Experience
        </motion.footer>
      </section>

      <PremiumPaywall />
    </main>
  );
}
