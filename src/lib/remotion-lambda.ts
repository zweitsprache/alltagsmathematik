import "server-only";

import { getFunctions } from "@remotion/lambda/client";
import type { AwsRegion } from "@remotion/lambda/client";
import { auth } from "@/lib/auth/server";
import { hasUserRole } from "@/lib/auth/roles";
import type { CompositionMetadataOverrides, TitleIconName } from "@/remotion/branded-slides";

export const remotionRegion: AwsRegion = "eu-central-1";

const iconNames = new Set<TitleIconName>(["tally", "calendar-clock", "map-pin", "calculator", "percent"]);

const cleanText = (value: unknown, maximumLength: number) =>
    typeof value === "string" ? value.trim().slice(0, maximumLength) : undefined;

export const sanitizeCompositionMetadata = (value: unknown): CompositionMetadataOverrides => {
    if (!value || typeof value !== "object") return {};
    const metadata = value as Record<string, unknown>;
    const icon = typeof metadata.icon === "string" && iconNames.has(metadata.icon as TitleIconName)
        ? metadata.icon as TitleIconName
        : undefined;
    const backgroundNumber =
        typeof metadata.backgroundNumber === "string" && /^\d{1,3}$/.test(metadata.backgroundNumber)
            ? metadata.backgroundNumber
            : undefined;

    return {
        header: cleanText(metadata.header, 180),
        title: cleanText(metadata.title, 160),
        subtitle: cleanText(metadata.subtitle, 180),
        icon,
        backgroundNumber,
    };
};

export const requireVideoAdmin = async () => {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) return { error: "Authentication required.", status: 401 } as const;
    if (!(await hasUserRole(session.user.id, ["admin"], false))) {
        return { error: "Administrator access required.", status: 403 } as const;
    }

    return { session } as const;
};

export const getRemotionLambdaConfig = async () => {
    const serveUrl = process.env.REMOTION_SERVE_URL;
    if (!serveUrl) throw new Error("REMOTION_SERVE_URL is not configured.");

    const configuredFunctionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME;
    if (configuredFunctionName) {
        return { serveUrl, functionName: configuredFunctionName };
    }

    const functions = await getFunctions({ region: remotionRegion, compatibleOnly: true });
    const functionName = functions[0]?.functionName;
    if (!functionName) throw new Error("No compatible Remotion Lambda function is deployed.");

    return { serveUrl, functionName };
};
