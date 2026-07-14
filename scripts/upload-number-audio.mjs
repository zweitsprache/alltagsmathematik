import { readFile } from "node:fs/promises";
import { put } from "@vercel/blob";

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
const blobToken = env.BLOB_READ_WRITE_TOKEN;

if (!blobToken) throw new Error("BLOB_READ_WRITE_TOKEN is missing.");

for (let number = 11; number <= 24; number++) {
    const filename = `${String(number).padStart(4, "0")}_male.mp3`;
    const audio = await readFile(`/tmp/${filename}`);
    const pathname = `audio_zahlen/male/${filename}`;

    await put(pathname, audio, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "audio/mpeg",
        token: blobToken,
    });

    console.log(`Uploaded ${pathname} (${audio.length} bytes)`);
}
