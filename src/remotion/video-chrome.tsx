import type { ReactNode } from "react";
import { Img, staticFile } from "remotion";
import { useCompositionMetadata } from "./branded-slides";
import { videoCopyright } from "./video-constants";

export { videoCopyright } from "./video-constants";

export const VideoChrome = ({ curriculumLabel, children }: { curriculumLabel: ReactNode; children: ReactNode }) => {
    const metadata = useCompositionMetadata();
    const displayedHeader = metadata?.header ? (
        <>
            <strong>{metadata.header.split("|")[0].trim()}</strong>
            {metadata.header.includes("|") ? ` | ${metadata.header.split("|").slice(1).join("|").trim()}` : ""}
        </>
    ) : (
        curriculumLabel
    );

    return (
        <>
        <p
            style={{
                position: "absolute",
                top: 60,
                left: 60,
                margin: 0,
                color: "#101828",
                fontSize: 24,
                fontWeight: 400,
                lineHeight: 1.4,
            }}
        >
            {displayedHeader}
        </p>

        <Img
            src={staticFile("alltagsmathematik_logo_color_outline.svg")}
            style={{
                position: "absolute",
                top: 60,
                right: 60,
                width: 90,
                height: 90,
            }}
        />

        {children}

        <p
            style={{
                position: "absolute",
                bottom: 48,
                left: 60,
                margin: 0,
                color: "#667085",
                fontSize: 24,
                lineHeight: 1.4,
            }}
        >
            {videoCopyright}
        </p>
        </>
    );
};
