import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ number: string }> }) {
    const { number: rawNumber } = await params;
    const number = Number(rawNumber);

    if (!Number.isInteger(number) || number < 0 || number > 1000) {
        return NextResponse.json({ error: "Number must be an integer from 0 to 1000." }, { status: 400 });
    }

    const pathname = `audio_zahlen/male/${String(number).padStart(4, "0")}_male.mp3`;
    const result = await get(pathname, { access: "private", useCache: false });

    if (!result) {
        return NextResponse.json({ error: "Audio was not found." }, { status: 404 });
    }

    return new Response(result.stream, {
        headers: {
            "Content-Type": result.blob.contentType || "audio/mpeg",
            "Cache-Control": "private, no-store",
        },
    });
}
