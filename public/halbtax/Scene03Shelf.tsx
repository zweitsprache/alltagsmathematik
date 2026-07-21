import React from 'react';
import {Canvas, NAVY, STROKE, BottleSmall} from './shared';

// Szene 3 – Supermarktregal (statisch): Kosmetikprodukte, Einzelflasche, Duo- und Multipack.
export const Scene03Shelf: React.FC = () => (
  <Canvas>
    <line x1={72} y1={236} x2={408} y2={236} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={STROKE} strokeLinecap="round" />
    <line x1={72} y1={404} x2={408} y2={404} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={STROKE} strokeLinecap="round" />
    {/* Tablar 1: Flasche, Tiegel, Tube, Pumpspender, schlanke Flasche */}
    <g transform="translate(-3.5 77.1) scale(0.42)"><BottleSmall /></g>
    <rect x={149} y={173} width={55} height={50} rx={8} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={STROKE} />
    <rect x={149} y={159} width={55} height={14} rx={6} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={STROKE} />
    <line x1={164} y1={199} x2={190} y2={199} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={STROKE} strokeLinecap="round" />
    <path d="M 234 207 L 262 207 L 258 143 L 238 143 Z" vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
    <rect x={235} y={207} width={26} height={16} rx={3} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={STROKE} />
    <line x1={245} y1={181} x2={251} y2={181} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={STROKE} strokeLinecap="round" />
    <rect x={288} y={153} width={52} height={70} rx={10} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={STROKE} />
    <rect x={306} y={134} width={16} height={19} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={STROKE} />
    <rect x={299} y={118} width={30} height={16} rx={4} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={STROKE} />
    <line x1={302} y1={187} x2={326} y2={187} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={STROKE} strokeLinecap="round" />
    <rect x={366} y={123} width={38} height={100} rx={9} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={STROKE} />
    <path d="M 376 123 L 376 108 Q 376 104 380 104 L 390 104 Q 394 104 394 108 L 394 123 Z" vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
    {/* Tablar 2: Duopack + Multipack */}
    <g transform="translate(4.6 245.1) scale(0.42)"><BottleSmall /></g>
    <g transform="translate(64.6 245.1) scale(0.42)"><BottleSmall /></g>
    <g transform="translate(156.6 245.1) scale(0.42)"><BottleSmall /></g>
    <g transform="translate(216.6 245.1) scale(0.42)"><BottleSmall /></g>
    <g transform="translate(276.6 245.1) scale(0.42)"><BottleSmall /></g>
  </Canvas>
);
