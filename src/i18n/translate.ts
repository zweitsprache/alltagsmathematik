import de from "./messages/de.json";

export type TranslationKey =
    | `levels.${string}`
    | `instructions.${"number-line" | "number-line-listen" | "number-line-listen-pair" | "number-line-read" | "number-sort" | "number-sequence"}.${string}`;

type TranslationVariables = Record<string, string | number>;

/**
 * Reads a message from the source locale. Additional AI-generated locale files
 * can later be selected here without changing curriculum or exercise code.
 */
export const translate = (key: TranslationKey, variables: TranslationVariables = {}): string => {
    const message = key.split(".").reduce<unknown>((value, segment) => {
        if (!value || typeof value !== "object") return undefined;
        return (value as Record<string, unknown>)[segment];
    }, de);

    if (typeof message !== "string") {
        throw new Error(`Missing translation: ${key}`);
    }

    return message.replace(/\{(\w+)\}/g, (placeholder, name: string) => {
        const value = variables[name];
        return value === undefined ? placeholder : String(value);
    });
};
