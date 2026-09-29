import { BadgeCheck } from "lucide-react";
import { Grain } from "@/components/ui/grain";
import type { Story } from "@/lib/data/stories";

// Initials stand in for a photo until real, consented student photography exists (see
// lib/data/stories.ts) — this gives that placeholder a tactile, art-directed duotone+grain
// treatment instead of a flat gradient block (docs/02-design-direction.md, "Imagery").
export function StoryPlate({ story, className = "h-40" }: { story: Story; className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background:
          "radial-gradient(circle at 30% 20%, rgba(185,138,46,0.22), transparent 55%), linear-gradient(135deg, rgba(179,36,28,0.16), rgba(23,19,16,0.85))",
      }}
    >
      <Grain opacity={0.16} blend="soft-light" />
      <svg
        aria-hidden
        viewBox="0 0 160 160"
        className="pointer-events-none absolute h-40 w-40 text-paper/15 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-6"
      >
        <circle cx="80" cy="80" r="76" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 7" />
        <circle cx="80" cy="80" r="56" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="relative font-display text-4xl font-semibold tracking-tight text-paper/90 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
        {story.initials}
      </span>
      {/* Rotating visa-stamp seal */}
      <svg
        aria-hidden
        viewBox="0 0 120 120"
        className="spin-slow pointer-events-none absolute -bottom-5 -right-5 h-28 w-28 text-gold/80 sm:h-32 sm:w-32"
      >
        <defs>
          <path id="stamp-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <text fill="currentColor" fontSize="10.5" fontWeight="700" letterSpacing="3.4">
          <textPath href="#stamp-circle">GERMANY ✦ STUDENT VISA ✦ GUIDED ✦ </textPath>
        </text>
      </svg>
      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-charcoal/90 px-3 py-1.5 text-xs font-bold text-paper shadow-[0_6px_16px_-6px_rgba(23,19,16,0.6)]">
        <BadgeCheck size={13} className="text-gold" /> {story.badge}
      </span>
    </div>
  );
}
