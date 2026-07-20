import { mkdir, readFile, writeFile } from "node:fs/promises";

const lines = [
    "Du kennst das sicher:",
    "Irgendwann ist die Shampoo-Flasche leer.",
    "Auch der letzte Tropfen ist weg.",
    "Also:",
    "Ab in den Supermarkt.",
    "Dort gibt es verschiedene Packungen:",
    "eine einzelne Flasche,",
    "ein Duo-Pack mit zwei Flaschen,",
    "und eine Aktion mit drei Flaschen.",
    "Die einzelne Flasche kostet 4 Franken 50.",
    "Das Duo-Pack kostet 8 Franken 40.",
    "Die Aktion mit drei Flaschen kostet 11 Franken 70.",
    "Welches Angebot lohnt sich am meisten?",
    "Auf den ersten Blick ist das schwer zu sagen, denn die Packungen enthalten unterschiedlich viele Flaschen.",
    "Um sie zu vergleichen, brauchen wir eine gemeinsame Basis:",
    "den Preis für eine einzelne Flasche.",
    "Schritt eins:",
    "Wir schreiben auf, was wir wissen.",
    "Eine Flasche kostet 4 Franken 50.",
    "Zwei Flaschen kosten 8 Franken 40.",
    "Drei Flaschen kosten 11 Franken 70.",
    "Schritt zwei:",
    "Wir rechnen auf eine Einheit herunter.",
    "Wenn zwei Flaschen 8 Franken 40 kosten, dann kostet eine Flasche die Hälfte.",
    "Wir teilen also durch zwei:",
    "8 Franken 40 geteilt durch 2 ergibt 4 Franken 20.",
    "Eine Flasche im Duo-Pack kostet 4 Franken 20.",
    "Dasselbe machen wir mit der Aktion.",
    "Drei Flaschen kosten 11 Franken 70.",
    "Wir teilen durch drei:",
    "11 Franken 70 geteilt durch 3 ergibt 3 Franken 90.",
    "Eine Flasche in der Aktion kostet also 3 Franken 90.",
    "Jetzt können wir vergleichen:",
    "Die einzelne Flasche kostet 4 Franken 50.",
    "Im Duo-Pack kostet die Flasche 4 Franken 20.",
    "In der Aktion kostet die Flasche 3 Franken 90.",
    "Die Aktion ist tatsächlich das günstigste Angebot.",
    "Pro Flasche sparen wir 60 Rappen gegenüber dem Einzelkauf.",
];

const parseEnvFile = (source) =>
    Object.fromEntries(
        source
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith("#"))
            .map((line) => {
                const separator = line.indexOf("=");
                let value = line.slice(separator + 1).trim();
                if (
                    (value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))
                ) {
                    value = value.slice(1, -1);
                }
                return [line.slice(0, separator), value];
            }),
    );

const env = { ...parseEnvFile(await readFile(".env.local", "utf8")), ...process.env };
if (!env.INWORLD_API_KEY) throw new Error("INWORLD_API_KEY is missing.");

const outputDirectory = "public/remotion/dreisatz/shampoo";
await mkdir(outputDirectory, { recursive: true });

for (const [index, line] of lines.entries()) {
    const response = await fetch("https://api.inworld.ai/tts/v1/voice", {
        method: "POST",
        headers: {
            Authorization: `Basic ${env.INWORLD_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: `[deep, friendly explaining]${line}`,
            voiceId: "Omar",
            modelId: "inworld-tts-2",
            language: "de-DE",
            audioConfig: { audioEncoding: "MP3", sampleRateHertz: 48000 },
            deliveryMode: "BALANCED",
            applyTextNormalization: "ON",
        }),
    });

    if (!response.ok) {
        throw new Error(`Inworld failed for line ${index + 1}: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    const audio = Buffer.from(result.audioContent || "", "base64");
    if (audio.length === 0) throw new Error(`Inworld returned no audio for line ${index + 1}.`);

    const filename = `voiceover_${String(index + 1).padStart(2, "0")}.mp3`;
    await writeFile(`${outputDirectory}/${filename}`, audio);
    console.log(`Generated ${filename} (${audio.length} bytes)`);
}
