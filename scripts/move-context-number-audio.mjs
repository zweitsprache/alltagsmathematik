import { readFile } from "node:fs/promises";
import { rename } from "@vercel/blob";

const source = await readFile(".env.local", "utf8");
const env = Object.fromEntries(source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#")).map((line) => {
    const separator = line.indexOf("="); let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    return [line.slice(0, separator), value];
}));
const token = process.env.BLOB_READ_WRITE_TOKEN || env.BLOB_READ_WRITE_TOKEN;
if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is missing.");

for (let set = 1; set <= 5; set++) {
    for (let item = 1; item <= 9; item++) {
        const suffix = `${String(set).padStart(2,"0")}_${String(item).padStart(2,"0")}_male.mp3`;
        const from = `audio_zahlen/context/male/context_${suffix}`;
        const to = `audio_zahlen/context/a_01_01_11/a_01_01_11_context_${suffix}`;
        await rename(from, to, { access: "private", addRandomSuffix: false, allowOverwrite: true, token });
        console.log(`Moved ${from} -> ${to}`);
    }
}
