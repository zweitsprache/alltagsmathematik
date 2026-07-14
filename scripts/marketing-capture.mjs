import { mkdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { promisify } from "node:util";
import { chromium } from "playwright";
import { captures } from "./marketing-captures.mjs";

const args = process.argv.slice(2);
const listOnly = args.includes("--list");
const requestedNames = args.filter((arg) => !arg.startsWith("--"));
const selected = requestedNames.length ? captures.filter(({ name }) => requestedNames.includes(name)) : captures;
const baseUrl = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const outputRoot = path.resolve(process.env.CAPTURE_OUTPUT ?? "marketing");
const execFileAsync = promisify(execFile);

if (listOnly) {
    for (const capture of captures) console.log(`${capture.name}\t${capture.format}\t${capture.path}`);
    process.exit(0);
}

if (!selected.length) {
    console.error(`No matching capture found. Available: ${captures.map(({ name }) => name).join(", ")}`);
    process.exit(1);
}

await mkdir(path.join(outputRoot, "screenshots"), { recursive: true });
await mkdir(path.join(outputRoot, "videos"), { recursive: true });

for (const capture of selected) {
    const recordVideo = capture.format === "video" || capture.format === "both";
    const viewport = capture.viewport ?? { width: 1440, height: 900 };
    const videoOutput = capture.videoOutput ?? { width: 1280, height: 720 };
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport,
        colorScheme: "light",
        reducedMotion: "no-preference",
        ...(recordVideo ? { recordVideo: { dir: path.join(outputRoot, "videos"), size: viewport } } : {}),
    });
    const page = await context.newPage();
    const videoStartedAt = Date.now();
    const response = await page.goto(new URL(capture.path, baseUrl).toString(), { waitUntil: "networkidle" });
    if (!response?.ok()) throw new Error(`Could not load ${capture.path}: HTTP ${response?.status() ?? "unknown"}`);
    await page.evaluate(() => document.fonts.ready);

    if (capture.activity > 1) {
        const tab = page.getByRole("tab").nth(capture.activity - 1);
        if (await tab.count()) await tab.click();
    }

    const hook = page.locator(`[data-marketing-capture="activity-${capture.activity}"]`);
    await hook.waitFor({ state: "attached" });
    const activity = hook.locator(":scope > *").first();
    await activity.scrollIntoViewIfNeeded();

    let crop;
    if (recordVideo) {
        await page.evaluate(() => {
            const backdrop = document.createElement("div");
            backdrop.setAttribute("data-marketing-backdrop", "");
            Object.assign(backdrop.style, {
                position: "fixed",
                inset: "0",
                zIndex: "9998",
                background: "white",
            });
            document.body.append(backdrop);
        });
        await activity.evaluate((element) => {
            Object.assign(element.style, {
                position: "fixed",
                top: "4px",
                left: "4px",
                right: "auto",
                bottom: "auto",
                zIndex: "9999",
                margin: "0",
                width: "min(calc(100vw - 8px), 64rem)",
                height: "fit-content",
                background: "white",
            });
        });
        const box = await activity.boundingBox();
        if (!box) throw new Error(`Could not determine the bounds of activity ${capture.activity}`);
        const width = Math.floor(Math.min(viewport.width, box.width + 8) / 2) * 2;
        const height = Math.floor(Math.min(viewport.height, box.height + 8) / 2) * 2;
        crop = { x: 0, y: 0, width, height };
    }

    const videoTrimSeconds = Math.max(0, (Date.now() - videoStartedAt) / 1000);
    if (capture.run) await capture.run(page, activity);

    if (capture.format === "screenshot" || capture.format === "both") {
        await activity.screenshot({
            path: path.join(outputRoot, "screenshots", `${capture.name}.png`),
            animations: "disabled",
        });
    }

    const video = page.video();
    await context.close();
    if (video) {
        const webmPath = path.join(outputRoot, "videos", `${capture.name}.webm`);
        const mp4Path = path.join(outputRoot, "videos", `${capture.name}.mp4`);
        await video.saveAs(webmPath);
        const ffmpegArgs = ["-y", "-ss", videoTrimSeconds.toFixed(3), "-i", webmPath];
        if (crop) {
            ffmpegArgs.push(
                "-vf",
                `crop=${crop.width}:${crop.height}:${crop.x}:${crop.y},scale=${videoOutput.width}:${videoOutput.height}:force_original_aspect_ratio=decrease,pad=${videoOutput.width}:${videoOutput.height}:(ow-iw)/2:(oh-ih)/2:color=white,setsar=1`,
            );
        }
        ffmpegArgs.push("-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4Path);
        await execFileAsync("ffmpeg", ffmpegArgs);
    }
    await browser.close();
    console.log(`Captured ${capture.name}`);
}
