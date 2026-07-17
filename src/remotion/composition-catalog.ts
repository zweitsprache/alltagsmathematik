import { percentageWholeDuration } from "./compositions/percentage-whole";
import { timeCompositionDuration } from "./compositions/time";

export const compositionCatalog = [
    {
        id: "NumberLineZeroToTen",
        title: "Plus eins am Zahlenstrahl",
        curriculumLabel: "A.01.01 Zahlen von 0 bis 10",
        description: "Addition in Einerschritten von 0 + 1 bis 9 + 1.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: 3690,
        outputPath: "marketing/videos/a-01-01-number-line.mp4",
    },
    {
        id: "CountToTen",
        title: "Zählen bis 10",
        curriculumLabel: "A.01.01 Zahlen von 0 bis 10",
        description: "Zählanimation von 1 bis 10 mit drei unterschiedlichen Gruppen pro Zahl.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: 6720,
        outputPath: "marketing/videos/a-01-01-count-to-ten.mp4",
    },
    {
        id: "TwoDigitNumbers",
        title: "Zweistellige Zahlen",
        curriculumLabel: "A.01.04 Zahlen bis 100",
        description: "Ziffern und Zahlwörter von 13 bis 20 mit animierter Sprechreihenfolge.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: 1440,
        outputPath: "marketing/videos/a-01-04-two-digit-numbers.mp4",
    },
    {
        id: "PercentageWhole",
        title: "Prozent",
        curriculumLabel: "Prozent",
        description: "Darstellung eines vollständigen Kreises als 100 Prozent.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: percentageWholeDuration,
        outputPath: "marketing/videos/percentage-whole.mp4",
    },
    {
        id: "Time",
        title: "Uhrzeit",
        curriculumLabel: "Uhrzeit",
        description: "Darstellung einer analogen Uhr.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: timeCompositionDuration,
        outputPath: "marketing/videos/time.mp4",
    },
] as const;

export type CompositionCatalogItem = (typeof compositionCatalog)[number];
