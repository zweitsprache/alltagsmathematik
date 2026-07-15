"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { translate as t } from "@/i18n/translate";
import { useActivityProgress } from "@/hooks/use-activity-progress";
import { cx } from "@/utils/cx";

type Task = { target: number; values: number[] };

const shuffle = (values: number[]) => {
    const next = [...values];
    for (let index = next.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    }
    return next;
};

const createTask = (min: number, max: number, matchCount: number): Task => {
    const target = Math.floor(Math.random() * (max - min + 1)) + min;
    const alternatives = shuffle(Array.from({ length: max - min + 1 }, (_, index) => min + index).filter((value) => value !== target)).slice(0, 6 - matchCount);
    return { target, values: shuffle([...Array(matchCount).fill(target), ...alternatives]) };
};

const pad = (value: number) => value.toString().padStart(2, "0");

const numberFonts = ["Lavishly Yours", "Ultra", "Press Start 2P", "Encode Sans Semi Condensed", "Edu Australia VIC WA NT Hand Dots", "Finger Paint", "Permanent Marker"];

export const NumberMatchExercise = ({ activityId, exerciseNumber = 1, min = 0, max = 10, matchCount = 3, variedFonts = false }: { activityId?: string; exerciseNumber?: number; min?: number; max?: number; matchCount?: 2 | 3; variedFonts?: boolean }) => {
    const taskCount = 10;
    const { recordAttempt, resetSession } = useActivityProgress({ activityId, taskCount });
    const [task, setTask] = useState<Task>({ target: min, values: [min, min, min, min + 1, min + 2, min + 3] });
    const [selected, setSelected] = useState<number[]>([]);
    const [currentTask, setCurrentTask] = useState(0);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [feedback, setFeedback] = useState<"wrong" | "solution" | null>(null);

    useEffect(() => {
        setTask(createTask(min, max, matchCount));
        setSelected([]);
        setCurrentTask(0);
        setWrongAttempts(0);
        setFeedback(null);
    }, [min, max, matchCount]);

    const complete = selected.length === matchCount;
    const correct = complete && selected.every((index) => task.values[index] === task.target);

    useEffect(() => {
        if (!correct) return;
        void recordAttempt({ taskIndex: currentTask, attemptNumber: wrongAttempts + 1, outcome: "correct", taskSnapshot: task });
        const timeout = setTimeout(() => {
            setCurrentTask((current) => current + 1);
            setTask(createTask(min, max, matchCount));
            setSelected([]);
            setWrongAttempts(0);
        }, 700);
        return () => clearTimeout(timeout);
    }, [correct, currentTask, min, max, matchCount, recordAttempt, task, wrongAttempts]);

    useEffect(() => {
        if (!complete || correct || feedback) return;

        const attempts = wrongAttempts + 1;
        void recordAttempt({ taskIndex: currentTask, attemptNumber: attempts, outcome: "incorrect", taskSnapshot: task });
        setWrongAttempts(attempts);
        setFeedback("wrong");
    }, [complete, correct, currentTask, feedback, recordAttempt, task, wrongAttempts]);

    useEffect(() => {
        if (!feedback) return;

        const timeout = setTimeout(() => {
            if (feedback === "wrong" && wrongAttempts >= 3) {
                void recordAttempt({ taskIndex: currentTask, attemptNumber: wrongAttempts + 1, outcome: "solution", taskSnapshot: task });
                setSelected([]);
                setFeedback("solution");
                return;
            }

            if (feedback === "solution") {
                setCurrentTask((current) => current + 1);
                setTask(createTask(min, max, matchCount));
                setWrongAttempts(0);
            }
            setSelected([]);
            setFeedback(null);
        }, feedback === "solution" ? 1200 : 700);

        return () => clearTimeout(timeout);
    }, [currentTask, feedback, matchCount, max, min, recordAttempt, task, wrongAttempts]);

    const toggle = (index: number) => {
        if (correct) return;
        setSelected((current) => (current.includes(index) ? current.filter((value) => value !== index) : current.length < matchCount ? [...current, index] : current));
    };

    const restart = () => {
        resetSession();
        setTask(createTask(min, max, matchCount));
        setSelected([]);
        setCurrentTask(0);
        setWrongAttempts(0);
        setFeedback(null);
    };

    const isFinished = currentTask >= taskCount;

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-lg bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {isFinished ? (
                <ExerciseCompletionHeader exerciseNumber={exerciseNumber} instruction={t(matchCount === 2 ? "instructions.number-match.prompt-two" : "instructions.number-match.prompt")} onRestart={restart} />
            ) : (
                <>
                    <div className="border-b border-secondary pb-4">
                        <p className="text-md font-medium text-secondary">
                            <span className="mr-2 font-black">{pad(exerciseNumber)}</span>
                            {t(matchCount === 2 ? "instructions.number-match.prompt-two" : "instructions.number-match.prompt")}
                        </p>
                    </div>

                    <div className="grid w-full max-w-md self-center grid-cols-2 justify-items-center gap-x-8 gap-y-6 px-2 py-3 sm:grid-cols-3 sm:gap-x-12 sm:gap-y-8">
                        {task.values.map((value, index) => {
                    const isSelected = selected.includes(index);
                    const isCorrect = correct && value === task.target;
                    const isIncorrect = feedback === "wrong" && isSelected;
                    const isSolution = feedback === "solution" && value === task.target;
                    return (
                        <button
                            key={index}
                            type="button"
                            aria-label={t("instructions.number-match.number-aria", { number: value })}
                            aria-pressed={isSelected}
                            disabled={correct || feedback !== null}
                            onClick={() => toggle(index)}
                            style={variedFonts ? { fontFamily: numberFonts[(index + currentTask) % numberFonts.length] } : undefined}
                            className={cx(
                                "size-16 rounded-sm bg-primary text-3xl font-black text-primary shadow-xs ring-2 ring-secondary outline-focus-ring transition duration-100 ease-linear hover:ring-brand focus-visible:outline-2 disabled:cursor-default sm:size-20 sm:text-display-sm",
                                isSelected && !complete && "bg-brand-primary ring-brand",
                                isCorrect && "bg-success-secondary text-success-primary ring-[var(--color-bg-success-solid)]",
                                isIncorrect && "bg-error-secondary text-error-primary ring-[var(--color-bg-error-solid)]",
                                isSolution && "bg-sky-secondary text-sky-primary ring-[var(--color-bg-sky-solid)]",
                            )}
                        >
                            {value}
                        </button>
                    );
                        })}
                    </div>

                    <ProgressBar labelPosition="right" min={0} max={taskCount} value={currentTask} valueFormatter={(value) => `${value} / ${taskCount}`} />
                </>
            )}
        </div>
    );
};
