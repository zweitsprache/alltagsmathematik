import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAudioCatalogAsset } from "@/lib/audio-catalog";
import { getDb } from "@/lib/db";

const synthesisUrl = "https://api.inworld.ai/tts/v1/voice";

export async function POST(request: Request) {
    const body = await request.json().catch(() => null) as { blobPath?: unknown; text?: unknown } | null;
    const blobPath = typeof body?.blobPath === "string" ? body.blobPath : "";
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!getAudioCatalogAsset(blobPath)) return NextResponse.json({ error: "Unknown audio asset." }, { status: 400 });
    if (!text || text.length > 1800) return NextResponse.json({ error: "Text must contain between 1 and 1800 characters." }, { status: 400 });

    const apiKey = process.env.INWORLD_API_KEY;
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!apiKey || !blobToken) return NextResponse.json({ error: "TTS or Blob credentials are not configured." }, { status: 503 });
    const voiceId = process.env.INWORLD_TTS_VOICE_ID || "Matthias";
    const instruction = process.env.INWORLD_TTS_INSTRUCTION || "well-pronounced and much slower than native";

    const response = await fetch(synthesisUrl, {
        method: "POST",
        headers: { Authorization: `Basic ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: `[${instruction}]${text}`, voiceId, modelId: "inworld-tts-2", language: "de-DE", audioConfig: { audioEncoding: "MP3", sampleRateHertz: 48000 }, deliveryMode: "BALANCED", applyTextNormalization: "ON" }),
    });
    if (!response.ok) {
        console.error("Audio regeneration failed", response.status, await response.text());
        return NextResponse.json({ error: "Inworld could not generate the audio." }, { status: 502 });
    }
    const result = await response.json() as { audioContent?: string };
    const audio = Buffer.from(result.audioContent || "", "base64");
    if (!audio.length) return NextResponse.json({ error: "Inworld returned no audio." }, { status: 502 });

    await put(blobPath, audio, { access: "private", addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60, contentType: "audio/mpeg", token: blobToken });
    const sql = getDb();
    await sql`
        INSERT INTO audio_assets (blob_path, generation_text, voice_id, instruction, updated_at)
        VALUES (${blobPath}, ${text}, ${voiceId}, ${instruction}, NOW())
        ON CONFLICT (blob_path) DO UPDATE SET
            generation_text = EXCLUDED.generation_text,
            voice_id = EXCLUDED.voice_id,
            instruction = EXCLUDED.instruction,
            updated_at = NOW()
    `;
    return NextResponse.json({ ok: true, updatedAt: new Date().toISOString() });
}
