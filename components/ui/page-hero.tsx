"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/reveal";
import { Grain } from "@/components/ui/grain";
import { EASE_SETTLE } from "@/lib/motion";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  /** Optional background photo — switches the hero to a dark, photo-backed treatment. */
  image?: { src: string; alt: string };
}) {
  const dark = Boolean(image);
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className={`relative isolate overflow-hidden px-6 pt-20 pb-24 text-center sm:pt-28 sm:pb-32 ${
        dark ? "bg-charcoal" : "bg-gradient-to-b from-paper-raised to-paper"
      }`}
    >
      {image ? (
        <>
          <motion.div
            className="absolute inset-x-0 -bottom-[18%] -top-[6%] -z-20"
            style={{ y: reduceMotion ? 0 : imageY }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-45"
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/75 via-charcoal/60 to-charcoal" />
          <Grain className="-z-10" opacity={0.05} blend="soft-light" />
        </>
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="aurora-a absolute -left-20 -top-24 h-[26rem] w-[26rem] rounded-full bg-gold/20 blur-[100px]" />
          <div className="aurora-b absolute -right-16 top-10 h-[22rem] w-[22rem] rounded-full bg-brick/12 blur-[100px]" />
          <div className="dot-grid absolute inset-0 text-ink/[0.07] [mask-image:radial-gradient(ellipse_at_50%_0%,#000,transparent_70%)]" />
        </div>
      )}

      <svg
        aria-hidden
        viewBox="0 0 400 180"
        className={`pointer-events-none absolute -right-16 -top-6 -z-10 h-56 w-auto sm:h-72 ${
          dark ? "opacity-[0.2]" : "opacity-[0.1]"
        }`}
      >
        <motion.path
          d="M30,140 C130,40 260,170 370,40"
          fill="none"
          stroke={dark ? "var(--color-paper)" : "var(--color-ink)"}
          strokeWidth={2.5}
          strokeDasharray="7 9"
          strokeLinecap="round"
          initial={{ pathLength: reduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: EASE_SETTLE, delay: 0.3 }}
        />
      </svg>

      <motion.div style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}>
        <Reveal className="relative mx-auto max-w-2xl">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide backdrop-blur ${
              dark ? "border-paper/20 bg-paper/10 text-gold" : "border-line bg-paper-raised/80 text-brick"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dark ? "bg-gold/60" : "bg-brick/50"}`} />
              <span className={`relative h-2 w-2 rounded-full ${dark ? "bg-gold" : "bg-brick"}`} />
            </span>
            {eyebrow}
          </span>
          <h1
            className={`mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl ${
              dark ? "text-paper" : "text-ink"
            }`}
          >
            {title}
          </h1>
          <p className={`mx-auto mt-5 max-w-xl text-lg leading-relaxed ${dark ? "text-paper/70" : "text-ink-muted"}`}>
            {description}
          </p>
        </Reveal>
      </motion.div>
    </section>
  );
}
