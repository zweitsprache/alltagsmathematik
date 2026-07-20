import { compositionDuration } from "../app/remotion-test/page";
import { countToTenDuration } from "./compositions/count-to-ten";
import { twoDigitNumbersDuration } from "./compositions/two-digit-numbers";
import { percentageWholeDuration } from "./compositions/percentage-whole";
import { localPrepositionsDuration } from "./compositions/local-prepositions";
import { cuisenaireBlocksDuration } from "./compositions/cuisenaire-blocks";
import { stackedNumberLinesDuration } from "./compositions/number-line-stacked";
import { numberLineCountingDuration } from "./compositions/number-line-counting";
import { ruleOfThreeShampooDuration } from "./compositions/rule-of-three-shampoo";
import { getTitleBackground } from "./branded-slides";
import {
    fiveMinuteTimeCompositionDuration,
    fiveMinuteTimeVariantCompositionDuration,
    digitalFiveMinuteTimeVariantCompositionDuration,
    getDigitalInformalHourTimeCompositionDuration,
    getInformalHourTimeCompositionDuration,
    halfHourTimeCompositionDuration,
    quarterHourTimeCompositionDuration,
    tenMinuteTimeCompositionDuration,
    timeCompositionDuration,
} from "./compositions/time";

export const compositionCatalog = [
    {
        id: "RuleOfThreeShampoo",
        title: "Dreisatz mit Shampoo",
        curriculumLabel: "Dreisatz",
        description: "Erklärvideo zum Dreisatz mit einer animierten Shampooflasche.",
        width: 1920,
        height: 1080,
        fps: 25,
        durationInFrames: ruleOfThreeShampooDuration,
        outputPath: "marketing/videos/dreisatz-shampoo.mp4",
        titleBackgroundNumber: getTitleBackground("RuleOfThreeShampoo").number,
    },
    {
        id: "NumberLineZeroToTen",
        title: "Plus eins am Zahlenstrahl",
        curriculumLabel: "A.01.01 Zahlen von 0 bis 10",
        description: "Addition in Einerschritten von 0 + 1 bis 9 + 1.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: compositionDuration,
        outputPath: "marketing/videos/a-01-01-number-line.mp4",
        titleBackgroundNumber: getTitleBackground("NumberLineZeroToTen").number,
    },
    {
        id: "NumberLineCountingZeroToTen",
        title: "Zahlen von 0 bis 10",
        curriculumLabel: "Zahlen und Variablen | Zahlen von 0 bis 10",
        description: "Die Zahlen von 0 bis 10 schrittweise auf dem Zahlenstrahl.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: numberLineCountingDuration,
        outputPath: "marketing/videos/a-01-01-number-line-counting.mp4",
        titleBackgroundNumber: getTitleBackground("NumberLineCountingZeroToTen").number,
    },
    {
        id: "NumberLineZeroToTenStacked",
        title: "Additionen umkehren",
        curriculumLabel: "Zahlen und Variablen | Zahlen von 0 bis 10",
        description: "Additionen ohne Zehnerübergang in umgekehrter Reihenfolge.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: stackedNumberLinesDuration,
        outputPath: "marketing/videos/a-01-01-number-line-stacked.mp4",
        titleBackgroundNumber: getTitleBackground("NumberLineZeroToTenStacked").number,
    },
    {
        id: "CountToTen",
        title: "Zählen bis 10",
        curriculumLabel: "A.01.01 Zahlen von 0 bis 10",
        description: "Zählanimation von 1 bis 10 mit drei unterschiedlichen Gruppen pro Zahl.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: countToTenDuration,
        outputPath: "marketing/videos/a-01-01-count-to-ten.mp4",
        titleBackgroundNumber: getTitleBackground("CountToTen").number,
    },
    {
        id: "TwoDigitNumbers",
        title: "Zweistellige Zahlen",
        curriculumLabel: "Zahlen und Variablen | Zahlen von 10 bis 31",
        description: "Ziffern und Zahlwörter von 10 bis 31 mit animierter Sprechreihenfolge.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: twoDigitNumbersDuration,
        outputPath: "marketing/videos/a-01-04-two-digit-numbers.mp4",
        titleBackgroundNumber: getTitleBackground("TwoDigitNumbers").number,
    },
    {
        id: "PercentageWhole",
        title: "Prozentwerte ablesen und nennen",
        curriculumLabel: "Zahlen und Variablen | Prozentwerte verstehen",
        description: "Darstellung eines vollständigen Kreises als 100 Prozent.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: percentageWholeDuration,
        outputPath: "marketing/videos/percentage-whole.mp4",
        titleBackgroundNumber: getTitleBackground("PercentageWhole").number,
    },
    {
        id: "LocalPrepositions",
        title: "Lokale Präpositionen",
        curriculumLabel: "Deutsch | Lokale Präpositionen",
        description: "Minimaler 2.5D-Entwurf für neun lokale Präpositionen.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: localPrepositionsDuration,
        outputPath: "marketing/videos/local-prepositions.mp4",
        titleBackgroundNumber: getTitleBackground("LocalPrepositions").number,
    },
    {
        id: "CuisenaireBlocks",
        title: "Zahlenblöcke von 0 bis 10",
        curriculumLabel: "Zahlen und Variablen | Zahlen von 0 bis 10",
        description: "Übersicht der Zahlen von 0 bis 10 mit farbigen Cuisenaire-Blöcken.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: cuisenaireBlocksDuration,
        outputPath: "marketing/videos/cuisenaire-blocks.mp4",
        titleBackgroundNumber: getTitleBackground("CuisenaireBlocks").number,
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
        titleBackgroundNumber: getTitleBackground("Time").number,
    },
    {
        id: "TimeHalfHour",
        title: "Uhrzeit XX:30",
        curriculumLabel: "Uhrzeiten | Analog > offiziell",
        description: "Analoge und offizielle Uhrzeiten für halbe Stunden.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: halfHourTimeCompositionDuration,
        outputPath: "marketing/videos/time-half-hour.mp4",
        titleBackgroundNumber: getTitleBackground("TimeHalfHour").number,
    },
    {
        id: "TimeQuarterHours",
        title: "Uhrzeit XX:15 | XX:45",
        curriculumLabel: "Uhrzeiten | Analog > offiziell",
        description: "Analoge und offizielle Uhrzeiten für Viertelstunden.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: quarterHourTimeCompositionDuration,
        outputPath: "marketing/videos/time-quarter-hours.mp4",
        titleBackgroundNumber: getTitleBackground("TimeQuarterHours").number,
    },
    {
        id: "TimeTenMinuteGroups",
        title: "Uhrzeit XX:10 | XX:20 | XX:40 | XX:50",
        curriculumLabel: "Uhrzeiten | Analog > offiziell",
        description: "Analoge und offizielle Uhrzeiten in ausgewählten Zehn-Minuten-Schritten.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: tenMinuteTimeCompositionDuration,
        outputPath: "marketing/videos/time-ten-minute-groups.mp4",
        titleBackgroundNumber: getTitleBackground("TimeTenMinuteGroups").number,
    },
    {
        id: "TimeFiveMinuteGroups",
        title: "Uhrzeit XX:05 | XX:25 | XX:35 | XX:55",
        curriculumLabel: "Uhrzeiten | Analog > offiziell",
        description: "Analoge und offizielle Uhrzeiten in ausgewählten Fünf-Minuten-Schritten.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: fiveMinuteTimeCompositionDuration,
        outputPath: "marketing/videos/time-five-minute-groups.mp4",
        titleBackgroundNumber: getTitleBackground("TimeFiveMinuteGroups").number,
    },
    {
        id: "TimeFiveMinuteGroupsVariant",
        title: "Analoge Uhrzeiten | 12:00 – 13:00",
        curriculumLabel: "Uhrzeiten | Analog > inoffiziell",
        description: "Inoffizielle Sprechweise in Fünf-Minuten-Schritten von 12:00 bis 13:00.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: fiveMinuteTimeVariantCompositionDuration,
        outputPath: "marketing/videos/time-five-minute-groups-variant.mp4",
        titleBackgroundNumber: getTitleBackground("TimeFiveMinuteGroupsVariant").number,
    },
    {
        id: "DigitalTimeFiveMinuteGroupsVariant",
        title: "Digitale Uhrzeiten | 12:00 – 13:00",
        curriculumLabel: "Uhrzeiten | Digital > inoffiziell",
        description: "Digitale Uhrzeiten mit inoffizieller Sprechweise in Fünf-Minuten-Schritten.",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: digitalFiveMinuteTimeVariantCompositionDuration,
        outputPath: "marketing/videos/digital-time-12-13.mp4",
        titleBackgroundNumber: getTitleBackground("DigitalTimeFiveMinuteGroupsVariant").number,
    },
    ...Array.from({ length: 24 }, (_, startHour) => startHour)
        .filter((startHour) => startHour !== 12)
        .map((startHour) => {
            const endHour = (startHour + 1) % 24;
            const formattedStartHour = String(startHour).padStart(2, "0");
            const formattedEndHour = String(endHour).padStart(2, "0");

            const id = `DigitalTimeInformal${formattedStartHour}To${formattedEndHour}`;

            return {
                id,
                title: `Digitale Uhrzeiten | ${formattedStartHour}:00 – ${formattedEndHour}:00`,
                curriculumLabel: "Uhrzeiten | Digital > inoffiziell",
                description: `Digitale Uhrzeiten mit inoffizieller Sprechweise von ${formattedStartHour}:00 bis ${formattedEndHour}:00.`,
                width: 1920,
                height: 1080,
                fps: 30,
                durationInFrames: getDigitalInformalHourTimeCompositionDuration(startHour),
                outputPath: `marketing/videos/digital-time-${formattedStartHour}-${formattedEndHour}.mp4`,
                digitalStartHour: startHour,
                titleBackgroundNumber: getTitleBackground(id).number,
            };
        }),
    ...Array.from({ length: 11 }, (_, index) => {
        const startHour = index + 1;
        const endHour = startHour + 1;
        const formattedStartHour = String(startHour).padStart(2, "0");
        const formattedEndHour = String(endHour).padStart(2, "0");

        const id = `TimeInformal${formattedStartHour}To${formattedEndHour}`;

        return {
            id,
            title: `Analoge Uhrzeiten | ${formattedStartHour}:00 – ${formattedEndHour}:00`,
            curriculumLabel: "Uhrzeiten | Analog > inoffiziell",
            description: `Inoffizielle Sprechweise in Fünf-Minuten-Schritten von ${formattedStartHour}:00 bis ${formattedEndHour}:00.`,
            width: 1920,
            height: 1080,
            fps: 30,
            durationInFrames: getInformalHourTimeCompositionDuration(startHour),
            outputPath: `marketing/videos/time-informal-${formattedStartHour}-${formattedEndHour}.mp4`,
            startHour,
            titleBackgroundNumber: getTitleBackground(id).number,
        };
    }),
] as const;

export type CompositionCatalogItem = (typeof compositionCatalog)[number];
