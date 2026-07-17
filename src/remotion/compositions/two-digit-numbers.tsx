import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { VideoChrome } from "../video-chrome";

const sceneDuration = 180;
const numberScenes = [
    { number: 13, word: "dreizehn", prefix: "drei", audioFile: "dreizehn" },
    { number: 14, word: "vierzehn", prefix: "vier", audioFile: "vierzehn" },
    { number: 15, word: "fünfzehn", prefix: "fünf", audioFile: "fuenfzehn" },
    { number: 16, word: "sechzehn", prefix: "sech", audioFile: "sechzehn" },
    { number: 17, word: "siebzehn", prefix: "sieb", audioFile: "siebzehn" },
    { number: 18, word: "achtzehn", prefix: "acht", audioFile: "achtzehn" },
    { number: 19, word: "neunzehn", prefix: "neun", audioFile: "neunzehn" },
    { number: 20, word: "zwanzig", prefix: null, audioFile: "zwanzig" },
] as const;

export const twoDigitNumbersDuration = sceneDuration * numberScenes.length;

export const TwoDigitNumbersComposition = () => {
    const frame = useCurrentFrame();
    const sceneIndex = Math.min(Math.floor(frame / sceneDuration), numberScenes.length - 1);
    const sceneFrame = frame - sceneIndex * sceneDuration;
    const scene = numberScenes[sceneIndex];
    const isTeen = scene.number < 20;
    const onesProgress = isTeen
        ? interpolate(sceneFrame, [55, 75], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
          })
        : 0;
    const tensProgress = interpolate(sceneFrame, isTeen ? [82, 105] : [55, 78], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const showOnes = isTeen && sceneFrame >= 55;
    const showTens = sceneFrame >= (isTeen ? 82 : 55);
    const digits = String(scene.number).split("");

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#ffffff",
                fontFamily: "Encode Sans Semi Condensed, sans-serif",
            }}
        >
            <VideoChrome curriculumLabel="A.01.04 Zahlen bis 100">
                {numberScenes.map((audioScene, index) => {
                    const audioStart = index * sceneDuration + 55;
                    return (
                        <Sequence key={audioScene.number} from={audioStart} premountFor={30}>
                            <Html5Audio src={staticFile(`remotion/number-line-audio/${audioScene.audioFile}.mp3`)} />
                        </Sequence>
                    );
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
                    <span style={{ color: showTens ? "#0E9384" : "#101828" }}>{digits[0]}</span>
                    <span style={{ color: isTeen ? (showOnes ? "#0BA5EC" : "#101828") : showTens ? "#0E9384" : "#101828" }}>
                        {digits[1]}
                    </span>
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 690,
                        left: 0,
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        fontSize: 180,
                        fontWeight: 700,
                        lineHeight: 1,
                    }}
                >
                    {isTeen ? (
                        <>
                            <span style={{ color: showOnes ? "#0BA5EC" : "#101828" }}>{scene.prefix}</span>
                            <span style={{ color: showTens ? "#0E9384" : "#101828" }}>zehn</span>
                        </>
                    ) : (
                        <span style={{ color: showTens ? "#0E9384" : "#101828" }}>{scene.word}</span>
                    )}
                </div>

                <svg
                    viewBox="0 0 1920 1080"
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                >
                    <defs>
                        <marker id="arrow-sky" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#0BA5EC" />
                        </marker>
                        <marker id="arrow-teal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#0E9384" />
                        </marker>
                    </defs>

                    {isTeen && (
                        <path
                            d="M 1010 470 L 810 675"
                            fill="none"
                            stroke="#0BA5EC"
                            strokeWidth={8}
                            strokeLinecap="round"
                            markerEnd={onesProgress >= 0.95 ? "url(#arrow-sky)" : undefined}
                            pathLength={1}
                            strokeDasharray={1}
                            strokeDashoffset={1 - onesProgress}
                        />
                    )}
                    <path
                        d={isTeen ? "M 910 470 L 1110 675" : "M 960 470 L 960 675"}
                        fill="none"
                        stroke="#0E9384"
                        strokeWidth={8}
                        strokeLinecap="round"
                        markerEnd={tensProgress >= 0.95 ? "url(#arrow-teal)" : undefined}
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={1 - tensProgress}
                    />
                </svg>
            </VideoChrome>
        </AbsoluteFill>
    );
};
