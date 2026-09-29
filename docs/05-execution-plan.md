# Execution Plan

Phased so the client can see and react to something early, rather than waiting for all 8
pages at once.

## Phase 0 — Foundations ✅
- [x] Planning docs (this folder)
- [x] Next.js 16 + TypeScript + Tailwind v4 scaffold
- [x] Design tokens wired into Tailwind `@theme` (colors, fonts from `02-design-direction.md`)
- [x] Fonts wired via `next/font` (Fraunces + Plus Jakarta Sans)
- [x] Base layout shell (header/nav/footer/WhatsApp float) with real routes stubbed for all
      8 pages
- [x] Hero live on `/` — **client checkpoint reached**, direction approved, proceeded to
      Phase 2

## Phase 1 — Design system ✅
- [x] Shared motion helpers (`lib/motion.ts`, `components/reveal.tsx`) — one easing curve, one
      duration scale, reveal wrapper used everywhere instead of ad hoc animation props
- [x] `lib/whatsapp.ts` — single source of truth for the WhatsApp deep link
- [x] `components/ui/`: `Button`/`LinkButton`, `Card`, `Badge`, `SectionHeading`, `Field` +
      `fieldInputClass`, `PageHero`, `Accordion` — homepage sections refactored to use them
- [x] `lib/data/`: `services.ts`, `universities.ts`, `faqs.ts`, `stories.ts` — static content
      shared between the homepage teasers and their full pages, one source of truth each

## Phase 2 — Homepage build-out ✅
Hero → journey/path timeline → conviction band → services teaser → success stories teaser →
assessment form → final CTA. All seven sections are live on `/`, verified via `next build`,
`eslint`, and a dev-server render check.

Notable decisions made while building:
- Success-story cards use initials/monograms, not stock or AI-generated photos — avoids
  presenting a fabricated person as a real student before real, consented stories exist.
- The assessment form has no backend yet (none was chosen — see `04-tech-stack.md`), so
  submitting it opens WhatsApp with the profile pre-filled as plain text. This is a real,
  working conversion path today, not a placeholder — swap it for a CRM/email integration
  later without changing the UI.

## Phase 3 — Secondary pages ✅
All 7 built, in priority order, replacing the earlier "coming soon" stubs. Verified via
`next build`, `eslint`, and a dev-server request against every route.
1. [x] `/contact` — info cards (WhatsApp/email/office, all placeholders) + full assessment
       form (adds a Message field over the homepage's shorter version)
2. [x] `/services` — all 9 services from the client's draft, as cards
3. [x] `/study-in-germany` — why Germany, Bachelor/Master/PhD paths, what-to-understand list
4. [x] `/success-stories` — story grid + redacted visa wall, both pulling from
       `lib/data/stories.ts`
5. [x] `/resources` — 6 guide cards + FAQ accordion (`lib/data/faqs.ts`)
6. [x] `/universities` — real client-side search + **working** degree filter (each university
       now carries a `degrees` list so the filter actually does something, rather than a
       decorative dropdown)
7. [x] `/about` — mission + approach

The old `components/coming-soon.tsx` stub is deleted — every route now has real content.

## Phase 4 — Motion & polish pass ✅
- [x] Scroll reveals — already consistent across all pages from Phase 1/3 (one shared
      `Reveal` component, one easing curve)
- [x] `prefers-reduced-motion` — found and fixed two animations that ignored it entirely:
      the hero's SVG route-line draw (now checks `useReducedMotion`) and the WhatsApp
      button's infinite pulse (now neutralized by a global
      `@media (prefers-reduced-motion: reduce)` CSS rule that also covers hover
      transitions everywhere). The FAQ accordion's expand/collapse now skips its
      animation too.
- [x] Hover/focus audit — found a real WCAG issue: the global focus ring (brick outline)
      only has ~2.8:1 contrast against the charcoal sections (Conviction Band, Final CTA,
      Footer), under the 3:1 minimum for non-text UI contrast. Replaced it with a two-tone
      ring (`box-shadow`: paper + charcoal) that stays visible on both light and dark
      backgrounds — verified visually on both.
- [x] Added the animated stat counters (500+, 9) the design doc promised in its motion
      principles but that had shipped as static numbers — `components/ui/animated-number.tsx`
- [x] Mobile pass — actually screenshotted, not just reasoned about. Set up an isolated
      Playwright instance (in the scratch dir, not a project dependency) and captured every
      page at 390px and 1440px. No layout bugs found; two things that first looked broken
      (an empty hero region, a "faded" step icon) turned out to be the screenshot script's
      scroll timing outrunning the scroll-reveal animation, not real bugs — re-verified with
      longer settle times before ruling them out.
- [x] SEO — every page now has its own `<title>`/description (`export const metadata`);
      previously all 8 routes silently shared the root layout's metadata. `sitemap.xml`/
      `robots.txt`/OpenGraph images remain a Phase 6 item since they need a real production
      domain.

## Phase 5 — Real content & assets
- Swap placeholder copy/images for client-provided photography, logo, real success stories,
  redacted visa documents (with consent), real university list, real contact details
- Wire the assessment form's actual destination once the client answers the open question in
  `04-tech-stack.md`

## Phase 6 — QA & launch (in progress)
- [x] `sitemap.xml` / `robots.txt` — generated via `app/sitemap.ts` / `app/robots.ts`, driven
      by one route list and `lib/site.ts`'s `SITE_URL`. **`SITE_URL` is currently an assumed
      placeholder** (`https://germanychalo.com`, guessed from the brand name) — must be
      confirmed/replaced before this actually goes live, or search engines and social shares
      will point at the wrong domain.
- [x] OpenGraph/Twitter card metadata — `metadataBase`, `openGraph`, `twitter` added to the
      root layout, plus a programmatically generated branded share image
      (`app/opengraph-image.tsx`, via `next/og`) so links to the site show a real preview
      card instead of nothing. Uses Satori's default sans rather than fetching the site's
      Fraunces webfont at build time, to keep image generation dependency-free.
- [x] Cross-browser check — ran all 8 pages through Chromium, Firefox, and WebKit
      (Playwright, isolated in the scratch dir): 24/24 checks passed with no console/page
      errors and matching visual output. This substitutes for real-device testing but isn't
      identical to it (e.g. actual iOS Safari vs. Playwright's WebKit can still diverge) —
      worth a real-device spot check before a hard launch if the budget allows.
- [ ] **Deploy to Vercel (or client's chosen host), connect domain** — not started. This
      needs decisions and access only the client/user has (hosting account, whether to push
      this repo to GitHub first, the real domain). See the note in the handoff message for
      this session.
- [ ] Client walkthrough + sign-off — human step, not something this session can do.

---
**Status:** Phases 0–4 complete, Phase 6 partially complete as of 2026-09-27 (SEO
infrastructure, OG image, and cross-browser verification done; deployment and sign-off still
need the client). Phase 5 (real content/assets) is still waiting on the client entirely — no
work possible there until real photos, stories, contact details, and university data arrive.
