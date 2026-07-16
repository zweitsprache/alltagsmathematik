"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "@untitledui/icons";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { useExerciseTracking } from "@/components/exercises/tracking/tracked-exercise";
import { playAlignedStreamedTts } from "@/lib/audio/play-streamed-tts";

const stepCount = 55;
const slideCount = 11;
const pad = (value: number) => value.toString().padStart(2, "0");

const slidePhrases: Record<number, string> = {
    5: "fünf nach",
    10: "zehn nach",
    15: "Viertel nach",
    20: "zwanzig nach",
    25: "fünf vor halb",
    30: "halb",
    35: "fünf nach halb",
    40: "zwanzig vor",
    45: "Viertel vor",
    50: "zehn vor",
    55: "fünf vor",
};

const segmentRanges: Record<number, [number, number]> = {
    5: [0, 5],
    10: [0, 10],
    15: [0, 15],
    20: [0, 20],
    25: [25, 30],
    30: [30, 60],
    35: [30, 35],
    40: [30, 40],
    45: [30, 45],
    50: [30, 50],
    55: [55, 60],
};

const segmentPath = (minute: number) => {
    const outerRadius = 374;
    const innerRadius = 362;
    const [startMinute, endMinute] = segmentRanges[minute] ?? [0, 0];
    const point = (value: number, radius: number) => {
        const angle = (value * 6 - 90) * Math.PI / 180;
        return { x: 340 + radius * Math.cos(angle), y: 340 + radius * Math.sin(angle) };
    };
    const outerStart = point(startMinute, outerRadius);
    const outerEnd = point(endMinute, outerRadius);
    const innerStart = point(startMinute, innerRadius);
    const innerEnd = point(endMinute, innerRadius);
    const largeArc = endMinute - startMinute > 30 ? 1 : 0;
    return `M${outerStart.x} ${outerStart.y} A${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} L${innerEnd.x} ${innerEnd.y} A${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y} Z`;
};

const wait = (duration: number, signal: AbortSignal) => new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, duration);
    signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        resolve();
    }, { once: true });
});

const MinuteClock = ({ minute, showSegment }: { minute: number; showSegment: boolean }) => {
    const clockRef = useRef<HTMLObjectElement>(null);

    const updateClock = useCallback(() => {
        const document = clockRef.current?.contentDocument;
        const svg = document?.documentElement as unknown as SVGSVGElement | undefined;
        const hourHand = document?.getElementById("hour_hand") as SVGGraphicsElement | null;
        const minuteHand = document?.getElementById("minute_hand") as SVGGraphicsElement | null;
        if (!document || !hourHand || !minuteHand) return;

        const centerX = svg ? svg.viewBox.baseVal.x + svg.viewBox.baseVal.width / 2 : 340;
        const centerY = svg ? svg.viewBox.baseVal.y + svg.viewBox.baseVal.height / 2 : 340;
        for (const hand of [hourHand, minuteHand]) {
            hand.style.transformBox = "view-box";
            hand.style.transformOrigin = `${centerX}px ${centerY}px`;
        }
        const minuteColor = window.getComputedStyle(window.document.documentElement).getPropertyValue("--color-fg-sky-primary").trim();
        hourHand.style.transition = "transform 500ms ease-in-out";
        hourHand.style.transform = `rotate(${minute * 0.5}deg)`;
        minuteHand.style.transition = "none";
        minuteHand.style.fill = minuteColor || "#0284c7";
        minuteHand.style.transform = `rotate(${minute * 6}deg)`;

    }, [minute]);

    useEffect(() => updateClock(), [updateClock]);

    return (
        <div className="relative aspect-square w-full">
            <object ref={clockRef} type="image/svg+xml" data="/transfer/am_zifferblatt_0000.svg" aria-label="Analoges Zifferblatt" onLoad={updateClock} className="pointer-events-none relative z-10 aspect-square w-full" />
            <svg viewBox="0 0 680 680" aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible">
                <path
                    d={segmentPath(minute)}
                    fill="var(--color-fg-sky-primary)"
                    className={`transition-opacity duration-300 ${showSegment ? "opacity-100" : "opacity-0"}`}
                />
            </svg>
        </div>
    );
};

export const OfficialMinuteIntro = () => {
    const tracking = useExerciseTracking();
    const [minute, setMinute] = useState(0);
    const [progress, setProgress] = useState(0);
    const [phrase, setPhrase] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackError, setPlaybackError] = useState("");
    const playbackAbort = useRef<AbortController | null>(null);

    useEffect(() => () => playbackAbort.current?.abort(), []);

    const start = async () => {
        playbackAbort.current?.abort();
        const abortController = new AbortController();
        playbackAbort.current = abortController;
        setMinute(0);
        setProgress(0);
        setPhrase("");
        setPlaybackError("");
        setIsPlaying(true);

        try {
            for (let nextMinute = 1; nextMinute <= stepCount; nextMinute++) {
                await wait(650, abortController.signal);
                if (abortController.signal.aborted) break;
                setMinute(nextMinute);

                if (nextMinute % 5 === 0) {
                    const nextPhrase = slidePhrases[nextMinute];
                    setPhrase(nextPhrase);
                    setProgress(nextMinute / 5);
                    await playAlignedStreamedTts(nextPhrase, () => undefined, abortController.signal);
                    await wait(900, abortController.signal);
                    if (nextMinute < stepCount) setPhrase("");
                }
            }

            if (!abortController.signal.aborted) tracking.complete({ minutes: stepCount });
        } catch (error) {
            if (!abortController.signal.aborted) setPlaybackError(error instanceof Error ? error.message : "Audio konnte nicht abgespielt werden.");
        } finally {
            if (playbackAbort.current === abortController) playbackAbort.current = null;
            setIsPlaying(false);
        }
    };

    return (
        <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-lg bg-primary ring-2 ring-border-primary ring-inset">
            <p className="absolute top-5 left-5 text-xs font-bold text-primary">alltagsmathematik.ch</p>
            <nav aria-label="Breadcrumb" className="absolute top-5 right-5 flex flex-wrap items-center justify-end gap-1.5 text-xs font-medium text-tertiary">
                <span>Raum und Zeit</span>
                <span aria-hidden="true">›</span>
                <span>Uhrzeiten</span>
            </nav>

            <div className="flex h-full flex-col px-8 pt-14 pb-5">
                <div className="grid min-h-0 flex-1 grid-cols-2 items-center gap-10">
                    <div className="flex items-center justify-center p-5">
                        <div className="w-[85%]">
                            <MinuteClock minute={minute} showSegment={minute > 0 && minute % 5 === 0} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-6">
                        <p className="flex w-full items-baseline justify-start gap-2 text-left text-display-xl font-black tabular-nums text-primary">
                            <span className="inline-block w-[0.7em] border-b-4 border-current" aria-hidden="true" />
                            <span className="mr-3 inline-block w-[0.7em] border-b-4 border-current" aria-hidden="true" />
                            <span>:{pad(minute)}</span>
                        </p>
                        <p className="flex min-h-24 w-full items-center justify-start text-left text-[44px] leading-tight font-normal text-primary">
                            {phrase}
                        </p>
                        {!isPlaying && (
                            <button type="button" onClick={() => void start()} aria-label="Präsentation starten" className="flex h-10 w-32 items-center justify-center rounded-sm bg-brand-solid text-white shadow-xs-skeuomorphic outline-focus-ring transition hover:bg-brand-solid_hover focus-visible:outline-2 focus-visible:outline-offset-2">
                                <Play className="size-5" />
                            </button>
                        )}
                        {playbackError && <p className="text-xs text-error-primary" role="alert">{playbackError}</p>}
                    </div>
                </div>
                <ProgressBar labelPosition="right" min={0} max={slideCount} value={progress} valueFormatter={(value) => `${value} / ${slideCount}`} />
            </div>
        </div>
    );
};
