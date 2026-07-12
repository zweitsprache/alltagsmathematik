import Link from "next/link";
import { ChevronRight } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import type { CurriculumNode } from "@/content/curriculum";
import { getHierarchicalNumber } from "@/content/curriculum";
import { iconMap } from "@/content/icons";

const hrefFor = (basePath: string[], slug: string) => `/settings/${[...basePath, slug].join("/")}`;

const childCount = (node: CurriculumNode) => node.children?.length ?? node.exercises?.length ?? 0;

/**
 * Renders a list of curriculum nodes as navigable cards.
 * - `cards`: large cards with icon and description (top level).
 * - `list`: compact rows (nested levels).
 */
export const NodeGrid = ({ nodes, basePath, variant }: { nodes: CurriculumNode[]; basePath: string[]; variant: "cards" | "list" }) => {
    if (variant === "cards") {
        return (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {nodes.map((node) => {
                    const Icon = node.icon ? iconMap[node.icon] : undefined;
                    const count = childCount(node);
                    const nodeSlug = [...basePath, node.slug];
                    const number = getHierarchicalNumber(nodeSlug);

                    return (
                        <Link
                            key={node.slug}
                            href={hrefFor(basePath, node.slug)}
                            className="flex h-full flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary transition duration-100 ease-linear outline-focus-ring ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            <div className="flex items-start justify-between">
                                {Icon && <FeaturedIcon icon={Icon} size="lg" color="brand" theme="light" />}
                                <ChevronRight className="size-5 text-fg-quaternary" />
                            </div>

                            <div className="flex flex-1 flex-col gap-1">
                                <div className="flex items-baseline gap-3">
                                    {number && <span className="text-md font-black text-tertiary">{number}</span>}
                                    <h3 className="text-md font-bold text-primary">{node.title}</h3>
                                </div>
                                {node.description && <p className="text-sm text-tertiary">{node.description}</p>}
                            </div>

                            <p className="text-xs font-medium text-quaternary">
                                {count} {count === 1 ? "Unterthema" : "Unterthemen"}
                            </p>
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {nodes.map((node) => {
                const nodeSlug = [...basePath, node.slug];
                const number = getHierarchicalNumber(nodeSlug);

                return (
                    <Link
                        key={node.slug}
                        href={hrefFor(basePath, node.slug)}
                        className="flex items-center gap-3 rounded-xl bg-primary p-4 ring-1 ring-secondary transition duration-100 ease-linear outline-focus-ring ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        <span className="size-2 shrink-0 rounded-full bg-brand-solid" />
                        <div className="flex flex-1 flex-col gap-0">
                            <div className="flex items-baseline gap-3">
                                {number && <span className="text-sm font-black text-tertiary">{number}</span>}
                                <p className="text-sm font-normal text-primary">{node.title}</p>
                            </div>
                        </div>
                        <ChevronRight className="size-5 shrink-0 text-fg-quaternary" />
                    </Link>
                );
            })}
        </div>
    );
};
