/**
 * Only entries in this file are captured.
 *
 * Supported formats: "screenshot", "video", or "both".
 * `activity` is the one-based activity number on the page.
 * Add an optional `run(page)` function for clicks or drag-and-drop recordings.
 */
export const captures = [
    {
        name: "zahlen-bis-1000-vergleichen-01",
        path: "/kompetenzbereiche/zahlen-und-variablen/zahlen-benennen-und-schreiben/zahlen-bis-1000/zahlen-vergleichen",
        activity: 1,
        format: "video",
        viewport: { width: 1440, height: 900 },
        async run(page, activity) {
            await page.waitForTimeout(1400);

            for (let task = 0; task < 3; task++) {
                const options = activity.getByRole("button");
                const labels = await options.allTextContents();
                const counts = new Map();
                for (const label of labels) counts.set(label.trim(), (counts.get(label.trim()) ?? 0) + 1);
                const target = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

                for (let index = 0; index < labels.length; index++) {
                    if (labels[index].trim() === target) {
                        await options.nth(index).hover();
                        await page.waitForTimeout(550);
                        await options.nth(index).click();
                        await page.waitForTimeout(850);
                    }
                }

                await page.waitForTimeout(1500);
            }

            await page.waitForTimeout(1200);
        },
    },
    {
        name: "zahlen-bis-1000-zahlenstrahl-02",
        path: "/kompetenzbereiche/zahlen-und-variablen/zahlen-benennen-und-schreiben/zahlen-bis-1000/zahlenstrahl",
        activity: 2,
        format: "video",
        viewport: { width: 1440, height: 900 },
        async run(page, activity) {
            await page.waitForTimeout(1400);

            for (let task = 0; task < 3; task++) {
                const target = (await activity.locator("p.text-display-md").textContent())?.trim();
                if (!target) throw new Error("Could not read the presented number");

                const answer = activity.getByRole("button", { name: new RegExp(`\\b${target}\\b`) });
                await answer.hover();
                await page.waitForTimeout(900);
                await answer.click();
                await page.waitForTimeout(1800);
            }

            await page.waitForTimeout(1200);
        },
    },
];
