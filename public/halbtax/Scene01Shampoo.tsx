import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Canvas, NAVY, OCKER, STROKE, BOTTLE_BODY, BOTTLE_CAP} from './shared';

// Szene 1 – Fast leere Flasche: umdrehen, schuetteln, letzter Tropfen faellt.
// Timing = Anteile der Gesamtdauer (Standard: 180 Frames = 6s bei 30fps), loopbar.
export const Scene01Shampoo: React.FC<{shakeDeg?: number}> = ({shakeDeg = 9}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = frame / durationInFrames;
  const a = shakeDeg;
  const rot = interpolate(p,
    [0, 0.08, 0.22, 0.27, 0.30, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.78, 0.92, 1],
    [0, 0, 180, 180, 180 - a, 180 + a, 180 - a, 180 + a, 180 - a * 0.5, 180 + a * 0.3, 180, 180, 360, 360]);
  const ty = interpolate(p, [0, 0.27, 0.30, 0.33, 0.36, 0.39, 0.42, 0.45, 1], [0, 0, -5, 3, -5, 3, -3, 0, 0]);
  const pool = interpolate(p, [0, 0.12, 0.22, 0.84, 0.92, 1], [1, 1, 0, 0, 1, 1]);
  const lines = interpolate(p, [0, 0.27, 0.31, 0.34, 0.37, 0.40, 0.43, 0.47, 1], [0, 0, 1, 0, 1, 0, 1, 0, 0]);
  const dropY = interpolate(p, [0, 0.47, 0.54, 0.56, 0.68, 0.71, 1], [0, 0, 0, 3, 86, 94, 94]);
  const dropS = interpolate(p, [0, 0.47, 0.54, 0.56, 1], [0, 0, 1.05, 1, 1]);
  const dropO = interpolate(p, [0, 0.68, 0.71, 1], [1, 1, 0, 0]);
  const splashO = interpolate(p, [0, 0.67, 0.70, 0.78, 1], [0, 0, 1, 0, 0]);
  const splashS = interpolate(p, [0, 0.67, 0.70, 0.78, 1], [0.3, 0.3, 1, 1.2, 1.2]);
  return (
    <Canvas>
      <g transform="translate(21.6 -19.9) scale(0.91)">
        <defs>
          <clipPath id="s1-bottle-clip"><path d={BOTTLE_BODY} /></clipPath>
        </defs>
        <g style={{transform: `translateY(${ty}px) rotate(${rot}deg)`, transformOrigin: '240px 240px'}}>
          <path d={BOTTLE_BODY} fill="#ffffff" />
          <g clipPath="url(#s1-bottle-clip)">
            <rect x={196} y={324} width={88} height={18} rx={8} fill={OCKER} opacity={pool} />
          </g>
          <path d={BOTTLE_BODY} vectorEffect="non-scaling-stroke" fill="none" stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
          <path d={BOTTLE_CAP} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
          <path d="M 240 207 C 251 222 258 230 258 238 A 18 18 0 1 1 222 238 C 222 230 229 222 240 207 Z" vectorEffect="non-scaling-stroke" fill="none" stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
          <line x1={214} y1={286} x2={266} y2={286} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={STROKE} strokeLinecap="round" />
        </g>
        <g opacity={lines} fill="none" stroke={OCKER} strokeWidth={STROKE} strokeLinecap="round">
          <path d="M 152 198 Q 138 240 152 282" vectorEffect="non-scaling-stroke" />
          <path d="M 128 214 Q 118 240 128 266" vectorEffect="non-scaling-stroke" opacity={0.55} />
          <path d="M 328 198 Q 342 240 328 282" vectorEffect="non-scaling-stroke" />
          <path d="M 352 214 Q 362 240 352 266" vectorEffect="non-scaling-stroke" opacity={0.55} />
        </g>
        <g transform="translate(240 370)">
          <path
            d="M 0 0 C 7 9 11 14 11 19 A 11 11 0 1 1 -11 19 C -11 14 -7 9 0 0 Z"
            fill={OCKER}
            opacity={dropO}
            style={{transform: `translateY(${dropY}px) scale(${dropS})`, transformBox: 'fill-box', transformOrigin: '50% 0%'}}
          />
        </g>
        <g transform="translate(240 464)">
          <g opacity={splashO} style={{transform: `scale(${splashS})`, transformBox: 'fill-box', transformOrigin: '50% 50%'}}>
            <path d="M -20 0 Q -26 -8 -24 -14" vectorEffect="non-scaling-stroke" fill="none" stroke={OCKER} strokeWidth={STROKE} strokeLinecap="round" />
            <path d="M 20 0 Q 26 -8 24 -14" vectorEffect="non-scaling-stroke" fill="none" stroke={OCKER} strokeWidth={STROKE} strokeLinecap="round" />
            <circle cx={0} cy={-6} r={4} fill={OCKER} />
          </g>
        </g>
      </g>
    </Canvas>
  );
};
