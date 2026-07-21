import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {Canvas, NAVY, OCKER, BottleSmall} from './shared';

// Szene 3 – Supermarktregal (statisch): Kosmetikprodukte, Einzelflasche, Duo- und Multipack.
export const Scene03Shelf: React.FC<{animateOffers?: boolean}> = ({animateOffers = true}) => {
  const frame = useCurrentFrame();
  const pulse = (start: number, peak: number, end: number) =>
    interpolate(frame, [start, peak, end], [1, 1.13, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  const revealColor = (start: number, end: number) =>
    animateOffers
      ? interpolateColors(frame, [start, end], [NAVY, OCKER])
      : NAVY;
  const singleScale = animateOffers ? pulse(39, 50, 62) : 1;
  const duoScale = animateOffers ? pulse(64, 76, 88) : 1;
  const multipackScale = animateOffers ? pulse(90, 104, 119) : 1;
  const singleColor = revealColor(30, 40);
  const duoColor = revealColor(60, 70);
  const multipackColor = revealColor(90, 100);
  const pulseStyle = (scale: number): React.CSSProperties => ({
    transform: `scale(${scale})`,
    transformBox: 'fill-box',
    transformOrigin: 'center',
  });

  return (
    <Canvas>
    <line x1={72} y1={236} x2={408} y2={236} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={7} strokeLinecap="round" />
    <line x1={72} y1={404} x2={408} y2={404} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={7} strokeLinecap="round" />
    {/* Tablar 1: Flasche, Tiegel, Tube, Pumpspender, schlanke Flasche */}
    <g style={pulseStyle(singleScale)}>
      <g transform="translate(-3.5 77.1) scale(0.42)"><BottleSmall color={singleColor} /></g>
    </g>
    <rect x={149} y={173} width={55} height={50} rx={8} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={7} />
    <rect x={149} y={159} width={55} height={14} rx={6} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={7} />
    <line x1={164} y1={199} x2={190} y2={199} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={7} strokeLinecap="round" />
    <path d="M 234 207 L 262 207 L 258 143 L 238 143 Z" vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={7} strokeLinejoin="round" />
    <rect x={235} y={207} width={26} height={16} rx={3} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={7} />
    <line x1={245} y1={181} x2={251} y2={181} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={7} strokeLinecap="round" />
    <rect x={288} y={153} width={52} height={70} rx={10} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={7} />
    <rect x={306} y={134} width={16} height={19} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={7} />
    <rect x={299} y={118} width={30} height={16} rx={4} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={7} />
    <line x1={302} y1={187} x2={326} y2={187} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={7} strokeLinecap="round" />
    <rect x={366} y={123} width={38} height={100} rx={9} vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={7} />
    <path d="M 376 123 L 376 108 Q 376 104 380 104 L 390 104 Q 394 104 394 108 L 394 123 Z" vectorEffect="non-scaling-stroke" fill="#ffffff" stroke={NAVY} strokeWidth={7} strokeLinejoin="round" />
    {/* Tablar 2: Duopack + Multipack */}
    <g style={pulseStyle(duoScale)}>
      <g transform="translate(4.6 245.1) scale(0.42)"><BottleSmall color={duoColor} /></g>
      <g transform="translate(64.6 245.1) scale(0.42)"><BottleSmall color={duoColor} /></g>
    </g>
    <g style={pulseStyle(multipackScale)}>
      <g transform="translate(156.6 245.1) scale(0.42)"><BottleSmall color={multipackColor} /></g>
      <g transform="translate(216.6 245.1) scale(0.42)"><BottleSmall color={multipackColor} /></g>
      <g transform="translate(276.6 245.1) scale(0.42)"><BottleSmall color={multipackColor} /></g>
    </g>
    </Canvas>
  );
};
