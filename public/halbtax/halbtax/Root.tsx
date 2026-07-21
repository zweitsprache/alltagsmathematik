import React from 'react';
import {Audio, Composition, Series, staticFile} from 'remotion';
import {S1Train, S2Zone, S3Leave, S4Expensive, S5Card, S6Cut, S7Price, S8Route, S9Invoice, S10Smile} from './scenes';

const FPS = 30;
const SIZE = 1080;
const TOTAL = 2388; // 79.6s

// Szenen an die Transkript-Cues gekoppelt (Dauer in Frames = Sekunden × 30)
const SCENES: {c: React.FC; d: number}[] = [
  {c: S1Train, d: 206},     // 00:00 Zug / Monatsabo
  {c: S2Zone, d: 171},      // 00:06 Zonen unbeschränkt
  {c: S3Leave, d: 192},     // 00:12 andere Strecken → Tickets
  {c: S4Expensive, d: 73},  // 00:18 teuer
  {c: S5Card, d: 347},      // 00:21 Halbtax / 50% Rabatt
  {c: S6Cut, d: 153},       // 00:32 10 → 5
  {c: S7Price, d: 306},     // 00:38 190/Jahr → 16/Monat
  {c: S8Route, d: 395},     // 00:48 ZH–LU 50 → 25
  {c: S9Invoice, d: 424},   // 01:01 600 vs 300+190
  {c: S10Smile, d: 121},    // 01:15 spart 110
];

export const HalbtaxAbo: React.FC = () => (
  <>
    <Audio src={staticFile('narration.wav')} />
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
