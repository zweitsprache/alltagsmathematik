import { CurriculumContent } from "@/app/settings/[[...slug]]/page";
import { SettingsShell } from "@/components/application/settings-shell";

export default async function HomePage() {
    return (
        <SettingsShell>
            {await CurriculumContent({ params: Promise.resolve({ slug: [] }) })}
        </SettingsShell>
    );
}
