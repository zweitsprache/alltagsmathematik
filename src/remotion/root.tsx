import { Composition } from "remotion";
import { NumberLineComposition, compositionDuration } from "../app/remotion-test/page";
import { CountToTenComposition, countToTenDuration } from "./compositions/count-to-ten";
import { TwoDigitNumbersComposition, twoDigitNumbersDuration } from "./compositions/two-digit-numbers";
import { PercentageWholeComposition, percentageWholeDuration } from "./compositions/percentage-whole";
import { LocalPrepositionsComposition, localPrepositionsDuration } from "./compositions/local-prepositions";
import {
    FiveMinuteTimeComposition,
    FiveMinuteTimeVariantComposition,
    DigitalFiveMinuteTimeVariantComposition,
    DigitalInformalHourTimeComposition,
    digitalFiveMinuteTimeVariantCompositionDuration,
    fiveMinuteTimeVariantCompositionDuration,
    fiveMinuteTimeCompositionDuration,
    HalfHourTimeComposition,
    halfHourTimeCompositionDuration,
    InformalHourTimeComposition,
    getInformalHourTimeCompositionDuration,
    getDigitalInformalHourTimeCompositionDuration,
    QuarterHourTimeComposition,
    quarterHourTimeCompositionDuration,
    TenMinuteTimeComposition,
    tenMinuteTimeCompositionDuration,
    TimeComposition,
    timeCompositionDuration,
} from "./compositions/time";

export const RemotionRoot = () => (
    <>
        <Composition
            id="NumberLineZeroToTen"
            component={NumberLineComposition}
            durationInFrames={compositionDuration}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ useLocalAudio: true }}
        />
        <Composition
            id="CountToTen"
            component={CountToTenComposition}
            durationInFrames={countToTenDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="TwoDigitNumbers"
            component={TwoDigitNumbersComposition}
            durationInFrames={twoDigitNumbersDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="PercentageWhole"
            component={PercentageWholeComposition}
            durationInFrames={percentageWholeDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="LocalPrepositions"
            component={LocalPrepositionsComposition}
            durationInFrames={localPrepositionsDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="Time"
            component={TimeComposition}
            durationInFrames={timeCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="TimeHalfHour"
            component={HalfHourTimeComposition}
            durationInFrames={halfHourTimeCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="TimeQuarterHours"
            component={QuarterHourTimeComposition}
            durationInFrames={quarterHourTimeCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="TimeTenMinuteGroups"
            component={TenMinuteTimeComposition}
            durationInFrames={tenMinuteTimeCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="TimeFiveMinuteGroups"
            component={FiveMinuteTimeComposition}
            durationInFrames={fiveMinuteTimeCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="TimeFiveMinuteGroupsVariant"
            component={FiveMinuteTimeVariantComposition}
            durationInFrames={fiveMinuteTimeVariantCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="DigitalTimeFiveMinuteGroupsVariant"
            component={DigitalFiveMinuteTimeVariantComposition}
            durationInFrames={digitalFiveMinuteTimeVariantCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        {Array.from({ length: 24 }, (_, startHour) => startHour)
            .filter((startHour) => startHour !== 12)
            .map((startHour) => {
                const endHour = (startHour + 1) % 24;

                return (
                    <Composition
                        key={`digital-${startHour}`}
                        id={`DigitalTimeInformal${String(startHour).padStart(2, "0")}To${String(endHour).padStart(2, "0")}`}
                        component={DigitalInformalHourTimeComposition}
                        durationInFrames={getDigitalInformalHourTimeCompositionDuration(startHour)}
                        fps={30}
                        width={1920}
                        height={1080}
                        defaultProps={{ startHour }}
                    />
                );
            })}
        {Array.from({ length: 11 }, (_, index) => {
            const startHour = index + 1;
            const endHour = startHour + 1;

            return (
                <Composition
                    key={startHour}
                    id={`TimeInformal${String(startHour).padStart(2, "0")}To${String(endHour).padStart(2, "0")}`}
                    component={InformalHourTimeComposition}
                    durationInFrames={getInformalHourTimeCompositionDuration(startHour)}
                    fps={30}
                    width={1920}
                    height={1080}
                    defaultProps={{ startHour }}
                />
            );
        })}
    </>
);
