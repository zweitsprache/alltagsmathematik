"use client";

import { useEffect, useState } from "react";
import { Check, RefreshCw01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { translate as t } from "@/i18n/translate";
import { cx } from "@/utils/cx";

export interface NumberSortExerciseProps {
    exerciseNumber?: number;
    min?: number;
    max?: number;
    sortOrder?: "ascending" | "descending";
    itemCount?: number;
}

const shuffle = (items: number[]) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
};

const pad = (value: number) => value.toString().padStart(2, "0");

const shuffledWithFirstNumberFixed = (numbers: number[]) => [numbers[0], ...shuffle(numbers.slice(1))];
const taskCount = 10;

export const NumberSortExercise = ({ exerciseNumber = 1, min = 0, max = 10, sortOrder = "ascending", itemCount = max - min + 1 }: NumberSortExerciseProps) => {
    const ascendingNumbers = Array.from({ length: max - min + 1 }, (_, index) => min + index);
    const initialItems = ascendingNumbers.slice(0, itemCount);
    const [sortedNumbers, setSortedNumbers] = useState(sortOrder === "ascending" ? initialItems : [...initialItems].reverse());
    const [numbers, setNumbers] = useState(sortedNumbers);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
    const [currentTask, setCurrentTask] = useState(0);

    const loadTask = () => {
        const selected = shuffle(ascendingNumbers).slice(0, itemCount).sort((a, b) => a - b);
        const expected = sortOrder === "ascending" ? selected : selected.reverse();
        setSortedNumbers(expected);
        setNumbers(shuffledWithFirstNumberFixed(expected));
        setResult(null);
    };

    useEffect(() => {
        loadTask();
        setCurrentTask(0);
    }, [min, max, sortOrder, itemCount]);

    useEffect(() => {
        if (result !== "correct") return;

        const timeout = setTimeout(() => {
            setCurrentTask((task) => task + 1);
            loadTask();
        }, 800);

        return () => clearTimeout(timeout);
    }, [result]);

    const moveNumber = (fromIndex: number, toIndex: number) => {
        if (fromIndex === 0 || toIndex === 0 || fromIndex === toIndex || toIndex < 1 || toIndex >= numbers.length) return;

        setNumbers((current) => {
            const next = [...current];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
        setResult(null);
    };

    const checkAnswer = () => {
        setResult(numbers.every((number, index) => number === sortedNumbers[index]) ? "correct" : "incorrect");
    };

    const restart = () => {
        loadTask();
        setCurrentTask(0);
    };

    const isFinished = currentTask >= taskCount;

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-lg bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {isFinished ? (
                <ExerciseCompletionHeader exerciseNumber={exerciseNumber} instruction={t(sortOrder === "ascending" ? "instructions.number-sort.prompt-ascending" : "instructions.number-sort.prompt-descending")} onRestart={restart} />
            ) : (
                <>
                    <div className="border-b border-secondary pb-4">
                        <p className="text-md font-medium text-secondary">
                            <span className="mr-2 font-black">{pad(exerciseNumber)}</span>{" "}
                            {t(sortOrder === "ascending" ? "instructions.number-sort.prompt-ascending" : "instructions.number-sort.prompt-descending")}
                        </p>
                    </div>

                    <div className="w-full pb-1">
                        <div
                            className="grid w-full justify-between"
                            style={{ gridTemplateColumns: `repeat(${numbers.length}, minmax(0, 3rem))` }}
                            role="list"
                            aria-label={t(
                                sortOrder === "ascending" ? "instructions.number-sort.prompt-ascending" : "instructions.number-sort.prompt-descending",
                            )}
                        >
                            {numbers.map((number, index) => {
                                const isFixed = index === 0;
                                const isCorrectPosition = result !== null && number === sortedNumbers[index];

                                return (
                                    <div
                                        key={number}
                                        role="listitem"
                                        className="relative aspect-square w-full min-w-0"
                                        onDragOver={(event) => {
                                            if (isFixed || draggedIndex === index) return;
                                            event.preventDefault();
                                            event.dataTransfer.dropEffect = "move";
                                            setDragOverIndex(index);
                                        }}
                                        onDrop={(event) => {
                                            event.preventDefault();
                                            const fromIndex = draggedIndex ?? Number(event.dataTransfer.getData("text/plain"));
                                            if (Number.isInteger(fromIndex)) moveNumber(fromIndex, index);
                                            setDraggedIndex(null);
                                            setDragOverIndex(null);
                                        }}
                                    >
                                        {dragOverIndex === index && draggedIndex !== null && (
                                            <span
                                                aria-hidden="true"
                                                className={cx(
                                                    "pointer-events-none absolute inset-y-0 z-10 w-1 rounded-full bg-brand-solid",
                                                    draggedIndex < index ? "-right-1" : "-left-1",
                                                )}
                                            />
                                        )}
                                        <button
                                            type="button"
                                            draggable={!isFixed}
                                            disabled={isFixed}
                                            aria-label={t("instructions.number-sort.move-aria", { number, position: index + 1, total: numbers.length })}
                                            onDragStart={(event) => {
                                                setDraggedIndex(index);
                                                event.dataTransfer.effectAllowed = "move";
                                                event.dataTransfer.setData("text/plain", String(index));

                                                const preview = event.currentTarget.cloneNode(true) as HTMLButtonElement;
                                                preview.style.position = "fixed";
                                                preview.style.top = "-1000px";
                                                preview.style.width = `${event.currentTarget.offsetWidth}px`;
                                                preview.style.height = `${event.currentTarget.offsetHeight}px`;
                                                preview.style.borderRadius = "6px";
                                                preview.style.overflow = "hidden";
                                                preview.style.opacity = "1";
                                                document.body.appendChild(preview);
                                                event.dataTransfer.setDragImage(preview, preview.offsetWidth / 2, preview.offsetHeight / 2);
                                                requestAnimationFrame(() => preview.remove());
                                            }}
                                            onDragEnd={() => {
                                                setDraggedIndex(null);
                                                setDragOverIndex(null);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === "ArrowLeft") {
                                                    event.preventDefault();
                                                    moveNumber(index, index - 1);
                                                }
                                                if (event.key === "ArrowRight") {
                                                    event.preventDefault();
                                                    moveNumber(index, index + 1);
                                                }
                                            }}
                                            className={cx(
                                                    "flex size-full cursor-grab items-center justify-center overflow-hidden rounded-sm bg-primary text-lg font-black text-primary shadow-xs ring-2 ring-secondary transition duration-100 ease-linear outline-none hover:ring-brand focus-visible:ring-brand active:cursor-grabbing sm:text-xl",
                                                isFixed && "cursor-default bg-secondary text-tertiary ring-secondary hover:ring-secondary",
                                                draggedIndex === index && "scale-95 opacity-50 ring-brand",
                                                !isFixed &&
                                                    isCorrectPosition &&
                                                    "bg-success-secondary text-success-primary ring-[var(--color-bg-success-solid)]",
                                            )}
                                        >
                                            {number}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <ProgressBar labelPosition="right" min={0} max={taskCount} value={currentTask} valueFormatter={(value) => `${value} / ${taskCount}`} />

                    <div className="flex gap-3">
                        <Button size="sm" color="primary" iconLeading={Check} onClick={checkAnswer} disabled={result === "correct"} className="rounded-sm">
                            {t("instructions.number-sort.check")}
                        </Button>
                        <Button size="sm" color="secondary" iconLeading={RefreshCw01} onClick={restart} className="rounded-sm">
                            Nochmal starten
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
