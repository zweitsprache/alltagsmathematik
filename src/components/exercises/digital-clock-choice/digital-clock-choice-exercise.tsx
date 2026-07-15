"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { translate as t } from "@/i18n/translate";
import { cx } from "@/utils/cx";

const randomTaskCount = 10;
const pad = (value: number) => value.toString().padStart(2, "0");
const normalizeHour = (hour: number) => ((hour - 1 + 12) % 12) + 1;
const toOfficialHour = (hour: number) => (hour === 12 ? 0 : hour + 12);
const hourWords = ["zwölf", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf"];

const formatInformalTime = (hour: number, minutes: number) => {
    const currentHour = hourWords[hour % 12];
    const nextHour = hourWords[(hour + 1) % 12];
    const currentHourWithUhr = hour % 12 === 1 ? "ein" : currentHour;
    const phrases: Record<number, string> = {
        0: `${currentHourWithUhr} Uhr`,
        5: `fünf nach ${currentHour}`,
        10: `zehn nach ${currentHour}`,
        15: `Viertel nach ${currentHour}`,
        20: `zwanzig nach ${currentHour}`,
        25: `fünf vor halb ${nextHour}`,
        30: `halb ${nextHour}`,
        35: `fünf nach halb ${nextHour}`,
        40: `zwanzig vor ${nextHour}`,
        45: `Viertel vor ${nextHour}`,
        50: `zehn vor ${nextHour}`,
        55: `fünf vor ${nextHour}`,
    };
    return phrases[minutes] ?? `${currentHour} Uhr ${pad(minutes)}`;
};

const shuffle = <T,>(items: T[]) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
};

type Task = {
    displayHour: number;
    analogHour: number;
    minutes: number;
    options: number[];
};

const createTask = ({ use24Hour, sequentialHour, fullDay, pairedTimes, minutes }: { use24Hour: boolean; sequentialHour?: number; fullDay: boolean; pairedTimes: boolean; minutes: number }): Task => {
    let displayHour: number;

    if (sequentialHour !== undefined) {
        displayHour = use24Hour ? toOfficialHour(sequentialHour) : sequentialHour;
    } else if (fullDay) {
        displayHour = Math.floor(Math.random() * 24);
    } else {
        const hour = Math.floor(Math.random() * 12) + 1;
        displayHour = use24Hour || (pairedTimes && Math.random() >= 0.5) ? toOfficialHour(hour) : hour;
    }

    const analogHour = normalizeHour(displayHour % 12 || 12);
    return {
        displayHour,
        analogHour,
        minutes,
        options: shuffle([analogHour, normalizeHour(analogHour - 1), normalizeHour(analogHour + 2)]),
    };
};

const createInitialTask = (use24Hour: boolean, sequential: boolean, fullDay: boolean, minutes: number): Task => {
    const displayHour = fullDay ? 0 : use24Hour ? 13 : sequential ? 1 : 12;
    const analogHour = normalizeHour(displayHour % 12 || 12);
    return {
        displayHour,
        analogHour,
        minutes,
        options: [analogHour, normalizeHour(analogHour - 1), normalizeHour(analogHour + 2)],
    };
};

const ClockFace = ({ hour, minutes }: { hour: number; minutes: number }) => {
    const clockRef = useRef<HTMLObjectElement>(null);

    const positionHands = useCallback(() => {
        const document = clockRef.current?.contentDocument;
        const svg = document?.documentElement as unknown as SVGSVGElement | undefined;
        const hourHand = (document?.getElementById("hour_hand") ?? document?.getElementById("Stunden")) as SVGGraphicsElement | null;
        const minuteHand = (document?.getElementById("minute_hand") ?? document?.getElementById("Minuten")) as SVGGraphicsElement | null;
        if (!hourHand || !minuteHand) return;

        const centerX = svg ? svg.viewBox.baseVal.x + svg.viewBox.baseVal.width / 2 : 340;
        const centerY = svg ? svg.viewBox.baseVal.y + svg.viewBox.baseVal.height / 2 : 340;
        for (const hand of [hourHand, minuteHand]) {
            hand.style.transformBox = "view-box";
            hand.style.transformOrigin = `${centerX}px ${centerY}px`;
            hand.style.transition = "transform 350ms ease-in-out";
        }
        hourHand.style.transform = `rotate(${hour * 30 + minutes * 0.5}deg)`;
        minuteHand.style.transform = `rotate(${minutes * 6}deg)`;
    }, [hour, minutes]);

    useEffect(() => positionHands(), [positionHands]);

    return (
        <object
            ref={clockRef}
            type="image/svg+xml"
            data="/transfer/am_zifferblatt_0000.svg"
            aria-hidden="true"
            tabIndex={-1}
            onLoad={positionHands}
            className="pointer-events-none aspect-square w-full"
        />
    );
};

export const DigitalClockChoiceExercise = ({ exerciseNumber = 1, minutes = 0, minuteOptions, randomQuarter = false, informal = false, use24Hour = false, sequential = false, fullDay = false, pairedTimes = false }: { exerciseNumber?: number; minutes?: number; minuteOptions?: number[]; randomQuarter?: boolean; informal?: boolean; use24Hour?: boolean; sequential?: boolean; fullDay?: boolean; pairedTimes?: boolean }) => {
    const initialMinutes = minuteOptions?.[0] ?? (randomQuarter ? 15 : minutes);
    const taskCount = sequential ? 12 : randomTaskCount;
    const [task, setTask] = useState<Task>(() => createInitialTask(use24Hour, sequential, fullDay, initialMinutes));
    const [currentTask, setCurrentTask] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [feedback, setFeedback] = useState<"correct" | "wrong" | "solution" | null>(null);

    const makeTask = useCallback((index: number) => {
        const availableMinutes = minuteOptions?.length ? minuteOptions : randomQuarter ? [15, 45] : [minutes];
        const taskMinutes = availableMinutes[Math.floor(Math.random() * availableMinutes.length)];
        return createTask({
            use24Hour,
            sequentialHour: sequential && index < 12 ? index + 1 : undefined,
            fullDay,
            pairedTimes,
            minutes: taskMinutes,
        });
    }, [fullDay, minuteOptions, minutes, pairedTimes, randomQuarter, sequential, use24Hour]);

    useEffect(() => {
        setTask(makeTask(0));
        setCurrentTask(0);
        setSelected(null);
        setWrongAttempts(0);
        setFeedback(null);
    }, [makeTask]);

    useEffect(() => {
        if (!feedback) return;
        const timeout = setTimeout(() => {
            if (feedback === "correct" || feedback === "solution") {
                const nextTask = currentTask + 1;
                setCurrentTask(nextTask);
                if (nextTask < taskCount) setTask(makeTask(nextTask));
                setWrongAttempts(0);
            }
            setSelected(null);
            setFeedback(null);
        }, feedback === "solution" ? 1200 : 700);
        return () => clearTimeout(timeout);
    }, [currentTask, feedback, makeTask, taskCount]);

    const choose = (hour: number) => {
        if (feedback) return;
        setSelected(hour);
        if (hour === task.analogHour) {
            setFeedback("correct");
            return;
        }
        const attempts = wrongAttempts + 1;
        setWrongAttempts(attempts);
        setFeedback(attempts >= 3 ? "solution" : "wrong");
    };

    const restart = () => {
        setCurrentTask(0);
        setTask(makeTask(0));
        setSelected(null);
        setWrongAttempts(0);
        setFeedback(null);
    };

    const finished = currentTask >= taskCount;

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-lg bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {finished ? (
                <ExerciseCompletionHeader exerciseNumber={exerciseNumber} instruction={t("instructions.digital-clock-choice.prompt")} onRestart={restart} />
            ) : (
                <>
                    <div className="border-b border-secondary pb-4">
                        <p className="text-md font-medium text-secondary">
                            <span className="mr-2 font-black">{pad(exerciseNumber)}</span>
                            {t("instructions.digital-clock-choice.prompt")}
                        </p>
                    </div>

                    <p className={cx("text-center font-black text-primary", informal ? "text-display-sm" : "text-display-lg tabular-nums")}>
                        {informal ? formatInformalTime(task.displayHour, task.minutes) : `${pad(task.displayHour)}:${pad(task.minutes)}`}
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                        {task.options.map((hour, index) => {
                            const isCorrect = feedback === "correct" && hour === task.analogHour;
                            const isWrong = feedback === "wrong" && selected === hour;
                            const isSolution = feedback === "solution" && hour === task.analogHour;
                            const isSelected = selected === hour && feedback === null;
                            return (
                                <button
                                    key={hour}
                                    type="button"
                                    disabled={feedback !== null}
                                    onClick={() => choose(hour)}
                                    aria-label={t("instructions.digital-clock-choice.option-aria", { number: index + 1 })}
                                    className={cx(
                                        "w-full rounded-sm bg-primary p-5 shadow-xs ring-2 ring-secondary outline-focus-ring transition hover:ring-brand focus-visible:outline-2 disabled:cursor-default sm:p-6",
                                        isSelected && "bg-brand-primary ring-brand",
                                        isCorrect && "bg-success-secondary ring-[var(--color-bg-success-solid)]",
                                        isWrong && "bg-error-secondary ring-[var(--color-bg-error-solid)]",
                                        isSolution && "bg-sky-secondary ring-[var(--color-bg-sky-solid)]",
                                    )}
                                >
                                    <ClockFace hour={hour} minutes={task.minutes} />
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
