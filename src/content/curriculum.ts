import { translate as t } from "@/i18n/translate";
import type { IconKey } from "./icons";

/**
 * Configuration for an interactive exercise. The `type` field is used by the
 * exercise registry to look up the component that renders it. Everything here
 * must stay serializable (no functions/components) so content can be authored
 * as data and rendered from a server component.
 */
export type ExerciseConfig = {
    type: "intro" | "number-speech-explainer" | "number-spelling-choice" | "analog-clock-choice" | "analog-clock-choice-24" | "analog-clock-choice-sequential" | "analog-clock-choice-sequential-24" | "analog-clock-choice-full-day" | "analog-clock-choice-pair" | "context-number-listen" | "context-number-read" | "counting-match" | "number-line" | "number-line-listen" | "number-line-listen-pair" | "number-line-word" | "number-line-word-pair" | "number-line-read" | "number-word-choice" | "number-word-choice-audio" | "number-sort" | "number-sequence" | "number-match" | "number-match-fonts";
    /** Lowest number on the line. */
    min?: number;
    /** Highest number on the line. */
    max?: number;
    /** Number of randomized tasks in an exercise. */
    taskCount?: number;
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
                                exercises: [{ type: "intro", min: 0, max: 10 }],
                            },
                            {
                                slug: "zaehlen",
                                title: t("levels.zahlen-und-variablen.zaehlen"),
                                exercises: [
                                    { type: "counting-match", min: 0, max: 10, arrangement: "grid", cardCount: 4, sameShape: true },
                                    { type: "counting-match", min: 0, max: 10, arrangement: "grid", cardCount: 4 },
                                    { type: "counting-match", min: 0, max: 10, arrangement: "grid", cardCount: 6, sameShape: true },
                                    { type: "counting-match", min: 0, max: 10, arrangement: "grid", cardCount: 6 },
                                    { type: "counting-match", min: 0, max: 10, arrangement: "random", cardCount: 4 },
                                    { type: "counting-match", min: 0, max: 10, arrangement: "random", cardCount: 6 },
                                ],
                            },
                            {
                                slug: "zahlen-vergleichen",
                                title: t("levels.zahlen-und-variablen.zahlen-vergleichen"),
                                exercises: [
                                    { type: "number-match", min: 0, max: 10, matchCount: 2 },
                                    { type: "number-match-fonts", min: 0, max: 10, matchCount: 2 },
                                    { type: "number-match", min: 0, max: 10, matchCount: 3 },
                                    { type: "number-match-fonts", min: 0, max: 10, matchCount: 3 },
                                ],
                            },
                            {
                                slug: "zahlenstrahl",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl"),
                                exercises: [
                                    { type: "number-line", min: 0, max: 10, labeledNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                                    { type: "number-line", min: 0, max: 10, labeledNumbers: [0, 5, 10] },
                                    { type: "number-line", min: 0, max: 10, labeledNumbers: [0, 10] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-lesen",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-lesen"),
                                exercises: [
                                    { type: "number-line-read", min: 0, max: 10, labeledNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                                    { type: "number-line-read", min: 0, max: 10, labeledNumbers: [0, 5, 10] },
                                    { type: "number-line-read", min: 0, max: 10, labeledNumbers: [0, 10] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-hoeren"),
                                exercises: [
                                    { type: "number-line-listen", min: 0, max: 10, labeledNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                                    { type: "number-line-listen", min: 0, max: 10, labeledNumbers: [0, 5, 10] },
                                    { type: "number-line-listen", min: 0, max: 10, labeledNumbers: [0, 10] },
                                    { type: "number-line-listen-pair", min: 0, max: 10, labeledNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                                    { type: "number-line-listen-pair", min: 0, max: 10, labeledNumbers: [0, 5, 10] },
                                    { type: "number-line-listen-pair", min: 0, max: 10, labeledNumbers: [0, 10] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-zahlwoerter",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-zahlwoerter"),
                                exercises: [
                                    { type: "number-line-word", min: 0, max: 10, labeledNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                                    { type: "number-line-word", min: 0, max: 10, labeledNumbers: [0, 5, 10] },
                                    { type: "number-line-word", min: 0, max: 10, labeledNumbers: [0, 10] },
                                    { type: "number-line-word-pair", min: 0, max: 10, labeledNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                                    { type: "number-line-word-pair", min: 0, max: 10, labeledNumbers: [0, 5, 10] },
                                    { type: "number-line-word-pair", min: 0, max: 10, labeledNumbers: [0, 10] },
                                ],
                            },
                            {
                                slug: "zahlwoerter-lesen",
                                title: t("levels.zahlen-und-variablen.zahlwoerter-lesen"),
                                exercises: [
                                    { type: "number-word-choice", min: 0, max: 10, wordCount: 1, optionCount: 3 },
                                    { type: "number-word-choice", min: 0, max: 10, wordCount: 2, optionCount: 4 },
                                    { type: "number-word-choice", min: 0, max: 10, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-hoeren-und-auswaehlen",
                                title: t("levels.zahlen-und-variablen.zahlen-hoeren-und-auswaehlen"),
                                exercises: [
                                    { type: "number-word-choice-audio", min: 0, max: 10, wordCount: 1, optionCount: 3 },
                                    { type: "number-word-choice-audio", min: 0, max: 10, wordCount: 2, optionCount: 4 },
                                    { type: "number-word-choice-audio", min: 0, max: 10, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-sortieren",
                                title: t("levels.zahlen-und-variablen.zahlen-sortieren"),
                                exercises: [
                                    { type: "number-sort", min: 0, max: 10, sortOrder: "ascending" },
                                    { type: "number-sort", min: 0, max: 10, sortOrder: "descending" },
                                    { type: "number-sequence", min: 0, max: 10 },
                                ],
                            },
                            {
                                slug: "zahlen-im-kontext-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlen-im-kontext-hoeren"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ type: "context-number-listen" as const, setNumber })),
                            },
                            {
                                slug: "zahlen-lesen",
                                title: t("levels.zahlen-und-variablen.zahlen-lesen"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ type: "context-number-read" as const, setNumber, contextId: "a_01_01_12" })),
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
                                exercises: [{ type: "intro", min: 11, max: 24 }],
                            },
                            {
                                slug: "zaehlen",
                                title: t("levels.zahlen-und-variablen.zaehlen"),
                                exercises: [
                                    { type: "counting-match", min: 11, max: 24, arrangement: "grid-10", cardCount: 4, sameShape: true },
                                    { type: "counting-match", min: 11, max: 24, arrangement: "grid-10", cardCount: 4 },
                                    { type: "counting-match", min: 11, max: 24, arrangement: "grid-10", cardCount: 6, sameShape: true },
                                    { type: "counting-match", min: 11, max: 24, arrangement: "grid-10", cardCount: 6 },
                                    { type: "counting-match", min: 11, max: 24, arrangement: "grid-10", cardCount: 4 },
                                    { type: "counting-match", min: 11, max: 24, arrangement: "grid-10", cardCount: 6 },
                                ],
                            },
                            {
                                slug: "zahlen-vergleichen",
                                title: t("levels.zahlen-und-variablen.zahlen-vergleichen"),
                                exercises: [
                                    { type: "number-match", min: 11, max: 24, matchCount: 2 },
                                    { type: "number-match-fonts", min: 11, max: 24, matchCount: 2 },
                                    { type: "number-match", min: 11, max: 24, matchCount: 3 },
                                    { type: "number-match-fonts", min: 11, max: 24, matchCount: 3 },
                                ],
                            },
                            {
                                slug: "zahlenstrahl",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl"),
                                exercises: [
                                    { type: "number-line", min: 10, max: 24, labeledNumbers: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
                                    { type: "number-line", min: 10, max: 24, labeledNumbers: [10, 17, 24] },
                                    { type: "number-line", min: 10, max: 24, labeledNumbers: [10, 24] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-lesen",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-lesen"),
                                exercises: [
                                    { type: "number-line-read", min: 11, max: 24, labeledNumbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
                                    { type: "number-line-read", min: 11, max: 24, labeledNumbers: [11, 18, 24] },
                                    { type: "number-line-read", min: 11, max: 24, labeledNumbers: [11, 24] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-hoeren"),
                                exercises: [
                                    { type: "number-line-listen", min: 11, max: 24, labeledNumbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
                                    { type: "number-line-listen", min: 11, max: 24, labeledNumbers: [11, 18, 24] },
                                    { type: "number-line-listen", min: 11, max: 24, labeledNumbers: [11, 24] },
                                    { type: "number-line-listen-pair", min: 11, max: 24, labeledNumbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
                                    { type: "number-line-listen-pair", min: 11, max: 24, labeledNumbers: [11, 18, 24] },
                                    { type: "number-line-listen-pair", min: 11, max: 24, labeledNumbers: [11, 24] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-zahlwoerter",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-zahlwoerter"),
                                exercises: [
                                    { type: "number-line-word", min: 11, max: 24, labeledNumbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
                                    { type: "number-line-word", min: 11, max: 24, labeledNumbers: [11, 18, 24] },
                                    { type: "number-line-word", min: 11, max: 24, labeledNumbers: [11, 24] },
                                    { type: "number-line-word-pair", min: 11, max: 24, labeledNumbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
                                    { type: "number-line-word-pair", min: 11, max: 24, labeledNumbers: [11, 18, 24] },
                                    { type: "number-line-word-pair", min: 11, max: 24, labeledNumbers: [11, 24] },
                                ],
                            },
                            {
                                slug: "zahlwoerter-lesen",
                                title: t("levels.zahlen-und-variablen.zahlwoerter-lesen"),
                                exercises: [
                                    { type: "number-word-choice", min: 11, max: 24, wordCount: 1, optionCount: 3 },
                                    { type: "number-word-choice", min: 11, max: 24, wordCount: 2, optionCount: 4 },
                                    { type: "number-word-choice", min: 11, max: 24, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-hoeren-und-auswaehlen",
                                title: t("levels.zahlen-und-variablen.zahlen-hoeren-und-auswaehlen"),
                                exercises: [
                                    { type: "number-word-choice-audio", min: 11, max: 24, wordCount: 1, optionCount: 3 },
                                    { type: "number-word-choice-audio", min: 11, max: 24, wordCount: 2, optionCount: 4 },
                                    { type: "number-word-choice-audio", min: 11, max: 24, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-sortieren",
                                title: t("levels.zahlen-und-variablen.zahlen-sortieren"),
                                exercises: [
                                    { type: "number-sort", min: 11, max: 21, sortOrder: "ascending" },
                                    { type: "number-sort", min: 11, max: 21, sortOrder: "descending" },
                                    { type: "number-sequence", min: 11, max: 21 },
                                ],
                            },
                            {
                                slug: "zahlen-im-kontext-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlen-im-kontext-hoeren"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ type: "context-number-listen" as const, setNumber, contextId: "a_01_02_11" })),
                            },
                            {
                                slug: "zahlen-lesen",
                                title: t("levels.zahlen-und-variablen.zahlen-lesen"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ type: "context-number-read" as const, setNumber, contextId: "a_01_02_12" })),
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
                                exercises: [{ type: "intro", min: 25, max: 31 }],
                            },
                            {
                                slug: "zaehlen",
                                title: t("levels.zahlen-und-variablen.zaehlen"),
                                exercises: [
                                    { type: "counting-match", min: 25, max: 31, arrangement: "grid-10-4", cardCount: 4, sameShape: true },
                                    { type: "counting-match", min: 25, max: 31, arrangement: "grid-10-4", cardCount: 4 },
                                    { type: "counting-match", min: 25, max: 31, arrangement: "grid-10-4", cardCount: 6, sameShape: true },
                                    { type: "counting-match", min: 25, max: 31, arrangement: "grid-10-4", cardCount: 6 },
                                    { type: "counting-match", min: 25, max: 31, arrangement: "grid-10-4", cardCount: 4 },
                                    { type: "counting-match", min: 25, max: 31, arrangement: "grid-10-4", cardCount: 6 },
                                ],
                            },
                            {
                                slug: "zahlen-vergleichen",
                                title: t("levels.zahlen-und-variablen.zahlen-vergleichen"),
                                exercises: [
                                    { type: "number-match", min: 25, max: 31, matchCount: 2 },
                                    { type: "number-match-fonts", min: 25, max: 31, matchCount: 2 },
                                    { type: "number-match", min: 25, max: 31, matchCount: 3 },
                                    { type: "number-match-fonts", min: 25, max: 31, matchCount: 3 },
                                ],
                            },
                            {
                                slug: "zahlenstrahl",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl"),
                                exercises: [
                                    { type: "number-line", min: 25, max: 31, labeledNumbers: [25, 26, 27, 28, 29, 30, 31] },
                                    { type: "number-line", min: 25, max: 31, labeledNumbers: [25, 28, 31] },
                                    { type: "number-line", min: 25, max: 31, labeledNumbers: [25, 31] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-lesen",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-lesen"),
                                exercises: [
                                    { type: "number-line-read", min: 25, max: 31, labeledNumbers: [25, 26, 27, 28, 29, 30, 31] },
                                    { type: "number-line-read", min: 25, max: 31, labeledNumbers: [25, 28, 31] },
                                    { type: "number-line-read", min: 25, max: 31, labeledNumbers: [25, 31] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-hoeren"),
                                exercises: [
                                    { type: "number-line-listen", min: 25, max: 31, labeledNumbers: [25, 26, 27, 28, 29, 30, 31] },
                                    { type: "number-line-listen", min: 25, max: 31, labeledNumbers: [25, 28, 31] },
                                    { type: "number-line-listen", min: 25, max: 31, labeledNumbers: [25, 31] },
                                    { type: "number-line-listen-pair", min: 25, max: 31, labeledNumbers: [25, 26, 27, 28, 29, 30, 31] },
                                    { type: "number-line-listen-pair", min: 25, max: 31, labeledNumbers: [25, 28, 31] },
                                    { type: "number-line-listen-pair", min: 25, max: 31, labeledNumbers: [25, 31] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-zahlwoerter",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-zahlwoerter"),
                                exercises: [
                                    { type: "number-line-word", min: 25, max: 31, labeledNumbers: [25, 26, 27, 28, 29, 30, 31] },
                                    { type: "number-line-word", min: 25, max: 31, labeledNumbers: [25, 28, 31] },
                                    { type: "number-line-word", min: 25, max: 31, labeledNumbers: [25, 31] },
                                    { type: "number-line-word-pair", min: 25, max: 31, labeledNumbers: [25, 26, 27, 28, 29, 30, 31] },
                                    { type: "number-line-word-pair", min: 25, max: 31, labeledNumbers: [25, 28, 31] },
                                    { type: "number-line-word-pair", min: 25, max: 31, labeledNumbers: [25, 31] },
                                ],
                            },
                            {
                                slug: "zahlwoerter-lesen",
                                title: t("levels.zahlen-und-variablen.zahlwoerter-lesen"),
                                exercises: [
                                    { type: "number-word-choice", min: 25, max: 31, wordCount: 1, optionCount: 3 },
                                    { type: "number-word-choice", min: 25, max: 31, wordCount: 2, optionCount: 4 },
                                    { type: "number-word-choice", min: 25, max: 31, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-hoeren-und-auswaehlen",
                                title: t("levels.zahlen-und-variablen.zahlen-hoeren-und-auswaehlen"),
                                exercises: [
                                    { type: "number-word-choice-audio", min: 25, max: 31, wordCount: 1, optionCount: 3 },
                                    { type: "number-word-choice-audio", min: 25, max: 31, wordCount: 2, optionCount: 4 },
                                    { type: "number-word-choice-audio", min: 25, max: 31, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-sortieren",
                                title: t("levels.zahlen-und-variablen.zahlen-sortieren"),
                                exercises: [
                                    { type: "number-sort", min: 25, max: 31, sortOrder: "ascending" },
                                    { type: "number-sort", min: 25, max: 31, sortOrder: "descending" },
                                    { type: "number-sequence", min: 25, max: 31 },
                                ],
                            },
                            {
                                slug: "zahlen-im-kontext-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlen-im-kontext-hoeren"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ type: "context-number-listen" as const, setNumber, contextId: "a_01_03_11" })),
                            },
                            {
                                slug: "zahlen-lesen",
                                title: t("levels.zahlen-und-variablen.zahlen-lesen"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ type: "context-number-read" as const, setNumber, contextId: "a_01_03_12" })),
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
                                    { type: "number-speech-explainer" },
                                    { type: "intro", values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], introTitle: "Die Zehnerzahlen von 0 bis 100" },
                                    { type: "intro", min: 30, max: 40, introTitle: "Die Zahlen von 30 bis 40" },
                                    { type: "intro", min: 40, max: 50, introTitle: "Die Zahlen von 40 bis 50" },
                                    { type: "intro", min: 50, max: 60, introTitle: "Die Zahlen von 50 bis 60" },
                                    { type: "intro", min: 60, max: 70, introTitle: "Die Zahlen von 60 bis 70" },
                                    { type: "intro", min: 70, max: 80, introTitle: "Die Zahlen von 70 bis 80" },
                                    { type: "intro", min: 80, max: 90, introTitle: "Die Zahlen von 80 bis 90" },
                                    { type: "intro", min: 90, max: 100, introTitle: "Die Zahlen von 90 bis 100" },
                                ],
                            },
                            {
                                slug: "zahlen-erkennen",
                                title: t("levels.zahlen-und-variablen.zahlen-erkennen"),
                                exercises: [
                                    { type: "number-spelling-choice" },
                                    { type: "number-spelling-choice", spellingVariant: "switched" },
                                    { type: "number-spelling-choice", spellingVariant: "missing-und" },
                                    { type: "number-spelling-choice", spellingVariant: "switched-missing-und" },
                                    { type: "number-spelling-choice", spellingVariant: "mixed" },
                                ],
                            },
                            {
                                slug: "zahlen-vergleichen",
                                title: t("levels.zahlen-und-variablen.zahlen-vergleichen"),
                                exercises: [
                                    { type: "number-match", min: 30, max: 100, matchCount: 2 },
                                    { type: "number-match-fonts", min: 30, max: 100, matchCount: 2 },
                                    { type: "number-match", min: 30, max: 100, matchCount: 3 },
                                    { type: "number-match-fonts", min: 30, max: 100, matchCount: 3 },
                                ],
                            },
                            {
                                slug: "zahlenstrahl",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl"),
                                exercises: [
                                    { type: "number-line", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 31, 32, 33] },
                                    { type: "number-line", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 35, 40] },
                                    { type: "number-line", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 40] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-lesen",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-lesen"),
                                exercises: [
                                    { type: "number-line-read", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 31, 32, 33] },
                                    { type: "number-line-read", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 35, 40] },
                                    { type: "number-line-read", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 40] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-hoeren"),
                                exercises: [
                                    { type: "number-line-listen", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 31, 32, 33] },
                                    { type: "number-line-listen", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 35, 40] },
                                    { type: "number-line-listen", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 40] },
                                    { type: "number-line-listen-pair", min: 30, max: 100, rangeSize: 10, labeledNumbers: [30, 31, 32, 33] },
                                    { type: "number-line-listen-pair", min: 30, max: 100, rangeSize: 10, labeledNumbers: [30, 35, 40] },
                                    { type: "number-line-listen-pair", min: 30, max: 100, rangeSize: 10, labeledNumbers: [30, 40] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-zahlwoerter",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-zahlwoerter"),
                                exercises: [
                                    { type: "number-line-word", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 31, 32, 33] },
                                    { type: "number-line-word", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 35, 40] },
                                    { type: "number-line-word", min: 30, max: 100, rangeSize: 10, taskCount: 10, labeledNumbers: [30, 40] },
                                    { type: "number-line-word-pair", min: 30, max: 100, rangeSize: 10, labeledNumbers: [30, 31, 32, 33] },
                                    { type: "number-line-word-pair", min: 30, max: 100, rangeSize: 10, labeledNumbers: [30, 35, 40] },
                                    { type: "number-line-word-pair", min: 30, max: 100, rangeSize: 10, labeledNumbers: [30, 40] },
                                ],
                            },
                            {
                                slug: "zahlwoerter-lesen",
                                title: t("levels.zahlen-und-variablen.zahlwoerter-lesen"),
                                exercises: [
                                    { type: "number-word-choice", min: 30, max: 100, wordCount: 1, optionCount: 3 },
                                    { type: "number-word-choice", min: 30, max: 100, wordCount: 2, optionCount: 4 },
                                    { type: "number-word-choice", min: 30, max: 100, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-hoeren-und-auswaehlen",
                                title: t("levels.zahlen-und-variablen.zahlen-hoeren-und-auswaehlen"),
                                exercises: [
                                    { type: "number-word-choice-audio", min: 30, max: 100, wordCount: 1, optionCount: 3 },
                                    { type: "number-word-choice-audio", min: 30, max: 100, wordCount: 2, optionCount: 4 },
                                    { type: "number-word-choice-audio", min: 30, max: 100, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-sortieren",
                                title: t("levels.zahlen-und-variablen.zahlen-sortieren"),
                                exercises: [
                                    { type: "number-sort", min: 30, max: 100, itemCount: 10, sortOrder: "ascending" },
                                    { type: "number-sort", min: 30, max: 100, itemCount: 10, sortOrder: "descending" },
                                    { type: "number-sequence", min: 30, max: 100, itemCount: 10 },
                                ],
                            },
                            {
                                slug: "zahlen-im-kontext-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlen-im-kontext-hoeren"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ type: "context-number-listen" as const, setNumber, contextId: "a_01_04_11" })),
                            },
                            {
                                slug: "zahlen-lesen",
                                title: t("levels.zahlen-und-variablen.zahlen-lesen"),
                                exercises: [1, 2, 3, 4, 5].map((setNumber) => ({ type: "context-number-read" as const, setNumber, contextId: "a_01_04_12" })),
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
                                    { type: "intro", values: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], introTitle: "Die Hunderterzahlen von 0 bis 1000" },
                                    { type: "intro", min: 100, max: 200, introTitle: "Die Zahlen von 100 bis 200" },
                                    { type: "intro", min: 200, max: 300, introTitle: "Die Zahlen von 200 bis 300" },
                                    { type: "intro", min: 300, max: 400, introTitle: "Die Zahlen von 300 bis 400" },
                                    { type: "intro", min: 400, max: 500, introTitle: "Die Zahlen von 400 bis 500" },
                                    { type: "intro", min: 500, max: 600, introTitle: "Die Zahlen von 500 bis 600" },
                                    { type: "intro", min: 600, max: 700, introTitle: "Die Zahlen von 600 bis 700" },
                                    { type: "intro", min: 700, max: 800, introTitle: "Die Zahlen von 700 bis 800" },
                                    { type: "intro", min: 800, max: 900, introTitle: "Die Zahlen von 800 bis 900" },
                                    { type: "intro", min: 900, max: 1000, introTitle: "Die Zahlen von 900 bis 1000" },
                                ],
                            },
                            {
                                slug: "zahlen-erkennen",
                                title: t("levels.zahlen-und-variablen.zahlen-erkennen"),
                                exercises: [
                                    { type: "number-spelling-choice", min: 100, max: 1000 },
                                    { type: "number-spelling-choice", min: 100, max: 999, spellingVariant: "switched" },
                                    { type: "number-spelling-choice", min: 100, max: 999, spellingVariant: "missing-und" },
                                    { type: "number-spelling-choice", min: 100, max: 999, spellingVariant: "switched-missing-und" },
                                    { type: "number-spelling-choice", min: 100, max: 999, spellingVariant: "mixed" },
                                ],
                            },
                            {
                                slug: "zahlen-vergleichen",
                                title: t("levels.zahlen-und-variablen.zahlen-vergleichen"),
                                exercises: [
                                    { type: "number-match", min: 100, max: 1000, matchCount: 2 },
                                    { type: "number-match-fonts", min: 100, max: 1000, matchCount: 2 },
                                    { type: "number-match", min: 100, max: 1000, matchCount: 3 },
                                    { type: "number-match-fonts", min: 100, max: 1000, matchCount: 3 },
                                ],
                            },
                            {
                                slug: "zahlenstrahl",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl"),
                                exercises: [
                                    { type: "number-line", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 101, 102, 103] },
                                    { type: "number-line", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 105, 110] },
                                    { type: "number-line", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 110] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-lesen",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-lesen"),
                                exercises: [
                                    { type: "number-line-read", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 101, 102, 103] },
                                    { type: "number-line-read", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 105, 110] },
                                    { type: "number-line-read", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 110] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-hoeren",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-hoeren"),
                                exercises: [
                                    { type: "number-line-listen", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 101, 102, 103] },
                                    { type: "number-line-listen", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 105, 110] },
                                    { type: "number-line-listen", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 110] },
                                    { type: "number-line-listen-pair", min: 100, max: 1000, rangeSize: 10, labeledNumbers: [100, 101, 102, 103] },
                                    { type: "number-line-listen-pair", min: 100, max: 1000, rangeSize: 10, labeledNumbers: [100, 105, 110] },
                                    { type: "number-line-listen-pair", min: 100, max: 1000, rangeSize: 10, labeledNumbers: [100, 110] },
                                ],
                            },
                            {
                                slug: "zahlenstrahl-zahlwoerter",
                                title: t("levels.zahlen-und-variablen.zahlenstrahl-zahlwoerter"),
                                exercises: [
                                    { type: "number-line-word", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 101, 102, 103] },
                                    { type: "number-line-word", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 105, 110] },
                                    { type: "number-line-word", min: 100, max: 1000, rangeSize: 10, taskCount: 10, labeledNumbers: [100, 110] },
                                    { type: "number-line-word-pair", min: 100, max: 1000, rangeSize: 10, labeledNumbers: [100, 101, 102, 103] },
                                    { type: "number-line-word-pair", min: 100, max: 1000, rangeSize: 10, labeledNumbers: [100, 105, 110] },
                                    { type: "number-line-word-pair", min: 100, max: 1000, rangeSize: 10, labeledNumbers: [100, 110] },
                                ],
                            },
                            {
                                slug: "zahlwoerter-lesen",
                                title: t("levels.zahlen-und-variablen.zahlwoerter-lesen"),
                                exercises: [
                                    { type: "number-word-choice", min: 100, max: 1000, wordCount: 1, optionCount: 3 },
                                    { type: "number-word-choice", min: 100, max: 1000, wordCount: 2, optionCount: 4 },
                                    { type: "number-word-choice", min: 100, max: 1000, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-hoeren-und-auswaehlen",
                                title: t("levels.zahlen-und-variablen.zahlen-hoeren-und-auswaehlen"),
                                exercises: [
                                    { type: "number-word-choice-audio", min: 100, max: 1000, wordCount: 1, optionCount: 3 },
                                    { type: "number-word-choice-audio", min: 100, max: 1000, wordCount: 2, optionCount: 4 },
                                    { type: "number-word-choice-audio", min: 100, max: 1000, wordCount: 3, optionCount: 5 },
                                ],
                            },
                            {
                                slug: "zahlen-sortieren",
                                title: t("levels.zahlen-und-variablen.zahlen-sortieren"),
                                exercises: [
                                    { type: "number-sort", min: 100, max: 1000, itemCount: 10, sortOrder: "ascending" },
                                    { type: "number-sort", min: 100, max: 1000, itemCount: 10, sortOrder: "descending" },
                                    { type: "number-sequence", min: 100, max: 1000, itemCount: 10 },
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
                        slug: "analog-offiziell",
                        title: t("levels.raum-und-zeit.analog-offiziell"),
                        children: [
                            {
                                slug: "xx-00",
                                title: t("levels.raum-und-zeit.xx-00"),
                                exercises: [
                                    { type: "analog-clock-choice-sequential" },
                                    { type: "analog-clock-choice" },
                                    { type: "analog-clock-choice-sequential-24" },
                                    { type: "analog-clock-choice-24" },
                                    { type: "analog-clock-choice-full-day" },
                                    { type: "analog-clock-choice-pair" },
                                    { type: "analog-clock-choice-sequential", minutes: 30 },
                                    { type: "analog-clock-choice", minutes: 30 },
                                    { type: "analog-clock-choice-sequential-24", minutes: 30 },
                                    { type: "analog-clock-choice-24", minutes: 30 },
                                    { type: "analog-clock-choice-full-day", minutes: 30 },
                                    { type: "analog-clock-choice-pair", minutes: 30 },
                                ],
                            },
                            {
                                slug: "xx-15-xx-45",
                                title: t("levels.raum-und-zeit.xx-15-xx-45"),
                                exercises: [
                                    { type: "analog-clock-choice", minutes: 15 },
                                    { type: "analog-clock-choice-24", minutes: 15 },
                                    { type: "analog-clock-choice-pair", minutes: 15 },
                                    { type: "analog-clock-choice", minutes: 45 },
                                    { type: "analog-clock-choice-24", minutes: 45 },
                                    { type: "analog-clock-choice-pair", minutes: 45 },
                                    { type: "analog-clock-choice", randomQuarter: true },
                                    { type: "analog-clock-choice-24", randomQuarter: true },
                                    { type: "analog-clock-choice-pair", randomQuarter: true },
                                ],
                            },
                            {
                                slug: "xx-05-xx-55",
                                title: t("levels.raum-und-zeit.xx-05-xx-55"),
                                exercises: [
                                    { type: "analog-clock-choice", minutes: 5 },
                                    { type: "analog-clock-choice-24", minutes: 5 },
                                    { type: "analog-clock-choice-pair", minutes: 5 },
                                    { type: "analog-clock-choice", minutes: 55 },
                                    { type: "analog-clock-choice-24", minutes: 55 },
                                    { type: "analog-clock-choice-pair", minutes: 55 },
                                    { type: "analog-clock-choice", minuteOptions: [5, 55] },
                                    { type: "analog-clock-choice-24", minuteOptions: [5, 55] },
                                    { type: "analog-clock-choice-pair", minuteOptions: [5, 55] },
                                ],
                            },
                            {
                                slug: "xx-10-xx-50",
                                title: t("levels.raum-und-zeit.xx-10-xx-50"),
                                exercises: [
                                    { type: "analog-clock-choice", minutes: 10 },
                                    { type: "analog-clock-choice-24", minutes: 10 },
                                    { type: "analog-clock-choice-pair", minutes: 10 },
                                    { type: "analog-clock-choice", minutes: 50 },
                                    { type: "analog-clock-choice-24", minutes: 50 },
                                    { type: "analog-clock-choice-pair", minutes: 50 },
                                    { type: "analog-clock-choice", minuteOptions: [10, 50] },
                                    { type: "analog-clock-choice-24", minuteOptions: [10, 50] },
                                    { type: "analog-clock-choice-pair", minuteOptions: [10, 50] },
                                ],
                            },
                            {
                                slug: "xx-20-xx-40",
                                title: t("levels.raum-und-zeit.xx-20-xx-40"),
                                exercises: [
                                    { type: "analog-clock-choice", minutes: 20 },
                                    { type: "analog-clock-choice-24", minutes: 20 },
                                    { type: "analog-clock-choice-pair", minutes: 20 },
                                    { type: "analog-clock-choice", minutes: 40 },
                                    { type: "analog-clock-choice-24", minutes: 40 },
                                    { type: "analog-clock-choice-pair", minutes: 40 },
                                    { type: "analog-clock-choice", minuteOptions: [20, 40] },
                                    { type: "analog-clock-choice-24", minuteOptions: [20, 40] },
                                    { type: "analog-clock-choice-pair", minuteOptions: [20, 40] },
                                ],
                            },
                            {
                                slug: "xx-25-xx-35",
                                title: t("levels.raum-und-zeit.xx-25-xx-35"),
                                exercises: [
                                    { type: "analog-clock-choice", minutes: 25 },
                                    { type: "analog-clock-choice-24", minutes: 25 },
                                    { type: "analog-clock-choice-pair", minutes: 25 },
                                    { type: "analog-clock-choice", minutes: 35 },
                                    { type: "analog-clock-choice-24", minutes: 35 },
                                    { type: "analog-clock-choice-pair", minutes: 35 },
                                    { type: "analog-clock-choice", minuteOptions: [25, 35] },
                                    { type: "analog-clock-choice-24", minuteOptions: [25, 35] },
                                    { type: "analog-clock-choice-pair", minuteOptions: [25, 35] },
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
                                    { type: "analog-clock-choice-sequential" }, { type: "analog-clock-choice" }, { type: "analog-clock-choice-sequential-24" }, { type: "analog-clock-choice-24" }, { type: "analog-clock-choice-full-day" }, { type: "analog-clock-choice-pair" },
                                    { type: "analog-clock-choice-sequential", minutes: 30 }, { type: "analog-clock-choice", minutes: 30 }, { type: "analog-clock-choice-sequential-24", minutes: 30 }, { type: "analog-clock-choice-24", minutes: 30 }, { type: "analog-clock-choice-full-day", minutes: 30 }, { type: "analog-clock-choice-pair", minutes: 30 },
                                ]),
                            },
                            {
                                slug: "xx-15-xx-45",
                                title: t("levels.raum-und-zeit.xx-15-xx-45"),
                                exercises: informalClockExercises([
                                    { type: "analog-clock-choice", minutes: 15 }, { type: "analog-clock-choice-24", minutes: 15 }, { type: "analog-clock-choice-pair", minutes: 15 },
                                    { type: "analog-clock-choice", minutes: 45 }, { type: "analog-clock-choice-24", minutes: 45 }, { type: "analog-clock-choice-pair", minutes: 45 },
                                    { type: "analog-clock-choice", randomQuarter: true }, { type: "analog-clock-choice-24", randomQuarter: true }, { type: "analog-clock-choice-pair", randomQuarter: true },
                                ]),
                            },
                            {
                                slug: "xx-05-xx-55",
                                title: t("levels.raum-und-zeit.xx-05-xx-55"),
                                exercises: informalClockExercises([
                                    { type: "analog-clock-choice", minutes: 5 }, { type: "analog-clock-choice-24", minutes: 5 }, { type: "analog-clock-choice-pair", minutes: 5 },
                                    { type: "analog-clock-choice", minutes: 55 }, { type: "analog-clock-choice-24", minutes: 55 }, { type: "analog-clock-choice-pair", minutes: 55 },
                                    { type: "analog-clock-choice", minuteOptions: [5, 55] }, { type: "analog-clock-choice-24", minuteOptions: [5, 55] }, { type: "analog-clock-choice-pair", minuteOptions: [5, 55] },
                                ]),
                            },
                            {
                                slug: "xx-10-xx-50",
                                title: t("levels.raum-und-zeit.xx-10-xx-50"),
                                exercises: informalClockExercises([
                                    { type: "analog-clock-choice", minutes: 10 }, { type: "analog-clock-choice-24", minutes: 10 }, { type: "analog-clock-choice-pair", minutes: 10 },
                                    { type: "analog-clock-choice", minutes: 50 }, { type: "analog-clock-choice-24", minutes: 50 }, { type: "analog-clock-choice-pair", minutes: 50 },
                                    { type: "analog-clock-choice", minuteOptions: [10, 50] }, { type: "analog-clock-choice-24", minuteOptions: [10, 50] }, { type: "analog-clock-choice-pair", minuteOptions: [10, 50] },
                                ]),
                            },
                            {
                                slug: "xx-20-xx-40",
                                title: t("levels.raum-und-zeit.xx-20-xx-40"),
                                exercises: informalClockExercises([
                                    { type: "analog-clock-choice", minutes: 20 }, { type: "analog-clock-choice-24", minutes: 20 }, { type: "analog-clock-choice-pair", minutes: 20 },
                                    { type: "analog-clock-choice", minutes: 40 }, { type: "analog-clock-choice-24", minutes: 40 }, { type: "analog-clock-choice-pair", minutes: 40 },
                                    { type: "analog-clock-choice", minuteOptions: [20, 40] }, { type: "analog-clock-choice-24", minuteOptions: [20, 40] }, { type: "analog-clock-choice-pair", minuteOptions: [20, 40] },
                                ]),
                            },
                            {
                                slug: "xx-25-xx-35",
                                title: t("levels.raum-und-zeit.xx-25-xx-35"),
                                exercises: informalClockExercises([
                                    { type: "analog-clock-choice", minutes: 25 }, { type: "analog-clock-choice-24", minutes: 25 }, { type: "analog-clock-choice-pair", minutes: 25 },
                                    { type: "analog-clock-choice", minutes: 35 }, { type: "analog-clock-choice-24", minutes: 35 }, { type: "analog-clock-choice-pair", minutes: 35 },
                                    { type: "analog-clock-choice", minuteOptions: [25, 35] }, { type: "analog-clock-choice-24", minuteOptions: [25, 35] }, { type: "analog-clock-choice-pair", minuteOptions: [25, 35] },
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
