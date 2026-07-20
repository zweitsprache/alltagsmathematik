import { createContext, type ReactNode, useContext } from "react";
import { Calculator, CalendarClock, MapPin, Percent, Tally5 } from "lucide-react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { videoCopyright } from "./video-constants";

const darkBackgroundNumbers = [
    1, 3, 5, 7, 9, 11, 12, 14, 16, 17, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 61, 62, 63, 64, 65, 66, 67, 68, 69,
    70, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165,
    166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187,
    188, 189, 190,
].map((number) => ({ number, theme: "dark" as const }));

const lightBackgroundNumbers = [
    2, 4, 8, 10, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
].map((number) => ({ number, theme: "light" as const }));

const titleBackgrounds = [...darkBackgroundNumbers, ...lightBackgroundNumbers];

export type TitleIconName = "tally" | "calendar-clock" | "map-pin" | "calculator" | "percent";

export type CompositionMetadataOverrides = {
    header?: string;
    title?: string;
    subtitle?: string;
    icon?: TitleIconName;
    backgroundNumber?: string;
};

const CompositionMetadataContext = createContext<CompositionMetadataOverrides | null>(null);

export const useCompositionMetadata = () => useContext(CompositionMetadataContext);

export const CompositionMetadataProvider = ({
    value,
    children,
}: {
    value: CompositionMetadataOverrides;
    children: ReactNode;
}) => <CompositionMetadataContext.Provider value={value}>{children}</CompositionMetadataContext.Provider>;

const hashSeed = (seed: string) => {
    let hash = 2166136261;
    for (const character of seed) {
        hash ^= character.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
};

export const getTitleBackground = (seed: string) => {
    const { number, theme } = titleBackgrounds[hashSeed(seed) % titleBackgrounds.length];

    return {
        number: String(number).padStart(2, "0"),
        path: `title_slides/${theme}/am_title_slide_${String(number).padStart(2, "0")}.png`,
        theme,
    } as const;
};

export const getTitleBackgroundByNumber = (backgroundNumber: string) => {
    const parsedNumber = Number.parseInt(backgroundNumber, 10);
    const background = titleBackgrounds.find(({ number }) => number === parsedNumber);
    if (!background) return null;

    return {
        number: String(background.number).padStart(2, "0"),
        path: `title_slides/${background.theme}/am_title_slide_${String(background.number).padStart(2, "0")}.png`,
        theme: background.theme,
    } as const;
};

export const getRandomTitleBackground = (excludeNumber?: string) => {
    const candidates = titleBackgrounds.filter(
        ({ number }) => String(number).padStart(2, "0") !== excludeNumber,
    );
    const background = candidates[Math.floor(Math.random() * candidates.length)];
    return String(background.number).padStart(2, "0");
};

const titleIcons = {
    tally: Tally5,
    "calendar-clock": CalendarClock,
    "map-pin": MapPin,
    calculator: Calculator,
    percent: Percent,
} satisfies Record<TitleIconName, typeof Tally5>;

export const BrandedTitleSlide = ({
    seed,
    curriculumLabel,
    title,
    subtitle,
    icon,
}: {
    seed: string;
    curriculumLabel: ReactNode;
    title: string;
    subtitle: string;
    icon?: ReactNode;
}) => {
    const overrides = useContext(CompositionMetadataContext);
    const background =
        (overrides?.backgroundNumber && getTitleBackgroundByNumber(overrides.backgroundNumber)) ||
        getTitleBackground(seed);
    const color = background.theme === "light" ? "#101828" : "#ffffff";
    const OverrideIcon = overrides?.icon ? titleIcons[overrides.icon] : null;
    const displayedIcon = OverrideIcon ? <OverrideIcon size={64} strokeWidth={2.5} /> : icon;
    const displayedHeader = overrides?.header ? (
        <>
            <strong>{overrides.header.split("|")[0].trim()}</strong>
            {overrides.header.includes("|") ? ` | ${overrides.header.split("|").slice(1).join("|").trim()}` : ""}
        </>
    ) : (
        curriculumLabel
    );

    return (
        <AbsoluteFill style={{ color, fontFamily: '"Encode Sans Semi Condensed", sans-serif' }}>
            <Img
                src={staticFile(background.path)}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <p style={{ position: "absolute", top: 60, left: 60, margin: 0, fontSize: 24, lineHeight: 1.4 }}>
                {displayedHeader}
            </p>
            <Img
                src={staticFile(
                    background.theme === "light"
                        ? "alltagsmathematik_logo_color_outline.svg"
                        : "alltagsmathematik_brandmark_primary_invert.svg",
                )}
                style={{ position: "absolute", top: 60, right: 60, width: 90, height: 90 }}
            />
            <div style={{ position: "absolute", top: "50%", left: 160, transform: "translateY(-50%)" }}>
                {displayedIcon && (
                    <div
                        style={{
                            display: "flex",
                            width: 104,
                            height: 104,
                            marginBottom: 34,
                            alignItems: "center",
                            justifyContent: "center",
                            border: `3px solid ${color}`,
                            borderRadius: 21,
                        }}
                    >
                        {displayedIcon}
                    </div>
                )}
                <h1 style={{ margin: 0, fontSize: 92, fontWeight: 700, lineHeight: 1.05 }}>
                    {overrides?.title ?? title}
                </h1>
                <p style={{ margin: "18px 0 0", fontSize: 58, fontWeight: 400, lineHeight: 1.15 }}>
                    {overrides?.subtitle ?? subtitle}
                </p>
            </div>
            <p style={{ position: "absolute", bottom: 48, left: 60, margin: 0, fontSize: 24, lineHeight: 1.4 }}>
                {videoCopyright}
            </p>
        </AbsoluteFill>
    );
};

export const StandardEndSlide = () => (
    <AbsoluteFill
        style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            color: "#101828",
            fontFamily: '"Encode Sans Semi Condensed", sans-serif',
            textAlign: "center",
        }}
    >
        <Img
            src={staticFile("alltagsmathematik_logo_color_outline.svg")}
            style={{ position: "absolute", top: 60, right: 60, width: 90, height: 90 }}
        />
        <div style={{ width: 1440, fontSize: 48, fontWeight: 400, lineHeight: 1.35 }}>
            <div>
                Dieses Video ist urheberrechtlich geschützt. Jegliche kommerzielle Nutzung ist ohne schriftliche
                Genehmigung nicht gestattet.
            </div>
            <div style={{ marginTop: 36 }}>Interaktive Übungen und weitere Materialien finden Sie auf</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>alltagsmathematik.ch</div>
        </div>
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
    </AbsoluteFill>
);
