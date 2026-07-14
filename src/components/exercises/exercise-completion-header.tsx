import type { ReactNode } from "react";
import { RefreshCw01 } from "@untitledui/icons";

export const ExerciseCompletionHeader = ({ exerciseNumber, instruction, onRestart }: { exerciseNumber: number; instruction: ReactNode; onRestart: () => void }) => (
    <div className="-my-2 flex items-center justify-between gap-4">
        <p className="text-md font-medium text-secondary">
            <span className="mr-2 font-black">{exerciseNumber.toString().padStart(2, "0")}</span>
            {instruction}
        </p>
        <button
            type="button"
            onClick={onRestart}
            aria-label="Aktivität wiederholen"
            className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-brand-solid text-white shadow-xs-skeuomorphic outline-focus-ring transition hover:bg-brand-solid_hover focus-visible:outline-2 focus-visible:outline-offset-2"
        >
            <RefreshCw01 className="size-5" />
        </button>
    </div>
);
