import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const NAVY = '#1e2c52';
export const OCKER = '#cc6600';
export const GREY = '#98a2b3';
export const FONT = "'Encode Sans Semi Condensed', 'Encode Sans', sans-serif";

// 480er-Koordinatensystem, uniform auf 1080 skaliert. Grundstrich = 6 Einheiten.
export const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: '#ffffff'}}>
    <svg viewBox="0 0 480 480" width="100%" height="100%">{children}</svg>
  </AbsoluteFill>
);

// Sekunden im aktuellen Sequence-Frame
export const useSec = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};

// Fade + 8px slide-up (entspricht ama-pop)
export const pop = (sec: number, start: number, dur = 0.4): React.CSSProperties => {
  const t = interpolate(sec, [start, start + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {opacity: t, transform: `translateY(${(1 - t) * 8}px)`};
};

export const clamp = (sec: number, a: number, b: number, from: number, to: number) => {
  const x = interpolate(sec, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return x;
};
// weiches ease
export const smooth = (sec: number, a: number, b: number, from: number, to: number) => {
  if (sec <= a) return from;
  if (sec >= b) return to;
  const x = (sec - a) / (b - a);
  return from + (to - from) * x * x * (3 - 2 * x);
};

export const TRAIN_PATHS = [
  'M672.7,501.7H10',
  'M202.4,447.5c0,11.8-9.6,21.4-21.4,21.4s-21.4-9.6-21.4-21.4,9.6-21.4,21.4-21.4,21.4,9.6,21.4,21.4Z',
  'M287.9,447.5c0,11.8-9.6,21.4-21.4,21.4s-21.4-9.6-21.4-21.4,9.6-21.4,21.4-21.4,21.4,9.6,21.4,21.4Z',
  'M437.5,447.5c0,11.8-9.6,21.4-21.4,21.4s-21.4-9.6-21.4-21.4,9.6-21.4,21.4-21.4,21.4,9.6,21.4,21.4Z',
  'M523,447.5c0,11.8-9.6,21.4-21.4,21.4s-21.4-9.6-21.4-21.4,9.6-21.4,21.4-21.4,21.4,9.6,21.4,21.4Z',
  'M223.8,384.1h303.5c10.7,0,20.7,5.4,26.7,14.3l5.5,8.3c4,5.9,10.6,9.5,17.8,9.5h74.1c11.8,0,21.4-9.6,21.4-21.4v-50.8c0-8.5-3.4-16.7-9.4-22.7l-124.6-124.6c-10-10-23.6-15.7-37.8-15.7H10',
  'M10,416.2h95.4c7.1,0,13.8-3.6,17.8-9.5l5.5-8.3c5.9-8.9,16-14.3,26.7-14.3h88.6',
  'M384,223.8H10',
  'M10,320h384.8c11.8,0,21.4-9.6,21.4-21.4v-53.4c0-11.8-9.6-21.4-21.4-21.4h-10.7',
  'M565.8,223.8h-64.1c-11.8,0-21.4,9.6-21.4,21.4v53.4c0,11.8,9.6,21.4,21.4,21.4h157.7',
  'M287.9,223.8v96.2',
  'M159.6,223.8v96.2',
  'M31.4,223.8v96.2',
  'M651.3,362.7h21.4',
];

// Zug (682er-Art). sw = Strichstärke in Ziel-Einheiten; scale kompensiert.
export const Train: React.FC<{scale: number; sw?: number}> = ({scale, sw = 6}) => (
  <g style={{fill: 'none', stroke: NAVY, strokeWidth: sw / scale, strokeLinecap: 'round', strokeLinejoin: 'round'}}>
    {TRAIN_PATHS.map((d, i) => <path key={i} d={d} />)}
  </g>
);

// Ticket (512x316). variant: 'full' = mit Kopfzeile & Linien, 'plain' = nur Rahmen+Kopflinie
export const Ticket: React.FC<{scale: number; header?: boolean; price?: string}> = ({scale, header = true, price}) => {
  const sw = 6 / scale;
  const s = {fill: 'none', stroke: NAVY, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <g>
      <rect x={7.5} y={7.5} width={497} height={301.1} rx={13.7} fill="#ffffff" stroke="none" />
      <path d="M504.5,241.3v53.6c0,7.6-6.1,13.7-13.7,13.7H21.2c-7.6,0-13.7-6.1-13.7-13.7V21.2c0-7.6,6.1-13.7,13.7-13.7h469.6c7.6,0,13.7,6.1,13.7,13.7v224" style={s} />
      <line x1={7.5} y1={98.9} x2={504.5} y2={98.9} style={s} />
      {header && <line x1={40} y1={53.2} x2={210} y2={53.2} style={s} />}
      {price && <text x={256} y={210} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 96, fill: NAVY}}>{price}</text>}
    </g>
  );
};
