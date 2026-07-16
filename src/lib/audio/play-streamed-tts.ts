const waitFor = (target: EventTarget, event: string, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
    const cleanup = () => {
        target.removeEventListener(event, resolveEvent);
        target.removeEventListener("error", rejectEvent);
        signal?.removeEventListener("abort", abort);
    };
    const resolveEvent = () => { cleanup(); resolve(); };
    const rejectEvent = () => { cleanup(); reject(new Error("Audio playback failed.")); };
    const abort = () => { cleanup(); reject(new DOMException("Aborted", "AbortError")); };
    target.addEventListener(event, resolveEvent, { once: true });
    target.addEventListener("error", rejectEvent, { once: true });
    signal?.addEventListener("abort", abort, { once: true });
});

export type PreparedStreamedTts = {
    play: (signal?: AbortSignal) => Promise<void>;
    dispose: () => void;
};

type WordAlignment = {
    words?: string[];
    wordStartTimeSeconds?: number[];
    wordEndTimeSeconds?: number[];
};

type AlignedChunk = {
    audioContent?: string;
    timestampInfo?: { wordAlignment?: WordAlignment };
};

const decodeBase64 = (value: string) => {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
    return bytes;
};

export const playAlignedStreamedTts = async (text: string, onActiveWord: (index: number | null) => void, signal?: AbortSignal) => {
    const response = await fetch("/api/tts/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, aligned: true }),
        signal,
    });
    if (!response.ok || !response.body) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error || "Aligned streaming audio could not be generated.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const chunks: Uint8Array[] = [];
    const timings: Array<{ index: number; start: number; end: number }> = [];
    let pending = "";
    let spokenIndex = 0;

    const consumeLine = (line: string) => {
        if (!line.trim()) return;
        const chunk = JSON.parse(line) as AlignedChunk;
        if (chunk.audioContent) chunks.push(decodeBase64(chunk.audioContent));
        const alignment = chunk.timestampInfo?.wordAlignment;
        alignment?.words?.forEach((word, index) => {
            const token = word.trim();
            if (!token || (token.startsWith("[") && token.endsWith("]"))) return;
            timings.push({
                index: spokenIndex++,
                start: alignment.wordStartTimeSeconds?.[index] ?? 0,
                end: alignment.wordEndTimeSeconds?.[index] ?? 0,
            });
        });
    };

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        pending += decoder.decode(value, { stream: true });
        const lines = pending.split(/\r?\n/);
        pending = lines.pop() ?? "";
        for (const line of lines) consumeLine(line);
    }
    pending += decoder.decode();
    consumeLine(pending);
    if (!chunks.length) throw new Error("Aligned streaming audio was empty.");

    const url = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: "audio/mpeg" }));
    const audio = new Audio(url);
    const abort = () => audio.pause();
    let animationFrame: number | null = null;
    const update = () => {
        const timing = timings.find(({ start, end }) => audio.currentTime >= start && audio.currentTime < end);
        onActiveWord(timing?.index ?? null);
        if (!audio.paused && !audio.ended) animationFrame = requestAnimationFrame(update);
    };
    signal?.addEventListener("abort", abort, { once: true });
    try {
        await audio.play();
        animationFrame = requestAnimationFrame(update);
        await waitFor(audio, "ended", signal);
    } finally {
        onActiveWord(null);
        signal?.removeEventListener("abort", abort);
        if (animationFrame !== null) cancelAnimationFrame(animationFrame);
        audio.pause();
        URL.revokeObjectURL(url);
    }
};

export const prepareStreamedTts = async (text: string, signal?: AbortSignal): Promise<PreparedStreamedTts> => {
    const response = await fetch("/api/tts/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal,
    });
    if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error || "Streaming audio could not be generated.");
    }

    const audioBlob = await response.blob();
    if (!audioBlob.size) throw new Error("Streaming audio was empty.");
    const url = URL.createObjectURL(audioBlob);

    return {
        play: async (playbackSignal) => {
            const audio = new Audio(url);
            const abort = () => audio.pause();
            playbackSignal?.addEventListener("abort", abort, { once: true });
            try {
                await audio.play();
                await waitFor(audio, "ended", playbackSignal);
            } finally {
                playbackSignal?.removeEventListener("abort", abort);
                audio.pause();
                audio.removeAttribute("src");
                audio.load();
            }
        },
        dispose: () => URL.revokeObjectURL(url),
    };
};

export const playStreamedTts = async (text: string, signal?: AbortSignal) => {
    const audio = new Audio(`/api/tts/stream?text=${encodeURIComponent(text)}`);
    const abort = () => audio.pause();
    signal?.addEventListener("abort", abort, { once: true });
    try {
        await audio.play();
        await waitFor(audio, "ended", signal);
    } finally {
        signal?.removeEventListener("abort", abort);
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
    }
};
