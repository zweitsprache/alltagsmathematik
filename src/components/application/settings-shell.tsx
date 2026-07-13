"use client";

import type { ReactNode } from "react";
import { BarChartSquare02, Calculator, Clock, Cube01, HomeLine, LayoutAlt01, LifeBuoy01, LineChartUp01, List, Ruler, Settings01 } from "@untitledui/icons";
import { usePathname } from "next/navigation";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { SidebarNavigationSimple } from "@/components/application/app-navigation/sidebar-navigation/sidebar-simple";

const navItems: NavItemType[] = [
    { label: "Home", href: "/", icon: HomeLine },
    { label: "Raum und Zeit", href: "/settings/raum-und-zeit", icon: Clock },
    { label: "Grössen und Einheiten", href: "/settings/groessen-und-einheiten", icon: Ruler },
    { label: "Zahlen und Variablen", href: "/settings/zahlen-und-variablen", icon: Calculator },
    { label: "Geometrie", href: "/settings/geometrie", icon: Cube01 },
    { label: "Funktionale Zusammenhänge", href: "/settings/funktionale-zusammenhaenge", icon: LineChartUp01 },
    { label: "Dashboard", href: "/dashboard", icon: BarChartSquare02 },
];

const footerNavItems: NavItemType[] = [
    { label: "Settings", href: "/settings", icon: Settings01 },
    { label: "Curriculum", href: "/settings/curriculum", icon: List },
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
        </div>
    );
};
