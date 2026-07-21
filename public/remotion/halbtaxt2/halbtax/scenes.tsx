import React from 'react';
import {NAVY, OCKER, FONT, Canvas, useSec, pop, lin, ease, kf, money, TrainPaths, TicketPaths} from './shared';

const stroked = (sw: number): React.CSSProperties => ({fill: 'none', stroke: NAVY, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round'});
const num = (size: number, fill = NAVY): React.CSSProperties => ({fontFamily: FONT, fontWeight: 800, fontSize: size, fill, fontVariantNumeric: 'tabular-nums'});

// ---- Szene 1 – Zug ----
export const S1Train: React.FC = () => {
  const s = useSec();
  return (
    <Canvas label="Ein Zug von der Seite">
      <g style={{...pop(s, 0.1), ...stroked(11.83)}}>
        <g transform="translate(66.9 56.2) scale(0.507)"><TrainPaths /></g>
      </g>
    </Canvas>
  );
};

// ---- Szene 2 – Abo-Karte (Monatsabo) ----
export const S2Card: React.FC = () => {
  const s = useSec();
  return (
    <Canvas label="Eine Abo-Karte mit Zug und Kalender">
      <g style={pop(s, 0.1)}><rect x={72} y={134} width={336} height={212} rx={18} style={{fill: '#fff', stroke: NAVY, strokeWidth: 6}} /></g>
      <g style={{...pop(s, 0.4), ...stroked(22.2)}}><g transform="translate(100.8 107.1) scale(0.27)"><TrainPaths /></g></g>
      <g style={pop(s, 0.6)}>
        <line x1={104} y1={278} x2={240} y2={278} style={{stroke: NAVY, strokeWidth: 6, strokeLinecap: 'round'}} />
        <line x1={104} y1={294} x2={196} y2={294} style={{stroke: NAVY, strokeWidth: 6, strokeLinecap: 'round'}} />
      </g>
      <g transform="translate(309.3 244.1) scale(3.2)" style={{...stroked(1.88)}}>
        <g style={pop(s, 0.7)}>
          <path d="M8 2v4" /><path d="M16 2v4" /><rect width={18} height={18} x={3} y={4} rx={2} /><path d="M3 10h18" />
        </g>
      </g>
    </Canvas>
  );
};

// ---- Szene 3 – Liniennetz (Zone + Fahrten hinaus + Tickets) ----
const NetTicket: React.FC<{tx: number; ty: number; op: number}> = ({tx, ty, op}) => (
  <g transform={`translate(${tx} ${ty}) scale(0.16)`} style={{opacity: op, transition: 'opacity 0.35s ease-out'}}>
    <rect x={7.5} y={7.5} width={497} height={301.1} rx={20} fill="#fff" stroke="none" />
    <g style={stroked(37.5)}>
      <path d="M504.5,241.3v53.6c0,7.6-6.1,13.7-13.7,13.7H21.2c-7.6,0-13.7-6.1-13.7-13.7V21.2c0-7.6,6.1-13.7,13.7-13.7h469.6c7.6,0,13.7,6.1,13.7,13.7v224" />
      <line x1={7.5} y1={98.9} x2={504.5} y2={98.9} />
    </g>
  </g>
);
export const S3Net: React.FC = () => {
  const s = useSec(16 / 12.1); // volle 16s-Tour über die Szenendauer
  const nt = Math.min(s, 16);
  const pts: number[][] = [[204,186],[240,226],[300,290],[316,189],[204,186],[194,248],[300,290],[240,226],[204,186],[316,189],[392,152],[316,189],[194,248],[88,300],[194,248],[204,186],[120,96],[204,186],[240,226],[300,290],[360,354]];
  const prog = Math.min(nt / (0.94 * 16), 1) * (pts.length - 1);
  const i = Math.min(Math.floor(prog), pts.length - 2);
  const f = prog - i;
  const nx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f;
  const ny = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
  const stations = [[88,300],[194,248],[316,189],[392,152],[120,96],[204,186],[300,290],[360,354],[240,226]];
  return (
    <Canvas label="ÖV-Liniennetz mit Zentrumszone">
      <g style={pop(s, 0.1)}>
        <polygon points="136 208 228 116 344 139 369 254 286 343 157 311" style={{fill: 'none', stroke: OCKER, strokeWidth: 6, strokeLinejoin: 'round', opacity: 0.8}} />
        <line x1={88} y1={300} x2={392} y2={152} style={{stroke: NAVY, strokeWidth: 6, strokeLinecap: 'round'}} />
        <line x1={120} y1={96} x2={360} y2={354} style={{stroke: NAVY, strokeWidth: 6, strokeLinecap: 'round'}} />
        <polygon points="204 186 316 189 300 290 194 248" style={{fill: 'none', stroke: NAVY, strokeWidth: 6, strokeLinejoin: 'round'}} />
        {stations.map(([x, y], k) => <circle key={k} cx={x} cy={y} r={8} style={{fill: '#fff', stroke: NAVY, strokeWidth: 6}} />)}
      </g>
      <NetTicket tx={299} ty={66.7} op={prog >= 10 ? 1 : 0} />
      <NetTicket tx={109} ty={274.7} op={prog >= 13 ? 1 : 0} />
      <NetTicket tx={127} ty={115.7} op={prog >= 16 ? 1 : 0} />
      <NetTicket tx={319} ty={372.7} op={prog >= 20 ? 1 : 0} />
      <circle cx={nx} cy={ny} r={11} fill={OCKER} />
    </Canvas>
  );
};

// vollständiges Ticket (mit Kreisen), Styling erbt vom Eltern-<g stroke>
const FullTicket: React.FC = () => (
  <><rect x={7.5} y={7.5} width={497} height={301.1} rx={13.7} fill="#fff" stroke="none" /><TicketPaths /></>
);

// ---- Szene 4 – Tickets zählen ----
export const S4Tickets: React.FC = () => {
  const s = useSec(8 / 2.42);
  const t = Math.min(s, 8);
  const seg = (a: number, b: number, from: number, to: number) => (t <= a ? from : t >= b ? to : from + (to - from) * ((t - a) / (b - a)));
  const amount = t < 1.0 ? 0 : t < 2.2 ? seg(1.0, 1.8, 0, 6.70) : t < 3.9 ? seg(2.7, 3.5, 6.70, 23.40) : seg(4.4, 5.2, 23.40, 47.80);
  const o = (a: number) => (t >= a ? 1 : 0);
  const tr: React.CSSProperties = {transition: 'opacity 0.4s ease-out'};
  return (
    <Canvas label="Drei Tickets, ein Zähler zählt hoch">
      <g style={stroked(20.7)}>
        <g transform="translate(14 0)">
          <g transform="translate(86 84) rotate(-9) scale(0.29)" style={{opacity: o(0.3), ...tr}}><FullTicket /></g>
          <g transform="translate(210 106) rotate(7) scale(0.29)" style={{opacity: o(2.2), ...tr}}><FullTicket /></g>
          <g transform="translate(148 130) scale(0.29)" style={{opacity: o(3.9), ...tr}}><g transform="rotate(-20 504.5 7.5)"><FullTicket /></g></g>
        </g>
      </g>
      <text x={240} y={372} textAnchor="middle" style={num(60)}>{money(amount)}</text>
    </Canvas>
  );
};

// ---- Szene 5 – Halbtax-Karte: Ticket schneiden 10 → 5 ----
const CardTop: React.FC<{scale: number; tx: number; ty: number; sw: number}> = ({scale, tx, ty, sw}) => (
  <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
    <rect x={72} y={134} width={336} height={212} rx={18} style={{fill: '#fff', stroke: NAVY, strokeWidth: sw}} />
    <g style={{...stroked(6 / 0.27)}}><g transform="translate(100.8 107.1) scale(0.27)"><TrainPaths /></g></g>
    <line x1={104} y1={278} x2={240} y2={278} style={{stroke: NAVY, strokeWidth: sw, strokeLinecap: 'round'}} />
    <line x1={104} y1={294} x2={196} y2={294} style={{stroke: NAVY, strokeWidth: sw, strokeLinecap: 'round'}} />
    <text x={346} y={290} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 60, fill: NAVY}}>1/2</text>
  </g>
);
export const S5Cut: React.FC = () => {
  // Szene 21.40s – Einzelpass. Schnitt liegt auf „Ein Ticket für 10 Franken … nur noch 5 Franken“ (lokal 11.57–15.44s).
  const t = useSec();
  const leftOp = t < 1.0 ? 0 : lin(t, 1.0, 1.5, 0, 1);
  const rightOp = t < 1.0 ? 0 : t < 1.5 ? lin(t, 1.0, 1.5, 0, 1) : t < 15.0 ? 1 : t < 15.6 ? lin(t, 15.0, 15.6, 1, 0) : 0;
  const cutLen = 117;
  const dashOff = t < 11.57 ? cutLen : t < 14.8 ? lin(t, 11.57, 14.8, cutLen, 0) : 0;
  const cutOp = t < 15.2 ? 1 : t < 15.8 ? lin(t, 15.2, 15.8, 1, 0) : 0;
  const sy = t < 11.2 ? 0 : t < 11.57 ? lin(t, 11.2, 11.57, 0, 6) : t < 14.8 ? lin(t, 11.57, 14.8, 6, 118) : 118;
  const scOp = t < 11.2 ? 0 : t < 11.57 ? lin(t, 11.2, 11.57, 0, 1) : t < 14.8 ? 1 : t < 15.2 ? lin(t, 14.8, 15.2, 1, 0) : 0;
  const price = money(t <= 11.57 ? 10 : t >= 15.0 ? 5 : 10 + (5 - 10) * ((t - 11.57) / 3.43), 2);
  return (
    <Canvas label="Halbtax-Karte, Ticket wird halbiert">
      <g style={pop(t, 0.1)}><CardTop scale={0.8} tx={48} ty={-35.2} sw={7.5} /></g>
      <g style={stroked(18.8)}>
        <g transform="translate(73.1 275.7) scale(0.32)">
          <g style={{clipPath: 'inset(0 50% 0 0)', opacity: leftOp}}><FullTicket /></g>
          <g style={{clipPath: 'inset(0 0 0 50%)', opacity: rightOp}}><FullTicket /></g>
        </g>
      </g>
      <line x1={155} y1={278.1} x2={155} y2={374.5} pathLength={cutLen} style={{stroke: OCKER, strokeWidth: 6, strokeLinecap: 'round', strokeDasharray: cutLen, strokeDashoffset: dashOff, opacity: cutOp}} />
      <g style={{opacity: scOp}}>
        <g transform={`translate(155 ${261.7 + sy}) rotate(90) scale(2.2) translate(-12 -12)`} style={{fill: 'none', stroke: OCKER, strokeWidth: 2.73, strokeLinecap: 'round', strokeLinejoin: 'round'}}>
          <circle cx={6} cy={6} r={3} /><path d="M8.12 8.12 20 20" /><path d="M20 4 8.12 15.88" /><circle cx={6} cy={18} r={3} />
        </g>
      </g>
      <text x={320} y={304} textAnchor="middle" dominantBaseline="central" style={num(40)}>{price}</text>
    </Canvas>
  );
};

// ---- Szene 6 – Halbtax-Preis: 190/Jahr → 16/Monat + Fragezeichen ----
const Q: React.FC<{x: number; y: number; rot: number; size: number; fill: string; start: number; t: number}> = ({x, y, rot, size, fill, start, t}) => {
  const op = t < start ? 0 : 1;
  const sc = t < start ? 0.3 : t < start + 0.32 ? lin(t, start, start + 0.32, 0.3, 1.1) : t < start + 0.48 ? lin(t, start + 0.32, start + 0.48, 1.1, 1) : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <text x={0} y={0} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: size, fill, opacity: op, transform: `scale(${sc})`, transformBox: 'fill-box', transformOrigin: '50% 50%'}}>?</text>
    </g>
  );
};
export const S6Price: React.FC = () => {
  // Szene 38.08s – Einzelpass. Flip 190→16 auf „pro Monat etwa 16 Franken“ (lokal 6.5s), danach Fragezeichen.
  const s = useSec();
  const t = s;
  const aOn = t < 6.5 ? 1 : t < 6.9 ? lin(t, 6.5, 6.9, 1, 0) : 0;
  const bOn = t < 6.5 ? 0 : t < 6.9 ? lin(t, 6.5, 6.9, 0, 1) : 1;
  return (
    <Canvas label="Halbtax kostet 190 pro Jahr, etwa 16 pro Monat">
      <g style={pop(s, 0.1)}><rect x={72} y={134} width={336} height={212} rx={18} style={{fill: '#fff', stroke: NAVY, strokeWidth: 6}} /></g>
      <g style={{...pop(s, 0.4), ...stroked(22.2)}}><g transform="translate(100.8 107.1) scale(0.27)"><TrainPaths /></g></g>
      <g style={pop(s, 0.6)}>
        <line x1={104} y1={278} x2={240} y2={278} style={{stroke: NAVY, strokeWidth: 6, strokeLinecap: 'round'}} />
        <line x1={104} y1={294} x2={196} y2={294} style={{stroke: NAVY, strokeWidth: 6, strokeLinecap: 'round'}} />
      </g>
      <text x={346} y={290} textAnchor="middle" dominantBaseline="central" style={{...pop(s, 0.7), fontFamily: FONT, fontWeight: 800, fontSize: 60, fill: NAVY}}>1/2</text>
      <g transform="translate(240 240) rotate(-8)" style={pop(s, 1.3)}>
        <rect x={-124} y={-38} width={248} height={76} rx={14} fill={OCKER} />
        <text x={0} y={1} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, fill: '#fff', opacity: aOn}}>CHF 190.--</text>
        <text x={0} y={1} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, fill: '#fff', opacity: bOn}}>CHF 16.--</text>
      </g>
      <g style={pop(s, 1.5)}>
        <text x={240} y={392} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, fill: NAVY, opacity: aOn}}>pro Jahr</text>
        <text x={240} y={392} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, fill: NAVY, opacity: bOn}}>pro Monat</text>
      </g>
      <Q x={120} y={96} rot={-14} size={80} fill={OCKER} start={7.0} t={t} />
      <Q x={392} y={118} rot={12} size={100} fill={NAVY} start={7.3} t={t} />
      <Q x={330} y={78} rot={-8} size={64} fill={OCKER} start={7.6} t={t} />
      <Q x={206} y={74} rot={6} size={68} fill={NAVY} start={7.3} t={t} />
      <Q x={402} y={226} rot={-12} size={88} fill={OCKER} start={7.9} t={t} />
      <Q x={348} y={420} rot={-10} size={88} fill={OCKER} start={7.0} t={t} />
    </Canvas>
  );
};

// ---- Szene 7 – Zürich–Luzern retour: 50 → 25 ----
export const S7Route: React.FC = () => {
  // Szene 48.25s – Einzelpass. Reise auf „von Zürich nach Luzern“, 50 auf lokal 4.78s, Halbierung auf 25 ab 8.37s.
  const s = useSec();
  const t = s;
  const d = kf(t, [[0, 0], [0.5, 0], [2.2, 100], [3.9, 0], [13.17, 0]]);
  const dx = 96 + (384 - 96) * (d / 100);
  const half = t >= 8.37 ? (t < 8.7 ? lin(t, 8.37, 8.7, 0, 1) : 1) : 0;
  const p6c = t < 8.37 ? NAVY : OCKER;
  const price6 = money(t < 4.78 ? 0 : t < 6.0 ? ease(t, 4.78, 6.0, 0, 50) : t < 8.5 ? 50 : t < 10.0 ? ease(t, 8.5, 10.0, 50, 25) : 25);
  return (
    <Canvas label="Zürich–Luzern retour, mit Halbtax halber Preis">
      <g style={pop(s, 0.1)}>
        <path d="M 96 146 L 384 146" style={{fill: 'none', stroke: NAVY, strokeWidth: 6, strokeLinecap: 'round', strokeDasharray: '0.5 16', opacity: 0.45}} />
        <circle cx={96} cy={146} r={9} fill={NAVY} /><circle cx={384} cy={146} r={9} fill={NAVY} />
        <text x={96} y={204} textAnchor="middle" style={{fontFamily: FONT, fontWeight: 800, fontSize: 28, fill: NAVY}}>Zürich</text>
        <text x={384} y={204} textAnchor="middle" style={{fontFamily: FONT, fontWeight: 800, fontSize: 28, fill: NAVY}}>Luzern</text>
      </g>
      <circle cx={dx} cy={146} r={9} fill={OCKER} />
      <g style={stroked(18.8)}><g transform="translate(73.1 268) scale(0.32)"><g style={pop(s, 0.5)}><FullTicket /></g></g></g>
      <text x={199} y={333} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 36, fill: OCKER, opacity: half}}>1/2</text>
      <text x={320} y={297} textAnchor="middle" dominantBaseline="central" style={num(40, p6c)}>{price6}</text>
    </Canvas>
  );
};

// ---- Szene 8 – Rechnung: 600 vs 300+190 ----
const PlainTicket: React.FC<{x: number; y: number; price: string; op: number}> = ({x, y, price, op}) => (
  <g transform={`translate(${x} ${y}) scale(0.113)`} style={{opacity: op, transition: 'opacity 0.35s ease-out'}}>
    <rect x={7.5} y={7.5} width={497} height={301.1} rx={13.7} fill="#fff" stroke="none" />
    <g style={stroked(23)}>
      <path d="M504.5,241.3v53.6c0,7.6-6.1,13.7-13.7,13.7H21.2c-7.6,0-13.7-6.1-13.7-13.7V21.2c0-7.6,6.1-13.7,13.7-13.7h469.6c7.6,0,13.7,6.1,13.7,13.7v224" />
      <line x1={7.5} y1={98.9} x2={504.5} y2={98.9} />
      <line x1={48} y1={53.2} x2={200} y2={53.2} />
    </g>
    <text x={256} y={212} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 96, fill: NAVY}}>{price}</text>
  </g>
);
export const S8Invoice: React.FC = () => {
  // Szene 61.44s – Einzelpass. 600 auf lokal 0–3.7s, 25er-Tickets ab 5.0s, +190/=490 ab 9.74s.
  const r = useSec();
  const cols = [72, 141.5, 211, 280.5];
  return (
    <Canvas label="Einzeltickets werden mit dem Halbtax-Preis verglichen">
      {[96, 138, 180].map((y, ri) => cols.map((x, ci) => <PlainTicket key={`u${ri}${ci}`} x={x} y={y} price="50.00" op={r >= 0.3 + (ri * 4 + ci) * 0.22 ? 1 : 0} />))}
      {[264, 306, 348].map((y, ri) => cols.map((x, ci) => <PlainTicket key={`l${ri}${ci}`} x={x} y={y} price="25.00" op={r >= 5.0 + (ri * 4 + ci) * 0.22 ? 1 : 0} />))}
      <PlainTicket x={350} y={348} price="190.00" op={r >= 9.74 ? 1 : 0} />
      <g style={{opacity: r >= 2.9 ? 1 : 0, transition: 'opacity 0.4s ease-out'}}>
        <rect x={96} y={129} width={288} height={54} rx={14} fill={OCKER} />
        <text x={240} y={157} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 24, fill: '#fff'}}>12 × 50 = 600</text>
      </g>
      <g style={{opacity: r >= 10.6 ? 1 : 0, transition: 'opacity 0.4s ease-out'}}>
        <rect x={96} y={297} width={288} height={54} rx={14} fill={OCKER} />
        <text x={240} y={325} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 24, fill: '#fff'}}>12 × 25 + 190 = 490</text>
      </g>
    </Canvas>
  );
};

// ---- Szene 9 – Fazit: Smiley + 110 sparen ----
export const S9Smile: React.FC = () => {
  const s = useSec(6 / 4.04);
  const p = s < 0.5 ? 0 : s > 4.5 ? 1 : (s - 0.5) / 4;
  const cy = 211 + 34 * p;
  return (
    <Canvas label="Smiley, Betrag zählt auf 110 hoch">
      <g style={pop(s, 0.1)}>
        <circle cx={240} cy={188} r={92} style={{fill: 'none', stroke: NAVY, strokeWidth: 6}} />
        <circle cx={210} cy={164} r={9} fill={NAVY} /><circle cx={270} cy={164} r={9} fill={NAVY} />
        <path d={`M 205 211 Q 240 ${cy.toFixed(1)} 275 211`} style={{fill: 'none', stroke: NAVY, strokeWidth: 6, strokeLinecap: 'round'}} />
      </g>
      <text x={240} y={360} textAnchor="middle" style={num(69, OCKER)}>{money(p * 110, 6)}</text>
    </Canvas>
  );
};
