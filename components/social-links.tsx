import { ArrowUpRight } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/site";
import { SocialIcon } from "@/components/ui/social-icons";
import { cn } from "@/lib/cn";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** A row of round icon buttons. `tone="dark"` is for the charcoal footer. */
export function SocialIconRow({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {SOCIAL_LINKS.map((social) => (
        <li key={social.id}>
          <a
            href={social.href}
            {...external}
            aria-label={`${social.label} — ${social.cta}`}
            title={social.label}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1",
              tone === "dark"
                ? "border-paper/20 text-paper/80 hover:border-paper hover:bg-paper hover:text-charcoal"
                : "border-line bg-paper-raised text-ink hover:border-brick hover:bg-brick hover:text-paper",
            )}
          >
            <SocialIcon id={social.id} size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Larger tiles with a call to action, for the About page. */
export function SocialCards({ className }: { className?: string }) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {SOCIAL_LINKS.map((social) => (
        <li key={social.id}>
          <a
            href={social.href}
            {...external}
            className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-paper p-5 transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-brick/30 hover:shadow-[0_20px_40px_-24px_rgba(26,22,19,0.3)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
              <SocialIcon id={social.id} size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-base font-semibold text-ink">{social.label}</span>
              <span className="block text-xs text-ink-muted">{social.cta}</span>
            </span>
            <ArrowUpRight size={16} className="shrink-0 text-ink-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brick" />
          </a>
        </li>
      ))}
    </ul>
  );
}
