// Placeholder until the client confirms their real domain (see docs/04-tech-stack.md,
// open question #6). "germanychalo.com" is assumed since it matches the brand name — set
// NEXT_PUBLIC_SITE_URL to override once a real domain is confirmed and connected.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://germanychalo.com";

export const SITE_NAME = "GermanyChalo";

export const YOUTUBE_URL = "https://www.youtube.com/@Mr_Shahid_Ali_Pak";

export type SocialId = "facebook" | "whatsapp" | "instagram" | "youtube";

// The client's official accounts, shown in the footer, About and Contact pages.
export const SOCIAL_LINKS: { id: SocialId; label: string; cta: string; href: string }[] = [
  { id: "facebook", label: "Facebook", cta: "Follow our page", href: "https://www.facebook.com/share/1MbFdc4pk8/" },
  { id: "whatsapp", label: "WhatsApp Channel", cta: "Join the channel", href: "https://whatsapp.com/channel/0029VbDmffEAYlUFA2z0AT0W" },
  { id: "instagram", label: "Instagram", cta: "Follow on Instagram", href: "https://www.instagram.com/ch_shahid_alii" },
  { id: "youtube", label: "YouTube", cta: "Watch free guides", href: YOUTUBE_URL },
];

// Walkthrough video: how to open a blocked account (opened from the calculator).
export const BLOCKED_ACCOUNT_VIDEO_URL = "https://youtu.be/5M8bFwaeKn8";

// TODO: client to confirm — shown on the hero card and the About page.
export const STUDENTS_GUIDED = 100;

export const SITE_DESCRIPTION =
  "From university shortlisting to visa preparation — clear, honest guidance for Pakistani students planning to study in Germany.";
