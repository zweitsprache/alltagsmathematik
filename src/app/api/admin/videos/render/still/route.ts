import { renderStillOnLambda } from "@remotion/lambda/client";
import { NextResponse } from "next/server";
import {
    getRemotionLambdaConfig,
    remotionRegion,
    requireVideoAdmin,
    sanitizeCompositionMetadata,
} from "@/lib/remotion-lambda";

export const runtime = "nodejs";

export async function POST(request: Request) {
    const authorization = await requireVideoAdmin();
    if ("error" in authorization) {
        return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const body = await request.json().catch(() => null) as {
        compositionId?: unknown;
        metadata?: unknown;
    } | null;
    const compositionId = typeof body?.compositionId === "string" ? body.compositionId : "";
    if (!/^[A-Za-z0-9]{1,80}$/.test(compositionId)) {
        return NextResponse.json({ error: "Invalid composition ID." }, { status: 400 });
    }

    try {
        const { serveUrl, functionName } = await getRemotionLambdaConfig();
        const result = await renderStillOnLambda({
            region: remotionRegion,
            functionName,
            serveUrl,
            composition: compositionId,
            inputProps: { metadata: sanitizeCompositionMetadata(body?.metadata) },
            frame: 0,
            imageFormat: "png",
            privacy: "public",
            maxRetries: 1,
            downloadBehavior: { type: "download", fileName: `${compositionId}-frame-0000.png` },
        });

        return NextResponse.json({ outputFile: result.url });
    } catch (error) {
        console.error("Could not render first Remotion frame", error);
        return NextResponse.json({ error: "The first frame could not be rendered." }, { status: 502 });
    }
}
