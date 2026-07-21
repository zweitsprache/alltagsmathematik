import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Canvas, NAVY, OCKER, GREY_300, GREY_400, BottleSmall, BottleMini, PriceTag, usePop, bigText, priceText, FONT} from './shared';

const BOTTLE_X = [-42.6, 20.4, 83.4]; // linksbuendige Spalten fuer 1-3 Flaschen

const questionMarks = [
  {x: 105, y: 92, size: 112, color: NAVY, delay: 0, rotate: -13},
  {x: 262, y: 54, size: 156, color: OCKER, delay: 3, rotate: 9},
  {x: 426, y: 106, size: 92, color: NAVY, delay: 7, rotate: -7},
  {x: 182, y: 206, size: 138, color: OCKER, delay: 10, rotate: 15},
  {x: 350, y: 214, size: 178, color: NAVY, delay: 14, rotate: -11},
  {x: 72, y: 316, size: 88, color: OCKER, delay: 18, rotate: 8},
  {x: 246, y: 334, size: 164, color: NAVY, delay: 21, rotate: -16},
  {x: 434, y: 342, size: 126, color: OCKER, delay: 25, rotate: 12},
  {x: 142, y: 438, size: 146, color: NAVY, delay: 29, rotate: -8},
  {x: 366, y: 452, size: 190, color: OCKER, delay: 33, rotate: 7},
];

const QuestionMarkBurst: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <g>
      {questionMarks.map((mark) => {
        const start = 676 + mark.delay;
        const opacity = interpolate(frame, [start, start + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const scale = interpolate(frame, [start, start + 7, start + 13], [0, 1.18, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <text
            key={`${mark.x}-${mark.y}`}
            x={mark.x}
            y={mark.y}
            textAnchor="middle"
            dominantBaseline="central"
            opacity={opacity}
            fill={mark.color}
            fontFamily={FONT}
            fontWeight={800}
            fontSize={mark.size}
            transform={`translate(${mark.x} ${mark.y}) rotate(${mark.rotate}) scale(${scale}) translate(${-mark.x} ${-mark.y})`}
          >
            ?
          </text>
        );
      })}
    </g>
  );
};

// Szene 4 – 1 / 2 / 3 Flaschen in drei Reihen mit Preisschildern
export const Scene04Counting: React.FC = () => {
  const pop = usePop();
  const rows: {y: number; n: number; price: string; bottleDelay: number; priceDelay: number}[] = [
    {y: -3.4, n: 1, price: '4.50', bottleDelay: 0, priceDelay: 8.49},
    {y: 136.6, n: 2, price: '8.20', bottleDelay: 2.18, priceDelay: 12.18},
    {y: 276.6, n: 3, price: '9.90', bottleDelay: 4.66, priceDelay: 16.83},
  ];
  return (
    <Canvas>
      <g transform="translate(38.8 40.5) scale(0.83)">
        {rows.map((r) => (
          <React.Fragment key={r.price}>
            <g style={pop(r.bottleDelay)}>
              {Array.from({length: r.n}, (_, i) => (
                <g key={i} transform={`translate(${BOTTLE_X[i]} ${r.y}) scale(0.45)`}>
                  <BottleSmall />
                </g>
              ))}
            </g>
            <g transform={`translate(440.6 ${r.y + 103.4})`}>
              <g style={pop(r.priceDelay)}>
                <PriceTag price={r.price} />
              </g>
            </g>
          </React.Fragment>
        ))}
        <QuestionMarkBurst />
      </g>
    </Canvas>
  );
};

export const SceneBottleQuestion: React.FC = () => {
  const pop = usePop();

  return (
    <Canvas>
      <g transform="translate(-17 0)">
        <g style={pop(0)}>
          <g transform="translate(-11 75) scale(0.65)">
            <BottleSmall />
          </g>
          <text
            x={270}
            y={245}
            textAnchor="middle"
            dominantBaseline="central"
            style={{fontFamily: FONT, fontWeight: 800, fontSize: 72, fill: NAVY}}
          >
            =
          </text>
          <text
            x={382}
            y={245}
            textAnchor="middle"
            dominantBaseline="central"
            style={{fontFamily: FONT, fontWeight: 800, fontSize: 96, fill: OCKER}}
          >
            ?
          </text>
        </g>
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
export const Scene06TwoBottles: React.FC = () => {
  const pop = usePop();

  return (
    <Canvas>
      <g transform="translate(38.8 40.5) scale(0.83)">
        <g style={pop(0)}>
          {Array.from({length: 2}, (_, i) => (
            <g key={i} transform={`translate(${BOTTLE_X[i]} -3.4) scale(0.45)`}>
              <BottleSmall />
            </g>
          ))}
        </g>
        <g transform="translate(440.6 100)">
          <g style={pop(1.42)}>
            <PriceTag price="8.20" />
          </g>
        </g>
      </g>

      <g style={pop(18.63)}>
        <text x={240} y={330} textAnchor="middle" style={bigText}>
          8.20 : 2
        </text>
      </g>
      <g style={pop(22.13)}>
        <text x={240} y={390} textAnchor="middle" style={bigText}>
          = 4.10
        </text>
      </g>
    </Canvas>
  );
};
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
      <line x1={72} y1={184} x2={408} y2={184} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={7} />
      <line x1={72} y1={296} x2={408} y2={296} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={7} />
      <line x1={230} y1={84} x2={230} y2={396} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={7} />
      <line x1={319} y1={84} x2={319} y2={396} vectorEffect="non-scaling-stroke" stroke={NAVY} strokeWidth={7} />
      {rows.map((r) => (
        <React.Fragment key={r.y}>
          {Array.from({length: r.n}, (_, i) => (
            <g key={i} transform={`translate(${37.2 + i * 48} ${r.y - 51}) scale(0.22)`}>
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
