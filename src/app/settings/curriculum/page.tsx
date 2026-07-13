"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, RefreshCw01, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { PageHeader } from "@/components/curriculum/page-header";
import type { CurriculumNode } from "@/content/curriculum";
import { curriculum as defaultCurriculum } from "@/content/curriculum";
import { cx } from "@/utils/cx";

const storageKey = "alltagsmathematik.curriculum-draft";

const clone = (value: CurriculumNode[]) => JSON.parse(JSON.stringify(value)) as CurriculumNode[];

const updateAtPath = (nodes: CurriculumNode[], path: number[], update: (node: CurriculumNode) => CurriculumNode): CurriculumNode[] => {
    if (path.length === 0) return nodes;
    return nodes.map((node, index) => {
        if (index !== path[0]) return node;
        if (path.length === 1) return update(node);
        return { ...node, children: updateAtPath(node.children ?? [], path.slice(1), update) };
    });
};

const reorderAtPath = (nodes: CurriculumNode[], path: number[], direction: -1 | 1): CurriculumNode[] => {
    if (path.length === 1) {
        const index = path[0];
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= nodes.length) return nodes;
        const next = [...nodes];
        [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
        return next;
    }
    return nodes.map((node, index) => (index === path[0] ? { ...node, children: reorderAtPath(node.children ?? [], path.slice(1), direction) } : node));
};

const removeAtPath = (nodes: CurriculumNode[], path: number[]): CurriculumNode[] => {
    if (path.length === 1) return nodes.filter((_, index) => index !== path[0]);
    return nodes.map((node, index) => (index === path[0] ? { ...node, children: removeAtPath(node.children ?? [], path.slice(1)) } : node));
};

const newNode = (parentPath: number[]): CurriculumNode => ({
    slug: `new-item-${Date.now()}`,
    title: parentPath.length === 0 ? "Neuer Bereich" : "Neues Unterthema",
    description: "",
});

const CurriculumItem = ({
    node,
    path,
    onChange,
    onDelete,
    onMove,
    onAdd,
}: {
    node: CurriculumNode;
    path: number[];
    onChange: (path: number[], update: (node: CurriculumNode) => CurriculumNode) => void;
    onDelete: (path: number[]) => void;
    onMove: (path: number[], direction: -1 | 1) => void;
    onAdd: (path: number[]) => void;
}) => {
    const children = node.children ?? [];

    return (
        <div className="flex flex-col gap-1">
            <div className="grid items-end gap-2 rounded-lg bg-primary p-2 ring-1 ring-secondary ring-inset sm:grid-cols-[minmax(8rem,1fr)_minmax(8rem,1fr)_minmax(12rem,2fr)_auto]">
                <label className="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                    Titel
                    <input
                        value={node.title}
                        onChange={(event) => onChange(path, (current) => ({ ...current, title: event.target.value }))}
                        className="rounded-lg bg-primary px-3 py-2 text-sm text-primary ring-1 ring-secondary outline-focus-ring focus-visible:outline-2"
                    />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                    Slug
                    <input
                        value={node.slug}
                        onChange={(event) => onChange(path, (current) => ({ ...current, slug: event.target.value }))}
                        className="rounded-lg bg-primary px-3 py-2 text-sm text-primary ring-1 ring-secondary outline-focus-ring focus-visible:outline-2"
                    />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                    Beschreibung
                    <input
                        value={node.description ?? ""}
                        onChange={(event) => onChange(path, (current) => ({ ...current, description: event.target.value }))}
                        className="rounded-lg bg-primary px-3 py-2 text-sm text-primary ring-1 ring-secondary outline-focus-ring focus-visible:outline-2"
                    />
                </label>
                <div className="flex items-center justify-end gap-1 pb-0.5">
                    <Button size="xs" color="tertiary" iconLeading={ArrowUp} aria-label="Nach oben" onClick={() => onMove(path, -1)} />
                    <Button size="xs" color="tertiary" iconLeading={ArrowDown} aria-label="Nach unten" onClick={() => onMove(path, 1)} />
                    <Button size="xs" color="tertiary" iconLeading={Plus} aria-label="Unterthema hinzufügen" onClick={() => onAdd(path)} />
                    <Button size="xs" color="link-destructive" iconLeading={Trash01} aria-label="Löschen" onClick={() => onDelete(path)} />
                </div>
            </div>

            {children.length > 0 && (
                <div className="ml-4 flex flex-col gap-1 border-l-2 border-secondary pl-3">
                    {children.map((child, index) => (
                        <CurriculumItem
                            key={`${child.slug}-${index}`}
                            node={child}
                            path={[...path, index]}
                            onChange={onChange}
                            onDelete={onDelete}
                            onMove={onMove}
                            onAdd={onAdd}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function CurriculumManagementPage() {
    const [nodes, setNodes] = useState<CurriculumNode[]>(() => clone(defaultCurriculum));
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const draft = window.localStorage.getItem(storageKey);
        if (draft) {
            try {
                setNodes(JSON.parse(draft) as CurriculumNode[]);
            } catch {
                window.localStorage.removeItem(storageKey);
            }
        }
    }, []);

    const change = (path: number[], update: (node: CurriculumNode) => CurriculumNode) => setNodes((current) => updateAtPath(current, path, update));
    const move = (path: number[], direction: -1 | 1) => setNodes((current) => reorderAtPath(current, path, direction));
    const remove = (path: number[]) => setNodes((current) => removeAtPath(current, path));
    const add = (path: number[]) => change(path, (node) => ({ ...node, children: [...(node.children ?? []), newNode(path)] }));
    const addRoot = () => setNodes((current) => [...current, newNode([])]);
    const save = () => {
        window.localStorage.setItem(storageKey, JSON.stringify(nodes));
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1800);
    };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Curriculum verwalten" description="Bearbeiten Sie Bereiche und Unterthemen und ordnen Sie sie neu an." />
            <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" color="primary" iconLeading={Plus} onClick={addRoot}>
                    Bereich hinzufügen
                </Button>
                <Button size="sm" color="secondary" iconLeading={RefreshCw01} onClick={() => setNodes(clone(defaultCurriculum))}>
                    Zurücksetzen
                </Button>
                <Button size="sm" color="secondary" onClick={save}>
                    {saved ? "Gespeichert" : "Änderungen speichern"}
                </Button>
            </div>
            <div
                className={cx(
                    "flex flex-col gap-3",
                    nodes.length === 0 && "rounded-xl border border-dashed border-secondary p-8 text-center text-sm text-tertiary",
                )}
            >
                {nodes.length === 0
                    ? "Noch keine Bereiche vorhanden."
                    : nodes.map((node, index) => (
                          <CurriculumItem
                              key={`${node.slug}-${index}`}
                              node={node}
                              path={[index]}
                              onChange={change}
                              onDelete={remove}
                              onMove={move}
                              onAdd={add}
                          />
                      ))}
            </div>
        </div>
    );
}
