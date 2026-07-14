"use client";

import { useState } from "react";
import type { ExerciseConfig } from "@/content/curriculum";
import { cx } from "@/utils/cx";
import { IntroExercise } from "./intro-exercise";
import { NumberSpeechExplainer } from "./number-speech-explainer";

const labelFor = (exercise: ExerciseConfig) => {
    if (exercise.type === "number-speech-explainer") return "Regel";
    if (exercise.values) return Math.max(...exercise.values) > 100 ? "…00" : "…0";
    return `${exercise.min} – ${exercise.max}`;
};

export const IntroExerciseTabs = ({ exercises }: { exercises: ExerciseConfig[] }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selected = exercises[selectedIndex];

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <div className={`grid w-full max-w-3xl grid-cols-2 gap-2 ${exercises.length === 10 ? "sm:grid-cols-5" : "sm:grid-cols-9"}`} role="tablist" aria-label="Zahlenbereich auswählen">
                {exercises.map((exercise, index) => (
                    <button
                        key={`${exercise.introTitle}-${index}`}
                        type="button"
                        role="tab"
                        aria-selected={selectedIndex === index}
                        onClick={() => setSelectedIndex(index)}
                        className={cx(
                            "w-full rounded-sm border px-2 py-1.5 text-center text-sm font-semibold outline-focus-ring transition focus-visible:outline-2 focus-visible:outline-offset-2",
                            selectedIndex === index
                                ? "border-brand-solid bg-brand-solid text-white"
                                : "border-secondary bg-primary text-secondary hover:bg-primary_hover",
                        )}
                    >
                        {labelFor(exercise)}
                    </button>
                ))}
            </div>

            <div role="tabpanel" data-marketing-capture={`activity-${selectedIndex + 1}`}>
                {selected.type === "number-speech-explainer" ? (
                    <NumberSpeechExplainer />
                ) : (
                    <IntroExercise min={selected.min} max={selected.max} values={selected.values} title={selected.introTitle} />
                )}
            </div>
        </div>
    );
};
