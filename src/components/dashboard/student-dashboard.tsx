"use client";

import Link from "next/link";
import { BookOpen01, CheckCircle, RefreshCw01 } from "@untitledui/icons";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { curriculum, getHierarchicalNumber } from "@/content/curriculum";
import { iconMap } from "@/content/icons";
import { activityCatalog, type ActivityMeta } from "@/lib/progress/catalog";
import type { ActivityProgress } from "@/lib/progress/dashboard";

const statusFor = (progress?: ActivityProgress) => {
    if (!progress) return { label: "Noch nicht begonnen", color: "gray" as const };
    if (progress.status === "completed") return { label: "Abgeschlossen", color: "success" as const };
    return { label: "In Arbeit", color: "brand" as const };
};

const percentage = (completed: number, total: number) => total > 0 ? Math.round((completed / total) * 100) : 0;

export const StudentDashboard = ({ name, progress }: { name?: string | null; progress: ActivityProgress[] }) => {
    const byId = new Map(progress.map((item) => [item.activityId, item]));
    const latestProgress = progress[0];
    const latest = activityCatalog.find((activity) => activity.id === latestProgress?.activityId) ?? activityCatalog[0];
    const pageActivities = latest ? activityCatalog.filter((activity) => activity.path.join("/") === latest.path.join("/")) : [];

    const recommendations = progress
        .filter((item) => item.solutionsRevealed > 0 || (item.totalAttempts >= 3 && item.correctFirstTry / item.totalAttempts < 0.6))
        .map((item) => ({ progress: item, activity: activityCatalog.find((activity) => activity.id === item.activityId) }))
        .filter((item): item is { progress: ActivityProgress; activity: ActivityMeta } => Boolean(item.activity))
        .slice(0, 3);

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
            <div>
                <p className="text-sm font-semibold text-brand-secondary">Dashboard</p>
                <h1 className="mt-1 text-display-xs font-semibold text-primary">Guten Tag{name ? `, ${name}` : ""}</h1>
                <p className="mt-1 text-md text-tertiary">Setzen Sie Ihren Lernweg fort oder wählen Sie einen Kompetenzbereich.</p>
            </div>

            {latest && (
                <section className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 items-start gap-4">
                            <FeaturedIcon icon={BookOpen01} size="lg" color="brand" theme="light" />
                            <div className="min-w-0">
                                <BadgeWithDot size="sm" color="brand">Weiterlernen</BadgeWithDot>
                                <h2 className="mt-2 truncate text-xl font-semibold text-primary">{latest.title}</h2>
                                <p className="mt-1 truncate text-sm text-tertiary">{latest.trail.slice(0, -1).join(" · ")} · Aufgabe {latest.index.toString().padStart(2, "0")}</p>
                                {latestProgress && (
                                    <div className="mt-4 flex max-w-md items-center gap-3">
                                        <ProgressBar value={latestProgress.tasksCompleted} max={latestProgress.taskCount} className="flex-1" />
                                        <span className="shrink-0 text-sm font-medium text-secondary tabular-nums">{latestProgress.tasksCompleted} / {latestProgress.taskCount}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button href={latest.href} size="lg" color="primary">Weiterlernen</Button>
                    </div>
                </section>
            )}

            <section className="flex flex-col gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-primary">Kompetenzbereiche</h2>
                    <p className="text-sm text-tertiary">Ihr Fortschritt über alle Bereiche.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {curriculum.map((node) => {
                        const activities = activityCatalog.filter((activity) => activity.competency === node.slug);
                        const completed = activities.filter((activity) => byId.get(activity.id)?.status === "completed").length;
                        const value = percentage(completed, activities.length);
                        const Icon = node.icon ? iconMap[node.icon] : BookOpen01;
                        return (
                            <Link key={node.slug} href={`/kompetenzbereiche/${node.slug}`} className="flex flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary transition outline-focus-ring ring-inset hover:ring-brand focus-visible:outline-2">
                                <div className="flex items-center justify-between gap-3">
                                    <FeaturedIcon icon={Icon} size="md" color="gray" theme="modern" />
                                    <span className="text-sm font-semibold text-secondary">{value}%</span>
                                </div>
                                <div>
                                    <h3 className="text-md font-semibold text-primary">{node.title}</h3>
                                    <p className="mt-0.5 text-sm text-tertiary">{completed} von {activities.length} Aktivitäten</p>
                                </div>
                                <ProgressBar value={completed} max={Math.max(activities.length, 1)} />
                            </Link>
                        );
                    })}
                </div>
            </section>

            {latest && (
                <section className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-primary">Aktueller Lernweg</h2>
                        <p className="text-sm text-tertiary">{latest.trail.join(" · ")}</p>
                    </div>
                    <div className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                        {pageActivities.map((activity, index) => {
                            const itemProgress = byId.get(activity.id);
                            const status = statusFor(itemProgress);
                            return (
                                <Link key={activity.id} href={activity.href} className="flex items-center gap-4 border-b border-secondary px-5 py-3 last:border-b-0 hover:bg-primary_hover">
                                    <span className="text-sm font-black text-tertiary">{activity.index.toString().padStart(2, "0")}</span>
                                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-primary">{activity.title}</span>
                                    {itemProgress && <span className="hidden text-sm text-tertiary sm:block">{itemProgress.tasksCompleted} / {itemProgress.taskCount}</span>}
                                    <Badge type="color" size="sm" color={status.color}>{status.label}</Badge>
                                    {index === pageActivities.length - 1 && itemProgress?.status === "completed" && <CheckCircle className="size-5 text-fg-success-primary" />}
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {recommendations.length > 0 && (
                <section className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-primary">Noch einmal üben</h2>
                        <p className="text-sm text-tertiary">Diese Aktivitäten lohnen sich für eine Wiederholung.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {recommendations.map(({ activity, progress: itemProgress }) => (
                            <div key={activity.id} className="flex flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                                <div className="flex items-start justify-between gap-3">
                                    <FeaturedIcon icon={RefreshCw01} size="sm" color="warning" theme="light" />
                                    <Badge size="sm" color="warning">Wiederholen</Badge>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-tertiary">{getHierarchicalNumber(activity.path)}</p>
                                    <h3 className="mt-1 text-md font-semibold text-primary">{activity.title}</h3>
                                    <p className="mt-1 text-sm text-tertiary">{itemProgress.solutionsRevealed} Lösungen angezeigt</p>
                                </div>
                                <Button href={activity.href} color="secondary" size="sm">Erneut üben</Button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
