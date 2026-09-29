"use client";

import { motion, useScroll, useSpring } from "motion/react";

// Thin brick→gold bar pinned to the top edge that fills as the page is read.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-brick via-gold to-brick"
      style={{ scaleX }}
    />
  );
}
