import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

const limits: Record<string, number> = { a_01_01_11: 9, a_01_02_11: 14, a_01_03_11: 7, a_01_04_11: 7 };

export async function GET(_request: Request, { params }: { params: Promise<{ contextId: string; set: string; item: string }> }) {
    const { contextId, set, item } = await params;
    const setNumber = Number(set);
    const itemNumber = Number(item);
    const itemLimit = limits[contextId];
    if (!itemLimit || !Number.isInteger(setNumber) || setNumber < 1 || setNumber > 5 || !Number.isInteger(itemNumber) || itemNumber < 1 || itemNumber > itemLimit) {
        return NextResponse.json({ error: "Invalid audio item." }, { status: 400 });
    }
    const pathname = `audio_zahlen/context/${contextId}/${contextId}_context_${String(setNumber).padStart(2,"0")}_${String(itemNumber).padStart(2,"0")}_male.mp3`;
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result) return NextResponse.json({ error: "Audio was not found." }, { status: 404 });
    return new Response(result.stream, {
        headers: {
            "Content-Type": result.blob.contentType || "audio/mpeg",
            "Content-Length": String(result.blob.size),
            "Cache-Control": "private, no-store",
        },
    });
}
