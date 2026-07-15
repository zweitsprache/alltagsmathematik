"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "@untitledui/icons";
import { toCardinal } from "n2words/de-DE";
import { numberWords } from "@/content/number-words";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { useExerciseTracking } from "@/components/exercises/tracking/tracked-exercise";
import { translate as t } from "@/i18n/translate";
import { playStreamedTts, prepareStreamedTts, type PreparedStreamedTts } from "@/lib/audio/play-streamed-tts";
import { cx } from "@/utils/cx";

const taskCount = 10;
const pad = (value: number) => value.toString().padStart(2, "0");
const toGermanNumberWord = (value: number) => toCardinal(value);

const shuffle = (values: number[]) => {
    const next = [...values];
    for (let index = next.length - 1; index > 0; index--) {
        const swap = Math.floor(Math.random() * (index + 1));
        [next[index], next[swap]] = [next[swap], next[index]];
    }
    return next;
};

const createTask = (min: number, max: number, wordCount: number, optionCount: number) => {
    const numbers = Array.from({ length: max - min + 1 }, (_, index) => min + index);
    const targets = shuffle(numbers).slice(0, wordCount);
    const distractors = shuffle(numbers.filter((number) => !targets.includes(number))).slice(0, optionCount - wordCount);
    return { targets, choices: shuffle([...targets, ...distractors]) };
};

export const NumberWordChoiceExercise = ({
    exerciseNumber = 1,
    min = 0,
    max = 10,
    wordCount = 1,
    optionCount = 3,
    presentation = "word",
    streamAudio = false,
}: {
    exerciseNumber?: number;
    min?: number;
    max?: number;
    wordCount?: 1 | 2 | 3;
    optionCount?: 3 | 4 | 5;
    presentation?: "word" | "audio";
    streamAudio?: boolean;
}) => {
    const tracking = useExerciseTracking();
    const [task, setTask] = useState({ targets: [min], choices: [min, min + 1, min + 2] });
    const [taskInitialized, setTaskInitialized] = useState(false);
    const [currentTask, setCurrentTask] = useState(0);
    const [selected, setSelected] = useState<number[]>([]);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [feedback, setFeedback] = useState<"wrong" | "solution" | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackError, setPlaybackError] = useState("");
    const playbackAbort = useRef<AbortController | null>(null);
    const preparationAbort = useRef<AbortController | null>(null);
    const preparedAudio = useRef(new Map<string, Promise<PreparedStreamedTts>>());

    const clearPreparedAudio = () => {
        preparationAbort.current?.abort();
        preparationAbort.current = null;
        for (const prepared of preparedAudio.current.values()) void prepared.then((audio) => audio.dispose()).catch(() => undefined);
        preparedAudio.current.clear();
    };

    useEffect(() => () => {
        playbackAbort.current?.abort();
        clearPreparedAudio();
    }, []);

    const startTask = () => {
        setTask(createTask(min, max, wordCount, optionCount));
        setTaskInitialized(true);
        setSelected([]);
        setWrongAttempts(0);
        setFeedback(null);
    };

    useEffect(() => {
        startTask();
        setCurrentTask(0);
    }, [min, max, optionCount, wordCount]);

    useEffect(() => {
        if (!streamAudio || !taskInitialized) return;
        preparationAbort.current?.abort();
        const abortController = new AbortController();
        preparationAbort.current = abortController;
        for (const target of task.targets) {
            const text = toGermanNumberWord(target);
            if (preparedAudio.current.has(text)) continue;
            const preparation = prepareStreamedTts(text, abortController.signal);
            preparedAudio.current.set(text, preparation);
            void preparation.catch(() => preparedAudio.current.delete(text));
        }
        return () => abortController.abort();
    }, [streamAudio, task.targets, taskInitialized]);

    const complete = selected.length === wordCount;
    const correct = complete && task.targets.every((target) => selected.includes(target));

    useEffect(() => {
        if (!correct) return;
        tracking.correct({ taskIndex: currentTask, snapshot: task });
        const timeout = setTimeout(() => {
            setCurrentTask((current) => current + 1);
            startTask();
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
                setCurrentTask((current) => current + 1);
                startTask();
                return;
            }
            setSelected([]);
            setFeedback(null);
        }, feedback === "solution" ? 1200 : 700);
        return () => clearTimeout(timeout);
    }, [currentTask, feedback, task, tracking, wrongAttempts]);

    const restart = () => {
        playbackAbort.current?.abort();
        clearPreparedAudio();
        tracking.restart();
        startTask();
        setCurrentTask(0);
    };

    const finished = currentTask >= taskCount;
    const prompt = presentation === "audio"
        ? wordCount === 1 ? "instructions.number-word-choice.prompt-audio" : wordCount === 2 ? "instructions.number-word-choice.prompt-audio-two" : "instructions.number-word-choice.prompt-audio-three"
        : wordCount === 1 ? "instructions.number-word-choice.prompt" : wordCount === 2 ? "instructions.number-word-choice.prompt-two" : "instructions.number-word-choice.prompt-three";

    const playTargets = async () => {
        if (isPlaying) return;
        const abortController = new AbortController();
        playbackAbort.current = abortController;
        setPlaybackError("");
        setIsPlaying(true);
        try {
            for (const [index, target] of task.targets.entries()) {
                if (streamAudio) {
                    const text = toGermanNumberWord(target);
                    const prepared = preparedAudio.current.get(text);
                    if (prepared) await (await prepared).play(abortController.signal);
                    else await playStreamedTts(text, abortController.signal);
                }
                else {
                    const audio = new Audio(`/api/audio/numbers/${target}`);
                    await new Promise<void>((resolve, reject) => {
                        audio.addEventListener("ended", () => resolve(), { once: true });
                        audio.addEventListener("error", () => reject(new Error("Audio could not be played.")), { once: true });
                        void audio.play().catch(reject);
                    });
                }
                if (index < task.targets.length - 1) await new Promise((resolve) => setTimeout(resolve, 300));
            }
        } catch (error) {
            if (!abortController.signal.aborted) setPlaybackError(error instanceof Error ? error.message : "Audio konnte nicht abgespielt werden.");
        } finally {
            if (playbackAbort.current === abortController) playbackAbort.current = null;
            setIsPlaying(false);
        }
    };

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-lg bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {finished ? (
                <ExerciseCompletionHeader exerciseNumber={exerciseNumber} instruction={t(prompt)} onRestart={restart} />
            ) : (
                <>
                    <div className="border-b border-secondary pb-4">
                        <p className="text-md font-medium text-secondary"><span className="mr-2 font-black">{pad(exerciseNumber)}</span>{t(prompt)}</p>
                    </div>
                    {presentation === "audio" ? (
                        <div className="flex flex-col items-center gap-3">
                            <button type="button" onClick={() => void playTargets()} disabled={isPlaying} aria-label={t("instructions.number-word-choice.play-aria")} className="flex size-14 items-center justify-center rounded-lg bg-brand-solid text-white shadow-xs-skeuomorphic outline-focus-ring transition hover:bg-brand-solid_hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60">
                                <Play className="size-7" />
                            </button>
                            {playbackError && <p className="text-sm text-error-primary" role="alert">{playbackError}</p>}
                        </div>
                    ) : (
                        <p className="text-center text-display-md font-black tracking-wide text-primary">{task.targets.map((target) => numberWords[target]).join(" · ")}</p>
                    )}
                    <div className={cx("grid gap-5 self-center", optionCount === 3 ? "grid-cols-3" : optionCount === 4 ? "grid-cols-4" : "grid-cols-5")}>
                        {task.choices.map((choice) => {
                            const isSelected = selected.includes(choice);
                            const isCorrect = correct && task.targets.includes(choice);
                            const isWrong = feedback === "wrong" && isSelected;
                            const isSolution = feedback === "solution" && task.targets.includes(choice);
                            const isDisabledDuringAudio = presentation === "audio" && isPlaying;
                            return (
                                <button
                                    key={choice}
                                    type="button"
                                    disabled={isDisabledDuringAudio || correct || feedback !== null}
                                    onClick={() => setSelected((current) => current.includes(choice) ? current.filter((number) => number !== choice) : current.length < wordCount ? [...current, choice] : current)}
                                    aria-label={t("instructions.number-word-choice.choice-aria", { number: choice })}
                                    className={cx("flex h-20 items-center justify-center rounded-sm bg-primary text-display-sm font-black text-primary shadow-xs ring-2 ring-secondary outline-focus-ring transition hover:ring-brand focus-visible:outline-2 disabled:cursor-default", max >= 1000 ? "w-28" : "w-20", isSelected && !complete && "bg-brand-primary ring-brand", isCorrect && "bg-success-secondary text-success-primary ring-[var(--color-bg-success-solid)]", isWrong && "bg-error-secondary text-error-primary ring-[var(--color-bg-error-solid)]", isSolution && "bg-sky-secondary text-sky-primary ring-[var(--color-bg-sky-solid)]", isDisabledDuringAudio && "cursor-not-allowed bg-secondary text-tertiary ring-secondary hover:ring-secondary")}
                                >
                                    {choice}
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
