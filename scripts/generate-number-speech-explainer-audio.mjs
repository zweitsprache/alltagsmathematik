import { readFile } from "node:fs/promises";
import { put } from "@vercel/blob";

const voiceovers = [
    "Zweistellige Zahlen auf Deutsch sprechen.",
    "Im Deutschen sprechen wir zweistellige Zahlen rückwärts. Das heisst: Wir sagen zuerst die hintere Ziffer, die Einer, und dann die vordere Ziffer, die Zehner.",
    "Die Regel. Man liest die Zahl von rechts nach links: Einer, und, Zehner.",
    "Beispiel: Die Zahl 34. Zuerst die 4: vier. Dann das Wort und. Dann die 30: dreissig. Zusammen: vierunddreissig.",
    "Weitere Beispiele. 21 ist einundzwanzig. 56 ist sechsundfünfzig. 78 ist achtundsiebzig. 99 ist neunundneunzig.",
    "Achtung: Bei 21, 31, 41 und so weiter sagt man ein, nicht eins. Also: einundzwanzig.",
];

const parseEnvFile = (source) => Object.fromEntries(source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#")).map((line) => {
    const separator = line.indexOf("=");
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    return [line.slice(0, separator), value];
}));

const env = { ...parseEnvFile(await readFile(".env.local", "utf8")), ...process.env };
if (!env.INWORLD_API_KEY || !env.BLOB_READ_WRITE_TOKEN) throw new Error("Missing Inworld or Blob credentials.");
const instruction = env.INWORLD_TTS_INSTRUCTION || "well-pronounced and much slower than native";

for (const [index, text] of voiceovers.entries()) {
    const response = await fetch("https://api.inworld.ai/tts/v1/voice", {
        method: "POST",
        headers: { Authorization: `Basic ${env.INWORLD_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: `[${instruction}]${text}`, voiceId: env.INWORLD_TTS_VOICE_ID || "Matthias", modelId: "inworld-tts-2", language: "de-DE", audioConfig: { audioEncoding: "MP3", sampleRateHertz: 48000 }, deliveryMode: "BALANCED", applyTextNormalization: "ON" }),
    });
    if (!response.ok) throw new Error(`Inworld failed for slide ${index + 1}: ${response.status} ${await response.text()}`);
    const result = await response.json();
    const audio = Buffer.from(result.audioContent || "", "base64");
    const pathname = `audio_zahlen/explainers/a_01_04_01/slide_${String(index + 1).padStart(2, "0")}_male.mp3`;
    await put(pathname, audio, { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "audio/mpeg", token: env.BLOB_READ_WRITE_TOKEN });
    console.log(`Uploaded ${pathname} (${audio.length} bytes)`);
}
