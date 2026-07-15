"use client";

import { useCallback, useRef } from "react";

export type ActivityOutcome = "correct" | "incorrect" | "solution";

export const useActivityProgress = ({ activityId, taskCount }: { activityId?: string; taskCount: number }) => {
    const sessionId = useRef<string | null>(null);
    const randomSeed = useRef<string | null>(null);

    const resetSession = useCallback(() => {
        sessionId.current = crypto.randomUUID();
        randomSeed.current = crypto.randomUUID();
    }, []);

    const recordAttempt = useCallback(async ({ taskIndex, attemptNumber, outcome, taskSnapshot }: {
        taskIndex: number;
        attemptNumber: number;
        outcome: ActivityOutcome;
        taskSnapshot?: unknown;
    }) => {
        if (!activityId) return;
        if (!sessionId.current) resetSession();

        try {
            await fetch("/api/progress/activity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ activityId, sessionId: sessionId.current, taskCount, taskIndex, attemptNumber, outcome, taskSnapshot, randomSeed: randomSeed.current }),
                keepalive: true,
            });
        } catch {
            // Progress tracking must never interrupt the learning activity.
        }
    }, [activityId, resetSession, taskCount]);

    return { recordAttempt, resetSession };
};
