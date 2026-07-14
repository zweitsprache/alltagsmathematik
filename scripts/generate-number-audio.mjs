import { readFile } from "node:fs/promises";
import { put } from "@vercel/blob";

const words = new Map([
    [11, "elf"],
    [12, "zwölf"],
    [13, "dreizehn"],
    [14, "vierzehn"],
    [15, "fünfzehn"],
    [16, "sechzehn"],
    [17, "siebzehn"],
    [18, "achtzehn"],
    [19, "neunzehn"],
    [20, "zwanzig"],
    [21, "einundzwanzig"],
    [22, "zweiundzwanzig"],
    [23, "dreiundzwanzig"],
    [24, "vierundzwanzig"],
    [25, "fünfundzwanzig"],
    [26, "sechsundzwanzig"],
    [27, "siebenundzwanzig"],
    [28, "achtundzwanzig"],
    [29, "neunundzwanzig"],
    [30, "dreissig"],
    [31, "einunddreissig"],
    [32, "zweiunddreissig"],
    [33, "dreiunddreissig"],
    [34, "vierunddreissig"],
    [35, "fünfunddreissig"],
    [36, "sechsunddreissig"],
    [37, "siebenunddreissig"],
    [38, "achtunddreissig"],
    [39, "neununddreissig"],
    [40, "vierzig"],
    [50, "fünfzig"],
    [60, "sechzig"],
    [70, "siebzig"],
    [80, "achtzig"],
    [90, "neunzig"],
    [100, "hundert"],
]);

const tens = new Map([
    [20, "zwanzig"],
    [30, "dreissig"],
    [40, "vierzig"],
    [50, "fünfzig"],
    [60, "sechzig"],
    [70, "siebzig"],
    [80, "achtzig"],
    [90, "neunzig"],
]);
const compoundOnes = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];

for (let number = 32; number < 100; number++) {
    if (words.has(number)) continue;
    const ten = Math.floor(number / 10) * 10;
    const one = number % 10;
    words.set(number, one === 0 ? tens.get(ten) : `${compoundOnes[one]}und${tens.get(ten)}`);
}

const smallWords = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn"];
const wordBelowHundred = (number) => {
    if (number <= 10) return smallWords[number];
    if (words.has(number)) return words.get(number);
    const ten = Math.floor(number / 10) * 10;
    const one = number % 10;
    return one === 0 ? tens.get(ten) : `${compoundOnes[one]}und${tens.get(ten)}`;
};

for (let number = 101; number < 1000; number++) {
    const hundreds = Math.floor(number / 100);
    const remainder = number % 100;
    const prefix = hundreds === 1 ? "" : compoundOnes[hundreds];
    words.set(number, `${prefix}hundert${remainder === 0 ? "" : wordBelowHundred(remainder)}`);
}
words.set(1000, "tausend");

const parseEnvFile = (source) => Object.fromEntries(
    source
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => {
            const separator = line.indexOf("=");
            const key = line.slice(0, separator);
            let value = line.slice(separator + 1).trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            return [key, value];
        }),
);

const env = { ...parseEnvFile(await readFile(".env.local", "utf8")), ...process.env };
const apiKey = env.INWORLD_API_KEY;
const blobToken = env.BLOB_READ_WRITE_TOKEN;
const voiceId = env.INWORLD_TTS_VOICE_ID || "Matthias";
const instruction = env.INWORLD_TTS_INSTRUCTION || "well-pronounced and much slower than native";

if (!apiKey) throw new Error("INWORLD_API_KEY is missing.");
if (!blobToken) throw new Error("BLOB_READ_WRITE_TOKEN is missing.");

const requestedNumbers = process.argv.slice(2).flatMap((value) => {
    const match = value.match(/^(\d+)-(\d+)$/);
    if (!match) return [Number(value)];
    const start = Number(match[1]);
    const end = Number(match[2]);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
});
const selectedWords = requestedNumbers.length
    ? [...words].filter(([number]) => requestedNumbers.includes(number))
    : [...words];

if (requestedNumbers.some((number) => !words.has(number)) || selectedWords.length !== new Set(requestedNumbers).size) {
    throw new Error("One or more requested numbers are not configured.");
}

const generate = async ([number, word]) => {
    const response = await fetch("https://api.inworld.ai/tts/v1/voice", {
        method: "POST",
        headers: {
            Authorization: `Basic ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: `[${instruction}]${word}`,
            voiceId,
            modelId: "inworld-tts-2",
            language: "de-DE",
            audioConfig: { audioEncoding: "MP3", sampleRateHertz: 48000 },
            deliveryMode: "BALANCED",
            applyTextNormalization: "ON",
        }),
    });

    if (!response.ok) throw new Error(`Inworld failed for ${number}: ${response.status} ${await response.text()}`);

    const result = await response.json();
    const audio = Buffer.from(result.audioContent || "", "base64");
    if (audio.length < 4) throw new Error(`Inworld returned no audio for ${number}.`);

    const filename = `${String(number).padStart(4, "0")}_male.mp3`;
    const pathname = `audio_zahlen/male/${filename}`;
    await put(pathname, audio, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "audio/mpeg",
        token: blobToken,
    });
    console.log(`Uploaded ${pathname} (${audio.length} bytes)`);
};

const concurrency = Math.max(1, Math.min(8, Number(env.INWORLD_TTS_CONCURRENCY || 4)));
let cursor = 0;
await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < selectedWords.length) {
        const item = selectedWords[cursor++];
        await generate(item);
    }
}));
