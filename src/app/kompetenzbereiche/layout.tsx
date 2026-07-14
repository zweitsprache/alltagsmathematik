import type { ReactNode } from "react";
import { SettingsShell } from "@/components/application/settings-shell";

export default function KompetenzbereicheLayout({ children }: { children: ReactNode }) {
    return <SettingsShell>{children}</SettingsShell>;
}
