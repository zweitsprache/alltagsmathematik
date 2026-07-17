import { Scissors01 } from "@untitledui/icons";
import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { VideoChrome } from "../video-chrome";

const fillEnd = 105;
const halfCutStart = 220;
const halfCutEnd = 310;
const quarterCutStart = 425;
const quarterCutEnd = 515;
const narrationDelay = 10;

export const percentageWholeDuration = 660;

export const PercentageWholeComposition = () => {
    const frame = useCurrentFrame();
    const percentage = frame >= quarterCutEnd ? 25 : frame >= halfCutEnd ? 50 : 100;
    const percentageWord =
        frame >= quarterCutEnd ? "fünfundzwanzig Prozent" : frame >= halfCutEnd ? "fünfzig Prozent" : "hundert Prozent";
    const showPercentage = frame >= fillEnd + narrationDelay;
    const fillProgress = interpolate(frame, [0, fillEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const waterY = 560 * (1 - fillProgress);
    const waveOffset = Math.sin((frame / 30) * Math.PI * 2) * 4;
    const lineProgress = interpolate(frame, [halfCutStart, halfCutEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const scissorsOpacity = interpolate(frame, [halfCutStart - 3, halfCutStart, halfCutEnd, halfCutEnd + 12], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const quarterLineProgress = interpolate(frame, [quarterCutStart, quarterCutEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const quarterScissorsOpacity = interpolate(
        frame,
        [quarterCutStart - 3, quarterCutStart, quarterCutEnd, quarterCutEnd + 12],
        [0, 1, 1, 0],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        },
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#ffffff",
                fontFamily: "Encode Sans Semi Condensed, sans-serif",
            }}
        >
            <VideoChrome curriculumLabel="Prozent">
            <Sequence from={fillEnd + narrationDelay} premountFor={30}>
                <Html5Audio src={staticFile("remotion/number-line-audio/hundert-prozent.mp3")} />
            </Sequence>
            <Sequence from={halfCutEnd + narrationDelay} premountFor={30}>
                <Html5Audio src={staticFile("remotion/number-line-audio/fuenfzig-prozent.mp3")} />
            </Sequence>
            <Sequence from={quarterCutEnd + narrationDelay} premountFor={30}>
                <Html5Audio src={staticFile("remotion/number-line-audio/fuenfundzwanzig-prozent.mp3")} />
            </Sequence>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "flex",
                    width: "50%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        position: "relative",
                        width: 560,
                        height: 560,
                        borderRadius: "50%",
                        backgroundColor: frame >= fillEnd ? "#0BA5EC" : "#D0D5DD",
                        overflow: "hidden",
                    }}
                >
                    <svg
                        viewBox="0 0 560 560"
                        aria-hidden="true"
                        style={{ position: "absolute", inset: 0, zIndex: 0, width: "100%", height: "100%" }}
                    >
                        <path
                            d={`M 0 ${waterY} C 90 ${waterY - 7 + waveOffset} 185 ${waterY + 7 - waveOffset} 280 ${waterY} C 375 ${waterY - 7 - waveOffset} 470 ${waterY + 7 + waveOffset} 560 ${waterY} L 560 560 L 0 560 Z`}
                            fill="#0BA5EC"
                        />
                    </svg>
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 1,
                            clipPath: "inset(0 50% 0 0)",
                            backgroundColor: frame >= halfCutEnd ? "#D0D5DD" : "transparent",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 1,
                            clipPath: "inset(50% 0 0 50%)",
                            backgroundColor: frame >= quarterCutEnd ? "#D0D5DD" : "transparent",
                        }}
                    />
                    <svg
                        viewBox="0 0 560 560"
                        aria-hidden="true"
                        style={{ position: "relative", zIndex: 2, width: "100%", height: "100%" }}
                    >
                        <line
                            x1="280"
                            y1="0"
                            x2="280"
                            y2={560 * lineProgress}
                            stroke="#ffffff"
                            strokeWidth="8"
                            strokeLinecap="butt"
                            opacity={frame < halfCutEnd ? 1 : 0}
                        />
                        <line
                            x1="280"
                            y1="280"
                            x2={280 + quarterLineProgress * 280}
                            y2="280"
                            stroke="#ffffff"
                            strokeWidth="8"
                            strokeLinecap="butt"
                            opacity={frame >= quarterCutStart && frame < quarterCutEnd ? 1 : 0}
                        />
                    </svg>
                    <Scissors01
                        size={72}
                        color="#ffffff"
                        style={{
                            position: "absolute",
                            top: lineProgress * 560,
                            left: "50%",
                            zIndex: 3,
                            opacity: scissorsOpacity,
                            transform: "translate(-50%, -50%) rotate(90deg)",
                        }}
                    />
                    <Scissors01
                        size={72}
                        color="#ffffff"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: 280 + quarterLineProgress * 280,
                            zIndex: 3,
                            opacity: quarterScissorsOpacity,
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                </div>
            </div>

            {showPercentage && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        display: "flex",
                        width: "50%",
                        height: "100%",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        boxSizing: "border-box",
                        paddingLeft: 120,
                        color: "#101828",
                        textAlign: "left",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontSize: 180,
                            fontWeight: 700,
                            lineHeight: 1,
                            fontVariantNumeric: "tabular-nums",
                            color: "#0BA5EC",
                        }}
                    >
                        {percentage}%
                    </p>
                    <p
                        style={{
                            margin: "32px 0 0",
                            fontSize: 80,
                            fontWeight: 400,
                            lineHeight: 1.1,
                            color: "#0BA5EC",
                        }}
                    >
                        {percentageWord}
                    </p>
                </div>
            )}
            </VideoChrome>
        </AbsoluteFill>
    );
};
