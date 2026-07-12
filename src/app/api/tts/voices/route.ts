import { NextResponse } from "next/server";

const voicesUrl = "https://api.inworld.ai/voices/v1/voices?languages=DE_DE&languages=de";

export async function GET() {
    const apiKey = process.env.INWORLD_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "INWORLD_API_KEY is not configured." }, { status: 503 });
    }

    const response = await fetch(voicesUrl, {
        headers: { Authorization: `Basic ${apiKey}` },
        cache: "no-store",
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Could not load Inworld voices." }, { status: response.status });
    }

    const data = (await response.json()) as { voices?: Array<{ voiceId?: string; name?: string; displayName?: string; langCode?: string }> };
    const voices = data.voices ?? [];
    const matthias = voices.find((voice) => [voice.voiceId, voice.name, voice.displayName].some((value) => value?.toLowerCase() === "matthias"));

    return NextResponse.json({ voices, matthias: matthias ?? null });
}
