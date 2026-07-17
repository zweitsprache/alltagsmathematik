import { Composition } from "remotion";
import { NumberLineComposition, compositionDuration } from "../app/remotion-test/page";
import { CountToTenComposition, countToTenDuration } from "./compositions/count-to-ten";
import { TwoDigitNumbersComposition, twoDigitNumbersDuration } from "./compositions/two-digit-numbers";
import { PercentageWholeComposition, percentageWholeDuration } from "./compositions/percentage-whole";
import { TimeComposition, timeCompositionDuration } from "./compositions/time";

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
            id="Time"
            component={TimeComposition}
            durationInFrames={timeCompositionDuration}
            fps={30}
            width={1920}
            height={1080}
        />
    </>
);
