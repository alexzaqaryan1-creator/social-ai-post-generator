"use client";

import { useMotionValue, useSpring, motion } from "framer-motion";

interface CursorGlowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps its children in a relative container and renders a soft radial
 * gradient that trails the cursor. The handler lives on this wrapper (not
 * the glow layer itself) so it keeps receiving mousemove events even when
 * the cursor is over interactive children stacked above the glow.
 */
export function CursorGlow({ children, className = "" }: CursorGlowProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 60, damping: 20, mass: 0.6 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  return (
    <div onMouseMove={handleMouseMove} className={`relative overflow-hidden ${className}`}>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full opacity-[0.14] blur-3xl"
        style={{
          left: springX,
          top: springY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, var(--accent-from) 0%, var(--accent-to) 55%, transparent 75%)",
        }}
      />
      {children}
    </div>
  );
}
