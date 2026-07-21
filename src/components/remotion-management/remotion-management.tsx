"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, RefObject } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { Check, Copy01, Download01, Film01, Image01, RefreshCw01 } from "@untitledui/icons";
import { NumberLineComposition } from "@/app/remotion-test/page";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { NativeSelect } from "@/components/base/select/select-native";
import { useClipboard } from "@/hooks/use-clipboard";
import { type CompositionMetadataOverrides, CompositionMetadataProvider, type TitleIconName, getRandomTitleBackground } from "@/remotion/branded-slides";
import { compositionCatalog } from "@/remotion/composition-catalog";
import type { CompositionCatalogItem } from "@/remotion/composition-catalog";
import { CountToTenComposition } from "@/remotion/compositions/count-to-ten";
import { CuisenaireBlocksComposition } from "@/remotion/compositions/cuisenaire-blocks";
import { LocalPrepositionsComposition } from "@/remotion/compositions/local-prepositions";
import { NumberLineCountingComposition } from "@/remotion/compositions/number-line-counting";
import { StackedNumberLinesComposition } from "@/remotion/compositions/number-line-stacked";
import { PercentageWholeComposition } from "@/remotion/compositions/percentage-whole";
import { RuleOfThreeShampooComposition } from "@/remotion/compositions/rule-of-three-shampoo";
import {
    DigitalFiveMinuteTimeVariantComposition,
    DigitalInformalHourTimeComposition,
    FiveMinuteTimeComposition,
    FiveMinuteTimeVariantComposition,
    HalfHourTimeComposition,
    InformalHourTimeComposition,
    QuarterHourTimeComposition,
    TenMinuteTimeComposition,
    TimeComposition,
} from "@/remotion/compositions/time";
import { TwoDigitNumbersComposition } from "@/remotion/compositions/two-digit-numbers";

const compositionComponents: Record<string, ComponentType<any>> = {
    RuleOfThreeShampoo: RuleOfThreeShampooComposition,
    NumberLineZeroToTen: NumberLineComposition,
    NumberLineCountingZeroToTen: NumberLineCountingComposition,
    NumberLineZeroToTenStacked: StackedNumberLinesComposition,
    CountToTen: CountToTenComposition,
    TwoDigitNumbers: TwoDigitNumbersComposition,
    PercentageWhole: PercentageWholeComposition,
    LocalPrepositions: LocalPrepositionsComposition,
    CuisenaireBlocks: CuisenaireBlocksComposition,
    Time: TimeComposition,
    TimeHalfHour: HalfHourTimeComposition,
    TimeQuarterHours: QuarterHourTimeComposition,
    TimeTenMinuteGroups: TenMinuteTimeComposition,
    TimeFiveMinuteGroups: FiveMinuteTimeComposition,
    TimeFiveMinuteGroupsVariant: FiveMinuteTimeVariantComposition,
    DigitalTimeFiveMinuteGroupsVariant: DigitalFiveMinuteTimeVariantComposition,
} as const;

const iconOptions = [
    { label: "Zählstriche", value: "tally" },
    { label: "Kalender und Uhr", value: "calendar-clock" },
    { label: "Position", value: "map-pin" },
    { label: "Rechner", value: "calculator" },
    { label: "Prozent", value: "percent" },
];

const ManagedRemotionPlayer = memo(
    ({
        selected,
        component,
        inputProps,
        metadata,
        playerRef,
    }: {
        selected: CompositionCatalogItem;
        component: ComponentType<any>;
        inputProps: any;
        metadata: CompositionMetadataOverrides;
        playerRef: RefObject<PlayerRef | null>;
    }) => {
        return (
            <CompositionMetadataProvider value={metadata}>
                <Player
                    key={selected.id}
                    ref={playerRef}
                    component={component}
                    inputProps={inputProps}
                    durationInFrames={selected.durationInFrames}
                    compositionWidth={selected.width}
                    compositionHeight={selected.height}
                    fps={selected.fps}
                    numberOfSharedAudioTags={250}
                    controls
                    style={{ width: "100%", height: "100%" }}
                />
            </CompositionMetadataProvider>
        );
    },
);
ManagedRemotionPlayer.displayName = "ManagedRemotionPlayer";

type RenderJob = {
    renderId: string;
    bucketName: string;
    functionName: string;
};

type RenderState = "idle" | "starting" | "rendering" | "done" | "error";
type AutosaveState = "loading" | "saved" | "saving" | "error";

const getDefaultMetadata = (composition: CompositionCatalogItem): Required<CompositionMetadataOverrides> => {
    const id = composition.id;
    const isTime = id.startsWith("Time") || id.startsWith("DigitalTime");
    const isDigital = id.startsWith("Digital");
    const isInformal = id.includes("Informal") || id.includes("Variant");

    let header = composition.curriculumLabel;
    let title = composition.title;
    let subtitle = "";
    let icon: TitleIconName = "tally";

    if (id === "NumberLineZeroToTen") subtitle = "auf dem Zahlenstrahl";
    if (id === "NumberLineCountingZeroToTen") subtitle = "auf dem Zahlenstrahl";
    if (id === "NumberLineZeroToTenStacked") subtitle = "ohne Zehnerübergang";
    if (id === "CountToTen") subtitle = "Mengen erkennen";
    if (id === "TwoDigitNumbers") subtitle = "Die Zahlen von 10 bis 31";
    if (id === "PercentageWhole") {
        subtitle = "100%, 50% und 25%";
        icon = "percent";
    }
    if (id === "LocalPrepositions") {
        subtitle = "9 wichtige lokale Präpositionen";
        icon = "map-pin";
    }
    if (id === "CuisenaireBlocks") {
        title = "Addition +1";
        subtitle = "mit Cuisinaire-Stäbchen";
    }

    if (isTime) {
        icon = "calendar-clock";
        title = isDigital || isInformal ? composition.title : "Analoge Uhrzeiten | Offizielle Sprechweise";
        subtitle = isInformal ? "Inoffizielle Sprechweise" : "XX:00";
        const range = composition.title.includes("|") ? composition.title.split("|").slice(1).join("|").trim() : "";
        header = `Zeit und Raum | Uhrzeiten | ${isDigital ? "Digital" : "Analog"} > ${isInformal ? "inoffiziell" : "offiziell"}${range ? ` | ${range}` : ""}`;
    }

    if (id === "TimeHalfHour") {
        header = "Zeit und Raum | Uhrzeiten";
        title = "Analoge Uhrzeiten";
        subtitle = "Offizielle Sprechweise | XX.30";
    }
    if (id === "TimeQuarterHours") subtitle = "XX:15 | XX:45";
    if (id === "TimeTenMinuteGroups") subtitle = "XX:10 | XX:20 | XX:40 | XX:50";
    if (id === "TimeFiveMinuteGroups") subtitle = "XX:05 | XX:25 | XX:35 | XX:55";
    if (isTime && !isInformal && id !== "TimeHalfHour") header = `${header} | ${subtitle}`;

    return {
        header,
        title,
        subtitle,
        icon,
        backgroundNumber: composition.titleBackgroundNumber,
    };
};

export const RemotionManagement = () => {
    const clipboard = useClipboard();
    const playerRef = useRef<PlayerRef>(null);
    const [selectedId, setSelectedId] = useState<(typeof compositionCatalog)[number]["id"]>(compositionCatalog[0].id);
    const [metadataByComposition, setMetadataByComposition] = useState<Record<string, CompositionMetadataOverrides>>({});
    const [metadataIsLoaded, setMetadataIsLoaded] = useState(false);
    const [autosaveState, setAutosaveState] = useState<AutosaveState>("loading");
    const [autosaveError, setAutosaveError] = useState<string | null>(null);
    const [autosaveTick, setAutosaveTick] = useState(0);
    const metadataRevisions = useRef(new Map<string, number>());
    const dirtyCompositionIds = useRef(new Set<string>());
    const [renderJob, setRenderJob] = useState<RenderJob | null>(null);
    const [renderState, setRenderState] = useState<RenderState>("idle");
    const [renderProgress, setRenderProgress] = useState(0);
    const [renderOutput, setRenderOutput] = useState<string | null>(null);
    const [renderError, setRenderError] = useState<string | null>(null);
    const [stillIsRendering, setStillIsRendering] = useState(false);
    const [stillOutput, setStillOutput] = useState<string | null>(null);
    const [stillError, setStillError] = useState<string | null>(null);
    const selected = compositionCatalog.find((composition) => composition.id === selectedId) ?? compositionCatalog[0];
    const metadata = useMemo(() => ({ ...getDefaultMetadata(selected), ...metadataByComposition[selected.id] }), [metadataByComposition, selected]);
    const isInformalHourlyComposition = "startHour" in selected;
    const isDigitalInformalHourlyComposition = "digitalStartHour" in selected;
    const SelectedComposition: ComponentType<any> = isDigitalInformalHourlyComposition
        ? DigitalInformalHourTimeComposition
        : isInformalHourlyComposition
          ? InformalHourTimeComposition
          : compositionComponents[selected.id];
    const selectedInputProps: any = useMemo(
        () =>
            selected.id === "NumberLineZeroToTen"
                  ? { useLocalAudio: true }
                  : isDigitalInformalHourlyComposition
                    ? { startHour: selected.digitalStartHour }
                    : isInformalHourlyComposition
                      ? { startHour: selected.startHour }
                      : {},
        [isDigitalInformalHourlyComposition, isInformalHourlyComposition, selected],
    );
    const duration = selected.durationInFrames / selected.fps;
    const updateMetadata = (updates: Partial<CompositionMetadataOverrides>) => {
        const revision = (metadataRevisions.current.get(selected.id) ?? 0) + 1;
        metadataRevisions.current.set(selected.id, revision);
        dirtyCompositionIds.current.add(selected.id);
        setAutosaveState("saving");
        setAutosaveError(null);
        setMetadataByComposition((current) => ({
            ...current,
            [selected.id]: { ...current[selected.id], ...updates },
        }));
    };
    const startRender = async () => {
        setRenderState("starting");
        setRenderProgress(0);
        setRenderOutput(null);
        setRenderError(null);
        setRenderJob(null);

        try {
            const response = await fetch("/api/admin/videos/render", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ compositionId: selected.id, metadata }),
            });
            const result = (await response.json()) as RenderJob & { error?: string };
            if (!response.ok) throw new Error(result.error || "The video render could not be started.");

            setRenderJob({
                renderId: result.renderId,
                bucketName: result.bucketName,
                functionName: result.functionName,
            });
            setRenderState("rendering");
        } catch (error) {
            setRenderState("error");
            setRenderError(error instanceof Error ? error.message : "The video render could not be started.");
        }
    };
    const renderFirstFrame = async () => {
        setStillIsRendering(true);
        setStillOutput(null);
        setStillError(null);

        try {
            const response = await fetch("/api/admin/videos/render/still", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ compositionId: selected.id, metadata }),
            });
            const result = (await response.json()) as { outputFile?: string; error?: string };
            if (!response.ok || !result.outputFile) {
                throw new Error(result.error || "The first frame could not be rendered.");
            }

            setStillOutput(result.outputFile);
        } catch (error) {
            setStillError(error instanceof Error ? error.message : "The first frame could not be rendered.");
        } finally {
            setStillIsRendering(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const loadMetadata = async () => {
            try {
                const response = await fetch("/api/admin/videos/metadata");
                const result = (await response.json()) as {
                    metadata?: Record<string, CompositionMetadataOverrides>;
                    error?: string;
                };
                if (!response.ok) throw new Error(result.error || "Video metadata could not be loaded.");
                if (cancelled) return;

                setMetadataByComposition(result.metadata ?? {});
                setMetadataIsLoaded(true);
                setAutosaveState("saved");
            } catch (error) {
                if (cancelled) return;
                setMetadataIsLoaded(true);
                setAutosaveState("error");
                setAutosaveError(error instanceof Error ? error.message : "Video metadata could not be loaded.");
            }
        };

        void loadMetadata();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!metadataIsLoaded || dirtyCompositionIds.current.size === 0) return;

        let cancelled = false;
        const timeout = setTimeout(async () => {
            const pending = [...dirtyCompositionIds.current].map((compositionId) => ({
                compositionId,
                metadata: metadataByComposition[compositionId] ?? {},
                revision: metadataRevisions.current.get(compositionId) ?? 0,
            }));
            setAutosaveState("saving");

            try {
                await Promise.all(
                    pending.map(async ({ compositionId, metadata }) => {
                        const response = await fetch("/api/admin/videos/metadata", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ compositionId, metadata }),
                        });
                        const result = (await response.json()) as { error?: string };
                        if (!response.ok) throw new Error(result.error || "Video metadata could not be saved.");
                    }),
                );
                if (cancelled) return;

                for (const item of pending) {
                    if (metadataRevisions.current.get(item.compositionId) === item.revision) {
                        dirtyCompositionIds.current.delete(item.compositionId);
                    }
                }
                if (dirtyCompositionIds.current.size > 0) {
                    setAutosaveTick((current) => current + 1);
                } else {
                    setAutosaveState("saved");
                }
            } catch (error) {
                if (cancelled) return;
                setAutosaveState("error");
                setAutosaveError(error instanceof Error ? error.message : "Video metadata could not be saved.");
            }
        }, 700);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [autosaveTick, metadataByComposition, metadataIsLoaded]);

    useEffect(() => {
        if (renderState !== "rendering" || !renderJob) return;

        let cancelled = false;
        let timeout: ReturnType<typeof setTimeout> | undefined;
        const poll = async () => {
            try {
                const query = new URLSearchParams(renderJob);
                const response = await fetch(`/api/admin/videos/render/progress?${query}`);
                const result = (await response.json()) as {
                    done?: boolean;
                    progress?: number;
                    outputFile?: string | null;
                    fatalErrorEncountered?: boolean;
                    errors?: string[];
                    error?: string;
                };
                if (!response.ok) throw new Error(result.error || "Render progress could not be loaded.");
                if (cancelled) return;

                setRenderProgress(Math.min(100, Math.max(0, (result.progress ?? 0) * 100)));
                if (result.fatalErrorEncountered) {
                    setRenderState("error");
                    setRenderError(result.errors?.[0] || "The video render failed.");
                    return;
                }
                if (result.done && result.outputFile) {
                    setRenderProgress(100);
                    setRenderOutput(result.outputFile);
                    setRenderState("done");
                    return;
                }

                timeout = setTimeout(poll, 1500);
            } catch (error) {
                if (cancelled) return;
                setRenderState("error");
                setRenderError(error instanceof Error ? error.message : "Render progress could not be loaded.");
            }
        };

        void poll();
        return () => {
            cancelled = true;
            if (timeout) clearTimeout(timeout);
        };
    }, [renderJob, renderState]);

    useEffect(() => {
        setRenderJob(null);
        setRenderState("idle");
        setRenderProgress(0);
        setRenderOutput(null);
        setRenderError(null);
        setStillIsRendering(false);
        setStillOutput(null);
        setStillError(null);
    }, [selected.id]);

    return (
        <div className="grid min-w-0 gap-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
            <section className="overflow-hidden rounded-lg bg-primary ring-1 ring-secondary">
                <div className="border-b border-secondary px-4 py-3">
                    <h2 className="text-sm font-semibold text-primary">Kompositionen</h2>
                    <p className="text-xs text-tertiary">{compositionCatalog.length} registriert</p>
                </div>
                <div className="p-2">
                    {compositionCatalog.map((composition) => {
                        const active = composition.id === selected.id;
                        const listMetadata = {
                            ...getDefaultMetadata(composition),
                            ...metadataByComposition[composition.id],
                        };
                        return (
                            <div key={composition.id} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setSelectedId(composition.id)}
                                    className={`flex w-full flex-col rounded-md px-3 py-2.5 pr-16 text-left outline-focus-ring transition ${
                                        active ? "bg-brand-primary text-brand-secondary" : "text-primary hover:bg-primary_hover"
                                    }`}
                                >
                                    <span className="text-sm font-semibold">{listMetadata.title}</span>
                                    <span className="mt-0.5 line-clamp-2 text-xs text-tertiary">{listMetadata.header}</span>
                                    {listMetadata.subtitle && <span className="mt-0.5 line-clamp-1 text-xs text-tertiary">{listMetadata.subtitle}</span>}
                                    <span className="mt-1 font-mono text-[11px] break-all text-tertiary">ID: {composition.id}</span>
                                </button>
                                {"titleBackgroundNumber" in composition && (
                                    <span className="pointer-events-none absolute top-2.5 right-2.5 rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] font-semibold text-secondary">
                                        BG {composition.titleBackgroundNumber}
                                    </span>
                                )}
                                <button
                                    type="button"
                                    title={`ID ${composition.id} kopieren`}
                                    aria-label={`ID ${composition.id} kopieren`}
                                    onClick={() => clipboard.copy(composition.id, composition.id)}
                                    className="absolute right-2.5 bottom-2 flex size-5 items-center justify-center rounded text-tertiary outline-focus-ring transition hover:bg-primary_hover hover:text-primary"
                                >
                                    {clipboard.copied === composition.id ? <Check size={12} /> : <Copy01 size={12} />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="min-w-0">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-white ring-1 ring-secondary">
                    <ManagedRemotionPlayer
                        selected={selected}
                        component={SelectedComposition}
                        inputProps={selectedInputProps}
                        metadata={metadata}
                        playerRef={playerRef}
                    />
                </div>

                <div className="mt-4 rounded-lg bg-primary p-4 ring-1 ring-secondary">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-primary">Titel-Metadaten</h2>
                            <p className="mt-1 text-sm text-tertiary">Änderungen werden direkt angezeigt und automatisch gespeichert.</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <span className={`text-xs font-medium ${autosaveState === "error" ? "text-error-primary" : "text-tertiary"}`}>
                                {autosaveState === "loading" && "Wird geladen…"}
                                {autosaveState === "saving" && "Wird gespeichert…"}
                                {autosaveState === "saved" && "Gespeichert"}
                                {autosaveState === "error" && "Nicht gespeichert"}
                            </span>
                            <span className="rounded-md bg-secondary px-2.5 py-1 font-mono text-xs font-semibold text-secondary">
                                BG {metadata.backgroundNumber}
                            </span>
                        </div>
                    </div>
                    {autosaveError && (
                        <p role="alert" className="mt-3 rounded-md bg-error-primary px-3 py-2 text-sm text-error-primary">
                            {autosaveError}
                        </p>
                    )}
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <Input label="Kopfzeile links" value={metadata.header} onChange={(value) => updateMetadata({ header: value })} />
                        <NativeSelect
                            label="Icon"
                            value={metadata.icon}
                            onChange={(event) => updateMetadata({ icon: event.target.value as TitleIconName })}
                            options={iconOptions}
                        />
                        <Input label="Titel" value={metadata.title} onChange={(value) => updateMetadata({ title: value })} />
                        <Input label="Untertitel" value={metadata.subtitle} onChange={(value) => updateMetadata({ subtitle: value })} />
                    </div>
                    <div className="mt-4 flex flex-col gap-4 border-t border-secondary pt-4">
                        {(renderState === "starting" || renderState === "rendering" || renderState === "done") && (
                            <div className="rounded-md bg-secondary px-3 py-3">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <span className="text-sm font-medium text-secondary">
                                        {renderState === "done" ? "Video ist bereit" : "Video wird gerendert"}
                                    </span>
                                    <span className="text-sm font-semibold text-secondary tabular-nums">{Math.round(renderProgress)} %</span>
                                </div>
                                <ProgressBar value={renderProgress} />
                            </div>
                        )}
                        {renderState === "error" && (
                            <p role="alert" className="rounded-md bg-error-primary px-3 py-2 text-sm text-error-primary">
                                {renderError}
                            </p>
                        )}
                        {stillError && (
                            <p role="alert" className="rounded-md bg-error-primary px-3 py-2 text-sm text-error-primary">
                                {stillError}
                            </p>
                        )}
                        <div className="flex flex-wrap justify-end gap-3">
                            <Button
                                size="sm"
                                color="secondary"
                                iconLeading={RefreshCw01}
                                onClick={() =>
                                    updateMetadata({
                                        backgroundNumber: getRandomTitleBackground(metadata.backgroundNumber),
                                    })
                                }
                            >
                                Anderen Hintergrund wählen
                            </Button>
                            {renderOutput && (
                                <Button size="sm" color="secondary" iconLeading={Download01} href={renderOutput} download={`${selected.id}.mp4`}>
                                    MP4 herunterladen
                                </Button>
                            )}
                            {stillOutput ? (
                                <Button size="sm" color="secondary" iconLeading={Download01} href={stillOutput} download={`${selected.id}-frame-0000.png`}>
                                    PNG herunterladen
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    color="secondary"
                                    iconLeading={Image01}
                                    isLoading={stillIsRendering}
                                    showTextWhileLoading
                                    onClick={renderFirstFrame}
                                >
                                    Ersten Frame als PNG
                                </Button>
                            )}
                            <Button
                                size="sm"
                                color="primary"
                                iconLeading={Film01}
                                isLoading={renderState === "starting" || renderState === "rendering"}
                                showTextWhileLoading
                                onClick={startRender}
                            >
                                {renderState === "done" ? "Neu rendern" : "Video rendern"}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-4 rounded-lg bg-primary p-4 ring-1 ring-secondary">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-primary">{selected.title}</h2>
                            <p className="mt-1 text-sm text-tertiary">{selected.description}</p>
                        </div>
                        <span className="shrink-0 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary">
                            {selected.width} × {selected.height}
                        </span>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-secondary pt-4 text-sm sm:grid-cols-4">
                        <div>
                            <dt className="text-tertiary">ID</dt>
                            <dd className="mt-1 font-medium text-primary">{selected.id}</dd>
                        </div>
                        <div>
                            <dt className="text-tertiary">Dauer</dt>
                            <dd className="mt-1 font-medium text-primary">{duration.toFixed(0)} Sek.</dd>
                        </div>
                        <div>
                            <dt className="text-tertiary">Bildrate</dt>
                            <dd className="mt-1 font-medium text-primary">{selected.fps} fps</dd>
                        </div>
                        <div>
                            <dt className="text-tertiary">Ausgabe</dt>
                            <dd className="mt-1 truncate font-medium text-primary">{selected.outputPath}</dd>
                        </div>
                    </dl>
                </div>
            </section>
        </div>
    );
};
