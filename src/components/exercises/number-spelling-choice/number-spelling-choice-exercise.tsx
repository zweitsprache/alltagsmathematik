"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ExerciseCompletionHeader } from "@/components/exercises/exercise-completion-header";
import { numberWords } from "@/content/number-words";
import { translate as t } from "@/i18n/translate";
import { cx } from "@/utils/cx";

type Variant = "switched" | "missing-und" | "switched-missing-und" | "mixed";
type Task = { number?: number; correct: string; options: string[] };

const pairs = [
    ["zehn", "zehnzig"],
    ["zwanzig", "zweizig"],
    ["dreissig", "dreizig"],
    ["vierzig", "vierssig"],
    ["fünfzig", "fünfssig"],
    ["sechzig", "sechssig"],
    ["siebzig", "siebenzig"],
    ["achtzig", "achtenzig"],
    ["neunzig", "neunssig"],
    ["hundert", "hundred"],
] as const;

const shuffle = <T,>(values: T[]) => {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index--) {
        const swap = Math.floor(Math.random() * (index + 1));
        [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
};

const createTasks = (): Task[] => shuffle(pairs.map(([correct, incorrect]) => ({ correct, options: shuffle([correct, incorrect]) })));

const standaloneOnes = ["", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];

const incorrectWord = (number: number, variant: Exclude<Variant, "mixed">) => {
    const correct = numberWords[number];
    if (variant === "missing-und") {
        const connector = correct.lastIndexOf("und");
        return connector < 0 ? correct : `${correct.slice(0, connector)}${correct.slice(connector + 3)}`;
    }
    const ten = Math.floor(number / 10) * 10;
    const one = number % 10;
    return variant === "switched" ? `${numberWords[ten]}und${standaloneOnes[one]}` : `${numberWords[ten]}${standaloneOnes[one]}`;
};

const createVariantTasks = (variant: Variant, min: number, max: number): Task[] => {
    const numbers = shuffle(Array.from({ length: max - min + 1 }, (_, index) => index + min).filter((number) => number % 10 !== 0 && number % 100 >= 21)).slice(0, 10);
    const patterns: Array<Exclude<Variant, "mixed">> = ["switched", "missing-und", "switched-missing-und"];
    return numbers.map((number, index) => {
        const pattern = variant === "mixed" ? patterns[index % patterns.length] : variant;
        const correct = numberWords[number];
        return { number, correct, options: shuffle([correct, incorrectWord(number, pattern)]) };
    });
};

const createRoundNumberTasks = (min: number, max: number): Task[] => {
    if (max <= 100) return createTasks();
    const values = [...Array.from({ length: 9 }, (_, index) => (index + 1) * 100), 1000].filter((number) => number >= min && number <= max);
    return shuffle(values.map((number) => {
        const correct = numberWords[number];
        const incorrect = number === 1000 ? "tausendhundert" : `${correct}zig`;
        return { number, correct, options: shuffle([correct, incorrect]) };
    }));
};

export const NumberSpellingChoiceExercise = ({ exerciseNumber = 1, min = 31, max = 99, variant }: { exerciseNumber?: number; min?: number; max?: number; variant?: Variant }) => {
    const initialTasks = variant
        ? Array.from({ length: 10 }, (_, index) => {
            const number = 31 + index + Math.floor(index / 9);
            return { number, correct: numberWords[number], options: [numberWords[number], incorrectWord(number, variant === "mixed" ? "switched" : variant)] };
        })
        : pairs.map(([correct, incorrect]) => ({ correct, options: [correct, incorrect] }));
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [feedback, setFeedback] = useState<"correct" | "wrong" | "solution" | null>(null);
    const prompt = t("instructions.number-spelling-choice.prompt");
    const finished = current >= tasks.length;
    const task = finished ? tasks[0] : tasks[current];

    useEffect(() => setTasks(variant ? createVariantTasks(variant, min, max) : createRoundNumberTasks(min, max)), [max, min, variant]);

    useEffect(() => {
        if (!feedback) return;
        const timeout = setTimeout(() => {
            if (feedback === "wrong" && wrongAttempts >= 3) {
                setSelected(null);
                setFeedback("solution");
                return;
            }
            if (feedback === "correct" || feedback === "solution") setCurrent((value) => value + 1);
            setSelected(null);
            setFeedback(null);
            if (feedback !== "wrong") setWrongAttempts(0);
        }, feedback === "solution" ? 1200 : 700);
        return () => clearTimeout(timeout);
    }, [feedback, wrongAttempts]);

    const choose = (option: string) => {
        if (feedback) return;
        setSelected(option);
        if (option === task.correct) return setFeedback("correct");
        const attempts = wrongAttempts + 1;
        setWrongAttempts(attempts);
        setFeedback("wrong");
    };

    const restart = () => {
        setTasks(variant ? createVariantTasks(variant, min, max) : createRoundNumberTasks(min, max));
        setCurrent(0);
        setSelected(null);
        setWrongAttempts(0);
        setFeedback(null);
    };

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-lg bg-primary p-6 ring-2 ring-border-primary ring-inset">
            {finished ? <ExerciseCompletionHeader exerciseNumber={exerciseNumber} instruction={prompt} onRestart={restart} /> : <>
                <div className="border-b border-secondary pb-4"><p className="text-md font-medium text-secondary"><span className="mr-2 font-black">{String(exerciseNumber).padStart(2, "0")}</span>{prompt}</p></div>
                {task.number !== undefined && <p className="text-center text-display-md font-black text-primary">{task.number}</p>}
                <div className="grid w-full grid-cols-2 gap-5">
                    {task.options.map((option) => {
                        const correct = feedback === "correct" && option === task.correct;
                        const wrong = feedback === "wrong" && option === selected;
                        const solution = feedback === "solution" && option === task.correct;
                        return <button key={option} type="button" disabled={feedback !== null} onClick={() => choose(option)} className={cx("rounded-sm bg-primary px-5 py-5 text-xl font-black text-primary ring-2 ring-secondary outline-focus-ring transition hover:ring-brand focus-visible:outline-2", correct && "bg-success-secondary text-success-primary ring-success", wrong && "bg-error-secondary text-error-primary ring-error", solution && "bg-sky-secondary text-sky-primary ring-sky")}>{option}</button>;
                    })}
                </div>
                <ProgressBar labelPosition="right" min={0} max={tasks.length} value={current} valueFormatter={(value) => `${value} / ${tasks.length}`} />
            </>}
        </div>
    );
};
