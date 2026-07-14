import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAudioCatalogAsset } from "@/lib/audio-catalog";

export async function GET(request: Request) {
    const blobPath = new URL(request.url).searchParams.get("path") ?? "";
    if (!getAudioCatalogAsset(blobPath)) return NextResponse.json({ error: "Unknown audio asset." }, { status: 404 });
    const result = await get(blobPath, { access: "private", useCache: false });
    if (!result) return NextResponse.json({ error: "Audio was not found." }, { status: 404 });
    return new Response(result.stream, { headers: { "Content-Type": result.blob.contentType || "audio/mpeg", "Cache-Control": "private, no-store" } });
}
