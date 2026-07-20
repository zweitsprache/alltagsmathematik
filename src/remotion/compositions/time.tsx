import { MoonStar, Sun } from "@untitledui/icons";
import { CalendarClock } from "lucide-react";
import { AbsoluteFill, Easing, Html5Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BrandedTitleSlide, StandardEndSlide } from "../branded-slides";
import { VideoChrome, videoCopyright } from "../video-chrome";

const highlightFrame = 45;
const movementFrames = 90;
const pauseBetweenRepetitions = 32;
const pauseBeforeMovement = 20;
const initialHalfHourMovementStart = 15;
const initialHalfHourPause = 24;
const halfHourSegmentGrowthFrames = 30;
const pauseAfterHalfHourSegmentGrowth = 20;
const uhrFrames = 30;
const titleSlideFrames = 45;
const endSlideFrames = 120;
const yellow = "#eab308";
const teal = "#0e9384";
const nightBlue = "#0369a1";
const upcomingHourRed = "#d92d20";
const digitalHourSky = "#0369a1";
const digitalMinuteSky = "#0ea5e9";

const hourSequence = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const hourWords: Record<number, { file: string; text: string; frames: number }> = {
    0: { file: "null", text: "null", frames: 36 },
    1: { file: "ein", text: "ein", frames: 32 },
    2: { file: "zwei", text: "zwei", frames: 33 },
    3: { file: "drei", text: "drei", frames: 38 },
    4: { file: "vier", text: "vier", frames: 34 },
    5: { file: "fuenf", text: "fünf", frames: 38 },
    6: { file: "sechs", text: "sechs", frames: 37 },
    7: { file: "sieben", text: "sieben", frames: 40 },
    8: { file: "acht", text: "acht", frames: 31 },
    9: { file: "neun", text: "neun", frames: 39 },
    10: { file: "zehn", text: "zehn", frames: 37 },
    11: { file: "elf", text: "elf", frames: 36 },
    12: { file: "zwoelf", text: "zwölf", frames: 38 },
    13: { file: "dreizehn", text: "dreizehn", frames: 46 },
    14: { file: "vierzehn", text: "vierzehn", frames: 40 },
    15: { file: "fuenfzehn", text: "fünfzehn", frames: 48 },
    16: { file: "sechzehn", text: "sechzehn", frames: 43 },
    17: { file: "siebzehn", text: "siebzehn", frames: 44 },
    18: { file: "achtzehn", text: "achtzehn", frames: 44 },
    19: { file: "neunzehn", text: "neunzehn", frames: 43 },
    20: { file: "zwanzig", text: "zwanzig", frames: 48 },
    21: { file: "einundzwanzig", text: "einundzwanzig", frames: 102 },
    22: { file: "zweiundzwanzig", text: "zweiundzwanzig", frames: 110 },
    23: { file: "dreiundzwanzig", text: "dreiundzwanzig", frames: 108 },
};

const minuteWords: Record<number, { file: string; text: string; frames: number }> = {
    5: { file: "fuenf", text: "fünf", frames: 38 },
    10: { file: "zehn", text: "zehn", frames: 37 },
    15: { file: "fuenfzehn", text: "fünfzehn", frames: 48 },
    20: { file: "zwanzig", text: "zwanzig", frames: 48 },
    25: { file: "fuenfundzwanzig", text: "fünfundzwanzig", frames: 88 },
    30: { file: "dreissig", text: "dreissig", frames: 42 },
    35: { file: "fuenfunddreissig", text: "fünfunddreissig", frames: 70 },
    40: { file: "vierzig", text: "vierzig", frames: 45 },
    45: { file: "fuenfundvierzig", text: "fünfundvierzig", frames: 72 },
    50: { file: "fuenfzig", text: "fünfzig", frames: 60 },
    55: { file: "fuenfundfuenfzig", text: "fünfundfünfzig", frames: 69 },
};

type ClockState = {
    hour: number;
    minute: number;
    totalMinutes: number;
    arrival: number;
    phraseFrames?: number;
};

type ClockCompositionConfig = {
    minutes: number[];
    title?: string;
    subtitle: string;
    headerMinutes: string;
    labelStyle?: "official" | "informal";
    hideDaytimeIcon?: boolean;
    speechStyle?: "official" | "informal";
    informalStartHour?: number;
    displayStyle?: "analog" | "digital";
    clockType?: "Analog" | "Digital";
    movementFrames?: number;
    digitalStartHour?: number;
    titleIllustrationMinute?: number;
    titleBackground?: string;
    headerLabel?: string;
    titleSeed?: string;
};

const getInitialArrival = (firstMinute: number) =>
    firstMinute === 0
        ? highlightFrame
        : highlightFrame + initialHalfHourPause + halfHourSegmentGrowthFrames + pauseAfterHalfHourSegmentGrowth;

const createClockStatesFromTimes = (
    times: Array<{ hour: number; minute: number; totalMinutes: number; phraseFrames?: number }>,
) =>
    times.reduce<ClockState[]>((states, time, index) => {
        if (index === 0) return [{ ...time, arrival: getInitialArrival(time.minute) }];

        const previous = states[index - 1];
        const previousMinuteFrames = minuteWords[previous.minute]?.frames ?? 0;
        const previousPhraseFrames =
            previous.phraseFrames ?? hourWords[previous.hour].frames + uhrFrames + previousMinuteFrames;
        const previousHoldFrames =
            previousPhraseFrames + pauseBetweenRepetitions + previousPhraseFrames + pauseBeforeMovement;

        return [...states, { ...time, arrival: previous.arrival + previousHoldFrames + movementFrames }];
    }, []);

const createClockStates = (minutes: number[]) =>
    createClockStatesFromTimes(
        hourSequence.flatMap((hour, hourIndex) =>
            minutes.map((minute) => ({ hour, minute, totalMinutes: hourIndex * 60 + minute })),
        ),
    );

const getCompositionDuration = (states: ClockState[]) => {
    const finalState = states.at(-1)!;
    const finalMinuteFrames = minuteWords[finalState.minute]?.frames ?? 0;
    const finalPhraseFrames = hourWords[finalState.hour].frames + uhrFrames + finalMinuteFrames;
    return titleSlideFrames + finalState.arrival + finalPhraseFrames * 2 + pauseBetweenRepetitions + 30;
};

const fullHourConfig = { minutes: [0], subtitle: "XX:00", headerMinutes: "XX:00", titleSeed: "Time" };
const halfHourConfig = {
    minutes: [30],
    title: "Analoge Uhrzeiten",
    subtitle: "Offizielle Sprechweise | XX.30",
    headerMinutes: "XX:30",
    titleBackground: "title_slides/dark/am_title_slide_140.png",
    headerLabel: "Zeit und Raum | Uhrzeiten",
    titleSeed: "TimeHalfHour",
};
const quarterHourConfig = {
    minutes: [15, 45],
    subtitle: "XX:15 | XX:45",
    headerMinutes: "XX:15 | XX:45",
    titleSeed: "TimeQuarterHours",
};
const tenMinuteConfig = {
    minutes: [10, 20, 40, 50],
    subtitle: "XX:10 | XX:20 | XX:40 | XX:50",
    headerMinutes: "XX:10 | XX:20 | XX:40 | XX:50",
    titleSeed: "TimeTenMinuteGroups",
};
const fiveMinuteConfig = {
    minutes: [5, 25, 35, 55],
    subtitle: "XX:05 | XX:25 | XX:35 | XX:55",
    headerMinutes: "XX:05 | XX:25 | XX:35 | XX:55",
    titleSeed: "TimeFiveMinuteGroups",
};
const fiveMinuteVariantConfig: ClockCompositionConfig = {
    ...fiveMinuteConfig,
    minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    title: "Analoge Uhrzeiten | 12:00 – 13:00",
    subtitle: "Inoffizielle Sprechweise",
    headerMinutes: "12:00 – 13:00",
    labelStyle: "informal",
    hideDaytimeIcon: true,
    speechStyle: "informal",
    informalStartHour: 12,
    titleSeed: "TimeFiveMinuteGroupsVariant",
};

const informalTimePhrases: Record<
    number,
    { file: string; lead?: string; hour: string; suffix?: string; frames: number }
> = {
    0: { file: "uhr-informal-1200", lead: "Punkt", hour: "12", frames: 79 },
    5: { file: "uhr-informal-1205", lead: "5 nach", hour: "12", frames: 90 },
    10: { file: "uhr-informal-1210", lead: "10 nach", hour: "12", frames: 77 },
    15: { file: "uhr-informal-1215", lead: "Viertel nach", hour: "12", frames: 94 },
    20: { file: "uhr-informal-1220", lead: "20 nach", hour: "12", frames: 91 },
    25: { file: "uhr-informal-1225", lead: "5 vor halb", hour: "1", frames: 124 },
    30: { file: "uhr-informal-1230", lead: "halb", hour: "1", frames: 67 },
    35: { file: "uhr-informal-1235", lead: "5 nach halb", hour: "1", frames: 120 },
    40: { file: "uhr-informal-1240", lead: "20 vor", hour: "1", frames: 113 },
    45: { file: "uhr-informal-1245", lead: "Viertel vor", hour: "1", frames: 101 },
    50: { file: "uhr-informal-1250", lead: "10 vor", hour: "1", frames: 75 },
    55: { file: "uhr-informal-1255", lead: "5 vor", hour: "1", frames: 90 },
    60: { file: "uhr-informal-1300", lead: "Punkt", hour: "1", frames: 78 },
};

const informalPhraseLeads: Record<number, string> = {
    0: "Punkt",
    5: "5 nach",
    10: "10 nach",
    15: "Viertel nach",
    20: "20 nach",
    25: "5 vor halb",
    30: "halb",
    35: "5 nach halb",
    40: "20 vor",
    45: "Viertel vor",
    50: "10 vor",
    55: "5 vor",
};
const informalPhraseMaxFrames: Record<number, number> = {
    0: 74,
    5: 105,
    10: 117,
    15: 109,
    20: 118,
    25: 133,
    30: 77,
    35: 136,
    40: 139,
    45: 100,
    50: 121,
    55: 110,
};

const getInformalTimePhrase = (startHour: number, totalMinute: number) => {
    if (startHour === 12) return informalTimePhrases[totalMinute];

    const nextHour = startHour === 11 ? 12 : startHour + 1;
    const isFinalHour = totalMinute === 60;
    const minute = isFinalHour ? 0 : totalMinute;
    const spokenHour = minute >= 25 || isFinalHour ? nextHour : startHour;
    const fileHour = isFinalHour ? nextHour : startHour;

    return {
        file: `uhr-informal-${String(fileHour).padStart(2, "0")}${String(minute).padStart(2, "0")}`,
        lead: informalPhraseLeads[minute],
        hour: String(spokenHour),
        frames: informalPhraseMaxFrames[minute],
    };
};

const informalHourLabels: Record<number, string> = {
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

const informalMinuteLabels: Record<number, string> = {
    0: "Punkt",
    5: "5 nach",
    10: "10 nach",
    15: "Viertel nach",
    20: "20 nach",
    25: "5 vor halb",
    30: "halb",
    35: "5 nach halb",
    40: "20 vor",
    45: "Viertel vor",
    50: "10 vor",
    55: "5 vor",
};

const fullHourStates = createClockStates(fullHourConfig.minutes);
const halfHourStates = createClockStates(halfHourConfig.minutes);
const quarterHourStates = createClockStates(quarterHourConfig.minutes);
const tenMinuteStates = createClockStates(tenMinuteConfig.minutes);
const fiveMinuteStates = createClockStates(fiveMinuteConfig.minutes);
const createInformalHourSetup = (startHour: number) => {
    const nextHour = startHour === 12 ? 1 : startHour + 1;
    const displayedNextHour = startHour + 1;
    const formattedStartHour = String(startHour).padStart(2, "0");
    const formattedNextHour = String(displayedNextHour).padStart(2, "0");
    const config: ClockCompositionConfig = {
        ...fiveMinuteVariantConfig,
        title: `Analoge Uhrzeiten | ${formattedStartHour}:00 – ${formattedNextHour}:00`,
        headerMinutes: `${formattedStartHour}:00 – ${formattedNextHour}:00`,
        informalStartHour: startHour,
        titleSeed:
            startHour === 12
                ? "TimeFiveMinuteGroupsVariant"
                : `TimeInformal${formattedStartHour}To${formattedNextHour}`,
    };
    const states = createClockStatesFromTimes([
        ...Array.from({ length: 12 }, (_, index) => ({
            hour: startHour,
            minute: index * 5,
            totalMinutes: index * 5,
            phraseFrames: getInformalTimePhrase(startHour, index * 5).frames,
        })),
        {
            hour: nextHour,
            minute: 0,
            totalMinutes: 60,
            phraseFrames: getInformalTimePhrase(startHour, 60).frames,
        },
    ]);
    const finalPhraseFrames = getInformalTimePhrase(startHour, 60).frames;
    const contentDuration =
        titleSlideFrames + states.at(-1)!.arrival + finalPhraseFrames * 2 + pauseBetweenRepetitions + 30;

    return { config, states, contentDuration };
};
const fiveMinuteVariantSetup = createInformalHourSetup(12);
// Keep this alias during hot reloads because older compiled component modules referenced it directly.
const fiveMinuteVariantStates = fiveMinuteVariantSetup.states;
const digitalTitleMinutes: Record<number, number> = {
    0: 35,
    1: 10,
    2: 35,
    3: 20,
    4: 25,
    5: 30,
    6: 5,
    7: 50,
    8: 15,
    9: 10,
    10: 45,
    11: 40,
    12: 35,
};
const createDigitalInformalHourSetup = (displayStartHour: number) => {
    const speechStartHour = displayStartHour % 12 || 12;
    const setup = createInformalHourSetup(speechStartHour);
    const displayEndHour = (displayStartHour + 1) % 24;
    const formattedStartHour = String(displayStartHour).padStart(2, "0");
    const formattedEndHour = String(displayEndHour).padStart(2, "0");

    return {
        ...setup,
        config: {
            ...setup.config,
            title: `Digitale Uhrzeiten | ${formattedStartHour}:00 – ${formattedEndHour}:00`,
            headerMinutes: `${formattedStartHour}:00 – ${formattedEndHour}:00`,
            displayStyle: "digital",
            clockType: "Digital",
            movementFrames: 75,
            digitalStartHour: displayStartHour,
            titleIllustrationMinute: digitalTitleMinutes[speechStartHour],
            titleSeed:
                displayStartHour === 12
                    ? "DigitalTimeFiveMinuteGroupsVariant"
                    : `DigitalTimeInformal${formattedStartHour}To${formattedEndHour}`,
        } satisfies ClockCompositionConfig,
    };
};
const digitalFiveMinuteVariantSetup = createDigitalInformalHourSetup(12);
const fullHourContentDuration = getCompositionDuration(fullHourStates);
const halfHourContentDuration = getCompositionDuration(halfHourStates);
const quarterHourContentDuration = getCompositionDuration(quarterHourStates);
const tenMinuteContentDuration = getCompositionDuration(tenMinuteStates);
const fiveMinuteContentDuration = getCompositionDuration(fiveMinuteStates);
const fiveMinuteVariantContentDuration = fiveMinuteVariantSetup.contentDuration;
export const timeCompositionDuration = fullHourContentDuration + endSlideFrames;
export const halfHourTimeCompositionDuration = halfHourContentDuration + endSlideFrames;
export const quarterHourTimeCompositionDuration = quarterHourContentDuration + endSlideFrames;
export const tenMinuteTimeCompositionDuration = tenMinuteContentDuration + endSlideFrames;
export const fiveMinuteTimeCompositionDuration = fiveMinuteContentDuration + endSlideFrames;
export const fiveMinuteTimeVariantCompositionDuration = fiveMinuteVariantContentDuration + endSlideFrames;
export const digitalFiveMinuteTimeVariantCompositionDuration = fiveMinuteTimeVariantCompositionDuration;
export const getInformalHourTimeCompositionDuration = (startHour: number) =>
    createInformalHourSetup(startHour).contentDuration + endSlideFrames;
export const getDigitalInformalHourTimeCompositionDuration = (startHour: number) =>
    createDigitalInformalHourSetup(startHour).contentDuration + endSlideFrames;

const ClockTimeComposition = ({
    config,
    hourStates,
    contentDuration,
}: {
    config: ClockCompositionConfig;
    hourStates: ClockState[];
    contentDuration: number;
}) => {
    const hasMinuteLabels = config.minutes.some((minute) => minute !== 0);
    const usesInformalLabels = config.labelStyle === "informal";
    const absoluteFrame = useCurrentFrame();
    const isEndSlide = absoluteFrame >= contentDuration;
    const isTitleSlide = absoluteFrame < titleSlideFrames;
    const frame = absoluteFrame - titleSlideFrames;
    const isHighlighted = frame >= hourStates[0].arrival;
    const activeStateIndex = Math.max(
        0,
        hourStates.findLastIndex((state) => frame >= state.arrival),
    );
    const activeState = hourStates[activeStateIndex];
    const nextState = hourStates[activeStateIndex + 1];
    const activeMovementFrames = config.movementFrames ?? movementFrames;
    const movementStart = nextState ? nextState.arrival - activeMovementFrames : Number.POSITIVE_INFINITY;
    const isHourHandMoving = Boolean(nextState && frame >= movementStart && frame < nextState.arrival);
    const displayedTotalMinutes = isHourHandMoving
        ? interpolate(frame, [movementStart, nextState.arrival], [activeState.totalMinutes, nextState.totalMinutes], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.inOut(Easing.ease),
          })
        : activeStateIndex === 0 && activeState.minute !== 0
          ? interpolate(frame, [initialHalfHourMovementStart, highlightFrame], [0, activeState.totalMinutes], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.inOut(Easing.ease),
            })
          : activeState.totalMinutes;
    const digitalDisplayedMinutes = isHourHandMoving
        ? Math.min(
              Math.floor(nextState!.totalMinutes) - 1,
              Math.max(Math.floor(activeState.totalMinutes) + 1, Math.ceil(displayedTotalMinutes)),
          )
        : Math.round(displayedTotalMinutes);
    const digitalTotalMinutes = (config.digitalStartHour ?? 12) * 60 + digitalDisplayedMinutes;
    const digitalHour = String(Math.floor(digitalTotalMinutes / 60) % 24).padStart(2, "0");
    const digitalMinute = String(digitalTotalMinutes % 60).padStart(2, "0");
    const analogueStartHour = config.displayStyle === "digital" ? 12 : (config.informalStartHour ?? 12);
    const normalizedAnalogueStartHour = analogueStartHour % 12;
    const shortestInitialHourOffset =
        normalizedAnalogueStartHour > 6 ? (normalizedAnalogueStartHour - 12) * 60 : normalizedAnalogueStartHour * 60;
    const settledInitialHourOffset = normalizedAnalogueStartHour * 60;
    const initialHourOffset =
        normalizedAnalogueStartHour !== 0 && activeStateIndex === 0 && frame < activeState.arrival
            ? interpolate(frame, [5, 35], [0, shortestInitialHourOffset], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.inOut(Easing.ease),
              })
            : settledInitialHourOffset;
    const hourHandDisplayedTotalMinutes = initialHourOffset + displayedTotalMinutes;
    const hourHandRotation = hourHandDisplayedTotalMinutes / 2;
    const hourHandAngle = (hourHandRotation * Math.PI) / 180;
    const hourHandEndX = 340 + Math.sin(hourHandAngle) * 220;
    const hourHandEndY = 340 - Math.cos(hourHandAngle) * 220;
    const minuteHandAngle = (displayedTotalMinutes * 6 * Math.PI) / 180;
    const minuteHandEndX = 340 + Math.sin(minuteHandAngle) * 325;
    const minuteHandEndY = 340 - Math.cos(minuteHandAngle) * 325;
    const isDaytime = activeState.hour >= 6 && activeState.hour <= 17;
    const accentColor = usesInformalLabels ? yellow : isDaytime ? yellow : nightBlue;
    const activeWord = hourWords[activeState.hour];
    const activeMinuteWord = minuteWords[activeState.minute];
    const activeInformalPhrase =
        config.speechStyle === "informal"
            ? getInformalTimePhrase(config.informalStartHour ?? 12, activeState.totalMinutes)
            : undefined;
    const upcomingHourBlinkOpacity = Math.floor(frame / 12) % 2 === 0 ? 1 : 0.25;
    const minuteWordFrames = activeMinuteWord?.frames ?? 0;
    const firstUhrFrame = activeState.arrival + activeWord.frames;
    const firstMinuteFrame = firstUhrFrame + uhrFrames;
    const repeatedWordFrame = firstMinuteFrame + minuteWordFrames + pauseBetweenRepetitions;
    const repeatedUhrFrame = repeatedWordFrame + activeWord.frames;
    const repeatedMinuteFrame = repeatedUhrFrame + uhrFrames;
    const initialSegmentGrowthStart =
        hourStates[0].arrival - pauseAfterHalfHourSegmentGrowth - halfHourSegmentGrowthFrames;
    const displayedMinute = ((displayedTotalMinutes % 60) + 60) % 60;
    const crossesHourBoundary =
        isHourHandMoving &&
        nextState &&
        Math.floor(nextState.totalMinutes / 60) > Math.floor(activeState.totalMinutes / 60);
    const nextHourBoundary = (Math.floor(activeState.totalMinutes / 60) + 1) * 60;
    const minuteSegmentAngle = !hasMinuteLabels
        ? 0
        : activeStateIndex === 0 && frame < hourStates[0].arrival
          ? interpolate(
                frame,
                [initialSegmentGrowthStart, initialSegmentGrowthStart + halfHourSegmentGrowthFrames],
                [0, activeState.minute * 6],
                {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.inOut(Easing.ease),
                },
            )
          : crossesHourBoundary && displayedTotalMinutes < nextHourBoundary
            ? 0
            : displayedMinute * 6;
    const informalMinute = minuteSegmentAngle / 6;
    const minuteSegmentStartAngle = usesInformalLabels
        ? informalMinute > 20 && informalMinute < 30
            ? minuteSegmentAngle
            : informalMinute > 30 && informalMinute < 40
              ? 180
              : informalMinute >= 40
                ? minuteSegmentAngle
                : 0
        : 0;
    const minuteSegmentEndAngle = usesInformalLabels
        ? informalMinute > 20 && informalMinute < 30
            ? 180
            : informalMinute >= 40
              ? 360
              : minuteSegmentAngle
        : minuteSegmentAngle;
    const switchesFromAfterHalfToBeforeHour =
        usesInformalLabels && isHourHandMoving && activeState.minute === 35 && nextState?.minute === 40;
    const minuteSegmentArcAngle = switchesFromAfterHalfToBeforeHour
        ? 0
        : minuteSegmentEndAngle - minuteSegmentStartAngle;
    const minuteSegmentStartRadians = (minuteSegmentStartAngle * Math.PI) / 180;
    const minuteSegmentEndRadians = (minuteSegmentEndAngle * Math.PI) / 180;
    const minuteSegmentStartX = 340 + Math.sin(minuteSegmentStartRadians) * 240;
    const minuteSegmentStartY = 340 - Math.cos(minuteSegmentStartRadians) * 240;
    const minuteSegmentEndX = 340 + Math.sin(minuteSegmentEndRadians) * 240;
    const minuteSegmentEndY = 340 - Math.cos(minuteSegmentEndRadians) * 240;

    if (isEndSlide) return <StandardEndSlide />;

    if (isTitleSlide) {
        return (
            <BrandedTitleSlide
                seed={config.titleSeed ?? `${config.clockType ?? "Analog"}-${config.headerMinutes}`}
                curriculumLabel={
                    config.headerLabel ? (
                        <>
                            <strong>Zeit und Raum</strong>
                            {" | Uhrzeiten"}
                        </>
                    ) : (
                        <>
                            <strong>Zeit und Raum</strong>
                            {`\u00a0| Uhrzeiten | ${config.clockType ?? "Analog"} > ${usesInformalLabels ? "inoffiziell" : "offiziell"} | ${config.headerMinutes}`}
                        </>
                    )
                }
                title={config.title ?? "Analoge Uhrzeiten | Offizielle Sprechweise"}
                subtitle={config.subtitle}
                icon={<CalendarClock size={64} strokeWidth={2.5} />}
            />
        );
    }

    if (isTitleSlide) {
        if (config.titleBackground) {
            const usesLightTitleBackground = config.titleBackground!.includes("/light/");
            const titleColor = usesLightTitleBackground ? "#101828" : "#ffffff";

            return (
                <AbsoluteFill
                    style={{
                        color: titleColor,
                        fontFamily: "Encode Sans Semi Condensed, sans-serif",
                    }}
                >
                    <Img
                        src={staticFile(config.titleBackground!)}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <p style={{ position: "absolute", top: 60, left: 60, margin: 0, fontSize: 24, lineHeight: 1.4 }}>
                        {config.headerLabel ? (
                            <>
                                <strong>Zeit und Raum</strong>
                                {" | Uhrzeiten"}
                            </>
                        ) : (
                            <>
                                <strong>Zeit und Raum</strong>
                                {`\u00a0| Uhrzeiten | ${config.clockType ?? "Analog"} > ${usesInformalLabels ? "inoffiziell" : "offiziell"} | ${config.headerMinutes}`}
                            </>
                        )}
                    </p>
                    <Img
                        src={staticFile(
                            usesLightTitleBackground
                                ? "alltagsmathematik_logo_color_outline.svg"
                                : "alltagsmathematik_brandmark_primary_invert.svg",
                        )}
                        style={{ position: "absolute", top: 60, right: 60, width: 90, height: 90 }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: 160,
                            transform: "translateY(-50%)",
                            textAlign: "left",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                width: 104,
                                height: 104,
                                marginBottom: 34,
                                alignItems: "center",
                                justifyContent: "center",
                                border: `3px solid ${titleColor}`,
                                borderRadius: 21,
                            }}
                        >
                            <CalendarClock size={64} strokeWidth={2.5} />
                        </div>
                        <h1 style={{ margin: 0, fontSize: 92, fontWeight: 700, lineHeight: 1.05 }}>
                            {config.title ?? "Analoge Uhrzeiten | Offizielle Sprechweise"}
                        </h1>
                        <p style={{ margin: "18px 0 0", fontSize: 58, fontWeight: 400, lineHeight: 1.15 }}>
                            {config.subtitle}
                        </p>
                    </div>
                    <p
                        style={{
                            position: "absolute",
                            bottom: 48,
                            left: 60,
                            margin: 0,
                            fontSize: 24,
                            lineHeight: 1.4,
                        }}
                    >
                        {videoCopyright}
                    </p>
                </AbsoluteFill>
            );
        }

        return (
            <AbsoluteFill
                style={{
                    backgroundColor: "#ffffff",
                    fontFamily: "Encode Sans Semi Condensed, sans-serif",
                }}
            >
                <VideoChrome
                    curriculumLabel={
                        <>
                            <strong>Zeit und Raum</strong>
                            {`\u00a0| Uhrzeiten | ${config.clockType ?? "Analog"} > ${usesInformalLabels ? "inoffiziell" : "offiziell"} | ${config.headerMinutes}`}
                        </>
                    }
                >
                    {config.displayStyle === "digital" && (
                        <div
                            style={{
                                position: "absolute",
                                top: 300,
                                right: -145,
                                width: 370,
                                height: 720,
                                border: "12px solid #344054",
                                borderRadius: 44,
                                boxSizing: "border-box",
                                backgroundColor: "#ffffff",
                                opacity: 0.08,
                                transform: "scale(2.43)",
                                transformOrigin: "top right",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 20,
                                    left: "50%",
                                    width: 126,
                                    height: 34,
                                    borderRadius: 999,
                                    backgroundColor: "#344054",
                                    transform: "translateX(-50%)",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: 76,
                                    left: "25%",
                                    width: "50%",
                                    height: 10,
                                    borderRadius: 4,
                                    backgroundColor: "#344054",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: 105,
                                    right: 20,
                                    left: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 104,
                                    fontWeight: 900,
                                    fontVariantNumeric: "tabular-nums",
                                    letterSpacing: 1,
                                    lineHeight: 1,
                                }}
                            >
                                <span style={{ color: digitalHourSky }}>
                                    {String(config.digitalStartHour ?? 12).padStart(2, "0")}
                                </span>
                                <span style={{ color: "#344054", transform: "translateY(-7px)" }}>:</span>
                                <span style={{ color: digitalMinuteSky }}>
                                    {String(config.titleIllustrationMinute ?? 35).padStart(2, "0")}
                                </span>
                            </div>
                            <div
                                style={{
                                    position: "absolute",
                                    top: 235,
                                    right: 30,
                                    left: 30,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 22,
                                }}
                            >
                                <div
                                    style={{
                                        height: 150,
                                        border: "2px solid #344054",
                                        borderRadius: 10,
                                        backgroundColor: "#f2f4f7",
                                    }}
                                />
                                {[0, 1, 2].map((item) => (
                                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                        <div
                                            style={{
                                                width: 54,
                                                height: 54,
                                                flexShrink: 0,
                                                borderRadius: 8,
                                                backgroundColor: "#667085",
                                            }}
                                        />
                                        <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 10 }}>
                                            <div
                                                style={{
                                                    width: item === 1 ? "72%" : "88%",
                                                    height: 12,
                                                    borderRadius: 4,
                                                    backgroundColor: "#344054",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    width: item === 2 ? "48%" : "60%",
                                                    height: 10,
                                                    borderRadius: 4,
                                                    backgroundColor: "#667085",
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 20,
                                    left: "50%",
                                    width: 140,
                                    height: 7,
                                    borderRadius: 999,
                                    backgroundColor: "#344054",
                                    transform: "translateX(-50%)",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: 128,
                                    left: -20,
                                    width: 8,
                                    height: 88,
                                    borderRadius: "8px 0 0 8px",
                                    backgroundColor: "#344054",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: 150,
                                    right: -20,
                                    width: 8,
                                    height: 112,
                                    borderRadius: "0 8px 8px 0",
                                    backgroundColor: "#344054",
                                }}
                            />
                        </div>
                    )}
                    {config.displayStyle !== "digital" && (
                        <div
                            style={{
                                position: "absolute",
                                top: 300,
                                right: -145,
                                width: 900,
                                height: 900,
                                opacity: 0.08,
                            }}
                        >
                            <Img
                                src={staticFile("transfer/am_zifferblatt_0000.svg")}
                                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                            />
                            <svg
                                viewBox="0 0 680 680"
                                aria-hidden="true"
                                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                            >
                                <path
                                    fill="#ffffff"
                                    stroke="#ffffff"
                                    strokeWidth="3"
                                    d="M340 120c5.523 0 10 4.477 10 10v200c0 5.523-4.477 10-10 10s-10-4.477-10-10V130c0-5.523 4.477-10 10-10Z"
                                />
                                <path
                                    fill="#ffffff"
                                    stroke="#ffffff"
                                    strokeWidth="3"
                                    d="M340 15c4.694 0 8.5 3.806 8.5 8.5v308c0 4.694-3.806 8.5-8.5 8.5s-8.5-3.806-8.5-8.5v-308c0-4.694 3.806-8.5 8.5-8.5Z"
                                />
                                <rect x="330" y="0" width="20" height="60" rx="2" fill="#231f20" />
                                <line
                                    x1="340"
                                    y1="340"
                                    x2="59"
                                    y2="503"
                                    stroke="#101828"
                                    strokeWidth="17"
                                    strokeLinecap="round"
                                />
                                <line
                                    x1="340"
                                    y1="340"
                                    x2="199"
                                    y2="171"
                                    stroke="#101828"
                                    strokeWidth="20"
                                    strokeLinecap="round"
                                />
                                <circle cx="340" cy="340" r="17" fill="#101828" />
                            </svg>
                        </div>
                    )}
                    <div
                        style={{
                            position: "absolute",
                            top: 550,
                            left: 60,
                            width: 1740,
                            textAlign: "left",
                        }}
                    >
                        <h1
                            style={{
                                margin: 0,
                                color: "#101828",
                                fontSize: 80,
                                fontWeight: 700,
                                lineHeight: 1.15,
                            }}
                        >
                            {config.title ?? "Analoge Uhrzeiten | Offizielle Sprechweise"}
                        </h1>
                        <p
                            style={{
                                margin: "18px 0 0",
                                color: "#101828",
                                fontSize: 80,
                                fontWeight: 400,
                                lineHeight: 1.15,
                            }}
                        >
                            {config.subtitle}
                        </p>
                    </div>
                </VideoChrome>
            </AbsoluteFill>
        );
    }

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#ffffff",
                fontFamily: "Encode Sans Semi Condensed, sans-serif",
            }}
        >
            <VideoChrome
                curriculumLabel={
                    config.headerLabel ? (
                        <>
                            <strong>Zeit und Raum</strong>
                            {" | Uhrzeiten"}
                        </>
                    ) : (
                        <>
                            <strong>Zeit und Raum</strong>
                            {`\u00a0| Uhrzeiten | ${config.clockType ?? "Analog"} > ${usesInformalLabels ? "inoffiziell" : "offiziell"} | ${config.headerMinutes}`}
                        </>
                    )
                }
            >
                {hourStates.flatMap((state, index) => {
                    const informalPhrase =
                        config.speechStyle === "informal"
                            ? getInformalTimePhrase(config.informalStartHour ?? 12, state.totalMinutes)
                            : undefined;
                    if (informalPhrase) {
                        const repeatedPhraseFrame = state.arrival + informalPhrase.frames + pauseBetweenRepetitions;

                        return [
                            <Sequence
                                key={`${index}-informal-1`}
                                from={state.arrival + titleSlideFrames}
                                durationInFrames={informalPhrase.frames + 2}
                                premountFor={30}
                            >
                                <Html5Audio src={staticFile(`remotion/number-line-audio/${informalPhrase.file}.mp3`)} />
                            </Sequence>,
                            <Sequence
                                key={`${index}-informal-2`}
                                from={repeatedPhraseFrame + titleSlideFrames}
                                durationInFrames={informalPhrase.frames + 2}
                                premountFor={30}
                            >
                                <Html5Audio src={staticFile(`remotion/number-line-audio/${informalPhrase.file}.mp3`)} />
                            </Sequence>,
                        ];
                    }

                    const word = hourWords[state.hour];
                    const minuteWord = minuteWords[state.minute];
                    const stateMinuteWordFrames = minuteWord?.frames ?? 0;
                    const firstUhrFrame = state.arrival + word.frames;
                    const firstMinuteFrame = firstUhrFrame + uhrFrames;
                    const repeatedWordFrame = firstMinuteFrame + stateMinuteWordFrames + pauseBetweenRepetitions;
                    const repeatedUhrFrame = repeatedWordFrame + word.frames;
                    const repeatedMinuteFrame = repeatedUhrFrame + uhrFrames;

                    const sequences = [
                        <Sequence
                            key={`${index}-word-1`}
                            from={state.arrival + titleSlideFrames}
                            durationInFrames={word.frames + 2}
                            premountFor={30}
                        >
                            <Html5Audio src={staticFile(`remotion/number-line-audio/${word.file}.mp3`)} />
                        </Sequence>,
                        <Sequence
                            key={`${index}-uhr-1`}
                            from={firstUhrFrame + titleSlideFrames}
                            durationInFrames={uhrFrames + 2}
                            premountFor={30}
                        >
                            <Html5Audio src={staticFile("remotion/number-line-audio/uhr.mp3")} />
                        </Sequence>,
                        ...(minuteWord
                            ? [
                                  <Sequence
                                      key={`${index}-minute-1`}
                                      from={firstMinuteFrame + titleSlideFrames}
                                      durationInFrames={stateMinuteWordFrames + 2}
                                      premountFor={30}
                                  >
                                      <Html5Audio
                                          src={staticFile(`remotion/number-line-audio/${minuteWord.file}.mp3`)}
                                      />
                                  </Sequence>,
                              ]
                            : []),
                        <Sequence
                            key={`${index}-word-2`}
                            from={repeatedWordFrame + titleSlideFrames}
                            durationInFrames={word.frames + 2}
                            premountFor={30}
                        >
                            <Html5Audio src={staticFile(`remotion/number-line-audio/${word.file}.mp3`)} />
                        </Sequence>,
                        <Sequence
                            key={`${index}-uhr-2`}
                            from={repeatedUhrFrame + titleSlideFrames}
                            durationInFrames={uhrFrames + 2}
                            premountFor={30}
                        >
                            <Html5Audio src={staticFile("remotion/number-line-audio/uhr.mp3")} />
                        </Sequence>,
                        ...(minuteWord
                            ? [
                                  <Sequence
                                      key={`${index}-minute-2`}
                                      from={repeatedMinuteFrame + titleSlideFrames}
                                      durationInFrames={stateMinuteWordFrames + 2}
                                      premountFor={30}
                                  >
                                      <Html5Audio
                                          src={staticFile(`remotion/number-line-audio/${minuteWord.file}.mp3`)}
                                      />
                                  </Sequence>,
                              ]
                            : []),
                    ];

                    return sequences;
                })}
                {config.displayStyle === "digital" ? (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 190,
                            left: 0,
                            display: "flex",
                            width: "45%",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: 270,
                                left: "calc(50% - 185px)",
                                width: 370,
                                height: 720,
                                border: "12px solid #000000",
                                borderRadius: 44,
                                boxSizing: "border-box",
                                backgroundColor: "#ffffff",
                                scale: 1.45,
                                transformOrigin: "top center",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 20,
                                    left: "50%",
                                    width: 126,
                                    height: 34,
                                    borderRadius: 999,
                                    backgroundColor: "#000000",
                                    transform: "translateX(-50%)",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: 76,
                                    left: "25%",
                                    width: "50%",
                                    height: 10,
                                    borderRadius: 4,
                                    backgroundColor: "#eaecf0",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: 105,
                                    right: 20,
                                    left: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#000000",
                                    fontFamily: '"Encode Sans Semi Condensed", sans-serif',
                                    fontSize: 92,
                                    fontWeight: 900,
                                    fontVariantNumeric: "tabular-nums",
                                    letterSpacing: 1,
                                    lineHeight: 1,
                                }}
                            >
                                <span
                                    style={{
                                        color:
                                            isHighlighted &&
                                            !isHourHandMoving &&
                                            activeState.minute >= 25 &&
                                            activeState.minute !== 0
                                                ? upcomingHourRed
                                                : digitalHourSky,
                                    }}
                                >
                                    {digitalHour}
                                </span>
                                <span style={{ color: "#344054", transform: "translateY(-7px)" }}>:</span>
                                <span
                                    style={{
                                        color: digitalMinuteSky,
                                    }}
                                >
                                    {digitalMinute}
                                </span>
                            </div>
                            <div
                                style={{
                                    position: "absolute",
                                    top: 235,
                                    right: 30,
                                    left: 30,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 22,
                                }}
                            >
                                {[0, 1, 2].map((item) => (
                                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                        <div
                                            style={{
                                                width: 54,
                                                height: 54,
                                                flexShrink: 0,
                                                borderRadius: 8,
                                                backgroundColor: "#eaecf0",
                                            }}
                                        />
                                        <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 10 }}>
                                            <div
                                                style={{
                                                    width: item === 1 ? "72%" : "88%",
                                                    height: 12,
                                                    borderRadius: 4,
                                                    backgroundColor: "#d0d5dd",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    width: item === 2 ? "48%" : "60%",
                                                    height: 10,
                                                    borderRadius: 4,
                                                    backgroundColor: "#eaecf0",
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 20,
                                    left: "50%",
                                    width: 140,
                                    height: 7,
                                    borderRadius: 999,
                                    backgroundColor: "#000000",
                                    transform: "translateX(-50%)",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: 128,
                                    left: -20,
                                    width: 8,
                                    height: 88,
                                    borderRadius: "8px 0 0 8px",
                                    backgroundColor: "#000000",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: 150,
                                    right: -20,
                                    width: 8,
                                    height: 112,
                                    borderRadius: "0 8px 8px 0",
                                    backgroundColor: "#000000",
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            display: "flex",
                            width: "60%",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                position: "relative",
                                width: 740,
                                height: 740,
                                transform: hasMinuteLabels ? "translateY(10px) scale(0.92)" : undefined,
                                transformOrigin: "center",
                            }}
                        >
                            <Img
                                src={staticFile("transfer/am_zifferblatt_0000.svg")}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    width: 560,
                                    height: 560,
                                    objectFit: "contain",
                                    transform: "translate(-50%, -50%)",
                                }}
                            />
                            <svg
                                viewBox="0 0 680 680"
                                aria-hidden="true"
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    width: 560,
                                    height: 560,
                                    pointerEvents: "none",
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <path
                                    fill="#ffffff"
                                    stroke="#ffffff"
                                    strokeWidth="3"
                                    d="M340 120c5.523 0 10 4.477 10 10v200c0 5.523-4.477 10-10 10s-10-4.477-10-10V130c0-5.523 4.477-10 10-10Z"
                                />
                                <path
                                    fill="#ffffff"
                                    stroke="#ffffff"
                                    strokeWidth="3"
                                    d="M340 15c4.694 0 8.5 3.806 8.5 8.5v308c0 4.694-3.806 8.5-8.5 8.5s-8.5-3.806-8.5-8.5v-308c0-4.694 3.806-8.5 8.5-8.5Z"
                                />
                                <rect x="330" y="0" width="20" height="60" rx="2" fill="#231f20" />
                                {hasMinuteLabels && minuteSegmentArcAngle > 0 && (
                                    <path
                                        d={`M340 340 L${minuteSegmentStartX} ${minuteSegmentStartY} A240 240 0 ${minuteSegmentArcAngle > 180 ? 1 : 0} 1 ${minuteSegmentEndX} ${minuteSegmentEndY} Z`}
                                        fill="#f0fdfa"
                                    />
                                )}
                                <line
                                    x1="340"
                                    y1="340"
                                    x2={minuteHandEndX}
                                    y2={minuteHandEndY}
                                    stroke={
                                        isHighlighted &&
                                        hasMinuteLabels &&
                                        (activeState.minute !== 0 || usesInformalLabels)
                                            ? teal
                                            : "#231f20"
                                    }
                                    strokeWidth="17"
                                    strokeLinecap="round"
                                />
                                <line
                                    x1="340"
                                    y1="340"
                                    x2={hourHandEndX}
                                    y2={hourHandEndY}
                                    stroke={
                                        isHighlighted &&
                                        usesInformalLabels &&
                                        activeState.minute >= 25 &&
                                        activeState.minute !== 0
                                            ? upcomingHourRed
                                            : isHighlighted
                                              ? accentColor
                                              : "#231f20"
                                    }
                                    strokeWidth="20"
                                    strokeLinecap="round"
                                />
                                <circle cx="340" cy="340" r="17" fill="#231f20" />
                            </svg>
                            {Array.from({ length: 12 }, (_, index) => {
                                const hour = index + 1;
                                const firstLabelValue = hour === 12 ? 0 : hour;
                                const secondLabelValue = hour === 12 ? 12 : hour + 12;
                                const informalHourIsChanging =
                                    isHourHandMoving &&
                                    nextState &&
                                    (nextState.hour % 12 || 12) !== (activeState.hour % 12 || 12);
                                const isFirstLabelActive =
                                    isHighlighted &&
                                    (usesInformalLabels
                                        ? !informalHourIsChanging && (activeState.hour % 12 || 12) === hour
                                        : !isHourHandMoving && activeState.hour === firstLabelValue);
                                const isSecondLabelActive =
                                    !usesInformalLabels &&
                                    isHighlighted &&
                                    !isHourHandMoving &&
                                    activeState.hour === secondLabelValue;
                                const upcomingInformalHour = (activeState.hour + 1) % 12 || 12;
                                const isUpcomingInformalHour =
                                    usesInformalLabels &&
                                    !isHourHandMoving &&
                                    activeState.minute >= 25 &&
                                    activeState.minute !== 0 &&
                                    hour === upcomingInformalHour;
                                const angle = (hour * 30 - 90) * (Math.PI / 180);
                                const useRightEdgeAnchor = hour >= 7 && hour <= 11;
                                const useLeftEdgeAnchor = hour >= 1 && hour <= 5;
                                const useTopLabelAnchor = hour === 12;
                                const useBottomLabelAnchor = hour === 6;
                                const minuteValue = (hour * 5) % 60;
                                const minuteLabel = usesInformalLabels
                                    ? informalMinuteLabels[minuteValue]
                                    : String(minuteValue).padStart(2, "0");
                                const isMinuteLabelActive =
                                    isHighlighted &&
                                    !isHourHandMoving &&
                                    (activeState.minute !== 0 || usesInformalLabels) &&
                                    (hour * 5) % 60 === activeState.minute;
                                const minuteLabelAlignment =
                                    hour >= 1 && hour <= 5 ? "left" : hour >= 7 && hour <= 11 ? "right" : "center";
                                const radius =
                                    useRightEdgeAnchor || useLeftEdgeAnchor || useTopLabelAnchor || useBottomLabelAnchor
                                        ? 325
                                        : 302 + Math.abs(Math.cos(angle)) * 62 + Math.abs(Math.sin(angle)) * 20;

                                return (
                                    <div
                                        key={hour}
                                        style={{
                                            position: "absolute",
                                            top: 370 + Math.sin(angle) * radius,
                                            left: 370 + Math.cos(angle) * radius,
                                            color: hasMinuteLabels ? "#98a2b3" : "#101828",
                                            fontSize: 40,
                                            fontWeight: 500,
                                            lineHeight: 1,
                                            fontVariantNumeric: "tabular-nums",
                                            whiteSpace: "nowrap",
                                            transform: useRightEdgeAnchor
                                                ? "translate(-100%, -50%)"
                                                : useLeftEdgeAnchor
                                                  ? "translate(0, -50%)"
                                                  : useTopLabelAnchor
                                                    ? "translate(-50%, -100%)"
                                                    : "translate(-50%, 0)",
                                        }}
                                    >
                                        <div
                                            style={
                                                usesInformalLabels
                                                    ? { display: "flex", alignItems: "center", gap: 8 }
                                                    : {
                                                          display: "grid",
                                                          gridTemplateColumns: "2ch auto 2ch",
                                                          columnGap: 8,
                                                          alignItems: "center",
                                                      }
                                            }
                                        >
                                            <span
                                                style={{
                                                    textAlign: "right",
                                                    color: isUpcomingInformalHour
                                                        ? upcomingHourRed
                                                        : isFirstLabelActive
                                                          ? accentColor
                                                          : undefined,
                                                    fontWeight:
                                                        isUpcomingInformalHour || isFirstLabelActive ? 700 : undefined,
                                                    opacity: isUpcomingInformalHour ? upcomingHourBlinkOpacity : 1,
                                                }}
                                            >
                                                {usesInformalLabels ? hour : String(firstLabelValue).padStart(2, "0")}
                                            </span>
                                            <span>|</span>
                                            <span
                                                style={{
                                                    textAlign: "left",
                                                    color: isSecondLabelActive ? accentColor : undefined,
                                                    fontWeight: isSecondLabelActive ? 700 : undefined,
                                                }}
                                            >
                                                {usesInformalLabels ? informalHourLabels[hour] : secondLabelValue}
                                            </span>
                                        </div>
                                        {hasMinuteLabels && (
                                            <div
                                                style={{
                                                    marginTop: 7,
                                                    color: isMinuteLabelActive ? teal : "#98a2b3",
                                                    fontSize: 30,
                                                    fontWeight: isMinuteLabelActive ? 700 : 500,
                                                    lineHeight: 1,
                                                    textAlign: minuteLabelAlignment,
                                                }}
                                            >
                                                {minuteLabel}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        display: "flex",
                        width: config.displayStyle === "digital" ? "55%" : "40%",
                        height: "100%",
                        alignItems: "flex-start",
                        flexDirection: "column",
                        justifyContent: "center",
                        boxSizing: "border-box",
                        paddingLeft: config.displayStyle === "digital" ? 80 : 48,
                    }}
                >
                    {activeInformalPhrase ? (
                        <div
                            style={{
                                fontSize: config.displayStyle === "digital" ? 132 : 96,
                                fontWeight: 400,
                                lineHeight: 1.15,
                                color: "#101828",
                                whiteSpace: "nowrap",
                                visibility: !isHighlighted || isHourHandMoving ? "hidden" : "visible",
                            }}
                        >
                            {activeInformalPhrase.lead && (
                                <>
                                    <span
                                        style={{
                                            color: config.displayStyle === "digital" ? digitalMinuteSky : teal,
                                        }}
                                    >
                                        {activeInformalPhrase.lead}
                                    </span>{" "}
                                </>
                            )}
                            <span
                                style={{
                                    color:
                                        activeState.minute >= 25 && activeState.minute !== 0
                                            ? upcomingHourRed
                                            : config.displayStyle === "digital"
                                              ? digitalHourSky
                                              : accentColor,
                                    fontWeight: 700,
                                    opacity:
                                        activeState.minute >= 25 && activeState.minute !== 0
                                            ? upcomingHourBlinkOpacity
                                            : 1,
                                }}
                            >
                                {activeInformalPhrase.hour}
                            </span>
                            {activeInformalPhrase.suffix && (
                                <span
                                    style={{
                                        color: config.displayStyle === "digital" ? digitalMinuteSky : undefined,
                                    }}
                                >
                                    {" "}
                                    {activeInformalPhrase.suffix}
                                </span>
                            )}
                        </div>
                    ) : (
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 32,
                                    color: accentColor,
                                    visibility: isHighlighted ? "visible" : "hidden",
                                }}
                            >
                                {!config.hideDaytimeIcon &&
                                    (isDaytime ? (
                                        <Sun aria-label="Tag" style={{ width: 160, height: 160 }} />
                                    ) : (
                                        <MoonStar aria-label="Nacht" style={{ width: 160, height: 160 }} />
                                    ))}
                                <div
                                    style={{
                                        fontSize: 80,
                                        fontWeight: 700,
                                        lineHeight: 1,
                                        fontVariantNumeric: "tabular-nums",
                                        visibility: !isHighlighted || isHourHandMoving ? "hidden" : "visible",
                                    }}
                                >
                                    {String(activeState.hour).padStart(2, "0")}:
                                    {String(activeState.minute).padStart(2, "0")}
                                </div>
                            </div>
                            <div
                                style={{
                                    marginTop: 32,
                                    color: "#101828",
                                    fontSize: 80,
                                    fontWeight: 400,
                                    lineHeight: 1.1,
                                    visibility: !isHighlighted || isHourHandMoving ? "hidden" : "visible",
                                }}
                            >
                                <div style={{ marginBottom: 24, color: isHighlighted ? accentColor : "#101828" }}>
                                    {activeWord.text}
                                </div>
                                <div>Uhr</div>
                                {activeMinuteWord && (
                                    <div style={{ marginTop: 24, color: teal }}>{activeMinuteWord.text}</div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </VideoChrome>
        </AbsoluteFill>
    );
};

export const TimeComposition = () => (
    <ClockTimeComposition
        config={fullHourConfig}
        hourStates={fullHourStates}
        contentDuration={fullHourContentDuration}
    />
);
export const HalfHourTimeComposition = () => (
    <ClockTimeComposition
        config={halfHourConfig}
        hourStates={halfHourStates}
        contentDuration={halfHourContentDuration}
    />
);
export const QuarterHourTimeComposition = () => (
    <ClockTimeComposition
        config={quarterHourConfig}
        hourStates={quarterHourStates}
        contentDuration={quarterHourContentDuration}
    />
);
export const TenMinuteTimeComposition = () => (
    <ClockTimeComposition
        config={tenMinuteConfig}
        hourStates={tenMinuteStates}
        contentDuration={tenMinuteContentDuration}
    />
);
export const FiveMinuteTimeComposition = () => (
    <ClockTimeComposition
        config={fiveMinuteConfig}
        hourStates={fiveMinuteStates}
        contentDuration={fiveMinuteContentDuration}
    />
);
export const FiveMinuteTimeVariantComposition = () => (
    <ClockTimeComposition
        config={fiveMinuteVariantSetup.config}
        hourStates={fiveMinuteVariantStates}
        contentDuration={fiveMinuteVariantSetup.contentDuration}
    />
);
export const DigitalFiveMinuteTimeVariantComposition = () => (
    <ClockTimeComposition
        config={digitalFiveMinuteVariantSetup.config}
        hourStates={digitalFiveMinuteVariantSetup.states}
        contentDuration={digitalFiveMinuteVariantSetup.contentDuration}
    />
);
export const DigitalInformalHourTimeComposition = ({ startHour }: { startHour: number }) => {
    const setup = createDigitalInformalHourSetup(startHour);

    return (
        <ClockTimeComposition config={setup.config} hourStates={setup.states} contentDuration={setup.contentDuration} />
    );
};
export const InformalHourTimeComposition = ({ startHour }: { startHour: number }) => {
    const setup = createInformalHourSetup(startHour);

    return (
        <ClockTimeComposition config={setup.config} hourStates={setup.states} contentDuration={setup.contentDuration} />
    );
};
