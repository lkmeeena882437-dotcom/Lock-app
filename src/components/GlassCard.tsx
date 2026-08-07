import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`
        relative overflow-hidden rounded-[32px]
        bg-white/[0.03] border border-white/[0.08]
        backdrop-blur-2xl shadow-2xl shadow-black/50
        ${className}
      `}
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-amber-500/5 via-transparent to-amber-500/10" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
