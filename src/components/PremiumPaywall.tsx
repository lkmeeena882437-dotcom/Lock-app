"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, CheckCircle, X } from "lucide-react";
import GlassCard from "./GlassCard";
import { useFlashlightStore } from "@/store/useFlashlightStore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PremiumPaywall() {
  const { paywallOpen, closePaywall, unlockPremium } = useFlashlightStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const startPayment = async () => {
    setLoading(true);
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_demo",
      amount: 9900,
      currency: "INR",
      name: "Lumina Lock",
      description: "24 Hours Flashlight OFF Unlock",
      handler: async (response: any) => {
        try {
          const res = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const data = await res.json();
          if (data.verified) {
            unlockPremium(data.token, data.expiresAt);
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              closePaywall();
            }, 1400);
          } else {
            alert("Verification failed. Contact support.");
          }
        } catch {
          alert("Network error during verification.");
        } finally {
          setLoading(false);
        }
      },
      prefill: { contact: "9999999999" },
      theme: { color: "#f59e0b" },
    };

    if (typeof window !== "undefined" && window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Demo fallback for UI testing without live key
      setTimeout(async () => {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: "pay_demo_123",
            razorpay_order_id: "order_demo_456",
            razorpay_signature: "sig_demo",
          }),
        });
        const data = await res.json();
        if (data.verified) {
          unlockPremium(data.token, data.expiresAt);
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            closePaywall();
          }, 1400);
        }
        setLoading(false);
      }, 1200);
    }
  };

  return (
    <AnimatePresence>
      {paywallOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 40, scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full max-w-md relative"
          >
            <button
              onClick={closePaywall}
              className="absolute -top-10 right-0 text-white/50 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={28} />
            </button>

            <GlassCard className="p-8 md:p-10 text-center">
              {success ? (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-8"
                >
                  <CheckCircle className="mx-auto text-amber-400 mb-4" size={64} />
                  <h3 className="text-2xl font-extrabold text-white mb-2">
                    Premium Active
                  </h3>
                  <p className="text-white/60">Turn OFF is now unlocked.</p>
                </motion.div>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    <Lock className="text-black" size={28} />
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                    Unlock OFF Control
                  </h2>
                  <p className="text-white/60 mb-8">
                    Only Premium users can turn off the flashlight.
                  </p>

                  <div className="bg-white/[0.03] rounded-2xl p-6 mb-6 border border-white/[0.06] text-left space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Plan</span>
                      <span className="text-amber-400 font-bold">₹99</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Validity</span>
                      <span className="text-white font-medium">24 Hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Benefit</span>
                      <span className="text-white font-medium">Turn OFF</span>
                    </div>
                  </div>

                  <button
                    onClick={startPayment}
                    disabled={loading}
                    className="relative w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold text-lg shadow-[0_10px_40px_-10px_rgba(245,158,11,0.7)] hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.9)] active:scale-[0.98] transition-all overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? "Processing..." : "Unlock Now"}
                      <Sparkles size={18} />
                    </span>
                  </button>
                </>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
