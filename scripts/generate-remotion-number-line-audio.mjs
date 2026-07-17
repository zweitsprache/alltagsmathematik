import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const envPath = path.resolve(".env.local");
const envText = await readFile(envPath, "utf8");
for (const line of envText.split(/\r?\n/)) {
    if (!line || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
}

const apiKey = process.env.INWORLD_API_KEY;
if (!apiKey) throw new Error("INWORLD_API_KEY is missing from .env.local");

const clips = {
    null: "null",
    eins: "eins",
    zwei: "zwei",
    drei: "drei",
    vier: "vier",
    fuenf: "fünf",
    sechs: "sechs",
    sieben: "sieben",
    acht: "acht",
    neun: "neun",
    zehn: "zehn",
    "plus-eins": "plus eins",
    gleich: "gleich",
    dreizehn: "dreizehn",
    vierzehn: "vierzehn",
    fuenfzehn: "fünfzehn",
    sechzehn: "sechzehn",
    siebzehn: "siebzehn",
    achtzehn: "achtzehn",
    neunzehn: "neunzehn",
    zwanzig: "zwanzig",
    "hundert-prozent": "hundert Prozent",
    "fuenfzig-prozent": "fünfzig Prozent",
    "fuenfundzwanzig-prozent": "fünfundzwanzig Prozent",
};

const outputDirectory = path.resolve("public/remotion/number-line-audio");
await mkdir(outputDirectory, { recursive: true });

const requestedClips = process.argv.slice(2);
const selectedClips =
    requestedClips.length > 0
        ? Object.entries(clips).filter(([fileName]) => requestedClips.includes(fileName))
        : Object.entries(clips);

if (requestedClips.length > 0 && selectedClips.length !== requestedClips.length) {
    throw new Error(`Unknown clip name. Available clips: ${Object.keys(clips).join(", ")}`);
}

for (const [fileName, text] of selectedClips) {
    const response = await fetch("https://api.inworld.ai/tts/v1/voice", {
        method: "POST",
        headers: {
            Authorization: `Basic ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: `[${process.env.INWORLD_TTS_INSTRUCTION || "well-pronounced and much slower than native"}]${text}`,
            voiceId: process.env.INWORLD_TTS_VOICE_ID || "Matthias",
            modelId: "inworld-tts-2",
            language: "de-DE",
            audioConfig: { audioEncoding: "MP3", sampleRateHertz: 48000 },
            deliveryMode: "BALANCED",
            applyTextNormalization: "ON",
        }),
    });

    const body = await response.text();
    if (!response.ok) throw new Error(`Inworld failed for "${text}": ${response.status} ${body}`);
    const payload = JSON.parse(body);
    const audio = Buffer.from(payload.audioContent, "base64");
    await writeFile(path.join(outputDirectory, `${fileName}.mp3`), audio);
    console.log(`Generated ${fileName}.mp3 (${audio.length} bytes)`);
}
