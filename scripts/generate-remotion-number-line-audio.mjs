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
    ein: "ein",
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
    elf: "elf",
    zwoelf: "zwölf",
    uhr: "Uhr",
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
    einundzwanzig: "einundzwanzig",
    zweiundzwanzig: "zweiundzwanzig",
    dreiundzwanzig: "dreiundzwanzig",
    fuenfundzwanzig: "fünfundzwanzig",
    dreissig: "dreissig",
    fuenfunddreissig: "fünfunddreissig",
    vierzig: "vierzig",
    fuenfundvierzig: "fünfundvierzig",
    fuenfzig: "fünfzig",
    fuenfundfuenfzig: "fünfundfünfzig",
    "uhr-informal-1200": "Punkt zwölf",
    "uhr-informal-1205": "fünf nach zwölf",
    "uhr-informal-1210": "zehn nach zwölf",
    "uhr-informal-1215": "Viertel nach zwölf",
    "uhr-informal-1220": "zwanzig nach zwölf",
    "uhr-informal-1225": "fünf vor halb eins",
    "uhr-informal-1230": "halb eins",
    "uhr-informal-1235": "fünf nach halb eins",
    "uhr-informal-1240": "zwanzig vor eins",
    "uhr-informal-1245": "Viertel vor eins",
    "uhr-informal-1250": "zehn vor eins",
    "uhr-informal-1255": "fünf vor eins",
    "uhr-informal-1300": "Punkt eins",
    "hundert-prozent": "hundert Prozent",
    "fuenfzig-prozent": "fünfzig Prozent",
    "fuenfundzwanzig-prozent": "fünfundzwanzig Prozent",
};

const informalHourWords = {
    1: "eins",
    2: "zwei",
    3: "drei",
    4: "vier",
    5: "fünf",
    6: "sechs",
    7: "sieben",
    8: "acht",
    9: "neun",
    10: "zehn",
    11: "elf",
    12: "zwölf",
};
const informalMinutePhrases = {
    0: ({ current }) => `Punkt ${current}`,
    5: ({ current }) => `fünf nach ${current}`,
    10: ({ current }) => `zehn nach ${current}`,
    15: ({ current }) => `Viertel nach ${current}`,
    20: ({ current }) => `zwanzig nach ${current}`,
    25: ({ next }) => `fünf vor halb ${next}`,
    30: ({ next }) => `halb ${next}`,
    35: ({ next }) => `fünf nach halb ${next}`,
    40: ({ next }) => `zwanzig vor ${next}`,
    45: ({ next }) => `Viertel vor ${next}`,
    50: ({ next }) => `zehn vor ${next}`,
    55: ({ next }) => `fünf vor ${next}`,
};

for (let hour = 1; hour <= 11; hour++) {
    const nextHour = hour === 11 ? 12 : hour + 1;
    for (const [minute, createText] of Object.entries(informalMinutePhrases)) {
        const fileName = `uhr-informal-${String(hour).padStart(2, "0")}${minute.padStart(2, "0")}`;
        clips[fileName] = createText({
            current: informalHourWords[hour],
            next: informalHourWords[nextHour],
        });
    }
}

const outputDirectory = path.resolve("public/remotion/number-line-audio");
await mkdir(outputDirectory, { recursive: true });

const requestedClips = process.argv.slice(2);
const generateInformalHours = requestedClips.includes("informal-hours");
const selectedClips =
    generateInformalHours
        ? Object.entries(clips).filter(([fileName]) => /^uhr-informal-\d{4}$/.test(fileName))
        : requestedClips.length > 0
        ? Object.entries(clips).filter(([fileName]) => requestedClips.includes(fileName))
        : Object.entries(clips);

if (!generateInformalHours && requestedClips.length > 0 && selectedClips.length !== requestedClips.length) {
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
