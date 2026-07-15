import { ChevronRight } from "@untitledui/icons";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CurriculumTitle } from "@/components/curriculum/curriculum-title";
import { NodeGrid } from "@/components/curriculum/node-grid";
import { PageHeader } from "@/components/curriculum/page-header";
import { ExerciseRenderer } from "@/components/exercises/registry";
import { IntroExerciseTabs } from "@/components/exercises/intro/intro-exercise-tabs";
import { allPaths, curriculum, getHierarchicalNumber, resolvePath } from "@/content/curriculum";
import { iconMap } from "@/content/icons";

export function generateStaticParams() {
    return allPaths().map((slug) => ({ slug }));
}

const hrefForSegments = (segments: string[]) => (segments.length ? `/kompetenzbereiche/${segments.join("/")}` : "/kompetenzbereiche");

export default async function CurriculumPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug = [] } = await params;

    if (slug.length === 0) redirect("/");
    redirect(`/kompetenzbereiche/${slug.join("/")}`);
}

export async function CurriculumContent({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug = [] } = await params;

    const resolved = resolvePath(slug);
    if (!resolved) notFound();

    const { node, trail } = resolved;
    const children = node ? (node.children ?? []) : curriculum;
    const exercises = node?.exercises ?? [];
    const Icon = node?.icon ? iconMap[node.icon] : undefined;

    // Root level: show the large competency cards.
    if (!node) {
        return (
            <div className="flex flex-col gap-6">
                <PageHeader title="Kompetenzbereiche" description="Wählen Sie einen Bereich, um mit dem Üben zu beginnen." />
                <NodeGrid nodes={curriculum} basePath={[]} variant="cards" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                {trail.length > 1 && (
                    <>
                        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-tertiary">
                            {trail.slice(0, -1).map((crumb, index) => (
                                <span key={crumb.slug} className="flex items-center gap-1.5">
                                    <Link
                                        href={hrefForSegments(slug.slice(0, index + 1))}
                                        className="rounded-sm outline-focus-ring hover:text-secondary focus-visible:outline-2"
                                    >
                                        {crumb.title}
                                    </Link>
                                    <ChevronRight className="size-4 text-fg-quaternary" />
                                </span>
                            ))}
                        </nav>
                        <div className="h-px bg-border-secondary" />
                    </>
                )}

                <div>
                    <PageHeader
                        title={<CurriculumTitle slug={node.slug} fallback={node.title} />}
                        description={node.description}
                        icon={Icon}
                        hierarchicalNumber={getHierarchicalNumber(slug)}
                    />
                </div>
            </div>

            {children.length > 0 ? (
                <NodeGrid nodes={children} basePath={slug} variant={slug.length === 1 ? "first-level" : "list"} />
            ) : exercises.length > 0 ? (
                exercises.length > 1 && exercises.every((exercise) => exercise.type === "intro" || exercise.type === "number-speech-explainer") ? (
                    <IntroExerciseTabs exercises={exercises} />
                ) : (
                    <div className="flex flex-col items-center gap-6 [&>*]:w-full">
                        {exercises.map((exercise, index) => (
                            <div key={index} className="flex w-full justify-center [&>*]:w-full" data-marketing-capture={`activity-${index + 1}`}>
                                <ExerciseRenderer exercise={exercise} exerciseNumber={index + 1} activityId={exercise.id ?? `${slug.join("/")}#${index + 1}`} />
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <p className="text-sm text-tertiary">Keine Unterthemen vorhanden.</p>
            )}
        </div>
    );
}
