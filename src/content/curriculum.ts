import { translate as t } from "@/i18n/translate";
import type { IconKey } from "./icons";

/**
 * Configuration for an interactive exercise. The `type` field is used by the
 * exercise registry to look up the component that renders it. Everything here
 * must stay serializable (no functions/components) so content can be authored
 * as data and rendered from a server component.
 */
export type ExerciseConfig = {
    /** Permanent identifier for progress tracking. Keep unchanged when reordering content. */
    id: string;
    type: "intro" | "number-speech-explainer" | "number-spelling-choice" | "analog-clock-choice" | "analog-clock-choice-24" | "analog-clock-choice-sequential" | "analog-clock-choice-sequential-24" | "analog-clock-choice-full-day" | "analog-clock-choice-pair" | "digital-clock-choice" | "grocery-scanner" | "hundreds-chart" | "context-number-listen" | "context-number-read" | "counting-match" | "number-line" | "number-line-listen" | "number-line-listen-pair" | "number-line-word" | "number-line-word-pair" | "number-line-read" | "number-word-choice" | "number-word-choice-audio" | "number-sort" | "number-sequence" | "number-match" | "number-match-fonts";
    /** Lowest number on the line. */
    min?: number;
    /** Highest number on the line. */
    max?: number;
    /** Number of randomized tasks in an exercise. */
    taskCount?: number;
    /** Number of prefilled reference cells in a hundreds-chart exercise. */
    hintCount?: number;
    /** Number of cells to complete in a hundreds-chart exercise. */
    inputCount?: number;
    /** Keep input rows supported by adjacent hints in an introductory hundreds chart. */
    guidedRows?: boolean;
    /** Width of a randomly selected number-line window for each task. */
    rangeSize?: number;
    /** Number of values displayed in sorting and sequence exercises. */
    itemCount?: number;
    /** Incorrect spelling pattern used by number-word recognition exercises. */
    spellingVariant?: "switched" | "missing-und" | "switched-missing-und" | "mixed";
    /** Explicit values shown by an intro slideshow. */
    values?: number[];
    /** Title shown on an intro slideshow's opening slide. */
    introTitle?: string;
    /** Minute value shown by analog clock exercises. */
    minutes?: number;
    /** Minute values alternated randomly within an analog clock exercise. */
    minuteOptions?: number[];
    /** Randomly alternate between quarter-past and quarter-to tasks. */
    randomQuarter?: boolean;
    /** Use official 24-hour notation for a digital clock prompt. */
    use24Hour?: boolean;
    /** Present clock-hour tasks in increasing order. */
    sequential?: boolean;
    /** Draw digital prompts from the complete 24-hour day. */
    fullDay?: boolean;
    /** Alternate equivalent 12- and 24-hour digital prompts. */
    pairedTimes?: boolean;
    /** Render answer choices as colloquial German time phrases. */
    informal?: boolean;
    /** Sentence set used by contextual listening exercises. */
    setNumber?: number;
    /** Curriculum identifier used for contextual listening audio storage. */
    contextId?: string;
    /** Which numbers show a label under the tick. */
    labeledNumbers?: number[];
    /** Expected direction for number sorting exercises. */
    sortOrder?: "ascending" | "descending";
    /** How many matching values learners need to find. */
    matchCount?: 2 | 3;
    /** How many number words the learner needs to match. */
    wordCount?: 1 | 2 | 3;
    /** How many numeric choices are displayed. */
    optionCount?: 3 | 4 | 5;
    /** Generate spoken targets progressively instead of loading prerecorded audio. */
    streamAudio?: boolean;
    /** Replace a digital time prompt with streamed spoken time. */
    audioPrompt?: boolean;
    /** How symbols are placed in counting exercises. */
    arrangement?: "grid" | "grid-10" | "grid-10-4" | "random";
    /** How many cards appear in counting exercises. */
    cardCount?: 4 | 6;
    /** Whether every card uses the same shape within a task. */
    sameShape?: boolean;
};

/**
 * A node in the curriculum tree. A node either groups more nodes (`children`)
 * or is a leaf that presents one or more `exercises`.
 */
export type CurriculumNode = {
    /** URL segment, unique among its siblings. */
    slug: string;
    title: string;
    description?: string;
    icon?: IconKey;
    children?: CurriculumNode[];
    exercises?: ExerciseConfig[];
};

const informalClockExercises = (exercises: ExerciseConfig[]): ExerciseConfig[] => exercises.map((exercise) => ({ ...exercise, informal: true }));

const digitalClockExercises = (exercises: ExerciseConfig[]): ExerciseConfig[] => exercises.map((exercise) => ({
    id: exercise.id,
    type: "digital-clock-choice",
    minutes: exercise.minutes,
    minuteOptions: exercise.minuteOptions,
    randomQuarter: exercise.randomQuarter,
    use24Hour: exercise.type === "analog-clock-choice-24" || exercise.type === "analog-clock-choice-sequential-24" || exercise.type === "analog-clock-choice-full-day",
    sequential: exercise.type === "analog-clock-choice-sequential" || exercise.type === "analog-clock-choice-sequential-24",
    fullDay: exercise.type === "analog-clock-choice-full-day",
    pairedTimes: exercise.type === "analog-clock-choice-pair",
    informal: exercise.informal,
}));

const digitalClockListeningExercises = (idPrefix: string, firstMinutes: number, secondMinutes: number): ExerciseConfig[] => [
    { id: `${idPrefix}-01`, type: "digital-clock-choice", minutes: firstMinutes, audioPrompt: true, streamAudio: true },
    { id: `${idPrefix}-02`, type: "digital-clock-choice", minutes: firstMinutes, use24Hour: true, audioPrompt: true, streamAudio: true },
    { id: `${idPrefix}-03`, type: "digital-clock-choice", minutes: firstMinutes, pairedTimes: true, audioPrompt: true, streamAudio: true },
    { id: `${idPrefix}-04`, type: "digital-clock-choice", minutes: secondMinutes, audioPrompt: true, streamAudio: true },
    { id: `${idPrefix}-05`, type: "digital-clock-choice", minutes: secondMinutes, use24Hour: true, audioPrompt: true, streamAudio: true },
    { id: `${idPrefix}-06`, type: "digital-clock-choice", minutes: secondMinutes, pairedTimes: true, audioPrompt: true, streamAudio: true },
    { id: `${idPrefix}-07`, type: "digital-clock-choice", minuteOptions: [firstMinutes, secondMinutes], audioPrompt: true, streamAudio: true },
    { id: `${idPrefix}-08`, type: "digital-clock-choice", minuteOptions: [firstMinutes, secondMinutes], use24Hour: true, audioPrompt: true, streamAudio: true },
    { id: `${idPrefix}-09`, type: "digital-clock-choice", minuteOptions: [firstMinutes, secondMinutes], pairedTimes: true, audioPrompt: true, streamAudio: true },
];

export const curriculum: CurriculumNode[] = [
    {
        slug: "zahlen-und-variablen",
        title: t("levels.zahlen-und-variablen.title"),
        description: t("levels.zahlen-und-variablen.description"),
        icon: "calculator",
        children: [
            {
                slug: "zahlen-benennen-und-schreiben",
                title: t("levels.zahlen-und-variablen.zahlen-benennen-und-schreiben"),
                children: [
                    {
                        slug: "zahlen-von-0-bis-10",
                        title: t("levels.zahlen-und-variablen.zahlen-von-0-bis-10"),
                        children: [
                            {
                                slug: "intro",
                                title: t("levels.zahlen-und-variablen.intro"),
                                exercises: [{ id: "exercise-0001", type: "intro", min: 0, max: 10 }],
                            },
                            {
                                slug: "zaehlen",
                                title: t("levels.zahlen-und-variablen.zaehlen"),
                                exercises: [
                                    { id: "exercise-0002", type: "counting-match", min: 0, max: 10, arrangement: "grid", cardCount: 4, sameShape: true },
                                    { id: "exercise-0003", type: "counting-match", min: 0, max: 10, arrangement: "grid", cardCount: 4 },
                                    { id: "exercise-0004", type: "counting-match", min: 0, max: 10, arrangement: "grid", cardCount: 6, sameShape: true },
                                    { id: "exercise-0005", type: "counting-match", min: 0, max: 10, arrangement: "grid", cardCount: 6 },
                                    { id: "exercise-0006", type: "counting-match", min: 0, max: 10, arrangement: "random", cardCount: 4 },
                                    { id: "exercise-0007", type: "counting-match", min: 0, max: 10, arrangement: "random", cardCount: 6 },
                                ],
                            },
                            {
                                slug: "zahlen-vergleichen",
                                title: t("levels.zahlen-und-variablen.zahlen-vergleichen"),
                                exercises: [
                                    { id: "exercise-0008", type: "number-match", min: 0, max: 10, matchCount: 2 },
                                    { id: "exercise-0009", type: "number-match-fonts", min: 0, max: 10, matchCount: 2 },
                                    { id: "exercise-0010", type: "number-match", min: 0, max: 10, matchCount: 3 },
                                    { id: "exercise-0011", type: "number-match-fonts", min: 0, max: 10, matchCount: 3 },
                                ],
                            },
                            {
                                slug: "zahlenstrahl",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl"),
                                exercises: [
                                    { id: "exercise-0012", type: "number-line", min: 0, max: 10, labeledNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                                    { id: "exercise-0013", type: "number-line", min: 0, max: 10, labeledNumbers: [0, 5, 10] },
                                    { id: "exercise-0014", type: "number-line", min: 0, max: 10, labeledNumbers: [0, 10] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-lesen",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-lesen"),
                                exercises: [
                                    { id: "exercise-0015", type: "number-line-read", min: 0, max: 10, labeledNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                                    { id: "exercise-0016", type: "number-line-read", min: 0, max: 10, labeledNumbers: [0, 5, 10] },
                                    { id: "exercise-0017", type: "number-line-read", min: 0, max: 10, labeledNumbers: [0, 10] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-hoeren"),
                                exercises: [
                                    { id: "exercise-0018", type: "number-line-listen", min: 0, max: 10, labeledNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                                    { id: "exercise-0019", type: "number-line-listen", min: 0, max: 10, labeledNumbers: [0, 5, 10] },
                                    { id: "exercise-0020", type: "number-line-listen", min: 0, max: 10, labeledNumbers: [0, 10] },
                                    { id: "exercise-0021", type: "number-line-listen-pair", min: 0, max: 10, labeledNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                                    { id: "exercise-0022", type: "number-line-listen-pair", min: 0, max: 10, labeledNumbers: [0, 5, 10] },
                                    { id: "exercise-0023", type: "number-line-listen-pair", min: 0, max: 10, labeledNumbers: [0, 10] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-zahlwoerter",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-zahlwoerter"),
                                exercises: [
                                    { id: "exercise-0024", type: "number-line-word", min: 0, max: 10, labeledNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                                    { id: "exercise-0025", type: "number-line-word", min: 0, max: 10, labeledNumbers: [0, 5, 10] },
                                    { id: "exercise-0026", type: "number-line-word", min: 0, max: 10, labeledNumbers: [0, 10] },
                                    { id: "exercise-0027", type: "number-line-word-pair", min: 0, max: 10, labeledNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                                    { id: "exercise-0028", type: "number-line-word-pair", min: 0, max: 10, labeledNumbers: [0, 5, 10] },
                                    { id: "exercise-0029", type: "number-line-word-pair", min: 0, max: 10, labeledNumbers: [0, 10] },
                                ],
                            },
                            {
                                slug: "zahlwoerter-lesen",
                                title: t("levels.zahlen-und-variablen.zahlwoerter-lesen"),
                                exercises: [
                                    { id: "exercise-0030", type: "number-word-choice", min: 0, max: 10, wordCount: 1, optionCount: 3 },
                                    { id: "exercise-0031", type: "number-word-choice", min: 0, max: 10, wordCount: 2, optionCount: 4 },
                                    { id: "exercise-0032", type: "number-word-choice", min: 0, max: 10, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-hoeren-und-auswaehlen",
                                title: t("levels.zahlen-und-variablen.zahlen-hoeren-und-auswaehlen"),
                                exercises: [
                                    { id: "exercise-0033", type: "number-word-choice-audio", min: 0, max: 10, wordCount: 1, optionCount: 3 },
                                    { id: "exercise-0034", type: "number-word-choice-audio", min: 0, max: 10, wordCount: 2, optionCount: 4 },
                                    { id: "exercise-0035", type: "number-word-choice-audio", min: 0, max: 10, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-sortieren",
                                title: t("levels.zahlen-und-variablen.zahlen-sortieren"),
                                exercises: [
                                    { id: "exercise-0036", type: "number-sort", min: 0, max: 10, sortOrder: "ascending" },
                                    { id: "exercise-0037", type: "number-sort", min: 0, max: 10, sortOrder: "descending" },
                                    { id: "exercise-0038", type: "number-sequence", min: 0, max: 10 },
                                ],
                            },
                            {
                                slug: "zahlen-im-kontext-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlen-im-kontext-hoeren"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ id: "exercise-0039-" + setNumber, type: "context-number-listen" as const, setNumber })),
                            },
                            {
                                slug: "zahlen-lesen",
                                title: t("levels.zahlen-und-variablen.zahlen-lesen"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ id: "exercise-0040-" + setNumber, type: "context-number-read" as const, setNumber, contextId: "a_01_01_12" })),
                            },
                        ],
                    },
                    {
                        slug: "zahlen-von-11-bis-24",
                        title: t("levels.zahlen-und-variablen.zahlen-von-11-bis-24"),
                        children: [
                            {
                                slug: "intro",
                                title: t("levels.zahlen-und-variablen.intro"),
                                exercises: [{ id: "exercise-0041", type: "intro", min: 11, max: 24 }],
                            },
                            {
                                slug: "zaehlen",
                                title: t("levels.zahlen-und-variablen.zaehlen"),
                                exercises: [
                                    { id: "exercise-0042", type: "counting-match", min: 11, max: 24, arrangement: "grid-10", cardCount: 4, sameShape: true },
                                    { id: "exercise-0043", type: "counting-match", min: 11, max: 24, arrangement: "grid-10", cardCount: 4 },
                                    { id: "exercise-0044", type: "counting-match", min: 11, max: 24, arrangement: "grid-10", cardCount: 6, sameShape: true },
                                    { id: "exercise-0045", type: "counting-match", min: 11, max: 24, arrangement: "grid-10", cardCount: 6 },
                                    { id: "exercise-0046", type: "counting-match", min: 11, max: 24, arrangement: "grid-10", cardCount: 4 },
                                    { id: "exercise-0047", type: "counting-match", min: 11, max: 24, arrangement: "grid-10", cardCount: 6 },
                                ],
                            },
                            {
                                slug: "zahlen-vergleichen",
                                title: t("levels.zahlen-und-variablen.zahlen-vergleichen"),
                                exercises: [
                                    { id: "exercise-0048", type: "number-match", min: 11, max: 24, matchCount: 2 },
                                    { id: "exercise-0049", type: "number-match-fonts", min: 11, max: 24, matchCount: 2 },
                                    { id: "exercise-0050", type: "number-match", min: 11, max: 24, matchCount: 3 },
                                    { id: "exercise-0051", type: "number-match-fonts", min: 11, max: 24, matchCount: 3 },
                                ],
                            },
                            {
                                slug: "zahlenstrahl",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl"),
                                exercises: [
                                    { id: "exercise-0052", type: "number-line", min: 10, max: 24, labeledNumbers: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
                                    { id: "exercise-0053", type: "number-line", min: 10, max: 24, labeledNumbers: [10, 17, 24] },
                                    { id: "exercise-0054", type: "number-line", min: 10, max: 24, labeledNumbers: [10, 24] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-lesen",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-lesen"),
                                exercises: [
                                    { id: "exercise-0055", type: "number-line-read", min: 11, max: 24, labeledNumbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
                                    { id: "exercise-0056", type: "number-line-read", min: 11, max: 24, labeledNumbers: [11, 18, 24] },
                                    { id: "exercise-0057", type: "number-line-read", min: 11, max: 24, labeledNumbers: [11, 24] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-hoeren"),
                                exercises: [
                                    { id: "exercise-0058", type: "number-line-listen", min: 11, max: 24, labeledNumbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
                                    { id: "exercise-0059", type: "number-line-listen", min: 11, max: 24, labeledNumbers: [11, 18, 24] },
                                    { id: "exercise-0060", type: "number-line-listen", min: 11, max: 24, labeledNumbers: [11, 24] },
                                    { id: "exercise-0061", type: "number-line-listen-pair", min: 11, max: 24, labeledNumbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
                                    { id: "exercise-0062", type: "number-line-listen-pair", min: 11, max: 24, labeledNumbers: [11, 18, 24] },
                                    { id: "exercise-0063", type: "number-line-listen-pair", min: 11, max: 24, labeledNumbers: [11, 24] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-zahlwoerter",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-zahlwoerter"),
                                exercises: [
                                    { id: "exercise-0064", type: "number-line-word", min: 11, max: 24, labeledNumbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
                                    { id: "exercise-0065", type: "number-line-word", min: 11, max: 24, labeledNumbers: [11, 18, 24] },
                                    { id: "exercise-0066", type: "number-line-word", min: 11, max: 24, labeledNumbers: [11, 24] },
                                    { id: "exercise-0067", type: "number-line-word-pair", min: 11, max: 24, labeledNumbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
                                    { id: "exercise-0068", type: "number-line-word-pair", min: 11, max: 24, labeledNumbers: [11, 18, 24] },
                                    { id: "exercise-0069", type: "number-line-word-pair", min: 11, max: 24, labeledNumbers: [11, 24] },
                                ],
                            },
                            {
                                slug: "zahlwoerter-lesen",
                                title: t("levels.zahlen-und-variablen.zahlwoerter-lesen"),
                                exercises: [
                                    { id: "exercise-0070", type: "number-word-choice", min: 11, max: 24, wordCount: 1, optionCount: 3 },
                                    { id: "exercise-0071", type: "number-word-choice", min: 11, max: 24, wordCount: 2, optionCount: 4 },
                                    { id: "exercise-0072", type: "number-word-choice", min: 11, max: 24, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-hoeren-und-auswaehlen",
                                title: t("levels.zahlen-und-variablen.zahlen-hoeren-und-auswaehlen"),
                                exercises: [
                                    { id: "exercise-0073", type: "number-word-choice-audio", min: 11, max: 24, wordCount: 1, optionCount: 3 },
                                    { id: "exercise-0074", type: "number-word-choice-audio", min: 11, max: 24, wordCount: 2, optionCount: 4 },
                                    { id: "exercise-0075", type: "number-word-choice-audio", min: 11, max: 24, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-sortieren",
                                title: t("levels.zahlen-und-variablen.zahlen-sortieren"),
                                exercises: [
                                    { id: "exercise-0076", type: "number-sort", min: 11, max: 21, sortOrder: "ascending" },
                                    { id: "exercise-0077", type: "number-sort", min: 11, max: 21, sortOrder: "descending" },
                                    { id: "exercise-0078", type: "number-sequence", min: 11, max: 21 },
                                ],
                            },
                            {
                                slug: "zahlen-im-kontext-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlen-im-kontext-hoeren"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ id: "exercise-0079-" + setNumber, type: "context-number-listen" as const, setNumber, contextId: "a_01_02_11" })),
                            },
                            {
                                slug: "zahlen-lesen",
                                title: t("levels.zahlen-und-variablen.zahlen-lesen"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ id: "exercise-0080-" + setNumber, type: "context-number-read" as const, setNumber, contextId: "a_01_02_12" })),
                            },
                        ],
                    },
                    {
                        slug: "zahlen-von-25-bis-31",
                        title: t("levels.zahlen-und-variablen.zahlen-von-25-bis-31"),
                        children: [
                            {
                                slug: "intro",
                                title: t("levels.zahlen-und-variablen.intro"),
                                exercises: [{ id: "exercise-0081", type: "intro", min: 25, max: 31 }],
                            },
                            {
                                slug: "zaehlen",
                                title: t("levels.zahlen-und-variablen.zaehlen"),
                                exercises: [
                                    { id: "exercise-0082", type: "counting-match", min: 25, max: 31, arrangement: "grid-10-4", cardCount: 4, sameShape: true },
                                    { id: "exercise-0083", type: "counting-match", min: 25, max: 31, arrangement: "grid-10-4", cardCount: 4 },
                                    { id: "exercise-0084", type: "counting-match", min: 25, max: 31, arrangement: "grid-10-4", cardCount: 6, sameShape: true },
                                    { id: "exercise-0085", type: "counting-match", min: 25, max: 31, arrangement: "grid-10-4", cardCount: 6 },
                                    { id: "exercise-0086", type: "counting-match", min: 25, max: 31, arrangement: "grid-10-4", cardCount: 4 },
                                    { id: "exercise-0087", type: "counting-match", min: 25, max: 31, arrangement: "grid-10-4", cardCount: 6 },
                                ],
                            },
                            {
                                slug: "zahlen-vergleichen",
                                title: t("levels.zahlen-und-variablen.zahlen-vergleichen"),
                                exercises: [
                                    { id: "exercise-0088", type: "number-match", min: 25, max: 31, matchCount: 2 },
                                    { id: "exercise-0089", type: "number-match-fonts", min: 25, max: 31, matchCount: 2 },
                                    { id: "exercise-0090", type: "number-match", min: 25, max: 31, matchCount: 3 },
                                    { id: "exercise-0091", type: "number-match-fonts", min: 25, max: 31, matchCount: 3 },
                                ],
                            },
                            {
                                slug: "zahlenstrahl",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl"),
                                exercises: [
                                    { id: "exercise-0092", type: "number-line", min: 25, max: 31, labeledNumbers: [25, 26, 27, 28, 29, 30, 31] },
                                    { id: "exercise-0093", type: "number-line", min: 25, max: 31, labeledNumbers: [25, 28, 31] },
                                    { id: "exercise-0094", type: "number-line", min: 25, max: 31, labeledNumbers: [25, 31] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-lesen",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-lesen"),
                                exercises: [
                                    { id: "exercise-0095", type: "number-line-read", min: 25, max: 31, labeledNumbers: [25, 26, 27, 28, 29, 30, 31] },
                                    { id: "exercise-0096", type: "number-line-read", min: 25, max: 31, labeledNumbers: [25, 28, 31] },
                                    { id: "exercise-0097", type: "number-line-read", min: 25, max: 31, labeledNumbers: [25, 31] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-hoeren"),
                                exercises: [
                                    { id: "exercise-0098", type: "number-line-listen", min: 25, max: 31, labeledNumbers: [25, 26, 27, 28, 29, 30, 31] },
                                    { id: "exercise-0099", type: "number-line-listen", min: 25, max: 31, labeledNumbers: [25, 28, 31] },
                                    { id: "exercise-0100", type: "number-line-listen", min: 25, max: 31, labeledNumbers: [25, 31] },
                                    { id: "exercise-0101", type: "number-line-listen-pair", min: 25, max: 31, labeledNumbers: [25, 26, 27, 28, 29, 30, 31] },
                                    { id: "exercise-0102", type: "number-line-listen-pair", min: 25, max: 31, labeledNumbers: [25, 28, 31] },
                                    { id: "exercise-0103", type: "number-line-listen-pair", min: 25, max: 31, labeledNumbers: [25, 31] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-zahlwoerter",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-zahlwoerter"),
                                exercises: [
                                    { id: "exercise-0104", type: "number-line-word", min: 25, max: 31, labeledNumbers: [25, 26, 27, 28, 29, 30, 31] },
                                    { id: "exercise-0105", type: "number-line-word", min: 25, max: 31, labeledNumbers: [25, 28, 31] },
                                    { id: "exercise-0106", type: "number-line-word", min: 25, max: 31, labeledNumbers: [25, 31] },
                                    { id: "exercise-0107", type: "number-line-word-pair", min: 25, max: 31, labeledNumbers: [25, 26, 27, 28, 29, 30, 31] },
                                    { id: "exercise-0108", type: "number-line-word-pair", min: 25, max: 31, labeledNumbers: [25, 28, 31] },
                                    { id: "exercise-0109", type: "number-line-word-pair", min: 25, max: 31, labeledNumbers: [25, 31] },
                                ],
                            },
                            {
                                slug: "zahlwoerter-lesen",
                                title: t("levels.zahlen-und-variablen.zahlwoerter-lesen"),
                                exercises: [
                                    { id: "exercise-0110", type: "number-word-choice", min: 25, max: 31, wordCount: 1, optionCount: 3 },
                                    { id: "exercise-0111", type: "number-word-choice", min: 25, max: 31, wordCount: 2, optionCount: 4 },
                                    { id: "exercise-0112", type: "number-word-choice", min: 25, max: 31, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-hoeren-und-auswaehlen",
                                title: t("levels.zahlen-und-variablen.zahlen-hoeren-und-auswaehlen"),
                                exercises: [
                                    { id: "exercise-0113", type: "number-word-choice-audio", min: 25, max: 31, wordCount: 1, optionCount: 3 },
                                    { id: "exercise-0114", type: "number-word-choice-audio", min: 25, max: 31, wordCount: 2, optionCount: 4 },
                                    { id: "exercise-0115", type: "number-word-choice-audio", min: 25, max: 31, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-sortieren",
                                title: t("levels.zahlen-und-variablen.zahlen-sortieren"),
                                exercises: [
                                    { id: "exercise-0116", type: "number-sort", min: 25, max: 31, sortOrder: "ascending" },
                                    { id: "exercise-0117", type: "number-sort", min: 25, max: 31, sortOrder: "descending" },
                                    { id: "exercise-0118", type: "number-sequence", min: 25, max: 31 },
                                ],
                            },
                            {
                                slug: "zahlen-im-kontext-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlen-im-kontext-hoeren"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ id: "exercise-0119-" + setNumber, type: "context-number-listen" as const, setNumber, contextId: "a_01_03_11" })),
                            },
                            {
                                slug: "zahlen-lesen",
                                title: t("levels.zahlen-und-variablen.zahlen-lesen"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ id: "exercise-0120-" + setNumber, type: "context-number-read" as const, setNumber, contextId: "a_01_03_12" })),
                            },
                        ],
                    },
                    {
                        slug: "zahlen-bis-100",
                        title: t("levels.zahlen-und-variablen.zahlen-bis-100"),
                        children: [
                            {
                                slug: "intro",
                                title: t("levels.zahlen-und-variablen.intro"),
                                exercises: [
                                    { id: "exercise-0121", type: "number-speech-explainer" },
                                    { id: "exercise-0122", type: "intro", values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], introTitle: "Die Zehnerzahlen von 0 bis 100" },
                                    { id: "exercise-0123", type: "intro", min: 30, max: 40, introTitle: "Die Zahlen von 30 bis 40" },
                                    { id: "exercise-0124", type: "intro", min: 40, max: 50, introTitle: "Die Zahlen von 40 bis 50" },
                                    { id: "exercise-0125", type: "intro", min: 50, max: 60, introTitle: "Die Zahlen von 50 bis 60" },
                                    { id: "exercise-0126", type: "intro", min: 60, max: 70, introTitle: "Die Zahlen von 60 bis 70" },
                                    { id: "exercise-0127", type: "intro", min: 70, max: 80, introTitle: "Die Zahlen von 70 bis 80" },
                                    { id: "exercise-0128", type: "intro", min: 80, max: 90, introTitle: "Die Zahlen von 80 bis 90" },
                                    { id: "exercise-0129", type: "intro", min: 90, max: 100, introTitle: "Die Zahlen von 90 bis 100" },
                                ],
                            },
                            {
                                slug: "zahlen-erkennen",
                                title: t("levels.zahlen-und-variablen.zahlen-erkennen"),
                                exercises: [
                                    { id: "exercise-0130", type: "number-spelling-choice" },
                                    { id: "exercise-0131", type: "number-spelling-choice", spellingVariant: "switched" },
                                    { id: "exercise-0132", type: "number-spelling-choice", spellingVariant: "missing-und" },
                                    { id: "exercise-0133", type: "number-spelling-choice", spellingVariant: "switched-missing-und" },
                                    { id: "exercise-0134", type: "number-spelling-choice", spellingVariant: "mixed" },
                                ],
                            },
                            {
                                slug: "zahlen-vergleichen",
                                title: t("levels.zahlen-und-variablen.zahlen-vergleichen"),
                                exercises: [
                                    { id: "exercise-0135", type: "number-match", min: 30, max: 100, matchCount: 2 },
                                    { id: "exercise-0136", type: "number-match-fonts", min: 30, max: 100, matchCount: 2 },
                                    { id: "exercise-0137", type: "number-match", min: 30, max: 100, matchCount: 3 },
                                    { id: "exercise-0138", type: "number-match-fonts", min: 30, max: 100, matchCount: 3 },
                                ],
                            },
                            {
                                slug: "zahlenstrahl",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl"),
                                exercises: [
                                    { id: "exercise-0139", type: "number-line", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 31, 32, 33] },
                                    { id: "exercise-0140", type: "number-line", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 35, 40] },
                                    { id: "exercise-0141", type: "number-line", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 40] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-lesen",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-lesen"),
                                exercises: [
                                    { id: "exercise-0142", type: "number-line-read", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 31, 32, 33] },
                                    { id: "exercise-0143", type: "number-line-read", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 35, 40] },
                                    { id: "exercise-0144", type: "number-line-read", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 40] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-hoeren"),
                                exercises: [
                                    { id: "exercise-0145", type: "number-line-listen", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 31, 32, 33] },
                                    { id: "exercise-0146", type: "number-line-listen", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 35, 40] },
                                    { id: "exercise-0147", type: "number-line-listen", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 40] },
                                    { id: "exercise-0148", type: "number-line-listen-pair", min: 30, max: 100, rangeSize: 10, labeledNumbers: [30, 31, 32, 33] },
                                    { id: "exercise-0149", type: "number-line-listen-pair", min: 30, max: 100, rangeSize: 10, labeledNumbers: [30, 35, 40] },
                                    { id: "exercise-0150", type: "number-line-listen-pair", min: 30, max: 100, rangeSize: 10, labeledNumbers: [30, 40] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-zahlwoerter",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-zahlwoerter"),
                                exercises: [
                                    { id: "exercise-0151", type: "number-line-word", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 31, 32, 33] },
                                    { id: "exercise-0152", type: "number-line-word", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 35, 40] },
                                    { id: "exercise-0153", type: "number-line-word", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 40] },
                                    { id: "exercise-0154", type: "number-line-word-pair", min: 30, max: 100, rangeSize: 10, labeledNumbers: [30, 31, 32, 33] },
                                    { id: "exercise-0155", type: "number-line-word-pair", min: 30, max: 100, rangeSize: 10, labeledNumbers: [30, 35, 40] },
                                    { id: "exercise-0156", type: "number-line-word-pair", min: 30, max: 100, rangeSize: 10, labeledNumbers: [30, 40] },
                                ],
                            },
                            {
                                slug: "zahlwoerter-lesen",
                                title: t("levels.zahlen-und-variablen.zahlwoerter-lesen"),
                                exercises: [
                                    { id: "exercise-0157", type: "number-word-choice", min: 30, max: 100, wordCount: 1, optionCount: 3 },
                                    { id: "exercise-0158", type: "number-word-choice", min: 30, max: 100, wordCount: 2, optionCount: 4 },
                                    { id: "exercise-0159", type: "number-word-choice", min: 30, max: 100, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-hoeren-und-auswaehlen",
                                title: t("levels.zahlen-und-variablen.zahlen-hoeren-und-auswaehlen"),
                                exercises: [
                                    { id: "exercise-0160", type: "number-word-choice-audio", min: 30, max: 100, wordCount: 1, optionCount: 3 },
                                    { id: "exercise-0161", type: "number-word-choice-audio", min: 30, max: 100, wordCount: 2, optionCount: 4 },
                                    { id: "exercise-0162", type: "number-word-choice-audio", min: 30, max: 100, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-sortieren",
                                title: t("levels.zahlen-und-variablen.zahlen-sortieren"),
                                exercises: [
                                    { id: "exercise-0163", type: "number-sort", min: 30, max: 100, itemCount: 10, sortOrder: "ascending" },
                                    { id: "exercise-0164", type: "number-sort", min: 30, max: 100, itemCount: 10, sortOrder: "descending" },
                                    { id: "exercise-0165", type: "number-sequence", min: 30, max: 100, itemCount: 10 },
                                ],
                            },
                            {
                                slug: "zahlen-im-kontext-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlen-im-kontext-hoeren"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ id: "exercise-0166-" + setNumber, type: "context-number-listen" as const, setNumber, contextId: "a_01_04_11" })),
                            },
                            {
                                slug: "zahlen-lesen",
                                title: t("levels.zahlen-und-variablen.zahlen-lesen"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ id: "exercise-0167-" + setNumber, type: "context-number-read" as const, setNumber, contextId: "a_01_04_12" })),
                            },
                            {
                                slug: "hundertertafeln",
                                title: t("levels.zahlen-und-variablen.hundertertafeln"),
                                exercises: [
                                    { id: "exercise-0168", type: "hundreds-chart", hintCount: 4, inputCount: 4, guidedRows: true },
                                    { id: "exercise-0169", type: "hundreds-chart", hintCount: 3, inputCount: 5 },
                                    { id: "exercise-0170", type: "hundreds-chart", hintCount: 2, inputCount: 7 },
                                ],
                            },
                        ],
                    },
                    {
                        slug: "zahlen-bis-1000",
                        title: t("levels.zahlen-und-variablen.zahlen-bis-1000"),
                        children: [
                            {
                                slug: "intro",
                                title: t("levels.zahlen-und-variablen.intro"),
                                exercises: [
                                    { id: "exercise-0171", type: "intro", values: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], introTitle: "Die Hunderterzahlen von 0 bis 1000" },
                                    { id: "exercise-0172", type: "intro", min: 100, max: 200, introTitle: "Die Zahlen von 100 bis 200" },
                                    { id: "exercise-0173", type: "intro", min: 200, max: 300, introTitle: "Die Zahlen von 200 bis 300" },
                                    { id: "exercise-0174", type: "intro", min: 300, max: 400, introTitle: "Die Zahlen von 300 bis 400" },
                                    { id: "exercise-0175", type: "intro", min: 400, max: 500, introTitle: "Die Zahlen von 400 bis 500" },
                                    { id: "exercise-0176", type: "intro", min: 500, max: 600, introTitle: "Die Zahlen von 500 bis 600" },
                                    { id: "exercise-0177", type: "intro", min: 600, max: 700, introTitle: "Die Zahlen von 600 bis 700" },
                                    { id: "exercise-0178", type: "intro", min: 700, max: 800, introTitle: "Die Zahlen von 700 bis 800" },
                                    { id: "exercise-0179", type: "intro", min: 800, max: 900, introTitle: "Die Zahlen von 800 bis 900" },
                                    { id: "exercise-0180", type: "intro", min: 900, max: 1000, introTitle: "Die Zahlen von 900 bis 1000" },
                                ],
                            },
                            {
                                slug: "zahlen-erkennen",
                                title: t("levels.zahlen-und-variablen.zahlen-erkennen"),
                                exercises: [
                                    { id: "exercise-0181", type: "number-spelling-choice", min: 100, max: 1000 },
                                    { id: "exercise-0182", type: "number-spelling-choice", min: 100, max: 999, spellingVariant: "switched" },
                                    { id: "exercise-0183", type: "number-spelling-choice", min: 100, max: 999, spellingVariant: "missing-und" },
                                    { id: "exercise-0184", type: "number-spelling-choice", min: 100, max: 999, spellingVariant: "switched-missing-und" },
                                    { id: "exercise-0185", type: "number-spelling-choice", min: 100, max: 999, spellingVariant: "mixed" },
                                ],
                            },
                            {
                                slug: "zahlen-vergleichen",
                                title: t("levels.zahlen-und-variablen.zahlen-vergleichen"),
                                exercises: [
                                    { id: "exercise-0186", type: "number-match", min: 100, max: 1000, matchCount: 2 },
                                    { id: "exercise-0187", type: "number-match-fonts", min: 100, max: 1000, matchCount: 2 },
                                    { id: "exercise-0188", type: "number-match", min: 100, max: 1000, matchCount: 3 },
                                    { id: "exercise-0189", type: "number-match-fonts", min: 100, max: 1000, matchCount: 3 },
                                ],
                            },
                            {
                                slug: "zahlenstrahl",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl"),
                                exercises: [
                                    { id: "exercise-0190", type: "number-line", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 101, 102, 103] },
                                    { id: "exercise-0191", type: "number-line", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 105, 110] },
                                    { id: "exercise-0192", type: "number-line", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 110] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-lesen",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-lesen"),
                                exercises: [
                                    { id: "exercise-0193", type: "number-line-read", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 101, 102, 103] },
                                    { id: "exercise-0194", type: "number-line-read", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 105, 110] },
                                    { id: "exercise-0195", type: "number-line-read", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 110] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-hoeren"),
                                exercises: [
                                    { id: "exercise-0196", type: "number-line-listen", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 101, 102, 103] },
                                    { id: "exercise-0197", type: "number-line-listen", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 105, 110] },
                                    { id: "exercise-0198", type: "number-line-listen", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 110] },
                                    { id: "exercise-0199", type: "number-line-listen-pair", min: 100, max: 1000, rangeSize: 10, labeledNumbers: [100, 101, 102, 103] },
                                    { id: "exercise-0200", type: "number-line-listen-pair", min: 100, max: 1000, rangeSize: 10, labeledNumbers: [100, 105, 110] },
                                    { id: "exercise-0201", type: "number-line-listen-pair", min: 100, max: 1000, rangeSize: 10, labeledNumbers: [100, 110] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-zahlwoerter",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-zahlwoerter"),
                                exercises: [
                                    { id: "exercise-0202", type: "number-line-word", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 101, 102, 103] },
                                    { id: "exercise-0203", type: "number-line-word", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 105, 110] },
                                    { id: "exercise-0204", type: "number-line-word", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 110] },
                                    { id: "exercise-0205", type: "number-line-word-pair", min: 100, max: 1000, rangeSize: 10, labeledNumbers: [100, 101, 102, 103] },
                                    { id: "exercise-0206", type: "number-line-word-pair", min: 100, max: 1000, rangeSize: 10, labeledNumbers: [100, 105, 110] },
                                    { id: "exercise-0207", type: "number-line-word-pair", min: 100, max: 1000, rangeSize: 10, labeledNumbers: [100, 110] },
                                ],
                            },
                            {
                                slug: "zahlwoerter-lesen",
                                title: t("levels.zahlen-und-variablen.zahlwoerter-lesen"),
                                exercises: [
                                    { id: "exercise-0208", type: "number-word-choice", min: 100, max: 1000, wordCount: 1, optionCount: 3 },
                                    { id: "exercise-0209", type: "number-word-choice", min: 100, max: 1000, wordCount: 2, optionCount: 4 },
                                    { id: "exercise-0210", type: "number-word-choice", min: 100, max: 1000, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-hoeren-und-auswaehlen",
                                title: t("levels.zahlen-und-variablen.zahlen-hoeren-und-auswaehlen"),
                                exercises: [
                                    { id: "exercise-0211", type: "number-word-choice-audio", min: 100, max: 1000, wordCount: 1, optionCount: 3 },
                                    { id: "exercise-0212", type: "number-word-choice-audio", min: 100, max: 1000, wordCount: 2, optionCount: 4 },
                                    { id: "exercise-0213", type: "number-word-choice-audio", min: 100, max: 1000, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-sortieren",
                                title: t("levels.zahlen-und-variablen.zahlen-sortieren"),
                                exercises: [
                                    { id: "exercise-0214", type: "number-sort", min: 100, max: 1000, itemCount: 10, sortOrder: "ascending" },
                                    { id: "exercise-0215", type: "number-sort", min: 100, max: 1000, itemCount: 10, sortOrder: "descending" },
                                    { id: "exercise-0216", type: "number-sequence", min: 100, max: 1000, itemCount: 10 },
                                ],
                            },
                        ],
                    },
                    {
                        slug: "zahlen-bis-10000",
                        title: t("levels.zahlen-und-variablen.zahlen-bis-10000"),
                        children: [
                            {
                                slug: "zahlen-hoeren-und-auswaehlen",
                                title: t("levels.zahlen-und-variablen.zahlen-hoeren-und-auswaehlen"),
                                exercises: [
                                    { id: "exercise-a-01-06-01-01", type: "number-word-choice-audio", min: 1000, max: 10000, wordCount: 1, optionCount: 3, streamAudio: true },
                                    { id: "exercise-a-01-06-01-02", type: "number-word-choice-audio", min: 1000, max: 10000, wordCount: 2, optionCount: 4, streamAudio: true },
                                    { id: "exercise-a-01-06-01-03", type: "number-word-choice-audio", min: 1000, max: 10000, wordCount: 3, optionCount: 5, streamAudio: true },
                                ],
                            },
                        ],
                    },
                ],
            },
            { slug: "dezimalsystem-verstehen", title: t("levels.zahlen-und-variablen.dezimalsystem-verstehen") },
            { slug: "informationen-sortieren", title: t("levels.zahlen-und-variablen.informationen-sortieren") },
            { slug: "variablen-verstehen", title: t("levels.zahlen-und-variablen.variablen-verstehen") },
        ],
    },
    {
        slug: "groessen-und-einheiten",
        title: t("levels.groessen-und-einheiten.title"),
        description: t("levels.groessen-und-einheiten.description"),
        icon: "ruler",
        children: [
            {
                slug: "geld",
                title: t("levels.groessen-und-einheiten.geld"),
                children: [
                    {
                        slug: "preise",
                        title: t("levels.groessen-und-einheiten.preise"),
                        children: [
                            {
                                slug: "lebensmittel-scannen",
                                title: t("levels.groessen-und-einheiten.lebensmittel-scannen"),
                                exercises: [{ id: "exercise-0217", type: "grocery-scanner" }],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        slug: "raum-und-zeit",
        title: t("levels.raum-und-zeit.title"),
        description: t("levels.raum-und-zeit.description"),
        icon: "clock",
        children: [
            {
                slug: "uhrzeiten",
                title: t("levels.raum-und-zeit.uhrzeiten"),
                children: [
                    {
                        slug: "digital-offiziell",
                        title: t("levels.raum-und-zeit.digital-offiziell"),
                        children: [
                            {
                                slug: "xx-00",
                                title: t("levels.raum-und-zeit.xx-00"),
                                exercises: [
                                    { id: "exercise-0218", type: "digital-clock-choice", sequential: true },
                                    { id: "exercise-0219", type: "digital-clock-choice" },
                                    { id: "exercise-0220", type: "digital-clock-choice", use24Hour: true, sequential: true },
                                    { id: "exercise-0221", type: "digital-clock-choice", use24Hour: true },
                                    { id: "exercise-0222", type: "digital-clock-choice", use24Hour: true, fullDay: true },
                                    { id: "exercise-0223", type: "digital-clock-choice", pairedTimes: true },
                                    { id: "exercise-0224", type: "digital-clock-choice", minutes: 30, sequential: true },
                                    { id: "exercise-0225", type: "digital-clock-choice", minutes: 30 },
                                    { id: "exercise-0226", type: "digital-clock-choice", minutes: 30, use24Hour: true, sequential: true },
                                    { id: "exercise-0227", type: "digital-clock-choice", minutes: 30, use24Hour: true },
                                    { id: "exercise-0228", type: "digital-clock-choice", minutes: 30, use24Hour: true, fullDay: true },
                                    { id: "exercise-0229", type: "digital-clock-choice", minutes: 30, pairedTimes: true },
                                ],
                            },
                            {
                                slug: "xx-00-hoeren",
                                title: t("levels.raum-und-zeit.xx-00-hoeren"),
                                exercises: [
                                    { id: "exercise-c-01-01-02-01", type: "digital-clock-choice", sequential: true, audioPrompt: true, streamAudio: true },
                                    { id: "exercise-c-01-01-02-02", type: "digital-clock-choice", audioPrompt: true, streamAudio: true },
                                    { id: "exercise-c-01-01-02-03", type: "digital-clock-choice", use24Hour: true, sequential: true, audioPrompt: true, streamAudio: true },
                                    { id: "exercise-c-01-01-02-04", type: "digital-clock-choice", use24Hour: true, audioPrompt: true, streamAudio: true },
                                    { id: "exercise-c-01-01-02-05", type: "digital-clock-choice", use24Hour: true, fullDay: true, audioPrompt: true, streamAudio: true },
                                    { id: "exercise-c-01-01-02-06", type: "digital-clock-choice", pairedTimes: true, audioPrompt: true, streamAudio: true },
                                ],
                            },
                            {
                                slug: "xx-15-xx-45",
                                title: t("levels.raum-und-zeit.xx-15-xx-45"),
                                exercises: digitalClockExercises([
                                    { id: "exercise-0230", type: "analog-clock-choice", minutes: 15 },
                                    { id: "exercise-0231", type: "analog-clock-choice-24", minutes: 15 },
                                    { id: "exercise-0232", type: "analog-clock-choice-pair", minutes: 15 },
                                    { id: "exercise-0233", type: "analog-clock-choice", minutes: 45 },
                                    { id: "exercise-0234", type: "analog-clock-choice-24", minutes: 45 },
                                    { id: "exercise-0235", type: "analog-clock-choice-pair", minutes: 45 },
                                    { id: "exercise-0236", type: "analog-clock-choice", randomQuarter: true },
                                    { id: "exercise-0237", type: "analog-clock-choice-24", randomQuarter: true },
                                    { id: "exercise-0238", type: "analog-clock-choice-pair", randomQuarter: true },
                                ]),
                            },
                            {
                                slug: "xx-15-xx-45-hoeren",
                                title: t("levels.raum-und-zeit.xx-15-xx-45-hoeren"),
                                exercises: digitalClockListeningExercises("exercise-c-01-01-04", 15, 45),
                            },
                            {
                                slug: "xx-05-xx-55",
                                title: t("levels.raum-und-zeit.xx-05-xx-55"),
                                exercises: digitalClockExercises([
                                    { id: "exercise-0239", type: "analog-clock-choice", minutes: 5 },
                                    { id: "exercise-0240", type: "analog-clock-choice-24", minutes: 5 },
                                    { id: "exercise-0241", type: "analog-clock-choice-pair", minutes: 5 },
                                    { id: "exercise-0242", type: "analog-clock-choice", minutes: 55 },
                                    { id: "exercise-0243", type: "analog-clock-choice-24", minutes: 55 },
                                    { id: "exercise-0244", type: "analog-clock-choice-pair", minutes: 55 },
                                    { id: "exercise-0245", type: "analog-clock-choice", minuteOptions: [5, 55] },
                                    { id: "exercise-0246", type: "analog-clock-choice-24", minuteOptions: [5, 55] },
                                    { id: "exercise-0247", type: "analog-clock-choice-pair", minuteOptions: [5, 55] },
                                ]),
                            },
                            {
                                slug: "xx-05-xx-55-hoeren",
                                title: t("levels.raum-und-zeit.xx-05-xx-55-hoeren"),
                                exercises: digitalClockListeningExercises("exercise-c-01-01-06", 5, 55),
                            },
                            {
                                slug: "xx-10-xx-50",
                                title: t("levels.raum-und-zeit.xx-10-xx-50"),
                                exercises: digitalClockExercises([
                                    { id: "exercise-0248", type: "analog-clock-choice", minutes: 10 },
                                    { id: "exercise-0249", type: "analog-clock-choice-24", minutes: 10 },
                                    { id: "exercise-0250", type: "analog-clock-choice-pair", minutes: 10 },
                                    { id: "exercise-0251", type: "analog-clock-choice", minutes: 50 },
                                    { id: "exercise-0252", type: "analog-clock-choice-24", minutes: 50 },
                                    { id: "exercise-0253", type: "analog-clock-choice-pair", minutes: 50 },
                                    { id: "exercise-0254", type: "analog-clock-choice", minuteOptions: [10, 50] },
                                    { id: "exercise-0255", type: "analog-clock-choice-24", minuteOptions: [10, 50] },
                                    { id: "exercise-0256", type: "analog-clock-choice-pair", minuteOptions: [10, 50] },
                                ]),
                            },
                            {
                                slug: "xx-10-xx-50-hoeren",
                                title: t("levels.raum-und-zeit.xx-10-xx-50-hoeren"),
                                exercises: digitalClockListeningExercises("exercise-c-01-01-08", 10, 50),
                            },
                            {
                                slug: "xx-20-xx-40",
                                title: t("levels.raum-und-zeit.xx-20-xx-40"),
                                exercises: digitalClockExercises([
                                    { id: "exercise-0257", type: "analog-clock-choice", minutes: 20 },
                                    { id: "exercise-0258", type: "analog-clock-choice-24", minutes: 20 },
                                    { id: "exercise-0259", type: "analog-clock-choice-pair", minutes: 20 },
                                    { id: "exercise-0260", type: "analog-clock-choice", minutes: 40 },
                                    { id: "exercise-0261", type: "analog-clock-choice-24", minutes: 40 },
                                    { id: "exercise-0262", type: "analog-clock-choice-pair", minutes: 40 },
                                    { id: "exercise-0263", type: "analog-clock-choice", minuteOptions: [20, 40] },
                                    { id: "exercise-0264", type: "analog-clock-choice-24", minuteOptions: [20, 40] },
                                    { id: "exercise-0265", type: "analog-clock-choice-pair", minuteOptions: [20, 40] },
                                ]),
                            },
                            {
                                slug: "xx-20-xx-40-hoeren",
                                title: t("levels.raum-und-zeit.xx-20-xx-40-hoeren"),
                                exercises: digitalClockListeningExercises("exercise-c-01-01-10", 20, 40),
                            },
                            {
                                slug: "xx-25-xx-35",
                                title: t("levels.raum-und-zeit.xx-25-xx-35"),
                                exercises: digitalClockExercises([
                                    { id: "exercise-0266", type: "analog-clock-choice", minutes: 25 },
                                    { id: "exercise-0267", type: "analog-clock-choice-24", minutes: 25 },
                                    { id: "exercise-0268", type: "analog-clock-choice-pair", minutes: 25 },
                                    { id: "exercise-0269", type: "analog-clock-choice", minutes: 35 },
                                    { id: "exercise-0270", type: "analog-clock-choice-24", minutes: 35 },
                                    { id: "exercise-0271", type: "analog-clock-choice-pair", minutes: 35 },
                                    { id: "exercise-0272", type: "analog-clock-choice", minuteOptions: [25, 35] },
                                    { id: "exercise-0273", type: "analog-clock-choice-24", minuteOptions: [25, 35] },
                                    { id: "exercise-0274", type: "analog-clock-choice-pair", minuteOptions: [25, 35] },
                                ]),
                            },
                            {
                                slug: "xx-25-xx-35-hoeren",
                                title: t("levels.raum-und-zeit.xx-25-xx-35-hoeren"),
                                exercises: digitalClockListeningExercises("exercise-c-01-01-12", 25, 35),
                            },
                        ],
                    },
                    {
                        slug: "digital-inoffiziell",
                        title: t("levels.raum-und-zeit.digital-inoffiziell"),
                        children: [
                            {
                                slug: "xx-00",
                                title: t("levels.raum-und-zeit.xx-00"),
                                exercises: digitalClockExercises(informalClockExercises([
                                    { id: "exercise-0275", type: "analog-clock-choice-sequential" }, { id: "exercise-0276", type: "analog-clock-choice" }, { id: "exercise-0277", type: "analog-clock-choice-sequential-24" }, { id: "exercise-0278", type: "analog-clock-choice-24" }, { id: "exercise-0279", type: "analog-clock-choice-full-day" }, { id: "exercise-0280", type: "analog-clock-choice-pair" },
                                    { id: "exercise-0281", type: "analog-clock-choice-sequential", minutes: 30 }, { id: "exercise-0282", type: "analog-clock-choice", minutes: 30 }, { id: "exercise-0283", type: "analog-clock-choice-sequential-24", minutes: 30 }, { id: "exercise-0284", type: "analog-clock-choice-24", minutes: 30 }, { id: "exercise-0285", type: "analog-clock-choice-full-day", minutes: 30 }, { id: "exercise-0286", type: "analog-clock-choice-pair", minutes: 30 },
                                ])),
                            },
                            {
                                slug: "xx-15-xx-45",
                                title: t("levels.raum-und-zeit.xx-15-xx-45"),
                                exercises: digitalClockExercises(informalClockExercises([
                                    { id: "exercise-0287", type: "analog-clock-choice", minutes: 15 }, { id: "exercise-0288", type: "analog-clock-choice-24", minutes: 15 }, { id: "exercise-0289", type: "analog-clock-choice-pair", minutes: 15 },
                                    { id: "exercise-0290", type: "analog-clock-choice", minutes: 45 }, { id: "exercise-0291", type: "analog-clock-choice-24", minutes: 45 }, { id: "exercise-0292", type: "analog-clock-choice-pair", minutes: 45 },
                                    { id: "exercise-0293", type: "analog-clock-choice", randomQuarter: true }, { id: "exercise-0294", type: "analog-clock-choice-24", randomQuarter: true }, { id: "exercise-0295", type: "analog-clock-choice-pair", randomQuarter: true },
                                ])),
                            },
                            {
                                slug: "xx-05-xx-55",
                                title: t("levels.raum-und-zeit.xx-05-xx-55"),
                                exercises: digitalClockExercises(informalClockExercises([
                                    { id: "exercise-0296", type: "analog-clock-choice", minutes: 5 }, { id: "exercise-0297", type: "analog-clock-choice-24", minutes: 5 }, { id: "exercise-0298", type: "analog-clock-choice-pair", minutes: 5 },
                                    { id: "exercise-0299", type: "analog-clock-choice", minutes: 55 }, { id: "exercise-0300", type: "analog-clock-choice-24", minutes: 55 }, { id: "exercise-0301", type: "analog-clock-choice-pair", minutes: 55 },
                                    { id: "exercise-0302", type: "analog-clock-choice", minuteOptions: [5, 55] }, { id: "exercise-0303", type: "analog-clock-choice-24", minuteOptions: [5, 55] }, { id: "exercise-0304", type: "analog-clock-choice-pair", minuteOptions: [5, 55] },
                                ])),
                            },
                            {
                                slug: "xx-10-xx-50",
                                title: t("levels.raum-und-zeit.xx-10-xx-50"),
                                exercises: digitalClockExercises(informalClockExercises([
                                    { id: "exercise-0305", type: "analog-clock-choice", minutes: 10 }, { id: "exercise-0306", type: "analog-clock-choice-24", minutes: 10 }, { id: "exercise-0307", type: "analog-clock-choice-pair", minutes: 10 },
                                    { id: "exercise-0308", type: "analog-clock-choice", minutes: 50 }, { id: "exercise-0309", type: "analog-clock-choice-24", minutes: 50 }, { id: "exercise-0310", type: "analog-clock-choice-pair", minutes: 50 },
                                    { id: "exercise-0311", type: "analog-clock-choice", minuteOptions: [10, 50] }, { id: "exercise-0312", type: "analog-clock-choice-24", minuteOptions: [10, 50] }, { id: "exercise-0313", type: "analog-clock-choice-pair", minuteOptions: [10, 50] },
                                ])),
                            },
                            {
                                slug: "xx-20-xx-40",
                                title: t("levels.raum-und-zeit.xx-20-xx-40"),
                                exercises: digitalClockExercises(informalClockExercises([
                                    { id: "exercise-0314", type: "analog-clock-choice", minutes: 20 }, { id: "exercise-0315", type: "analog-clock-choice-24", minutes: 20 }, { id: "exercise-0316", type: "analog-clock-choice-pair", minutes: 20 },
                                    { id: "exercise-0317", type: "analog-clock-choice", minutes: 40 }, { id: "exercise-0318", type: "analog-clock-choice-24", minutes: 40 }, { id: "exercise-0319", type: "analog-clock-choice-pair", minutes: 40 },
                                    { id: "exercise-0320", type: "analog-clock-choice", minuteOptions: [20, 40] }, { id: "exercise-0321", type: "analog-clock-choice-24", minuteOptions: [20, 40] }, { id: "exercise-0322", type: "analog-clock-choice-pair", minuteOptions: [20, 40] },
                                ])),
                            },
                            {
                                slug: "xx-25-xx-35",
                                title: t("levels.raum-und-zeit.xx-25-xx-35"),
                                exercises: digitalClockExercises(informalClockExercises([
                                    { id: "exercise-0323", type: "analog-clock-choice", minutes: 25 }, { id: "exercise-0324", type: "analog-clock-choice-24", minutes: 25 }, { id: "exercise-0325", type: "analog-clock-choice-pair", minutes: 25 },
                                    { id: "exercise-0326", type: "analog-clock-choice", minutes: 35 }, { id: "exercise-0327", type: "analog-clock-choice-24", minutes: 35 }, { id: "exercise-0328", type: "analog-clock-choice-pair", minutes: 35 },
                                    { id: "exercise-0329", type: "analog-clock-choice", minuteOptions: [25, 35] }, { id: "exercise-0330", type: "analog-clock-choice-24", minuteOptions: [25, 35] }, { id: "exercise-0331", type: "analog-clock-choice-pair", minuteOptions: [25, 35] },
                                ])),
                            },
                        ],
                    },
                    {
                        slug: "analog-offiziell",
                        title: t("levels.raum-und-zeit.analog-offiziell"),
                        children: [
                            {
                                slug: "xx-00",
                                title: t("levels.raum-und-zeit.xx-00"),
                                exercises: [
                                    { id: "exercise-0332", type: "analog-clock-choice-sequential" },
                                    { id: "exercise-0333", type: "analog-clock-choice" },
                                    { id: "exercise-0334", type: "analog-clock-choice-sequential-24" },
                                    { id: "exercise-0335", type: "analog-clock-choice-24" },
                                    { id: "exercise-0336", type: "analog-clock-choice-full-day" },
                                    { id: "exercise-0337", type: "analog-clock-choice-pair" },
                                    { id: "exercise-0338", type: "analog-clock-choice-sequential", minutes: 30 },
                                    { id: "exercise-0339", type: "analog-clock-choice", minutes: 30 },
                                    { id: "exercise-0340", type: "analog-clock-choice-sequential-24", minutes: 30 },
                                    { id: "exercise-0341", type: "analog-clock-choice-24", minutes: 30 },
                                    { id: "exercise-0342", type: "analog-clock-choice-full-day", minutes: 30 },
                                    { id: "exercise-0343", type: "analog-clock-choice-pair", minutes: 30 },
                                ],
                            },
                            {
                                slug: "xx-15-xx-45",
                                title: t("levels.raum-und-zeit.xx-15-xx-45"),
                                exercises: [
                                    { id: "exercise-0344", type: "analog-clock-choice", minutes: 15 },
                                    { id: "exercise-0345", type: "analog-clock-choice-24", minutes: 15 },
                                    { id: "exercise-0346", type: "analog-clock-choice-pair", minutes: 15 },
                                    { id: "exercise-0347", type: "analog-clock-choice", minutes: 45 },
                                    { id: "exercise-0348", type: "analog-clock-choice-24", minutes: 45 },
                                    { id: "exercise-0349", type: "analog-clock-choice-pair", minutes: 45 },
                                    { id: "exercise-0350", type: "analog-clock-choice", randomQuarter: true },
                                    { id: "exercise-0351", type: "analog-clock-choice-24", randomQuarter: true },
                                    { id: "exercise-0352", type: "analog-clock-choice-pair", randomQuarter: true },
                                ],
                            },
                            {
                                slug: "xx-05-xx-55",
                                title: t("levels.raum-und-zeit.xx-05-xx-55"),
                                exercises: [
                                    { id: "exercise-0353", type: "analog-clock-choice", minutes: 5 },
                                    { id: "exercise-0354", type: "analog-clock-choice-24", minutes: 5 },
                                    { id: "exercise-0355", type: "analog-clock-choice-pair", minutes: 5 },
                                    { id: "exercise-0356", type: "analog-clock-choice", minutes: 55 },
                                    { id: "exercise-0357", type: "analog-clock-choice-24", minutes: 55 },
                                    { id: "exercise-0358", type: "analog-clock-choice-pair", minutes: 55 },
                                    { id: "exercise-0359", type: "analog-clock-choice", minuteOptions: [5, 55] },
                                    { id: "exercise-0360", type: "analog-clock-choice-24", minuteOptions: [5, 55] },
                                    { id: "exercise-0361", type: "analog-clock-choice-pair", minuteOptions: [5, 55] },
                                ],
                            },
                            {
                                slug: "xx-10-xx-50",
                                title: t("levels.raum-und-zeit.xx-10-xx-50"),
                                exercises: [
                                    { id: "exercise-0362", type: "analog-clock-choice", minutes: 10 },
                                    { id: "exercise-0363", type: "analog-clock-choice-24", minutes: 10 },
                                    { id: "exercise-0364", type: "analog-clock-choice-pair", minutes: 10 },
                                    { id: "exercise-0365", type: "analog-clock-choice", minutes: 50 },
                                    { id: "exercise-0366", type: "analog-clock-choice-24", minutes: 50 },
                                    { id: "exercise-0367", type: "analog-clock-choice-pair", minutes: 50 },
                                    { id: "exercise-0368", type: "analog-clock-choice", minuteOptions: [10, 50] },
                                    { id: "exercise-0369", type: "analog-clock-choice-24", minuteOptions: [10, 50] },
                                    { id: "exercise-0370", type: "analog-clock-choice-pair", minuteOptions: [10, 50] },
                                ],
                            },
                            {
                                slug: "xx-20-xx-40",
                                title: t("levels.raum-und-zeit.xx-20-xx-40"),
                                exercises: [
                                    { id: "exercise-0371", type: "analog-clock-choice", minutes: 20 },
                                    { id: "exercise-0372", type: "analog-clock-choice-24", minutes: 20 },
                                    { id: "exercise-0373", type: "analog-clock-choice-pair", minutes: 20 },
                                    { id: "exercise-0374", type: "analog-clock-choice", minutes: 40 },
                                    { id: "exercise-0375", type: "analog-clock-choice-24", minutes: 40 },
                                    { id: "exercise-0376", type: "analog-clock-choice-pair", minutes: 40 },
                                    { id: "exercise-0377", type: "analog-clock-choice", minuteOptions: [20, 40] },
                                    { id: "exercise-0378", type: "analog-clock-choice-24", minuteOptions: [20, 40] },
                                    { id: "exercise-0379", type: "analog-clock-choice-pair", minuteOptions: [20, 40] },
                                ],
                            },
                            {
                                slug: "xx-25-xx-35",
                                title: t("levels.raum-und-zeit.xx-25-xx-35"),
                                exercises: [
                                    { id: "exercise-0380", type: "analog-clock-choice", minutes: 25 },
                                    { id: "exercise-0381", type: "analog-clock-choice-24", minutes: 25 },
                                    { id: "exercise-0382", type: "analog-clock-choice-pair", minutes: 25 },
                                    { id: "exercise-0383", type: "analog-clock-choice", minutes: 35 },
                                    { id: "exercise-0384", type: "analog-clock-choice-24", minutes: 35 },
                                    { id: "exercise-0385", type: "analog-clock-choice-pair", minutes: 35 },
                                    { id: "exercise-0386", type: "analog-clock-choice", minuteOptions: [25, 35] },
                                    { id: "exercise-0387", type: "analog-clock-choice-24", minuteOptions: [25, 35] },
                                    { id: "exercise-0388", type: "analog-clock-choice-pair", minuteOptions: [25, 35] },
                                ],
                            },
                        ],
                    },
                    {
                        slug: "analog-inoffiziell",
                        title: t("levels.raum-und-zeit.analog-inoffiziell"),
                        children: [
                            {
                                slug: "xx-00",
                                title: t("levels.raum-und-zeit.xx-00"),
                                exercises: informalClockExercises([
                                    { id: "exercise-0389", type: "analog-clock-choice-sequential" }, { id: "exercise-0390", type: "analog-clock-choice" }, { id: "exercise-0391", type: "analog-clock-choice-sequential-24" }, { id: "exercise-0392", type: "analog-clock-choice-24" }, { id: "exercise-0393", type: "analog-clock-choice-full-day" }, { id: "exercise-0394", type: "analog-clock-choice-pair" },
                                    { id: "exercise-0395", type: "analog-clock-choice-sequential", minutes: 30 }, { id: "exercise-0396", type: "analog-clock-choice", minutes: 30 }, { id: "exercise-0397", type: "analog-clock-choice-sequential-24", minutes: 30 }, { id: "exercise-0398", type: "analog-clock-choice-24", minutes: 30 }, { id: "exercise-0399", type: "analog-clock-choice-full-day", minutes: 30 }, { id: "exercise-0400", type: "analog-clock-choice-pair", minutes: 30 },
                                ]),
                            },
                            {
                                slug: "xx-15-xx-45",
                                title: t("levels.raum-und-zeit.xx-15-xx-45"),
                                exercises: informalClockExercises([
                                    { id: "exercise-0401", type: "analog-clock-choice", minutes: 15 }, { id: "exercise-0402", type: "analog-clock-choice-24", minutes: 15 }, { id: "exercise-0403", type: "analog-clock-choice-pair", minutes: 15 },
                                    { id: "exercise-0404", type: "analog-clock-choice", minutes: 45 }, { id: "exercise-0405", type: "analog-clock-choice-24", minutes: 45 }, { id: "exercise-0406", type: "analog-clock-choice-pair", minutes: 45 },
                                    { id: "exercise-0407", type: "analog-clock-choice", randomQuarter: true }, { id: "exercise-0408", type: "analog-clock-choice-24", randomQuarter: true }, { id: "exercise-0409", type: "analog-clock-choice-pair", randomQuarter: true },
                                ]),
                            },
                            {
                                slug: "xx-05-xx-55",
                                title: t("levels.raum-und-zeit.xx-05-xx-55"),
                                exercises: informalClockExercises([
                                    { id: "exercise-0410", type: "analog-clock-choice", minutes: 5 }, { id: "exercise-0411", type: "analog-clock-choice-24", minutes: 5 }, { id: "exercise-0412", type: "analog-clock-choice-pair", minutes: 5 },
                                    { id: "exercise-0413", type: "analog-clock-choice", minutes: 55 }, { id: "exercise-0414", type: "analog-clock-choice-24", minutes: 55 }, { id: "exercise-0415", type: "analog-clock-choice-pair", minutes: 55 },
                                    { id: "exercise-0416", type: "analog-clock-choice", minuteOptions: [5, 55] }, { id: "exercise-0417", type: "analog-clock-choice-24", minuteOptions: [5, 55] }, { id: "exercise-0418", type: "analog-clock-choice-pair", minuteOptions: [5, 55] },
                                ]),
                            },
                            {
                                slug: "xx-10-xx-50",
                                title: t("levels.raum-und-zeit.xx-10-xx-50"),
                                exercises: informalClockExercises([
                                    { id: "exercise-0419", type: "analog-clock-choice", minutes: 10 }, { id: "exercise-0420", type: "analog-clock-choice-24", minutes: 10 }, { id: "exercise-0421", type: "analog-clock-choice-pair", minutes: 10 },
                                    { id: "exercise-0422", type: "analog-clock-choice", minutes: 50 }, { id: "exercise-0423", type: "analog-clock-choice-24", minutes: 50 }, { id: "exercise-0424", type: "analog-clock-choice-pair", minutes: 50 },
                                    { id: "exercise-0425", type: "analog-clock-choice", minuteOptions: [10, 50] }, { id: "exercise-0426", type: "analog-clock-choice-24", minuteOptions: [10, 50] }, { id: "exercise-0427", type: "analog-clock-choice-pair", minuteOptions: [10, 50] },
                                ]),
                            },
                            {
                                slug: "xx-20-xx-40",
                                title: t("levels.raum-und-zeit.xx-20-xx-40"),
                                exercises: informalClockExercises([
                                    { id: "exercise-0428", type: "analog-clock-choice", minutes: 20 }, { id: "exercise-0429", type: "analog-clock-choice-24", minutes: 20 }, { id: "exercise-0430", type: "analog-clock-choice-pair", minutes: 20 },
                                    { id: "exercise-0431", type: "analog-clock-choice", minutes: 40 }, { id: "exercise-0432", type: "analog-clock-choice-24", minutes: 40 }, { id: "exercise-0433", type: "analog-clock-choice-pair", minutes: 40 },
                                    { id: "exercise-0434", type: "analog-clock-choice", minuteOptions: [20, 40] }, { id: "exercise-0435", type: "analog-clock-choice-24", minuteOptions: [20, 40] }, { id: "exercise-0436", type: "analog-clock-choice-pair", minuteOptions: [20, 40] },
                                ]),
                            },
                            {
                                slug: "xx-25-xx-35",
                                title: t("levels.raum-und-zeit.xx-25-xx-35"),
                                exercises: informalClockExercises([
                                    { id: "exercise-0437", type: "analog-clock-choice", minutes: 25 }, { id: "exercise-0438", type: "analog-clock-choice-24", minutes: 25 }, { id: "exercise-0439", type: "analog-clock-choice-pair", minutes: 25 },
                                    { id: "exercise-0440", type: "analog-clock-choice", minutes: 35 }, { id: "exercise-0441", type: "analog-clock-choice-24", minutes: 35 }, { id: "exercise-0442", type: "analog-clock-choice-pair", minutes: 35 },
                                    { id: "exercise-0443", type: "analog-clock-choice", minuteOptions: [25, 35] }, { id: "exercise-0444", type: "analog-clock-choice-24", minuteOptions: [25, 35] }, { id: "exercise-0445", type: "analog-clock-choice-pair", minuteOptions: [25, 35] },
                                ]),
                            },
                        ],
                    },
                ],
            },
            { slug: "grundbegriffe-fuer-zeit", title: t("levels.raum-und-zeit.grundbegriffe-fuer-zeit") },
            { slug: "zeitpunkte", title: t("levels.raum-und-zeit.zeitpunkte") },
            { slug: "zeitplan", title: t("levels.raum-und-zeit.zeitplan") },
            { slug: "geschwindigkeit", title: t("levels.raum-und-zeit.geschwindigkeit") },
            { slug: "objekte-lokalisieren", title: t("levels.raum-und-zeit.objekte-lokalisieren") },
            { slug: "einen-weg-beschreiben", title: t("levels.raum-und-zeit.einen-weg-beschreiben") },
            { slug: "koordinatensystem-nutzen", title: t("levels.raum-und-zeit.koordinatensystem-nutzen") },
            { slug: "entfernungen-abschaetzen", title: t("levels.raum-und-zeit.entfernungen-abschaetzen") },
        ],
    },
    {
        slug: "geometrie",
        title: t("levels.geometrie.title"),
        description: t("levels.geometrie.description"),
        icon: "cube",
    },
    {
        slug: "funktionale-zusammenhaenge",
        title: t("levels.funktionale-zusammenhaenge.title"),
        description: t("levels.funktionale-zusammenhaenge.description"),
        icon: "line-chart",
    },
];

const assertUniqueExerciseIds = (nodes: CurriculumNode[]) => {
    const ids = new Set<string>();
    const walk = (items: CurriculumNode[]) => items.forEach((node) => {
        node.exercises?.forEach((exercise) => {
            if (ids.has(exercise.id)) throw new Error(`Duplicate curriculum exercise id: ${exercise.id}`);
            ids.add(exercise.id);
        });
        if (node.children) walk(node.children);
    });
    walk(nodes);
};

assertUniqueExerciseIds(curriculum);

/** Result of resolving a slug path against the curriculum tree. */
export type ResolvedNode = {
    /** The node at the end of the path, or `null` for the root. */
    node: CurriculumNode | null;
    /** All nodes from the root down to and including `node`. */
    trail: CurriculumNode[];
};

/** Resolves a slug path (e.g. ["zahlen-und-variablen", "..."]) to a node. */
export const resolvePath = (slug: string[]): ResolvedNode | null => {
    let nodes = curriculum;
    let node: CurriculumNode | null = null;
    const trail: CurriculumNode[] = [];

    for (const segment of slug) {
        const found = nodes.find((candidate) => candidate.slug === segment);
        if (!found) return null;

        node = found;
        trail.push(found);
        nodes = found.children ?? [];
    }

    return { node, trail };
};

/** All slug paths in the tree, including the root (`[]`). Used for static generation. */
export const allPaths = (): string[][] => {
    const paths: string[][] = [[]];

    const walk = (nodes: CurriculumNode[], prefix: string[]) => {
        for (const node of nodes) {
            const path = [...prefix, node.slug];
            paths.push(path);
            if (node.children) walk(node.children, path);
        }
    };

    walk(curriculum, []);
    return paths;
};

/**
 * Generates a dynamic hierarchical number for a slug path.
 * Root level: A, B, C, D, E
 * Each child level: .01, .02, .03, etc.
 * Example: "Zahlen und Variablen" (1st root) = "A", its first child = "A.01", etc.
 */
export const getHierarchicalNumber = (slugPath: string[]): string => {
    if (slugPath.length === 0) return "";

    const parts: string[] = [];

    // First letter (A, B, C, etc.) from root position
    const rootSlug = slugPath[0];
    const rootIndex = curriculum.findIndex((n) => n.slug === rootSlug);
    if (rootIndex === -1) return "";

    parts.push(String.fromCharCode(65 + rootIndex)); // 65 is 'A'

    // For each subsequent level, find index among siblings
    let currentNode = curriculum[rootIndex];
    for (let i = 1; i < slugPath.length; i++) {
        const slug = slugPath[i];
        if (!currentNode.children) break;

        const childIndex = currentNode.children.findIndex((n) => n.slug === slug);
        if (childIndex === -1) break;

        parts.push(String(childIndex + 1).padStart(2, "0"));
        currentNode = currentNode.children[childIndex];
    }

    return parts.join(".");
};
