# Claro — warm bone-white direction

Preview: http://127.0.0.1:4387/claro/ (run `npm run dev` in the project root)
Intended public route: https://coding-mtl.github.io/dr-arturo-moran-propuestas/claro/

Built October 20, 2026 as an independent direction next to `new-design/`, `movimiento/` and `nocturno/`. None of them was modified.

## Direction

Warm bone and paper neutrals (#f5f1ea / #fbf9f5 / #eae3d7) with near-black ink text and the brand navy (#2b4362) as the single accent; pale blue (#b9ceff) only as a soft highlight surface. Tight-tracked Plus Jakarta Sans for everything, Instrument Serif italic for one emotional phrase per heading. Floating glass pill navigation, large rounded panels (32px), a bento strip of facts, an insurer marquee, an interactive "¿Dónde te duele?" joint selector (accessible tabs), a sticky scroll story where the photo changes with each care step, a bento biography grid, rounded video cards, a cost-transparency checklist, article cards, card-style FAQ and a navy closing panel.

## Refero research

Reviewed on https://styles.refero.design/:

- Oura Ring `9decde51` — warm oatmeal canvas, grotesque + editorial italic serif, single muted accent, pill buttons, hairlines.
- Alden `b6f25b86` — serene clinic on warm parchment; a single highlighted word per headline, color as punctuation.
- Kinfolk `ac9b040e` — bone-white editorial restraint, photography as the exhibit.
- Ease Health / Function — soft healthcare surfaces and photo scale (also seen by earlier sessions).

Principles only; no identities, assets, palettes or copy were copied.

## Content and facts

Same fact set as the other proposals: 20+ years, certification by the Consejo de Ortopedia y Traumatología de México, knee/shoulder arthroscopy subspecialty, training in cartilage/joint wear and knee/hip prostheses, OCA Medical Center consultorio 204, existing WhatsApp/phone/map/service/YouTube destinations, 8 insurer marks. Cédulas from the doctor's published graphic. Joint-selector condition chips come from the doctor's own article topics (menisco, LCA, cartílago, manguito rotador, luxaciones, labrum, artrosis, prótesis). The journey's first photo is a stock consultation image already used on the live site; swap it for a real consultation photo when available. Cost section paraphrases the doctor's two price articles; no amounts invented.

Fonts load from Google Fonts (Plus Jakarta Sans, Instrument Serif).

## Implementation

Static HTML/CSS/JS. Motion: blur-in hero type, panel entrance, floating credential chips, scroll-driven hero parallax (`animation-timeline`, with fallback), marquee, segmented-control thumb slide and panel swap, sticky story image cross-fade driven by IntersectionObserver, once-only reveals with staggered bento tiles, count-up, hover lifts, animated FAQ, click-to-load YouTube dialog. Tabs support click, Left/Right/Home/End. Reduced motion disables effects. Without JavaScript the first joint panel, all steps, native FAQ and direct video links remain available.

## Verification

`scripts/capture-design.mjs claro <out>` and `scripts/functional-check.mjs claro`. Widths 320/390/768/1440/1920: zero document overflow (the marquee track is intentionally wider inside an overflow-hidden wrapper), no broken images, one H1, anchors valid, WhatsApp preserved, fonts loaded. Functional: mobile menu open/Escape/focus return, mobile CTA bar, FAQ, video dialog, tabs (click + arrow keys + aria-selected), sticky story step/image/counter sync, reduced motion, JS disabled. Live check in Chrome at 1920px including the Hombro tab. Remote YouTube playback not verified. Page keeps `noindex`.

WebKit (Safari engine, Playwright) at 320/390/1440: no page errors, zero overflow, menu/FAQ/dialog/tabs work; captures via `scripts/verify-webkit.cjs claro <out>`.
