"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Check, FileCheck2, GraduationCap, Plane, Search, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { EASE_SETTLE } from "@/lib/motion";

const STEPS: { icon: LucideIcon; title: string; description: string; outcomes: string[] }[] = [
  {
    icon: Search,
    title: "Find Your Program",
    description: "Shortlist universities and courses that genuinely fit your profile.",
    outcomes: ["Profile review", "Shortlist"],
  },
  {
    icon: FileCheck2,
    title: "Apply With Confidence",
    description: "Get hands-on support through documents, deadlines and applications.",
    outcomes: ["Document check", "Applications"],
  },
  {
    icon: GraduationCap,
    title: "Prepare Your Visa",
    description: "Understand every visa requirement clearly, before you need it.",
    outcomes: ["Visa file", "Financial proof"],
  },
  {
    icon: Plane,
    title: "Fly to Germany",
    description: "Arrive prepared, with your first weeks already planned out.",
    outcomes: ["Housing plan", "Arrival checklist"],
  },
];

function Step({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // "Reached" once the step is near the middle of the viewport — the node then lights up
  // and stays lit, so the route reads as progress made.
  const reached = useInView(ref, { once: true, margin: "0px 0px -45% 0px" });
  const Icon = step.icon;
  const isRight = index % 2 === 1;

  return (
    <div ref={ref} className="relative pl-14 md:grid md:grid-cols-2 md:gap-20 md:pl-0">
      {/* Node on the line */}
      <div className="absolute left-0 top-6 z-10 flex h-9 w-9 items-center justify-center md:left-1/2 md:-translate-x-1/2">
        <motion.span
          className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 bg-paper-raised text-xs font-bold"
          animate={{
            borderColor: reached ? "var(--color-brick)" : "var(--color-line)",
            backgroundColor: reached ? "var(--color-brick)" : "var(--color-paper-raised)",
            color: reached ? "var(--color-paper)" : "var(--color-ink-muted)",
            scale: reached ? 1 : 0.85,
          }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE_SETTLE }}
        >
          {reached ? <Check size={16} strokeWidth={3} /> : index + 1}
          {reached && !reduceMotion && (
            <span className="absolute inset-0 animate-ping rounded-full bg-brick/30 [animation-iteration-count:2]" />
          )}
        </motion.span>
      </div>

      <motion.div
        className={isRight ? "md:col-start-2" : "md:col-start-1 md:text-right"}
        initial={reduceMotion ? false : { opacity: 0, x: isRight ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.8, ease: EASE_SETTLE }}
      >
        <SpotlightCard className="group overflow-hidden rounded-3xl border border-line bg-paper p-7 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(26,22,19,0.3)]">
          {/* Oversized outlined numeral */}
          <span
            aria-hidden
            className={`text-outline pointer-events-none absolute -top-3 select-none font-display text-[7rem] font-semibold leading-none text-ink/10 transition-colors duration-500 group-hover:text-brick/30 ${
              isRight ? "right-4" : "right-4 md:left-4 md:right-auto"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className={`relative flex ${isRight ? "" : "md:justify-end"}`}>
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-charcoal to-[#241d17] text-paper shadow-[0_12px_28px_-10px_rgba(23,19,16,0.5)] ring-1 ring-inset ring-paper/10"
              whileHover={reduceMotion ? undefined : { scale: 1.1, rotate: -6 }}
              transition={{ duration: 0.3, ease: EASE_SETTLE }}
            >
              <Icon size={22} />
            </motion.div>
          </div>

          <h3 className="relative mt-5 font-display text-2xl font-semibold text-ink">{step.title}</h3>
          <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-ink-muted md:inline-block">
            {step.description}
          </p>

          <div className={`relative mt-5 flex flex-wrap gap-2 ${isRight ? "" : "md:justify-end"}`}>
            {step.outcomes.map((outcome) => (
              <span
                key={outcome}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-3 py-1 text-xs font-bold text-ink-muted"
              >
                <Check size={11} className="text-brick" /> {outcome}
              </span>
            ))}
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}

export function Journey() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 65%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const planeTop = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative overflow-hidden border-b border-line bg-paper-raised py-20 sm:py-28">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 text-ink/[0.05] [mask-image:radial-gradient(ellipse_at_50%_0%,#000,transparent_60%)]"
      />
      <div className="relative mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow="The Journey" title="A Simple Path. A Brighter Future." />

        <div ref={trackRef} className="relative mt-14 space-y-10 sm:mt-24 sm:space-y-14 md:space-y-16">
          {/* Route line: faint rail + a filled segment that grows with scroll */}
          <div aria-hidden className="absolute bottom-0 left-[17px] top-0 w-px bg-line md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            aria-hidden
            className="absolute bottom-0 left-[17px] top-0 w-[3px] origin-top -translate-x-[1px] rounded-full bg-gradient-to-b from-brick via-brick to-gold md:left-1/2 md:-translate-x-1/2"
            style={{ scaleY: reduceMotion ? 1 : progress }}
          />
          {/* The plane riding the line */}
          {!reduceMotion && (
            <motion.div
              aria-hidden
              className="absolute left-[17px] z-20 -translate-x-1/2 -translate-y-1/2 md:left-1/2"
              style={{ top: planeTop }}
            >
              <span className="flex h-8 w-8 rotate-[135deg] items-center justify-center rounded-full bg-charcoal text-gold shadow-[0_10px_24px_-6px_rgba(23,19,16,0.6)] ring-4 ring-paper-raised">
                <Plane size={14} />
              </span>
            </motion.div>
          )}

          {STEPS.map((step, index) => (
            <Step key={step.title} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
