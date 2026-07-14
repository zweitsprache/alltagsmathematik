import "server-only";

import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon> | undefined;

/**
 * Returns the shared server-only Neon SQL client.
 *
 * Keep DATABASE_URL out of client components and public environment variables.
 * The lazy initialization allows builds to run before a database is configured.
 */
export const getDb = () => {
    if (client) return client;

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not configured.");
    }

    client = neon(connectionString);
    return client;
};
