# Tech Stack

## Decision
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)**, TypeScript | Real routes/SEO per page (see `03-sitemap-content.md`), file-based routing matches the 8-page sitemap directly, easy Vercel deploy, image optimization built in |
| Styling | **Tailwind CSS v4** | Fast to build a consistent design-token system (`docs/02-design-direction.md` colors/type/spacing map directly to `@theme` tokens); avoids hand-rolled CSS drift across 8 pages |
| Motion | **Framer Motion (`motion` package)** | `whileInView` scroll reveals, shared easing/duration scale, SVG path-draw for the route motif — all first-class |
| Icons | **lucide-react** | Consistent line-icon set, replaces emoji |
| Forms | **React Hook Form + Zod** | Assessment form has real validation needs (WhatsApp number format, required fields) beyond what plain HTML forms handle well |
| Fonts | **next/font/google** — Fraunces (display) + Plus Jakarta Sans (body/UI) | Self-hosted automatically by Next.js (no layout-shift render-blocking Google Fonts `<link>`), matches design direction |
| Hosting target | **Vercel** (assumed — cheapest path for Next.js; revisit if client has an existing host) | Zero-config for this stack |
| Form backend | **Not yet decided** — placeholder API route (`/api/assessment`) that will forward submissions to email (e.g. Resend) and/or a WhatsApp deep link, until client specifies where leads should actually land (CRM? Google Sheet? plain email?) | Don't build a backend the client didn't ask for; keep the seam small and swappable |

## Explicitly not doing (for v1)
- No CMS (Sanity/Contentful/etc.) — content lives in code/JSON until the client needs
  non-developer editing.
- No database — university list, FAQs, success stories are static data files
  (`lib/data/*.ts`) editable directly.
- No auth, no payments, no application-tracking portal.

## Repo conventions
- `app/` — routes, one folder per page in `03-sitemap-content.md`
- `components/` — shared UI (Button, Nav, Footer, SectionHeading, etc.)
- `components/sections/` — page-specific composed sections
- `lib/data/` — static content (universities, stories, FAQs, services)
- `lib/motion.ts` — shared easing/duration constants so every animation pulls from one place
- `public/` — static assets, placeholder images clearly named `placeholder-*`
- `docs/` — this planning set — kept up to date as decisions change

## Open questions for the client (not blocking setup, but blocking a "real" launch)
1. Real WhatsApp number, email, office address (if any)?
2. Where should assessment-form submissions actually go (email inbox? WhatsApp Business?
   a spreadsheet? an existing CRM)?
3. Any existing brand assets (logo, color guidelines) beyond what's in the AI draft?
4. Real success stories + do we have signed student consent to publish redacted visa docs?
5. Real partner/target university list, or is "Universities" meant to stay illustrative?
6. Domain + hosting preference, if the client already owns `germanychalo.com` or similar.
