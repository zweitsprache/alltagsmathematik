"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { BarChartSquare02, Calculator, Clock, Cube01, Headphones01, HomeLine, LayoutAlt01, LifeBuoy01, LineChartUp01, List, Ruler, Settings01 } from "@untitledui/icons";
import { usePathname } from "next/navigation";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { SidebarNavigationSimple } from "@/components/application/app-navigation/sidebar-navigation/sidebar-simple";
import { CurriculumTitle } from "@/components/curriculum/curriculum-title";
import { curriculum, getHierarchicalNumber, resolvePath } from "@/content/curriculum";

const RightCurriculumSidebar = ({ pathname }: { pathname: string }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => setIsMounted(true), []);

    if (!isMounted) return null;
    if (!pathname.startsWith("/kompetenzbereiche/")) return null;
    const slug = pathname.replace("/kompetenzbereiche/", "").split("/").filter(Boolean);
    const resolved = resolvePath(slug);
    if (!resolved?.node?.exercises?.length) return null;
    const parent = resolvePath(slug.slice(0, -1))?.node;
    const siblings = parent?.children ?? curriculum;

    return (
        <aside className="hidden w-128 shrink-0 border-l border-secondary bg-primary px-4 py-6 xl:block">
            <div className="sticky top-6 flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-tertiary">Weitere Aktivitäten</p>
                <div className="grid grid-cols-2 gap-2">
                    {siblings.map((sibling) => {
                        const siblingPath = [...slug.slice(0, -1), sibling.slug];
                        const active = sibling.slug === resolved.node?.slug;
                        return (
                            <Link key={sibling.slug} href={`/kompetenzbereiche/${siblingPath.join("/")}`} className={`flex h-16 items-stretch rounded-md border px-3 py-2 outline-focus-ring transition hover:border-brand ${active ? "border-brand bg-brand-primary text-brand-secondary" : "border-secondary bg-primary text-primary"}`}>
                                <span className="mr-3 flex shrink-0 items-center border-r border-secondary pr-3 text-sm font-black text-tertiary">{getHierarchicalNumber(siblingPath)}</span>
                                <span className="flex items-center text-xs leading-[1.15]">
                                    <CurriculumTitle slug={sibling.slug} fallback={sibling.title} />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

const navItems: NavItemType[] = [
    { label: "Home", href: "/", icon: HomeLine },
    { label: "Zahlen und Variablen", href: "/kompetenzbereiche/zahlen-und-variablen", icon: Calculator },
    { label: "Grössen und Einheiten", href: "/kompetenzbereiche/groessen-und-einheiten", icon: Ruler },
    { label: "Raum und Zeit", href: "/kompetenzbereiche/raum-und-zeit", icon: Clock },
    { label: "Geometrie", href: "/kompetenzbereiche/geometrie", icon: Cube01 },
    { label: "Funktionale Zusammenhänge", href: "/kompetenzbereiche/funktionale-zusammenhaenge", icon: LineChartUp01 },
    { label: "Dashboard", href: "/dashboard", icon: BarChartSquare02 },
];

const footerNavItems: NavItemType[] = [
    { label: "Settings", href: "/settings", icon: Settings01 },
    { label: "Curriculum", href: "/settings/curriculum", icon: List },
    { label: "Audio", href: "/settings/audio", icon: Headphones01 },
    { label: "Support", href: "/support", icon: LifeBuoy01 },
    { label: "Open in browser", href: "#", icon: LayoutAlt01 },
];

/** App chrome for the curriculum pages: sidebar and main content area. */
export const SettingsShell = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();

    return (
        <div className="flex flex-col bg-primary lg:flex-row">
            <SidebarNavigationSimple activeUrl={pathname} items={navItems} footerItems={footerNavItems} />

            <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
            <RightCurriculumSidebar pathname={pathname} />
        </div>
    );
};
