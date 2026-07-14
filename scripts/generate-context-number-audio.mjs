import { readFile } from "node:fs/promises";
import { put } from "@vercel/blob";

const parseEnvFile = (source) => Object.fromEntries(source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#")).map((line) => {
    const separator = line.indexOf("="); let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    return [line.slice(0, separator), value];
}));

const env = { ...parseEnvFile(await readFile(".env.local", "utf8")), ...process.env };
const contextId = process.argv[2] || "a_01_01_11";
const dataFile = process.argv[3] || "src/content/context-number-audio.json";
if (!/^a_01_0[1234]_11$/.test(contextId)) throw new Error("Unsupported context identifier.");
const sets = JSON.parse(await readFile(dataFile, "utf8"));
const instruction = env.INWORLD_TTS_INSTRUCTION || "well-pronounced and much slower than native";
if (!env.INWORLD_API_KEY || !env.BLOB_READ_WRITE_TOKEN) throw new Error("Missing Inworld or Blob credentials.");

for (const [setIndex, items] of sets.entries()) {
    for (const [itemIndex, item] of items.entries()) {
        const response = await fetch("https://api.inworld.ai/tts/v1/voice", {
            method: "POST",
            headers: { Authorization: `Basic ${env.INWORLD_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ text: `[${instruction}]${item.text}`, voiceId: env.INWORLD_TTS_VOICE_ID || "Matthias", modelId: "inworld-tts-2", language: "de-DE", audioConfig: { audioEncoding: "MP3", sampleRateHertz: 48000 }, deliveryMode: "BALANCED", applyTextNormalization: "ON" }),
        });
        if (!response.ok) throw new Error(`Inworld failed for ${setIndex + 1}/${itemIndex + 1}: ${response.status} ${await response.text()}`);
        const result = await response.json(); const audio = Buffer.from(result.audioContent || "", "base64");
        const pathname = `audio_zahlen/context/${contextId}/${contextId}_context_${String(setIndex + 1).padStart(2,"0")}_${String(itemIndex + 1).padStart(2,"0")}_male.mp3`;
        await put(pathname, audio, { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "audio/mpeg", token: env.BLOB_READ_WRITE_TOKEN });
        console.log(`Uploaded ${pathname} (${audio.length} bytes)`);
    }
}
