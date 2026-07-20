import { AbsoluteFill, Html5Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BottleVisual, OffersVisual, QuestionMarkFirework, RouteVisual, SupermarketShelfVisual } from "./rule-of-three-shampoo-visuals";

export const ruleOfThreeShampooDuration = 1050;

const narrationCues = [
    { clip: "01", frame: 25, premountFor: 10 },
    { clip: "02", frame: 65 },
    { clip: "03", frame: 195 },
    { clip: "04", frame: 260 },
    { clip: "05", frame: 295 },
    { clip: "06", frame: 425 },
    { clip: "07", frame: 495 },
    { clip: "08", frame: 555 },
    { clip: "09", frame: 630 },
    { clip: "10", frame: 715 },
    { clip: "11", frame: 820 },
    { clip: "12", frame: 920 },
];

export const RuleOfThreeShampooComposition = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
            <OffthreadVideo
                src={staticFile("transfer/Avatar Video_1080p.mp4")}
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "82% center" }}
            />

            {narrationCues.map(({ clip, frame: cueFrame, premountFor = 25 }) => (
                <Sequence key={clip} from={cueFrame} premountFor={premountFor}>
                    <Html5Audio src={staticFile(`remotion/dreisatz/shampoo/voiceover_${clip}.mp3`)} />
                </Sequence>
            ))}

            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 960,
                    height: 1080,
                    backgroundColor: "#ffffff",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 60,
                        left: 0,
                        width: 960,
                        height: 960,
                    }}
                >
                    <BottleVisual frame={frame} />
                    <RouteVisual frame={frame} />
                    <SupermarketShelfVisual frame={frame} />
                    <OffersVisual frame={frame} />
                    <QuestionMarkFirework frame={frame} />
                </div>
            </div>
        </AbsoluteFill>
    );
};
