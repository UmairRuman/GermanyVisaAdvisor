# Design Direction

## Why the current draft doesn't work
The client's HTML preview is competent but generic in a very specific, recognizable way:
- The German flag rendered literally as gradient stripes/blocks, reused as a decorative
  motif on nearly every section (`.topbar`, `.brandmark`, `.flagline`). It reads as a
  placeholder, not a brand.
- One typeface (Inter) doing every job — headline, body, UI. No typographic hierarchy beyond
  size.
- Emoji as icons (🎓📄🛂✈️). Fast to produce, impossible to make feel premium.
- Every content block is the same shape: white rounded card, 1px border, drop shadow on
  hover. No rhythm, no asymmetry, no sense of a designer having made compositional choices.
- Pure black (#111) and pure flag-red (#dd0000) — cold, slightly aggressive, generic
  "SaaS dashboard" palette rather than something a study-abroad brand aspiring to feel warm
  and trustworthy would use.

This is the exact signature of "AI generated it in one pass." The fix isn't more sections —
it's fewer, more considered ones, with a real typographic voice, a restrained and warmer
palette, and motion that feels choreographed rather than decorative.

## Positioning
GermanyChalo should feel like **a calm, confident advisor**, not a lead-gen funnel. Emotional
core: a student's aspiration to leave home and build a future in Germany, and the anxiety of
not knowing the steps. The site's design job is to make that path feel *clear and already
walked by others* — hence leaning on a "journey" visual language (a path/route motif) instead
of generic numbered feature cards, and leaning on real success-story proof instead of generic
trust badges.

Reference territory (studied for design *language*, not copied): boutique immigration/relocation
consultancies and premium study-abroad platforms that use editorial serif headlines, warm
neutral backgrounds, and restrained single-accent color systems, rather than SaaS-dashboard
conventions (dense card grids, purple/blue gradients, emoji icons). Think "quietly confident
European travel/education brand" more than "tech startup."

## Typography
- **Display / headlines: [Fraunces](https://fonts.google.com/specimen/Fraunces)** — a
  variable serif with genuine optical/wonk character. Boutique, design-forward brands use it
  specifically because it reads as considered rather than templated; it's the single highest-
  leverage move away from the "generic AI SaaS" look. Used at large sizes, tight
  letter-spacing, optical size dialed toward its display cut.
- **Body / UI: Plus Jakarta Sans** — clean geometric sans, pairs well with Fraunces'
  playfulness without competing with it, and is distinct enough from Inter that the site
  doesn't default back to looking like every other template.
- Two weights of restraint: headlines never exceed ~3 lines; body copy stays short-form
  (this is a conversion site, not an editorial one).

## Color system (light theme)
Warm, paper-based neutrals with **one confident accent**, used deliberately rather than as
decoration everywhere:

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FAF7F1` | Primary background (warm off-white, not clinical #fff) |
| `paper-raised` | `#FFFFFF` | Cards/panels sitting on `paper` |
| `ink` | `#1A1613` | Primary text (warm near-black, not pure #000) |
| `ink-muted` | `#6B6058` | Secondary/body-muted text |
| `line` | `#E7E0D6` | Hairline borders, dividers |
| `brick` | `#B3241C` | Primary accent — CTAs, links, active states. A muted, deep red: reads "Germany" without being a literal flag color |
| `brick-dark` | `#8F1D17` | Hover/pressed state for brick |
| `gold` | `#B98A2E` | Secondary accent, used sparingly: underlines, small icon fills, highlighted words in headlines. Never as a background gradient stripe |
| `charcoal` | `#171310` | Dark-section background (warm near-black, replaces cold #111) |
| `charcoal-line` | `#2A2520` | Borders/dividers on charcoal |

Rule: **no gradients that visually reference flag stripes.** The flag connection lives in the
wordmark/favicon only, subtly, not smeared across the UI.

## Layout principles
- Generous whitespace over density. Fewer things per section, larger type, more breathing
  room than the client's draft.
- Break the "everything is an equal card" pattern: mix full-bleed image moments, offset/
  asymmetric two-column splits, and a horizontal scroll-snap timeline for the "how it works"
  step sequence instead of four identical numbered cards.
- A recurring **path/route motif** (a thin hand-drawn-style line connecting steps, stats, or
  the hero) reinforces "journey," and gives the brand a signature shape that isn't the flag.
- Section backgrounds alternate `paper` → `paper-raised` → `charcoal` deliberately to create
  rhythm, not randomly.

## Imagery
- Warm, natural photography (not sterile stock-library "students smiling at laptop"). Until
  real photography exists, placeholder images get a consistent light duotone/grain treatment
  so the whole site feels art-directed even with stock or AI-placeholder imagery.
- Redacted visa-proof "wall" (kept from client's draft — it's a genuinely good trust signal
  for this category) gets a more tactile, document-like card treatment instead of a plain
  dashed placeholder box.

## Motion principles
"Decent amount," choreographed, never gratuitous:
- One easing curve everywhere: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) — the standard
  "confident settle" curve used across considered interfaces.
- Duration scale: 150ms (micro, hover) / 400ms (element reveal) / 700ms (hero/large compositional
  moves). No duration invented ad hoc.
- Scroll-triggered reveal (fade + 12–16px rise), staggered by ~60–80ms per sibling, via
  `whileInView`.
- Hero: the path/route line draws itself in on load (SVG stroke-dashoffset animation).
- Stats animate as counting numbers when scrolled into view.
- Buttons get a subtle magnetic/scale hover, not a color-swap only.
- University/partner logos scroll as a slow infinite marquee rather than a static grid.
- Respect `prefers-reduced-motion: reduce` everywhere — reveals become instant opacity
  swaps, no exceptions.

## Icons
Replace all emoji with a single consistent line-icon set (`lucide-react`) rendered in `ink`
or `brick`, sized and stroked consistently. Emoji-as-icon is one of the most obvious
"unfinished AI draft" tells and is being removed entirely.

## Accessibility & responsiveness
- WCAG AA contrast minimum for all text/background pairs above (verify `ink-muted` on
  `paper` specifically — it passes at body-copy sizes but should stay ≥16px).
- Every interactive element keyboard-reachable with a visible focus ring in `brick`.
- Mobile-first: the hero's route-line/imagery composition needs a distinct, simpler mobile
  version, not a squeezed desktop layout.
