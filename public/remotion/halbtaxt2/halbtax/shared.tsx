import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

export const NAVY = '#1e2c52';
export const OCKER = '#cc6600';
export const FONT = "'Encode Sans Semi Condensed', 'Encode Sans', sans-serif";

export const Canvas: React.FC<{children: React.ReactNode; label?: string}> = ({children, label}) => (
  <AbsoluteFill style={{background: '#ffffff'}}>
    <svg viewBox="0 0 480 480" width="100%" height="100%" role="img" aria-label={label}>{children}</svg>
  </AbsoluteFill>
);

// Lokale Sekunden im aktuellen Sequence-Frame, optional zeitgestreckt
export const useSec = (scale = 1) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (f / fps) * scale;
};

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smoothstep = (x: number) => x * x * (3 - 2 * x);

// ama-pop: 0.5s Fade + 8px Slide-up ab delay, bleibt danach (both)
export const pop = (sec: number, delay = 0): React.CSSProperties => {
  const t = clamp01((sec - delay) / 0.5);
  return {opacity: t, transform: `translateY(${(1 - t) * 8}px)`};
};

// lineare Interpolation zwischen a,b mit Klemmung
export const lin = (sec: number, a: number, b: number, from: number, to: number) =>
  sec <= a ? from : sec >= b ? to : from + (to - from) * ((sec - a) / (b - a));

// weiches Ease zwischen a,b
export const ease = (sec: number, a: number, b: number, from: number, to: number) =>
  sec <= a ? from : sec >= b ? to : from + (to - from) * smoothstep((sec - a) / (b - a));

// Keyframe-Kurve (Zeit → Wert), pro Segment smoothstep — für den Punkt in Szene 7
export const kf = (t: number, pts: [number, number][]) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, v0] = pts[i], [t1, v1] = pts[i + 1];
    if (t <= t1) return v0 + (v1 - v0) * smoothstep(clamp01((t - t0) / (t1 - t0)));
  }
  return pts[pts.length - 1][1];
};

export const money = (v: number, pad = 5) => (Math.round(v / 0.05) * 0.05).toFixed(2).padStart(pad, '0');

// Zug-Pfade (682er-Raster) aus uploads/train.svg, Styling erbt vom Eltern-<g>
export const TRAIN = [
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
export const TrainPaths: React.FC = () => <>{TRAIN.map((d, i) => <path key={i} d={d} />)}</>;

// Ticket-Pfade (512x316, aus uploads/card.svg, 3. Kreis entfernt)
export const TicketPaths: React.FC = () => (
  <>
    <path d="M504.5,241.3v53.6c0,7.6-6.1,13.7-13.7,13.7H21.2c-7.6,0-13.7-6.1-13.7-13.7V21.2c0-7.6,6.1-13.7,13.7-13.7h469.6c7.6,0,13.7,6.1,13.7,13.7v224" />
    <line x1={7.5} y1={98.9} x2={504.5} y2={98.9} />
    <line x1={40} y1={53.2} x2={210} y2={53.2} />
    <line x1={67.7} y1={131.6} x2={96.5} y2={131.6} />
    <line x1={67.7} y1={163.2} x2={197.9} y2={163.2} />
    <circle cx={256.2} cy={235.9} r={24} />
    <circle cx={91.7} cy={235.9} r={24} />
    <line x1={115.7} y1={235.9} x2={231.9} y2={235.9} />
  </>
);
