import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal className={cn(align === "center" ? "mx-auto max-w-xl text-center" : "max-w-xl", className)}>
      <p
        className={cn(
          "inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brick",
          align === "center" ? "justify-center" : "",
        )}
      >
        <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-brick/60" />
        {eyebrow}
        <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-brick/60" />
      </p>
      <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-ink-muted">{description}</p>}
    </Reveal>
  );
}
