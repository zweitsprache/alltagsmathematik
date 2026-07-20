import { get, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireVideoAdmin } from "@/lib/remotion-lambda";

export const runtime = "nodejs";

const synthesisUrl = "https://api.inworld.ai/tts/v1/voice";

export async function GET(request: Request) {
    const authorization = await requireVideoAdmin();
    if ("error" in authorization) {
        return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }
    const blobPath = new URL(request.url).searchParams.get("blobPath") ?? "";
    if (!/^video-tts\/[0-9a-f-]{36}\.mp3$/i.test(blobPath)) {
        return NextResponse.json({ error: "Invalid audio path." }, { status: 400 });
    }
    try {
        const result = await get(blobPath, { access: "private", useCache: true });
        if (!result) return NextResponse.json({ error: "Audio was not found." }, { status: 404 });
        return new Response(result.stream, {
            headers: {
                "Content-Type": result.blob.contentType || "audio/mpeg",
                "Content-Length": String(result.blob.size),
                "Cache-Control": "private, max-age=3600",
            },
        });
    } catch (error) {
        console.error("Video TTS audio could not be loaded", error);
        return NextResponse.json({ error: "Audio could not be loaded." }, { status: 502 });
    }
}

export async function POST(request: Request) {
    const authorization = await requireVideoAdmin();
    if ("error" in authorization) {
        return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const body = (await request.json().catch(() => null)) as {
        text?: unknown;
        voiceId?: unknown;
        instruction?: unknown;
    } | null;
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const voiceId =
        typeof body?.voiceId === "string" && body.voiceId.trim() ? body.voiceId.trim().slice(0, 80) : process.env.INWORLD_TTS_VOICE_ID || "Matthias";
    const instruction =
        typeof body?.instruction === "string" && body.instruction.trim()
            ? body.instruction.trim().slice(0, 200)
            : process.env.INWORLD_TTS_INSTRUCTION || "well-pronounced and much slower than native";

    if (!text || text.length > 1800) {
        return NextResponse.json({ error: "Text must contain between 1 and 1800 characters." }, { status: 400 });
    }
    if (instruction.includes("[") || instruction.includes("]")) {
        return NextResponse.json({ error: "Instruction must not contain square brackets." }, { status: 400 });
    }
    const apiKey = process.env.INWORLD_API_KEY;
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!apiKey || !blobToken) {
        return NextResponse.json({ error: "TTS or Blob credentials are not configured." }, { status: 503 });
    }

    try {
        const response = await fetch(synthesisUrl, {
            method: "POST",
            headers: { Authorization: `Basic ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                text: `[${instruction}]${text}`,
                voiceId,
                modelId: "inworld-tts-2",
                language: "de-DE",
                audioConfig: { audioEncoding: "MP3", sampleRateHertz: 48000 },
                deliveryMode: "BALANCED",
                applyTextNormalization: "ON",
            }),
        });
        if (!response.ok) {
            console.error("Video TTS generation failed", response.status, await response.text());
            return NextResponse.json({ error: "Inworld could not generate speech." }, { status: 502 });
        }

        const result = (await response.json()) as { audioContent?: string };
        const audio = Buffer.from(result.audioContent || "", "base64");
        if (!audio.length) return NextResponse.json({ error: "Inworld returned no audio." }, { status: 502 });

        const id = crypto.randomUUID();
        const blobPath = `video-tts/${id}.mp3`;
        await put(blobPath, audio, {
            access: "private",
            addRandomSuffix: false,
            contentType: "audio/mpeg",
            token: blobToken,
        });

        return NextResponse.json({ id, blobPath, text, voiceId, instruction });
    } catch (error) {
        console.error("Video TTS request failed", error);
        const message = error instanceof Error ? error.message : "Unknown TTS error";
        return NextResponse.json({ error: `Speech generation failed: ${message}` }, { status: 502 });
    }
}
