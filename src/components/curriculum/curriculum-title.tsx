"use client";

import { useEffect, useState } from "react";
import type { CurriculumNode } from "@/content/curriculum";

const storageKey = "alltagsmathematik.curriculum-draft";

const findNode = (nodes: CurriculumNode[], slug: string): CurriculumNode | undefined => {
    for (const node of nodes) {
        if (node.slug === slug) return node;
        const found = node.children && findNode(node.children, slug);
        if (found) return found;
    }
    return undefined;
};

export const CurriculumTitle = ({ slug, fallback }: { slug: string; fallback: string }) => {
    const [title, setTitle] = useState(fallback);

    useEffect(() => {
        const readDraft = () => {
            const draft = window.localStorage.getItem(storageKey);
            if (!draft) return;
            try {
                const node = findNode(JSON.parse(draft) as CurriculumNode[], slug);
                if (node?.title) setTitle(node.title);
            } catch {
                // Ignore malformed local drafts and keep the source title.
            }
        };

        readDraft();
        window.addEventListener("storage", readDraft);
        window.addEventListener("curriculum-draft-updated", readDraft);
        return () => {
            window.removeEventListener("storage", readDraft);
            window.removeEventListener("curriculum-draft-updated", readDraft);
        };
    }, [slug]);

    return <>{title}</>;
};
