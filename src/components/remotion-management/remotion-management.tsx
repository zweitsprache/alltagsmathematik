"use client";

import { useState } from "react";
import { Player } from "@remotion/player";
import { compositionCatalog } from "@/remotion/composition-catalog";
import { CountToTenComposition } from "@/remotion/compositions/count-to-ten";
import { TwoDigitNumbersComposition } from "@/remotion/compositions/two-digit-numbers";
import { PercentageWholeComposition } from "@/remotion/compositions/percentage-whole";
import { TimeComposition } from "@/remotion/compositions/time";
import { NumberLineComposition } from "@/app/remotion-test/page";

const compositionComponents = {
    NumberLineZeroToTen: NumberLineComposition,
    CountToTen: CountToTenComposition,
    TwoDigitNumbers: TwoDigitNumbersComposition,
    PercentageWhole: PercentageWholeComposition,
    Time: TimeComposition,
} as const;

export const RemotionManagement = () => {
    const [selectedId, setSelectedId] = useState<(typeof compositionCatalog)[number]["id"]>(compositionCatalog[0].id);
    const selected = compositionCatalog.find((composition) => composition.id === selectedId) ?? compositionCatalog[0];
    const SelectedComposition = compositionComponents[selected.id];
    const duration = selected.durationInFrames / selected.fps;

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
                        return (
                            <button
                                key={composition.id}
                                type="button"
                                onClick={() => setSelectedId(composition.id)}
                                className={`flex w-full flex-col rounded-md px-3 py-2.5 text-left outline-focus-ring transition ${
                                    active ? "bg-brand-primary text-brand-secondary" : "text-primary hover:bg-primary_hover"
                                }`}
                            >
                                <span className="text-sm font-semibold">{composition.title}</span>
                                <span className="mt-0.5 text-xs text-tertiary">{composition.curriculumLabel}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="min-w-0">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-white ring-1 ring-secondary">
                    <Player
                        key={selected.id}
                        component={SelectedComposition}
                        inputProps={selected.id === "NumberLineZeroToTen" ? { useLocalAudio: true } : {}}
                        durationInFrames={selected.durationInFrames}
                        compositionWidth={selected.width}
                        compositionHeight={selected.height}
                        fps={selected.fps}
                        numberOfSharedAudioTags={40}
                        controls
                        style={{ width: "100%", height: "100%" }}
                    />
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
                        <div><dt className="text-tertiary">ID</dt><dd className="mt-1 font-medium text-primary">{selected.id}</dd></div>
                        <div><dt className="text-tertiary">Dauer</dt><dd className="mt-1 font-medium text-primary">{duration.toFixed(0)} Sek.</dd></div>
                        <div><dt className="text-tertiary">Bildrate</dt><dd className="mt-1 font-medium text-primary">{selected.fps} fps</dd></div>
                        <div><dt className="text-tertiary">Ausgabe</dt><dd className="mt-1 truncate font-medium text-primary">{selected.outputPath}</dd></div>
                    </dl>
                </div>
            </section>
        </div>
    );
};
