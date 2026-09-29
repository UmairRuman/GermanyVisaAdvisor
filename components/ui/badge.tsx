import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide",
        tone === "dark"
          ? "bg-charcoal text-paper shadow-[0_6px_16px_-6px_rgba(23,19,16,0.5)]"
          : "border border-line bg-paper text-ink-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
