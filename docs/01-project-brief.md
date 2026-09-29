# Project Brief — GermanyChalo

## What this is
A lead-generation marketing website for a Germany study-abroad / visa advisory business
trading as **GermanyChalo** ("Chalo" = Urdu/Hindi for "let's go"). The brand name and the
`+92` phone placeholder in the client's draft indicate the primary audience is
**Pakistani (South Asian) students** who want to study in Germany, being reached primarily
through **WhatsApp**.

## Source material
The client supplied `germanychalo-single-preview.html` — a single-file, AI-generated
prototype (fake client-side routing via `data-page` buttons, no real URLs). It is useful as
an **information-architecture and content reference**, not as a visual reference. Its design
is the generic pattern every "built with AI in an afternoon" site shares: literal red/gold/black
flag-gradient bands, Inter-only type, emoji used as icons, boxed-card-with-shadow for
everything. The client explicitly wants us to move *away* from this look while keeping the
content it captures.

## Business goal
Convert visitors into **leads** via two channels:
1. A "Free Profile Assessment" form (name, qualification, field of study, CGPA, desired
   degree, WhatsApp number) — the actual product for this business is human advisory, so the
   form's only job is to start a WhatsApp/phone conversation.
2. Direct WhatsApp click-to-chat (floating button + inline CTAs).

Everything else on the site — success stories, the visa wall, FAQs, university listings —
exists to build **trust and credibility**, which is the single biggest conversion lever for a
visa/immigration consultancy. This category is rife with scams and false promises in the
target market, so the site's job is to visibly *not* look like one of those.

## Explicit client constraints (from the request)
- Design must be **unique** — not a copy of a template, not recognizable as "made by AI."
  Should read as the work of a senior product/Figma designer.
- **Light theme.**
- Tasteful, "decent amount" of animation/motion — not gimmicky, not overloaded.
- We are free to look at comparable sites for inspiration, but the output must not resemble
  them directly.

## Assumptions made for this plan (flag/confirm with client before final content pass)
These are placeholder decisions so work can start now. Each should be confirmed later:
- No real brand logo/mark exists yet — v1 ships a typographic wordmark; a proper mark can
  follow.
- No real photography, success-story data, or redacted visa documents exist yet — v1 ships
  with clearly-labelled placeholder content, structured so real assets drop in without layout
  changes.
- No CRM/email backend has been specified — the assessment form will submit to a simple
  serverless endpoint (see `04-tech-stack.md`) that forwards to email/WhatsApp until the
  client tells us what system it should land in.
- Single language (English) for v1. Urdu/German toggle is a plausible fast-follow, not in
  scope now.
- No office address / real WhatsApp number / real email yet — placeholders marked clearly in
  code (`TODO: client to provide`).

## Non-goals for v1
- CMS / blog engine
- Multi-language i18n
- University database integration (the "Universities" page ships as a curated static list,
  same as the client's draft — a real DB is a later phase if the business needs it)
- Payment or application-tracking portal
