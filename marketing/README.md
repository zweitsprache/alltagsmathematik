# Marketing captures

Only activities listed in `scripts/marketing-captures.mjs` are captured.

Start the app, then list or run captures:

```bash
npm run dev
npm run capture:list
npm run capture
npm run capture -- zahlen-sortieren
```

Use `format: "screenshot"`, `"video"`, or `"both"`. Screenshots are saved as PNG. Playwright records animations as WebM and the capture script also converts them to broadly compatible H.264 MP4 files using FFmpeg. Set `CAPTURE_BASE_URL` to capture a preview or production deployment instead of localhost.

MP4 videos default to a 1280 × 720 (16:9) white canvas. Override this per manifest entry with `videoOutput: { width, height }`.

For an animated scenario, add a `run(page, activity)` function to its manifest entry. It can click buttons, drag items, and wait between actions using Playwright locators.
