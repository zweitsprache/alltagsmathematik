import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireVideoAdmin, sanitizeCompositionMetadata } from "@/lib/remotion-lambda";

export const runtime = "nodejs";

const isCompositionId = (value: unknown): value is string =>
    typeof value === "string" && /^[A-Za-z0-9]{1,80}$/.test(value);

export async function GET() {
    const authorization = await requireVideoAdmin();
    if ("error" in authorization) {
        return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    try {
        const sql = getDb();
        const rows = await sql`
            SELECT composition_id, metadata
            FROM video_composition_metadata
            ORDER BY composition_id
        `;
        const records = Array.isArray(rows)
            ? rows as Array<{ composition_id: unknown; metadata: unknown }>
            : [];
        const metadata = Object.fromEntries(
            records
                .filter((row) => isCompositionId(row.composition_id))
                .map((row) => [row.composition_id as string, sanitizeCompositionMetadata(row.metadata)]),
        );

        return NextResponse.json({ metadata });
    } catch (error) {
        console.error("Could not load video composition metadata", error);
        return NextResponse.json({ error: "Video metadata could not be loaded." }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const authorization = await requireVideoAdmin();
    if ("error" in authorization) {
        return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const body = await request.json().catch(() => null) as {
        compositionId?: unknown;
        metadata?: unknown;
    } | null;
    if (!isCompositionId(body?.compositionId)) {
        return NextResponse.json({ error: "Invalid composition ID." }, { status: 400 });
    }

    try {
        const sql = getDb();
        const metadata = sanitizeCompositionMetadata(body?.metadata);
        await sql`
            INSERT INTO video_composition_metadata (composition_id, metadata, updated_by)
            VALUES (
                ${body.compositionId},
                ${JSON.stringify(metadata)}::jsonb,
                ${authorization.session.user.id}::uuid
            )
            ON CONFLICT (composition_id) DO UPDATE
            SET metadata = EXCLUDED.metadata,
                updated_by = EXCLUDED.updated_by,
                updated_at = NOW()
        `;

        return NextResponse.json({ compositionId: body.compositionId, metadata });
    } catch (error) {
        console.error("Could not save video composition metadata", error);
        return NextResponse.json({ error: "Video metadata could not be saved." }, { status: 500 });
    }
}
