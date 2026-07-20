import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireVideoAdmin } from "@/lib/remotion-lambda";
import { sanitizeVideoTtsItems } from "@/lib/video-tts";

export const runtime = "nodejs";

const validCompositionId = (value: unknown): value is string => typeof value === "string" && /^[A-Za-z0-9]{1,80}$/.test(value);

export async function GET(request: Request) {
    const authorization = await requireVideoAdmin();
    if ("error" in authorization) {
        return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const compositionId = new URL(request.url).searchParams.get("compositionId");
    if (!validCompositionId(compositionId)) {
        return NextResponse.json({ error: "Invalid composition ID." }, { status: 400 });
    }

    try {
        const sql = getDb();
        const rows = await sql`
            SELECT tts_items
            FROM video_timeline_projects
            WHERE composition_id = ${compositionId}
            LIMIT 1
        `;
        const row = Array.isArray(rows) ? (rows[0] as { tts_items?: unknown } | undefined) : undefined;
        return NextResponse.json({ compositionId, ttsItems: sanitizeVideoTtsItems(row?.tts_items) });
    } catch (error) {
        console.error("Could not load video timeline", error);
        return NextResponse.json({ error: "Video timeline could not be loaded." }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const authorization = await requireVideoAdmin();
    if ("error" in authorization) {
        return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const body = (await request.json().catch(() => null)) as {
        compositionId?: unknown;
        ttsItems?: unknown;
    } | null;
    if (!validCompositionId(body?.compositionId)) {
        return NextResponse.json({ error: "Invalid composition ID." }, { status: 400 });
    }
    const ttsItems = sanitizeVideoTtsItems(body?.ttsItems);

    try {
        const sql = getDb();
        await sql`
            INSERT INTO video_timeline_projects (composition_id, tts_items, updated_by)
            VALUES (
                ${body.compositionId},
                ${JSON.stringify(ttsItems)}::jsonb,
                ${authorization.session.user.id}::uuid
            )
            ON CONFLICT (composition_id) DO UPDATE
            SET tts_items = EXCLUDED.tts_items,
                updated_by = EXCLUDED.updated_by,
                updated_at = NOW()
        `;
        return NextResponse.json({ compositionId: body.compositionId, ttsItems });
    } catch (error) {
        console.error("Could not save video timeline", error);
        return NextResponse.json({ error: "Video timeline could not be saved." }, { status: 500 });
    }
}
