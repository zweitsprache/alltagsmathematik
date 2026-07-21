# Halbtax-Erklärvideo — Remotion

Vertonte Animation, synchron zum Sprechertext (`public/narration.wav`, 79.6 s).

## Dateien
- `shared.tsx` — Farben, exakte Zug-/Ticket-Pfade aus dem DC, Timing-Helfer (480er-Raster, Strich 6 Einheiten)
- `scenes.tsx` — die **9 Szenen 1:1 aus `Zug und Abo.dc.html`** (gleiche Geometrie & Animationslogik, frame-basiert)
- `Root.tsx` — Komposition `HalbtaxAbo` (1080×1080, 30 fps) + Audiospur, Szenen an die Transkript-Cues gekoppelt
- `public/narration.wav` — Sprecheraudio

Die Szenen sind wortgetreue Ports der DC-Szenen (Zug, Abo-Karte, Liniennetz, Tickets zählen, Ticket schneiden 10→5, 190/16, ZH–LU 50→25, Rechnung 600/490, Smiley 110). Gleiche Geometrie & Bewegung wie im DC, aber **auf den Sprechertext getaktet**: Szene 3/4/9 sind zeitgestreckt, Szene 5–8 laufen als Einzelpass, damit ihre inneren Beats (Schnitt, Preis-Flip, Halbierung, Badges) genau auf den gesprochenen Wörtern liegen — statt wie im DC endlos zu loopen.

## Cue-Mapping (aus Transkript, 30 fps)
Szenengrenze = Sprechstart der nächsten Szene. Startzeiten: 0 · 3.96 · 6.88 · 18.98 · 21.40 · 38.08 · 48.25 · 61.44 · 75.56 s → Frame-Dauern in `Root.tsx` (`SCENES`): 119 · 87 · 363 · 73 · 500 · 306 · 395 · 424 · 121 = 2388 (79.6 s). Timings dort anpassen, wenn sich das Audio ändert.

## Einrichten
```bash
npm i remotion @remotion/cli react react-dom
npx remotion studio remotion/halbtax/Root.tsx   # Vorschau
npx remotion render remotion/halbtax/Root.tsx HalbtaxAbo out/halbtax.mp4
```
`Root.tsx` als Remotion-Entry registrieren (bzw. `registerRoot(RemotionRoot)` in eurer `src/index.ts`). Font: **Encode Sans Semi Condensed** im Projekt laden (z. B. `@remotion/google-fonts/EncodeSansSemiCondensed`).
