import { Tally5 } from "lucide-react";
import {
    AbsoluteFill,
    Html5Audio,
    interpolate,
    Sequence,
    staticFile,
    useCurrentFrame,
} from "remotion";
import { BrandedTitleSlide, StandardEndSlide } from "../branded-slides";
import { VideoChrome } from "../video-chrome";

const titleSlideFrames = 45;
const initialStateFrames = 45;
const stepDuration = 180;
const arrivalPauseFrames = 20;
const audioRepeatDelayFrames = 60;
const stepCount = 11;
const finalHold = 45;
const endSlideFrames = 120;
const contentFrames = initialStateFrames + stepCount * stepDuration + finalHold;
const contentEnd = titleSlideFrames + contentFrames;

export const numberLineCountingDuration = contentEnd + endSlideFrames;

const numberWords = [
    "null",
    "eins",
    "zwei",
    "drei",
    "vier",
    "fünf",
    "sechs",
    "sieben",
    "acht",
    "neun",
    "zehn",
];

const audioFileNames = [
    "null.mp3",
    "eins.mp3",
    "zwei.mp3",
    "drei.mp3",
    "vier.mp3",
    "fuenf.mp3",
    "sechs.mp3",
    "sieben.mp3",
    "acht.mp3",
    "neun.mp3",
    "zehn.mp3",
];

export const NumberLineCountingComposition = () => {
    const absoluteFrame = useCurrentFrame();

    if (absoluteFrame >= contentEnd) return <StandardEndSlide />;

    if (absoluteFrame < titleSlideFrames) {
        return (
            <BrandedTitleSlide
                seed="NumberLineCountingZeroToTen"
                curriculumLabel={
                    <>
                        <strong>Zahlen und Variablen</strong>
                        {" | Zahlen von 0 bis 10"}
                    </>
                }
                title="Zahlen von 0 bis 10"
                subtitle="auf dem Zahlenstrahl"
                icon={<Tally5 size={64} strokeWidth={2.5} />}
            />
        );
    }

    const frame = absoluteFrame - titleSlideFrames;
    const isInitialState = frame < initialStateFrames;
    const sequenceFrame = Math.max(0, frame - initialStateFrames);
    const stepIndex = Math.min(Math.floor(sequenceFrame / stepDuration), stepCount - 1);
    const stepFrame = sequenceFrame - stepIndex * stepDuration;
    const previousValue = Math.max(0, stepIndex - 1);
    const movementProgress =
        stepIndex === 0
            ? 1
            : interpolate(stepFrame, [12, 38], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
              });
    const markerValue = interpolate(movementProgress, [0, 1], [previousValue, stepIndex]);
    const isMoving = stepIndex > 0 && stepFrame >= 12 && stepFrame < 38;
    const detailsAreWaiting =
        (stepIndex === 0 && stepFrame < arrivalPauseFrames) ||
        (stepIndex > 0 && stepFrame >= 12 && stepFrame < 38 + arrivalPauseFrames);
    const displayedValue = stepIndex === 0 || stepFrame >= 38 ? stepIndex : previousValue;

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#ffffff",
                fontFamily: '"Encode Sans Semi Condensed", sans-serif',
            }}
        >
            <VideoChrome
                curriculumLabel={
                    <>
                        <strong>Zahlen und Variablen</strong>
                        {" | Zahlen von 0 bis 10"}
                    </>
                }
            >
                {numberWords.flatMap((word, value) => {
                    const audioFrame =
                        titleSlideFrames +
                        initialStateFrames +
                        value * stepDuration +
                        (value === 0 ? arrivalPauseFrames : 38 + arrivalPauseFrames);
                    const audioSource = staticFile(`remotion/number-line-audio/${audioFileNames[value]}`);

                    return [
                        <Sequence key={`${word}-first`} from={audioFrame} premountFor={audioFrame}>
                            <Html5Audio src={audioSource} />
                        </Sequence>,
                        <Sequence
                            key={`${word}-repeat`}
                            from={audioFrame + audioRepeatDelayFrames}
                            premountFor={audioFrame + audioRepeatDelayFrames}
                        >
                            <Html5Audio src={audioSource} />
                        </Sequence>,
                    ];
                })}

                <div
                    style={{
                        position: "absolute",
                        top: 345,
                        left: "50%",
                        width: 1400,
                        height: 390,
                        transform: "translateX(-50%)",
                    }}
                >
                    <div style={{ position: "relative", width: 1400, height: 180 }}>
                        {!isInitialState && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 73,
                                    left: markerValue * 140,
                                    zIndex: 4,
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    backgroundColor: "#0ba5ec",
                                    transform: "translate(-50%, -50%)",
                                }}
                            />
                        )}

                        <div
                            style={{
                                position: "absolute",
                                top: 70,
                                right: -60,
                                left: -60,
                                height: 6,
                                backgroundColor: "#101828",
                            }}
                        />

                        {Array.from({ length: 11 }, (_, value) => (
                            <div
                                key={value}
                                style={{
                                    position: "absolute",
                                    insetBlock: 0,
                                    left: `${value * 10}%`,
                                    width: 0,
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 42,
                                        width: 6,
                                        height: 62,
                                        backgroundColor: "#101828",
                                    }}
                                />
                                <span
                                    style={{
                                        position: "absolute",
                                        top: 115,
                                        color: !isInitialState && !isMoving && value === displayedValue ? "#0284c7" : "#101828",
                                        fontSize: 48,
                                        fontWeight: 700,
                                        fontVariantNumeric: "tabular-nums",
                                        lineHeight: 1,
                                    }}
                                >
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            height: 180,
                            marginTop: 30,
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#101828",
                            fontSize: 72,
                            lineHeight: 1,
                            visibility: isInitialState || isMoving || detailsAreWaiting ? "hidden" : "visible",
                        }}
                    >
                        <span
                            style={{
                                minWidth: 88,
                                color: "#0284c7",
                                fontWeight: 700,
                                textAlign: "right",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {displayedValue}
                        </span>
                        <span style={{ marginInline: 28, color: "#667085", fontWeight: 400 }}>|</span>
                        <span style={{ minWidth: 240, fontWeight: 400 }}>{numberWords[displayedValue]}</span>
                    </div>
                </div>
            </VideoChrome>
        </AbsoluteFill>
    );
};
