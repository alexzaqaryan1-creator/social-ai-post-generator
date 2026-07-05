"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface GenerationStepsProps {
  steps: string[];
  /** Set true once the real API call has resolved, to fast-forward the rest. */
  done: boolean;
}

export function GenerationSteps({ steps, done }: GenerationStepsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (done) return;
    if (index >= steps.length - 1) return;
    const t = setTimeout(() => setIndex((i) => i + 1), 750);
    return () => clearTimeout(t);
  }, [index, done, steps.length]);

  useEffect(() => {
    if (!done || index >= steps.length) return;
    const t = setTimeout(() => setIndex((i) => i + 1), 120);
    return () => clearTimeout(t);
  }, [done, index, steps.length]);

  return (
    <div className="flex flex-col gap-3">
      {steps.map((label, i) => {
        const state = i < index ? "done" : i === index ? "active" : "pending";
        return (
          <motion.div
            key={label}
            animate={{ opacity: state === "pending" ? 0.4 : 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                state === "done"
                  ? "border-transparent bg-foreground text-background"
                  : state === "active"
                    ? "border-accent-from/40 text-accent-from"
                    : "border-border-strong"
              }`}
            >
              {state === "done" && <Check className="h-3.5 w-3.5" />}
              {state === "active" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            </span>
            <span className={`text-sm ${state === "pending" ? "text-muted" : "text-foreground"}`}>
              {label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
