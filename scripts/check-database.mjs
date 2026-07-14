import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const parseEnvFile = (source) => Object.fromEntries(
    source
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => {
            const separator = line.indexOf("=");
            let value = line.slice(separator + 1).trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
            return [line.slice(0, separator), value];
        }),
);

const localEnv = parseEnvFile(await readFile(".env.local", "utf8"));
const connectionString = process.env.DATABASE_URL || localEnv.DATABASE_URL;

if (!connectionString) throw new Error("Add DATABASE_URL to .env.local before running npm run db:check.");

const sql = neon(connectionString);
const [result] = await sql`SELECT current_database() AS database, current_user AS user, NOW() AS connected_at`;

console.log(`Connected to Neon database "${result.database}" as "${result.user}" at ${result.connected_at}.`);
