"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Play, X } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { numberWords } from "@/content/number-words";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { translate as t } from "@/i18n/translate";
import { cx } from "@/utils/cx";

export interface NumberLineExerciseProps {
    /** Task number shown in the brand square (e.g. 1 → "01"). */
    exerciseNumber?: number;
    /** Lowest number on the line. */
    min?: number;
    /** Highest number on the line. */
    max?: number;
    /** Which numbers show a label under the tick. */
    labeledNumbers?: number[];
    /** Whether to show the target as text or play it as audio. */
    presentation?: "text" | "audio" | "word";
    taskCount?: number;
    rangeSize?: number;
}


const shuffle = (items: number[]) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

const pad = (value: number) => value.toString().padStart(2, "0");

type NumberLineTask = { target: number; min: number; max: number };

const createTasks = (min: number, max: number, taskCount?: number, rangeSize?: number): NumberLineTask[] => {
    if (!rangeSize) return shuffle(Array.from({ length: max - min + 1 }, (_, index) => min + index)).slice(0, taskCount).map((target) => ({ target, min, max }));
    const count = taskCount ?? 10;
    const windowCount = Math.floor((max - min) / rangeSize);
    return Array.from({ length: count }, () => {
        const windowMin = min + Math.floor(Math.random() * windowCount) * rangeSize;
        const windowMax = Math.min(windowMin + rangeSize, max);
        const target = windowMin + Math.floor(Math.random() * (windowMax - windowMin + 1));
        return { target, min: windowMin, max: windowMax };
    });
};

export const NumberLineExercise = ({ exerciseNumber = 1, min = 0, max = 10, labeledNumbers = [0, 5, 10], presentation = "text", taskCount, rangeSize }: NumberLineExerciseProps) => {
    const initialMax = rangeSize ? Math.min(min + rangeSize, max) : max;
    const initialNumbers = Array.from({ length: initialMax - min + 1 }, (_, index) => min + index);
    const [sequence, setSequence] = useState<NumberLineTask[]>(initialNumbers.slice(0, taskCount).map((target) => ({ target, min, max: initialMax })));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [feedback, setFeedback] = useState<"wrong" | "solution" | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Shuffle on the client after mount so server and client render the same
    // initial (ordered) sequence and avoid a hydration mismatch.
    useEffect(() => {
        setSequence(createTasks(min, max, taskCount, rangeSize));
        setCurrentIndex(0);
        setSelected(null);
        setRevealed(false);
        setWrongAttempts(0);
        setFeedback(null);
    }, [min, max, taskCount, rangeSize]);

    const isFinished = currentIndex >= sequence.length;
    const task = isFinished ? null : sequence[currentIndex];
    const target = task?.target ?? null;
    const numbers = task ? Array.from({ length: task.max - task.min + 1 }, (_, index) => task.min + index) : [];
    const visibleLabels = task && rangeSize
        ? labeledNumbers.length >= 4 ? numbers : labeledNumbers.length === 3 ? [task.min, task.min + Math.floor((task.max - task.min) / 2), task.max] : [task.min, task.max]
        : labeledNumbers;

    const isCorrect = selected !== null && selected === target;
    const isWrong = selected !== null && selected !== target;

    // Track wrong attempts and auto-reveal after 3 wrong attempts
    useEffect(() => {
        if (!isWrong || feedback) return;
        setWrongAttempts((prev) => {
            const newCount = prev + 1;
            return newCount;
        });
        setFeedback("wrong");
    }, [feedback, isWrong]);

    useEffect(() => {
        if (!feedback) return;
        const timeout = setTimeout(() => {
            if (feedback === "wrong" && wrongAttempts >= 3) {
                setSelected(null);
                setRevealed(true);
                setFeedback("solution");
                return;
            }
            if (feedback === "solution") {
                setCurrentIndex((prev) => prev + 1);
                setSelected(null);
                setRevealed(false);
                setWrongAttempts(0);
                setFeedback(null);
                return;
            }
            setSelected(null);
            setFeedback(null);
        }, feedback === "solution" ? 1200 : 700);
        return () => clearTimeout(timeout);
    }, [feedback, wrongAttempts]);

    const nextExercise = () => {
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
        setRevealed(false);
        setWrongAttempts(0);
        setFeedback(null);
    };

    // Auto-advance to the next number shortly after a correct answer.
    useEffect(() => {
        if (!isCorrect) return;

        const timeout = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
            setSelected(null);
            setRevealed(false);
            setWrongAttempts(0);
            setFeedback(null);
        }, 800);

        return () => clearTimeout(timeout);
    }, [isCorrect]);

    const restart = () => {
        setSequence(createTasks(min, max, taskCount, rangeSize));
        setCurrentIndex(0);
        setSelected(null);
        setRevealed(false);
        setWrongAttempts(0);
        setFeedback(null);
    };

    const playTarget = async () => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
    };

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-xl bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {isFinished ? (
                <ExerciseCompletionHeader
                    exerciseNumber={exerciseNumber}
                    instruction={t(presentation === "audio" ? "instructions.number-line-listen.prompt" : presentation === "word" ? "instructions.number-line-word.prompt" : "instructions.number-line.prompt")}
                    onRestart={restart}
                />
            ) : (
                <>
                    <div className="border-b border-secondary pb-4">
                        <p className="flex items-baseline gap-2 text-md font-medium text-secondary">
                            <span className="font-black">{pad(exerciseNumber)}</span>
                            {t(presentation === "audio" ? "instructions.number-line-listen.prompt" : presentation === "word" ? "instructions.number-line-word.prompt" : "instructions.number-line.prompt")}
                        </p>
                    </div>

                    {presentation === "audio" && target !== null ? (
                        <div className="flex justify-center">
                            <audio ref={audioRef} src={`/api/audio/numbers/${target}`} preload="auto" />
                            <button
                                type="button"
                                onClick={playTarget}
                                aria-label={t("instructions.number-line-listen.play-aria")}
                                className="flex size-14 items-center justify-center rounded-lg bg-brand-solid text-white shadow-xs-skeuomorphic outline-focus-ring transition hover:bg-brand-solid_hover focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                <Play className="size-7" />
                            </button>
                        </div>
                    ) : (
                        <p className="text-center text-display-md font-black text-primary">{presentation === "word" && target !== null ? numberWords[target] : target}</p>
                    )}

                    {/* Number line */}
                    <div className="py-2">
                        <div className="relative flex items-start justify-between">
                            {/* Base line, aligned to the circle centers (size-6 → 12px) */}
                            <div className="pointer-events-none absolute inset-x-0 top-3 h-0.5 -translate-y-1/2 rounded-full bg-quaternary" />

                            {numbers.map((number) => {
                                const isSelectedNumber = selected === number;
                                const isSolution = revealed && number === target;
                                const showLabel = visibleLabels.includes(number);

                                return (
                                    <button
                                        key={number}
                                        type="button"
                                        onClick={() => setSelected(number)}
                                        aria-label={t("instructions.number-line.mark-number-aria", { number })}
                                        aria-pressed={isSelectedNumber}
                                        className="group relative flex flex-col items-center gap-2 outline-none"
                                    >
                                        <span
                                            className={cx(
                                                "flex size-6 items-center justify-center rounded-full ring-2 transition duration-100 ease-linear",
                                                "bg-primary ring-border-primary group-hover:ring-brand group-focus-visible:ring-brand",
                                                isSelectedNumber && isCorrect && "bg-success-solid ring-[var(--color-bg-success-solid)]",
                                                feedback === "wrong" && isSelectedNumber && "bg-error-solid ring-[var(--color-bg-error-solid)]",
                                                !isSelectedNumber && isSolution && "bg-sky-solid ring-[var(--color-bg-sky-solid)]",
                                            )}
                                        >
                                            {isSelectedNumber && isCorrect && <Check className="size-4 text-white" />}
                                            {feedback === "wrong" && isSelectedNumber && <X className="size-4 text-white" />}
                                            {!isSelectedNumber && isSolution && <Check className="size-4 text-white" />}
                                        </span>
                                        <span
                                            className={cx(
                                                "text-sm font-medium text-tertiary transition-colors",
                                                isSelectedNumber && isCorrect && "text-success-primary",
                                                feedback === "wrong" && isSelectedNumber && "text-error-primary",
                                                !isSelectedNumber && isSolution && "text-sky-primary",
                                            )}
                                        >
                                            {showLabel ? number : "\u00A0"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Progress bar at bottom */}
                    <ProgressBar
                        labelPosition="right"
                        min={0}
                        max={sequence.length}
                        value={Math.min(currentIndex, sequence.length)}
                        valueFormatter={(value) => `${value} / ${sequence.length}`}
                    />

                    {/* Auto-advance after correct answer, no manual next button */}
                </>
            )}
        </div>
    );
};
