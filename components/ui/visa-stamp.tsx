"use client";

import { motion, useReducedMotion } from "motion/react";

// An ink stamp that slams onto the document when it scrolls into view.
export function VisaStamp({ label = "Approved", delay = 0 }: { label?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className="inline-block self-end rounded-md border-2 border-brick/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brick/80"
      initial={reduceMotion ? { rotate: -8 } : { opacity: 0, scale: 2.4, rotate: -22 }}
      whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 420, damping: 16, delay: 0.5 + delay }}
    >
      {label}
    </motion.span>
  );
}
