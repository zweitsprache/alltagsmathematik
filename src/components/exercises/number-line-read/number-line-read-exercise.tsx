"use client";

import { useEffect, useState } from "react";
import { InputBase } from "@/components/base/input/input";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { useExerciseTracking } from "@/components/exercises/tracking/tracked-exercise";
import { translate as t } from "@/i18n/translate";
import { cx } from "@/utils/cx";

export interface NumberLineReadExerciseProps {
    /** Task number shown in the brand square (e.g. 1 → "01"). */
    exerciseNumber?: number;
    /** Lowest number on the line. */
    min?: number;
    /** Highest number on the line. */
    max?: number;
    /** Which numbers show a label under the tick. */
    labeledNumbers?: number[];
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
        return { target: windowMin + Math.floor(Math.random() * (windowMax - windowMin + 1)), min: windowMin, max: windowMax };
    });
};

export const NumberLineReadExercise = ({ exerciseNumber = 1, min = 0, max = 10, labeledNumbers = [0, 5, 10], taskCount = 10, rangeSize }: NumberLineReadExerciseProps) => {
    const tracking = useExerciseTracking();
    const initialMax = rangeSize ? Math.min(min + rangeSize, max) : max;
    const initialNumbers = Array.from({ length: initialMax - min + 1 }, (_, index) => min + index);
    const [sequence, setSequence] = useState<NumberLineTask[]>(initialNumbers.slice(0, taskCount).map((target) => ({ target, min, max: initialMax })));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [revealed, setRevealed] = useState(false);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    // Shuffle on the client after mount so server and client render the same
    // initial (ordered) sequence and avoid a hydration mismatch.
    useEffect(() => {
        setSequence(createTasks(min, max, taskCount, rangeSize));
        setCurrentIndex(0);
        setInputValue("");
        setRevealed(false);
        setWrongAttempts(0);
    }, [min, max, taskCount, rangeSize]);
    const isFinished = currentIndex >= sequence.length;
    const task = isFinished ? null : sequence[currentIndex];
    const target = task?.target ?? null;
    const numbers = task ? Array.from({ length: task.max - task.min + 1 }, (_, index) => task.min + index) : [];
    const visibleLabels = task && rangeSize
        ? labeledNumbers.length >= 4 ? numbers : labeledNumbers.length === 3 ? [task.min, task.min + Math.floor((task.max - task.min) / 2), task.max] : [task.min, task.max]
        : labeledNumbers;

    const parsed = inputValue.trim() === "" ? null : Number(inputValue);
    const isCorrect = parsed !== null && parsed === target;
    const isWrong = parsed !== null && parsed !== target;

    const validateInput = () => {
        if (!isWrong || revealed) return;
        const nextAttempts = wrongAttempts + 1;
        tracking.incorrect({ taskIndex: currentIndex, snapshot: task });
        setWrongAttempts(nextAttempts);
        if (nextAttempts >= 3) {
            setRevealed(true);
            tracking.solution({ taskIndex: currentIndex, snapshot: task });
        }
    };

    const goToNext = () => {
        setCurrentIndex((prev) => prev + 1);
        setInputValue("");
        setRevealed(false);
        setWrongAttempts(0);
    };

    // Auto-advance to the next number shortly after a correct answer.
    useEffect(() => {
        if (!isCorrect) return;
        tracking.correct({ taskIndex: currentIndex, snapshot: task });

        const timeout = setTimeout(goToNext, 800);
        return () => clearTimeout(timeout);
    }, [currentIndex, isCorrect, task, tracking]);

    const restart = () => {
        tracking.restart();
        setSequence(createTasks(min, max, taskCount, rangeSize));
        setCurrentIndex(0);
        setInputValue("");
        setRevealed(false);
    };

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-xl bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {isFinished ? (
                <ExerciseCompletionHeader exerciseNumber={exerciseNumber} instruction={t("instructions.number-line-read.prompt")} onRestart={restart} />
            ) : (
                <>
                    <div className="border-b border-secondary pb-4">
                        <p className="text-md font-medium text-secondary"><span className="font-black mr-2">{pad(exerciseNumber)}</span> {t("instructions.number-line-read.prompt")}</p>
                    </div>

                    {/* Answer input (where the presented number sits in the read exercise) */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-40">
                            <InputBase
                                size="lg"
                                aria-label={t("instructions.number-line-read.input-aria")}
                                inputMode="numeric"
                                value={revealed && !isCorrect ? (target ?? "") : inputValue}
                                onChange={(event) => !revealed && setInputValue(event.target.value)}
                                onBlur={validateInput}
                                onKeyDown={(event) => { if (event.key === "Enter") validateInput(); }}
                                disabled={revealed && !isCorrect}
                                wrapperClassName={cx(
                                    isCorrect && "bg-success-secondary ring-2 ring-[var(--color-bg-success-solid)]",
                                    isWrong && "bg-error-secondary ring-2 ring-[var(--color-bg-error-solid)]",
                                    revealed && !isCorrect && "bg-sky-secondary ring-2 ring-[var(--color-bg-sky-solid)]",
                                )}
                                inputClassName={cx(
                                    "text-center text-display-md font-black text-primary",
                                    isCorrect && "text-success-primary",
                                    isWrong && "text-error-primary",
                                    revealed && !isCorrect && "text-sky-primary",
                                )}
                            />
                        </div>
                    </div>

                    {/* Number line with the target marked */}
                    <div className="py-2">
                        <div className="relative flex items-start justify-between">
                            {/* Base line, aligned to the tick-cell centers (size-6 → 12px) */}
                            <div className="pointer-events-none absolute inset-x-0 top-3 h-0.5 -translate-y-1/2 rounded-full bg-quaternary" />

                            {numbers.map((number) => {
                                const isTarget = number === target;
                                const showLabel = visibleLabels.includes(number);

                                return (
                                    <div key={number} className="relative flex flex-col items-center gap-2">
                                        <span className="flex size-6 items-center justify-center">
                                            <span
                                                className={cx(
                                                    "flex items-center justify-center rounded-full transition duration-100 ease-linear",
                                                    isTarget
                                                        ? "size-5 bg-brand-solid ring-2 ring-[var(--color-bg-brand-solid)]"
                                                        : "size-2.5 bg-primary ring-2 ring-border-primary",
                                                )}
                                            />
                                        </span>
                                        <span className={cx("text-sm font-medium text-tertiary", isTarget && "text-brand-secondary")}>
                                            {showLabel ? number : "\u00A0"}
                                        </span>
                                    </div>
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
