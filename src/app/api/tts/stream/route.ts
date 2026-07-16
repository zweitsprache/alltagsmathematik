import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

const synthesisUrl = "https://api.inworld.ai/tts/v1/voice:stream";
const maxTextLength = 2000;
const maxInstructionLength = 200;
const defaultInstruction = "well-pronounced and much slower than native";

type StreamRequest = { text?: unknown; voiceId?: unknown; instruction?: unknown; aligned?: unknown };

async function streamSpeech(request: Request, body: StreamRequest) {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const apiKey = process.env.INWORLD_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "INWORLD_API_KEY is not configured." }, { status: 503 });

    const text = typeof body.text === "string" ? body.text.trim() : "";
    const requestedInstruction = typeof body.instruction === "string" ? body.instruction.trim() : "";
    const instruction = requestedInstruction || process.env.INWORLD_TTS_INSTRUCTION || defaultInstruction;
    const requestedVoice = typeof body.voiceId === "string" ? body.voiceId.trim() : "";
    const voiceId = requestedVoice || process.env.INWORLD_TTS_VOICE_ID || "Matthias";
    const aligned = body.aligned === true;

    if (!text) return NextResponse.json({ error: "Text is required." }, { status: 400 });
    if (instruction.length > maxInstructionLength || instruction.includes("[") || instruction.includes("]")) {
        return NextResponse.json({ error: "Instruction is invalid." }, { status: 400 });
    }
    const steeredText = instruction ? `[${instruction}]${text}` : text;
    if (steeredText.length > maxTextLength) return NextResponse.json({ error: `Text must not exceed ${maxTextLength} characters.` }, { status: 400 });

    const upstream = await fetch(synthesisUrl, {
        method: "POST",
        headers: { Authorization: `Basic ${apiKey}`, "Content-Type": "application/json", Connection: "keep-alive" },
        body: JSON.stringify({
            text: steeredText,
            voiceId,
            modelId: "inworld-tts-2",
            language: "de-DE",
            audioConfig: { audioEncoding: "MP3", sampleRateHertz: 48000 },
            deliveryMode: "BALANCED",
            applyTextNormalization: "ON",
            ...(aligned ? { timestampType: "WORD", timestampTransportStrategy: "SYNC" } : {}),
        }),
        signal: request.signal,
    });

    if (!upstream.ok || !upstream.body) {
        const details = await upstream.text();
        console.error("Inworld streaming TTS failed", upstream.status, details);
        return NextResponse.json({ error: "Inworld could not stream speech." }, { status: upstream.status || 502 });
    }

    if (aligned) {
        const alignedStream = new ReadableStream<Uint8Array>({
            async start(controller) {
                const reader = upstream.body!.getReader();
                const decoder = new TextDecoder();
                const encoder = new TextEncoder();
                let pending = "";

                const enqueueLine = (line: string) => {
                    if (!line.trim()) return;
                    const chunk = JSON.parse(line) as { result?: { audioContent?: string; timestampInfo?: unknown } };
                    if (chunk.result?.audioContent || chunk.result?.timestampInfo) {
                        controller.enqueue(encoder.encode(`${JSON.stringify(chunk.result)}\n`));
                    }
                };

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        pending += decoder.decode(value, { stream: true });
                        const lines = pending.split(/\r?\n/);
                        pending = lines.pop() ?? "";
                        for (const line of lines) enqueueLine(line);
                    }
                    pending += decoder.decode();
                    enqueueLine(pending);
                    controller.close();
                } catch (error) {
                    controller.error(error);
                } finally {
                    reader.releaseLock();
                }
            },
            cancel() {
                void upstream.body?.cancel();
            },
        });

        return new Response(alignedStream, {
            headers: {
                "Content-Type": "application/x-ndjson",
                "Cache-Control": "private, no-store",
                "X-Content-Type-Options": "nosniff",
            },
        });
    }

    const audioStream = new ReadableStream<Uint8Array>({
        async start(controller) {
            const reader = upstream.body!.getReader();
            const decoder = new TextDecoder();
            let pending = "";

            const enqueueLine = (line: string) => {
                if (!line.trim()) return;
                const chunk = JSON.parse(line) as { audioContent?: string; result?: { audioContent?: string } };
                const audioContent = chunk.audioContent ?? chunk.result?.audioContent;
                if (audioContent) controller.enqueue(Uint8Array.from(Buffer.from(audioContent, "base64")));
            };

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    pending += decoder.decode(value, { stream: true });
                    const lines = pending.split(/\r?\n/);
                    pending = lines.pop() ?? "";
                    for (const line of lines) enqueueLine(line);
                }
                pending += decoder.decode();
                enqueueLine(pending);
                controller.close();
            } catch (error) {
                controller.error(error);
            } finally {
                reader.releaseLock();
            }
        },
        cancel() {
            void upstream.body?.cancel();
        },
    });

    return new Response(audioStream, {
        headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "private, no-store",
            "X-Content-Type-Options": "nosniff",
        },
    });
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    return streamSpeech(request, {
        text: url.searchParams.get("text"),
        voiceId: url.searchParams.get("voiceId"),
        instruction: url.searchParams.get("instruction"),
    });
}

export async function POST(request: Request) {
    let body: StreamRequest;
    try {
        body = await request.json() as StreamRequest;
    } catch {
        return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    return streamSpeech(request, body);
}
