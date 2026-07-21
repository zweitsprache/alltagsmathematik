import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Canvas, NAVY, OCKER} from './shared';

const ROUTE = 'M 148 344 C 240 316 170 215 250 192 C 315 174 316 172 334 150';

// Szene 2 – Ocker-Punkt wandert auf der kurvigen Strecke vom Haus zum Supermarkt.
export const Scene02Route: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const d = interpolate(frame, [0.06 * durationInFrames, 0.72 * durationInFrames], [0, 100], {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Canvas>
      <path d={ROUTE} vectorEffect="non-scaling-stroke" fill="none" stroke={NAVY} strokeWidth={7} strokeLinecap="round" strokeDasharray="0.5 16" opacity={0.45} />
      <g transform="translate(72 336) scale(2.9)" fill="none" stroke={NAVY} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
        <path vectorEffect="non-scaling-stroke" d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path vectorEffect="non-scaling-stroke" d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      </g>
      <g transform="translate(338 74) scale(2.9)" fill="none" stroke={NAVY} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
        <path vectorEffect="non-scaling-stroke" d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path vectorEffect="non-scaling-stroke" d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path vectorEffect="non-scaling-stroke" d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path vectorEffect="non-scaling-stroke" d="M2 7h20" />
        <path vectorEffect="non-scaling-stroke" d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
      </g>
      <circle r={11} fill={OCKER} style={{offsetPath: `path('${ROUTE}')`, offsetRotate: '0deg', offsetDistance: `${d}%`}} />
    </Canvas>
  );
};
