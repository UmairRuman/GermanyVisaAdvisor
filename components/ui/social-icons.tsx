import { MessageCircle } from "lucide-react";
import type { SocialId } from "@/lib/site";

// lucide-react no longer ships brand icons, so these are small hand-drawn glyphs.
type IconProps = { size?: number; className?: string };

function Facebook({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 21v-8h2.7l.5-3.2h-3.2V7.9c0-.9.4-1.7 1.8-1.7h1.5V3.4c-.3 0-1.3-.2-2.4-.2-2.6 0-4.2 1.5-4.2 4.3v2.3H7.5V13h2.7v8z" />
    </svg>
  );
}

function Instagram({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTube({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z" />
    </svg>
  );
}

export function SocialIcon({ id, size = 18, className }: { id: SocialId } & IconProps) {
  if (id === "facebook") return <Facebook size={size} className={className} />;
  if (id === "instagram") return <Instagram size={size} className={className} />;
  if (id === "youtube") return <YouTube size={size} className={className} />;
  return <MessageCircle size={size} className={className} aria-hidden />;
}
