import { Tally5 } from "lucide-react";
import { AbsoluteFill, Html5Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BrandedTitleSlide, StandardEndSlide } from "../branded-slides";
import { VideoChrome } from "../video-chrome";

const titleSceneFrames = 45;
const sceneDuration = 325;
const firstAudioFrame = 55;
const repeatedAudioFrame = 195;
const endSceneFrames = 120;
const teal = "#0E9384";
const sky = "#0BA5EC";
const ink = "#101828";
const wordFontSize = 180;

const estimateWordWidth = (word: string) => {
    const characterWidths: Record<string, number> = {
        f: 0.36,
        i: 0.24,
        l: 0.24,
        r: 0.37,
        t: 0.35,
        m: 0.76,
        w: 0.74,
        z: 0.45,
    };

    return Math.ceil(
        [...word].reduce((width, character) => width + (characterWidths[character] ?? 0.52), 0) * wordFontSize,
    );
};

type NumberScene = {
    number: number;
    word: string;
    onesWord?: string;
    tensWord?: string;
    kind: "single" | "teen" | "compound";
};

const words: Record<number, string> = {
    10: "zehn",
    11: "elf",
    12: "zwölf",
    13: "dreizehn",
    14: "vierzehn",
    15: "fünfzehn",
    16: "sechzehn",
    17: "siebzehn",
    18: "achtzehn",
    19: "neunzehn",
    20: "zwanzig",
    21: "einundzwanzig",
    22: "zweiundzwanzig",
    23: "dreiundzwanzig",
    24: "vierundzwanzig",
    25: "fünfundzwanzig",
    26: "sechsundzwanzig",
    27: "siebenundzwanzig",
    28: "achtundzwanzig",
    29: "neunundzwanzig",
    30: "dreissig",
    31: "einunddreissig",
};

const audioFileNames: Record<number, string> = {
    10: "zehn",
    11: "elf",
    12: "zwoelf",
    13: "dreizehn",
    14: "vierzehn",
    15: "fuenfzehn",
    16: "sechzehn",
    17: "siebzehn",
    18: "achtzehn",
    19: "neunzehn",
    20: "zwanzig",
    21: "einundzwanzig",
    22: "zweiundzwanzig",
    23: "dreiundzwanzig",
    24: "vierundzwanzig",
    25: "fuenfundzwanzig",
    26: "sechsundzwanzig",
    27: "siebenundzwanzig",
    28: "achtundzwanzig",
    29: "neunundzwanzig",
    30: "dreissig",
    31: "einunddreissig",
};

const onesWords: Record<number, string> = {
    1: "ein",
    2: "zwei",
    3: "drei",
    4: "vier",
    5: "fünf",
    6: "sechs",
    7: "sieben",
    8: "acht",
    9: "neun",
};

const teenPrefixes: Record<number, string> = {
    13: "drei",
    14: "vier",
    15: "fünf",
    16: "sech",
    17: "sieb",
    18: "acht",
    19: "neun",
};

const numberScenes: NumberScene[] = Array.from({ length: 22 }, (_, index) => {
    const number = index + 10;
    if (number <= 12 || number === 20 || number === 30) {
        return { number, word: words[number], kind: "single" };
    }
    if (number < 20) {
        return { number, word: words[number], onesWord: teenPrefixes[number], tensWord: "zehn", kind: "teen" };
    }
    return {
        number,
        word: words[number],
        onesWord: onesWords[number % 10],
        tensWord: number < 30 ? "zwanzig" : "dreissig",
        kind: "compound",
    };
});

const contentDuration = titleSceneFrames + sceneDuration * numberScenes.length;
export const twoDigitNumbersDuration = contentDuration + endSceneFrames;

export const TwoDigitNumbersComposition = () => {
    const absoluteFrame = useCurrentFrame();
    const frame = absoluteFrame - titleSceneFrames;

    if (absoluteFrame >= contentDuration) return <StandardEndSlide />;

    if (absoluteFrame < titleSceneFrames) {
        return (
            <BrandedTitleSlide
                seed="TwoDigitNumbers"
                curriculumLabel={
                    <>
                    <strong>Zahlen und Variablen</strong>
                    {" | Zahlen von 10 bis 31"}
                    </>
                }
                title="Zweistellige Zahlen"
                subtitle="Die Zahlen von 10 bis 31"
                icon={<Tally5 size={64} strokeWidth={2.5} />}
            />
        );
    }

    const sceneIndex = Math.min(Math.floor(frame / sceneDuration), numberScenes.length - 1);
    const sceneFrame = frame - sceneIndex * sceneDuration;
    const scene = numberScenes[sceneIndex];
    const isSingle = scene.kind === "single";
    const firstProgress = interpolate(sceneFrame, [55, 75], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const secondProgress = interpolate(sceneFrame, [82, 105], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const showFirst = sceneFrame >= 55;
    const showSecond = sceneFrame >= 82;
    const digits = String(scene.number).split("");
    const firstDigitColor = isSingle ? (showFirst ? teal : ink) : showSecond ? teal : ink;
    const secondDigitColor = isSingle ? (showFirst ? teal : ink) : showFirst ? sky : ink;
    const wordParts = isSingle
        ? [{ text: scene.word, role: "single" as const }]
        : [
              { text: scene.onesWord ?? "", role: "ones" as const },
              ...(scene.kind === "compound" ? [{ text: "und", role: "join" as const }] : []),
              { text: scene.tensWord ?? "", role: "tens" as const },
          ];
    const measuredWordParts = wordParts.map((part) => ({ ...part, width: estimateWordWidth(part.text) }));
    const totalWordWidth = measuredWordParts.reduce((sum, part) => sum + part.width, 0);
    const wordRowLeft = (1920 - totalWordWidth) / 2;
    const partCenter = (role: "single" | "ones" | "tens") => {
        let offset = wordRowLeft;
        for (const part of measuredWordParts) {
            if (part.role === role) return offset + part.width / 2;
            offset += part.width;
        }
        return 960;
    };
    const firstArrowEndX = isSingle ? partCenter("single") : partCenter("ones");
    const secondArrowEndX = partCenter("tens");

    return (
        <AbsoluteFill style={{ backgroundColor: "#ffffff", fontFamily: '"Encode Sans Semi Condensed", sans-serif' }}>
            <VideoChrome
                curriculumLabel={
                    <>
                        <strong style={{ color: "#667085" }}>Zahlen und Variablen</strong>
                        {" | Zahlen von 10 bis 31"}
                    </>
                }
            >
                {numberScenes.flatMap((audioScene, index) => {
                    const audioSource = staticFile(
                        `remotion/number-line-audio/${audioFileNames[audioScene.number]}.mp3`,
                    );
                    const sceneStart = titleSceneFrames + index * sceneDuration;

                    return [
                        <Sequence key={`${audioScene.number}-first`} from={sceneStart + firstAudioFrame} premountFor={30}>
                            <Html5Audio src={audioSource} />
                        </Sequence>,
                        <Sequence
                            key={`${audioScene.number}-repeat`}
                            from={sceneStart + repeatedAudioFrame}
                            premountFor={30}
                        >
                            <Html5Audio src={audioSource} />
                        </Sequence>,
                    ];
                })}

                <div
                    style={{
                        position: "absolute",
                        top: 275,
                        left: 0,
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        fontSize: 180,
                        fontWeight: 700,
                        lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    <span style={{ width: 100, textAlign: "center", color: firstDigitColor }}>{digits[0]}</span>
                    <span style={{ width: 100, textAlign: "center", color: secondDigitColor }}>{digits[1]}</span>
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 690,
                        left: 0,
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        fontSize: wordFontSize,
                        fontWeight: 700,
                        lineHeight: 1,
                    }}
                >
                    {measuredWordParts.map((part) => (
                        <span
                            key={`${scene.number}-${part.role}`}
                            style={{
                                color:
                                    part.role === "join"
                                        ? ink
                                        : part.role === "tens"
                                          ? showSecond
                                              ? teal
                                              : ink
                                          : isSingle
                                            ? showFirst
                                                ? teal
                                                : ink
                                            : showFirst
                                              ? sky
                                              : ink,
                            }}
                        >
                            {part.text}
                        </span>
                    ))}
                </div>

                <svg viewBox="0 0 1920 1080" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                    <defs>
                        <marker id="two-digit-arrow-sky" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                            <path d="M 0 0 L 10 5 L 0 10 Z" fill={sky} />
                        </marker>
                        <marker id="two-digit-arrow-teal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                            <path d="M 0 0 L 10 5 L 0 10 Z" fill={teal} />
                        </marker>
                    </defs>
                    {!isSingle && (
                        <path
                            d={`M 1010 470 L ${firstArrowEndX} 675`}
                            fill="none"
                            stroke={sky}
                            strokeWidth={8}
                            strokeLinecap="round"
                            markerEnd={firstProgress >= 0.95 ? "url(#two-digit-arrow-sky)" : undefined}
                            pathLength={1}
                            strokeDasharray={1}
                            strokeDashoffset={1 - firstProgress}
                        />
                    )}
                    <path
                        d={`M ${isSingle ? 960 : 910} 470 L ${isSingle ? firstArrowEndX : secondArrowEndX} 675`}
                        fill="none"
                        stroke={teal}
                        strokeWidth={8}
                        strokeLinecap="round"
                        markerEnd={(isSingle ? firstProgress : secondProgress) >= 0.95 ? "url(#two-digit-arrow-teal)" : undefined}
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={1 - (isSingle ? firstProgress : secondProgress)}
                    />
                </svg>
            </VideoChrome>
        </AbsoluteFill>
    );
};
