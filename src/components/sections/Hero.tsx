"use client";

import { motion } from "framer-motion";
import { PlayCircle, Sparkles } from "lucide-react";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { LinkButton } from "@/components/ui/Button";
import { FloatingPreviewCards } from "@/components/sections/FloatingPreviewCards";

export function Hero() {
  return (
    <CursorGlow className="border-b border-border">
      <FloatingPreviewCards />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-20 text-center sm:px-8 sm:py-28">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
          className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-card px-3 py-1.5 text-xs font-medium text-muted"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-from" />
          Free AI-powered
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
          className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          Turn any photo into{" "}
          <span className="text-gradient">social content people actually want to read</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 22, delay: 0.25 }}
          className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-muted"
        >
          Upload a photo, add a product name, pick a tone — get Instagram captions, hashtags, and
          ad copy in seconds. No sign-up, no cost.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 22, delay: 0.4 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <LinkButton href="#generate" variant="primary" className="text-base">
            Generate Caption
          </LinkButton>
          <LinkButton href="#demo" variant="secondary" className="text-base">
            <PlayCircle className="h-4 w-4" />
            See Demo
          </LinkButton>
        </motion.div>
      </div>
    </CursorGlow>
  );
}
