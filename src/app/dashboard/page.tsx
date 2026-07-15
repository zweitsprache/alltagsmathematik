import { redirect } from "next/navigation";
import { SettingsShell } from "@/components/application/settings-shell";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { auth } from "@/lib/auth/server";
import { getStudentProgress } from "@/lib/progress/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) redirect("/login?next=/dashboard");

    const progress = await getStudentProgress(session.user.id);
    return (
        <SettingsShell>
            <StudentDashboard name={session.user.name} progress={progress} />
        </SettingsShell>
    );
}
