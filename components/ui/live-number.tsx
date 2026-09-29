"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";

// A number that eases to each new value as inputs change (unlike AnimatedNumber, which only
// counts up once on scroll). Writes straight to the DOM node, so it never re-renders React.
export function LiveNumber({
  value,
  format = (n) => Math.round(n).toLocaleString("en-US"),
  className,
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const render = (n: number) => {
      node.textContent = format(n);
    };
    if (reduceMotion) {
      motionValue.set(value);
      render(value);
      return;
    }
    const unsubscribe = motionValue.on("change", render);
    const controls = animate(motionValue, value, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    return () => {
      unsubscribe();
      controls.stop();
    };
    // `format` is intentionally excluded: callers pass inline functions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduceMotion, motionValue]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
