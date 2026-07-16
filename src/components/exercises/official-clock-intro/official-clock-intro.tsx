"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloudMoon, Play, Sun } from "@untitledui/icons";
import { toCardinal } from "n2words/de-DE";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { useExerciseTracking } from "@/components/exercises/tracking/tracked-exercise";
import { playAlignedStreamedTts } from "@/lib/audio/play-streamed-tts";

const positions = [...Array.from({ length: 12 }, (_, index) => index), 0];
const positionCount = positions.length;
const formatHour = (hour: number) => `${hour === 1 ? "ein" : toCardinal(hour)} Uhr`;
const displayPhrase = (phrase: string) => phrase.replaceAll("ß", "ss");

const pause = (duration: number, signal: AbortSignal) => new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, duration);
    signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        resolve();
    }, { once: true });
});

const AnimatedClock = ({ position, isDaytime }: { position: number; isDaytime: boolean }) => {
    const clockRef = useRef<HTMLObjectElement>(null);

    const updateClock = useCallback(() => {
        const document = clockRef.current?.contentDocument;
        const svg = document?.documentElement as unknown as SVGSVGElement | undefined;
        const hourHand = document?.getElementById("hour_hand") as SVGGraphicsElement | null;
        const minuteHand = document?.getElementById("minute_hand") as SVGGraphicsElement | null;
        if (!hourHand || !minuteHand) return;

        const centerX = svg ? svg.viewBox.baseVal.x + svg.viewBox.baseVal.width / 2 : 340;
        const centerY = svg ? svg.viewBox.baseVal.y + svg.viewBox.baseVal.height / 2 : 340;
        for (const hand of [hourHand, minuteHand]) {
            hand.style.transformBox = "view-box";
            hand.style.transformOrigin = `${centerX}px ${centerY}px`;
        }
        const handColor = window.getComputedStyle(window.document.documentElement)
            .getPropertyValue(isDaytime ? "--color-utility-yellow-500" : "--color-fg-sky-primary")
            .trim();
        hourHand.style.transition = "transform 700ms ease-in-out, fill 300ms ease-in-out";
        hourHand.style.fill = handColor || (isDaytime ? "#eaaa08" : "#0284c7");
        hourHand.style.transform = `rotate(${position * 30}deg)`;
        minuteHand.style.transform = "rotate(0deg)";
    }, [isDaytime, position]);

    useEffect(() => updateClock(), [updateClock]);

    return <object ref={clockRef} type="image/svg+xml" data="/transfer/am_zifferblatt_0000.svg" aria-label="Analoges Zifferblatt" onLoad={updateClock} className="pointer-events-none aspect-square w-full" />;
};

export const OfficialClockIntro = () => {
    const tracking = useExerciseTracking();
    const [position, setPosition] = useState(0);
    const [spokenHour, setSpokenHour] = useState(0);
    const [phrase, setPhrase] = useState("");
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackError, setPlaybackError] = useState("");
    const playbackAbort = useRef<AbortController | null>(null);

    useEffect(() => () => playbackAbort.current?.abort(), []);

    const start = async () => {
        playbackAbort.current?.abort();
        const abortController = new AbortController();
        playbackAbort.current = abortController;
        setPosition(0);
        setSpokenHour(0);
        setPhrase("");
        setProgress(0);
        setPlaybackError("");
        setIsPlaying(true);

        try {
            for (const [index, nextPosition] of positions.entries()) {
                if (abortController.signal.aborted) break;
                setPosition(nextPosition);
                const firstHour = nextPosition;
                const secondHour = nextPosition + 12;
                for (const hour of [firstHour, secondHour]) {
                    const spokenPhrase = formatHour(hour);
                    setSpokenHour(hour);
                    setPhrase(displayPhrase(spokenPhrase));
                    await playAlignedStreamedTts(spokenPhrase, () => undefined, abortController.signal);
                    await pause(900, abortController.signal);
                }
                setProgress(index + 1);
            }
            if (!abortController.signal.aborted) tracking.complete({ positions: positionCount });
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
                            <AnimatedClock position={position} isDaytime={spokenHour >= 6 && spokenHour <= 18} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div className="flex h-10 items-center justify-start self-stretch">
                            {spokenHour >= 6 && spokenHour <= 18 ? (
                                <Sun className="size-9 text-utility-yellow-500" aria-label="Tag" />
                            ) : (
                                <CloudMoon className="size-9 text-utility-sky-700" aria-label="Nacht" />
                            )}
                        </div>
                        <p className="flex min-h-28 w-full max-w-sm flex-col items-start justify-center text-left text-[44px] leading-tight font-normal text-primary">
                            {phrase && (
                                <>
                                    <span>{phrase.replace(/ Uhr$/, "")}</span>
                                    <span>Uhr</span>
                                </>
                            )}
                        </p>
                        {!isPlaying && (
                            <button type="button" onClick={() => void start()} aria-label="Präsentation starten" className="flex h-10 w-32 items-center justify-center rounded-sm bg-brand-solid text-white shadow-xs-skeuomorphic outline-focus-ring transition hover:bg-brand-solid_hover focus-visible:outline-2 focus-visible:outline-offset-2">
                                <Play className="size-5" />
                            </button>
                        )}
                        {playbackError && <p className="text-xs text-error-primary" role="alert">{playbackError}</p>}
                    </div>
                </div>
                <ProgressBar labelPosition="right" min={0} max={positionCount} value={progress} valueFormatter={(value) => `${value} / ${positionCount}`} />
            </div>
        </div>
    );
};
