import React from 'react';
import {interpolate} from 'remotion';
import {Canvas, NAVY, OCKER, GREY, FONT, Train, Ticket, useSec, pop, smooth} from './shared';

const follow = (pts: number[][], p: number) => {
  const segs = pts.length - 1;
  const x = Math.min(Math.max(p, 0), 1) * segs;
  const i = Math.min(Math.floor(x), segs - 1);
  const f = x - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
};
const bigText = {fontFamily: FONT, fontWeight: 800, fontSize: 40, fill: NAVY} as const;
const money = (v: number) => (Math.round(v / 0.05) * 0.05).toFixed(2);

// 1 – Zug
export const S1Train: React.FC = () => {
  const s = useSec();
  return <Canvas><g style={pop(s, 0.1)}><g transform="translate(66.9 56.2) scale(0.507)"><Train scale={0.507} /></g></g></Canvas>;
};

const STATIONS = [[88,300],[194,248],[316,189],[392,152],[120,96],[204,186],[300,290],[360,354],[240,226]];
const Net: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <g>
    <polygon points="136 208 228 116 344 139 369 254 286 343 157 311" style={{fill: 'none', stroke: OCKER, strokeWidth: 6, strokeLinejoin: 'round', opacity: 0.8}} />
    <line x1={88} y1={300} x2={392} y2={152} style={{stroke: NAVY, strokeWidth: 6, strokeLinecap: 'round'}} />
    <line x1={120} y1={96} x2={360} y2={354} style={{stroke: NAVY, strokeWidth: 6, strokeLinecap: 'round'}} />
    <polygon points="204 186 316 189 300 290 194 248" style={{fill: 'none', stroke: NAVY, strokeWidth: 6, strokeLinejoin: 'round'}} />
    {STATIONS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={8} style={{fill: '#fff', stroke: NAVY, strokeWidth: 6}} />)}
    {children}
  </g>
);

// 2 – Zone: unbeschränkt fahren (Punkt kreist innerhalb der Zone)
export const S2Zone: React.FC = () => {
  const s = useSec();
  const tour = [[204,186],[240,226],[300,290],[316,189],[240,226],[194,248],[204,186]];
  const [x, y] = follow(tour, (s % 5.6) / 5.6);
  return <Canvas><g style={pop(s, 0.1)}><Net /><circle cx={x} cy={y} r={11} fill={OCKER} /></g></Canvas>;
};

// 3 – andere Strecken: Punkt fährt raus, Tickets erscheinen
export const S3Leave: React.FC = () => {
  const s = useSec();
  const route = [[240,226],[392,152],[240,226],[88,300],[240,226],[120,96],[240,226],[360,354]];
  const p = smooth(s, 0.3, 6.0, 0, 1);
  const [x, y] = follow(route, p);
  const seg = p * (route.length - 1);
  const tks: [number, number, number][] = [[352,110,2],[128,300,4],[168,128,6],[322,338,7]];
  return (
    <Canvas>
      <g style={pop(s, 0.1)}><Net /></g>
      {tks.map(([tx, ty, k], i) => (
        <g key={i} transform={`translate(${tx - 41} ${ty - 25.3}) scale(0.16)`} style={{opacity: seg >= k - 0.5 ? 1 : 0}}>
          <Ticket scale={0.16} header={false} />
        </g>
      ))}
      <circle cx={x} cy={y} r={11} fill={OCKER} />
    </Canvas>
  );
};

// 4 – teuer: Tickets stapeln, Betrag klettert
export const S4Expensive: React.FC = () => {
  const s = useSec();
  const amt = smooth(s, 0.2, 2.2, 0, 150);
  const tks = [[150,70,-9,0.1],[210,86,7,0.4],[176,120,-4,0.7]];
  return (
    <Canvas>
      {tks.map(([x, y, r, d], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(0.29)`}><g style={pop(s, d as number)}>
          <Ticket scale={0.29} price="50.00" />
        </g></g>
      ))}
      <text x={240} y={392} textAnchor="middle" style={{...bigText, fontSize: 72, fill: OCKER, fontVariantNumeric: 'tabular-nums'}}>{money(amt)}</text>
    </Canvas>
  );
};

const Card: React.FC<{scale?: number; tx?: number; ty?: number; half?: boolean}> = ({scale = 1, tx = 0, ty = 0, half = true}) => {
  const sw = 6 / scale;
  return (
    <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
      <rect x={72} y={134} width={336} height={212} rx={18} style={{fill: '#fff', stroke: NAVY, strokeWidth: sw}} />
      <g transform="translate(100.8 107.1) scale(0.27)"><Train scale={0.27 * scale} /></g>
      <line x1={104} y1={278} x2={240} y2={278} style={{stroke: NAVY, strokeWidth: sw, strokeLinecap: 'round'}} />
      <line x1={104} y1={294} x2={196} y2={294} style={{stroke: NAVY, strokeWidth: sw, strokeLinecap: 'round'}} />
      {half && <text x={346} y={290} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 60 / 1, fill: NAVY}}>1/2</text>}
    </g>
  );
};

// 5 – Halbtax / halber Preis / 50%
export const S5Card: React.FC = () => {
  const s = useSec();
  return (
    <Canvas>
      <g style={pop(s, 0.2)}><Card /></g>
      <g style={pop(s, 5.5)}>
        <rect x={96} y={392} width={288} height={54} rx={14} fill={OCKER} />
        <text x={240} y={420} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, fill: '#fff'}}>50% Rabatt</text>
      </g>
    </Canvas>
  );
};

// 6 – 10 → 5 (Ticket schneiden)
export const S6Cut: React.FC = () => {
  const s = useSec();
  const price = money(smooth(s, 1.4, 3.6, 10, 5));
  const cut = interpolate(s, [1.2, 3.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scissorY = interpolate(cut, [0, 1], [262, 380]);
  const rightGone = s > 3.4 ? interpolate(s, [3.4, 4.2], [1, 0], {extrapolateRight: 'clamp'}) : 1;
  return (
    <Canvas>
      <g style={pop(s, 0.1)}><Card scale={0.8} tx={48} ty={-35.2} /></g>
      <g transform="translate(158 297) scale(0.32)">
        <g style={{clipPath: 'inset(0 50% 0 0)'}}><Ticket scale={0.32} /></g>
        <g style={{clipPath: 'inset(0 0 0 50%)', opacity: rightGone}}><Ticket scale={0.32} /></g>
      </g>
      <text x={320} y={318} textAnchor="middle" dominantBaseline="central" style={{...bigText, fill: rightGone < 0.5 ? OCKER : NAVY}}>{price}</text>
      <line x1={155} y1={278} x2={155} y2={scissorY} style={{stroke: OCKER, strokeWidth: 6, strokeLinecap: 'round'}} />
      <g transform={`translate(155 ${scissorY}) rotate(90) scale(2.2) translate(-12 -12)`} style={{fill: 'none', stroke: OCKER, strokeWidth: 2.73, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: cut > 0 && cut < 1 ? 1 : 0}}>
        <circle cx={6} cy={6} r={3} /><path d="M8.12 8.12 20 20" /><path d="M20 4 8.12 15.88" /><circle cx={6} cy={18} r={3} />
      </g>
    </Canvas>
  );
};

// 7 – 190 pro Jahr → 16 pro Monat
export const S7Price: React.FC = () => {
  const s = useSec();
  const monat = s >= 6.5;
  return (
    <Canvas>
      <g style={pop(s, 0.1)}><Card /></g>
      <g transform="translate(240 240) rotate(-8)" style={pop(s, 2.5)}>
        <rect x={-124} y={-38} width={248} height={76} rx={14} fill={OCKER} />
        <text x={0} y={1} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, fill: '#fff'}}>{monat ? 'CHF 16.--' : 'CHF 190.--'}</text>
      </g>
      <text x={240} y={392} textAnchor="middle" dominantBaseline="central" style={bigText}>{monat ? 'pro Monat' : 'pro Jahr'}</text>
    </Canvas>
  );
};

// 8 – Zürich–Luzern retour: 50, dann mit Halbtax 25
export const S8Route: React.FC = () => {
  const s = useSec();
  const halb = s >= 8.37;
  const t = Math.min(s, 8.0);
  const rideP = (t % 4.0) / 4.0;
  const dx = interpolate(rideP < 0.5 ? rideP * 2 : (1 - rideP) * 2, [0, 1], [96, 384]);
  const price = halb ? money(smooth(s, 8.5, 11.0, 50, 25)) : money(smooth(s, 0.3, 3.5, 0, 50));
  return (
    <Canvas>
      <g style={pop(s, 0.1)}>
        <line x1={96} y1={146} x2={384} y2={146} style={{fill: 'none', stroke: NAVY, strokeWidth: 6, strokeLinecap: 'round', strokeDasharray: '0.5 16', opacity: 0.45}} />
        <circle cx={96} cy={146} r={9} fill={NAVY} /><circle cx={384} cy={146} r={9} fill={NAVY} />
        <text x={96} y={204} textAnchor="middle" style={{...bigText, fontSize: 28}}>Zürich</text>
        <text x={384} y={204} textAnchor="middle" style={{...bigText, fontSize: 28}}>Luzern</text>
      </g>
      <circle cx={dx} cy={146} r={9} fill={OCKER} />
      <g transform="translate(73.1 268) scale(0.32)"><g style={pop(s, 0.5)}><Ticket scale={0.32} /></g></g>
      {halb && <text x={196} y={322} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, fill: OCKER}}>1/2</text>}
      <text x={320} y={318} textAnchor="middle" dominantBaseline="central" style={{...bigText, fill: halb ? OCKER : NAVY, fontVariantNumeric: 'tabular-nums'}}>{price}</text>
    </Canvas>
  );
};

// 9 – Rechnung: 600 vs 300+190
const InvTicket: React.FC<{x: number; y: number; price: string; show: boolean}> = ({x, y, price, show}) => (
  <g transform={`translate(${x} ${y}) scale(0.113)`} style={{opacity: show ? 1 : 0}}>
    <rect x={7.5} y={7.5} width={497} height={301.1} rx={13.7} fill="#fff" stroke="none" />
    <path d="M504.5,241.3v53.6c0,7.6-6.1,13.7-13.7,13.7H21.2c-7.6,0-13.7-6.1-13.7-13.7V21.2c0-7.6,6.1-13.7,13.7-13.7h469.6c7.6,0,13.7,6.1,13.7,13.7v224" style={{fill: 'none', stroke: NAVY, strokeWidth: 23, strokeLinecap: 'round', strokeLinejoin: 'round'}} />
    <line x1={7.5} y1={98.9} x2={504.5} y2={98.9} style={{stroke: NAVY, strokeWidth: 23, strokeLinecap: 'round'}} />
    <line x1={48} y1={53.2} x2={200} y2={53.2} style={{stroke: NAVY, strokeWidth: 23, strokeLinecap: 'round'}} />
    <text x={256} y={212} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 96, fill: NAVY}}>{price}</text>
  </g>
);
export const S9Invoice: React.FC = () => {
  const s = useSec();
  const cols = [72, 141.5, 211, 280.5];
  const up = (i: number) => s >= 0.3 + i * 0.15;
  const lo = (i: number) => s >= 5.2 + i * 0.15;
  return (
    <Canvas>
      {[96, 138, 180].map((y, r) => cols.map((x, c) => <InvTicket key={`u${r}${c}`} x={x} y={y} price="50.00" show={up(r * 4 + c)} />))}
      {[264, 306, 348].map((y, r) => cols.map((x, c) => <InvTicket key={`l${r}${c}`} x={x} y={y} price="25.00" show={lo(r * 4 + c)} />))}
      <InvTicket x={350} y={348} price="190.00" show={s >= 9.8} />
      <g style={{opacity: s >= 4.6 ? 1 : 0}}>
        <rect x={96} y={129} width={288} height={54} rx={14} fill={OCKER} />
        <text x={240} y={156} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 24, fill: '#fff'}}>12 × 50 = 600</text>
      </g>
      <g style={{opacity: s >= 11.0 ? 1 : 0}}>
        <rect x={96} y={297} width={288} height={54} rx={14} fill={OCKER} />
        <text x={240} y={324} textAnchor="middle" dominantBaseline="central" style={{fontFamily: FONT, fontWeight: 800, fontSize: 24, fill: '#fff'}}>12 × 25 + 190 = 490</text>
      </g>
    </Canvas>
  );
};

// 10 – Fazit: Smiley + 110 sparen
export const S10Smile: React.FC = () => {
  const s = useSec();
  const p = smooth(s, 0.5, 3.2, 0, 1);
  const cy = 211 + 34 * p;
  return (
    <Canvas>
      <g style={pop(s, 0.1)}>
        <circle cx={240} cy={188} r={92} style={{fill: 'none', stroke: NAVY, strokeWidth: 6}} />
        <circle cx={210} cy={164} r={9} fill={NAVY} /><circle cx={270} cy={164} r={9} fill={NAVY} />
        <path d={`M 205 211 Q 240 ${cy.toFixed(1)} 275 211`} style={{fill: 'none', stroke: NAVY, strokeWidth: 6, strokeLinecap: 'round'}} />
      </g>
      <text x={240} y={360} textAnchor="middle" style={{fontFamily: FONT, fontWeight: 800, fontSize: 92, fill: OCKER, fontVariantNumeric: 'tabular-nums'}}>{money(p * 110)}</text>
    </Canvas>
  );
};
