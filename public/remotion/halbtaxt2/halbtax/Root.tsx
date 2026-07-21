import React from 'react';
import {Audio, Composition, Series, staticFile} from 'remotion';
import {S1Train, S2Card, S3Net, S4Tickets, S5Cut, S6Price, S7Route, S8Invoice, S9Smile} from './scenes';

const FPS = 30;
const SIZE = 1080;
const TOTAL = 2388; // 79.6 s

// Die 9 Szenen aus "Zug und Abo.dc.html", 1:1 portiert, an die Transkript-Cues gehängt.
// Grenzen aus dem Transkript: jede Szene läuft bis zum Sprechstart der nächsten.
// Startzeiten (s): 0 · 3.96 · 6.88 · 18.98 · 21.40 · 38.08 · 48.25 · 61.44 · 75.56 · Ende 79.60
const SCENES: {c: React.FC; d: number}[] = [
  {c: S1Train, d: 119},    // 00:00.27  Fährst du oft mit dem Zug?
  {c: S2Card, d: 87},      // 00:03.96  Monatsabo
  {c: S3Net, d: 363},      // 00:06.88  Zonen unbeschränkt / andere Strecken → Tickets
  {c: S4Tickets, d: 73},   // 00:18.98  kann schnell teuer werden
  {c: S5Cut, d: 500},      // 00:21.40  Halbtax / 50% / 10 → 5
  {c: S6Price, d: 306},    // 00:38.08  190 pro Jahr → 16 pro Monat
  {c: S7Route, d: 395},    // 00:48.25  Zürich–Luzern 50 → 25
  {c: S8Invoice, d: 424},  // 01:01.44  600 vs 300 + 190
  {c: S9Smile, d: 121},    // 01:15.56  spart 110 pro Jahr
];

export const HalbtaxAbo: React.FC = () => (
  <>
    <Audio src={staticFile('remotion/halbtaxt2/halbtax/public/narration.wav')} />
    <Series>
      {SCENES.map(({c: C, d}, i) => (
        <Series.Sequence key={i} durationInFrames={d}><C /></Series.Sequence>
      ))}
    </Series>
  </>
);

export const RemotionRoot: React.FC = () => (
  <Composition id="HalbtaxAbo" component={HalbtaxAbo} durationInFrames={TOTAL} fps={FPS} width={SIZE} height={SIZE} />
);
