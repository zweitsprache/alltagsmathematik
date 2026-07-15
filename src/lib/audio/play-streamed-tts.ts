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
