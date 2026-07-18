import type { ReactNode } from "react";
import { Img, staticFile } from "remotion";

export const videoCopyright = "© 2026 alltagsmathematik.ch | Marcel Allenspach. Alle Rechte vorbehalten.";

export const VideoChrome = ({ curriculumLabel, children }: { curriculumLabel: ReactNode; children: ReactNode }) => (
    <>
        <p
            style={{
                position: "absolute",
                top: 60,
                left: 60,
                margin: 0,
                color: "#667085",
                fontSize: 24,
                fontWeight: 400,
                lineHeight: 1.4,
            }}
        >
            {curriculumLabel}
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
