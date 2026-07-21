import { PlayCircle } from "@untitledui/icons";
import { PageHeader } from "@/components/curriculum/page-header";
import { RemotionManagementClient } from "@/components/remotion-management/remotion-management-client";

export default function VideoManagementPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Videokompositionen"
                description="Remotion-Kompositionen zentral prüfen, abspielen und für den Export vorbereiten."
                icon={PlayCircle}
            />
            <RemotionManagementClient />
        </div>
    );
}
