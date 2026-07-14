import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ explainer: string; slide: string }> }) {
    const { explainer, slide } = await params;
    const slideNumber = Number(slide);
    if (explainer !== "a-01-04-01" || !Number.isInteger(slideNumber) || slideNumber < 1 || slideNumber > 6) {
        return NextResponse.json({ error: "Invalid explainer slide." }, { status: 400 });
    }
    const pathname = `audio_zahlen/explainers/a_01_04_01/slide_${String(slideNumber).padStart(2, "0")}_male.mp3`;
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result) return NextResponse.json({ error: "Audio was not found." }, { status: 404 });
    return new Response(result.stream, { headers: { "Content-Type": result.blob.contentType || "audio/mpeg", "Cache-Control": "private, no-store" } });
}
