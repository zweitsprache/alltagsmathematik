"use client";

import { useEffect, useMemo, useState } from "react";
import { Play } from "@untitledui/icons";
import { numberWords } from "@/content/number-words";
import { useExerciseTracking } from "@/components/exercises/tracking/tracked-exercise";
import { cx } from "@/utils/cx";

const playNumber = (value: number) => void new Audio(`/api/audio/numbers/${value}`).play().catch(() => undefined);

export const IntroExercise = ({ min = 0, max = 10, values: configuredValues, title }: { min?: number; max?: number; values?: number[]; title?: string }) => {
    const tracking = useExerciseTracking();
    const values = useMemo(() => configuredValues ?? Array.from({ length: max - min + 1 }, (_, index) => min + index), [configuredValues, min, max]);
    const slides = useMemo(() => [{ type: "title" as const }, ...values.map((value) => ({ type: "number" as const, value }))], [values]);
    const titleParts = (title ?? `Die Zahlen von ${min} bis ${max}`).split(" von ");
    const hasImageTitle = min === 0 && max === 10 && !configuredValues;
    const [activeSlide, setActiveSlide] = useState(0);
    const [revealedWord, setRevealedWord] = useState<number | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [presentationProgress, setPresentationProgress] = useState(0);
    const slide = slides[activeSlide];

    useEffect(() => {
        if (!soundEnabled || slide.type !== "number") return;

        const slideIndex = activeSlide - 1;
        const audio = new Audio(`/api/audio/numbers/${slide.value}`);
        let playback = 0;
        let wordTimeout: ReturnType<typeof setTimeout> | undefined;
        let advanceTimeout: ReturnType<typeof setTimeout> | undefined;

        setRevealedWord(null);
        setPresentationProgress(slideIndex / values.length);

        const updateProgress = () => {
            const audioProgress = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.currentTime / audio.duration : 0;
            const slideProgress = playback / 2 + Math.min(audioProgress, 1) / 2;
            setPresentationProgress((slideIndex + slideProgress) / values.length);
        };

        const finishSlide = () => {
            setPresentationProgress((slideIndex + 1) / values.length);
            advanceTimeout = setTimeout(() => {
                if (activeSlide < slides.length - 1) {
                    setActiveSlide((current) => current + 1);
                    return;
                }

                setActiveSlide(0);
                setSoundEnabled(false);
                setRevealedWord(null);
                setPresentationProgress(0);
                tracking.complete({ values });
            }, 800);
        };

        const handleEnded = () => {
            if (playback === 0) {
                playback = 1;
                wordTimeout = setTimeout(() => {
                    setRevealedWord(slide.value);
                    audio.currentTime = 0;
                    void audio.play().catch(finishSlide);
                }, 1200);
                return;
            }
            finishSlide();
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleEnded);
        void audio.play().catch(finishSlide);

        return () => {
            audio.pause();
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleEnded);
            if (wordTimeout) clearTimeout(wordTimeout);
            if (advanceTimeout) clearTimeout(advanceTimeout);
        };
    }, [activeSlide, slide, slides.length, soundEnabled, tracking, values]);

    return (
        <div className="flex w-full max-w-3xl flex-col gap-6">
            <section
                className={cx("relative aspect-video w-full overflow-hidden rounded-lg bg-primary bg-cover bg-center", !(hasImageTitle && slide.type === "title") && "ring-2 ring-border-primary ring-inset")}
                style={hasImageTitle && slide.type === "title" ? { backgroundImage: "url('/transfer/gpt-image-2_kitchen_board_with_3_group_of_vegetables_2_onions_3_carrots_4_potatoes-0.jpg')" } : undefined}
            >
                <p className={cx("absolute top-5 left-5 z-10 text-xs font-bold", hasImageTitle && slide.type === "title" ? "text-white" : "text-primary")}>alltagsmathematik.ch</p>
                <nav aria-label="Breadcrumb" className={cx("absolute top-5 right-5 z-10 flex flex-wrap items-center justify-end gap-1.5 text-xs font-medium", hasImageTitle && slide.type === "title" ? "text-white" : "text-tertiary")}>
                    <span>Zahlen und Variablen</span>
                    <span aria-hidden="true">›</span>
                    <span>Zahlen benennen und schreiben</span>
                </nav>

                {slide.type === "title" ? (
                    hasImageTitle ? (
                        <button
                            type="button"
                            onClick={() => {
                                tracking.restart();
                                setSoundEnabled(true);
                                setActiveSlide(1);
                            }}
                            aria-label="Präsentation öffnen"
                            className="flex size-full flex-col items-start justify-center outline-focus-ring focus-visible:outline-2 focus-visible:outline-inset"
                        >
                            <div className="relative z-10 top-[82px] w-[692px] self-start rounded-r-lg bg-sky-900 px-8 py-5 text-left">
                                <h2 className="text-display-sm leading-tight font-bold text-white">
                                    Zahlen nennen, lesen und schreiben
                                </h2>
                                <p className="mt-1 text-display-sm leading-tight font-normal text-white">
                                    Die Zahlen von 0 bis 10
                                </p>
                            </div>
                            <Play className="absolute top-1/3 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 fill-white text-white opacity-30" aria-hidden="true" />
                        </button>
                    ) : (
                    <div className="flex size-full items-center justify-center px-8 text-center">
                        <div className="flex flex-col items-center gap-6">
                            <h2 className="text-display-lg font-black text-primary">{titleParts[0]} von<br />{titleParts[1]}</h2>
                            {!soundEnabled && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        tracking.restart();
                                        setSoundEnabled(true);
                                        setActiveSlide(1);
                                    }}
                                    aria-label="Ton einschalten"
                                    className="flex h-10 w-32 items-center justify-center rounded-sm bg-brand-solid text-white shadow-xs-skeuomorphic outline-focus-ring hover:bg-brand-solid_hover focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    <Play className="size-5" />
                                </button>
                            )}
                        </div>
                    </div>
                    )
                ) : (
                    <div className="flex size-full flex-col px-10 pt-12 pb-10">
                        <div className="flex flex-1 flex-col items-center justify-center">
                            <div className="flex h-24 items-center justify-center text-display-xl font-black text-primary">{slide.value}</div>
                            <div className="h-px w-[25rem] bg-border-secondary" />
                            <div className="flex h-24 items-center justify-center text-display-xl font-black text-primary">
                                {revealedWord === slide.value ? numberWords[slide.value] : ""}
                            </div>
                        </div>
                        {min === 0 && !configuredValues ? (
                            <div className="grid aspect-[10/1] grid-cols-10">
                                {Array.from({ length: max }, (_, index) => (
                                    <span key={index} className={`-ml-px border border-sky-700 first:ml-0 ${index < slide.value ? "bg-sky-secondary" : ""}`} />
                                ))}
                            </div>
                        ) : (
                            <div className="aspect-[10/1]" aria-hidden="true" />
                        )}
                    </div>
                )}

                {soundEnabled && (
                    <div
                        className="absolute right-10 bottom-6 left-10 h-1 bg-secondary"
                        aria-label="Fortschritt der Präsentation"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(presentationProgress * 100)}
                    >
                        <div className="h-full bg-brand-solid" style={{ width: `${presentationProgress * 100}%` }} />
                    </div>
                )}
            </section>

            {hasImageTitle ? (
                <div className="grid grid-cols-6 gap-2">
                    {values.map((value) => {
                        const word = numberWords[value];
                        return (
                            <div key={value} className={cx("flex min-h-20 items-stretch overflow-hidden rounded-md border border-secondary bg-primary px-3 py-2", value === 6 && "col-start-2")}>
                                <button
                                    type="button"
                                    onClick={() => playNumber(value)}
                                    aria-label={`${word} anhören`}
                                    className="mr-3 flex shrink-0 items-center justify-center border-r border-secondary pr-3 text-brand-secondary outline-focus-ring hover:text-brand-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    <Play className="size-5 fill-current" />
                                </button>
                                <div className="flex min-w-0 flex-1 flex-col justify-center">
                                    <span className="text-lg leading-tight font-black text-primary">{value}</span>
                                    <span className="truncate text-sm leading-tight font-medium text-secondary">{word}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
            <div className="overflow-hidden rounded-lg border border-secondary">
                <table className="w-full text-left">
                    <tbody>
                        {values.map((value) => {
                            const word = numberWords[value];
                            return (
                                <tr key={value} className="border-b border-secondary last:border-b-0">
                                    <td className="w-20 px-4 py-3 text-lg font-black text-primary">{value}</td>
                                    <td className="px-4 py-3 text-md font-medium text-primary">{word}</td>
                                    <td className="w-16 px-4 py-2 text-right">
                                        <button
                                            type="button"
                                            onClick={() => playNumber(value)}
                                            aria-label={`${word} anhören`}
                                            className="inline-flex size-8 items-center justify-center rounded-sm bg-brand-solid text-white outline-focus-ring hover:bg-brand-solid_hover focus-visible:outline-2 focus-visible:outline-offset-2"
                                        >
                                            <Play className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
};
