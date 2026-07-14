"use client";

import { useMemo, useState } from "react";
import { RefreshCw01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

type Asset = { blobPath: string; text: string; voiceId: string; instruction: string; updatedAt: string | null };
type Group = { id: string; title: string; assets: Asset[] };

const AudioRow = ({ asset }: { asset: Asset }) => {
    const [text, setText] = useState(asset.text);
    const [revision, setRevision] = useState(0);
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

    const regenerate = async () => {
        setStatus("saving");
        const response = await fetch("/api/admin/audio/regenerate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ blobPath: asset.blobPath, text }) });
        if (!response.ok) return setStatus("error");
        setRevision((value) => value + 1);
        setStatus("saved");
        window.setTimeout(() => setStatus("idle"), 1800);
    };

    return (
        <div className="grid gap-3 border-b border-secondary px-3 py-3 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_18rem_auto] lg:items-center">
            <div className="min-w-0">
                <textarea value={text} onChange={(event) => setText(event.target.value)} rows={2} className="w-full resize-y rounded-sm bg-primary px-3 py-2 text-sm text-primary ring-1 ring-secondary outline-focus-ring focus-visible:outline-2" />
                <p className="mt-1 truncate text-xs text-tertiary" title={asset.blobPath}>{asset.blobPath}</p>
            </div>
            <audio key={revision} controls preload="none" className="h-9 w-full" src={`/api/admin/audio/stream?path=${encodeURIComponent(asset.blobPath)}&v=${revision}`} />
            <div className="flex items-center gap-2 lg:justify-end">
                <Button size="sm" color="secondary" iconLeading={RefreshCw01} onClick={() => void regenerate()} isDisabled={status === "saving"}>{status === "saving" ? "Generiert …" : "Neu generieren"}</Button>
                <span className="w-16 text-xs text-tertiary">{status === "saved" ? "Gespeichert" : status === "error" ? "Fehler" : ""}</span>
            </div>
        </div>
    );
};

export const AudioManagement = ({ groups }: { groups: Group[] }) => {
    const [selectedId, setSelectedId] = useState(groups[0]?.id ?? "");
    const [query, setQuery] = useState("");
    const filtered = useMemo(() => groups.filter((group) => `${group.title} ${group.id}`.toLowerCase().includes(query.toLowerCase())), [groups, query]);
    const selected = groups.find((group) => group.id === selectedId) ?? filtered[0];

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,2fr)]">
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Aktivität suchen" className="rounded-sm bg-primary px-3 py-2 text-sm ring-1 ring-secondary outline-focus-ring focus-visible:outline-2" />
                <select value={selected?.id ?? ""} onChange={(event) => setSelectedId(event.target.value)} className="rounded-sm bg-primary px-3 py-2 text-sm text-primary ring-1 ring-secondary outline-focus-ring focus-visible:outline-2">
                    {filtered.map((group) => <option key={group.id} value={group.id}>{group.title} · {group.id} · {group.assets.length} Audios</option>)}
                </select>
            </div>
            {selected ? <section className="overflow-hidden rounded-lg border border-secondary bg-primary"><div className="border-b border-secondary px-4 py-3"><h2 className="font-semibold text-primary">{selected.title}</h2><p className="text-xs text-tertiary">{selected.id} · {selected.assets.length} verwendete Audiodateien</p></div>{selected.assets.map((asset) => <AudioRow key={asset.blobPath} asset={asset} />)}</section> : <p className="text-sm text-tertiary">Keine Aktivität gefunden.</p>}
        </div>
    );
};
