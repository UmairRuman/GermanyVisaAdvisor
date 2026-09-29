"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_SETTLE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Props = {
  /** Plain text. Use "\n" for a forced line break. */
  text: string;
  /** Words (case/punctuation-insensitive) that receive `highlightClassName`. */
  highlight?: string[];
  highlightClassName?: string;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between each word. */
  stagger?: number;
  /** Animate on mount (hero) instead of when scrolled into view. */
  onMount?: boolean;
};

const clean = (word: string) => word.toLowerCase().replace(/[^a-z0-9]/g, "");

// Each word rises out of its own clipped line — the classic editorial headline reveal.
export function SplitText({
  text,
  highlight = [],
  highlightClassName = "text-brick",
  className,
  delay = 0,
  stagger = 0.07,
  onMount = false,
}: Props) {
  const reduceMotion = useReducedMotion();
  const highlighted = new Set(highlight.map(clean));
  const lines = text.split("\n");
  let counter = 0;

  return (
    <span className={cn("block", className)}>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} aria-hidden className="block">
          {line.split(" ").map((word, wordIndex) => {
            const order = counter++;
            return (
              <span
                key={`${word}-${wordIndex}`}
                className="inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <motion.span
                  className={cn("inline-block", highlighted.has(clean(word)) && highlightClassName)}
                  initial={reduceMotion ? false : { y: "110%", rotate: 4 }}
                  {...(onMount
                    ? { animate: { y: "0%", rotate: 0 } }
                    : { whileInView: { y: "0%", rotate: 0 }, viewport: { once: true, margin: "-80px" } })}
                  transition={{ duration: 0.8, delay: delay + order * stagger, ease: EASE_SETTLE }}
                >
                  {word}
                </motion.span>
                {" "}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
