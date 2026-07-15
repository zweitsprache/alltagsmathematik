import "server-only";

import { getDb } from "@/lib/db";

export const userRoles = ["admin", "client", "instructor", "student"] as const;

export type UserRole = (typeof userRoles)[number];

export const isUserRole = (value: unknown): value is UserRole => typeof value === "string" && userRoles.includes(value as UserRole);

/** Returns the application role for a Neon Auth user. */
export const getUserRole = async (userId: string): Promise<UserRole> => {
    const sql = getDb();
    const result = await sql`SELECT role FROM user_profiles WHERE user_id = ${userId}::uuid`;
    const profile = Array.isArray(result) ? result[0] as Record<string, unknown> | undefined : undefined;

    return isUserRole(profile?.role) ? profile.role : "student";
};

/** Checks a user's exact role. Admin bypass must be requested explicitly. */
export const hasUserRole = async (userId: string, allowedRoles: readonly UserRole[], allowAdmin = true): Promise<boolean> => {
    const role = await getUserRole(userId);
    return (allowAdmin && role === "admin") || allowedRoles.includes(role);
};
