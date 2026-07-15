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
    latestSessionTaskCount: number;
    latestSessionCorrectFirstTry: number;
    latestSessionSolutionsRevealed: number;
};

export const getStudentProgress = async (studentId: string): Promise<ActivityProgress[]> => {
    const sql = getDb();
    const result = await sql`
        WITH latest_completed_sessions AS (
            SELECT DISTINCT ON (activity_id) id, activity_id, task_count
            FROM activity_sessions
            WHERE student_id = ${studentId}::uuid AND completed_at IS NOT NULL
            ORDER BY activity_id, completed_at DESC
        ), latest_session_metrics AS (
            SELECT
                session.id AS session_id,
                session.activity_id,
                session.task_count,
                COUNT(*) FILTER (WHERE attempt.outcome = 'correct' AND attempt.attempt_number = 1) AS correct_first_try,
                COUNT(*) FILTER (WHERE attempt.outcome = 'solution') AS solutions_revealed
            FROM latest_completed_sessions session
            LEFT JOIN task_attempts attempt ON attempt.session_id = session.id
            GROUP BY session.id, session.activity_id, session.task_count
        )
        SELECT progress.activity_id, progress.status, progress.tasks_completed, progress.task_count,
               progress.correct_first_try, progress.solutions_revealed, progress.total_attempts,
               progress.last_activity_at, COALESCE(latest.task_count, 0) AS latest_task_count,
               COALESCE(latest.correct_first_try, 0) AS latest_correct_first_try,
               COALESCE(latest.solutions_revealed, 0) AS latest_solutions_revealed
        FROM student_activity_progress progress
        LEFT JOIN latest_session_metrics latest ON latest.activity_id = progress.activity_id
        WHERE progress.student_id = ${studentId}::uuid
        ORDER BY progress.last_activity_at DESC
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
            latestSessionTaskCount: Number(value.latest_task_count),
            latestSessionCorrectFirstTry: Number(value.latest_correct_first_try),
            latestSessionSolutionsRevealed: Number(value.latest_solutions_revealed),
        };
    });
};
