"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { useExerciseTracking } from "@/components/exercises/tracking/tracked-exercise";
import { translate as t } from "@/i18n/translate";
import { cx } from "@/utils/cx";

type Shape = "circle" | "square" | "triangle";
type Arrangement = "grid" | "grid-10" | "grid-10-4" | "random";
type Position = { left: number; top: number; rotation: number };
type Card = { id: string; count: number; shape: Shape; positions: Position[] };
type Task = { cards: Card[]; targetCount: number };

const pad = (value: number) => value.toString().padStart(2, "0");

const shuffle = <T,>(items: T[]) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
};

const createGridPositions = (count: number): Position[] => {
    const rowCount = Math.ceil(count / 4);
    return Array.from({ length: count }, (_, index) => {
        const row = Math.floor(index / 4);
        const column = index % 4;
        const itemsInRow = Math.min(4, count - row * 4);
        return {
            left: 50 - ((itemsInRow - 1) * 18) / 2 + column * 18,
            top: 50 - ((rowCount - 1) * 24) / 2 + row * 24,
            rotation: 0,
        };
    });
};

const createTenColumnGridPositions = (count: number, rowCount: 3 | 4): Position[] => {
    const columnCount = 10;
    return Array.from({ length: count }, (_, index) => {
        const row = Math.floor(index / columnCount);
        const column = index % columnCount;
        return {
            left: 9.5 + column * 9,
            top: 50 - ((rowCount - 1) * 21) / 2 + row * 21,
            rotation: 0,
        };
    });
};

const createRandomPositions = (count: number): Position[] => {
    const slots = shuffle(Array.from({ length: 20 }, (_, index) => index)).slice(0, count);
    return slots.map((slot) => ({
        left: 14 + (slot % 5) * 18 + Math.random() * 2,
        top: 15 + Math.floor(slot / 5) * 23 + Math.random() * 2,
        rotation: Math.floor(Math.random() * 45) - 22,
    }));
};

const createCard = (id: string, count: number, shape: Shape, arrangement: Arrangement): Card => ({
    id,
    count,
    shape,
    positions: arrangement === "grid" ? createGridPositions(count) : arrangement === "grid-10" ? createTenColumnGridPositions(count, 3) : arrangement === "grid-10-4" ? createTenColumnGridPositions(count, 4) : createRandomPositions(count),
});
const createInitialCard = (id: string, count: number, shape: Shape, arrangement: Arrangement): Card => ({
    id,
    count,
    shape,
    positions: arrangement === "grid" ? createGridPositions(count) : arrangement === "grid-10" ? createTenColumnGridPositions(count, 3) : arrangement === "grid-10-4" ? createTenColumnGridPositions(count, 4) : Array.from({ length: count }, (_, index) => ({
        left: 14 + (index % 5) * 18,
        top: 15 + Math.floor(index / 5) * 23,
        rotation: (index % 3) * 12 - 12,
    })),
});

const shapes: Shape[] = ["circle", "square", "triangle"];

const createTask = (min: number, max: number, arrangement: Arrangement, cardCount: 4 | 6, sameShape: boolean, taskIndex: number): Task => {
    const counts = Array.from({ length: max - min + 1 }, (_, index) => min + index);
    const targetCount = counts[taskIndex % counts.length];
    const otherCounts = shuffle(counts.filter((count) => count !== targetCount)).slice(0, cardCount - 2);
    const sharedShape = shapes[taskIndex % shapes.length];
    const targetShapes = sameShape ? [sharedShape, sharedShape] : shuffle(shapes).slice(0, 2);
    const otherShapes = sameShape ? Array<Shape>(cardCount - 2).fill(sharedShape) : Array.from({ length: cardCount - 2 }, () => shuffle(shapes)[0]);
    const cards = [
        createCard("target-a", targetCount, targetShapes[0], arrangement),
        createCard("target-b", targetCount, targetShapes[1], arrangement),
        ...otherCounts.map((count, index) => createCard(`other-${index}`, count, otherShapes[index], arrangement)),
    ];
    return { cards: shuffle(cards), targetCount };
};

const initialTask = (min: number, arrangement: Arrangement, cardCount: 4 | 6, sameShape: boolean): Task => ({
    targetCount: min,
    cards: [
        createInitialCard("initial-a", min, "circle", arrangement),
        createInitialCard("initial-b", min, sameShape ? "circle" : "square", arrangement),
        createInitialCard("initial-c", min + 1, sameShape ? "circle" : "triangle", arrangement),
        createInitialCard("initial-d", min + 2, "circle", arrangement),
        createInitialCard("initial-e", min + 3, sameShape ? "circle" : "square", arrangement),
        createInitialCard("initial-f", min + 4, sameShape ? "circle" : "triangle", arrangement),
    ].slice(0, cardCount),
});

const ShapeSymbol = ({ shape, position, compact = false }: { shape: Shape; position: Position; compact?: boolean }) => (
    <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={cx("absolute text-brand-solid", compact ? "size-3 sm:size-4" : "size-5 sm:size-6")}
        style={{ left: `${position.left}%`, top: `${position.top}%`, transform: `translate(-50%, -50%) rotate(${position.rotation}deg)` }}
    >
        {shape === "circle" && <circle cx="12" cy="12" r="8" fill="currentColor" />}
        {shape === "square" && <rect x="4" y="4" width="16" height="16" rx="1" fill="currentColor" />}
        {shape === "triangle" && <path d="M12 3 22 21H2Z" fill="currentColor" />}
    </svg>
);

export const CountingMatchExercise = ({ exerciseNumber = 1, min = 1, max = 10, arrangement = "random", cardCount = 6, sameShape = false }: { exerciseNumber?: number; min?: number; max?: number; arrangement?: Arrangement; cardCount?: 4 | 6; sameShape?: boolean }) => {
    const tracking = useExerciseTracking();
    const totalTasks = max - min + 1;
    const [task, setTask] = useState<Task>(() => initialTask(min, arrangement, cardCount, sameShape));
    const [selected, setSelected] = useState<string[]>([]);
    const [currentTask, setCurrentTask] = useState(0);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [feedback, setFeedback] = useState<"wrong" | "solution" | null>(null);

    const loadTask = (taskIndex: number) => {
        setTask(createTask(min, max, arrangement, cardCount, sameShape, taskIndex));
        setSelected([]);
        setWrongAttempts(0);
        setFeedback(null);
    };

    useEffect(() => {
        loadTask(0);
        setCurrentTask(0);
    }, [arrangement, cardCount, min, max, sameShape]);

    const complete = selected.length === 2;
    const correct = complete && selected.every((id) => task.cards.find((card) => card.id === id)?.count === task.targetCount);

    useEffect(() => {
        if (!correct) return;
        tracking.correct({ taskIndex: currentTask, snapshot: task });
        const timeout = setTimeout(() => {
            const nextTask = currentTask + 1;
            setCurrentTask(nextTask);
            loadTask(nextTask);
        }, 700);
        return () => clearTimeout(timeout);
    }, [correct, currentTask, task, tracking]);

    useEffect(() => {
        if (!complete || correct || feedback) return;
        tracking.incorrect({ taskIndex: currentTask, snapshot: task });
        setWrongAttempts((attempts) => attempts + 1);
        setFeedback("wrong");
    }, [complete, correct, currentTask, feedback, task, tracking]);

    useEffect(() => {
        if (!feedback) return;
        const timeout = setTimeout(() => {
            if (feedback === "wrong" && wrongAttempts >= 3) {
                tracking.solution({ taskIndex: currentTask, snapshot: task });
                setSelected([]);
                setFeedback("solution");
                return;
            }
            if (feedback === "solution") {
                const nextTask = currentTask + 1;
                setCurrentTask(nextTask);
                loadTask(nextTask);
                return;
            }
            setSelected([]);
            setFeedback(null);
        }, feedback === "solution" ? 1200 : 700);
        return () => clearTimeout(timeout);
    }, [currentTask, feedback, task, tracking, wrongAttempts]);

    const finished = currentTask >= totalTasks;

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-lg bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {finished ? (
                <ExerciseCompletionHeader exerciseNumber={exerciseNumber} instruction={t("instructions.counting-match.prompt")} onRestart={() => { tracking.restart(); setCurrentTask(0); loadTask(0); }} />
            ) : (
                <>
                    <div className="border-b border-secondary pb-4">
                        <p className="text-md font-medium text-secondary">
                            <span className="mr-2 font-black">{pad(exerciseNumber)}</span>
                            {t("instructions.counting-match.prompt")}
                        </p>
                    </div>

                    <div className={cx("grid gap-4", cardCount === 4 ? "grid-cols-2" : "grid-cols-3")}>
                        {task.cards.map((card, index) => {
                            const isSelected = selected.includes(card.id);
                            const isCorrect = correct && card.count === task.targetCount;
                            const isWrong = feedback === "wrong" && isSelected;
                            const isSolution = feedback === "solution" && card.count === task.targetCount;
                            return (
                                <button
                                    key={card.id}
                                    type="button"
                                    disabled={correct || feedback !== null}
                                    onClick={() => setSelected((current) => current.includes(card.id) ? current.filter((id) => id !== card.id) : current.length < 2 ? [...current, card.id] : current)}
                                    aria-label={t("instructions.counting-match.card-aria", { card: index + 1 })}
                                    className={cx(
                                        "relative h-36 overflow-hidden rounded-sm bg-primary shadow-xs ring-2 ring-secondary outline-focus-ring transition hover:ring-brand focus-visible:outline-2 disabled:cursor-default",
                                        isSelected && !complete && "bg-brand-primary ring-brand",
                                        isCorrect && "bg-success-secondary ring-[var(--color-bg-success-solid)]",
                                        isWrong && "bg-error-secondary ring-[var(--color-bg-error-solid)]",
                                        isSolution && "bg-sky-secondary ring-[var(--color-bg-sky-solid)]",
                                    )}
                                >
                                    {card.positions.map((position, symbolIndex) => <ShapeSymbol key={symbolIndex} shape={card.shape} position={position} compact={arrangement === "grid-10" || arrangement === "grid-10-4"} />)}
                                </button>
                            );
                        })}
                    </div>

                    <ProgressBar labelPosition="right" min={0} max={totalTasks} value={currentTask} valueFormatter={(value) => `${value} / ${totalTasks}`} />
                </>
            )}
        </div>
    );
};
