import { Scissors01 } from "@untitledui/icons";
import { Tally5, User } from "lucide-react";
import { AbsoluteFill, Html5Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BrandedTitleSlide, StandardEndSlide } from "../branded-slides";
import { VideoChrome } from "../video-chrome";

const titleSceneFrames = 45;
const fillEnd = 105;
const halfCutStart = 220;
const halfCutEnd = 310;
const mirroredHalfStart = 440;
const quarterCutStart = 565;
const quarterCutEnd = 655;
const quarterRotationSteps = [
    { start: 805, end: 835, angle: 90, narrationStart: 845 },
    { start: 990, end: 1020, angle: 180, narrationStart: 1030 },
    { start: 1175, end: 1205, angle: 270, narrationStart: 1215 },
] as const;
const narrationDelay = 10;
const shapeSequenceDuration = 1360;
const endSceneFrames = 120;
const contentDuration = titleSceneFrames + shapeSequenceDuration * 4;

export const percentageWholeDuration = contentDuration + endSceneFrames;

export const PercentageWholeComposition = () => {
    const absoluteFrame = useCurrentFrame();
    const timelineFrame = absoluteFrame - titleSceneFrames;

    if (absoluteFrame >= contentDuration) return <StandardEndSlide />;

    if (absoluteFrame < titleSceneFrames) {
        return (
            <BrandedTitleSlide
                seed="PercentageWhole"
                curriculumLabel={
                    <>
                    <strong>Zahlen und Variablen</strong>
                    {" | Prozentwerte verstehen"}
                    </>
                }
                title="Prozentwerte ablesen und nennen"
                subtitle="100%, 50% und 25%"
                icon={<Tally5 size={64} strokeWidth={2.5} />}
            />
        );
    }

    const shapeSequenceIndex = Math.min(Math.floor(timelineFrame / shapeSequenceDuration), 3);
    const frame = timelineFrame - shapeSequenceIndex * shapeSequenceDuration;
    const isSquareSequence = shapeSequenceIndex === 1;
    const isRectangleSequence = shapeSequenceIndex === 2;
    const isIconGridSequence = shapeSequenceIndex === 3;
    const percentage = frame >= quarterCutEnd ? 25 : frame >= halfCutEnd ? 50 : 100;
    const percentageWord =
        frame >= quarterCutEnd ? "fünfundzwanzig Prozent" : frame >= halfCutEnd ? "fünfzig Prozent" : "hundert Prozent";
    const showPercentage = frame >= fillEnd + narrationDelay;
    const showMirroredHalf = frame >= mirroredHalfStart;
    const fillProgress = interpolate(frame, [0, fillEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const shapeHeight = isRectangleSequence ? 280 : 560;
    const waterY = shapeHeight * (1 - fillProgress);
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
    const quarterRotation = quarterRotationSteps.reduce((rotation, step, index) => {
        if (frame < step.start) return rotation;
        const previousAngle = index === 0 ? 0 : quarterRotationSteps[index - 1].angle;
        if (frame < step.end) {
            return interpolate(frame, [step.start, step.end], [previousAngle, step.angle], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });
        }
        return step.angle;
    }, 0);
    const stoppedQuarterPosition = quarterRotationSteps.reduce(
        (position, step, index) => (frame >= step.end ? index + 1 : position),
        0,
    );
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
            <VideoChrome
                curriculumLabel={
                    <>
                        <strong style={{ color: "#667085" }}>Zahlen und Variablen</strong>
                        {" | Prozentwerte verstehen"}
                    </>
                }
            >
            {[0, 1, 2, 3].map((sequenceIndex) => {
                const sequenceOffset = titleSceneFrames + sequenceIndex * shapeSequenceDuration;
                return (
                    <Sequence key={`hundred-${sequenceIndex}`} from={sequenceOffset + fillEnd + narrationDelay} premountFor={30}>
                        <Html5Audio src={staticFile("remotion/number-line-audio/hundert-prozent.mp3")} />
                    </Sequence>
                );
            })}
            {[0, 1, 2, 3].flatMap((sequenceIndex) => {
                const sequenceOffset = titleSceneFrames + sequenceIndex * shapeSequenceDuration;
                return [
                    <Sequence key={`half-a-${sequenceIndex}`} from={sequenceOffset + halfCutEnd + narrationDelay} premountFor={30}>
                        <Html5Audio src={staticFile("remotion/number-line-audio/fuenfzig-prozent.mp3")} />
                    </Sequence>,
                    <Sequence key={`half-b-${sequenceIndex}`} from={sequenceOffset + mirroredHalfStart + narrationDelay} premountFor={30}>
                        <Html5Audio src={staticFile("remotion/number-line-audio/fuenfzig-prozent.mp3")} />
                    </Sequence>,
                    <Sequence key={`quarter-a-${sequenceIndex}`} from={sequenceOffset + quarterCutEnd + narrationDelay} premountFor={30}>
                        <Html5Audio src={staticFile("remotion/number-line-audio/fuenfundzwanzig-prozent.mp3")} />
                    </Sequence>,
                    ...quarterRotationSteps.map((step) => (
                        <Sequence
                            key={`quarter-${step.angle}-${sequenceIndex}`}
                            from={sequenceOffset + step.narrationStart}
                            premountFor={30}
                        >
                            <Html5Audio src={staticFile("remotion/number-line-audio/fuenfundzwanzig-prozent.mp3")} />
                        </Sequence>
                    )),
                ];
            })}
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
                        height: shapeHeight,
                        display: isIconGridSequence ? "none" : "block",
                        borderRadius: isSquareSequence || isRectangleSequence ? 0 : "50%",
                        backgroundColor: frame >= quarterCutEnd ? "#D0D5DD" : frame >= fillEnd ? "#0BA5EC" : "#D0D5DD",
                        overflow: "hidden",
                    }}
                >
                    <svg
                        viewBox={`0 0 560 ${shapeHeight}`}
                        aria-hidden="true"
                        style={{ position: "absolute", inset: 0, zIndex: 0, width: "100%", height: "100%" }}
                    >
                        <path
                            d={
                                isRectangleSequence
                                    ? `M 0 0 H ${560 * fillProgress} V ${shapeHeight} H 0 Z`
                                    : `M 0 ${waterY} H 560 V ${shapeHeight} H 0 Z`
                            }
                            fill="#0BA5EC"
                            opacity={frame < quarterCutEnd ? 1 : 0}
                        />
                    </svg>
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            width: "50%",
                            zIndex: 1,
                            backgroundColor: frame >= halfCutEnd && !showMirroredHalf ? "#D0D5DD" : "transparent",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: "50%",
                            zIndex: 1,
                            backgroundColor: showMirroredHalf && frame < quarterCutEnd ? "#D0D5DD" : "transparent",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: isRectangleSequence ? "25%" : "50%",
                            height: isRectangleSequence ? "100%" : "50%",
                            zIndex: 1,
                            backgroundColor: frame >= quarterCutEnd ? "#0BA5EC" : "transparent",
                            transform: isRectangleSequence
                                ? `translateX(${stoppedQuarterPosition * 100}%)`
                                : `rotate(${quarterRotation}deg)`,
                            transformOrigin: isRectangleSequence ? undefined : "100% 100%",
                        }}
                    />
                    <svg
                        viewBox={`0 0 560 ${shapeHeight}`}
                        aria-hidden="true"
                        style={{ position: "relative", zIndex: 2, width: "100%", height: "100%" }}
                    >
                        <line
                            x1="280"
                            y1="0"
                            x2="280"
                            y2={shapeHeight * lineProgress}
                            stroke="#ffffff"
                            strokeWidth="8"
                            strokeLinecap="butt"
                            opacity={frame < halfCutEnd ? 1 : 0}
                        />
                        <line
                            x1={isRectangleSequence ? 140 : 280}
                            y1={isRectangleSequence ? 0 : 280}
                            x2={isRectangleSequence ? 140 : 280 - quarterLineProgress * 280}
                            y2={isRectangleSequence ? shapeHeight * quarterLineProgress : 280}
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
                            top: lineProgress * shapeHeight,
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
                            top: isRectangleSequence ? quarterLineProgress * shapeHeight : "50%",
                            left: isRectangleSequence ? 140 : 280 - quarterLineProgress * 280,
                            zIndex: 3,
                            opacity: quarterScissorsOpacity,
                            transform: isRectangleSequence
                                ? "translate(-50%, -50%) rotate(90deg)"
                                : "translate(-50%, -50%) rotate(180deg)",
                        }}
                    />
                </div>
                {isIconGridSequence && (
                    <div
                        style={{
                            position: "relative",
                            display: "grid",
                            width: 560,
                            height: 560,
                            gridTemplateColumns: "repeat(10, 1fr)",
                            gridTemplateRows: "repeat(10, 1fr)",
                            gap: 0,
                        }}
                    >
                        {Array.from({ length: 100 }, (_, iconIndex) => {
                            const row = Math.floor(iconIndex / 10);
                            const column = iconIndex % 10;
                            const fillThreshold = (9 - row) * 10 + column;
                            const activeQuarter =
                                stoppedQuarterPosition === 0
                                    ? row < 5 && column < 5
                                    : stoppedQuarterPosition === 1
                                      ? row < 5 && column >= 5
                                      : stoppedQuarterPosition === 2
                                        ? row >= 5 && column >= 5
                                        : row >= 5 && column < 5;
                            const isBlue =
                                frame < fillEnd
                                    ? fillThreshold < Math.round(fillProgress * 100)
                                    : frame < halfCutEnd
                                      ? true
                                      : frame < mirroredHalfStart
                                        ? column >= 5
                                        : frame < quarterCutEnd
                                          ? column < 5
                                          : activeQuarter;

                            return (
                                <div key={iconIndex} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <User size={42} strokeWidth={2.2} color={isBlue ? "#0BA5EC" : "#D0D5DD"} />
                                </div>
                            );
                        })}
                        <svg
                            viewBox="0 0 560 560"
                            aria-hidden="true"
                            style={{ position: "absolute", inset: 0, zIndex: 2, width: "100%", height: "100%", pointerEvents: "none" }}
                        >
                            <line
                                x1="280"
                                y1="0"
                                x2="280"
                                y2={560 * lineProgress}
                                stroke="#101828"
                                strokeWidth="6"
                                strokeLinecap="butt"
                                opacity={frame < halfCutEnd ? 1 : 0}
                            />
                            <line
                                x1="280"
                                y1="280"
                                x2={280 - quarterLineProgress * 280}
                                y2="280"
                                stroke="#101828"
                                strokeWidth="6"
                                strokeLinecap="butt"
                                opacity={frame >= quarterCutStart && frame < quarterCutEnd ? 1 : 0}
                            />
                        </svg>
                        <Scissors01
                            size={64}
                            color="#101828"
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
                            size={64}
                            color="#101828"
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: 280 - quarterLineProgress * 280,
                                zIndex: 3,
                                opacity: quarterScissorsOpacity,
                                transform: "translate(-50%, -50%) rotate(180deg)",
                            }}
                        />
                    </div>
                )}
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
                        paddingLeft: 0,
                        transform: "translateX(-48px)",
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
