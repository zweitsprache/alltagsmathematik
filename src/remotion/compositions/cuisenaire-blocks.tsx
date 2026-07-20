import { Tally5 } from "lucide-react";
import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BrandedTitleSlide, StandardEndSlide } from "../branded-slides";
import { VideoChrome } from "../video-chrome";

const fps = 30;
const titleSceneFrames = fps * 3;
const additionSceneFrames = fps * 10;
const nextAdditionSceneFrames = fps * 11;
const nextAdditionSceneCount = 8;
const endSceneFrames = fps * 4;
const contentDuration =
    titleSceneFrames + additionSceneFrames + nextAdditionSceneFrames * nextAdditionSceneCount;
export const cuisenaireBlocksDuration = contentDuration + endSceneFrames;

const unitSize = 48;
const equationRowGap = 48;

export const cuisenaireColors: Record<number, string> = {
    1: "#d8cec4",
    2: "#ff0000",
    3: "#66cc66",
    4: "#ff0099",
    5: "#ffcc00",
    6: "#006600",
    7: "#000000",
    8: "#663300",
    9: "#003399",
    10: "#ff6600",
};

export const CuisenaireRod = ({
    value,
    unit = unitSize,
}: {
    value: number;
    unit?: number;
}) => {
    if (value === 0) return <div style={{ height: unit }} />;

    const color = cuisenaireColors[value];

    return (
        <div
            style={{
                position: "relative",
                width: value * unit,
                height: unit,
                boxSizing: "border-box",
                backgroundColor: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: Math.round(unit * 0.44),
                fontWeight: 700,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
            }}
        >
            {value}
        </div>
    );
};

const AdditionScene = ({ frame }: { frame: number }) => {
    const firstOpacity = interpolate(frame, [12, 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const secondOpacity = interpolate(frame, [92, 102], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const resultOpacity = interpolate(frame, [192, 202], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const sceneUnit = 160;

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: sceneUnit * 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: equationRowGap,
                    transform: "translate(-50%, calc(-50% + 20px))",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        width: sceneUnit * 2,
                        justifyContent: "flex-start",
                        gap: 0,
                    }}
                >
                    <div style={{ opacity: firstOpacity }}>
                        <CuisenaireRod value={1} unit={sceneUnit} />
                    </div>
                    <div style={{ opacity: secondOpacity }}>
                        <CuisenaireRod value={1} unit={sceneUnit} />
                    </div>
                </div>
                <div
                    style={{
                        width: sceneUnit * 2,
                        display: "flex",
                        justifyContent: "flex-start",
                        opacity: resultOpacity,
                    }}
                >
                    <CuisenaireRod value={2} unit={sceneUnit} />
                </div>
            </div>
        </div>
    );
};

const NextAdditionScene = ({ frame, operand }: { frame: number; operand: number }) => {
    const sceneUnit = 160;
    const blockTwoY = interpolate(frame, [25, 65], [sceneUnit + equationRowGap, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const coveredBlocksOpacity = interpolate(frame, [50, 65], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const addedBlockOpacity = interpolate(frame, [125, 137], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const resultOpacity = interpolate(frame, [225, 237], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div style={{ position: "absolute", inset: 0 }}>
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: sceneUnit * 10,
                    height: sceneUnit * 2 + equationRowGap,
                    transform: "translate(-50%, calc(-50% + 20px))",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        display: "flex",
                        opacity: coveredBlocksOpacity,
                    }}
                >
                    <CuisenaireRod value={operand - 1} unit={sceneUnit} />
                    <CuisenaireRod value={1} unit={sceneUnit} />
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: blockTwoY,
                        left: 0,
                        zIndex: 2,
                    }}
                >
                    <CuisenaireRod value={operand} unit={sceneUnit} />
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: sceneUnit * operand,
                        opacity: addedBlockOpacity,
                    }}
                >
                    <CuisenaireRod value={1} unit={sceneUnit} />
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: sceneUnit + equationRowGap,
                        left: 0,
                        opacity: resultOpacity,
                    }}
                >
                    <CuisenaireRod value={operand + 1} unit={sceneUnit} />
                </div>
            </div>
        </div>
    );
};

const numberAudioNames: Record<number, string> = {
    2: "zwei",
    3: "drei",
    4: "vier",
    5: "fuenf",
    6: "sechs",
    7: "sieben",
    8: "acht",
    9: "neun",
    10: "zehn",
};

const TitleScene = () => (
    <BrandedTitleSlide
        seed="CuisenaireBlocks"
        curriculumLabel={
            <>
            <strong>Zahlen und Variablen</strong>
            {" | Zahlen von 0 bis 10"}
            </>
        }
        title="Addition +1"
        subtitle="mit Cuisinaire-Stäbchen"
        icon={<Tally5 size={64} strokeWidth={2.5} />}
    />
);

export const CuisenaireBlocksComposition = () => {
    const absoluteFrame = useCurrentFrame();
    const frame = absoluteFrame - titleSceneFrames;
    const nextAdditionStart = additionSceneFrames;
    const nextAdditionIndex = Math.floor((frame - nextAdditionStart) / nextAdditionSceneFrames);
    const nextAdditionOperand = nextAdditionIndex + 2;
    const nextAdditionFrame = (frame - nextAdditionStart) % nextAdditionSceneFrames;

    if (absoluteFrame >= contentDuration) return <StandardEndSlide />;

    if (absoluteFrame < titleSceneFrames) return <TitleScene />;

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#ffffff",
                color: "#101828",
                fontFamily: '"Encode Sans Semi Condensed", sans-serif',
            }}
        >
            <Sequence from={titleSceneFrames + 22} durationInFrames={40} premountFor={22}>
                <Html5Audio src={staticFile("remotion/number-line-audio/eins.mp3")} />
            </Sequence>
            <Sequence from={titleSceneFrames + 102} durationInFrames={72} premountFor={30}>
                <Html5Audio src={staticFile("remotion/number-line-audio/plus-eins.mp3")} />
            </Sequence>
            <Sequence from={titleSceneFrames + 202} durationInFrames={38} premountFor={30}>
                <Html5Audio src={staticFile("remotion/number-line-audio/gleich.mp3")} />
            </Sequence>
            <Sequence from={titleSceneFrames + 237} durationInFrames={36} premountFor={30}>
                <Html5Audio src={staticFile("remotion/number-line-audio/zwei.mp3")} />
            </Sequence>
            {Array.from({ length: nextAdditionSceneCount }, (_, index) => {
                const operand = index + 2;
                const sceneStart = titleSceneFrames + nextAdditionStart + index * nextAdditionSceneFrames;

                return (
                    <Sequence key={operand} from={sceneStart} durationInFrames={nextAdditionSceneFrames}>
                        <Sequence from={68} durationInFrames={36} premountFor={30}>
                            <Html5Audio
                                src={staticFile(`remotion/number-line-audio/${numberAudioNames[operand]}.mp3`)}
                            />
                        </Sequence>
                        <Sequence from={137} durationInFrames={72} premountFor={30}>
                            <Html5Audio src={staticFile("remotion/number-line-audio/plus-eins.mp3")} />
                        </Sequence>
                        <Sequence from={237} durationInFrames={38} premountFor={30}>
                            <Html5Audio src={staticFile("remotion/number-line-audio/gleich.mp3")} />
                        </Sequence>
                        <Sequence from={272} durationInFrames={36} premountFor={30}>
                            <Html5Audio
                                src={staticFile(`remotion/number-line-audio/${numberAudioNames[operand + 1]}.mp3`)}
                            />
                        </Sequence>
                    </Sequence>
                );
            })}

            <VideoChrome
                curriculumLabel={
                    <>
                        <strong>Zahlen und Variablen</strong>
                        {" | Zahlen von 0 bis 10"}
                    </>
                }
            >
                {frame < additionSceneFrames ? (
                    <AdditionScene frame={frame} />
                ) : (
                    <NextAdditionScene frame={nextAdditionFrame} operand={nextAdditionOperand} />
                )}
            </VideoChrome>
        </AbsoluteFill>
    );
};
