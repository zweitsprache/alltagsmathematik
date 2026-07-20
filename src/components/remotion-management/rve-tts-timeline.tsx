"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/base/buttons/button";
import type { VideoTtsItem } from "@/lib/video-tts";

type Props = {
    compositionId: string;
    durationInFrames: number;
    fps: number;
    currentFrame: number;
    onFrameChange: (frame: number) => void;
    onItemsChange: (items: VideoTtsItem[]) => void;
};

type DragState = {
    itemId: string;
    mode: "move" | "resize-start" | "resize-end";
    pointerStart: number;
    originalFrom: number;
    originalDuration: number;
};

const minimumFrames = 3;
const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

const getAudioDuration = (url: string) =>
    new Promise<number>((resolve, reject) => {
        const audio = new Audio();
        audio.preload = "metadata";
        audio.onloadedmetadata = () => resolve(audio.duration);
        audio.onerror = () => reject(new Error("Die Audiodauer konnte nicht gelesen werden."));
        audio.src = url;
    });

const getAudioSrc = (item: VideoTtsItem) => `/api/admin/videos/tts?blobPath=${encodeURIComponent(item.blobPath)}`;

const readJsonResponse = async <Result,>(response: Response): Promise<Result> => {
    const body = await response.text();
    if (!body) throw new Error(`Der Server hat leer geantwortet (HTTP ${response.status}).`);
    try {
        return JSON.parse(body) as Result;
    } catch {
        throw new Error(`Der Server hat eine ungültige Antwort gesendet (HTTP ${response.status}).`);
    }
};

export const RveTtsTimeline = ({ compositionId, durationInFrames, fps, currentFrame, onFrameChange, onItemsChange }: Props) => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const isScrubbingRef = useRef(false);
    const [items, setItems] = useState<VideoTtsItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [text, setText] = useState("");
    const [voiceId, setVoiceId] = useState("Matthias");
    const [instruction, setInstruction] = useState("well-pronounced and much slower than native");
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
    const [error, setError] = useState<string | null>(null);
    const [drag, setDrag] = useState<DragState | null>(null);
    const loadedCompositionRef = useRef<string | null>(null);

    const durationSeconds = durationInFrames / fps;
    const selected = items.find((item) => item.id === selectedId) ?? null;

    const seekFromPointer = (clientX: number) => {
        const bounds = timelineRef.current?.getBoundingClientRect();
        if (!bounds) return;
        onFrameChange(clamp(Math.round(((clientX - bounds.left) / bounds.width) * durationInFrames), 0, durationInFrames - 1));
    };

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setError(null);
        loadedCompositionRef.current = null;
        void fetch(`/api/admin/videos/timeline?compositionId=${encodeURIComponent(compositionId)}`)
            .then(async (response) => {
                const result = await readJsonResponse<{ ttsItems?: VideoTtsItem[]; error?: string }>(response);
                if (!response.ok) throw new Error(result.error || "Die Timeline konnte nicht geladen werden.");
                if (cancelled) return;
                const nextItems = result.ttsItems ?? [];
                setItems(nextItems);
                setSelectedId(null);
                loadedCompositionRef.current = compositionId;
            })
            .catch((loadError) => {
                if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Die Timeline konnte nicht geladen werden.");
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [compositionId, onItemsChange]);

    useEffect(() => {
        onItemsChange(items);
    }, [items, onItemsChange]);

    useEffect(() => {
        if (loadedCompositionRef.current !== compositionId) return;
        setSaveState("saving");
        const timeout = setTimeout(() => {
            void fetch("/api/admin/videos/timeline", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ compositionId, ttsItems: items }),
            })
                .then(async (response) => {
                    const result = await readJsonResponse<{ error?: string }>(response);
                    if (!response.ok) throw new Error(result.error || "Die Timeline konnte nicht gespeichert werden.");
                    setSaveState("saved");
                })
                .catch((saveError) => {
                    setSaveState("error");
                    setError(saveError instanceof Error ? saveError.message : "Die Timeline konnte nicht gespeichert werden.");
                });
        }, 600);
        return () => clearTimeout(timeout);
    }, [compositionId, items]);

    const setTimelineItems = (updater: (current: VideoTtsItem[]) => VideoTtsItem[]) => {
        setItems(updater);
    };

    useEffect(() => {
        if (!drag) return;
        const handleMove = (event: PointerEvent) => {
            const width = timelineRef.current?.clientWidth ?? 1;
            const deltaFrames = Math.round(((event.clientX - drag.pointerStart) / width) * durationInFrames);
            setTimelineItems((current) =>
                current.map((item) => {
                    if (item.id !== drag.itemId) return item;
                    if (drag.mode === "move") {
                        return {
                            ...item,
                            from: clamp(drag.originalFrom + deltaFrames, 0, durationInFrames - item.durationInFrames),
                        };
                    }
                    if (drag.mode === "resize-start") {
                        const end = drag.originalFrom + drag.originalDuration;
                        const from = clamp(drag.originalFrom + deltaFrames, 0, end - minimumFrames);
                        return { ...item, from, durationInFrames: end - from };
                    }
                    const duration = clamp(drag.originalDuration + deltaFrames, minimumFrames, durationInFrames - drag.originalFrom);
                    return { ...item, durationInFrames: duration };
                }),
            );
        };
        const handleUp = () => setDrag(null);
        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp, { once: true });
        return () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
        };
    }, [drag, durationInFrames]);

    const generate = async () => {
        if (!text.trim()) return;
        setIsGenerating(true);
        setError(null);
        try {
            const response = await fetch("/api/admin/videos/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, voiceId, instruction }),
            });
            const result = await readJsonResponse<{
                id?: string;
                blobPath?: string;
                text?: string;
                voiceId?: string;
                instruction?: string;
                error?: string;
            }>(response);
            if (!response.ok || !result.id || !result.blobPath) {
                throw new Error(result.error || "Die Sprache konnte nicht erzeugt werden.");
            }
            const blobPath = result.blobPath;
            const audioDuration = await getAudioDuration(`/api/admin/videos/tts?blobPath=${encodeURIComponent(blobPath)}`);
            const duration = Math.max(minimumFrames, Math.ceil(audioDuration * fps));
            const from = clamp(currentFrame, 0, Math.max(0, durationInFrames - duration));
            const item: VideoTtsItem = {
                id: result.id,
                text: result.text ?? text.trim(),
                voiceId: result.voiceId ?? voiceId,
                instruction: result.instruction ?? instruction,
                from,
                durationInFrames: Math.min(duration, durationInFrames - from),
                blobPath,
            };
            setTimelineItems((current) => [...current, item]);
            setSelectedId(item.id);
            setText("");
        } catch (generationError) {
            setError(generationError instanceof Error ? generationError.message : "Die Sprache konnte nicht erzeugt werden.");
        } finally {
            setIsGenerating(false);
        }
    };

    const ticks = useMemo(() => {
        const interval = durationSeconds <= 60 ? 5 : 10;
        return Array.from({ length: Math.floor(durationSeconds / interval) + 1 }, (_, index) => index * interval);
    }, [durationSeconds]);

    return (
        <div className="mt-4 rounded-lg bg-primary p-4 ring-1 ring-secondary">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-primary">RVE TTS-Timeline</h2>
                    <p className="mt-1 text-sm text-tertiary">Setze den Abspielkopf, erfasse den Text und erzeuge einen verschiebbaren Sprachbaustein.</p>
                </div>
                <span className={`text-xs font-medium ${saveState === "error" ? "text-error-primary" : "text-tertiary"}`}>
                    {isLoading ? "Wird geladen…" : saveState === "saving" ? "Wird gespeichert…" : saveState === "error" ? "Nicht gespeichert" : "Gespeichert"}
                </span>
            </div>

            {error && (
                <p role="alert" className="mt-3 rounded-md bg-error-primary px-3 py-2 text-sm text-error-primary">
                    {error}
                </p>
            )}

            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem]">
                <label className="text-sm font-medium text-secondary">
                    Sprechtext
                    <textarea
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        rows={3}
                        maxLength={1800}
                        className="mt-1.5 w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary outline-focus-ring"
                    />
                </label>
                <div className="grid gap-3">
                    <label className="text-sm font-medium text-secondary">
                        Stimme
                        <input
                            value={voiceId}
                            onChange={(event) => setVoiceId(event.target.value)}
                            className="mt-1.5 w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary outline-focus-ring"
                        />
                    </label>
                    <Button size="sm" color="primary" isLoading={isGenerating} showTextWhileLoading onClick={generate}>
                        TTS bei {(currentFrame / fps).toFixed(2)} s erzeugen
                    </Button>
                </div>
            </div>
            <label className="mt-3 block text-sm font-medium text-secondary">
                Sprechanweisung
                <input
                    value={instruction}
                    onChange={(event) => setInstruction(event.target.value)}
                    maxLength={200}
                    className="mt-1.5 w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary outline-focus-ring"
                />
            </label>

            <div className="mt-5 overflow-hidden rounded-lg border border-secondary bg-secondary">
                <div className="grid grid-cols-[9rem_minmax(0,1fr)] border-b border-secondary bg-primary">
                    <div className="border-r border-secondary px-3 py-2 text-xs font-semibold text-secondary">Zeit</div>
                    <div className="relative h-8">
                        {ticks.map((second) => (
                            <span key={second} className="absolute top-1 text-[10px] text-tertiary" style={{ left: `${(second / durationSeconds) * 100}%` }}>
                                {second}s
                            </span>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-[9rem_minmax(0,1fr)]">
                    <div className="grid grid-rows-2 border-r border-secondary bg-primary">
                        <div className="flex items-center border-b border-secondary px-3 text-xs font-semibold text-secondary">Animation 🔒</div>
                        <div className="flex items-center px-3 text-xs font-semibold text-secondary">TTS</div>
                    </div>
                    <div
                        ref={timelineRef}
                        className="relative h-24 cursor-default touch-none select-none"
                        onPointerDown={(event) => {
                            if (event.button !== 0) return;
                            isScrubbingRef.current = true;
                            event.currentTarget.setPointerCapture(event.pointerId);
                            seekFromPointer(event.clientX);
                        }}
                        onPointerMove={(event) => {
                            if (isScrubbingRef.current) seekFromPointer(event.clientX);
                        }}
                        onPointerUp={(event) => {
                            isScrubbingRef.current = false;
                            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                                event.currentTarget.releasePointerCapture(event.pointerId);
                            }
                        }}
                        onPointerCancel={() => {
                            isScrubbingRef.current = false;
                        }}
                    >
                        <div
                            className="pointer-events-none absolute inset-y-0 z-30 w-0.5 bg-red-600"
                            style={{ left: `${(currentFrame / durationInFrames) * 100}%` }}
                        >
                            <span className="absolute -top-1 -left-1.5 size-3 rotate-45 bg-red-600" />
                        </div>
                        <div className="absolute inset-x-2 top-2 flex h-8 items-center rounded-md border border-gray-400 bg-gray-300 px-3 text-xs font-semibold text-gray-800">
                            RuleOfThreeShampoo · {durationSeconds.toFixed(1)} s · gesperrt
                        </div>
                        <div className="absolute inset-x-0 bottom-2 h-10 border-t border-secondary pt-1">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    title={item.text}
                                    className={`absolute top-0 flex h-9 cursor-grab items-center overflow-hidden rounded border px-2 text-xs font-semibold text-white ${
                                        selectedId === item.id ? "border-white bg-brand-solid ring-2 ring-brand" : "border-brand-solid bg-brand-solid"
                                    }`}
                                    style={{
                                        left: `${(item.from / durationInFrames) * 100}%`,
                                        width: `${(item.durationInFrames / durationInFrames) * 100}%`,
                                        minWidth: 12,
                                    }}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setSelectedId(item.id);
                                        onFrameChange(item.from);
                                    }}
                                    onPointerDown={(event) => {
                                        event.stopPropagation();
                                        setDrag({
                                            itemId: item.id,
                                            mode: "move",
                                            pointerStart: event.clientX,
                                            originalFrom: item.from,
                                            originalDuration: item.durationInFrames,
                                        });
                                    }}
                                >
                                    <button
                                        type="button"
                                        aria-label="Start verschieben"
                                        className="absolute inset-y-0 left-0 w-2 cursor-ew-resize"
                                        onPointerDown={(event) => {
                                            event.stopPropagation();
                                            setDrag({
                                                itemId: item.id,
                                                mode: "resize-start",
                                                pointerStart: event.clientX,
                                                originalFrom: item.from,
                                                originalDuration: item.durationInFrames,
                                            });
                                        }}
                                    />
                                    <span className="truncate">{item.text}</span>
                                    <button
                                        type="button"
                                        aria-label="Ende verschieben"
                                        className="absolute inset-y-0 right-0 w-2 cursor-ew-resize"
                                        onPointerDown={(event) => {
                                            event.stopPropagation();
                                            setDrag({
                                                itemId: item.id,
                                                mode: "resize-end",
                                                pointerStart: event.clientX,
                                                originalFrom: item.from,
                                                originalDuration: item.durationInFrames,
                                            });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {selected && (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-md bg-secondary px-3 py-2 text-sm text-secondary">
                    <audio src={getAudioSrc(selected)} controls className="h-8 max-w-full" />
                    <span className="tabular-nums">
                        Frame {selected.from} · {(selected.durationInFrames / fps).toFixed(2)} s
                    </span>
                    <button
                        type="button"
                        className="ml-auto font-semibold text-error-primary"
                        onClick={() => {
                            setTimelineItems((current) => current.filter((item) => item.id !== selected.id));
                            setSelectedId(null);
                        }}
                    >
                        Löschen
                    </button>
                </div>
            )}
        </div>
    );
};
