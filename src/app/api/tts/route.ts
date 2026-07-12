import { NextResponse } from "next/server";

const synthesisUrl = "https://api.inworld.ai/tts/v1/voice";
const maxTextLength = 2000;

type TtsRequest = {
    text?: unknown;
    voiceId?: unknown;
};

export async function POST(request: Request) {
    const apiKey = process.env.INWORLD_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "INWORLD_API_KEY is not configured." }, { status: 503 });
    }

    let body: TtsRequest;
    try {
        body = (await request.json()) as TtsRequest;
    } catch {
        return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }

    const text = typeof body.text === "string" ? body.text.trim() : "";
    const requestedVoice = typeof body.voiceId === "string" ? body.voiceId.trim() : "";
    const voiceId = requestedVoice || process.env.INWORLD_TTS_VOICE_ID || "Matthias";

    if (!text) return NextResponse.json({ error: "Text is required." }, { status: 400 });
    if (text.length > maxTextLength) {
        return NextResponse.json({ error: `Text must not exceed ${maxTextLength} characters.` }, { status: 400 });
    }

    const response = await fetch(synthesisUrl, {
        method: "POST",
        headers: {
            Authorization: `Basic ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
            voiceId,
            modelId: "inworld-tts-2",
            language: "de-DE",
            audioConfig: {
                audioEncoding: "MP3",
                sampleRateHertz: 48000,
            },
            deliveryMode: "BALANCED",
            applyTextNormalization: "ON",
        }),
    });

    if (!response.ok) {
        const details = await response.text();
        console.error("Inworld TTS request failed", response.status, details);
        return NextResponse.json({ error: "Inworld could not generate speech." }, { status: response.status });
    }

    const result = (await response.json()) as { audioContent?: string };
    if (!result.audioContent) {
        return NextResponse.json({ error: "Inworld returned no audio." }, { status: 502 });
    }

    return new Response(Buffer.from(result.audioContent, "base64"), {
        headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "private, no-store",
        },
    });
}
