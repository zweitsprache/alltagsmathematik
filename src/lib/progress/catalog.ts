import { curriculum, type CurriculumNode } from "@/content/curriculum";

export type ActivityMeta = {
    id: string;
    href: string;
    index: number;
    title: string;
    path: string[];
    trail: string[];
    competency: string;
};

const flattenActivities = (nodes: CurriculumNode[], path: string[] = [], trail: string[] = []): ActivityMeta[] => nodes.flatMap((node) => {
    const nextPath = [...path, node.slug];
    const nextTrail = [...trail, node.title];
    const own = (node.exercises ?? []).map((exercise, index) => ({
        id: exercise.id ?? `${nextPath.join("/")}#${index + 1}`,
        href: `/kompetenzbereiche/${nextPath.join("/")}`,
        index: index + 1,
        title: node.title,
        path: nextPath,
        trail: nextTrail,
        competency: nextPath[0],
    }));
    return [...own, ...flattenActivities(node.children ?? [], nextPath, nextTrail)];
});

export const activityCatalog = flattenActivities(curriculum);
