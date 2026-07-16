"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "@untitledui/icons";
import { toCardinal } from "n2words/de-DE";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { playAlignedStreamedTts } from "@/lib/audio/play-streamed-tts";
import { cx } from "@/utils/cx";

const pad = (value: number) => value.toString().padStart(2, "0");
const timeRows = [
    Array.from({ length: 12 }, (_, index) => index + 12),
    Array.from({ length: 12 }, (_, index) => index),
];
const minuteSteps = Array.from({ length: 12 }, (_, index) => index * 5);
const slideCount = minuteSteps.length + 1;

const formatTimeWords = (hour: number, minute: number) => {
    const hourWord = hour === 1 ? "ein" : toCardinal(hour);
    return minute === 0 ? `${hourWord} Uhr` : `${hourWord} Uhr ${toCardinal(minute)}`;
};

export const OfficialTimeIntro = () => {
    const [showTitle, setShowTitle] = useState(true);
    const [selectedHour, setSelectedHour] = useState(12);
    const [displayedHour, setDisplayedHour] = useState(12);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [showStarter, setShowStarter] = useState(true);
    const [activeWord, setActiveWord] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [playbackError, setPlaybackError] = useState("");
    const playbackAbort = useRef<AbortController | null>(null);
    const words = formatTimeWords(displayedHour, selectedMinute).split(" ").map((word) => word.replaceAll("ß", "ss"));

    useEffect(() => () => playbackAbort.current?.abort(), []);

    const selectHour = (hour: number) => {
        playbackAbort.current?.abort();
        setSelectedHour(hour);
        setDisplayedHour(hour);
        setSelectedMinute(0);
        setShowStarter(true);
        setActiveWord(null);
        setIsPlaying(false);
        setProgress(0);
        setPlaybackError("");
    };

    const playHour = async () => {
        playbackAbort.current?.abort();
        const abortController = new AbortController();
        playbackAbort.current = abortController;
        setPlaybackError("");
        setIsPlaying(true);
        setShowStarter(false);
        setProgress(0);
        try {
            const slides = [
                ...minuteSteps.map((minute) => ({ hour: selectedHour, minute })),
                { hour: (selectedHour + 1) % 24, minute: 0 },
            ];
            for (const [index, slide] of slides.entries()) {
                if (abortController.signal.aborted) break;
                setDisplayedHour(slide.hour);
                setSelectedMinute(slide.minute);
                setActiveWord(null);
                await playAlignedStreamedTts(formatTimeWords(slide.hour, slide.minute), setActiveWord, abortController.signal);
                setProgress(index + 1);
                await new Promise<void>((resolve) => {
                    const timeout = setTimeout(resolve, 500);
                    abortController.signal.addEventListener("abort", () => {
                        clearTimeout(timeout);
                        resolve();
                    }, { once: true });
                });
            }
        } catch (error) {
            if (!abortController.signal.aborted) setPlaybackError(error instanceof Error ? error.message : "Audio konnte nicht abgespielt werden.");
        } finally {
            if (playbackAbort.current === abortController) playbackAbort.current = null;
            setActiveWord(null);
            setIsPlaying(false);
            if (!abortController.signal.aborted) setShowStarter(true);
        }
    };

    return (
        <div
            className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-lg bg-primary bg-cover bg-center"
            style={showTitle ? { backgroundImage: "url('/transfer/gpt-image-2_close_up_of_a_person_s_hand_holding_an_iPhone_with_the_screen_displaying_the_tim-2.jpg')" } : undefined}
        >
            <p className={cx("absolute top-5 left-5 text-xs font-bold", showTitle ? "text-white" : "text-primary")}>alltagsmathematik.ch</p>
            <nav aria-label="Breadcrumb" className={cx("absolute top-5 right-5 flex flex-wrap items-center justify-end gap-1.5 text-xs font-medium", showTitle ? "text-white" : "text-tertiary")}>
                <span>Raum und Zeit</span>
                <span aria-hidden="true">›</span>
                <span>Uhrzeiten</span>
            </nav>

            <div className="flex h-full flex-col px-5 pt-16 pb-5">
                {showTitle ? (
                    <button
                        type="button"
                        onClick={() => setShowTitle(false)}
                        aria-label="Präsentation öffnen"
                        className="flex min-h-0 flex-1 flex-col items-center justify-center outline-focus-ring focus-visible:outline-2 focus-visible:outline-inset"
                    >
                        <div className="relative top-[60px] -ml-5 w-[692px] self-start rounded-r-lg bg-sky-900 px-8 py-5">
                            <h2 className="text-left text-display-sm leading-tight font-bold text-white">
                                Digitale Uhrzeiten in offizieller Sprechweise
                            </h2>
                            <p className="mt-1 text-left text-display-sm leading-tight font-normal text-white">
                                Von 12:15 zu «Zwölf Uhr fünfzehn»
                            </p>
                        </div>
                    </button>
                ) : (
                    <>
                <div className="grid gap-2">
                    {timeRows.map((hours, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-12 gap-1.5">
                            {hours.map((hour) => {
                                const selected = selectedHour === hour;
                                return (
                                    <button
                                        key={hour}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() => selectHour(hour)}
                                        className={cx(
                                            "flex h-9 min-w-0 items-center justify-center rounded-sm px-1 text-sm font-semibold tabular-nums text-secondary ring-1 ring-secondary outline-focus-ring transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2",
                                            selected && "bg-brand-solid text-white ring-brand-solid hover:bg-brand-solid_hover",
                                        )}
                                    >
                                        {pad(hour)}:00
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4" aria-live="polite">
                    {showStarter ? (
                        <div className="flex flex-col items-center gap-6">
                            <p className="text-display-xl font-black tabular-nums text-primary">
                                {pad(selectedHour)}:00 – {pad((selectedHour + 1) % 24)}:00
                            </p>
                            <button
                                type="button"
                                onClick={() => void playHour()}
                                disabled={isPlaying}
                                aria-label="Uhrzeiten abspielen"
                                className="flex h-10 min-w-32 items-center justify-center rounded-sm bg-brand-solid px-5 text-white shadow-xs-skeuomorphic outline-focus-ring transition hover:bg-brand-solid_hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
                            >
                                <Play className="size-5" />
                            </button>
                        </div>
                    ) : (
                    <>
                    <div className="flex w-full flex-col items-center gap-1">
                        <p className="flex items-center text-display-xl font-black tabular-nums text-primary">
                            <span className={cx("inline-flex w-[2ch] shrink-0 justify-center transition-colors", activeWord === 0 && "text-utility-sky-700")}>{pad(displayedHour)}</span>
                            <span className={cx("inline-flex w-[0.7ch] shrink-0 justify-center transition-colors", activeWord === 1 && "text-utility-sky-700")}>:</span>
                            <span className={cx("inline-flex w-[2ch] shrink-0 justify-center transition-colors", activeWord !== null && activeWord >= 2 && "text-utility-sky-700")}>{pad(selectedMinute)}</span>
                        </p>
                        <p className="grid min-h-14 w-full max-w-2xl grid-cols-[1fr_0.7ch_1fr] items-center text-[44px] leading-tight font-normal text-primary">
                            <span className={cx("justify-self-end pr-10 whitespace-nowrap transition-colors", activeWord === 0 && "text-utility-sky-700")}>{words[0]}</span>
                            <span className={cx("justify-self-center whitespace-nowrap transition-colors", activeWord === 1 && "text-utility-sky-700")}>Uhr</span>
                            <span className={cx(
                                "justify-self-start pl-10 whitespace-nowrap transition-colors",
                                selectedMinute === 0 && "text-tertiary line-through decoration-4",
                                activeWord === 2 && "text-utility-sky-700",
                            )}>
                                {selectedMinute === 0 ? "null null" : words[2] ?? ""}
                            </span>
                        </p>
                    </div>
                    {playbackError && <p className="text-xs text-error-primary" role="alert">{playbackError}</p>}
                    </>
                    )}
                </div>
                <ProgressBar labelPosition="right" min={0} max={slideCount} value={progress} valueFormatter={(value) => `${value} / ${slideCount}`} />
                    </>
                )}
            </div>
        </div>
    );
};
