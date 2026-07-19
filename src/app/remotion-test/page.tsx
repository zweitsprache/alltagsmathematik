"use client";

import { Player } from "@remotion/player";
import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { TitleSlidePattern } from "../../remotion/title-slide-pattern";
import { VideoChrome } from "../../remotion/video-chrome";

const initialDelay = 30;
const stepDuration = 360;
const stepCount = 10;
const finalHold = 60;
const titleSlideFrames = 45;
export const compositionDuration = titleSlideFrames + initialDelay + stepCount * stepDuration + finalHold;
const numberWords = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn"];

const audioFileNames: Record<string, string> = {
    null: "null.mp3",
    eins: "eins.mp3",
    zwei: "zwei.mp3",
    drei: "drei.mp3",
    vier: "vier.mp3",
    fünf: "fuenf.mp3",
    sechs: "sechs.mp3",
    sieben: "sieben.mp3",
    acht: "acht.mp3",
    neun: "neun.mp3",
    zehn: "zehn.mp3",
    "plus eins": "plus-eins.mp3",
    gleich: "gleich.mp3",
};

const audioUrl = (text: string, useLocalAudio: boolean) =>
    useLocalAudio
        ? staticFile(`remotion/number-line-audio/${audioFileNames[text]}`)
        : `/api/tts/stream?text=${encodeURIComponent(text)}`;

export const NumberLineComposition = ({ useLocalAudio = false }: { useLocalAudio?: boolean }) => {
    const absoluteFrame = useCurrentFrame();
    const frame = absoluteFrame - titleSlideFrames;

    if (absoluteFrame < titleSlideFrames) {
        return (
            <AbsoluteFill
                style={{
                    backgroundColor: "#ffffff",
                    fontFamily: "Encode Sans Semi Condensed, sans-serif",
                }}
            >
                <VideoChrome curriculumLabel="A.01.01 Zahlen von 0 bis 10">
                    <TitleSlidePattern color="#0ea5e9" variant="wave-grid" />
                    <div
                        style={{
                            position: "absolute",
                            top: 550,
                            left: 60,
                            width: 1740,
                            textAlign: "left",
                        }}
                    >
                        <h1
                            style={{
                                margin: 0,
                                color: "#101828",
                                fontSize: 80,
                                fontWeight: 700,
                                lineHeight: 1.15,
                            }}
                        >
                            Plus eins am Zahlenstrahl
                        </h1>
                        <p
                            style={{
                                margin: "18px 0 0",
                                color: "#101828",
                                fontSize: 80,
                                fontWeight: 400,
                                lineHeight: 1.15,
                            }}
                        >
                            Zahlen von 0 bis 10
                        </p>
                    </div>
                </VideoChrome>
            </AbsoluteFill>
        );
    }

    const stepIndex = frame < initialDelay ? null : Math.min(Math.floor((frame - initialDelay) / stepDuration), stepCount - 1);
    const stepFrame = stepIndex === null ? 0 : frame - (initialDelay + stepIndex * stepDuration);
    const startValue = stepIndex;
    const resultValue = startValue === null ? null : startValue + 1;
    const arcProgress = interpolate(stepFrame, [45, 75], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const plusOneOpacity = interpolate(stepFrame, [90, 100], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const equalsOpacity = interpolate(stepFrame, [195, 205], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const showResult = stepIndex !== null && stepFrame >= 255;
    const startX = (startValue ?? 0) * 140;
    const resultX = (resultValue ?? 1) * 140;
    const midpointX = (startX + resultX) / 2;

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#ffffff",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Encode Sans Semi Condensed, sans-serif",
            }}
        >
            <VideoChrome curriculumLabel="A.01.01 Zahlen von 0 bis 10">
                {Array.from({ length: stepCount }, (_, index) => {
                const value = index;
                const stepStart = titleSlideFrames + initialDelay + index * stepDuration;
                return [
                        <Sequence key={`${value}-start`} from={stepStart} premountFor={stepStart}>
                            <Html5Audio src={audioUrl(numberWords[value], useLocalAudio)} />
                        </Sequence>,
                        <Sequence key={`${value}-plus`} from={stepStart + 90} premountFor={stepStart + 90}>
                            <Html5Audio src={audioUrl("plus eins", useLocalAudio)} />
                        </Sequence>,
                        <Sequence key={`${value}-equals`} from={stepStart + 195} premountFor={stepStart + 195}>
                            <Html5Audio src={audioUrl("gleich", useLocalAudio)} />
                        </Sequence>,
                        <Sequence key={`${value}-result`} from={stepStart + 255} premountFor={stepStart + 255}>
                            <Html5Audio src={audioUrl(numberWords[value + 1], useLocalAudio)} />
                        </Sequence>,
                ];
                })}

                <div style={{ position: "relative", width: 1400, height: 180 }}>
                <div
                    style={{
                        position: "absolute",
                        top: -120,
                        left: midpointX,
                        zIndex: 2,
                        transform: "translateX(-50%)",
                        color: "#079455",
                        fontSize: 56,
                        lineHeight: 1,
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                        opacity: plusOneOpacity,
                    }}
                >
                    +1
                </div>
                <div
                    style={{
                        position: "absolute",
                        top: -120,
                        left: resultX,
                        zIndex: 2,
                        transform: "translateX(-50%)",
                        color: "#079455",
                        fontSize: 56,
                        lineHeight: 1,
                        fontWeight: 700,
                        opacity: equalsOpacity,
                    }}
                >
                    =
                </div>

                <svg
                    viewBox="0 0 1400 180"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
                    aria-hidden="true"
                >
                    <path
                        d={`M${startX} 28 Q${midpointX} -76 ${resultX} 28`}
                        fill="none"
                        stroke="#079455"
                        strokeWidth={10}
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={1 - arcProgress}
                    />
                </svg>

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

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                    }}
                >
                    {Array.from({ length: 11 }, (_, value) => (
                        <div
                            key={value}
                            style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
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
                                    fontSize: 48,
                                    lineHeight: 1,
                                    fontWeight: 700,
                                    color: value === resultValue && showResult
                                        ? "#079455"
                                        : value === startValue
                                          ? "var(--color-fg-sky-primary, #0284c7)"
                                          : "#101828",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {value}
                            </span>
                        </div>
                    ))}
                </div>
                </div>
            </VideoChrome>
        </AbsoluteFill>
    );
};

export default function RemotionTestPage() {
    return (
        <main className="min-h-screen bg-secondary px-6 py-10">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <div>
                    <h1 className="text-display-sm font-semibold text-primary">Remotion Test</h1>
                    <p className="mt-1 text-md text-tertiary">Blank 16:9 composition</p>
                </div>

                <div className="aspect-video w-full overflow-hidden rounded-lg bg-white ring-1 ring-secondary">
                    <Player
                        component={NumberLineComposition}
                        durationInFrames={compositionDuration}
                        compositionWidth={1920}
                        compositionHeight={1080}
                        fps={30}
                        numberOfSharedAudioTags={40}
                        controls
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>
            </div>
        </main>
    );
}
