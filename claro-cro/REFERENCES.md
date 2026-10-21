# Claro CRO — working version for deployment

Lineage: `claro/` (Pat's pick) → `claro-base/` (Lumen palette + five Lumen sections) → `claro-cro/` (conversion copy + mobile polish). The two parents stay frozen for comparison.

## What this version adds
- Patient-first copy: symptom sentences per joint, plain-language chips, "con o sin cirugía", reassurance lines, journey steps written from the patient's side, a paragraph explaining what certification/subspecialty mean.
- Real social proof from the doctor's Doctoralia profile (fetched 2026-10-20): 127 opinions, $1,000 MXN consultation (first and follow-up, without insurance), Certificado de excelencia 2018–2020, three verbatim April-2023 reviews. Source: https://www.doctoralia.com.mx/arturo-moran-vidaurri
- One CTA wording everywhere ("Agenda tu valoración por WhatsApp", short label on phones) with WhatsApp icon and pre-filled messages; joint-specific messages from the selector. Mobile sticky bar: call button + WhatsApp.
- New sections/items: Opiniones, price card in Costos, cédula verification link (gob.mx/cedulaprofesional), five new FAQ answers, hours line, meniscus-symptoms article.
- Mobile: tighter section rhythm, horizontal swipe carousels for articles and reviews, 4-column insurer grid, landscape icon tile, proof list, 44px+ targets, scroll-padding for anchors.
- Deploy readiness: Open Graph tags, Physician JSON-LD, preload of the hero portrait, async decoding on lazy images. `noindex` is still ON (proposal); remove the robots meta before the real launch.

## Items the doctor must confirm (yellow tags on the page)
1. The quote in his voice (draft).
2. The exact title of each video.
3. Parking at OCA Medical Center.
4. Clinic hours (placeholder: lunes a viernes 9:00–19:00).
Also confirm the cédulas, that he sees patients without insurance, and that the $1,000 fee is current.

## Verification (2026-10-20)
Chrome 320/390/1440 + WebKit 320/390/1440: zero overflow, no broken images, fonts loaded, one H1, anchors valid, all WhatsApp links point to 5218122010912. Functional: menu open/Escape/focus, mobile CTA bar, FAQ, tabs + arrow keys, journey sync, video dialog, reduced motion, JS-off (all three joint panels visible). gitleaks clean. Remote YouTube playback not verified.

## Mobile audit pass (October 21, 2026)

A section-by-section visual audit at 390px found five defects and ten structure/polish issues; all applied here. The pre-audit version is frozen as `proposals/claro-cro-v1/` for comparison. Desktop (>1080px) is unchanged except for two copy edits (shorter costs paragraph) and reordered condition chips.

Phone (≤720px) changes:
- Hero: `.hero-copy` uses `display: contents` so the order is chip → H1 → portrait → short lede (`.lede-short`) → one WhatsApp button → proof list. Portrait is square; the two credential chips sit in a row under it (no overlap). Info tiles and the ghost button are hidden.
- Insurers: label + marquee + note replaced by one `.insurers-compact` card linking to Costos.
- Especialidades: tab bar is sticky under the header; joint icon becomes a 60px tile beside the heading; chips reordered and tightened to three rows; reassurance bullet aligned.
- Tu camino: photo stack and counter hidden; steps become a vertical timeline (`.jstep::before`). Counter is also hidden on tablets, where the stack is not sticky.
- CTA hygiene: the in-section "Agenda tu valoración" buttons in Camino and El doctor are hidden on phones (`.hide-m`) and replaced by context links (`.ctx-link`); the sticky bar hides while the Contacto buttons are on screen (`.is-suppressed`).
- El doctor: second paragraph inside `details.more`, closed by JS on phones ("Leer más sobre su formación"); the four credential cards merge into one card.
- Opiniones: ice full-bleed band, swipe row snaps to the gutter, JS-generated position dots (also under Artículos).
- Videos: two 9:16 tiles side by side, centered round play button, label hidden.
- Costos: price-article links as a divided list; paragraph shortened.
- Menu: fixed `.menu-scrim` with blur behind the sheet, body scroll locked, focus moves to the sheet (no visible ring on tap).
- Type and rhythm: H2 32px, body 16px, floor 13px for small text (chips 12px), one 48px section padding.
- Tap targets: inline links in proof list and FAQ bodies get `padding-block: 12px`; no interactive element under 40px.

Result at 390px: 11,048px tall (was 13,210), doctor's face in the first screen, zero overflow at 320/390/768/1440 in Chrome and 320/390/1440 in WebKit; menu, tabs, FAQ, dialog, reduced-motion and no-JS checks pass; gitleaks clean.

Independent Codex review (gpt-5.6-terra, read-only, Oct 21) found four issues, all fixed the same day: the sticky bar was permanently `aria-hidden` (now exposed exactly while shown), the collapsed bio paragraph could stay closed after rotating to a wider layout (the summary is now visible whenever closed, and a media-query listener reopens it), the open menu did not trap focus (now `role="dialog"`, `aria-modal`, Tab loop, `inert` on main/footer/bar), and carousel dots used an intersection threshold that could mark the wrong card on tablets (now derived from scroll position). Codex found no desktop cascade breakage, no JS errors, no iOS sticky/backdrop-filter conflicts and no no-JS content loss.
