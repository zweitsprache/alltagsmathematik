# alltagsmathematik.ch — Design System

**alltagsmathematik.ch** is a Swiss learning platform with interactive activities and videos for adults who struggle with everyday numeracy. Content follows the Swiss national numeracy framework ("Orientierungsrahmen Mathematik", SBFI: https://www.sbfi.admin.ch/dam/de/sd-web/gxyAy18sCm67/orientierungsrahmen_mathematik_d.pdf). The live site (https://alltagsmathematik.ch) is currently password-protected.

**Design stance:** very consistent yet variable. Highly structured, never boring — controlled variation is built in for video/presentation title slides and campaign surfaces. Photos appear only as *content* (e.g. a receipt being read), never as decoration. Decoration = clean minimal vector illustration and icons. UI patterns follow Untitled UI conventions; icons are Lucide.

## Sources provided
- Brand SVGs: `uploads/alltagsmathematik_brandlogo_primary.svg`, `…brandmark_primary.svg`, `…brandmark_accent.svg` (styles restored in `assets/` — 40px round-cap strokes)
- Fonts: Encode Sans Semi Condensed, 9 weights (TTF, in `assets/fonts/`)
- Colors: primary `#1e2c52`, accent `#cc6600`
- No codebase or Figma; UI kit screens are original compositions from Untitled UI patterns + this brand. Site copy was not accessible (password wall) — tone rules below are proposals to confirm.

## CONTENT FUNDAMENTALS
- **Language:** Swiss Standard German — always `ss`, never `ß`. Plain language (Einfache Sprache): short sentences, one idea per sentence, everyday vocabulary, active voice.
- **Address:** direct address with **Sie** in UI and marketing (respectful toward adult learners); imperative microcopy is fine ("Wählen Sie eine Antwort."). *Assumption — confirm with the team.*
- **Tone:** encouraging, concrete, never childish or patronizing. Math is anchored in everyday situations: einkaufen, Fahrplan, Lohnabrechnung, Rezepte, Miete. Say "Rechnen im Alltag", not "Mathematik-Kompetenzen erwerben".
- **Casing:** sentence case everywhere, including buttons and headings ("Weiter üben", not "WEITER ÜBEN"). Brand name always lowercase: **alltagsmathematik.ch**.
- **Feedback copy:** positive and specific ("Richtig! 3 × 12 = 36."), errors without blame ("Noch nicht ganz. Schauen Sie sich das Video nochmals an.").
- **No emoji.** Meaning is carried by Lucide icons and color, not emoji.
- Numbers use Swiss formatting: 1'200.50, CHF 45.–, 13.30 Uhr.

## VISUAL FOUNDATIONS
- **Colors:** Tiefblau `#1e2c52` (= `--brand-800`) is the identity color: text, primary actions, dark surfaces. Ocker `#cc6600` (= `--accent-500`) is the energy color: links, highlights, progress, the accent brandmark. Ratio ≈ 80/15/5 (white+gray / blue / ocker). Warning shares the ocker family; success/error are Untitled-UI-style green/red. Full ramps in `tokens/colors.css`.
- **Type:** Encode Sans Semi Condensed for everything. Display = ExtraBold/Black with `-0.02em` tracking; body = Regular/Medium at 16–18px; UI labels Medium/SemiBold. Scale mirrors Untitled UI (display-2xl 72 → text-xs 12). Learner-facing body text never below 16px.
- **Brand motif:** the logo geometry — bold 40px round-cap strokes forming circles and arches ("ama"). Decorative variation comes from recomposing these strokes: oversized cropped circles/arches as background line-art on dark navy or ocker, one accent element per surface. This is THE lever for "structured but never boring" (see title slides).
- **Backgrounds:** flat colors only — white, `--gray-50`, navy `--brand-800/900`, ocker for special moments. No gradients, no textures, no photographic backgrounds.
- **Illustration:** clean minimal vector, flat, 2-color max (navy + ocker on light; white + ocker on navy), same round-stroke DNA as the logo. Photos only as task content, always in a plain rounded container.
- **Cards:** white, 1px `--border-default`, `--radius-lg` (12px), `--shadow-xs`; hover lifts to `--shadow-md`. No colored left-border cards.
- **Radii:** buttons/inputs 8px, cards 12px, modals 16px, pills/badges full. Circles are reserved for brand moments (brandmark, progress rings, step dots).
- **Borders & shadows:** subtle; shadows are navy-tinted grays (`tokens/effects.css`). No inner shadows, no glassmorphism/blur.
- **Interaction:** hover = one step darker (`--action-*-hover`) or shadow lift; press = one step darker again, no shrink transforms; focus = 4px ocker ring (`--focus-ring`). Motion is quiet: 120–180ms ease fades/slides; celebratory motion only for learning success moments.
- **Layout:** 4px grid, 1280px max container, 768px reading measure, generous whitespace. Fixed top nav on the site; activities use a focused single-column layout.

## ICONOGRAPHY
- **Icon set: Lucide only** (https://lucide.dev, ISC license) — 2px stroke, round caps/joins: matches the logo's stroke DNA. Load via CDN (`lucide` UMD) or the `Icon` component (`components/icons/`). Default 20px in UI, 24px standalone; color inherits text color; ocker only for emphasis.
- No icon font, no emoji, no unicode-as-icon. Never hand-draw icon SVGs.
- Logos in `assets/`: `logo-primary/accent/white.svg` (mark only, 391×259), `brandmark-primary/accent/white.svg` (mark in 516px disc). Wordmark = lowercase "alltagsmathematik.ch" set in SemiBold next to the mark; no separate wordmark file was provided.
- Clearspace ≈ ½ mark height; don't recolor beyond the provided three colorways; accent brandmark is for highlights (video endcards, favicons, bullets).

## Intentional additions
- `Icon` (Lucide wrapper) — needed to use the icon set in React.
- `ProgressBar` + `ProgressRing` — core to a learning product (lesson progress); styled from brand motif.

## Index
- `styles.css` → imports `tokens/` (fonts, colors, typography, spacing, effects)
- `assets/` — logos, brandmarks, fonts
- `guidelines/` — foundation specimen cards (Design System tab)
- `components/forms|display|navigation|feedback|icons/` — Button, IconButton, Input, Select, Checkbox, Radio, Switch, Card, Badge, Tag, ProgressBar, ProgressRing, Tabs, Dialog, Toast, Tooltip, Icon (each: `.jsx` + `.d.ts` + `.prompt.md` + card)
- `ui_kits/website/` — learning platform screens (home, topic overview, activity player)
- `slides/` — title-slide + content-slide variations for video/presentations
- `SKILL.md` — agent skill entry point
