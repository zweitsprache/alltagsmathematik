import { getRenderProgress } from "@remotion/lambda/client";
import { NextResponse } from "next/server";
import { remotionRegion, requireVideoAdmin } from "@/lib/remotion-lambda";

export const runtime = "nodejs";

export async function GET(request: Request) {
    const authorization = await requireVideoAdmin();
    if ("error" in authorization) {
        return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const { searchParams } = new URL(request.url);
    const renderId = searchParams.get("renderId") ?? "";
    const bucketName = searchParams.get("bucketName") ?? "";
    const functionName = searchParams.get("functionName") ?? "";
    if (
        !/^[A-Za-z0-9-]{1,100}$/.test(renderId) ||
        !/^remotionlambda-[a-z0-9-]{1,100}$/.test(bucketName) ||
        !/^remotion-render-[A-Za-z0-9-]{1,150}$/.test(functionName)
    ) {
        return NextResponse.json({ error: "Invalid render reference." }, { status: 400 });
    }

    try {
        const progress = await getRenderProgress({
            region: remotionRegion,
            renderId,
            bucketName,
            functionName,
        });

        return NextResponse.json({
            done: progress.done,
            progress: progress.overallProgress,
            outputFile: progress.outputFile,
            fatalErrorEncountered: progress.fatalErrorEncountered,
            errors: progress.errors.map((error) => error.message),
            estimatedCost: progress.costs.accruedSoFar,
        });
    } catch (error) {
        console.error("Could not load Remotion Lambda progress", error);
        return NextResponse.json({ error: "Render progress could not be loaded." }, { status: 502 });
    }
}
