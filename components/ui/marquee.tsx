import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Two identical copies side by side + translateX(-50%) = a seamless infinite loop.
// Pure CSS (no JS), pauses on hover, and stops for prefers-reduced-motion.
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  className,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("marquee flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]", className)}>
      <div
        className={cn("marquee-track flex shrink-0 items-center", reverse && "marquee-reverse")}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
