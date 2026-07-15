"use client";

import { useEffect, useMemo, useState } from "react";
import { Play } from "@untitledui/icons";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { useExerciseTracking } from "@/components/exercises/tracking/tracked-exercise";
import sets0To10 from "@/content/context-number-audio.json";
import sets11To24 from "@/content/context-number-audio-11-24.json";
import readSets11To24 from "@/content/context-number-read-11-24.json";
import readSets0To10 from "@/content/context-number-read-0-10.json";
import sets25To31 from "@/content/context-number-audio-25-31.json";
import readSets25To31 from "@/content/context-number-read-25-31.json";
import sets30To100 from "@/content/context-number-audio-30-100.json";
import readSets30To100 from "@/content/context-number-read-30-100.json";
import { translate as t } from "@/i18n/translate";
import { cx } from "@/utils/cx";

const shuffle = <T,>(items: T[]) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const swap = Math.floor(Math.random() * (index + 1));
        [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
};

export const ContextNumberListenExercise = ({ exerciseNumber, setNumber, contextId = "a_01_01_11", presentation = "audio" }: { exerciseNumber: number; setNumber: number; contextId?: string; presentation?: "audio" | "text" }) => {
    const tracking = useExerciseTracking();
    const sets = contextId === "a_01_04_12" ? readSets30To100 : contextId === "a_01_04_11" ? sets30To100 : contextId === "a_01_03_12" ? readSets25To31 : contextId === "a_01_03_11" ? sets25To31 : contextId === "a_01_02_12" ? readSets11To24 : contextId === "a_01_01_12" ? readSets0To10 : contextId === "a_01_02_11" ? sets11To24 : sets0To10;
    const numberPool = contextId === "a_01_04_11" || contextId === "a_01_04_12" ? Array.from({ length: 71 }, (_, index) => index + 30) : contextId === "a_01_01_11" || contextId === "a_01_01_12" ? [2,3,4,5,6,7,8,9,10] : contextId === "a_01_03_11" || contextId === "a_01_03_12" ? [25,26,27,28,29,30,31] : [11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    const source = sets[setNumber - 1];
    const [order, setOrder] = useState(() => source.map((_, index) => index));
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<"correct" | "wrong" | "solution" | null>(null);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const optionCount = setNumber <= 3 ? 3 : 4;
    const prompt = presentation === "text" ? "instructions.context-number-listen.prompt-read" : "instructions.context-number-listen.prompt";
    const finished = current >= source.length;
    const itemIndex = finished ? 0 : order[current];
    const item = source[itemIndex];
    const targets = useMemo(() => [...item.numbers], [item]);
    const options = useMemo(() => {
        const distractors = numberPool.filter((number) => !targets.includes(number)).slice(0, optionCount - targets.length);
        const values = [...targets, ...distractors];
        const offset = (itemIndex + setNumber) % values.length;
        return [...values.slice(offset), ...values.slice(0, offset)];
    }, [itemIndex, numberPool, optionCount, setNumber, targets]);

    useEffect(() => setOrder(shuffle(source.map((_, index) => index))), [source]);

    useEffect(() => {
        if (!feedback) return;
        const timeout = setTimeout(() => {
            if (feedback === "correct" || feedback === "solution") setCurrent((value) => value + 1);
            setSelected([]);
            setFeedback(null);
            if (feedback !== "wrong") setWrongAttempts(0);
        }, feedback === "solution" ? 1200 : 700);
        return () => clearTimeout(timeout);
    }, [feedback]);

    const choose = (optionIndex: number) => {
        if (feedback || isPlaying) return;
        const next = selected.includes(optionIndex) ? selected.filter((value) => value !== optionIndex) : selected.length < targets.length ? [...selected, optionIndex] : selected;
        setSelected(next);
        if (next.length < targets.length) return;
        const selectedNumbers = next.map((index) => options[index]).sort((a, b) => a - b);
        const correctNumbers = [...targets].sort((a, b) => a - b);
        if (selectedNumbers.every((value, index) => value === correctNumbers[index])) {
            tracking.correct({ taskIndex: current, snapshot: item });
            return setFeedback("correct");
        }
        const attempts = wrongAttempts + 1;
        tracking.incorrect({ taskIndex: current, snapshot: item });
        setWrongAttempts(attempts);
        if (attempts >= 3) tracking.solution({ taskIndex: current, snapshot: item });
        setFeedback(attempts >= 3 ? "solution" : "wrong");
    };

    const restart = () => {
        tracking.restart();
        setOrder(shuffle(source.map((_, index) => index)));
        setCurrent(0); setSelected([]); setFeedback(null); setWrongAttempts(0);
    };

    const play = async () => {
        if (isPlaying || presentation !== "audio") return;
        setIsPlaying(true);
        const audio = new Audio(`/api/context-audio/${contextId}/${setNumber}/${itemIndex + 1}`);
        try { await audio.play(); await new Promise<void>((resolve) => audio.addEventListener("ended", () => resolve(), { once: true })); }
        finally { setIsPlaying(false); }
    };

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-lg bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {finished ? <ExerciseCompletionHeader exerciseNumber={exerciseNumber} instruction={t(prompt)} onRestart={restart} /> : <>
                <div className="border-b border-secondary pb-4"><p className="text-md font-medium text-secondary"><span className="mr-2 font-black">{String(exerciseNumber).padStart(2,"0")}</span>{t(prompt)}</p></div>
                {presentation === "audio" ? <div className="flex justify-center"><button type="button" onClick={() => void play()} disabled={isPlaying} aria-label={t("instructions.context-number-listen.play-aria")} className="flex size-14 items-center justify-center rounded-lg bg-brand-solid text-white disabled:opacity-60"><Play className="size-7" /></button></div> : <p className="text-center text-xl font-semibold text-primary">{item.text}</p>}
                <div className={cx("grid w-full gap-4", optionCount === 3 ? "grid-cols-3" : "grid-cols-4")}>{options.map((number, optionIndex) => <button key={`${number}-${optionIndex}`} type="button" disabled={feedback !== null || isPlaying} onClick={() => choose(optionIndex)} className={cx("rounded-sm bg-primary px-4 py-4 text-xl font-black ring-2 ring-secondary", selected.includes(optionIndex) && !feedback && "bg-brand-primary ring-brand", feedback === "correct" && targets.includes(number) && "bg-success-secondary text-success-primary ring-success", feedback === "wrong" && selected.includes(optionIndex) && "bg-error-secondary text-error-primary ring-error", feedback === "solution" && targets.includes(number) && "bg-sky-secondary text-sky-primary ring-sky")}>{number}</button>)}</div>
                <ProgressBar labelPosition="right" min={0} max={source.length} value={current} valueFormatter={(value) => `${value} / ${source.length}`} />
            </>}
        </div>
    );
};
