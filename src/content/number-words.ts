const wordsToTwenty = [
    "null",
    "eins",
    "zwei",
    "drei",
    "vier",
    "fünf",
    "sechs",
    "sieben",
    "acht",
    "neun",
    "zehn",
    "elf",
    "zwölf",
    "dreizehn",
    "vierzehn",
    "fünfzehn",
    "sechzehn",
    "siebzehn",
    "achtzehn",
    "neunzehn",
    "zwanzig",
];

const tens: Record<number, string> = {
    20: "zwanzig",
    30: "dreissig",
    40: "vierzig",
    50: "fünfzig",
    60: "sechzig",
    70: "siebzig",
    80: "achtzig",
    90: "neunzig",
};

const compoundOnes = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];

const numberWord = (number: number): string => {
    if (number <= 20) return wordsToTwenty[number];
    if (number === 100) return "hundert";
    if (number === 1000) return "tausend";
    if (number > 100) {
        const hundreds = Math.floor(number / 100);
        const remainder = number % 100;
        const prefix = hundreds === 1 ? "" : compoundOnes[hundreds];
        return `${prefix}hundert${remainder === 0 ? "" : numberWord(remainder)}`;
    }
    const ten = Math.floor(number / 10) * 10;
    const one = number % 10;
    return one === 0 ? tens[ten] : `${compoundOnes[one]}und${tens[ten]}`;
};

export const numberWords = Array.from({ length: 1001 }, (_, number) => numberWord(number));
