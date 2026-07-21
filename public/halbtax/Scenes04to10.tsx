import React from 'react';
import {Canvas, NAVY, STROKE, GREY_300, GREY_400, BottleSmall, BottleMini, PriceTag, usePop, bigText, priceText} from './shared';

const BOTTLE_X = [-42.6, 20.4, 83.4]; // linksbuendige Spalten fuer 1-3 Flaschen

// Szene 4 – 1 / 2 / 3 Flaschen in drei Reihen mit Preisschildern
export const Scene04Counting: React.FC = () => {
  const pop = usePop();
  const rows: {y: number; n: number; price: string; delays: number[]; tagDelay: number}[] = [
    {y: -3.4, n: 1, price: '4.50', delays: [0.1], tagDelay: 0.3},
    {y: 136.6, n: 2, price: '8.20', delays: [0.5, 0.7], tagDelay: 0.9},
    {y: 276.6, n: 3, price: '9.90', delays: [1.1, 1.3, 1.5], tagDelay: 1.7},
  ];
  return (
    <Canvas>
      <g transform="translate(38.8 40.5) scale(0.83)">
        {rows.map((r) => (
          <React.Fragment key={r.price}>
            {r.delays.map((d, i) => (
              <g key={i} transform={`translate(${BOTTLE_X[i]} ${r.y}) scale(0.45)`}>
                <g style={pop(d)}><BottleSmall /></g>
              </g>
            ))}
            <g transform={`translate(440.6 ${r.y + 103.4})`}>
              <g style={pop(r.tagDelay)}><PriceTag price={r.price} /></g>
            </g>
          </React.Fragment>
        ))}
      </g>
    </Canvas>
  );
};

// Gemeinsames Layout: n Flaschen oben links + Preisschild rechts + optionaler Text darunter
const PriceScene: React.FC<{n: number; price: string; children?: React.ReactNode}> = ({n, price, children}) => {
  const pop = usePop();
  return (
    <Canvas>
      <g transform="translate(38.8 40.5) scale(0.83)">
        {Array.from({length: n}, (_, i) => (
          <g key={i} transform={`translate(${BOTTLE_X[i]} -3.4) scale(0.45)`}>
            <g style={pop(0.1 + i * 0.2)}><BottleSmall /></g>
          </g>
        ))}
        <g transform="translate(440.6 100)">
          <g style={pop(0.1 + n * 0.2)}><PriceTag price={price} /></g>
        </g>
      </g>
      {children}
    </Canvas>
  );
};

const TextBlock: React.FC<{unitPrice: string; delay?: number}> = ({unitPrice, delay = 0.8}) => {
  const pop = usePop();
  return (
    <g style={pop(delay)}>
      <text x={240} y={252} textAnchor="middle" style={bigText}>1 Flasche</text>
      <text x={240} y={316} textAnchor="middle" style={bigText}>=</text>
      <text x={240} y={380} textAnchor="middle" style={bigText}>{unitPrice}</text>
    </g>
  );
};

const CalcLine: React.FC<{calc: string; delay?: number}> = ({calc, delay = 0.8}) => {
  const pop = usePop();
  return (
    <g style={pop(delay)}>
      <text x={240} y={316} textAnchor="middle" style={bigText}>{calc}</text>
    </g>
  );
};

export const Scene05OneBottle: React.FC = () => (
  <PriceScene n={1} price="4.50"><TextBlock unitPrice="4.50" delay={0.6} /></PriceScene>
);
export const Scene06TwoBottles: React.FC = () => (
  <PriceScene n={2} price="8.20"><CalcLine calc="8.20 : 2 = 4.10" /></PriceScene>
);
export const Scene07TwoBottlesUnit: React.FC = () => (
  <PriceScene n={2} price="8.20"><TextBlock unitPrice="4.10" /></PriceScene>
);
export const Scene08ThreeBottles: React.FC = () => (
  <PriceScene n={3} price="9.90"><CalcLine calc="9.90 : 3 = 3.30" delay={1} /></PriceScene>
);
export const Scene09ThreeBottlesUnit: React.FC = () => (
  <PriceScene n={3} price="9.90"><TextBlock unitPrice="3.30" delay={1} /></PriceScene>
);

// Szene 10 – Preistabelle: Flaschen | Gesamtpreis (grau) | Preis pro Flasche
export const Scene10Table: React.FC = () => {
  const greyPrice = {...priceText, fill: GREY_400};
  const rows: {y: number; n: number; total: string; unit: string}[] = [
    {y: 128, n: 1, total: '4.50', unit: '4.50'},
    {y: 240, n: 2, total: '8.20', unit: '4.10'},
    {y: 352, n: 3, total: '9.90', unit: '3.30'},
  ];
  return (
    <Canvas>
      <line x1={72} y1={184} x2={408} y2={184} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={STROKE} strokeLinecap="round" />
      <line x1={72} y1={296} x2={408} y2={296} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={STROKE} strokeLinecap="round" />
      <line x1={230} y1={84} x2={230} y2={396} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={STROKE} strokeLinecap="round" />
      <line x1={319} y1={84} x2={319} y2={396} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={STROKE} strokeLinecap="round" />
      {rows.map((r) => (
        <React.Fragment key={r.y}>
          {Array.from({length: r.n}, (_, i) => (
            <g key={i} transform={`translate(${37.2 + i * 40} ${r.y - 51}) scale(0.22)`}>
              <BottleMini color={i === 0 ? NAVY : GREY_300} />
            </g>
          ))}
          <text x={274.5} y={r.y} textAnchor="middle" dominantBaseline="central" style={greyPrice}>{r.total}</text>
          <text x={363.5} y={r.y} textAnchor="middle" dominantBaseline="central" style={priceText}>{r.unit}</text>
        </React.Fragment>
      ))}
    </Canvas>
  );
};
