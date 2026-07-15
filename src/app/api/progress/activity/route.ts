import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";

type ProgressEvent = {
    activityId?: string;
    sessionId?: string;
    taskCount?: number;
    taskIndex?: number;
    attemptNumber?: number;
    outcome?: "correct" | "incorrect" | "solution";
    taskSnapshot?: unknown;
    randomSeed?: string;
};

const unauthorized = () => NextResponse.json({ error: "Authentication required." }, { status: 401 });

export async function GET(request: Request) {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) return unauthorized();

    const activityId = new URL(request.url).searchParams.get("activityId");
    if (!activityId) return NextResponse.json({ error: "activityId is required." }, { status: 400 });

    const sql = getDb();
    const result = await sql`
        SELECT status, tasks_completed, task_count, correct_first_try, solutions_revealed,
               total_attempts, first_started_at, last_activity_at, completed_at
        FROM student_activity_progress
        WHERE student_id = ${session.user.id}::uuid AND activity_id = ${activityId}
    `;
    const progress = Array.isArray(result) ? result[0] : null;
    return NextResponse.json({ progress: progress ?? null });
}

export async function POST(request: Request) {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) return unauthorized();

    const event = (await request.json()) as ProgressEvent;
    const { activityId, sessionId, taskCount, taskIndex, attemptNumber, outcome } = event;
    if (!activityId || !sessionId || !Number.isInteger(taskCount) || (taskCount ?? 0) < 1 || !Number.isInteger(taskIndex) || (taskIndex ?? -1) < 0 || !Number.isInteger(attemptNumber) || (attemptNumber ?? 0) < 1 || !outcome || !["correct", "incorrect", "solution"].includes(outcome)) {
        return NextResponse.json({ error: "Invalid progress event." }, { status: 400 });
    }
    const validTaskCount = taskCount as number;
    const validTaskIndex = taskIndex as number;
    const validAttemptNumber = attemptNumber as number;

    const sql = getDb();
    await sql`
        INSERT INTO activity_sessions (id, student_id, activity_id, task_count, random_seed)
        VALUES (${sessionId}::uuid, ${session.user.id}::uuid, ${activityId}, ${validTaskCount}, ${event.randomSeed ?? null})
        ON CONFLICT (id) DO NOTHING
    `;

    const inserted = await sql`
        INSERT INTO task_attempts (session_id, student_id, task_index, attempt_number, outcome, task_snapshot)
        VALUES (${sessionId}::uuid, ${session.user.id}::uuid, ${validTaskIndex}, ${validAttemptNumber}, ${outcome}, ${event.taskSnapshot ? JSON.stringify(event.taskSnapshot) : null}::jsonb)
        ON CONFLICT (session_id, task_index, attempt_number) DO NOTHING
        RETURNING id
    `;

    const wasInserted = Array.isArray(inserted) && inserted.length > 0;
    if (wasInserted) {
        const completesTask = outcome === "correct" || outcome === "solution";
        const completionRows = await sql`
            SELECT COUNT(DISTINCT task_index)::int AS completed_tasks
            FROM task_attempts
            WHERE session_id = ${sessionId}::uuid AND outcome IN ('correct', 'solution')
        `;
        const completedInSession = Number(Array.isArray(completionRows) ? (completionRows[0] as Record<string, unknown>)?.completed_tasks ?? 0 : 0);
        const completedAt = completedInSession >= validTaskCount ? new Date().toISOString() : null;
        await sql`
            INSERT INTO student_activity_progress (
                student_id, activity_id, status, tasks_completed, task_count, correct_first_try,
                solutions_revealed, total_attempts, last_session_id, completed_at
            ) VALUES (
                ${session.user.id}::uuid, ${activityId}, ${completedAt ? "completed" : "in_progress"},
                ${completesTask ? 1 : 0}, ${validTaskCount}, ${outcome === "correct" && validAttemptNumber === 1 ? 1 : 0},
                ${outcome === "solution" ? 1 : 0}, 1, ${sessionId}::uuid, ${completedAt}
            )
            ON CONFLICT (student_id, activity_id) DO UPDATE SET
                status = CASE WHEN EXCLUDED.status = 'completed' THEN 'completed' ELSE student_activity_progress.status END,
                tasks_completed = GREATEST(student_activity_progress.tasks_completed, ${completedInSession}),
                task_count = EXCLUDED.task_count,
                correct_first_try = student_activity_progress.correct_first_try + ${outcome === "correct" && validAttemptNumber === 1 ? 1 : 0},
                solutions_revealed = student_activity_progress.solutions_revealed + ${outcome === "solution" ? 1 : 0},
                total_attempts = student_activity_progress.total_attempts + 1,
                last_session_id = EXCLUDED.last_session_id,
                last_activity_at = NOW(),
                completed_at = COALESCE(student_activity_progress.completed_at, EXCLUDED.completed_at)
        `;
        await sql`
            UPDATE activity_sessions SET updated_at = NOW(), completed_at = COALESCE(completed_at, ${completedAt})
            WHERE id = ${sessionId}::uuid AND student_id = ${session.user.id}::uuid
        `;
    }

    return NextResponse.json({ recorded: wasInserted });
}
