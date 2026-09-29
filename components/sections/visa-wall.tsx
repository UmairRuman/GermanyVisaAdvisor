"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BadgeCheck, Maximize2, X } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Grain } from "@/components/ui/grain";
import { VisaStamp } from "@/components/ui/visa-stamp";
import { EASE_SETTLE } from "@/lib/motion";
import type { Story } from "@/lib/data/stories";

// TODO: swap these placeholder documents for real, consented, redacted visa images.
function DocumentMock({ story, large = false, delay = 0 }: { story: Story; large?: boolean; delay?: number }) {
  const lines = large ? 8 : 4;
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-xl border border-line bg-paper-raised ${
        large ? "min-h-[380px] p-7" : "h-40 p-4"
      }`}
    >
      <Grain opacity={0.05} />
      <div className="relative flex items-center justify-between">
        <span className={`font-bold uppercase tracking-widest text-ink-muted/60 ${large ? "text-xs" : "text-[10px]"}`}>
          Student Visa
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 font-bold uppercase tracking-wide text-gold ${
            large ? "px-3 py-1 text-[11px]" : "px-2 py-0.5 text-[9px]"
          }`}
        >
          <BadgeCheck size={large ? 13 : 10} /> Verified
        </span>
      </div>
      <div className={`relative ${large ? "space-y-3" : "space-y-1.5"}`}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={`rounded-full bg-ink/[0.08] ${large ? "h-3" : "h-2"}`}
            style={{ width: `${[100, 80, 100, 66, 90, 74, 100, 58][i]}%` }}
          />
        ))}
      </div>
      <div className="relative flex items-end justify-between">
        <span className={`font-bold uppercase tracking-widest text-ink-muted/50 ${large ? "text-xs" : "text-[10px]"}`}>
          Redacted · {story.initials}
        </span>
        <VisaStamp delay={delay} />
      </div>
    </div>
  );
}

export function VisaWall({ stories }: { stories: Story[] }) {
  const [active, setActive] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const story = active === null ? null : stories[active];

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % stories.length));
      if (event.key === "ArrowLeft") setActive((i) => (i === null ? i : (i - 1 + stories.length) % stories.length));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, stories.length]);

  return (
    <>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stories.map((s, index) => (
          <Reveal key={s.initials} delay={index * 0.06}>
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Enlarge ${s.initials} visa document`}
              className="group block w-full rounded-2xl border border-line bg-paper p-4 text-left shadow-[0_1px_2px_rgba(26,22,19,0.04)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:!rotate-0 hover:shadow-[0_20px_40px_-20px_rgba(26,22,19,0.25)]"
              style={{ transform: `rotate(${index % 2 === 0 ? -0.6 : 0.6}deg)` }}
            >
              <div className="relative">
                <DocumentMock story={s} delay={index * 0.12} />
                <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-charcoal/0 opacity-0 transition-all duration-300 group-hover:bg-charcoal/40 group-hover:opacity-100">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink">
                    <Maximize2 size={17} />
                  </span>
                </span>
              </div>
              <p className="mt-3 font-display text-sm font-semibold text-ink">
                {s.initials} — {s.program.split(" · ")[0]}
              </p>
              <p className="text-xs text-ink-muted">{s.badge}</p>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {story && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${story.name} — ${story.badge}`}
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
              className="relative w-full max-w-xl rounded-3xl bg-paper p-5 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.7)] sm:p-7"
            >
              <button
                type="button"
                autoFocus
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper-raised text-ink shadow-lg transition-transform hover:scale-110"
              >
                <X size={18} />
              </button>
              <DocumentMock story={story} large />
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-xl font-semibold text-ink">{story.name}</p>
                  <p className="text-sm text-ink-muted">{story.program}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-bold text-ink">
                  <BadgeCheck size={13} className="text-gold" /> {story.badge}
                </span>
              </div>
              <p className="mt-3 text-xs text-ink-muted">Use ← → to browse. Sensitive details are redacted.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
