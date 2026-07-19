type TitleSlidePatternProps = {
    color: string;
    variant?: "wave-grid" | "waves" | "orbits" | "ribbons";
};

const sharedStyle = {
    position: "absolute",
    top: 150,
    right: -180,
    width: 1080,
    height: 850,
    opacity: 0.11,
} as const;

export const TitleSlidePattern = ({ color, variant = "waves" }: TitleSlidePatternProps) => (
    <div
        style={
            variant === "wave-grid"
                ? {
                      position: "absolute",
                      inset: 0,
                      width: 1920,
                      height: 1080,
                      overflow: "hidden",
                  }
                : sharedStyle
        }
    >
        <svg
            viewBox={variant === "wave-grid" ? "0 0 1920 1080" : "0 0 1080 850"}
            aria-hidden="true"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
            {variant === "wave-grid" && (
                <>
                    <defs>
                        <linearGradient id="title-grid-horizontal" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={color} stopOpacity="0" />
                            <stop offset="28%" stopColor={color} stopOpacity="0.18" />
                            <stop offset="66%" stopColor={color} stopOpacity="0.5" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.12" />
                        </linearGradient>
                        <linearGradient id="title-grid-vertical" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.08" />
                            <stop offset="55%" stopColor={color} stopOpacity="0.42" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                        </linearGradient>
                        <filter id="title-grid-depth" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="10" />
                        </filter>
                    </defs>

                    <g opacity="0.05" filter="url(#title-grid-depth)" transform="translate(34 38)">
                        {Array.from({ length: 10 }, (_, index) => {
                            const y = 130 + index * 105;
                            return (
                                <path
                                    key={`depth-horizontal-${index}`}
                                    d={`M-120 ${y} C380 ${y - 95} 760 ${y + 92} 1160 ${y - 22} S1690 ${y - 74} 2070 ${y + 24}`}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="14"
                                />
                            );
                        })}
                    </g>

                    <g opacity="0.3">
                        {Array.from({ length: 10 }, (_, index) => {
                            const y = 130 + index * 105;
                            return (
                                <path
                                    key={`horizontal-${index}`}
                                    d={`M-120 ${y} C380 ${y - 95} 760 ${y + 92} 1160 ${y - 22} S1690 ${y - 74} 2070 ${y + 24}`}
                                    fill="none"
                                    stroke="url(#title-grid-horizontal)"
                                    strokeWidth={index === 5 ? 4 : 2}
                                />
                            );
                        })}
                        {Array.from({ length: 14 }, (_, index) => {
                            const topX = 500 + index * 118;
                            const bottomX = 160 + index * 145;
                            const direction = index % 2 === 0 ? 1 : -1;
                            return (
                                <path
                                    key={`vertical-${index}`}
                                    d={`M${topX} -90 C${topX + 75 * direction} 220 ${bottomX - 85 * direction} 720 ${bottomX} 1170`}
                                    fill="none"
                                    stroke="url(#title-grid-vertical)"
                                    strokeWidth={index === 7 ? 4 : 2}
                                />
                            );
                        })}
                    </g>
                </>
            )}

            {variant === "waves" && (
                <>
                    <path
                        d="M-40 180C170 18 315 358 530 194S885 38 1125 230"
                        fill="none"
                        stroke={color}
                        strokeWidth="54"
                        strokeLinecap="round"
                    />
                    <path
                        d="M-95 425C130 245 330 620 545 432S900 250 1160 468"
                        fill="none"
                        stroke={color}
                        strokeWidth="32"
                        strokeLinecap="round"
                    />
                    <path
                        d="M15 690C220 510 390 805 605 660S925 530 1130 705"
                        fill="none"
                        stroke={color}
                        strokeWidth="18"
                        strokeLinecap="round"
                    />
                    <circle cx="266" cy="202" r="38" fill={color} />
                    <circle cx="770" cy="411" r="24" fill={color} />
                    <circle cx="450" cy="675" r="15" fill={color} />
                </>
            )}

            {variant === "orbits" && (
                <>
                    <ellipse cx="585" cy="430" rx="500" ry="220" fill="none" stroke={color} strokeWidth="38" transform="rotate(-18 585 430)" />
                    <ellipse cx="585" cy="430" rx="365" ry="365" fill="none" stroke={color} strokeWidth="24" transform="rotate(28 585 430)" />
                    <ellipse cx="585" cy="430" rx="190" ry="470" fill="none" stroke={color} strokeWidth="16" transform="rotate(54 585 430)" />
                    <circle cx="585" cy="430" r="72" fill={color} />
                    <circle cx="965" cy="262" r="34" fill={color} />
                    <circle cx="277" cy="664" r="22" fill={color} />
                </>
            )}

            {variant === "ribbons" && (
                <>
                    <path
                        d="M-80 86C155 250 170 520 420 654S820 714 1160 512"
                        fill="none"
                        stroke={color}
                        strokeWidth="72"
                        strokeLinecap="round"
                    />
                    <path
                        d="M1120 90C855 222 820 455 590 500S215 420-80 660"
                        fill="none"
                        stroke={color}
                        strokeWidth="38"
                        strokeLinecap="round"
                    />
                    <path
                        d="M1090 760C820 600 725 264 470 208S105 268-70 390"
                        fill="none"
                        stroke={color}
                        strokeWidth="20"
                        strokeLinecap="round"
                    />
                </>
            )}
        </svg>
    </div>
);
