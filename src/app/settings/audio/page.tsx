import { AudioManagement } from "@/components/audio-management/audio-management";
import { PageHeader } from "@/components/curriculum/page-header";
import { getAudioCatalog } from "@/lib/audio-catalog";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type AudioOverride = { blob_path: string; generation_text: string; voice_id: string; instruction: string; updated_at: string | Date };

export default async function AudioManagementPage() {
    const sql = getDb();
    const overrides = await sql`SELECT blob_path, generation_text, voice_id, instruction, updated_at FROM audio_assets` as unknown as AudioOverride[];
    const byPath = new Map(overrides.map((row) => [String(row.blob_path), row]));
    const groups = getAudioCatalog().map((group) => ({
        ...group,
        assets: group.assets.map((asset) => {
            const override = byPath.get(asset.blobPath);
            return {
                ...asset,
                text: override ? String(override.generation_text) : asset.text,
                voiceId: override ? String(override.voice_id) : "Matthias",
                instruction: override ? String(override.instruction) : "well-pronounced and much slower than native",
                updatedAt: override?.updated_at ? new Date(String(override.updated_at)).toISOString() : null,
            };
        }),
    }));

    return <div className="flex flex-col gap-6"><PageHeader title="Audioverwaltung" description="Audiodateien pro Aktivität prüfen, bearbeiten und neu generieren." /><AudioManagement groups={groups} /></div>;
}
