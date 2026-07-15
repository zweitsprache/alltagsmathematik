"use client";

import { useEffect, useState } from "react";
import { Check, RefreshCw01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { useExerciseTracking } from "@/components/exercises/tracking/tracked-exercise";
import { translate as t } from "@/i18n/translate";
import { cx } from "@/utils/cx";

export interface NumberSequenceExerciseProps {
    exerciseNumber?: number;
    min?: number;
    max?: number;
    itemCount?: number;
}

type DraggedNumber = { number: number; slotIndex: number | null };
const taskCount = 10;
const pad = (value: number) => value.toString().padStart(2, "0");

const shuffle = (items: number[]) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
};

const createTask = (min: number, max: number, itemCount: number) => {
    const start = min + Math.floor(Math.random() * (max - min - 3));
    const sequence = Array.from({ length: 5 }, (_, index) => start + index);
    const slots: Array<number | null> = [sequence[0], sequence[1], null, null, null];
    const missing = sequence.slice(2);
    const distractors = shuffle(Array.from({ length: max - min + 1 }, (_, index) => min + index).filter((number) => !sequence.includes(number))).slice(0, Math.max(0, itemCount - 5));
    const bank = shuffle([...missing, ...distractors]);
    return { sequence, slots, bank };
};

export const NumberSequenceExercise = ({ exerciseNumber = 1, min = 0, max = 10, itemCount = max - min + 1 }: NumberSequenceExerciseProps) => {
    const tracking = useExerciseTracking();
    const numbers = Array.from({ length: itemCount }, (_, index) => min + index);
    const initialSequence = numbers.slice(0, 5);
    const [sequence, setSequence] = useState(initialSequence);
    const [slots, setSlots] = useState<Array<number | null>>([initialSequence[0], initialSequence[1], null, null, null]);
    const [bank, setBank] = useState(numbers.slice(2));
    const [dragged, setDragged] = useState<DraggedNumber | null>(null);
    const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
    const [checked, setChecked] = useState(false);
    const [currentTask, setCurrentTask] = useState(0);

    const loadTask = () => {
        const task = createTask(min, max, itemCount);
        setSequence(task.sequence);
        setSlots(task.slots);
        setBank(task.bank);
        setDragged(null);
        setDragOverSlot(null);
        setChecked(false);
    };

    useEffect(() => {
        loadTask();
        setCurrentTask(0);
    }, [min, max, itemCount]);

    const isCorrect = slots.every((number, index) => number === sequence[index]);

    useEffect(() => {
        if (!checked || !isCorrect) return;
        tracking.correct({ taskIndex: currentTask, snapshot: { sequence, slots } });
        const timeout = setTimeout(() => {
            setCurrentTask((task) => task + 1);
            loadTask();
        }, 800);
        return () => clearTimeout(timeout);
    }, [checked, currentTask, isCorrect, sequence, slots, tracking]);

    useEffect(() => {
        if (!checked || isCorrect) return;
        tracking.incorrect({ taskIndex: currentTask, snapshot: { sequence, slots } });
    }, [checked, currentTask, isCorrect, sequence, slots, tracking]);

    const placeNumber = (slotIndex: number) => {
        if (!dragged || slotIndex < 2) return;
        const previousNumber = slots[slotIndex];

        setSlots((current) =>
            current.map((number, index) => {
                if (index === slotIndex) return dragged.number;
                if (index === dragged.slotIndex) return null;
                return number;
            }),
        );
        setBank((current) => {
            const next = current.filter((number) => number !== dragged.number);
            return previousNumber === null ? next : shuffle([...next, previousNumber]);
        });
        setChecked(false);
        setDragged(null);
        setDragOverSlot(null);
    };

    const restart = () => {
        tracking.restart();
        setCurrentTask(0);
        loadTask();
    };

    const isFinished = currentTask >= taskCount;

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-xl bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {isFinished ? (
                <ExerciseCompletionHeader exerciseNumber={exerciseNumber} instruction={t("instructions.number-sequence.prompt")} onRestart={restart} />
            ) : (
                <>
                    <div className="border-b border-secondary pb-4">
                        <p className="text-md font-medium text-secondary">
                            <span className="mr-2 font-black">{pad(exerciseNumber)}</span> {t("instructions.number-sequence.prompt")}
                        </p>
                    </div>

                    <div
                        className="grid w-full justify-between"
                        style={{ gridTemplateColumns: `repeat(${numbers.length}, minmax(0, 3rem))` }}
                        role="list"
                        aria-label={t("instructions.number-sequence.sequence-aria")}
                    >
                        {slots.map((number, index) => {
                            const isFixed = index < 2;
                            const isCorrectPosition = checked && number === sequence[index];
                            return (
                                <div
                                    key={index}
                                    role="listitem"
                                    aria-label={number === null ? t("instructions.number-sequence.empty-aria", { position: index + 1 }) : undefined}
                                    onDragOver={(event) => {
                                        if (isFixed) return;
                                        event.preventDefault();
                                        setDragOverSlot(index);
                                    }}
                                    onDrop={(event) => {
                                        event.preventDefault();
                                        placeNumber(index);
                                    }}
                                    className={cx(
                                        "flex aspect-square w-[calc(100%+4px)] max-w-[52px] min-w-0 -translate-x-0.5 items-center justify-center rounded-md border-2 border-dashed border-secondary bg-primary text-lg font-black text-primary transition duration-100 ease-linear",
                                        isFixed && "border-solid bg-secondary text-tertiary",
                                        dragOverSlot === index && "border-brand-solid bg-brand-secondary",
                                        !isFixed && isCorrectPosition && "border-success-solid bg-success-secondary text-success-primary",
                                    )}
                                >
                                    {number !== null && (
                                        <button
                                            type="button"
                                            draggable={!isFixed}
                                            disabled={isFixed}
                                            onDragStart={() => setDragged({ number, slotIndex: index })}
                                            onDragEnd={() => {
                                                setDragged(null);
                                                setDragOverSlot(null);
                                            }}
                                            className={cx("size-full rounded-[inherit]", !isFixed && "cursor-grab active:cursor-grabbing")}
                                        >
                                            {number}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, numbers.length - slots.length) }, (_, index) => (
                            <span key={`empty-sequence-column-${index}`} aria-hidden="true" className="aspect-square w-full min-w-0" />
                        ))}
                    </div>

                    <div
                        className="grid w-full justify-between"
                        style={{ gridTemplateColumns: `repeat(${numbers.length}, minmax(0, 3rem))` }}
                        role="list"
                        aria-label={t("instructions.number-sequence.bank-aria")}
                    >
                        {bank.map((number) => (
                            <button
                                key={number}
                                type="button"
                                draggable
                                role="listitem"
                                aria-label={t("instructions.number-sequence.number-aria", { number })}
                                onDragStart={() => setDragged({ number, slotIndex: null })}
                                onDragEnd={() => {
                                    setDragged(null);
                                    setDragOverSlot(null);
                                }}
                                className="flex aspect-square w-full min-w-0 cursor-grab items-center justify-center rounded-md bg-primary text-lg font-black text-primary shadow-xs ring-2 ring-secondary outline-none hover:ring-brand focus-visible:ring-brand active:cursor-grabbing"
                            >
                                {number}
                            </button>
                        ))}
                        {Array.from({ length: Math.max(0, numbers.length - bank.length) }, (_, index) => (
                            <span key={`empty-bank-column-${index}`} aria-hidden="true" className="aspect-square w-full min-w-0" />
                        ))}
                    </div>

                    <ProgressBar labelPosition="right" min={0} max={taskCount} value={currentTask} valueFormatter={(value) => `${value} / ${taskCount}`} />

                    <div className="flex gap-3">
                        <Button
                            size="sm"
                            color="primary"
                            iconLeading={Check}
                            onClick={() => setChecked(true)}
                            disabled={slots.includes(null) || (checked && isCorrect)}
                        >
                            {t("instructions.number-sequence.check")}
                        </Button>
                        <Button size="sm" color="secondary" iconLeading={RefreshCw01} onClick={restart}>
                            Nochmal starten
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
