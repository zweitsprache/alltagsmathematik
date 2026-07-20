import { Tally5 } from "lucide-react";
import { AbsoluteFill, Html5Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BrandedTitleSlide, StandardEndSlide } from "../branded-slides";
import { VideoChrome } from "../video-chrome";

const titleSceneFrames = 45;
const groupSceneFrames = 1110;
const endSceneFrames = 120;
const additionPairs = [
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [1, 5],
    [2, 4],
    [1, 6],
    [2, 5],
    [3, 4],
    [1, 7],
    [2, 6],
    [3, 5],
    [1, 8],
    [2, 7],
    [3, 6],
    [4, 5],
    [1, 9],
    [2, 8],
    [3, 7],
    [4, 6],
] as const;
const contentEnd = titleSceneFrames + groupSceneFrames * additionPairs.length;
export const stackedNumberLinesDuration = contentEnd + endSceneFrames;

const values = Array.from({ length: 11 }, (_, index) => index);
const lineStartX = 260;
const stepWidth = 140;
const lineEndX = lineStartX + stepWidth * 10;
const sky = "#0BA5EC";
const green = "#079455";
const ink = "#101828";
const audioNames: Record<number, string> = {
    0: "null",
    1: "eins",
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
const plusAudioNames: Record<number, string> = {
    1: "plus-eins",
    2: "plus-zwei",
    3: "plus-drei",
    4: "plus-vier",
    5: "plus-fuenf",
    6: "plus-sechs",
    7: "plus-sieben",
    8: "plus-acht",
    9: "plus-neun",
};

const progress = (frame: number, start: number, end: number) =>
    interpolate(frame, [start, end], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

const AdditionArc = ({
    from,
    to,
    y,
    height,
    label,
    drawProgress,
    labelOpacity,
}: {
    from: number;
    to: number;
    y: number;
    height: number;
    label: string;
    drawProgress: number;
    labelOpacity: number;
}) => {
    const startX = lineStartX + from * stepWidth;
    const endX = lineStartX + to * stepWidth;
    const centerX = (startX + endX) / 2;

    return (
        <g>
            <path
                d={`M ${startX} ${y - 30} Q ${centerX} ${y - height} ${endX} ${y - 30}`}
                fill="none"
                stroke={green}
                strokeWidth={7}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - drawProgress}
            />
            <text
                x={centerX}
                y={y - 110}
                fill={green}
                fontSize={56}
                fontWeight={700}
                textAnchor="middle"
                opacity={labelOpacity}
                style={{ fontVariantNumeric: "tabular-nums" }}
            >
                {label}
            </text>
        </g>
    );
};

const AdditionNumberLine = ({
    y,
    frame,
    firstStep,
    secondStep,
}: {
    y: number;
    frame: number;
    firstStep: number;
    secondStep: number;
}) => {
    const firstEnd = firstStep;
    const result = firstStep + secondStep;
    const firstArcProgress = progress(frame, 45, 75);
    const firstLabelOpacity = progress(frame, 75, 80);
    const secondArcProgress = progress(frame, 155, 190);
    const secondLabelOpacity = progress(frame, 190, 195);
    const equalsOpacity = progress(frame, 265, 270);
    const resultOpacity = progress(frame, 305, 310);

    return (
        <g>
            <line x1={lineStartX - 100} y1={y} x2={lineEndX + 100} y2={y} stroke={ink} strokeWidth={5} />
            {values.map((value) => {
                const x = lineStartX + value * stepWidth;
                const isStart = value === 0;
                const isResult = value === result;

                return (
                    <g key={value}>
                        <line x1={x} y1={y - 22} x2={x} y2={y + 22} stroke={ink} strokeWidth={5} />
                        <text
                            x={x}
                            y={y + 76}
                            fill={isStart && frame >= 5 ? sky : isResult && resultOpacity > 0 ? green : ink}
                            fontSize={48}
                            fontWeight={700}
                            textAnchor="middle"
                            style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                            {value}
                        </text>
                    </g>
                );
            })}

            <AdditionArc
                from={0}
                to={firstEnd}
                y={y}
                height={100}
                label={`+${firstStep}`}
                drawProgress={firstArcProgress}
                labelOpacity={firstLabelOpacity}
            />
            <AdditionArc
                from={firstEnd}
                to={result}
                y={y}
                height={100}
                label={`+${secondStep}`}
                drawProgress={secondArcProgress}
                labelOpacity={secondLabelOpacity}
            />
            <text
                x={lineStartX + result * stepWidth}
                y={y - 110}
                fill={green}
                fontSize={56}
                fontWeight={700}
                textAnchor="middle"
                opacity={equalsOpacity}
            >
                =
            </text>
        </g>
    );
};

export const StackedNumberLinesComposition = () => {
    const absoluteFrame = useCurrentFrame();
    const timelineFrame = absoluteFrame - titleSceneFrames;
    const groupIndex = Math.min(Math.max(Math.floor(timelineFrame / groupSceneFrames), 0), additionPairs.length - 1);
    const frame = timelineFrame - groupIndex * groupSceneFrames;
    const [firstOperand, secondOperand] = additionPairs[groupIndex];
    const result = firstOperand + secondOperand;
    const lineSequences = [
        { offset: 0, firstStep: firstOperand, secondStep: secondOperand },
        { offset: 400, firstStep: secondOperand, secondStep: firstOperand },
    ];
    const summaryOpacity = progress(frame, 770, 785);

    if (absoluteFrame >= contentEnd) return <StandardEndSlide />;

    if (absoluteFrame < titleSceneFrames) {
        return (
            <BrandedTitleSlide
                seed="NumberLineZeroToTenStacked"
                curriculumLabel={
                    <>
                    <strong>Zahlen und Variablen</strong>
                    {" | Zahlen von 0 bis 10"}
                    </>
                }
                title="Additionen umkehren"
                subtitle="ohne Zehnerübergang"
                icon={<Tally5 size={64} strokeWidth={2.5} />}
            />
        );
    }

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#ffffff",
                color: ink,
                fontFamily: '"Encode Sans Semi Condensed", sans-serif',
            }}
        >
            {additionPairs.flatMap(([operandA, operandB], pairIndex) => {
                const groupOffset = titleSceneFrames + pairIndex * groupSceneFrames;
                return [
                    { offset: 0, firstStep: operandA, secondStep: operandB },
                    { offset: 400, firstStep: operandB, secondStep: operandA },
                ].flatMap(({ offset, firstStep, secondStep }) => [
                    <Sequence key={`${pairIndex}-${offset}-zero`} from={groupOffset + offset + 5} premountFor={5}>
                        <Html5Audio src={staticFile("remotion/number-line-audio/null.mp3")} />
                    </Sequence>,
                    <Sequence key={`${pairIndex}-${offset}-first`} from={groupOffset + offset + 80} premountFor={30}>
                        <Html5Audio src={staticFile(`remotion/number-line-audio/${plusAudioNames[firstStep]}.mp3`)} />
                    </Sequence>,
                    <Sequence key={`${pairIndex}-${offset}-second`} from={groupOffset + offset + 195} premountFor={30}>
                        <Html5Audio src={staticFile(`remotion/number-line-audio/${plusAudioNames[secondStep]}.mp3`)} />
                    </Sequence>,
                    <Sequence key={`${pairIndex}-${offset}-equals`} from={groupOffset + offset + 270} premountFor={30}>
                        <Html5Audio src={staticFile("remotion/number-line-audio/gleich.mp3")} />
                    </Sequence>,
                    <Sequence key={`${pairIndex}-${offset}-result`} from={groupOffset + offset + 310} premountFor={30}>
                        <Html5Audio src={staticFile(`remotion/number-line-audio/${audioNames[operandA + operandB]}.mp3`)} />
                    </Sequence>,
                ]);
            })}
            {additionPairs.map(([operandA, operandB], pairIndex) => (
                <Sequence
                    key={`summary-${operandA}-${operandB}`}
                    from={titleSceneFrames + pairIndex * groupSceneFrames + 790}
                    premountFor={30}
                >
                    <Html5Audio
                        src={staticFile(
                            `remotion/number-line-audio/reversed-addition-${operandA}-${operandB}.mp3`,
                        )}
                    />
                </Sequence>
            ))}
            <VideoChrome
                curriculumLabel={
                    <>
                        <strong>Zahlen und Variablen</strong>
                        {" | Zahlen von 0 bis 10"}
                    </>
                }
            >
                <svg
                    viewBox="0 0 1920 1080"
                    aria-label="Zwei Additionen auf Zahlenstrahlen von 0 bis 10"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                >
                    <AdditionNumberLine y={425} frame={frame} firstStep={firstOperand} secondStep={secondOperand} />
                    <AdditionNumberLine y={775} frame={frame - 400} firstStep={secondOperand} secondStep={firstOperand} />
                </svg>
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.88)",
                        opacity: summaryOpacity,
                    }}
                >
                    <div
                        style={{
                            padding: "52px 76px",
                            borderRadius: 24,
                            backgroundColor: "#ffffff",
                            boxShadow: "0 24px 64px rgba(16, 24, 40, 0.16)",
                            color: ink,
                            fontSize: 104,
                            fontWeight: 700,
                            lineHeight: 1,
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {firstOperand} + {secondOperand} = {secondOperand} + {firstOperand} ={" "}
                        <span style={{ color: green }}>{result}</span>
                    </div>
                </div>
            </VideoChrome>
        </AbsoluteFill>
    );
};
