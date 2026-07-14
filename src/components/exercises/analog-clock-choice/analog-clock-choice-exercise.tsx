"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { translate as t } from "@/i18n/translate";
import { cx } from "@/utils/cx";

const randomTaskCount = 10;
const pad = (value: number) => value.toString().padStart(2, "0");
const normalizeHour = (hour: number) => ((hour - 1 + 12) % 12) + 1;

const shuffle = <T,>(items: T[]) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
};

const toOfficialHour = (hour: number) => hour === 12 ? 0 : hour + 12;
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

const createTask = (use24Hour: boolean, hourOverride: number | undefined, fullDay: boolean, pairedTimes: boolean, minutes: number, randomQuarter: boolean, minuteOptions?: number[]) => {
    const availableMinutes = minuteOptions?.length ? minuteOptions : randomQuarter ? [15, 45] : [minutes];
    const taskMinutes = availableMinutes[Math.floor(Math.random() * availableMinutes.length)];
    if (pairedTimes) {
        const hour = Math.floor(Math.random() * 12) + 1;
        const correctHours = [hour, toOfficialHour(hour)];
        const options = shuffle([...correctHours, normalizeHour(hour - 1), normalizeHour(hour + 2)]);
        return { hour, minutes: taskMinutes, correctHour: hour, correctHours, options };
    }
    if (fullDay) {
        const correctHour = Math.floor(Math.random() * 24);
        const hour = normalizeHour(correctHour % 12 || 12);
        return { hour, minutes: taskMinutes, correctHour, correctHours: [correctHour], options: shuffle([correctHour, (correctHour + 23) % 24, (correctHour + 2) % 24]) };
    }
    const hour = hourOverride ?? Math.floor(Math.random() * 12) + 1;
    const correctHour = use24Hour ? toOfficialHour(hour) : hour;
    const options = use24Hour
        ? [correctHour, (correctHour + 23) % 24, (correctHour + 2) % 24]
        : [correctHour, normalizeHour(hour - 1), normalizeHour(hour + 2)];
    return { hour, minutes: taskMinutes, correctHour, correctHours: [correctHour], options: shuffle(options) };
};

export const AnalogClockChoiceExercise = ({ exerciseNumber = 1, minutes = 0, minuteOptions, randomQuarter = false, informal = false, use24Hour = false, sequential = false, fullDay = false, pairedTimes = false }: { exerciseNumber?: number; minutes?: number; minuteOptions?: number[]; randomQuarter?: boolean; informal?: boolean; use24Hour?: boolean; sequential?: boolean; fullDay?: boolean; pairedTimes?: boolean }) => {
    const clockRef = useRef<HTMLObjectElement>(null);
    const [task, setTask] = useState({ hour: 12, minutes, correctHour: use24Hour ? 0 : 12, correctHours: [use24Hour ? 0 : 12], options: use24Hour ? [0, 23, 14] : [12, 11, 2] });
    const [currentTask, setCurrentTask] = useState(0);
    const [selected, setSelected] = useState<number[]>([]);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [feedback, setFeedback] = useState<"correct" | "wrong" | "solution" | null>(null);
    const taskCount = sequential ? 12 : randomTaskCount;
    const selectPairedTimes = pairedTimes && !informal;

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
            hand.style.transition = "transform 500ms ease-in-out";
        }
        hourHand.style.transform = `rotate(${task.hour * 30 + task.minutes * 0.5}deg)`;
        minuteHand.style.transform = `rotate(${task.minutes * 6}deg)`;
    }, [task.hour, task.minutes]);

    useEffect(() => {
        setTask(createTask(use24Hour, sequential ? 1 : undefined, fullDay, selectPairedTimes, minutes, randomQuarter, minuteOptions));
        setCurrentTask(0);
    }, [fullDay, minuteOptions, minutes, randomQuarter, selectPairedTimes, sequential, use24Hour]);

    useEffect(() => {
        positionHands();
    }, [positionHands]);

    useEffect(() => {
        if (!feedback) return;
        const timeout = setTimeout(() => {
            if (feedback === "correct" || feedback === "solution") {
                const nextTask = currentTask + 1;
                setCurrentTask(nextTask);
                setTask(createTask(use24Hour, sequential && nextTask < 12 ? nextTask + 1 : undefined, fullDay, selectPairedTimes, minutes, randomQuarter, minuteOptions));
                setWrongAttempts(0);
            }
            setSelected([]);
            setFeedback(null);
        }, feedback === "solution" ? 1200 : 700);
        return () => clearTimeout(timeout);
    }, [currentTask, feedback, fullDay, minuteOptions, minutes, randomQuarter, selectPairedTimes, sequential, use24Hour]);

    const choose = (hour: number) => {
        if (feedback) return;
        const nextSelected = selectPairedTimes
            ? selected.includes(hour) ? selected.filter((value) => value !== hour) : selected.length < 2 ? [...selected, hour] : selected
            : [hour];
        setSelected(nextSelected);
        if (nextSelected.length < (selectPairedTimes ? 2 : 1)) return;
        if (nextSelected.every((value) => task.correctHours.includes(value))) {
            setFeedback("correct");
            return;
        }
        const attempts = wrongAttempts + 1;
        setWrongAttempts(attempts);
        setFeedback(attempts >= 3 ? "solution" : "wrong");
    };

    const restart = () => {
        setCurrentTask(0);
        setTask(createTask(use24Hour, sequential ? 1 : undefined, fullDay, selectPairedTimes, minutes, randomQuarter, minuteOptions));
        setSelected([]);
        setWrongAttempts(0);
        setFeedback(null);
    };

    const finished = currentTask >= taskCount;

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-lg bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {finished ? (
                <ExerciseCompletionHeader exerciseNumber={exerciseNumber} instruction={t(selectPairedTimes ? "instructions.analog-clock-choice.prompt-pair" : "instructions.analog-clock-choice.prompt")} onRestart={restart} />
            ) : (
                <>
                    <div className="border-b border-secondary pb-4">
                        <p className="text-md font-medium text-secondary">
                            <span className="mr-2 font-black">{pad(exerciseNumber)}</span>
                            {t(selectPairedTimes ? "instructions.analog-clock-choice.prompt-pair" : "instructions.analog-clock-choice.prompt")}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <object
                            ref={clockRef}
                            type="image/svg+xml"
                            data="/transfer/am_zifferblatt_0000.svg"
                            aria-label={t("instructions.analog-clock-choice.clock-aria")}
                            onLoad={positionHands}
                            className="pointer-events-none size-64"
                        />
                    </div>

                    <div className={cx("grid w-full gap-4", selectPairedTimes ? "grid-cols-4" : "grid-cols-3")}>
                        {task.options.map((hour) => {
                            const isCorrect = feedback === "correct" && task.correctHours.includes(hour);
                            const isWrong = feedback === "wrong" && selected.includes(hour);
                            const isSolution = feedback === "solution" && task.correctHours.includes(hour);
                            const isSelected = selected.includes(hour) && feedback === null;
                            return (
                                <button
                                    key={hour}
                                    type="button"
                                    disabled={feedback !== null}
                                    onClick={() => choose(hour)}
                                    className={cx(
                                        "w-full rounded-sm bg-primary px-3 py-4 text-lg font-bold text-primary shadow-xs ring-2 ring-secondary outline-focus-ring transition hover:ring-brand focus-visible:outline-2 disabled:cursor-default",
                                        informal && "whitespace-nowrap",
                                        isSelected && "bg-brand-primary ring-brand",
                                        isCorrect && "bg-success-secondary text-success-primary ring-[var(--color-bg-success-solid)]",
                                        isWrong && "bg-error-secondary text-error-primary ring-[var(--color-bg-error-solid)]",
                                        isSolution && "bg-sky-secondary text-sky-primary ring-[var(--color-bg-sky-solid)]",
                                    )}
                                >
                                    {informal ? formatInformalTime(hour, task.minutes) : `${pad(hour)}:${pad(task.minutes)}`}
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
