"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Maximize2, X } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { VisaStamp } from "@/components/ui/visa-stamp";
import { EASE_SETTLE } from "@/lib/motion";
import type { ProofItem } from "@/lib/data/proof";

export function VisaWall({ items }: { items: ProofItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const item = active === null ? null : items[active];

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % items.length));
      if (event.key === "ArrowLeft") setActive((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, items.length]);

  return (
    <>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((proof, index) => (
          <Reveal key={proof.src} delay={(index % 3) * 0.06}>
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Enlarge: ${proof.alt}`}
              className="group block w-full rounded-2xl border border-line bg-paper p-3 text-left shadow-[0_1px_2px_rgba(26,22,19,0.04)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-20px_rgba(26,22,19,0.25)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-charcoal/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proof.src} alt={proof.alt} loading="lazy" className="h-full w-full object-cover object-top" />
                <span className="absolute inset-0 flex items-center justify-center bg-charcoal/0 opacity-0 transition-all duration-300 group-hover:bg-charcoal/40 group-hover:opacity-100">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink">
                    <Maximize2 size={17} />
                  </span>
                </span>
                <span className="absolute bottom-2 right-2 scale-75 origin-bottom-right">
                  <VisaStamp delay={index * 0.1} />
                </span>
              </div>
              <p className="mt-3 px-1 text-sm font-semibold text-ink">{proof.caption}</p>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {item && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={item.alt}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActive(null)}
              className="absolute inset-0 cursor-zoom-out bg-charcoal/85 backdrop-blur-md"
            />
            <motion.div
              key={active}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease: EASE_SETTLE }}
              className="relative w-full max-w-2xl rounded-3xl bg-paper p-3 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.7)] sm:p-4"
            >
              <button
                type="button"
                autoFocus
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-paper-raised text-ink shadow-lg transition-transform hover:scale-110"
              >
                <X size={18} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} className="max-h-[78vh] w-full rounded-2xl object-contain" />
              <p className="mt-3 px-1 text-xs text-ink-muted">{item.caption} · Use ← → to browse.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
