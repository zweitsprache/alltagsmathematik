import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const FONT = "'Encode Sans Semi Condensed', 'Encode Sans', sans-serif";
export const NAVY = '#1e2c52';
export const OCKER = '#cc6600';
export const GREY_300 = '#d0d5dd';
export const GREY_400 = '#98a2b3';

// Strichstärke: 6 Einheiten auf dem 480er-Raster, umgerechnet auf die 1080er-Rendergrösse
// (non-scaling-stroke misst in Gerätepixeln, daher hier skaliert)
export const STROKE = 6 * (1080 / 480); // = 13.5

export const BOTTLE_BODY =
  'M 204 142 C 196 200 188 264 188 328 Q 188 350 210 350 L 270 350 Q 292 350 292 328 C 292 264 284 200 276 142 Z';
export const BOTTLE_CAP =
  'M 212 142 L 212 122 Q 212 114 220 114 L 260 114 Q 268 114 268 122 L 268 142 Z';

// Quadratische 1:1-Leinwand mit 480er-Koordinatensystem (wie die DC-Szenen)
export const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: '#ffffff', justifyContent: 'center', alignItems: 'center'}}>
    <svg viewBox="0 0 480 480" width="100%" height="100%">{children}</svg>
  </AbsoluteFill>
);

// Flasche mit Tropfen-Motiv und Etikettlinie (Szenen 4-9)
export const BottleSmall: React.FC<{color?: string}> = ({color = NAVY}) => (
  <g>
    <path d={BOTTLE_BODY} fill="#ffffff" />
    <path d={BOTTLE_BODY} vectorEffect="non-scaling-stroke" fill="none" stroke={color} strokeWidth={STROKE} strokeLinejoin="round" />
    <path d={BOTTLE_CAP} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={color} strokeWidth={STROKE} strokeLinejoin="round" />
    <path d="M 240 212 C 248 223 253 229 253 235 A 13 13 0 1 1 227 235 C 227 229 232 223 240 212 Z" fill="none" stroke={color} strokeWidth={STROKE} strokeLinejoin="round" />
    <line x1={218} y1={292} x2={262} y2={292} stroke={color} strokeWidth={STROKE} strokeLinecap="round" />
  </g>
);

// Vereinfachte Flasche: nur Koerper + Deckel (Tabelle, Szene 10)
export const BottleMini: React.FC<{color?: string}> = ({color = NAVY}) => (
  <g>
    <path d={BOTTLE_BODY} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={color} strokeWidth={STROKE} strokeLinejoin="round" />
    <path d={BOTTLE_CAP} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={color} strokeWidth={STROKE} strokeLinejoin="round" />
  </g>
);

// Preisschild, Ankerpunkt = rechte Kante Mitte (wie #ama-price-tag im DC)
export const PriceTag: React.FC<{price: string}> = ({price}) => (
  <g>
    <rect x={-124} y={-24} width={124} height={48} rx={10} vectorEffect="non-scaling-stroke" fill="none" stroke={NAVY} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
    <text x={-62} y={0} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 28, fill: NAVY}}>{price}</text>
  </g>
);

// Gestaffeltes Einblenden (ersetzt die CSS-Animation "ama-pop": 0.5s fade + 8px slide)
export const usePop = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (delaySec: number): React.CSSProperties => {
    const t = interpolate(frame - delaySec * fps, [0, 0.5 * fps], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return {opacity: t, transform: `translateY(${(1 - t) * 8}px)`};
  };
};

export const priceText: React.CSSProperties = {fontFamily: FONT, fontWeight: 800, fontSize: 28, fill: NAVY};
export const bigText: React.CSSProperties = {fontFamily: FONT, fontWeight: 800, fontSize: 40, fill: NAVY};
