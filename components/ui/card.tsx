import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const base = "rounded-3xl border border-line bg-paper-raised p-7 shadow-[0_1px_2px_rgba(26,22,19,0.04)]";

export function Card({
  children,
  className,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  // Interactive cards lift on hover and pick up a cursor-following glow.
  if (hover) {
    return (
      <SpotlightCard
        className={cn(
          base,
          "overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-brick/25 hover:shadow-[0_24px_48px_-24px_rgba(26,22,19,0.22)]",
          className,
        )}
      >
        {children}
      </SpotlightCard>
    );
  }

  return <div className={cn(base, className)}>{children}</div>;
}
