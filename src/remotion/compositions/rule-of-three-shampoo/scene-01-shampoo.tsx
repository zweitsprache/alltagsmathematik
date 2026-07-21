import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Canvas, NAVY, OCKER, BOTTLE_BODY, BOTTLE_CAP} from './shared';

// Szene 1 – Fast leere Flasche: umdrehen, schuetteln, letzter Tropfen faellt.
// Timing = Anteile der Gesamtdauer (Standard: 180 Frames = 6s bei 30fps), loopbar.
export const Scene01Shampoo: React.FC<{shakeDeg?: number}> = ({shakeDeg = 9}) => {
  const frame = useCurrentFrame();
  const a = shakeDeg;
  const rot = interpolate(
    frame,
    [0, 14, 138, 142, 148, 154, 160, 166, 172],
    [0, 0, 180, 180 - a, 180 + a, 180 - a, 180 + a, 180 - a * 0.5, 180],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const ty = interpolate(frame, [0, 138, 142, 148, 154, 160, 166, 172], [0, 0, -5, 3, -5, 3, -3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pool = interpolate(frame, [14, 138], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lines = interpolate(
    frame,
    [0, 138, 142, 148, 154, 160, 166, 174],
    [0, 0, 1, 0.35, 1, 0.35, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const dropY = interpolate(frame, [158, 164, 205], [0, 3, 94], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dropS = interpolate(frame, [154, 160, 166], [0, 1.05, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dropO = interpolate(frame, [154, 160, 205, 212], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const splashO = interpolate(frame, [198, 205, 221], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const splashS = interpolate(frame, [198, 205, 221], [0.3, 1, 1.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
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
          <path d={BOTTLE_BODY} vectorEffect="non-scaling-stroke" fill="none" stroke={NAVY} strokeWidth={7} strokeLinejoin="round" />
          <path d={BOTTLE_CAP} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={7} strokeLinejoin="round" />
          <path
            d="M 240 212 C 248 223 253 229 253 235 A 13 13 0 1 1 227 235 C 227 229 232 223 240 212 Z"
            transform="translate(240 232) scale(1.35) translate(-240 -232)"
            vectorEffect="non-scaling-stroke"
            fill="none"
            stroke={NAVY}
            strokeWidth={7}
            strokeLinejoin="round"
          />
          <line x1={214} y1={286} x2={266} y2={286} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={7} strokeLinecap="round" />
        </g>
        <g opacity={lines} fill="none" stroke={OCKER} strokeWidth={7} strokeLinecap="round">
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
            <path d="M -20 0 Q -26 -8 -24 -14" vectorEffect="non-scaling-stroke" fill="none" stroke={OCKER} strokeWidth={7} strokeLinecap="round" />
            <path d="M 20 0 Q 26 -8 24 -14" vectorEffect="non-scaling-stroke" fill="none" stroke={OCKER} strokeWidth={7} strokeLinecap="round" />
            <circle cx={0} cy={-6} r={4} fill={OCKER} />
          </g>
        </g>
      </g>
    </Canvas>
  );
};
