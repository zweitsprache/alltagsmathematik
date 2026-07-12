import type { FC } from "react";
import { Calculator, Clock, Cube01, LineChartUp01, Ruler } from "@untitledui/icons";

/**
 * Maps serializable icon keys (used in curriculum content) to icon components.
 * Keeping content icons as string keys means the curriculum stays plain data
 * and can later move to JSON, a CMS or a database without code changes.
 */
export const iconMap = {
    clock: Clock,
    ruler: Ruler,
    calculator: Calculator,
    cube: Cube01,
    "line-chart": LineChartUp01,
} satisfies Record<string, FC<{ className?: string }>>;

export type IconKey = keyof typeof iconMap;
