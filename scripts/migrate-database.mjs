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

console.log("Database migration complete: audio_assets is ready.");
