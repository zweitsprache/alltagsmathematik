import { AbsoluteFill, Img, staticFile } from "remotion";
import { VideoChrome } from "../video-chrome";

export const timeCompositionDuration = 300;

export const TimeComposition = () => {
    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#ffffff",
                fontFamily: "Encode Sans Semi Condensed, sans-serif",
            }}
        >
            <VideoChrome curriculumLabel="Uhrzeit">
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        display: "flex",
                        width: "60%",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            width: 740,
                            height: 740,
                        }}
                    >
                        <Img
                            src={staticFile("transfer/am_zifferblatt_0000.svg")}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                width: 560,
                                height: 560,
                                objectFit: "contain",
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                        {Array.from({ length: 12 }, (_, index) => {
                            const hour = index + 1;
                            const angle = (hour * 30 - 90) * (Math.PI / 180);
                            const useRightEdgeAnchor = hour >= 7 && hour <= 11;
                            const useLeftEdgeAnchor = hour >= 1 && hour <= 5;
                            const useTopLabelAnchor = hour === 12;
                            const useBottomLabelAnchor = hour === 6;
                            const radius = useRightEdgeAnchor || useLeftEdgeAnchor || useTopLabelAnchor || useBottomLabelAnchor
                                ? 325
                                : 302 + Math.abs(Math.cos(angle)) * 62 + Math.abs(Math.sin(angle)) * 20;

                            return (
                                <span
                                    key={hour}
                                    style={{
                                        position: "absolute",
                                        top: 370 + Math.sin(angle) * radius,
                                        left: 370 + Math.cos(angle) * radius,
                                        color: "#101828",
                                        fontSize: 40,
                                        fontWeight: 500,
                                        lineHeight: 1,
                                        fontVariantNumeric: "tabular-nums",
                                        whiteSpace: "nowrap",
                                        display: "grid",
                                        gridTemplateColumns: "2ch auto 2ch",
                                        columnGap: 8,
                                        alignItems: "center",
                                        transform: useRightEdgeAnchor
                                            ? "translate(-100%, -50%)"
                                            : useLeftEdgeAnchor
                                              ? "translate(0, -50%)"
                                              : useTopLabelAnchor
                                                ? "translate(-50%, -100%)"
                                                : "translate(-50%, 0)",
                                    }}
                                >
                                    <span style={{ textAlign: "right" }}>
                                        {String(hour === 12 ? 0 : hour).padStart(2, "0")}
                                    </span>
                                    <span>|</span>
                                    <span style={{ textAlign: "left" }}>{hour === 12 ? 12 : hour + 12}</span>
                                </span>
                            );
                        })}
                    </div>
                </div>
            </VideoChrome>
        </AbsoluteFill>
    );
};
