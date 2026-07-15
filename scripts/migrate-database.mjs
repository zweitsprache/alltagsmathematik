import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const parseEnvFile = (source) => Object.fromEntries(source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#")).map((line) => {
    const separator = line.indexOf("=");
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    return [line.slice(0, separator), value];
}));

const env = { ...parseEnvFile(await readFile(".env.local", "utf8")), ...process.env };
if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
const sql = neon(env.DATABASE_URL);

await sql`
    CREATE TABLE IF NOT EXISTS audio_assets (
        blob_path TEXT PRIMARY KEY,
        generation_text TEXT NOT NULL,
        voice_id TEXT NOT NULL DEFAULT 'Matthias',
        instruction TEXT NOT NULL DEFAULT 'well-pronounced and much slower than native',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
`;

await sql`
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_user_role') THEN
            CREATE TYPE app_user_role AS ENUM ('admin', 'client', 'instructor', 'student');
        END IF;
    END
    $$
`;

await sql`
    CREATE TABLE IF NOT EXISTS user_profiles (
        user_id UUID PRIMARY KEY REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
        role app_user_role NOT NULL DEFAULT 'student',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
`;

await sql`
    INSERT INTO user_profiles (user_id)
    SELECT id FROM neon_auth."user"
    ON CONFLICT (user_id) DO NOTHING
`;

await sql`
    CREATE OR REPLACE FUNCTION create_user_profile_for_auth_user()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    BEGIN
        INSERT INTO user_profiles (user_id)
        VALUES (NEW.id)
        ON CONFLICT (user_id) DO NOTHING;
        RETURN NEW;
    END;
    $$
`;

await sql`DROP TRIGGER IF EXISTS create_user_profile_after_auth_signup ON neon_auth."user"`;
await sql`
    CREATE TRIGGER create_user_profile_after_auth_signup
    AFTER INSERT ON neon_auth."user"
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile_for_auth_user()
`;

await sql`
    CREATE TABLE IF NOT EXISTS activity_sessions (
        id UUID PRIMARY KEY,
        student_id UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
        activity_id TEXT NOT NULL,
        task_count INTEGER NOT NULL CHECK (task_count > 0),
        random_seed TEXT,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (id, student_id)
    )
`;

await sql`
    CREATE TABLE IF NOT EXISTS task_attempts (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        session_id UUID NOT NULL,
        student_id UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
        task_index INTEGER NOT NULL CHECK (task_index >= 0),
        attempt_number INTEGER NOT NULL CHECK (attempt_number > 0),
        outcome TEXT NOT NULL CHECK (outcome IN ('correct', 'incorrect', 'solution')),
        task_snapshot JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (session_id, task_index, attempt_number),
        CONSTRAINT task_attempts_session_student_fkey FOREIGN KEY (session_id, student_id) REFERENCES activity_sessions(id, student_id) ON DELETE CASCADE
    )
`;

await sql`
    DO $$
    BEGIN
        ALTER TABLE task_attempts DROP CONSTRAINT IF EXISTS task_attempts_session_id_fkey;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'task_attempts_session_student_fkey') THEN
            ALTER TABLE task_attempts
            ADD CONSTRAINT task_attempts_session_student_fkey
            FOREIGN KEY (session_id, student_id) REFERENCES activity_sessions(id, student_id) ON DELETE CASCADE;
        END IF;
    END
    $$
`;

await sql`
    CREATE TABLE IF NOT EXISTS student_activity_progress (
        student_id UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
        activity_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
        tasks_completed INTEGER NOT NULL DEFAULT 0,
        task_count INTEGER NOT NULL DEFAULT 1,
        correct_first_try INTEGER NOT NULL DEFAULT 0,
        solutions_revealed INTEGER NOT NULL DEFAULT 0,
        total_attempts INTEGER NOT NULL DEFAULT 0,
        last_session_id UUID REFERENCES activity_sessions(id) ON DELETE SET NULL,
        first_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMPTZ,
        PRIMARY KEY (student_id, activity_id)
    )
`;

await sql`CREATE INDEX IF NOT EXISTS activity_sessions_student_activity_idx ON activity_sessions (student_id, activity_id, started_at DESC)`;
await sql`CREATE INDEX IF NOT EXISTS task_attempts_student_activity_idx ON task_attempts (student_id, created_at DESC)`;

const legacyActivityIds = [
    ["zahlen-und-variablen/zahlen-benennen-und-schreiben/zahlen-von-0-bis-10/zahlen-vergleichen#1", "exercise-0008"],
    ["zahlen-und-variablen/zahlen-benennen-und-schreiben/zahlen-von-0-bis-10/zahlen-vergleichen#2", "exercise-0009"],
    ["zahlen-und-variablen/zahlen-benennen-und-schreiben/zahlen-von-0-bis-10/zahlen-vergleichen#3", "exercise-0010"],
    ["zahlen-und-variablen/zahlen-benennen-und-schreiben/zahlen-von-0-bis-10/zahlen-vergleichen#4", "exercise-0011"],
];

for (const [legacyId, permanentId] of legacyActivityIds) {
    await sql`UPDATE activity_sessions SET activity_id = ${permanentId} WHERE activity_id = ${legacyId}`;
    await sql`UPDATE student_activity_progress SET activity_id = ${permanentId} WHERE activity_id = ${legacyId}`;
}

console.log("Database migration complete: audio, users, roles, and activity progress are ready.");
