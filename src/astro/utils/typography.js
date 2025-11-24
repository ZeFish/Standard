/**
 * Typography Utilities
 * Can be used in Astro components or other JS files.
 */

const rules = {
    en: {
        thinSpace: '\u2009',
        nonBreakingSpace: '\u00A0',
        emDash: '\u2014',
        enDash: '\u2013',
        ellipsis: '\u2026',
        leftDoubleQuote: '\u201C',
        rightDoubleQuote: '\u201D',
        leftSingleQuote: '\u2018',
        rightSingleQuote: '\u2019',
        apostrophe: '\u2019',
    },
    fr: {
        thinSpace: '\u2009',
        nonBreakingSpace: '\u00A0',
        emDash: '\u2014',
        enDash: '\u2013',
        ellipsis: '\u2026',
        leftDoubleQuote: '\u00AB',
        rightDoubleQuote: '\u00BB',
        leftSingleQuote: '\u2018',
        rightSingleQuote: '\u2019',
        apostrophe: '\u2019',
    },
};

export function applyTypography(text, locale = 'en') {
    const currentRules = rules[locale] || rules.en;

    // Basic replacements
    text = text.replace(/---/g, currentRules.emDash);
    text = text.replace(/--/g, currentRules.emDash);
    text = text.replace(/\.\.\./g, currentRules.ellipsis);

    // Quotes (simplified)
    text = text.replace(/"([^"]*)"/g, `${currentRules.leftDoubleQuote}$1${currentRules.rightDoubleQuote}`);
    text = text.replace(/'/g, currentRules.apostrophe);

    return text;
}
