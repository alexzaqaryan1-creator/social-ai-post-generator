"use client";

import { motion } from "framer-motion";
import { Sparkles, Hash, MessageCircle } from "lucide-react";
import type { CSSProperties } from "react";

function rotateStyle(deg: number): CSSProperties {
  return { "--rotate": `${deg}deg` } as CSSProperties;
}

export function FloatingPreviewCards() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={rotateStyle(-6)}
        className="animate-float absolute left-[6%] top-[18%] w-56 rounded-2xl border border-border bg-card p-4 shadow-[0_20px_50px_rgba(10,10,10,0.08)]"
      >
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
          <MessageCircle className="h-3.5 w-3.5 text-accent-from" />
          Caption
        </div>
        <p className="text-sm leading-snug text-foreground">
          &ldquo;A summer day with friends, and everyone&rsquo;s already asking where.&rdquo;
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{ ...rotateStyle(5), animationDelay: "1.2s" }}
        className="animate-float absolute right-[8%] top-[8%] w-52 rounded-2xl border border-border bg-card p-4 shadow-[0_20px_50px_rgba(10,10,10,0.08)]"
      >
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
          <Hash className="h-3.5 w-3.5 text-accent-to" />
          Hashtags
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["#summervibes", "#friendship", "#goodtimes"].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-foreground/[0.04] px-2 py-0.5 text-xs text-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        style={{ ...rotateStyle(-3), animationDelay: "0.6s" }}
        className="animate-float absolute bottom-[12%] right-[18%] flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-[0_20px_50px_rgba(10,10,10,0.08)]"
      >
        <Sparkles className="h-4 w-4 text-accent-from" />
        <span className="text-xs font-medium text-foreground">Generated in 2.1s</span>
      </motion.div>
    </div>
  );
}
