# Sitemap & Content Plan

## Key structural change from the client's draft
The draft is a **single HTML file faking navigation** with JS (`showPage()` toggles
`display:none`/`.active`, `#hash` in the URL). That means: no real per-page URLs for search
engines, no per-page `<title>`/meta description, everything downloaded on first load.

For a lead-gen business that depends on organic search for terms like *"study in Germany
consultant Pakistan"* or *"Germany student visa guidance"*, **real routes are a meaningful
business upgrade**, not just a technical nicety — each page can be individually indexed and
optimized. v1 ships as real Next.js routes, one per page below.

## Routes

| Route | Purpose | Primary CTA |
|---|---|---|
| `/` | Convert cold traffic; summarize everything; funnel to assessment | Free Assessment |
| `/study-in-germany` | Educate: why Germany, degree paths, intakes, costs, language, student life | Explore Services |
| `/services` | Full service list, positioned as steps of one guided process, not a menu | Free Assessment |
| `/universities` | Searchable/filterable static list of partner-style universities | Explore / Contact |
| `/success-stories` | Proof: story cards + redacted visa wall | WhatsApp |
| `/resources` | Guides + FAQ (SEO-friendly long-tail content) | Free Assessment |
| `/about` | Trust: mission, approach, (later) team/credentials | Contact |
| `/contact` | Full assessment form + WhatsApp + email/office | Submit |

`/study-in-germany`, `/resources`, and `/universities` are the three routes with the most
organic-search upside and should get the most on-page content depth over time.

## Section-by-section content (kept from draft, re-scoped/elevated)

### Home
1. Hero — headline, subhead, dual CTA (Assessment / WhatsApp), trust strip, route-line visual
2. "How it works" — 4-step journey as a horizontal path, not 4 identical cards
3. Mid-page conviction band (dark/`charcoal`) — one confident line + CTA
4. Services teaser — 3 pillars (University, Visa, Pre-Departure), link to full `/services`
5. Success stories teaser — 2 real/placeholder stories, link to `/success-stories`
6. Free profile assessment — inline embedded form (same fields as draft)

### Study in Germany
- Why Germany (quality, English-taught programs, career exposure)
- Study paths: Bachelor / Master / PhD
- What to understand: public vs private, intakes, language requirements, costs, student
  life/accommodation — kept as a feature list, re-skinned

### Services
Full 9-service list from the draft (university shortlisting → application → documents → visa
→ blocked account → insurance → accommodation → pre-departure → arrival), reframed as
sequential stages of one guided journey rather than an unordered grid.

### Universities
Search + degree filter + list rows (kept structurally from draft). Content is clearly marked
as illustrative until the client supplies its real partner list.

### Success Stories
- Story grid (name, program, outcome)
- Visa wall — redacted proof cards. **Requires explicit student consent per draft's own
  note** — flagged again here since it's a real privacy obligation, not just a design
  placeholder.

### Resources
- Guide cards (visa checklist, blocked account, intake guide, language requirements,
  accommodation, pre-departure)
- FAQ accordion (same 5 questions as draft, expandable later)

### About
- Mission statement
- Approach (clear guidance / student-focused / transparent process)
- (Future) team bios, certifications/affiliations — strong trust lever for this category,
  worth pushing the client for real content here

### Contact
- WhatsApp / Email / Office cards
- Full assessment form (superset of the homepage's shorter version)

## Global elements
- Sticky header, real `<nav>` links (not JS page-swap buttons) — same 8 destinations
- Floating WhatsApp button, all pages
- Footer with real business info once client provides it
