import type { ComponentType } from "react";
import { AbsoluteFill, Composition } from "remotion";
import {
    CompositionMetadataProvider,
    type CompositionMetadataOverrides,
} from "./branded-slides";
import { NumberLineComposition, compositionDuration } from "../app/remotion-test/page";
import { CountToTenComposition, countToTenDuration } from "./compositions/count-to-ten";
import { TwoDigitNumbersComposition, twoDigitNumbersDuration } from "./compositions/two-digit-numbers";
import { PercentageWholeComposition, percentageWholeDuration } from "./compositions/percentage-whole";
import { LocalPrepositionsComposition, localPrepositionsDuration } from "./compositions/local-prepositions";
import { CuisenaireBlocksComposition, cuisenaireBlocksDuration } from "./compositions/cuisenaire-blocks";
import { StackedNumberLinesComposition, stackedNumberLinesDuration } from "./compositions/number-line-stacked";
import { NumberLineCountingComposition, numberLineCountingDuration } from "./compositions/number-line-counting";
import { RuleOfThreeShampooComposition, ruleOfThreeShampooDuration } from "./compositions/rule-of-three-shampoo";
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

type MetadataProps = { metadata?: CompositionMetadataOverrides };

const withCompositionMetadata = <Props extends object>(Component: ComponentType<Props>) => {
    const WrappedComposition = (props: Props & MetadataProps) => {
        const { metadata = {}, ...componentProps } = props;

        return (
            <CompositionMetadataProvider value={metadata}>
                <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
                    <Component {...(componentProps as Props)} />
                </AbsoluteFill>
            </CompositionMetadataProvider>
        );
    };

    return WrappedComposition;
};

const NumberLineWithMetadata = withCompositionMetadata(NumberLineComposition);
const RuleOfThreeShampooWithMetadata = withCompositionMetadata(RuleOfThreeShampooComposition);
const NumberLineCountingWithMetadata = withCompositionMetadata(NumberLineCountingComposition);
const StackedNumberLinesWithMetadata = withCompositionMetadata(StackedNumberLinesComposition);
const CountToTenWithMetadata = withCompositionMetadata(CountToTenComposition);
const TwoDigitNumbersWithMetadata = withCompositionMetadata(TwoDigitNumbersComposition);
const PercentageWholeWithMetadata = withCompositionMetadata(PercentageWholeComposition);
const LocalPrepositionsWithMetadata = withCompositionMetadata(LocalPrepositionsComposition);
const CuisenaireBlocksWithMetadata = withCompositionMetadata(CuisenaireBlocksComposition);
const TimeWithMetadata = withCompositionMetadata(TimeComposition);
const HalfHourTimeWithMetadata = withCompositionMetadata(HalfHourTimeComposition);
const QuarterHourTimeWithMetadata = withCompositionMetadata(QuarterHourTimeComposition);
const TenMinuteTimeWithMetadata = withCompositionMetadata(TenMinuteTimeComposition);
const FiveMinuteTimeWithMetadata = withCompositionMetadata(FiveMinuteTimeComposition);
const FiveMinuteTimeVariantWithMetadata = withCompositionMetadata(FiveMinuteTimeVariantComposition);
const DigitalFiveMinuteTimeVariantWithMetadata = withCompositionMetadata(DigitalFiveMinuteTimeVariantComposition);
const DigitalInformalHourTimeWithMetadata = withCompositionMetadata(DigitalInformalHourTimeComposition);
const InformalHourTimeWithMetadata = withCompositionMetadata(InformalHourTimeComposition);

export const RemotionRoot = () => (
    <>
        <Composition
            id="RuleOfThreeShampoo"
            component={RuleOfThreeShampooWithMetadata}
            durationInFrames={ruleOfThreeShampooDuration}
            fps={25}
            width={1920}
            height={1080}
        />
        <Composition
            id="NumberLineZeroToTen"
            component={NumberLineWithMetadata}
            durationInFrames={compositionDuration}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ useLocalAudio: true }}
        />
        <Composition
            id="NumberLineCountingZeroToTen"
            component={NumberLineCountingWithMetadata}
            durationInFrames={numberLineCountingDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="NumberLineZeroToTenStacked"
            component={StackedNumberLinesWithMetadata}
            durationInFrames={stackedNumberLinesDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="CountToTen"
            component={CountToTenWithMetadata}
            durationInFrames={countToTenDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="TwoDigitNumbers"
            component={TwoDigitNumbersWithMetadata}
            durationInFrames={twoDigitNumbersDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="PercentageWhole"
            component={PercentageWholeWithMetadata}
            durationInFrames={percentageWholeDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="LocalPrepositions"
            component={LocalPrepositionsWithMetadata}
            durationInFrames={localPrepositionsDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="CuisenaireBlocks"
            component={CuisenaireBlocksWithMetadata}
            durationInFrames={cuisenaireBlocksDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="Time"
            component={TimeWithMetadata}
            durationInFrames={timeCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="TimeHalfHour"
            component={HalfHourTimeWithMetadata}
            durationInFrames={halfHourTimeCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="TimeQuarterHours"
            component={QuarterHourTimeWithMetadata}
            durationInFrames={quarterHourTimeCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="TimeTenMinuteGroups"
            component={TenMinuteTimeWithMetadata}
            durationInFrames={tenMinuteTimeCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="TimeFiveMinuteGroups"
            component={FiveMinuteTimeWithMetadata}
            durationInFrames={fiveMinuteTimeCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="TimeFiveMinuteGroupsVariant"
            component={FiveMinuteTimeVariantWithMetadata}
            durationInFrames={fiveMinuteTimeVariantCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
        <Composition
            id="DigitalTimeFiveMinuteGroupsVariant"
            component={DigitalFiveMinuteTimeVariantWithMetadata}
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
                        component={DigitalInformalHourTimeWithMetadata}
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
                    component={InformalHourTimeWithMetadata}
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
