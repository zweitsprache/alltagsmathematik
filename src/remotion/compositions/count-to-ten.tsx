import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { VideoChrome } from "../video-chrome";

const seededRandom = (() => {
    let seed = 32010;
    return () => {
        seed += 0x6d2b79f5;
        let value = seed;
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
})();

const circleSize = 38;
const minimumDistance = 90;
const circlePositions: Array<{ x: number; y: number }> = [];

while (circlePositions.length < 32) {
    const candidate = {
        x: 90 + seededRandom() * 770,
        y: 190 + seededRandom() * 680,
    };
    const hasEnoughSpace = circlePositions.every(
        (circle) => Math.hypot(circle.x - candidate.x, circle.y - candidate.y) >= minimumDistance,
    );
    if (hasEnoughSpace) circlePositions.push(candidate);
}

type CountingGroup = {
    indices: number[];
    center: { x: number; y: number };
    radius: number;
};

const countingGroups: CountingGroup[] = Array.from({ length: 10 }, (_, countIndex) => {
    const count = countIndex + 1;
    const candidates: Array<CountingGroup & { gap: number; signature: string }> = [];

    for (let x = 100; x <= 850; x += 10) {
        for (let y = 190; y <= 870; y += 10) {
            const distances = circlePositions
                .map((circle, index) => ({
                    index,
                    distance: Math.hypot(circle.x - x, circle.y - y),
                }))
                .sort((first, second) => first.distance - second.distance);
            const selectedDistance = distances[count - 1].distance;
            const unselectedDistance = distances[count].distance;
            const radius = selectedDistance + 28;
            const outerDrawingRadius = radius + 3;
            if (outerDrawingRadius >= unselectedDistance - 20) continue;
            if (outerDrawingRadius > Math.min(x - 40, 920 - x, y - 170, 930 - y)) continue;

            const indices = distances.slice(0, count).map(({ index }) => index);
            candidates.push({
                indices,
                center: { x, y },
                radius,
                gap: unselectedDistance - selectedDistance,
                signature: [...indices].sort((first, second) => first - second).join(","),
            });
        }
    }

    candidates.sort((first, second) => second.gap - first.gap);
    const signatures = new Set<string>();
    return candidates
        .filter((candidate) => {
            if (signatures.has(candidate.signature)) return false;
            signatures.add(candidate.signature);
            return true;
        })
        .slice(0, 3)
        .map(({ indices, center, radius }) => ({ indices, center, radius }));
}).flat();

const numberAudioFiles = ["null", "eins", "zwei", "drei", "vier", "fuenf", "sechs", "sieben", "acht", "neun", "zehn"];

const createHandDrawnCirclePath = (center: { x: number; y: number }, radius: number) => {
    const variations = [0, -2, 2, -1, 1.5, -2.5, 1, -1.5, 2.5, -1, 1, -2];
    const points = variations.map((variation, index) => {
        const angle = -Math.PI / 2 + (index / variations.length) * Math.PI * 2;
        const pointRadius = radius + variation;
        return {
            x: center.x + Math.cos(angle) * pointRadius,
            y: center.y + Math.sin(angle) * pointRadius,
        };
    });
    const midpoint = (first: { x: number; y: number }, second: { x: number; y: number }) => ({
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2,
    });
    const start = midpoint(points.at(-1)!, points[0]);
    const segments = points.map((point, index) => {
        const end = midpoint(point, points[(index + 1) % points.length]);
        return `Q ${point.x} ${point.y} ${end.x} ${end.y}`;
    });
    return `M ${start.x} ${start.y} ${segments.join(" ")} Z`;
};

const standardRoundDuration = 120;
const reviewLeadIn = 30;
const reviewStepDuration = 45;
const reviewTail = 30;

type CountingScene = {
    type: "standard" | "review";
    start: number;
    duration: number;
    group: CountingGroup;
    target: number;
};

let timelineCursor = 45;
const countingScenes: CountingScene[] = [];

for (let target = 1; target <= 10; target++) {
    const groups = countingGroups.slice((target - 1) * 3, target * 3);
    for (const group of groups) {
        countingScenes.push({ type: "standard", start: timelineCursor, duration: standardRoundDuration, group, target });
        timelineCursor += standardRoundDuration;
    }
    const reviewDuration = reviewLeadIn + target * reviewStepDuration + reviewTail;
    countingScenes.push({ type: "review", start: timelineCursor, duration: reviewDuration, group: groups[2], target });
    timelineCursor += reviewDuration;
}

export const countToTenDuration = timelineCursor;

export const CountToTenComposition = () => {
    const frame = useCurrentFrame();
    const scene = countingScenes.find(({ start, duration }) => frame >= start && frame < start + duration) ?? null;
    const sceneIndex = scene ? countingScenes.indexOf(scene) : -1;
    const nextScene = sceneIndex >= 0 ? countingScenes[sceneIndex + 1] : null;
    const sceneFrame = scene ? frame - scene.start : 0;
    const selectedGroup = scene?.group ?? countingGroups[0];
    const selectedIndices = selectedGroup.indices;
    const target = scene?.target ?? 0;
    const isReview = scene?.type === "review";
    const reviewCount = isReview && sceneFrame >= reviewLeadIn
        ? Math.min(Math.floor((sceneFrame - reviewLeadIn) / reviewStepDuration) + 1, target)
        : 0;
    const displayedCount = isReview ? reviewCount : target;
    const outlineCenter = selectedGroup.center;
    const outlineRadius = selectedGroup.radius;
    const isFinalScene = scene === countingScenes.at(-1);
    const continuesIntoReview =
        scene?.type === "standard" &&
        nextScene?.type === "review" &&
        nextScene.target === scene.target &&
        nextScene.group === scene.group;
    const sceneIsVisible = scene !== null && (isFinalScene || continuesIntoReview || sceneFrame < scene.duration - 10);
    const outlineProgress = isReview ? 1 : interpolate(sceneFrame, [10, 40], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const numberFadeIn = isReview ? (reviewCount > 0 ? 1 : 0) : interpolate(sceneFrame, [43, 53], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const numberFadeOut = !scene
        ? 0
        : isFinalScene
          ? 1
          : interpolate(sceneFrame, [scene.duration - 20, scene.duration - 10], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
          });
    const numberOpacity = sceneIsVisible ? numberFadeIn * numberFadeOut : 0;
    const reviewOrder = [...selectedIndices].sort((first, second) => {
        const verticalDifference = circlePositions[first].y - circlePositions[second].y;
        return Math.abs(verticalDifference) > 35 ? verticalDifference : circlePositions[first].x - circlePositions[second].x;
    });
    const reviewIsCounting =
        isReview &&
        reviewCount > 0 &&
        sceneFrame < reviewLeadIn + target * reviewStepDuration;
    const reviewStepFrame = reviewIsCounting
        ? (sceneFrame - reviewLeadIn) % reviewStepDuration
        : 0;
    const pulsedCircleIndex = reviewIsCounting && reviewStepFrame < 30
        ? reviewOrder[reviewCount - 1]
        : null;
    const pulseScale = interpolate(reviewStepFrame, [0, 8, 18, 30], [1, 1.7, 1, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#ffffff",
                fontFamily: "Encode Sans Semi Condensed, sans-serif",
            }}
        >
            <VideoChrome curriculumLabel="A.01.01 Zahlen von 0 bis 10">
                {countingScenes.flatMap((audioScene, sceneIndex) => {
                    if (audioScene.type === "standard") {
                        const audioStart = audioScene.start + 45;
                        return (
                            <Sequence key={`${sceneIndex}-standard`} from={audioStart} premountFor={30}>
                                <Html5Audio src={staticFile(`remotion/number-line-audio/${numberAudioFiles[audioScene.target]}.mp3`)} />
                            </Sequence>
                        );
                    }
                    return Array.from({ length: audioScene.target }, (_, index) => {
                        const audioStart = audioScene.start + reviewLeadIn + index * reviewStepDuration;
                        return (
                            <Sequence key={`${sceneIndex}-review-${index}`} from={audioStart} premountFor={30}>
                                <Html5Audio src={staticFile(`remotion/number-line-audio/${numberAudioFiles[index + 1]}.mp3`)} />
                            </Sequence>
                        );
                    });
                })}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "50%",
                    }}
                >
                    {circlePositions.map((circle, index) => (
                        <span
                            key={index}
                            style={{
                                position: "absolute",
                                top: circle.y,
                                left: circle.x,
                                width: circleSize,
                                height: circleSize,
                                transform: `translate(-50%, -50%) scale(${index === pulsedCircleIndex ? pulseScale : 1})`,
                                borderRadius: "50%",
                                backgroundColor: sceneIsVisible && selectedIndices.includes(index) ? "#0BA5EC" : "#101828",
                            }}
                        />
                    ))}

                    {sceneIsVisible && (
                        <svg
                            viewBox="0 0 960 1080"
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                overflow: "visible",
                                pointerEvents: "none",
                            }}
                        >
                            <path
                                d={createHandDrawnCirclePath(outlineCenter, outlineRadius)}
                                fill="none"
                                stroke="#0BA5EC"
                                strokeWidth={7}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                pathLength={1}
                                strokeDasharray={1}
                                strokeDashoffset={1 - outlineProgress}
                            />
                        </svg>
                    )}
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 350,
                        right: 0,
                        display: "flex",
                        width: "50%",
                        height: 200,
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#101828",
                        fontSize: 180,
                        fontWeight: 700,
                        lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                        opacity: numberOpacity,
                    }}
                >
                    {displayedCount}
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 620,
                        right: 0,
                        display: "flex",
                        width: "50%",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 18,
                    }}
                >
                    {Array.from({ length: 10 }, (_, index) => (
                        <span
                            key={index}
                            style={{
                                width: circleSize,
                                height: circleSize,
                                flexShrink: 0,
                                borderRadius: "50%",
                                backgroundColor:
                                    sceneIsVisible &&
                                    index < displayedCount &&
                                    (isReview || sceneFrame >= 45)
                                        ? "#0BA5EC"
                                        : "#D0D5DD",
                            }}
                        />
                    ))}
                </div>
            </VideoChrome>
        </AbsoluteFill>
    );
};
