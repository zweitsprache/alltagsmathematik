# Halbtax-Erklärvideo — Remotion

Vertonte Animation, synchron zum Sprechertext (`public/narration.wav`, 79.6 s).

## Dateien
- `shared.tsx` — Farben, Zug-/Ticket-Primitive, Timing-Helfer (480er-Raster, Strich 6 Einheiten)
- `scenes.tsx` — die 10 Szenen (frame-basiert)
- `Root.tsx` — Komposition `HalbtaxAbo` (1080×1080, 30 fps) + Audiospur, Szenen an die Transkript-Cues gekoppelt
- `public/narration.wav` — Sprecheraudio

## Einrichten
```bash
npm i remotion @remotion/cli react react-dom
npx remotion studio remotion/halbtax/Root.tsx   # Vorschau
npx remotion render remotion/halbtax/Root.tsx HalbtaxAbo out/halbtax.mp4
```
`Root.tsx` als Remotion-Entry registrieren (bzw. `registerRoot(RemotionRoot)` in eurer `src/index.ts`).

## Cue-Mapping
Jede Szene ist eine `Series.Sequence` mit einer Dauer in Frames (Sekunde × 30). Timings in `Root.tsx` anpassen, wenn sich das Audio ändert. Font: **Encode Sans Semi Condensed** im Projekt laden (z. B. `@remotion/google-fonts/EncodeSansSemiCondensed`).
