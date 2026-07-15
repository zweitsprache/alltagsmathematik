import { redirect } from "next/navigation";
import { SettingsShell } from "@/components/application/settings-shell";
import { TtsStreamTest } from "@/components/tts-stream-test/tts-stream-test";
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function TtsStreamTestPage() {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) redirect("/login?next=/tts-stream-test");

    return <SettingsShell><TtsStreamTest /></SettingsShell>;
}
