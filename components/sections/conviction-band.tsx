"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Grain } from "@/components/ui/grain";

const COPY =
  "Germany is closer than you think. Your plan becomes simple once you know the right next step. Most students just need someone to lay out that path clearly.";
const WORDS = COPY.split(" ");
const GOLD_WORDS = new Set(["closer", "simple", "clearly."]);

function Word({
  word,
  range,
  progress,
  reduceMotion,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const highlighted = GOLD_WORDS.has(word.toLowerCase());
  return (
    <span className="relative mr-[0.28em] inline-block">
      <motion.span
        style={{ opacity: reduceMotion ? 1 : opacity }}
        className={highlighted ? "text-gold" : "text-paper"}
      >
        {word}
      </motion.span>
    </span>
  );
}

// Circular text badge that slowly rotates around an arrow — doubles as the section's CTA.
function SpinBadge() {
  return (
    <Link
      href="/contact"
      aria-label="Check my profile"
      className="group relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full sm:h-48 sm:w-48"
    >
      <svg viewBox="0 0 200 200" aria-hidden className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="badge-circle" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <text fill="var(--color-paper)" fontSize="15" fontWeight="700" letterSpacing="5.2">
          <textPath href="#badge-circle">CHECK MY PROFILE ✦ FREE ASSESSMENT ✦ </textPath>
        </text>
      </svg>
      <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brick text-paper shadow-[0_18px_40px_-10px_rgba(179,36,28,0.7)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 sm:h-24 sm:w-24">
        <ArrowUpRight
          size={32}
          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45"
        />
      </span>
    </Link>
  );
}

export function ConvictionBand() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });

  return (
    <section className="relative overflow-hidden bg-charcoal py-20 sm:py-36">
      <Grain opacity={0.05} blend="soft-light" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="aurora-a absolute -right-20 top-0 h-[28rem] w-[28rem] rounded-full bg-gold/15 blur-[110px]" />
        <div className="aurora-b absolute -left-24 bottom-0 h-[24rem] w-[24rem] rounded-full bg-brick/20 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <p className="text-xs font-bold uppercase tracking-wide text-gold">Our Belief</p>

        <div className="mt-8 flex flex-col gap-14 lg:flex-row lg:items-end lg:justify-between">
          <div ref={ref} className="max-w-4xl">
            <p className="font-display text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.1] tracking-tight">
              <span className="sr-only">{COPY}</span>
              <span aria-hidden>
                {WORDS.map((word, index) => {
                  const start = index / WORDS.length;
                  const end = start + 1.6 / WORDS.length;
                  return (
                    <Word
                      key={`${word}-${index}`}
                      word={word}
                      range={[start, Math.min(end, 1)]}
                      progress={scrollYProgress}
                      reduceMotion={reduceMotion}
                    />
                  );
                })}
              </span>
            </p>
          </div>

          <SpinBadge />
        </div>
      </div>
    </section>
  );
}
