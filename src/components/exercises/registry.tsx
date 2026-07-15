import type { ExerciseConfig } from "@/content/curriculum";
import { AnalogClockChoiceExercise } from "./analog-clock-choice/analog-clock-choice-exercise";
import { ContextNumberListenExercise } from "./context-number-listen/context-number-listen-exercise";
import { CountingMatchExercise } from "./counting-match/counting-match-exercise";
import { DigitalClockChoiceExercise } from "./digital-clock-choice/digital-clock-choice-exercise";
import { GroceryScannerExercise } from "./grocery-scanner/grocery-scanner-exercise";
import { HundredsChartExercise } from "./hundreds-chart/hundreds-chart-exercise";
import { IntroExercise } from "./intro/intro-exercise";
import { NumberSpeechExplainer } from "./intro/number-speech-explainer";
import { NumberLineListenPairExercise } from "./number-line-listen-pair/number-line-listen-pair-exercise";
import { NumberLineReadExercise } from "./number-line-read/number-line-read-exercise";
import { NumberLineExercise } from "./number-line/number-line-exercise";
import { NumberMatchExercise } from "./number-match/number-match-exercise";
import { NumberWordChoiceExercise } from "./number-word-choice/number-word-choice-exercise";
import { NumberSequenceExercise } from "./number-sequence/number-sequence-exercise";
import { NumberSpellingChoiceExercise } from "./number-spelling-choice/number-spelling-choice-exercise";
import { NumberSortExercise } from "./number-sort/number-sort-exercise";

/**
 * Renders an exercise based on its `type`. Add new interactive exercise types
 * here — content only needs to reference the new `type` string and its config.
 */
export const ExerciseRenderer = ({ exercise, exerciseNumber, activityId }: { exercise: ExerciseConfig; exerciseNumber: number; activityId?: string }) => {
    switch (exercise.type) {
        case "analog-clock-choice":
            return <AnalogClockChoiceExercise exerciseNumber={exerciseNumber} minutes={exercise.minutes} minuteOptions={exercise.minuteOptions} randomQuarter={exercise.randomQuarter} informal={exercise.informal} />;
        case "analog-clock-choice-24":
            return <AnalogClockChoiceExercise exerciseNumber={exerciseNumber} minutes={exercise.minutes} minuteOptions={exercise.minuteOptions} randomQuarter={exercise.randomQuarter} informal={exercise.informal} use24Hour />;
        case "analog-clock-choice-sequential":
            return <AnalogClockChoiceExercise exerciseNumber={exerciseNumber} minutes={exercise.minutes} minuteOptions={exercise.minuteOptions} randomQuarter={exercise.randomQuarter} informal={exercise.informal} sequential />;
        case "analog-clock-choice-sequential-24":
            return <AnalogClockChoiceExercise exerciseNumber={exerciseNumber} minutes={exercise.minutes} minuteOptions={exercise.minuteOptions} randomQuarter={exercise.randomQuarter} informal={exercise.informal} use24Hour sequential />;
        case "analog-clock-choice-full-day":
            return <AnalogClockChoiceExercise exerciseNumber={exerciseNumber} minutes={exercise.minutes} minuteOptions={exercise.minuteOptions} randomQuarter={exercise.randomQuarter} informal={exercise.informal} use24Hour fullDay />;
        case "analog-clock-choice-pair":
            return <AnalogClockChoiceExercise exerciseNumber={exerciseNumber} minutes={exercise.minutes} minuteOptions={exercise.minuteOptions} randomQuarter={exercise.randomQuarter} informal={exercise.informal} use24Hour pairedTimes />;
        case "digital-clock-choice":
            return <DigitalClockChoiceExercise exerciseNumber={exerciseNumber} minutes={exercise.minutes} minuteOptions={exercise.minuteOptions} randomQuarter={exercise.randomQuarter} informal={exercise.informal} use24Hour={exercise.use24Hour} sequential={exercise.sequential} fullDay={exercise.fullDay} pairedTimes={exercise.pairedTimes} />;
        case "grocery-scanner":
            return <GroceryScannerExercise exerciseNumber={exerciseNumber} />;
        case "hundreds-chart":
            return <HundredsChartExercise exerciseNumber={exerciseNumber} hintCount={exercise.hintCount} inputCount={exercise.inputCount} guidedRows={exercise.guidedRows} />;
        case "context-number-listen":
            return <ContextNumberListenExercise exerciseNumber={exerciseNumber} setNumber={exercise.setNumber ?? 1} contextId={exercise.contextId} />;
        case "context-number-read":
            return <ContextNumberListenExercise exerciseNumber={exerciseNumber} setNumber={exercise.setNumber ?? 1} contextId={exercise.contextId} presentation="text" />;
        case "counting-match":
            return <CountingMatchExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} arrangement={exercise.arrangement} cardCount={exercise.cardCount} sameShape={exercise.sameShape} />;
        case "intro":
            return <IntroExercise min={exercise.min} max={exercise.max} values={exercise.values} title={exercise.introTitle} />;
        case "number-speech-explainer":
            return <NumberSpeechExplainer />;
        case "number-line":
            return <NumberLineExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} labeledNumbers={exercise.labeledNumbers} taskCount={exercise.taskCount} rangeSize={exercise.rangeSize} />;
        case "number-line-listen":
            return (
                <NumberLineExercise
                    exerciseNumber={exerciseNumber}
                    min={exercise.min}
                    max={exercise.max}
                    labeledNumbers={exercise.labeledNumbers}
                    taskCount={exercise.taskCount}
                    rangeSize={exercise.rangeSize}
                    presentation="audio"
                />
            );
        case "number-line-listen-pair":
            return (
                <NumberLineListenPairExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} labeledNumbers={exercise.labeledNumbers} rangeSize={exercise.rangeSize} />
            );
        case "number-line-word":
            return <NumberLineExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} labeledNumbers={exercise.labeledNumbers} presentation="word" taskCount={exercise.taskCount} rangeSize={exercise.rangeSize} />;
        case "number-line-word-pair":
            return <NumberLineListenPairExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} labeledNumbers={exercise.labeledNumbers} presentation="word" rangeSize={exercise.rangeSize} />;
        case "number-line-read":
            return <NumberLineReadExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} labeledNumbers={exercise.labeledNumbers} taskCount={exercise.taskCount} rangeSize={exercise.rangeSize} />;
        case "number-word-choice":
            return <NumberWordChoiceExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} wordCount={exercise.wordCount} optionCount={exercise.optionCount} />;
        case "number-word-choice-audio":
            return <NumberWordChoiceExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} wordCount={exercise.wordCount} optionCount={exercise.optionCount} presentation="audio" />;
        case "number-spelling-choice":
            return <NumberSpellingChoiceExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} variant={exercise.spellingVariant} />;
        case "number-sort":
            return <NumberSortExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} sortOrder={exercise.sortOrder} itemCount={exercise.itemCount} />;
        case "number-sequence":
            return <NumberSequenceExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} itemCount={exercise.itemCount} />;
        case "number-match":
            return <NumberMatchExercise activityId={activityId} exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} matchCount={exercise.matchCount} />;
        case "number-match-fonts":
            return <NumberMatchExercise activityId={activityId} exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} matchCount={exercise.matchCount} variedFonts />;
        default:
            return null;
    }
};
