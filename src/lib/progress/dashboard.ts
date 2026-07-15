import "server-only";

import { getDb } from "@/lib/db";

export type ActivityProgress = {
    activityId: string;
    status: "in_progress" | "completed";
    tasksCompleted: number;
    taskCount: number;
    correctFirstTry: number;
    solutionsRevealed: number;
    totalAttempts: number;
    lastActivityAt: string;
};

export const getStudentProgress = async (studentId: string): Promise<ActivityProgress[]> => {
    const sql = getDb();
    const result = await sql`
        SELECT activity_id, status, tasks_completed, task_count, correct_first_try,
               solutions_revealed, total_attempts, last_activity_at
        FROM student_activity_progress
        WHERE student_id = ${studentId}::uuid
        ORDER BY last_activity_at DESC
    `;
    if (!Array.isArray(result)) return [];

    return result.map((row) => {
        const value = row as Record<string, unknown>;
        return {
            activityId: String(value.activity_id),
            status: value.status === "completed" ? "completed" : "in_progress",
            tasksCompleted: Number(value.tasks_completed),
            taskCount: Number(value.task_count),
            correctFirstTry: Number(value.correct_first_try),
            solutionsRevealed: Number(value.solutions_revealed),
            totalAttempts: Number(value.total_attempts),
            lastActivityAt: String(value.last_activity_at),
        };
    });
};
