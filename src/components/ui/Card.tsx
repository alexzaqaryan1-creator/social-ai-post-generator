"use client";

import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverLift?: boolean;
}

export function Card({ children, className = "", delay = 0, hoverLift = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 200, damping: 26, delay }}
      whileHover={hoverLift ? { y: -4 } : undefined}
      className={`rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(10,10,10,0.04)] transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(10,10,10,0.08)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
