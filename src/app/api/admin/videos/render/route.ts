import { getCompositionsOnLambda, renderMediaOnLambda } from "@remotion/lambda/client";
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
        const metadata = sanitizeCompositionMetadata(body?.metadata);
        const compositions = await getCompositionsOnLambda({
            region: remotionRegion,
            functionName,
            serveUrl,
            inputProps: { metadata },
            envVariables: {},
        });
        const composition = compositions.find(({ id }) => id === compositionId);
        if (!composition) {
            return NextResponse.json({ error: "Composition not found." }, { status: 404 });
        }

        const minimumFramesPerLambda = Math.ceil(composition.durationInFrames / 190);
        const framesPerLambda = Math.max(60, Math.ceil(minimumFramesPerLambda / 10) * 10);
        const result = await renderMediaOnLambda({
            region: remotionRegion,
            functionName,
            serveUrl,
            composition: compositionId,
            inputProps: { metadata },
            codec: "h264",
            imageFormat: "jpeg",
            framesPerLambda,
            maxRetries: 1,
            privacy: "public",
            downloadBehavior: { type: "download", fileName: `${compositionId}.mp4` },
        });

        return NextResponse.json({
            renderId: result.renderId,
            bucketName: result.bucketName,
            functionName,
            framesPerLambda,
        });
    } catch (error) {
        console.error("Could not start Remotion Lambda render", error);
        return NextResponse.json({ error: "The video render could not be started." }, { status: 502 });
    }
}
