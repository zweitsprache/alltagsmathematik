"use client";

import { useEffect, useRef, useState } from "react";
import { TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { InputBase } from "@/components/base/input/input";
import { translate as t } from "@/i18n/translate";
import { cx } from "@/utils/cx";

const pad = (value: number) => value.toString().padStart(2, "0");
const groceries = [
    { name: "Milch", price: "1.55" },
    { name: "Eier", price: "3.80" },
    { name: "Käse", price: "4.20" },
    { name: "Joghurt", price: "1.80" },
];

const shuffle = <T,>(items: T[]) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
};

export const GroceryScannerExercise = ({ exerciseNumber = 1 }: { exerciseNumber?: number }) => {
    const [orderedGroceries, setOrderedGroceries] = useState(groceries);
    const [scannedGrocery, setScannedGrocery] = useState<(typeof groceries)[number] | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [attempts, setAttempts] = useState<Record<string, number>>({});
    const [statuses, setStatuses] = useState<Record<string, "correct" | "incorrect" | "solution">>({});
    const solutionTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const scanBeep = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const shuffled = shuffle(groceries);
        setOrderedGroceries(shuffled.every((item, index) => item.name === groceries[index].name) ? [...shuffled.slice(1), shuffled[0]] : shuffled);
    }, []);

    useEffect(() => () => solutionTimers.current.forEach(clearTimeout), []);

    const scan = (name: string) => {
        const grocery = groceries.find((item) => item.name === name);
        if (grocery) setScannedGrocery(grocery);
    };

    const validatePrice = (grocery: (typeof groceries)[number]) => {
        const answer = answers[grocery.name]?.replace(",", ".");
        if (!answer) return;
        if (Number(answer) === Number(grocery.price)) {
            setAnswers((current) => ({ ...current, [grocery.name]: grocery.price }));
            setStatuses((current) => ({ ...current, [grocery.name]: "correct" }));
            return;
        }

        const attempt = (attempts[grocery.name] ?? 0) + 1;
        setAttempts((current) => ({ ...current, [grocery.name]: attempt }));
        setStatuses((current) => ({ ...current, [grocery.name]: "incorrect" }));
        if (attempt >= 3) {
            const timer = setTimeout(() => {
                setAnswers((current) => ({ ...current, [grocery.name]: grocery.price }));
                setStatuses((current) => ({ ...current, [grocery.name]: "solution" }));
            }, 800);
            solutionTimers.current.push(timer);
        }
    };

    return (
        <div className="flex max-w-3xl flex-col gap-8 rounded-lg bg-primary p-6 ring-2 ring-border-primary ring-inset">
            <div className="border-b border-secondary pb-4">
                <p className="text-md font-medium text-secondary">
                    <span className="mr-2 font-black">{pad(exerciseNumber)}</span>
                    {t("instructions.grocery-scanner.prompt")}
                </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {orderedGroceries.map((grocery) => (
                    <button
                        key={grocery.name}
                        type="button"
                        draggable
                        onClick={() => scan(grocery.name)}
                        onDragStart={(event) => {
                            event.dataTransfer.effectAllowed = "copy";
                            event.dataTransfer.setData("text/plain", grocery.name);
                        }}
                        className="flex cursor-grab justify-center rounded-sm outline-focus-ring active:cursor-grabbing focus-visible:outline-2"
                    >
                        <Badge type="modern" size="lg" color="gray" className="w-full justify-center py-2 text-sm">
                            {grocery.name}
                        </Badge>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-[14.4rem_minmax(0,1fr)] items-start gap-8">
                <div>
                    <div
                        onDragOver={(event) => {
                            event.preventDefault();
                            event.dataTransfer.dropEffect = "copy";
                            setIsDragOver(true);
                        }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(event) => {
                            event.preventDefault();
                            scan(event.dataTransfer.getData("text/plain"));
                            if (scanBeep.current) {
                                scanBeep.current.currentTime = 0;
                                void scanBeep.current.play();
                            }
                            setIsDragOver(false);
                        }}
                        className="relative w-full max-w-[14.4rem]"
                    >
                        {isDragOver && <div aria-hidden="true" className="pointer-events-none absolute top-[23%] right-[16%] bottom-[27%] left-[16%] bg-sky-50" />}
                        <svg
                            viewBox="0 0 727 759"
                            role="img"
                            aria-label={t("instructions.grocery-scanner.aria")}
                            className="relative w-full"
                        >
                            <path d="M33 168V35H165" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="19" />
                            <path d="M562 35H693V168" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="19" />
                            <path d="M33 563V695H165" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="19" />
                            <path d="M562 695H693V563" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="19" />

                            <line x1="120" x2="605" y1="123" y2="123" stroke="var(--color-fg-error-primary)" strokeLinecap="round" strokeWidth="14">
                                <animate attributeName="y1" dur="2.8s" repeatCount="indefinite" values="123;635;123" />
                                <animate attributeName="y2" dur="2.8s" repeatCount="indefinite" values="123;635;123" />
                            </line>
                        </svg>
                    </div>
                    <div className="flex min-h-8 items-center justify-center text-md font-semibold text-primary" aria-live="polite">
                        {scannedGrocery?.price}
                    </div>
                    <audio ref={scanBeep} src="/transfer/scan_beep.mp3" preload="auto" />
                </div>

                <TableCard.Root size="sm" className="w-full rounded-md">
                    <table className="w-full table-fixed">
                        <caption className="sr-only">Lebensmittelpreise</caption>
                        <tbody>
                            {groceries.map((grocery) => (
                                <tr key={grocery.name} className="h-14 transition-colors hover:bg-secondary [&:not(:last-child)>*]:border-b [&:not(:last-child)>*]:border-secondary">
                                    <th scope="row" className="px-5 py-3 text-left text-md font-medium text-primary">{grocery.name}</th>
                                    <td className="w-32 px-5 py-3">
                                        <InputBase
                                            size="sm"
                                            inputMode="decimal"
                                            placeholder="0.00"
                                            aria-label={`Preis für ${grocery.name}`}
                                            value={answers[grocery.name] ?? ""}
                                            isDisabled={statuses[grocery.name] === "correct" || statuses[grocery.name] === "solution" || (attempts[grocery.name] ?? 0) >= 3}
                                            isInvalid={statuses[grocery.name] === "incorrect"}
                                            wrapperClassName={cx(
                                                statuses[grocery.name] === "correct" && "bg-success-secondary ring-[var(--color-bg-success-solid)]",
                                                statuses[grocery.name] === "solution" && "bg-sky-secondary ring-sky-500",
                                            )}
                                            inputClassName={cx(
                                                "text-right font-semibold",
                                                statuses[grocery.name] === "correct" && "text-success-primary",
                                                statuses[grocery.name] === "incorrect" && "text-error-primary",
                                                statuses[grocery.name] === "solution" && "text-sky-primary",
                                            )}
                                            onChange={(event) => {
                                                const value = event.currentTarget.value.replace(/[^\d.,]/g, "");
                                                setAnswers((current) => ({ ...current, [grocery.name]: value }));
                                                if (statuses[grocery.name] === "incorrect") {
                                                    setStatuses((current) => {
                                                        const next = { ...current };
                                                        delete next[grocery.name];
                                                        return next;
                                                    });
                                                }
                                            }}
                                            onBlur={() => validatePrice(grocery)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard.Root>
            </div>
        </div>
    );
};
