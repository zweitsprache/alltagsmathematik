export type VideoTtsItem = {
    id: string;
    text: string;
    voiceId: string;
    instruction: string;
    from: number;
    durationInFrames: number;
    blobPath: string;
};

const cleanString = (value: unknown, maximumLength: number) => (typeof value === "string" ? value.trim().slice(0, maximumLength) : "");

export const sanitizeVideoTtsItems = (value: unknown, maximumFrame = 100_000): VideoTtsItem[] => {
    if (!Array.isArray(value)) return [];

    return value.slice(0, 200).flatMap((candidate) => {
        if (!candidate || typeof candidate !== "object") return [];
        const item = candidate as Record<string, unknown>;
        const id = cleanString(item.id, 80);
        const text = cleanString(item.text, 1800);
        const voiceId = cleanString(item.voiceId, 80);
        const instruction = cleanString(item.instruction, 200);
        const blobPath = cleanString(item.blobPath, 200);
        const from = typeof item.from === "number" ? Math.round(item.from) : -1;
        const durationInFrames = typeof item.durationInFrames === "number" ? Math.round(item.durationInFrames) : 0;

        if (
            !id ||
            !text ||
            !voiceId ||
            !/^video-tts\/[0-9a-f-]{36}\.mp3$/i.test(blobPath) ||
            from < 0 ||
            from > maximumFrame ||
            durationInFrames < 1 ||
            durationInFrames > maximumFrame ||
            from + durationInFrames > maximumFrame
        ) {
            return [];
        }

        return [{ id, text, voiceId, instruction, blobPath, from, durationInFrames }];
    });
};
