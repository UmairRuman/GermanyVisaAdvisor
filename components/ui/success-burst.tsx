"use client";

import { motion, useReducedMotion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { EASE_SETTLE } from "@/lib/motion";
import { LinkButton } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const distance = 70 + (i % 3) * 22;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    color: ["var(--color-brick)", "var(--color-gold)", "var(--color-charcoal)"][i % 3],
    size: 6 + (i % 3) * 2,
  };
});

// Drawn-on checkmark inside a ring, with a small confetti burst. Shown after the profile
// form is handed to WhatsApp.
export function SuccessBurst({ className = "min-h-[380px]" }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative flex h-28 w-28 items-center justify-center">
        {!reduceMotion &&
          PARTICLES.map((particle, index) => (
            <motion.span
              key={index}
              aria-hidden
              className="absolute rounded-full"
              style={{ width: particle.size, height: particle.size, background: particle.color }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{ x: particle.x, y: particle.y, opacity: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.35, ease: EASE_SETTLE }}
            />
          ))}
        <svg viewBox="0 0 96 96" className="h-24 w-24" aria-hidden>
          <motion.circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke="var(--color-brick)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: reduceMotion ? 1 : 0, rotate: -90 }}
            animate={{ pathLength: 1 }}
            style={{ transformOrigin: "48px 48px" }}
            transition={{ duration: 0.7, ease: EASE_SETTLE }}
          />
          <motion.path
            d="M30 50 L43 63 L67 36"
            fill="none"
            stroke="var(--color-brick)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduceMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: EASE_SETTLE }}
          />
        </svg>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: EASE_SETTLE }}
      >
        <h3 className="mt-5 font-display text-2xl font-semibold text-ink">Opening WhatsApp&hellip;</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
          If it didn&rsquo;t open automatically, message us directly and we&rsquo;ll pick up right from
          there.
        </p>
        <LinkButton href={buildWhatsAppLink()} variant="secondary" className="mt-5">
          <MessageCircle size={16} className="text-[#1fae54]" /> Open WhatsApp
        </LinkButton>
      </motion.div>
    </div>
  );
}
