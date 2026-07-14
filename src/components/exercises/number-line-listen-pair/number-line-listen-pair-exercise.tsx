"use client";

import { useEffect, useState } from "react";
import { Check, Play, X } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { numberWords } from "@/content/number-words";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { translate as t } from "@/i18n/translate";
import { cx } from "@/utils/cx";

export interface NumberLineListenPairExerciseProps {
    exerciseNumber?: number;
    min?: number;
    max?: number;
    labeledNumbers?: number[];
    presentation?: "audio" | "word";
    rangeSize?: number;
}

const taskCount = 10;
const pad = (value: number) => value.toString().padStart(2, "0");

const createPairs = (min: number, max: number) =>
    Array.from({ length: taskCount }, () => {
        const first = min + Math.floor(Math.random() * (max - min + 1));
        let second = min + Math.floor(Math.random() * (max - min + 1));
        while (second === first) second = min + Math.floor(Math.random() * (max - min + 1));
        return [first, second] as [number, number];
    });

const createWindowedPairs = (min: number, max: number, rangeSize: number) => {
    const windowCount = Math.floor((max - min) / rangeSize);
    return Array.from({ length: taskCount }, () => {
        const windowMin = min + Math.floor(Math.random() * windowCount) * rangeSize;
        const windowMax = Math.min(windowMin + rangeSize, max);
        const [pair] = createPairs(windowMin, windowMax);
        return { pair, min: windowMin, max: windowMax };
    });
};

const playNumber = (number: number) =>
    new Promise<void>((resolve, reject) => {
        const audio = new Audio(`/api/audio/numbers/${number}`);
        audio.addEventListener("ended", () => resolve(), { once: true });
        audio.addEventListener("error", () => reject(new Error("Audio could not be played.")), { once: true });
        void audio.play().catch(reject);
    });

export const NumberLineListenPairExercise = ({ exerciseNumber = 1, min = 0, max = 10, labeledNumbers = [0, 5, 10], presentation = "audio", rangeSize }: NumberLineListenPairExerciseProps) => {
    const initialMax = rangeSize ? Math.min(min + rangeSize, max) : max;
    const initialNumbers = Array.from({ length: initialMax - min + 1 }, (_, index) => min + index);
    const [tasks, setTasks] = useState(() => initialNumbers.slice(0, taskCount).map((number) => ({ pair: [number, number === initialMax ? min : number + 1] as [number, number], min, max: initialMax })));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<number[]>([]);
    const [result, setResult] = useState<"correct" | "wrong" | "solution" | null>(null);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setTasks(rangeSize ? createWindowedPairs(min, max, rangeSize) : createPairs(min, max).map((pair) => ({ pair, min, max })));
        setCurrentIndex(0);
        setSelected([]);
        setResult(null);
        setWrongAttempts(0);
        setRevealed(false);
    }, [min, max, rangeSize]);

    const isFinished = currentIndex >= taskCount;
    const task = isFinished ? null : tasks[currentIndex];
    const targets = task?.pair ?? null;
    const numbers = task ? Array.from({ length: task.max - task.min + 1 }, (_, index) => task.min + index) : [];
    const visibleLabels = task && rangeSize
        ? labeledNumbers.length >= 4 ? numbers : labeledNumbers.length === 3 ? [task.min, task.min + Math.floor((task.max - task.min) / 2), task.max] : [task.min, task.max]
        : labeledNumbers;

    useEffect(() => {
        if (result !== "correct") return;
        const timeout = setTimeout(() => {
            setCurrentIndex((index) => index + 1);
            setSelected([]);
            setResult(null);
            setWrongAttempts(0);
            setRevealed(false);
        }, 800);
        return () => clearTimeout(timeout);
    }, [result]);

    useEffect(() => {
        if (result !== "wrong" && result !== "solution") return;

        const timeout = setTimeout(() => {
            if (result === "wrong" && wrongAttempts >= 3) {
                setSelected([]);
                setRevealed(true);
                setResult("solution");
                return;
            }
            if (result === "solution") {
                setCurrentIndex((index) => index + 1);
                setSelected([]);
                setResult(null);
                setWrongAttempts(0);
                setRevealed(false);
                return;
            }
            setSelected([]);
            setResult(null);
        }, result === "solution" ? 1200 : 700);

        return () => clearTimeout(timeout);
    }, [result, wrongAttempts]);

    const playTargets = async () => {
        if (!targets || isPlaying) return;
        setIsPlaying(true);
        try {
            await playNumber(targets[0]);
            await new Promise((resolve) => setTimeout(resolve, 300));
            await playNumber(targets[1]);
        } finally {
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        if (!targets || selected.length !== 2) return;
        if (targets.every((target) => selected.includes(target))) {
            setResult("correct");
            return;
        }

        setResult("wrong");
        setWrongAttempts((attempts) => {
            const nextAttempts = attempts + 1;
            if (nextAttempts >= 3) setRevealed(true);
            return nextAttempts;
        });
    }, [selected, targets]);

    const selectNumber = (number: number) => {
        if (!targets || result !== null || revealed) return;
        setResult(null);
        setSelected((current) => {
            if (current.includes(number)) return current.filter((item) => item !== number);
            if (current.length >= 2) return current;
            return [...current, number];
        });
    };

    const restart = () => {
        setTasks(rangeSize ? createWindowedPairs(min, max, rangeSize) : createPairs(min, max).map((pair) => ({ pair, min, max })));
        setCurrentIndex(0);
        setSelected([]);
        setResult(null);
        setWrongAttempts(0);
        setRevealed(false);
    };

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-xl bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {isFinished ? (
                <ExerciseCompletionHeader
                    exerciseNumber={exerciseNumber}
                    instruction={t(presentation === "audio" ? "instructions.number-line-listen-pair.prompt" : "instructions.number-line-word.prompt-pair")}
                    onRestart={restart}
                />
            ) : (
                <>
                    <div className="border-b border-secondary pb-4">
                        <p className="flex items-baseline gap-2 text-md font-medium text-secondary">
                            <span className="font-black">{pad(exerciseNumber)}</span>
                            {t(presentation === "audio" ? "instructions.number-line-listen-pair.prompt" : "instructions.number-line-word.prompt-pair")}
                        </p>
                    </div>

                    {presentation === "audio" ? (
                        <div className="flex justify-center">
                            <button
                            type="button"
                            onClick={playTargets}
                            disabled={isPlaying}
                            aria-label={t("instructions.number-line-listen-pair.play-aria")}
                            className="flex size-14 items-center justify-center rounded-lg bg-brand-solid text-white shadow-xs-skeuomorphic outline-focus-ring transition hover:bg-brand-solid_hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
                        >
                            <Play className="size-7" />
                            </button>
                        </div>
                    ) : (
                        <p className="text-center text-display-md font-black text-primary">{targets?.map((target) => numberWords[target]).join(" · ")}</p>
                    )}

                    <div className="py-2">
                        <div className="relative flex items-start justify-between">
                            <div className="pointer-events-none absolute inset-x-0 top-3 h-0.5 -translate-y-1/2 rounded-full bg-quaternary" />
                            {numbers.map((number) => {
                                const isSelected = selected.includes(number);
                                const isTarget = targets?.includes(number) ?? false;
                                const isPendingSelection = isSelected && result === null;
                                const isCorrectSelection = isSelected && result === "correct";
                                const isWrongSelection = isSelected && result === "wrong";
                                const isRevealedSolution = revealed && isTarget && !isSelected;

                                return (
                                    <button
                                        key={number}
                                        type="button"
                                        onClick={() => selectNumber(number)}
                                        aria-label={t("instructions.number-line-listen-pair.mark-number-aria", { number })}
                                        aria-pressed={isSelected}
                                        className="group relative flex flex-col items-center gap-2 outline-none"
                                    >
                                        <span
                                            className={cx(
                                                "flex size-6 items-center justify-center rounded-full bg-primary ring-2 ring-border-primary transition duration-100 ease-linear group-hover:ring-brand group-focus-visible:ring-brand",
                                                isPendingSelection && "bg-brand-solid ring-brand",
                                                isCorrectSelection && "bg-success-solid ring-[var(--color-bg-success-solid)]",
                                                isWrongSelection && "bg-error-solid ring-[var(--color-bg-error-solid)]",
                                                isRevealedSolution && "bg-sky-solid ring-[var(--color-bg-sky-solid)]",
                                            )}
                                        >
                                            {isCorrectSelection && <Check className="size-4 text-white" />}
                                            {isWrongSelection && <X className="size-4 text-white" />}
                                            {isRevealedSolution && <Check className="size-4 text-white" />}
                                        </span>
                                        <span
                                            className={cx(
                                                "text-sm font-medium text-tertiary transition-colors",
                                                isPendingSelection && "text-brand-secondary",
                                                isCorrectSelection && "text-success-primary",
                                                isWrongSelection && "text-error-primary",
                                                isRevealedSolution && "text-sky-primary",
                                            )}
                                        >
                                            {visibleLabels.includes(number) ? number : "\u00A0"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <ProgressBar labelPosition="right" min={0} max={taskCount} value={currentIndex} valueFormatter={(value) => `${value} / ${taskCount}`} />
                </>
            )}
        </div>
    );
};
