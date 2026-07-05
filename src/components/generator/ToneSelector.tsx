"use client";

import { motion } from "framer-motion";
import { TONES, type Tone } from "@/lib/types";

const TONE_LABELS: Record<Tone, string> = {
  funny: "Funny",
  luxury: "Luxury",
  corporate: "Corporate",
  casual: "Casual",
  bold: "Bold",
};

interface ToneSelectorProps {
  value: Tone;
  onChange: (tone: Tone) => void;
}

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Tone"
      className="flex flex-wrap gap-2 rounded-2xl border border-border bg-foreground/[0.02] p-1.5"
    >
      {TONES.map((tone) => {
        const active = tone === value;
        return (
          <button
            key={tone}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(tone)}
            className="relative rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-from/50"
          >
            {active && (
              <motion.span
                layoutId="tone-pill"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-foreground shadow-sm"
              />
            )}
            <span className={`relative ${active ? "text-background" : "text-muted"}`}>
              {TONE_LABELS[tone]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
