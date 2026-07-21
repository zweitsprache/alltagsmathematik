import { AbsoluteFill, OffthreadVideo, Series, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Scene01Shampoo } from "./rule-of-three-shampoo/scene-01-shampoo";
import { Scene02Route } from "./rule-of-three-shampoo/scene-02-route";
import { Scene03Shelf } from "./rule-of-three-shampoo/scene-03-shelf";
import {
    Scene04Counting,
    Scene05OneBottle,
    Scene06TwoBottles,
    Scene07TwoBottlesUnit,
    Scene08ThreeBottles,
    Scene09ThreeBottlesUnit,
    Scene10Table,
    SceneBottleQuestion,
} from "./rule-of-three-shampoo/scenes-04-to-10";

export const ruleOfThreeShampooFps = 30;

const bottleSceneDuration = 231;
const routeSceneDuration = 75;
const shelfSceneDuration = 140;
const countingSceneDuration = 846;
const bottleQuestionSceneDuration = 176;
const staticSceneDuration = 150;
const twoBottleSceneDuration = 890;
const narrationDurationSeconds = 109.08;
const scenesBeforeFinalDuration =
    bottleSceneDuration +
    routeSceneDuration +
    shelfSceneDuration +
    countingSceneDuration +
    bottleQuestionSceneDuration +
    4 * staticSceneDuration +
    twoBottleSceneDuration;

export const ruleOfThreeShampooDuration = Math.ceil(narrationDurationSeconds * ruleOfThreeShampooFps);
const finalSceneDuration = ruleOfThreeShampooDuration - scenesBeforeFinalDuration;

const RouteToShelf = () => {
    const frame = useCurrentFrame();
    const transitionStart = routeSceneDuration - 18;
    const shelfOpacity = interpolate(frame, [transitionStart, routeSceneDuration - 1], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const routeOpacity = 1 - shelfOpacity;

    return (
        <AbsoluteFill>
            <AbsoluteFill style={{ opacity: routeOpacity }}>
                <Scene02Route durationInFrames={routeSceneDuration} />
            </AbsoluteFill>
            <AbsoluteFill style={{ opacity: shelfOpacity }}>
                <Scene03Shelf animateOffers={false} />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

const ShampooVisualSequence = () => (
    <Series>
        <Series.Sequence durationInFrames={bottleSceneDuration}>
            <Scene01Shampoo />
        </Series.Sequence>
        <Series.Sequence durationInFrames={routeSceneDuration}>
            <RouteToShelf />
        </Series.Sequence>
        <Series.Sequence durationInFrames={shelfSceneDuration}>
            <Scene03Shelf />
        </Series.Sequence>
        <Series.Sequence durationInFrames={countingSceneDuration}>
            <Scene04Counting />
        </Series.Sequence>
        <Series.Sequence durationInFrames={bottleQuestionSceneDuration}>
            <SceneBottleQuestion />
        </Series.Sequence>
        <Series.Sequence durationInFrames={staticSceneDuration}>
            <Scene05OneBottle />
        </Series.Sequence>
        <Series.Sequence durationInFrames={twoBottleSceneDuration}>
            <Scene06TwoBottles />
        </Series.Sequence>
        <Series.Sequence durationInFrames={staticSceneDuration}>
            <Scene07TwoBottlesUnit />
        </Series.Sequence>
        <Series.Sequence durationInFrames={staticSceneDuration}>
            <Scene08ThreeBottles />
        </Series.Sequence>
        <Series.Sequence durationInFrames={staticSceneDuration}>
            <Scene09ThreeBottlesUnit />
        </Series.Sequence>
        <Series.Sequence durationInFrames={finalSceneDuration}>
            <Scene10Table />
        </Series.Sequence>
    </Series>
);

export const RuleOfThreeShampooComposition = () => (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
        <OffthreadVideo
            src={staticFile("remotion/shampoo/Avatar Video_1080p (1).mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "82% center" }}
        />

        <div
            style={{
                position: "absolute",
                insetBlock: 0,
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
                    overflow: "hidden",
                }}
            >
                <ShampooVisualSequence />
            </div>
        </div>
    </AbsoluteFill>
);
