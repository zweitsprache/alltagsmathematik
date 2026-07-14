import "server-only";

import context0To10 from "@/content/context-number-audio.json";
import context11To24 from "@/content/context-number-audio-11-24.json";
import context25To31 from "@/content/context-number-audio-25-31.json";
import context30To100 from "@/content/context-number-audio-30-100.json";
import { curriculum, type CurriculumNode, type ExerciseConfig } from "@/content/curriculum";
import { numberSpeechExplainerVoiceovers } from "@/content/number-speech-explainer";
import { numberWords } from "@/content/number-words";

export type AudioCatalogAsset = { blobPath: string; text: string };
export type AudioCatalogGroup = { id: string; title: string; assets: AudioCatalogAsset[] };

const contextSources: Record<string, Array<Array<{ text: string; numbers: number[] }>>> = {
    a_01_01_11: context0To10,
    a_01_02_11: context11To24,
    a_01_03_11: context25To31,
    a_01_04_11: context30To100,
};

const numberAsset = (number: number): AudioCatalogAsset => ({
    blobPath: `audio_zahlen/male/${String(number).padStart(4, "0")}_male.mp3`,
    text: numberWords[number],
});

const numbersForExercise = (exercise: ExerciseConfig) => {
    if (exercise.type === "intro") return exercise.values ?? Array.from({ length: (exercise.max ?? 10) - (exercise.min ?? 0) + 1 }, (_, index) => (exercise.min ?? 0) + index);
    if (["number-line-listen", "number-line-listen-pair", "number-word-choice-audio"].includes(exercise.type)) {
        const min = exercise.min ?? 0;
        const max = exercise.max ?? 10;
        return Array.from({ length: max - min + 1 }, (_, index) => min + index);
    }
    return [];
};

const assetsForExercise = (exercise: ExerciseConfig): AudioCatalogAsset[] => {
    if (exercise.type === "number-speech-explainer") {
        return numberSpeechExplainerVoiceovers.map((text, index) => ({ blobPath: `audio_zahlen/explainers/a_01_04_01/slide_${String(index + 1).padStart(2, "0")}_male.mp3`, text }));
    }
    if (exercise.type === "context-number-listen" && exercise.contextId) {
        const source = contextSources[exercise.contextId]?.[Math.max(0, (exercise.setNumber ?? 1) - 1)] ?? [];
        return source.map((item, index) => ({
            blobPath: `audio_zahlen/context/${exercise.contextId}/${exercise.contextId}_context_${String(exercise.setNumber ?? 1).padStart(2, "0")}_${String(index + 1).padStart(2, "0")}_male.mp3`,
            text: item.text,
        }));
    }
    return numbersForExercise(exercise).map(numberAsset);
};

const walk = (nodes: CurriculumNode[], parentPath: string[] = []): AudioCatalogGroup[] => nodes.flatMap((node) => {
    const path = [...parentPath, node.slug];
    const children = walk(node.children ?? [], path);
    if (!node.exercises?.length) return children;
    const assets = node.exercises.flatMap(assetsForExercise);
    const unique = [...new Map(assets.map((asset) => [asset.blobPath, asset])).values()];
    return unique.length ? [{ id: path.join("/"), title: node.title, assets: unique }, ...children] : children;
});

export const getAudioCatalog = () => walk(curriculum);

export const getAudioCatalogAsset = (blobPath: string) => {
    for (const group of getAudioCatalog()) {
        const asset = group.assets.find((candidate) => candidate.blobPath === blobPath);
        if (asset) return asset;
    }
    return undefined;
};
