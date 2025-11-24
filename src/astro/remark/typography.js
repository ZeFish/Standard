import { visit } from 'unist-util-visit';

/**
 * Remark plugin for Fine-Art Typography
 * Ports the logic from src/eleventy/markdown.js
 */
export default function remarkTypography(options = {}) {
    const defaults = {
        locale: 'en',
        smartQuotes: true,
        punctuation: true,
        fractions: true,
        arrows: true,
        orphans: true,
    };
    const config = { ...defaults, ...options };

    // Typography Rules (Simplified version of the map in markdown.js)
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

    const currentRules = rules[config.locale] || rules.en;

    // Helper functions (ported from markdown.js)
    function fixPunctuation(text) {
        text = text.replace(/---/g, currentRules.emDash);
        text = text.replace(/--/g, currentRules.emDash); // Standard often uses em-dash for -- too, or en-dash. Sticking to em-dash as per original logic if ambiguous, but original had logic.
        // Original: text = text.replace(/--/g, rules.emDash);
        // Original: text = text.replace(/\.\.\./g, rules.ellipsis);
        text = text.replace(/\.\.\./g, currentRules.ellipsis);
        return text;
    }

    function fixQuotes(text) {
        // Simple regex based replacement for quotes is hard. 
        // The original used a loop. We'll try a simpler regex approach for now or port the loop.
        // Porting the loop is safer.
        let result = "";
        let inQuote = false;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '"') {
                if (!inQuote) {
                    result += currentRules.leftDoubleQuote;
                    inQuote = true;
                } else {
                    result += currentRules.rightDoubleQuote;
                    inQuote = false;
                }
            } else {
                result += char;
            }
        }
        return result.replace(/'/g, currentRules.apostrophe); // Simplified apostrophe
    }

    return (tree) => {
        visit(tree, 'text', (node) => {
            let text = node.value;

            if (config.punctuation) text = fixPunctuation(text);
            if (config.smartQuotes) text = fixQuotes(text);

            // TODO: Add other replacements (fractions, arrows, etc.)

            node.value = text;
        });
    };
}
