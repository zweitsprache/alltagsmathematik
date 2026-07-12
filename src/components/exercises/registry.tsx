import type { ExerciseConfig } from "@/content/curriculum";
import { NumberLineReadExercise } from "./number-line-read/number-line-read-exercise";
import { NumberLineExercise } from "./number-line/number-line-exercise";
import { NumberSequenceExercise } from "./number-sequence/number-sequence-exercise";
import { NumberSortExercise } from "./number-sort/number-sort-exercise";

/**
 * Renders an exercise based on its `type`. Add new interactive exercise types
 * here — content only needs to reference the new `type` string and its config.
 */
export const ExerciseRenderer = ({ exercise, exerciseNumber }: { exercise: ExerciseConfig; exerciseNumber: number }) => {
    switch (exercise.type) {
        case "number-line":
            return <NumberLineExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} labeledNumbers={exercise.labeledNumbers} />;
        case "number-line-read":
            return <NumberLineReadExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} labeledNumbers={exercise.labeledNumbers} />;
        case "number-sort":
            return <NumberSortExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} sortOrder={exercise.sortOrder} />;
        case "number-sequence":
            return <NumberSequenceExercise exerciseNumber={exerciseNumber} min={exercise.min} max={exercise.max} />;
        default:
            return null;
    }
};
