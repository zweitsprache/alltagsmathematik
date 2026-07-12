import { translate as t } from "@/i18n/translate";
import type { IconKey } from "./icons";

/**
 * Configuration for an interactive exercise. The `type` field is used by the
 * exercise registry to look up the component that renders it. Everything here
 * must stay serializable (no functions/components) so content can be authored
 * as data and rendered from a server component.
 */
export type ExerciseConfig = {
    type: "number-line" | "number-line-listen" | "number-line-listen-pair" | "number-line-read" | "number-sort" | "number-sequence";
    /** Lowest number on the line. */
    min?: number;
    /** Highest number on the line. */
    max?: number;
    /** Which numbers show a label under the tick. */
    labeledNumbers?: number[];
    /** Expected direction for number sorting exercises. */
    sortOrder?: "ascending" | "descending";
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

export const curriculum: CurriculumNode[] = [
    {
        slug: "raum-und-zeit",
        title: t("levels.raum-und-zeit.title"),
        description: t("levels.raum-und-zeit.description"),
        icon: "clock",
        children: [
            { slug: "objekte-lokalisieren", title: t("levels.raum-und-zeit.objekte-lokalisieren") },
            { slug: "einen-weg-beschreiben", title: t("levels.raum-und-zeit.einen-weg-beschreiben") },
            { slug: "koordinatensystem-nutzen", title: t("levels.raum-und-zeit.koordinatensystem-nutzen") },
            { slug: "entfernungen-abschaetzen", title: t("levels.raum-und-zeit.entfernungen-abschaetzen") },
        ],
    },
    {
        slug: "groessen-und-einheiten",
        title: t("levels.groessen-und-einheiten.title"),
        description: t("levels.groessen-und-einheiten.description"),
        icon: "ruler",
    },
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
                                slug: "zahlen-sortieren",
                                title: t("levels.zahlen-und-variablen.zahlen-sortieren"),
                                exercises: [
                                    { type: "number-sort", min: 0, max: 10, sortOrder: "ascending" },
                                    { type: "number-sort", min: 0, max: 10, sortOrder: "descending" },
                                    { type: "number-sequence", min: 0, max: 10 },
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
 * Example: "Zahlen und Variablen" (3rd root) = "C", its first child = "C.01", etc.
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
