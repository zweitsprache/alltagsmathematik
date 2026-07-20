import { MapPin } from "lucide-react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BrandedTitleSlide, StandardEndSlide } from "../branded-slides";
import { VideoChrome } from "../video-chrome";

const titleFrames = 60;
const sceneFrames = 180;
const endFrames = 90;

export const localPrepositionsDuration = titleFrames + sceneFrames * 9 + endFrames;

type PrepositionScene = {
    word: string;
    target: { x: number; y: number };
    cue: "contact" | "distance" | "depth" | "inside" | "side-distance" | "below-distance" | "between" | "none";
    layer?: "behind" | "inside";
    twoBoxes?: boolean;
};

const scenes: PrepositionScene[] = [
    {
        word: "neben",
        target: { x: 620, y: 615 },
        cue: "side-distance" as const,
    },
    {
        word: "an",
        target: { x: 755, y: 615 },
        cue: "contact" as const,
    },
    {
        word: "auf",
        target: { x: 1040, y: 305 },
        cue: "contact" as const,
    },
    {
        word: "über",
        target: { x: 1040, y: 145 },
        cue: "distance" as const,
    },
    {
        word: "hinter",
        target: { x: 1235, y: 375 },
        cue: "none" as const,
        layer: "behind" as const,
    },
    {
        word: "in",
        target: { x: 1040, y: 370 },
        cue: "inside" as const,
        layer: "inside" as const,
    },
    {
        word: "unter",
        target: { x: 1040, y: 790 },
        cue: "below-distance" as const,
    },
    {
        word: "vor",
        target: { x: 1040, y: 535 },
        cue: "depth" as const,
    },
    {
        word: "zwischen",
        target: { x: 935, y: 555 },
        cue: "between" as const,
        twoBoxes: true,
    },
];

const Box = ({ transform }: { transform?: string }) => (
    <g transform={transform}>
        <polygon points="820,400 956,340 1260,340 1200,400" fill="#e4e7ec" />
        <polygon points="1200,400 1260,340 1260,564 1200,680" fill="#98a2b3" />
        <polygon points="820,400 1200,400 1200,680 820,680" fill="#d0d5dd" />

        <path
            d="M820 400H1200V680H820V400M820 400 956 340H1260L1200 400M1260 340V564L1200 680"
            fill="none"
            stroke="#667085"
            strokeWidth="5"
            strokeLinejoin="round"
        />
        <path
            d="M820 680 956 564V340M956 564H1260"
            fill="none"
            stroke="#667085"
            strokeWidth="4"
            strokeDasharray="12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </g>
);

export const LocalPrepositionsComposition = () => {
    const frame = useCurrentFrame();

    if (frame >= titleFrames + sceneFrames * scenes.length) return <StandardEndSlide />;

    if (frame < titleFrames) {
        return (
            <BrandedTitleSlide
                seed="LocalPrepositions"
                curriculumLabel={
                    <>
                        <strong>Deutsch</strong>
                        {" | Lokale Präpositionen"}
                    </>
                }
                title="Lokale Präpositionen"
                subtitle="9 wichtige lokale Präpositionen"
                icon={<MapPin size={64} strokeWidth={2.5} />}
            />
        );
    }

    const contentFrame = Math.max(0, frame - titleFrames);
    const sceneIndex = Math.min(scenes.length - 1, Math.floor(contentFrame / sceneFrames));
    const sceneFrame = contentFrame - sceneIndex * sceneFrames;
    const scene = scenes[sceneIndex];
    const isInsideScene = scene.layer === "inside";
    const moveStart = isInsideScene ? 58 : 18;
    const moveEnd = isInsideScene ? 118 : 78;
    const moveProgress = interpolate(sceneFrame, [moveStart, moveEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
    });
    const textOpacity = interpolate(sceneFrame, isInsideScene ? [122, 142] : [82, 102], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const start = sceneIndex === 0 ? { x: 280, y: 615 } : scenes[sceneIndex - 1].target;
    const ballX = interpolate(moveProgress, [0, 1], [start.x, scene.target.x]);
    const ballY = interpolate(moveProgress, [0, 1], [start.y, scene.target.y]);
    const cueOpacity = interpolate(sceneFrame, isInsideScene ? [18, 48] : [76, 96], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const contactPulse =
        sceneFrame < 76 ? 0.75 : 1 + Math.sin(((sceneFrame - 76) / 30) * Math.PI * 2) * 0.18;
    const slotClipBottom =
        scene.layer === "inside"
            ? interpolate(moveProgress, [0, 0.72, 1], [860, 860, 370], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
              })
            : 860;

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#ffffff",
                color: "#101828",
                fontFamily: "Encode Sans Semi Condensed, sans-serif",
            }}
        >
            <VideoChrome
                curriculumLabel={
                    <>
                        <strong>Deutsch</strong>
                        {"\u00a0| Lokale Präpositionen"}
                    </>
                }
            >
                <div
                        style={{
                            position: "absolute",
                            inset: "150px 60px 115px",
                            display: "grid",
                            gridTemplateColumns: "minmax(0, 2fr) minmax(420px, 1fr)",
                            alignItems: "center",
                        }}
                    >
                        <svg
                            viewBox="100 80 1160 860"
                            preserveAspectRatio="xMaxYMid meet"
                            style={{ width: "100%", overflow: "visible" }}
                        >
                            {!scene.twoBoxes && <ellipse cx="1040" cy="690" rx="370" ry="120" fill="#f2f4f7" />}
                            {scene.twoBoxes ? (
                                <>
                                    <ellipse cx="730" cy="668" rx="205" ry="25" fill="#f2f4f7" />
                                    <ellipse cx="1140" cy="668" rx="205" ry="25" fill="#f2f4f7" />
                                    <Box transform="translate(100 160) scale(0.6)" />
                                    <Box transform="translate(510 160) scale(0.6)" />
                                </>
                            ) : scene.layer === "behind" ? null : (
                                <Box />
                            )}

                            <defs>
                                <clipPath id="ball-slot-clip">
                                    <rect x="0" y="0" width="1380" height={slotClipBottom} />
                                </clipPath>
                            </defs>

                            {scene.cue === "distance" && (
                                <g opacity={cueOpacity}>
                                    <line
                                        x1="1040"
                                        y1="215"
                                        x2="1040"
                                        y2="330"
                                        stroke="#0e9384"
                                        strokeWidth="5"
                                    />
                                    <path d="m1028 228 12-14 12 14M1028 316l12 14 12-14" fill="none" stroke="#0e9384" strokeWidth="5" />
                                </g>
                            )}
                            {scene.cue === "side-distance" && (
                                <g opacity={cueOpacity}>
                                    <line
                                        x1="685"
                                        y1="615"
                                        x2="815"
                                        y2="615"
                                        stroke="#0e9384"
                                        strokeWidth="5"
                                    />
                                    <path d="m697 603-12 12 12 12M803 603l12 12-12 12" fill="none" stroke="#0e9384" strokeWidth="5" />
                                </g>
                            )}
                            {scene.cue === "below-distance" && (
                                <g opacity={cueOpacity}>
                                    <line
                                        x1="1040"
                                        y1="692"
                                        x2="1040"
                                        y2="715"
                                        stroke="#0e9384"
                                        strokeWidth="5"
                                        strokeDasharray="8 8"
                                    />
                                </g>
                            )}
                            {scene.cue === "between" && (
                                <g opacity={cueOpacity}>
                                    <line x1="878" y1="555" x2="992" y2="555" stroke="#0e9384" strokeWidth="4" />
                                    <path d="m890 543-12 12 12 12M980 543l12 12-12 12" fill="none" stroke="#0e9384" strokeWidth="4" />
                                </g>
                            )}
                            {scene.cue === "inside" && (
                                <g opacity={cueOpacity}>
                                    <polygon points="930,385 965,367 1130,367 1110,385" fill="#f9fafb" />
                                    <path
                                        d="M930 385 965 367H1130L1110 385"
                                        fill="none"
                                        stroke="#667085"
                                        strokeWidth="5"
                                        strokeLinejoin="round"
                                    />
                                </g>
                            )}
                            {scene.cue === "inside" && (
                                <path
                                    d="M975 370a65 65 0 0 0 130 0Z"
                                    fill="#026aa2"
                                    fillOpacity={cueOpacity * 0.2}
                                    stroke="#026aa2"
                                    strokeWidth="4"
                                    strokeDasharray="10 10"
                                    opacity={cueOpacity * 0.65}
                                />
                            )}

                            <circle
                                cx={ballX}
                                cy={ballY}
                                r="65"
                                fill="#0ba5ec"
                                clipPath={scene.layer === "inside" ? "url(#ball-slot-clip)" : undefined}
                            />

                            {scene.layer === "behind" && <Box />}
                            {scene.cue === "inside" && (
                                <path
                                    d="M930 385H1110"
                                    fill="none"
                                    stroke="#667085"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    opacity={cueOpacity}
                                />
                            )}

                            {scene.cue === "contact" && (
                                <g>
                                    <circle
                                        cx={scene.word === "an" ? 820 : 1040}
                                        cy={scene.word === "an" ? 615 : 370}
                                        r={30 * contactPulse}
                                        fill="#5fe9d0"
                                        opacity={cueOpacity * 0.28}
                                    />
                                    <circle
                                        cx={scene.word === "an" ? 820 : 1040}
                                        cy={scene.word === "an" ? 615 : 370}
                                        r={13 * contactPulse}
                                        fill="#0e9384"
                                        opacity={cueOpacity}
                                        style={{ filter: "drop-shadow(0 0 10px rgba(14, 147, 132, 0.75))" }}
                                    />
                                </g>
                            )}
                            {scene.cue === "depth" && (
                                <path
                                    d={scene.layer === "behind" ? "M1198 300l48 42" : "M1110 472l-48 42"}
                                    fill="none"
                                    stroke="#0e9384"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                    opacity={cueOpacity}
                                />
                            )}

                        </svg>

                        <div style={{ paddingLeft: 70, opacity: textOpacity }}>
                            <div style={{ color: "#026aa2", fontSize: 112, fontWeight: 700, lineHeight: 1 }}>
                                {scene.word}
                            </div>
                        </div>
                    </div>
            </VideoChrome>
        </AbsoluteFill>
    );
};
