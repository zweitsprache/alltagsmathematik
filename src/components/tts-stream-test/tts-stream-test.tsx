"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Stop } from "@untitledui/icons";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";

type Status = "idle" | "connecting" | "streaming" | "complete" | "error";

const waitFor = (target: EventTarget, event: string) => new Promise<void>((resolve, reject) => {
    target.addEventListener(event, () => resolve(), { once: true });
    target.addEventListener("error", () => reject(new Error(`Media ${event} failed.`)), { once: true });
});

export const TtsStreamTest = () => {
    const [text, setText] = useState("Die Zahl vierunddreissig besteht aus vier Einern und drei Zehnern.");
    const [voiceId, setVoiceId] = useState("Matthias");
    const [instruction, setInstruction] = useState("well-pronounced and much slower than native");
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState("");
    const [chunks, setChunks] = useState(0);
    const [bytes, setBytes] = useState(0);
    const [firstAudioMs, setFirstAudioMs] = useState<number | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const objectUrlRef = useRef<string | null>(null);

    useEffect(() => () => {
        abortRef.current?.abort();
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    }, []);

    const stop = () => {
        abortRef.current?.abort();
        audioRef.current?.pause();
        setStatus("idle");
    };

    const start = async () => {
        abortRef.current?.abort();
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        const abortController = new AbortController();
        abortRef.current = abortController;
        setStatus("connecting");
        setError("");
        setChunks(0);
        setBytes(0);
        setFirstAudioMs(null);
        const startedAt = performance.now();

        try {
            const response = await fetch("/api/tts/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, voiceId, instruction }),
                signal: abortController.signal,
            });
            if (!response.ok || !response.body) {
                const result = await response.json().catch(() => ({ error: "Streaming request failed." })) as { error?: string };
                throw new Error(result.error || "Streaming request failed.");
            }

            const supportsMse = typeof MediaSource !== "undefined" && MediaSource.isTypeSupported("audio/mpeg");
            const mediaSource = supportsMse ? new MediaSource() : null;
            if (mediaSource && audioRef.current) {
                objectUrlRef.current = URL.createObjectURL(mediaSource);
                audioRef.current.src = objectUrlRef.current;
                await waitFor(mediaSource, "sourceopen");
            }
            const sourceBuffer = mediaSource?.addSourceBuffer("audio/mpeg") ?? null;
            const reader = response.body.getReader();
            const buffered: Uint8Array[] = [];
            let receivedBytes = 0;
            let receivedChunks = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (!value.length) continue;
                receivedChunks += 1;
                receivedBytes += value.length;
                setChunks(receivedChunks);
                setBytes(receivedBytes);
                if (receivedChunks === 1) {
                    setFirstAudioMs(Math.round(performance.now() - startedAt));
                    setStatus("streaming");
                }

                if (sourceBuffer) {
                    if (sourceBuffer.updating) await waitFor(sourceBuffer, "updateend");
                    sourceBuffer.appendBuffer(value.slice().buffer);
                    await waitFor(sourceBuffer, "updateend");
                    if (receivedChunks === 1) void audioRef.current?.play();
                } else {
                    buffered.push(value.slice());
                }
            }

            if (mediaSource?.readyState === "open") mediaSource.endOfStream();
            if (!sourceBuffer && audioRef.current) {
                const blob = new Blob(buffered as BlobPart[], { type: "audio/mpeg" });
                objectUrlRef.current = URL.createObjectURL(blob);
                audioRef.current.src = objectUrlRef.current;
                await audioRef.current.play();
            }
            setStatus("complete");
        } catch (streamError) {
            if (abortController.signal.aborted) return;
            setError(streamError instanceof Error ? streamError.message : "Streaming failed.");
            setStatus("error");
        }
    };

    const badge = status === "streaming" ? { color: "success" as const, label: "Streaming" }
        : status === "connecting" ? { color: "warning" as const, label: "Verbindung wird aufgebaut" }
            : status === "complete" ? { color: "success" as const, label: "Abgeschlossen" }
                : status === "error" ? { color: "error" as const, label: "Fehler" }
                    : { color: "gray" as const, label: "Bereit" };

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <div>
                <p className="text-sm font-semibold text-brand-secondary">Temporärer Test</p>
                <h1 className="mt-1 text-display-xs font-semibold text-primary">Inworld TTS Streaming</h1>
                <p className="mt-1 text-md text-tertiary">MP3-Audio wird während der Generierung übertragen und abgespielt.</p>
            </div>

            <div className="flex flex-col gap-5 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
                <TextArea label="Text" rows={5} value={text} onChange={setText} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input label="Stimme" value={voiceId} onChange={setVoiceId} />
                    <Input label="Anweisung" value={instruction} onChange={setInstruction} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary pt-5">
                    <BadgeWithDot color={badge.color}>{badge.label}</BadgeWithDot>
                    <div className="flex gap-3">
                        {(status === "connecting" || status === "streaming") && <Button color="secondary" iconLeading={Stop} onClick={stop}>Stoppen</Button>}
                        <Button color="primary" iconLeading={Play} onClick={start} isDisabled={!text.trim() || status === "connecting" || status === "streaming"}>Stream starten</Button>
                    </div>
                </div>
                {error && <p className="rounded-md bg-error-primary px-3 py-2 text-sm text-error-primary">{error}</p>}
                <audio ref={audioRef} controls className="w-full" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                    ["Erstes Audio", firstAudioMs === null ? "–" : `${firstAudioMs} ms`],
                    ["Chunks", chunks.toString()],
                    ["Übertragen", bytes ? `${(bytes / 1024).toFixed(1)} KB` : "–"],
                ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
                        <p className="text-sm text-tertiary">{label}</p>
                        <p className="mt-1 text-xl font-semibold text-primary tabular-nums">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
