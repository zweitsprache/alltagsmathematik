import { interpolate } from "remotion";

const navy = "#1e2c52";
const accent = "#cc6600";
const bottlePath =
    "M 228 146 L 228 162 C 228 176 188 174 188 196 L 188 328 Q 188 350 210 350 L 270 350 Q 292 350 292 328 L 292 196 C 292 174 252 176 252 162 L 252 146 Z";

const cubicPoint = (progress: number, start: number, controlA: number, controlB: number, end: number) => {
    const inverse = 1 - progress;
    return (
        inverse ** 3 * start +
        3 * inverse ** 2 * progress * controlA +
        3 * inverse * progress ** 2 * controlB +
        progress ** 3 * end
    );
};

export const BottleVisual = ({ frame }: { frame: number }) => {
    const liquidOpacity = interpolate(frame, [82, 118], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const turnProgress = interpolate(frame, [130, 160], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const rotation = interpolate(turnProgress, [0, 1], [0, 180]);
    const shakeEnvelope = interpolate(frame, [160, 168, 197, 205], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const shake = frame >= 160 && frame <= 205 ? Math.sin((frame - 160) * 0.82) * 9 * shakeEnvelope : 0;
    const shakeLinesOpacity = interpolate(frame, [158, 166, 198, 207], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const dropProgress = interpolate(frame, [197, 242], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const dropOpacity = interpolate(frame, [194, 199, 230, 246], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const splashOpacity = interpolate(frame, [232, 239, 253], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const exit = interpolate(frame, [260, 285], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <svg
            viewBox="0 0 480 480"
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 1 - exit,
            }}
        >
            <g transform="translate(21.6 -19.9) scale(0.91)">
                <defs>
                    <clipPath id="ama-remotion-bottle-clip">
                        <path d={bottlePath} />
                    </clipPath>
                </defs>
                <g transform={`rotate(${rotation + shake} 240 240)`}>
                    <path d={bottlePath} fill="#ffffff" />
                    <g clipPath="url(#ama-remotion-bottle-clip)">
                        <rect x="198" y="322" width="84" height="18" rx="8" fill={accent} opacity={liquidOpacity} />
                    </g>
                    <path d={bottlePath} fill="none" stroke={navy} strokeWidth="9" strokeLinejoin="round" />
                    <rect x="204" y="212" width="72" height="62" rx="10" fill="none" stroke={navy} strokeWidth="6" />
                    <line x1="220" y1="234" x2="260" y2="234" stroke={accent} strokeWidth="7" strokeLinecap="round" />
                    <line x1="220" y1="252" x2="246" y2="252" stroke={accent} strokeWidth="7" strokeLinecap="round" />
                    <rect x="214" y="118" width="52" height="30" rx="7" fill={navy} />
                    <rect x="232" y="106" width="16" height="14" rx="4" fill={navy} />
                </g>
                <g opacity={shakeLinesOpacity}>
                    <path d="M 152 198 Q 138 240 152 282" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" />
                    <path d="M 128 214 Q 118 240 128 266" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" opacity="0.55" />
                    <path d="M 328 198 Q 342 240 328 282" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" />
                    <path d="M 352 214 Q 362 240 352 266" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" opacity="0.55" />
                </g>
                <g transform={`translate(240 ${372 + dropProgress * 84})`} opacity={dropOpacity}>
                    <path d="M 0 0 C 7 9 11 14 11 19 A 11 11 0 1 1 -11 19 C -11 14 -7 9 0 0 Z" fill={accent} />
                </g>
                <g transform="translate(240 464)" opacity={splashOpacity}>
                    <path d="M -20 0 Q -26 -8 -24 -14" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
                    <path d="M 20 0 Q 26 -8 24 -14" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
                    <circle cx="0" cy="-6" r="4" fill={accent} />
                </g>
            </g>
        </svg>
    );
};

export const RouteVisual = ({ frame }: { frame: number }) => {
    const entrance = interpolate(frame, [260, 285], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const exit = interpolate(frame, [355, 375], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const progress = interpolate(frame, [305, 355], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const firstSegmentProgress = Math.min(1, progress / 0.78);
    const secondSegmentProgress = Math.max(0, (progress - 0.78) / 0.22);
    const dotX =
        progress <= 0.78
            ? cubicPoint(firstSegmentProgress, 148, 240, 170, 250)
            : cubicPoint(secondSegmentProgress, 250, 315, 316, 334);
    const dotY =
        progress <= 0.78
            ? cubicPoint(firstSegmentProgress, 344, 316, 215, 192)
            : cubicPoint(secondSegmentProgress, 192, 174, 172, 150);

    return (
        <svg
            viewBox="0 0 480 480"
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: entrance * (1 - exit),
            }}
        >
            <path
                d="M 148 344 C 240 316 170 215 250 192 C 315 174 316 172 334 150"
                fill="none"
                stroke={navy}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="1 16"
                opacity="0.4"
            />
            <g transform="translate(72 336) scale(2.9)" fill="none" stroke={navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            </g>
            <g transform="translate(338 74) scale(2.9)" fill="none" stroke={navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                <path d="M2 7h20" />
                <path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
            </g>
            <circle cx={dotX} cy={dotY} r="12" fill={accent} stroke="#ffffff" strokeWidth="5" />
        </svg>
    );
};

const FullBottle = ({ clipId = "ama-remotion-full-bottle-clip" }: { clipId?: string }) => (
    <>
        <path d={bottlePath} fill="#ffffff" />
        <rect x="184" y="150" width="112" height="204" clipPath={`url(#${clipId})`} fill={accent} />
        <path d={bottlePath} fill="none" stroke={navy} strokeWidth="9" strokeLinejoin="round" />
        <rect x="204" y="212" width="72" height="62" rx="10" fill="#ffffff" stroke={navy} strokeWidth="6" />
        <line x1="220" y1="234" x2="260" y2="234" stroke={accent} strokeWidth="7" strokeLinecap="round" />
        <line x1="220" y1="252" x2="246" y2="252" stroke={accent} strokeWidth="7" strokeLinecap="round" />
        <rect x="214" y="118" width="52" height="30" rx="7" fill={navy} />
        <rect x="232" y="106" width="16" height="14" rx="4" fill={navy} />
    </>
);

export const SupermarketShelfVisual = ({ frame }: { frame: number }) => {
    const opacity = interpolate(frame, [355, 375, 475, 495], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const reveal = (from: number) =>
        interpolate(frame, [from, from + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
    const shampoo = reveal(370);
    const jar = reveal(385);
    const tube = reveal(400);
    const pump = reveal(415);
    const slimBottle = reveal(430);
    const duo = reveal(445);
    const multipack = reveal(460);

    return (
        <svg
            viewBox="0 0 480 480"
            role="img"
            aria-label="Supermarktregal mit Kosmetikprodukten, einzelner Flasche, Duopack und Multipack"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}
        >
            <defs>
                <clipPath id="rule-three-shelf-bottle-clip">
                    <path d={bottlePath} />
                </clipPath>
            </defs>

            <rect x="72" y="232" width="336" height="8" rx="3" fill={navy} />
            <rect x="72" y="400" width="336" height="8" rx="3" fill={navy} />

            <g opacity={shampoo}>
                <g transform="translate(4.6 77.1) scale(0.42)"><FullBottle clipId="rule-three-shelf-bottle-clip" /></g>
            </g>
            <g opacity={jar}>
                <rect x="145" y="173" width="55" height="50" rx="8" fill="#ffffff" stroke={navy} strokeWidth="6" />
                <rect x="141" y="157" width="63" height="18" rx="6" fill={navy} />
                <line x1="158" y1="199" x2="188" y2="199" stroke={accent} strokeWidth="6" strokeLinecap="round" />
            </g>
            <g opacity={tube}>
                <path d="M 231 210 L 259 210 L 255 146 L 235 146 Z" fill="#ffffff" stroke={navy} strokeWidth="6" strokeLinejoin="round" />
                <rect x="232" y="210" width="26" height="16" rx="3" fill={navy} />
                <line x1="242" y1="184" x2="248" y2="184" stroke={accent} strokeWidth="6" strokeLinecap="round" />
            </g>
            <g opacity={pump}>
                <rect x="288" y="153" width="52" height="70" rx="10" fill="#ffffff" stroke={navy} strokeWidth="6" />
                <rect x="306" y="131" width="16" height="23" fill={navy} />
                <rect x="306" y="125" width="28" height="12" rx="3" fill={navy} />
                <rect x="326" y="125" width="8" height="20" rx="2" fill={navy} />
                <line x1="302" y1="187" x2="326" y2="187" stroke={accent} strokeWidth="6" strokeLinecap="round" />
            </g>
            <g opacity={slimBottle}>
                <rect x="362" y="123" width="38" height="100" rx="9" fill="#ffffff" stroke={navy} strokeWidth="6" />
                <path d="M 372 121 L 372 106 Q 372 102 376 102 L 386 102 Q 390 102 390 106 L 390 121 Z" fill={navy} />
            </g>

            <g opacity={duo}>
                <g transform="translate(4.6 245.1) scale(0.42)"><FullBottle clipId="rule-three-shelf-bottle-clip" /></g>
                <g transform="translate(57.6 245.1) scale(0.42)"><FullBottle clipId="rule-three-shelf-bottle-clip" /></g>
            </g>
            <g opacity={multipack}>
                <g transform="translate(156.6 245.1) scale(0.42)"><FullBottle clipId="rule-three-shelf-bottle-clip" /></g>
                <g transform="translate(209.6 245.1) scale(0.42)"><FullBottle clipId="rule-three-shelf-bottle-clip" /></g>
                <g transform="translate(262.6 245.1) scale(0.42)"><FullBottle clipId="rule-three-shelf-bottle-clip" /></g>
            </g>
        </svg>
    );
};

const PriceTag = ({ y, value, opacity }: { y: number; value: string; opacity: number }) => (
    <g transform={`translate(0 ${y})`} opacity={opacity}>
        <rect x="294" y="-28" width="146" height="56" rx="12" fill="#ffffff" stroke={navy} strokeWidth="6" />
        <text
            x="367"
            y="0"
            dy="0.08em"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Encode Sans Semi Condensed, sans-serif"
            fontWeight="700"
            fontSize="28"
            fill={navy}
        >
            {value}
        </text>
    </g>
);

export const OffersVisual = ({ frame }: { frame: number }) => {
    const sceneOpacity = interpolate(frame, [405, 425], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const single = interpolate(frame, [495, 510], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const duo = interpolate(frame, [555, 570], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const action = interpolate(frame, [630, 645], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const priceOne = interpolate(frame, [715, 730], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const priceTwo = interpolate(frame, [820, 835], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const priceThree = interpolate(frame, [920, 935], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
        <svg viewBox="0 0 480 480" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: sceneOpacity }}>
            <g transform="translate(38.8 40.5) scale(0.83)">
                <defs>
                    <clipPath id="ama-remotion-full-bottle-clip">
                        <path d={bottlePath} />
                    </clipPath>
                </defs>
                <g opacity={single} transform={`translate(-52 ${-15 + 8 * (1 - single)}) scale(0.5)`}>
                    <FullBottle />
                </g>
                <g opacity={duo}>
                    <g transform={`translate(-52 ${125 + 8 * (1 - duo)}) scale(0.5)`}><FullBottle /></g>
                    <g transform={`translate(12 ${125 + 8 * (1 - duo)}) scale(0.5)`}><FullBottle /></g>
                    <rect x="34" y="241.5" width="134" height="40" rx="6" fill={accent} stroke="#ffffff" strokeWidth="3" />
                    <text x="101" y="262.5" textAnchor="middle" dominantBaseline="central" fontFamily="Encode Sans Semi Condensed, sans-serif" fontWeight="700" fontSize="19" fill="#ffffff">Duopack</text>
                </g>
                <g opacity={action}>
                    <g transform={`translate(-52 ${265 + 8 * (1 - action)}) scale(0.5)`}><FullBottle /></g>
                    <g transform={`translate(12 ${265 + 8 * (1 - action)}) scale(0.5)`}><FullBottle /></g>
                    <g transform={`translate(76 ${265 + 8 * (1 - action)}) scale(0.5)`}><FullBottle /></g>
                    <rect x="34" y="381.5" width="198" height="40" rx="6" fill={accent} stroke="#ffffff" strokeWidth="3" />
                    <text x="133" y="402.5" textAnchor="middle" dominantBaseline="central" fontFamily="Encode Sans Semi Condensed, sans-serif" fontWeight="700" fontSize="19" fill="#ffffff">Multipack</text>
                </g>
                <PriceTag y={100} value="4.50" opacity={priceOne} />
                <PriceTag y={240} value="8.40" opacity={priceTwo} />
                <PriceTag y={380} value="11.70" opacity={priceThree} />
            </g>
        </svg>
    );
};

const questionMarks = [
    { x: 206, y: 30, size: 32, color: navy },
    { x: 264, y: 54, size: 46, color: accent },
    { x: 448, y: 68, size: 28, color: navy },
    { x: 226, y: 110, size: 30, color: accent },
    { x: 257, y: 151, size: 44, color: navy },
    { x: 214, y: 187, size: 26, color: accent },
    { x: 449, y: 177, size: 38, color: navy },
    { x: 432, y: 293, size: 28, color: accent },
    { x: 248, y: 305, size: 42, color: accent },
    { x: 224, y: 382, size: 28, color: navy },
    { x: 275, y: 435, size: 46, color: accent },
    { x: 419, y: 452, size: 34, color: navy },
    { x: 54, y: 447, size: 26, color: accent },
];

export const QuestionMarkFirework = ({ frame }: { frame: number }) => (
    <svg
        viewBox="0 0 480 480"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
        {questionMarks.map((mark, index) => {
            const start = 955 + index * 2;
            const progress = interpolate(frame, [start, start + 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });
            const scale = interpolate(frame, [start, start + 9, start + 15], [0, 1.18, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });
            return (
                <text
                    key={`${mark.x}-${mark.y}`}
                    x={mark.x}
                    y={mark.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={mark.color}
                    opacity={progress}
                    fontFamily="Encode Sans Semi Condensed, sans-serif"
                    fontSize={mark.size}
                    fontWeight="800"
                    transform={`translate(${mark.x} ${mark.y}) scale(${scale}) translate(${-mark.x} ${-mark.y})`}
                >
                    ?
                </text>
            );
        })}
    </svg>
);
