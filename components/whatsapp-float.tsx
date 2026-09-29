"use client";

import { motion, useReducedMotion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { EASE_SETTLE } from "@/lib/motion";

export function WhatsAppFloat() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={buildWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.4, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 2, ease: EASE_SETTLE }}
      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1fae54] text-paper shadow-[0_16px_32px_-8px_rgba(31,174,84,0.55)]"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1fae54]/40" />
      <MessageCircle size={24} className="relative transition-transform duration-300 group-hover:-rotate-12" />
      <span className="pointer-events-none absolute right-full mr-3 translate-x-2 whitespace-nowrap rounded-full bg-charcoal px-3.5 py-2 text-xs font-bold text-paper opacity-0 shadow-[0_12px_24px_-8px_rgba(23,19,16,0.4)] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
        Chat with us
      </span>
    </motion.a>
  );
}
