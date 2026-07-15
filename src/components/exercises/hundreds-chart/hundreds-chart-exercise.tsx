"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { useExerciseTracking } from "@/components/exercises/tracking/tracked-exercise";
import { translate as t } from "@/i18n/translate";
import { cx } from "@/utils/cx";

const columns = 10;
const rows = 5;
const taskCount = 10;
const pad = (value: number) => value.toString().padStart(2, "0");

type Task = { start: number; hints: number[]; inputs: number[] };

const shuffle = <T,>(items: T[]) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
};

const createTask = (hintCount: number, inputCount: number, guidedRows = false): Task => {
    const start = (Math.floor(Math.random() * 3) + 3) * 10;
    if (guidedRows) {
        const selectedRows = shuffle(Array.from({ length: rows }, (_, index) => index)).slice(0, 2);
        const hints: number[] = [];
        const inputs: number[] = [];

        for (const row of selectedRows) {
            const firstHintColumn = Math.floor(Math.random() * (columns - 1));
            const rowPositions = Array.from({ length: columns }, (_, column) => row * columns + column);
            const rowHints = [row * columns + firstHintColumn, row * columns + firstHintColumn + 1];
            hints.push(...rowHints);
            inputs.push(...shuffle(rowPositions.filter((position) => !rowHints.includes(position))).slice(0, 2));
        }

        return { start, hints, inputs };
    }
    const positions = shuffle(Array.from({ length: rows * columns }, (_, index) => index));
    return {
        start,
        hints: positions.slice(0, hintCount),
        inputs: positions.slice(hintCount, hintCount + inputCount),
    };
};

const initialTask: Task = { start: 30, hints: [2, 17, 42], inputs: [4, 11, 23, 29, 38] };
const valueAt = (task: Task, index: number) => task.start + Math.floor(index / columns) * 10 + (index % columns);

export const HundredsChartExercise = ({ exerciseNumber = 1, hintCount = 3, inputCount = 5, guidedRows = false }: { exerciseNumber?: number; hintCount?: number; inputCount?: number; guidedRows?: boolean }) => {
    const tracking = useExerciseTracking();
    const usedSolution = useRef(false);
    const [task, setTask] = useState<Task>(initialTask);
    const [currentTask, setCurrentTask] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [validatedCorrect, setValidatedCorrect] = useState<number[]>([]);
    const [autoCorrected, setAutoCorrected] = useState<number[]>([]);
    const [incorrect, setIncorrect] = useState<number[]>([]);
    const [wrongAttempts, setWrongAttempts] = useState<Record<number, number>>({});
    const [feedback, setFeedback] = useState<"correct" | null>(null);
    const correctionTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

    const loadTask = useCallback(() => {
        setTask(createTask(hintCount, inputCount, guidedRows));
        setAnswers({});
        setValidatedCorrect([]);
        setAutoCorrected([]);
        setIncorrect([]);
        setWrongAttempts({});
        setFeedback(null);
        correctionTimers.current.forEach(clearTimeout);
        correctionTimers.current = [];
        usedSolution.current = false;
    }, [guidedRows, hintCount, inputCount]);

    useEffect(() => loadTask(), [loadTask]);

    useEffect(() => () => correctionTimers.current.forEach(clearTimeout), []);

    useEffect(() => {
        if (feedback !== "correct") return;
        const timeout = setTimeout(() => {
            setCurrentTask((current) => current + 1);
            loadTask();
        }, 800);
        return () => clearTimeout(timeout);
    }, [feedback, loadTask]);

    useEffect(() => {
        if (feedback !== null) return;
        const completeAndCorrect = task.inputs.every(
            (index) =>
                answers[index]?.trim() &&
                Number(answers[index]) === valueAt(task, index) &&
                (validatedCorrect.includes(index) || autoCorrected.includes(index)),
        );
        if (completeAndCorrect) {
            if (usedSolution.current) tracking.solution({ taskIndex: currentTask, snapshot: task });
            else tracking.correct({ taskIndex: currentTask, snapshot: task });
            setFeedback("correct");
        }
    }, [answers, autoCorrected, currentTask, feedback, task, tracking, validatedCorrect]);

    const restart = () => {
        tracking.restart();
        setCurrentTask(0);
        loadTask();
    };

    const finished = currentTask >= taskCount;

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-lg bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {finished ? (
                <ExerciseCompletionHeader exerciseNumber={exerciseNumber} instruction={t("instructions.hundreds-chart.prompt")} onRestart={restart} />
            ) : (
                <>
                    <div className="border-b border-secondary pb-4">
                        <p className="text-md font-medium text-secondary">
                            <span className="mr-2 font-black">{pad(exerciseNumber)}</span>
                            {t("instructions.hundreds-chart.prompt")}
                        </p>
                    </div>

                    <div className="mx-auto grid w-full max-w-xl grid-cols-10 border-t border-l border-secondary bg-primary">
                        {Array.from({ length: rows * columns }, (_, index) => {
                            const isHint = task.hints.includes(index);
                            const isInput = task.inputs.includes(index);
                            const expected = valueAt(task, index);
                            const answer = answers[index] ?? "";
                            return (
                                <div
                                    key={index}
                                    className={cx(
                                        "flex aspect-square items-center justify-center border-r border-b border-secondary bg-primary",
                                        isHint && "bg-secondary",
                                        isInput && "relative z-10",
                                        isInput && feedback === "correct" && "bg-success-secondary ring-[var(--color-bg-success-solid)]",
                                        isInput && validatedCorrect.includes(index) && feedback === null && "bg-success-secondary",
                                        isInput && autoCorrected.includes(index) && feedback === null && "bg-sky-secondary",
                                        isInput && incorrect.includes(index) && feedback === null && "bg-error-secondary",
                                    )}
                                >
                                    {isHint ? (
                                        <span className="text-lg font-black text-primary">{expected}</span>
                                    ) : isInput ? (
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={3}
                                            value={answer}
                                            disabled={feedback !== null || (wrongAttempts[index] ?? 0) >= 3}
                                            aria-label={t("instructions.hundreds-chart.input-aria", { row: Math.floor(index / columns) + 1, column: (index % columns) + 1 })}
                                            onChange={(event) => {
                                                setAnswers((current) => ({ ...current, [index]: event.target.value.replace(/\D/g, "") }));
                                                setValidatedCorrect((current) => current.filter((item) => item !== index));
                                                setAutoCorrected((current) => current.filter((item) => item !== index));
                                                setIncorrect((current) => current.filter((item) => item !== index));
                                            }}
                                            onBlur={() => {
                                                if (!answer.trim() || feedback !== null) return;
                                                if (Number(answer) === expected) {
                                                    setValidatedCorrect((current) => current.includes(index) ? current : [...current, index]);
                                                    setIncorrect((current) => current.filter((item) => item !== index));
                                                    return;
                                                }
                                                const attempt = (wrongAttempts[index] ?? 0) + 1;
                                                tracking.incorrect({ taskIndex: currentTask, snapshot: { task, index, expected } });
                                                setWrongAttempts((current) => ({ ...current, [index]: attempt }));
                                                setIncorrect((current) => current.includes(index) ? current : [...current, index]);
                                                if (attempt >= 3) {
                                                    usedSolution.current = true;
                                                    const timer = setTimeout(() => {
                                                        setAnswers((current) => ({ ...current, [index]: String(expected) }));
                                                        setIncorrect((current) => current.filter((item) => item !== index));
                                                        setAutoCorrected((current) => current.includes(index) ? current : [...current, index]);
                                                    }, 800);
                                                    correctionTimers.current.push(timer);
                                                }
                                            }}
                                            className={cx(
                                                "m-1 size-[calc(100%-0.5rem)] border border-dashed border-neutral-500 bg-transparent text-center text-lg font-black text-primary outline-none transition focus:border-brand disabled:cursor-default",
                                                feedback === "correct" && "text-success-primary",
                                                validatedCorrect.includes(index) && feedback === null && "text-success-primary",
                                                autoCorrected.includes(index) && feedback === null && "text-sky-primary",
                                                incorrect.includes(index) && feedback === null && "text-error-primary",
                                            )}
                                        />
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>

                    <ProgressBar labelPosition="right" min={0} max={taskCount} value={currentTask} valueFormatter={(value) => `${value} / ${taskCount}`} />

                    <div className="flex gap-3">
                        <Button size="sm" color="secondary" iconLeading={RefreshCw01} onClick={restart} className="rounded-sm">
                            Nochmal starten
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
