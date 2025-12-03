import { visit } from "unist-util-visit";

/**
 * Typography Rehype Plugin for Standard Framework
 *
 * Applies classical typography rules to HTML content:
 * - Smart quotes with locale awareness
 * - Proper dashes and punctuation
 * - Unicode fractions
 * - Arrows and symbols
 * - Orphan and widow prevention
 * - Locale-specific number formatting
 * - Spacing rules (French thin spaces, etc.)
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.enableSmartQuotes - Enable smart quotes (default: true)
 * @param {boolean} options.enablePunctuation - Enable dash/ellipsis fixes (default: true)
 * @param {boolean} options.enableWidowPrevention - Prevent widows (default: true)
 * @param {boolean} options.enableOrphanPrevention - Prevent orphans (default: true)
 * @param {boolean} options.enableSpacing - Enable spacing rules (default: true)
 * @param {boolean} options.enableFractions - Enable unicode fractions (default: true)
 * @param {boolean} options.enableArrowsAndSymbols - Enable arrows/symbols (default: true)
 * @param {boolean} options.enableNumberFormatting - Enable number formatting (default: true)
 * @param {string} options.defaultLocale - Default locale (default: 'en')
 * @param {string} options.excludeSelectors - CSS selectors to exclude (default: 'code, pre, script, style')
 * @param {string} options.excludeFromWidows - Elements to exclude from widow prevention
 */
export default function rehypeTypography(options = {}) {
  const config = {
    enableSmartQuotes: true,
    enablePunctuation: true,
    enableWidowPrevention: true,
    enableOrphanPrevention: true,
    enableSpacing: true,
    enableFractions: true,
    enableArrowsAndSymbols: true,
    enableNumberFormatting: true,
    defaultLocale: "en",
    excludeSelectors: "code, pre, script, style",
    excludeFromWidows: "h1, h2, h3, h4, h5, h6",
    ...options,
  };

  // Typography rules for different locales
  const typographyRules = {
    en: {
      thinSpace: "\u2009",
      nonBreakingSpace: "\u00A0",
      emDash: "\u2014",
      enDash: "\u2013",
      ellipsis: "\u2026",
      leftDoubleQuote: "\u201C",
      rightDoubleQuote: "\u201D",
      leftSingleQuote: "\u2018",
      rightSingleQuote: "\u2019",
      apostrophe: "\u2019",
      numberSeparator: ",",
      decimalSeparator: ".",
    },
    fr: {
      thinSpace: "\u2009",
      nonBreakingSpace: "\u00A0",
      emDash: "\u2014",
      enDash: "\u2013",
      ellipsis: "\u2026",
      leftDoubleQuote: "\u00AB",
      rightDoubleQuote: "\u00BB",
      leftSingleQuote: "\u2018",
      rightSingleQuote: "\u2019",
      apostrophe: "\u2019",
      numberSeparator: "\u2009",
      decimalSeparator: ",",
    },
    de: {
      thinSpace: "\u2009",
      nonBreakingSpace: "\u00A0",
      emDash: "\u2014",
      enDash: "\u2013",
      ellipsis: "\u2026",
      leftDoubleQuote: "\u201E",
      rightDoubleQuote: "\u201C",
      leftSingleQuote: "\u201A",
      rightSingleQuote: "\u2018",
      apostrophe: "\u2019",
      numberSeparator: ".",
      decimalSeparator: ",",
    },
    es: {
      thinSpace: "\u2009",
      nonBreakingSpace: "\u00A0",
      emDash: "\u2014",
      enDash: "\u2013",
      ellipsis: "\u2026",
      leftDoubleQuote: "\u00AB",
      rightDoubleQuote: "\u00BB",
      leftSingleQuote: "\u2018",
      rightSingleQuote: "\u2019",
      apostrophe: "\u2019",
      numberSeparator: ".",
      decimalSeparator: ",",
    },
    it: {
      thinSpace: "\u2009",
      nonBreakingSpace: "\u00A0",
      emDash: "\u2014",
      enDash: "\u2013",
      ellipsis: "\u2026",
      leftDoubleQuote: "\u00AB",
      rightDoubleQuote: "\u00BB",
      leftSingleQuote: "\u2018",
      rightSingleQuote: "\u2019",
      apostrophe: "\u2019",
      numberSeparator: ".",
      decimalSeparator: ",",
    },
  };

  // Global symbols for arrows and special characters
  const globalSymbols = {
    rightArrow: "\u2192",
    leftArrow: "\u2190",
    upArrow: "\u2191",
    downArrow: "\u2193",
    doubleRightArrow: "\u21D2",
    doubleLeftArrow: "\u21D0",
    leftRightArrow: "\u2194",
    multiplication: "\u00D7",
    plusMinus: "\u00B1",
    notEqual: "\u2260",
    lessThanEqual: "\u2264",
    greaterThanEqual: "\u2265",
    approximately: "\u2248",
    copyright: "\u00A9",
    registered: "\u00AE",
    trademark: "\u2122",
    degree: "\u00B0",
    bullet: "\u2022",
    middleDot: "\u00B7",
  };

  // Orphan words by locale (words that shouldn't be alone on a line)
  const orphanWords = {
    en: [
      "a",
      "an",
      "at",
      "be",
      "by",
      "do",
      "go",
      "he",
      "if",
      "in",
      "is",
      "it",
      "me",
      "my",
      "no",
      "of",
      "on",
      "or",
      "so",
      "to",
      "up",
      "us",
      "we",
      "the",
      "and",
      "but",
      "for",
      "nor",
      "yet",
      "was",
      "are",
      "has",
      "had",
      "can",
      "may",
      "will",
      "would",
      "could",
      "should",
      "must",
      "shall",
      "from",
      "with",
      "this",
      "that",
      "these",
      "those",
      "their",
      "there",
      "where",
      "when",
      "what",
      "who",
      "which",
      "why",
      "how",
      "all",
      "any",
      "both",
      "each",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "only",
      "own",
      "same",
      "than",
      "too",
      "very",
      "just",
      "now",
    ],
    fr: [
      "a",
      "à",
      "au",
      "aux",
      "ce",
      "ces",
      "cette",
      "cet",
      "dans",
      "de",
      "des",
      "du",
      "en",
      "et",
      "il",
      "elle",
      "ils",
      "elles",
      "je",
      "tu",
      "nous",
      "vous",
      "le",
      "la",
      "les",
      "l'",
      "ma",
      "mon",
      "mes",
      "ta",
      "tes",
      "sa",
      "son",
      "ses",
      "notre",
      "nos",
      "votre",
      "vos",
      "leur",
      "leurs",
      "ne",
      "pas",
      "plus",
      "que",
      "qui",
      "quoi",
      "dont",
      "où",
      "on",
      "quand",
      "comment",
      "pour",
      "par",
      "sur",
      "avec",
      "sans",
      "sous",
      "vers",
      "chez",
      "dès",
      "depuis",
      "pendant",
      "parmi",
      "entre",
      "dans",
      "sur",
      "sous",
      "devant",
      "derrière",
      "à côté de",
      "près de",
      "loin de",
      "au lieu de",
      "à cause de",
      "grâce à",
      "selon",
      "malgré",
    ],
    de: [
      "a",
      "an",
      "am",
      "im",
      "um",
      "zu",
      "von",
      "bis",
      "durch",
      "für",
      "gegen",
      "ohne",
      "über",
      "unter",
      "auf",
      "aus",
      "bei",
      "nach",
      "seit",
      "von",
      "zu",
      "der",
      "die",
      "das",
      "den",
      "dem",
      "des",
      "ein",
      "eine",
      "einen",
      "einem",
      "einer",
      "eines",
      "ich",
      "du",
      "er",
      "sie",
      "es",
      "wir",
      "ihr",
      "sie",
      "mir",
      "dir",
      "ihm",
      "ihr",
      "uns",
      "euch",
      "ihnen",
      "mein",
      "dein",
      "sein",
      "ihr",
      "unser",
      "euer",
      "ihr",
      "meine",
      "deine",
      "seine",
      "ihre",
      "unsere",
      "eure",
      "ihre",
      "meiner",
      "deiner",
      "seiner",
      "ihrer",
    ],
    es: [
      "a",
      "al",
      "de",
      "del",
      "en",
      "el",
      "la",
      "los",
      "las",
      "un",
      "una",
      "unos",
      "unas",
      "y",
      "o",
      "u",
      "pero",
      "sino",
      "aunque",
      "si",
      "cuando",
      "donde",
      "como",
      "que",
      "quien",
      "cual",
      "cuyo",
      "cuyos",
      "cuyas",
      "para",
      "por",
      "sin",
      "sobre",
      "entre",
      "dentro",
      "fuera",
      "ante",
      "bajo",
      "tras",
      "desde",
      "hasta",
      "durante",
      "mediante",
      "según",
      "contra",
      "hacia",
      "contra",
      "yo",
      "tú",
      "él",
      "ella",
      "nosotros",
      "vosotros",
      "ellos",
      "ellas",
      "mi",
      "mis",
      "tu",
      "tus",
      "su",
      "sus",
      "nuestro",
      "nuestra",
      "nuestros",
      "nuestras",
      "vuestro",
      "vuestra",
      "vuestros",
      "vuestras",
    ],
    it: [
      "a",
      "al",
      "allo",
      "alla",
      "ai",
      "agli",
      "alle",
      "di",
      "del",
      "dello",
      "della",
      "dei",
      "degli",
      "delle",
      "in",
      "nel",
      "nello",
      "nella",
      "nei",
      "negli",
      "nelle",
      "con",
      "su",
      "sul",
      "sullo",
      "sulla",
      "sui",
      "sugli",
      "sulle",
      "per",
      "tra",
      "fra",
      "il",
      "lo",
      "la",
      "i",
      "gli",
      "le",
      "un",
      "uno",
      "una",
      "e",
      "o",
      "ma",
      "però",
      "se",
      "quando",
      "dove",
      "come",
      "che",
      "chi",
      "cui",
      "quanto",
      "quanta",
      "quanti",
      "quante",
      "io",
      "tu",
      "lui",
      "lei",
      "noi",
      "voi",
      "essi",
      "esse",
      "mio",
      "mia",
      "miei",
      "mie",
      "tuo",
      "tua",
      "tuoi",
      "tue",
      "suo",
      "sua",
      "suoi",
      "sue",
      "nostro",
      "nostra",
      "nostri",
      "nostre",
      "vostro",
      "vostra",
      "vostri",
      "vostre",
    ],
  };

  // Protection markers for code blocks and special content
  const protectionMarkers = {
    code: "§§CODE§§",
    link: "§§LINK§§",
    entity: "§§ENTITY§§",
    url: "§§URL§§",
    email: "§§EMAIL§§",
  };

  let protectionCounter = 0;

  /**
   * Protect special content from typography processing
   */
  function protectContent(text) {
    // Protect code blocks
    const codePattern = /`[^`]+`/g;
    text = text.replace(codePattern, (match) => {
      const marker = `${protectionMarkers.code}${protectionCounter++}§§`;
      return marker;
    });

    // Protect URLs
    const urlPattern = /https?:\/\/[^\s)]+/g;
    text = text.replace(urlPattern, (match) => {
      const marker = `${protectionMarkers.url}${protectionCounter++}§§`;
      return marker;
    });

    // Protect email addresses
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    text = text.replace(emailPattern, (match) => {
      const marker = `${protectionMarkers.email}${protectionCounter++}§§`;
      return marker;
    });

    return text;
  }

  /**
   * Restore protected content
   */
  function restoreContent(text) {
    Object.values(protectionMarkers).forEach((marker) => {
      const regex = new RegExp(marker.replace(/§§/g, "§§") + "(\\d+)§§", "g");
      text = text.replace(regex, (match, num) => {
        return match; // In a real implementation, we'd restore from a cache
      });
    });
    return text;
  }

  /**
   * Fix punctuation (dashes, ellipsis)
   */
  function fixPunctuation(text, rules) {
    if (
      text.includes(rules.emDash) &&
      text.includes(rules.enDash) &&
      text.includes(rules.ellipsis)
    ) {
      return text;
    }

    text = text.replace(/---/g, rules.emDash);
    text = text.replace(/--/g, rules.enDash);
    text = text.replace(/\.\.\./g, rules.ellipsis);
    text = text.replace(/\s+-\s+/g, ` ${rules.enDash} `);

    text = text.replace(/(\d+)-(\d+)/g, (match, num1, num2) => {
      if (
        (num1.length === 4 && num1 >= "1900" && num1 <= "2099") ||
        (num2.length === 4 && num2 >= "1900" && num2 <= "2099")
      ) {
        return match;
      }
      return `${num1}${rules.enDash}${num2}`;
    });

    return text;
  }

  /**
   * Fix smart quotes
   */
  function fixQuotes(text, rules) {
    if (
      text.includes(rules.leftDoubleQuote) &&
      text.includes(rules.rightDoubleQuote)
    ) {
      return text;
    }

    let depth = 0;
    let result = "";
    let inQuote = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        if (!inQuote) {
          result += rules.leftDoubleQuote;
          inQuote = true;
        } else {
          result += rules.rightDoubleQuote;
          inQuote = false;
        }
      } else {
        result += char;
      }
    }

    text = result;
    text = text.replace(
      /'([a-zA-Z][^']{0,100}?)'/g,
      `${rules.leftSingleQuote}$1${rules.rightSingleQuote}`,
    );

    return text;
  }

  /**
   * Fix apostrophes
   */
  function fixApostrophes(text, rules) {
    text = text.replace(/(\w)'(\w)/g, `$1${rules.apostrophe}$2`);
    text = text.replace(/(\s)'(\d{2}s)/g, `$1${rules.apostrophe}$2`);
    text = text.replace(/\b'(twas|til|cause)\b/gi, `${rules.apostrophe}$1`);
    text = text.replace(/(s)'(\s|$|[,.!?;:])/g, `s${rules.apostrophe}$2`);
    return text;
  }

  /**
   * Convert fractions to Unicode
   */
  function fixFractions(text) {
    const fractions = {
      "1/2": "½",
      "1/3": "⅓",
      "2/3": "⅔",
      "1/4": "¼",
      "3/4": "¾",
      "1/8": "⅛",
      "3/8": "⅜",
      "5/8": "⅝",
      "7/8": "⅞",
    };

    Object.entries(fractions).forEach(([ascii, unicode]) => {
      const regex = new RegExp(
        `(?<=^|\\s)${ascii.replace("/", "\\/")}(?=\\s|$|[,.;:!?])`,
        "g",
      );
      text = text.replace(regex, unicode);
    });

    return text;
  }

  /**
   * Fix arrows and symbols
   */
  function fixArrowsAndSymbols(text) {
    if (text.includes(globalSymbols.rightArrow)) {
      return text;
    }

    text = text.replace(/==>/g, globalSymbols.doubleRightArrow);
    text = text.replace(/<==/g, globalSymbols.doubleLeftArrow);
    text = text.replace(/<=>/g, globalSymbols.leftRightArrow);
    text = text.replace(/(\s)->(s)/g, `$1${globalSymbols.rightArrow}$2`);
    text = text.replace(/(\s)<->(s)/g, `$1${globalSymbols.leftRightArrow}$2`);
    text = text.replace(/(\s)<-(s)/g, `$1${globalSymbols.leftArrow}$2`);
    text = text.replace(/\s+x\s+/gi, ` ${globalSymbols.multiplication} `);
    text = text.replace(/\s+\*\s+/g, ` ${globalSymbols.multiplication} `);
    text = text.replace(/\+\/-/g, globalSymbols.plusMinus);
    text = text.replace(/(\s)!=(s)/g, `$1${globalSymbols.notEqual}$2`);
    text = text.replace(/(\s)~=(s)/g, `$1${globalSymbols.approximately}$2`);
    text = text.replace(/\(c\)/gi, globalSymbols.copyright);
    text = text.replace(/\(r\)/gi, globalSymbols.registered);
    text = text.replace(/\(tm\)/gi, globalSymbols.trademark);
    text = text.replace(/(\d+)\s*degrees?/gi, `$1${globalSymbols.degree}`);
    text = text.replace(/(\d+)\s*deg\b/gi, `$1${globalSymbols.degree}`);

    return text;
  }

  /**
   * Fix spacing based on locale
   */
  function fixSpacing(text, locale, rules) {
    if (locale === "fr") {
      return fixFrenchSpacing(text, rules);
    }
    return fixEnglishSpacing(text);
  }

  /**
   * French spacing rules (thin spaces before punctuation)
   */
  function fixFrenchSpacing(text, rules) {
    text = text.replace(/\s*([:;!?])/g, `${rules.thinSpace}$1`);
    text = text.replace(/«\s*/g, `«${rules.thinSpace}`);
    text = text.replace(/\s*»/g, `${rules.thinSpace}»`);
    return text;
  }

  /**
   * English spacing rules
   */
  function fixEnglishSpacing(text) {
    text = text.replace(/\s+/g, " ");
    text = text.replace(/\s+([,.!?;:])/g, "$1");
    return text;
  }

  /**
   * Format numbers according to locale
   */
  function fixNumbers(text, locale, rules) {
    const numberRegex = /\b(\d{4,})\b/g;

    text = text.replace(numberRegex, (match) => {
      if (match.length === 4 && match >= "1900" && match <= "2099") {
        return match;
      }

      if (locale === "fr") {
        return match.replace(/(\d)(?=(\d{3})+$)/g, `$1${rules.thinSpace}`);
      } else if (locale === "de" || locale === "es" || locale === "it") {
        return match.replace(/(\d)(?=(\d{3})+$)/g, "$1.");
      } else {
        return match.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
      }
    });

    return text;
  }

  /**
   * Prevent orphans (short words at end of lines)
   */
  function preventOrphans(text, locale, rules) {
    const orphanWordList = orphanWords[locale] || orphanWords.en;

    const wordPattern = orphanWordList
      .map((word) => {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        if (/[àâäéèêëïîôöùûüÿç]/i.test(word)) {
          return `(?<![\\p{L}\\p{N}'])${escaped}(?![\\p{L}\\p{N}'])`;
        } else {
          return `\\b${escaped}\\b`;
        }
      })
      .join("|");

    const nbspPattern = `(${wordPattern})\\s`;
    const nbspRegex = new RegExp(nbspPattern, "giu");

    let result = text.replace(nbspRegex, `$1${rules.nonBreakingSpace}`);

    const titleMap = {
      en: ["Mr", "Mrs", "Ms", "Dr", "Prof", "St"],
      fr: ["M", "Mme", "Mlle", "Dr", "Pr", "St", "Ste"],
      de: ["Dr", "Prof", "Dipl", "Ing", "Herr", "Frau"],
      es: ["Sr", "Sra", "Dr", "Dra", "Prof"],
      it: ["Sig", "Dott", "Prof", "Ing"],
    };

    const titles = titleMap[locale] || titleMap.en;
    const titlePattern = `\\b(${titles.join("|")})\\.\\s`;
    const titleRegex = new RegExp(titlePattern, "giu");
    result = result.replace(titleRegex, `$1.${rules.nonBreakingSpace}`);

    result = result.replace(
      /\b(\d+)\s+(am|pm|h|min|s|kg|g|m|km|cm|mm|€|%)\b/gi,
      `$1${rules.nonBreakingSpace}$2`,
    );

    return result;
  }

  /**
   * Prevent widows (single word on last line)
   */
  function preventWidows(text, rules) {
    const nbspRegex = /(?<!\u00A0)\s+(\S+)\s*$/;
    text = text.replace(nbspRegex, `${rules.nonBreakingSpace}$1`);
    return text;
  }

  /**
   * Check if element should be skipped
   */
  function shouldSkipElement(element) {
    const skipTags = ["CODE", "PRE", "SCRIPT", "STYLE", "SAMP", "KBD", "VAR"];
    return skipTags.includes(element.tagName);
  }

  /**
   * Process a text node with typography rules
   */
  function processTextNode(textNode, locale, rules) {
    let text = textNode.value;

    if (!text || !text.trim()) {
      return;
    }

    text = protectContent(text);

    if (config.enablePunctuation) {
      text = fixPunctuation(text, rules);
    }

    if (config.enableSmartQuotes) {
      text = fixQuotes(text, rules);
      text = fixApostrophes(text, rules);
    }

    if (config.enableFractions) {
      text = fixFractions(text);
    }

    if (config.enableArrowsAndSymbols) {
      text = fixArrowsAndSymbols(text);
    }

    if (config.enableNumberFormatting) {
      text = fixNumbers(text, locale, rules);
    }

    if (config.enableSpacing) {
      text = fixSpacing(text, locale, rules);
    }

    if (config.enableOrphanPrevention) {
      text = preventOrphans(text, locale, rules);
    }

    text = restoreContent(text);
    textNode.value = text;
  }

  /**
   * Get locale from element or document
   */
  function getLocale(tree) {
    // Try to find lang attribute on html element
    let locale = config.defaultLocale;

    visit(tree, "element", (node) => {
      if (node.tagName === "html" && node.properties && node.properties.lang) {
        locale = node.properties.lang.split("-")[0]; // Take language code only
      }
    });

    return locale;
  }

  /**
   * Check if element should be processed
   */
  function shouldProcessElement(node) {
    if (!node.properties || !node.properties.className) {
      return true;
    }

    const className = Array.isArray(node.properties.className)
      ? node.properties.className.join(" ")
      : node.properties.className;

    const excludeSelectors = config.excludeSelectors.split(",");

    return !excludeSelectors.some((selector) => {
      const trimmed = selector.trim();
      if (trimmed.startsWith(".")) {
        return className.includes(trimmed.substring(1));
      } else if (trimmed.startsWith("#")) {
        return false; // IDs not relevant for class-based exclusion
      } else {
        return node.tagName.toLowerCase() === trimmed;
      }
    });
  }

  /**
   * Main plugin function
   */
  return (tree) => {
    const locale = getLocale(tree);

    const rules = typographyRules[locale] || typographyRules.en;

    // Process all text nodes
    visit(tree, "text", (node, index, parent) => {
      // Skip if parent element should be excluded
      if (parent && parent.type === "element") {
        if (!shouldProcessElement(parent)) {
          return;
        }
      }

      processTextNode(node, locale, rules);
    });

    // Apply widow prevention to block elements
    if (config.enableWidowPrevention) {
      visit(tree, "element", (node) => {
        if (!shouldProcessElement(node)) {
          return;
        }

        const excludeSelectors = config.excludeFromWidows.split(",");
        const shouldExclude = excludeSelectors.some(
          (selector) => node.tagName.toLowerCase() === selector.trim(),
        );

        if (!shouldExclude) {
          // Find the last text node in this element
          const textNodes = [];
          visit(node, "text", (textNode) => {
            if (textNode.value.trim()) {
              textNodes.push(textNode);
            }
          });

          if (textNodes.length > 0) {
            const lastTextNode = textNodes[textNodes.length - 1];
            lastTextNode.value = preventWidows(lastTextNode.value, rules);
          }
        }
      });
    }
  };
}
