"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { StoryPlate } from "@/components/ui/story-plate";
import { STORIES } from "@/lib/data/stories";
import { EASE_SETTLE } from "@/lib/motion";

const AUTOPLAY_MS = 6000;

export function SuccessTeaser() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const story = STORIES[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + STORIES.length) % STORIES.length);
  }

  return (
    <section
      className="relative overflow-hidden bg-paper-raised py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* A light travels the route, left to right, on a loop — the journey doesn't stop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-12 hidden h-px overflow-hidden bg-line sm:block"
      >
        <motion.div
          className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-brick/70 to-transparent"
          initial={{ left: "-14%" }}
          animate={reduceMotion ? undefined : { left: "114%" }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 4, repeat: Infinity, repeatDelay: 1.6, ease: "linear" }
          }
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Student Stories" title="Real Journeys. Real Outcomes." />

        <Reveal delay={0.1} className="mt-14">
          <div className="grid overflow-hidden rounded-[2rem] border border-line bg-paper shadow-[0_30px_80px_-30px_rgba(26,22,19,0.2)] lg:grid-cols-[0.8fr_1.2fr]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`plate-${index}`}
                className="group h-64 lg:h-full"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE_SETTLE }}
              >
                <StoryPlate story={story} className="h-full" />
              </motion.div>
            </AnimatePresence>

            <div className="relative flex flex-col justify-between p-8 sm:p-10 lg:p-12">
              <span
                aria-hidden
                className="pointer-events-none absolute right-8 top-2 select-none font-display text-8xl font-semibold text-brick/[0.07] sm:text-9xl"
              >
                &rdquo;
              </span>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`quote-${index}`}
                  className="relative"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE_SETTLE }}
                >
                  <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-charcoal font-display text-sm font-semibold text-paper">
                      {story.initials}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink">{story.name}</p>
                      <p className="text-xs text-ink-muted">{story.program}</p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-bold text-ink">
                      <BadgeCheck size={13} className="text-gold" /> {story.badge}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Autoplay timer — restarts whenever the story changes, freezes on hover */}
              <div className="relative mt-8 h-[3px] overflow-hidden rounded-full bg-line">
                {!reduceMotion && (
                  <div
                    key={`progress-${index}`}
                    onAnimationEnd={() => go(1)}
                    className="h-full origin-left rounded-full bg-gradient-to-r from-brick to-gold"
                    style={{
                      animation: `progress-fill ${AUTOPLAY_MS}ms linear forwards`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                )}
              </div>

              <div className="relative mt-5 flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {STORIES.map((s, i) => (
                    <button
                      key={s.initials}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Show ${s.name}'s story`}
                      aria-current={i === index}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                        i === index
                          ? "scale-110 border-brick text-brick"
                          : "border-line text-ink-muted/60 hover:border-ink-muted"
                      }`}
                    >
                      {s.initials}
                    </button>
                  ))}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous story"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-paper-raised"
                  >
                    <ArrowLeft size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next story"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-paper-raised"
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 flex justify-center">
            <LinkButton href="/success-stories" variant="primary">
              View All Success Stories <ArrowRight size={16} />
            </LinkButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
