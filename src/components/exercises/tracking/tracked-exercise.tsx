"use client";

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import { useActivityProgress } from "@/hooks/use-activity-progress";

export type ExerciseTrackingMode = "task-based" | "completion-only";

type OutcomeInput = { taskIndex: number; snapshot?: unknown };

type ExerciseTrackingContextValue = {
    mode: ExerciseTrackingMode;
    correct: (input: OutcomeInput) => void;
    incorrect: (input: OutcomeInput) => void;
    solution: (input: OutcomeInput) => void;
    complete: (snapshot?: unknown) => void;
    restart: () => void;
};

const noop = () => undefined;
const ExerciseTrackingContext = createContext<ExerciseTrackingContextValue>({ mode: "task-based", correct: noop, incorrect: noop, solution: noop, complete: noop, restart: noop });

export const TrackedExercise = ({ activityId, taskCount, mode, children }: { activityId: string; taskCount: number; mode: ExerciseTrackingMode; children: ReactNode }) => {
    const { recordAttempt, resetSession } = useActivityProgress({ activityId, taskCount });
    const wrongAttempts = useRef(new Map<number, number>());
    const recordedEvents = useRef(new Set<string>());

    const record = useCallback((taskIndex: number, outcome: "correct" | "incorrect" | "solution", snapshot?: unknown) => {
        const wrongCount = wrongAttempts.current.get(taskIndex) ?? 0;
        const attemptNumber = outcome === "incorrect" ? wrongCount + 1 : wrongCount + 1;
        const eventKey = `${taskIndex}:${attemptNumber}:${outcome}`;
        if (recordedEvents.current.has(eventKey)) return;
        recordedEvents.current.add(eventKey);
        if (outcome === "incorrect") wrongAttempts.current.set(taskIndex, attemptNumber);
        void recordAttempt({ taskIndex, attemptNumber, outcome, taskSnapshot: snapshot });
    }, [recordAttempt]);

    const restart = useCallback(() => {
        wrongAttempts.current.clear();
        recordedEvents.current.clear();
        resetSession();
    }, [resetSession]);

    const value = useMemo<ExerciseTrackingContextValue>(() => ({
        mode,
        correct: ({ taskIndex, snapshot }) => record(taskIndex, "correct", snapshot),
        incorrect: ({ taskIndex, snapshot }) => record(taskIndex, "incorrect", snapshot),
        solution: ({ taskIndex, snapshot }) => record(taskIndex, "solution", snapshot),
        complete: (snapshot) => record(0, "correct", snapshot),
        restart,
    }), [mode, record, restart]);

    return <ExerciseTrackingContext.Provider value={value}>{children}</ExerciseTrackingContext.Provider>;
};

export const useExerciseTracking = () => useContext(ExerciseTrackingContext);
