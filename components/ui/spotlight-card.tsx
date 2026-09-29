"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

// A card with a soft light that follows the cursor (see .spotlight in globals.css).
// Coordinates are written straight to CSS variables, so hovering never re-renders React.
export function SpotlightCard({
  children,
  className,
  color,
}: {
  children: ReactNode;
  className?: string;
  /** Any CSS color — defaults to a soft brick glow. Use a light tint on dark cards. */
  color?: string;
}) {
  return (
    <div
      className={cn("spotlight", className)}
      style={color ? ({ "--spotlight-color": color } as CSSProperties) : undefined}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }}
    >
      {children}
    </div>
  );
}
