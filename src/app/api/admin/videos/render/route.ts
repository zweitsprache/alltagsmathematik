import { getCompositionsOnLambda, renderMediaOnLambda } from "@remotion/lambda/client";
import { issueSignedToken, presignUrl } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getRemotionLambdaConfig, remotionRegion, requireVideoAdmin, sanitizeCompositionMetadata } from "@/lib/remotion-lambda";
import { sanitizeVideoTtsItems } from "@/lib/video-tts";

export const runtime = "nodejs";

export async function POST(request: Request) {
    const authorization = await requireVideoAdmin();
    if ("error" in authorization) {
        return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const body = (await request.json().catch(() => null)) as {
        compositionId?: unknown;
        metadata?: unknown;
        ttsItems?: unknown;
    } | null;
    const compositionId = typeof body?.compositionId === "string" ? body.compositionId : "";
    if (!/^[A-Za-z0-9]{1,80}$/.test(compositionId)) {
        return NextResponse.json({ error: "Invalid composition ID." }, { status: 400 });
    }

    try {
        const { serveUrl, functionName } = await getRemotionLambdaConfig();
        const metadata = sanitizeCompositionMetadata(body?.metadata);
        const storedTtsItems = sanitizeVideoTtsItems(body?.ttsItems);
        const validUntil = Date.now() + 6 * 60 * 60 * 1000;
        const signedToken = storedTtsItems.length ? await issueSignedToken({ pathname: "*", operations: ["get"], validUntil }) : null;
        const ttsItems = await Promise.all(
            storedTtsItems.map(async (item) => ({
                ...item,
                audioUrl: (
                    await presignUrl(signedToken!, {
                        access: "private",
                        operation: "get",
                        pathname: item.blobPath,
                        validUntil,
                    })
                ).presignedUrl,
            })),
        );
        const inputProps = { metadata, ttsItems };
        const compositions = await getCompositionsOnLambda({
            region: remotionRegion,
            functionName,
            serveUrl,
            inputProps,
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
            inputProps,
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
