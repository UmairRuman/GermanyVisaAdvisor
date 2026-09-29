# GermanyChalo

Marketing / lead-generation website for GermanyChalo, a Germany study-abroad & visa advisory
business. Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and Motion.

**Start here:** [`docs/`](./docs) — project brief, design direction, sitemap, tech stack, and
the phased execution plan this build follows.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `app/` — routes (one per page in `docs/03-sitemap-content.md`)
- `components/` — shared UI (`site-header`, `site-footer`, `whatsapp-float`, `reveal`, …)
- `components/sections/` — page-specific composed sections (e.g. `hero`, `journey`)
- `lib/` — shared constants (`motion.ts` easing/duration scale, `nav.ts` nav links)
- `docs/` — planning docs; kept up to date as decisions change

## Status

Phase 0 (foundations) is in progress — see `docs/05-execution-plan.md` for what's built vs.
next. Only the homepage hero and "journey" section are fully designed so far; every other
route is a styled placeholder pointing back at the execution plan.
