import { InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import markdown_it_obsidian_callouts from "markdown-it-obsidian-callouts";
import markdownItFootnote from "markdown-it-footnote";
import { JSDOM } from "jsdom";
import Logger from "../core/logger.js";

/**
 * Tag Wrapper Plugin for markdown-it
 *
 * @group markdown-enhancement
 * @author Francis Fontaine
 * @since 0.10.52
 *
 * In the early days of social media, Chris Messina proposed the hashtag
 * on Twitter in 2007 as a way to group conversations. What started as a
 * simple IRC convention became the lingua franca of digital organization.
 * Tags aren't just metadata—they're how humans naturally categorize and
 * connect ideas across the noise of information overload.
 *
 * This plugin brings that same organizational power to your markdown content.
 * It scans text for hashtag patterns (#tag, #design-systems, #typography-2024)
 * and wraps them in semantic spans, making them styleable, clickable, or
 * filterable. Unlike regex-based approaches that break inside code blocks,
 * this works at the token level—respecting markdown's structure while
 * enhancing plain text with meaningful markup.
 *
 * The magic happens during markdown-it's inline parsing phase, where we
 * intercept text tokens and split them whenever a hashtag appears. Each
 * tag becomes its own span.tag element, ready for styling, JavaScript
 * enhancement, or link generation. It's fast, safe, and plays nicely
 * with every other markdown feature.
 *
 * ### Future Improvements
 *
 * - Add automatic linking to tag archive pages
 * - Support multiple tag formats (@mentions, +categories)
 * - Generate tag index automatically
 * - Add data attributes for filtering/search
 * - Support tag taxonomy/hierarchy
 *
 * @see {function} applyTypography - Works alongside typography enhancements
 * @see {class} .tag - CSS styling for tags (in standard-04-elements.scss)
 *
 * @link https://en.wikipedia.org/wiki/Hashtag History of hashtags
 * @link https://www.chris.com/2007/08/25/groups-for-twitter-or-a-proposal-for-twitter-tag-channels/ Original hashtag proposal
 *
 * @example markdown - Usage in content
 *   This post is about #design-systems and #typography.
 *   Learn more about #11ty and #jamstack architecture.
 *
 *   Tags work in paragraphs, lists, and quotes:
 *   - #responsive-design principles
 *   - #accessibility standards
 *
 *   > Design with #intent and #purpose.
 *
 * @example css - Style the tags
 *   .tag {
 *     display: inline-block;
 *     padding: 0.125em 0.5em;
 *     background: var(--color-accent-subtle);
 *     color: var(--color-accent);
 *     border-radius: 0.25em;
 *     font-size: 0.875em;
 *     font-weight: 500;
 *     text-decoration: none;
 *     transition: background 0.2s;
 *   }
 *
 *   .tag:hover {
 *     background: var(--color-accent);
 *     color: var(--color-background);
 *   }
 *
 * @example javascript - Make tags clickable
 *   document.querySelectorAll('.tag').forEach(tag => {
 *     tag.addEventListener('click', () => {
 *       const tagName = tag.dataset.tag;
 *       window.location.href = `/tags/${tagName}/`;
 *     });
 *   });
 *
 * @param {Object} md - markdown-it instance
 * @returns {void} Modifies markdown-it instance with inline rule
 */
function tagWrapperPlugin(md) {
  // Regular expression to match hashtags
  // Matches: #word, #word-with-dashes, #word_with_underscores, #word123
  // Does NOT match: # alone, #123 (must start with letter)
  const tagRegex = /#([a-zA-Z][a-zA-Z0-9_-]*(?:\/[a-zA-Z][a-zA-Z0-9_-]*)*)/g;

  /**
   * Process text tokens and wrap hashtags in spans
   *
   * This function walks through all inline tokens in the markdown AST,
   * finds text nodes containing hashtags, and splits them into multiple
   * tokens: plain text + wrapped tags. It preserves the document structure
   * while injecting semantic markup only where needed.
   */
  function processTextToken(state) {
    const blockTokens = state.tokens;

    for (let i = 0; i < blockTokens.length; i++) {
      const blockToken = blockTokens[i];

      // Only process inline tokens (where text lives)
      if (blockToken.type !== "inline" || !blockToken.children) {
        continue;
      }

      const tokens = blockToken.children;
      let j = 0;

      while (j < tokens.length) {
        const token = tokens[j];

        // Only process text tokens (skip code, links, etc.)
        if (token.type !== "text") {
          j++;
          continue;
        }

        const text = token.content;
        const matches = [];
        let match;

        // Find all hashtags in this text token
        tagRegex.lastIndex = 0; // Reset regex state
        while ((match = tagRegex.exec(text)) !== null) {
          matches.push({
            tag: match[0], // Full match: #tag
            name: match[1], // Captured group: tag
            index: match.index,
            length: match[0].length,
          });
        }

        // If no tags found, move to next token
        if (matches.length === 0) {
          j++;
          continue;
        }

        // Split the text token into multiple tokens
        const newTokens = [];
        let lastIndex = 0;

        matches.forEach((m) => {
          // Add text before the tag
          if (m.index > lastIndex) {
            const textToken = new state.Token("text", "", 0);
            textToken.content = text.substring(lastIndex, m.index);
            newTokens.push(textToken);
          }

          // Add the tag wrapped in span
          const spanOpen = new state.Token("html_inline", "", 0);
          spanOpen.content = `<span class="tag" data-tag="${m.name}">`;
          newTokens.push(spanOpen);

          const tagText = new state.Token("text", "", 0);
          tagText.content = m.tag;
          newTokens.push(tagText);

          const spanClose = new state.Token("html_inline", "", 0);
          spanClose.content = "</span>";
          newTokens.push(spanClose);

          lastIndex = m.index + m.length;
        });

        // Add remaining text after last tag
        if (lastIndex < text.length) {
          const textToken = new state.Token("text", "", 0);
          textToken.content = text.substring(lastIndex);
          newTokens.push(textToken);
        }

        // Replace the original token with new tokens
        tokens.splice(j, 1, ...newTokens);
        j += newTokens.length;
      }
    }
  }

  // Add as a core rule that runs after inline parsing
  md.core.ruler.after("inline", "tag-wrapper", processTextToken);
}

/**
 * @component Markdown Plugin with Fine-Art Typography
 * @category 11ty Plugins
 * @description Configures markdown-it parser with plugins for syntax highlighting,
 * callout blocks, footnotes, and classical typography enhancements applied at build time.
 *
 * Typography features (build-time):
 * - Smart quotes (locale-aware)
 * - Em dashes (—) and en dashes (–)
 * - Proper ellipses (…)
 * - Widow prevention
 * - Orphan prevention
 * - Unicode fractions (½, ¾)
 * - Arrow symbols (→, ←, ⇒)
 * - Math symbols (×, ±, ≠)
 * - Legal symbols (©, ®, ™)
 * - French spacing rules
 *
 * @version 0.2.2
 * @since 0.1.0
 */

export default function (eleventyConfig, site = {}) {
  // Read markdown config safely
  const md = site.standard?.markdown ?? {};

  const config = {
    enableSmartQuotes: md.enableSmartQuotes ?? true,
    enablePunctuation: md.enablePunctuation ?? true,
    enableWidowPrevention: md.enableWidowPrevention ?? true,
    enableOrphanPrevention: md.enableOrphanPrevention ?? true,
    enableSpacing: md.enableSpacing ?? true,
    enableFractions: md.enableFractions ?? true,
    enableArrowsAndSymbols: md.enableArrowsAndSymbols ?? true,
    enableNumberFormatting: md.enableNumberFormatting ?? false,
    defaultLocale: site.language ?? "en",
    excludeSelectors:
      md.excludeSelectors ?? "code, pre, script, style, samp, kbd, var",
    excludeFromWidows: md.excludeFromWidows ?? "h1, h2, h3, h4, h5, h6",
    siteUrl: site.url ?? "",
  };

  const logger = Logger({
    verbose: site.standard.verbose,
    scope: "Markdown",
  });

  const mdParser = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: false, // We handle this ourselves
  })
    .use(markdown_it_obsidian_callouts)
    .use(markdownItFootnote)
    .use(tagWrapperPlugin);

  /* not used, here for the future */
  function codeBlockPlugin(md) {
    const defaultFence = md.renderer.rules.fence;
    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const info = token.info.trim();

      if (info === "mermaid")
        return `<div class="mermaid">${token.content}</div>`;
      if (info === "js p5" || info === "javascript p5") {
        const sketchId = `p5-sketch-${Math.random().toString(36).substr(2, 9)}`;
        return `<pre class="language-js p5"><code class="language-js p5" data-sketch-id="${sketchId}">${token.content}</code></pre>`;
      }

      return defaultFence(tokens, idx, options, env, self);
    };
  }

  // Typography rules by locale
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
    ],
    fr: [
      "à",
      "a",
      "y",
      "un",
      "le",
      "la",
      "de",
      "du",
      "en",
      "ce",
      "et",
      "ou",
      "où",
      "il",
      "on",
      "je",
      "tu",
      "me",
      "te",
      "se",
      "ne",
      "si",
      "ça",
      "au",
      "aux",
      "les",
      "des",
      "une",
      "son",
      "sa",
      "ses",
      "ton",
      "ta",
      "tes",
      "mon",
      "ma",
      "mes",
      "nos",
      "vos",
      "par",
      "sur",
      "pour",
      "dans",
      "avec",
      "sans",
      "mais",
      "donc",
      "car",
      "qui",
      "que",
      "quoi",
      "dont",
      "est",
      "sont",
      "ont",
    ],
    de: [
      "an",
      "am",
      "im",
      "in",
      "um",
      "zu",
      "ob",
      "da",
      "ab",
      "der",
      "die",
      "das",
      "den",
      "dem",
      "des",
      "ein",
      "eine",
      "und",
      "oder",
      "aber",
      "denn",
      "wenn",
      "weil",
      "dass",
      "als",
      "bis",
      "für",
      "mit",
      "nach",
      "seit",
      "von",
      "vor",
      "bei",
      "aus",
      "über",
      "unter",
      "ist",
      "sind",
      "war",
      "hat",
      "wird",
    ],
    es: [
      "a",
      "y",
      "o",
      "u",
      "e",
      "el",
      "la",
      "lo",
      "un",
      "en",
      "de",
      "al",
      "del",
      "por",
      "con",
      "sin",
      "los",
      "las",
      "una",
      "pero",
      "para",
      "como",
      "más",
      "muy",
      "qué",
      "que",
      "quien",
      "cual",
      "son",
      "está",
      "han",
      "hay",
      "fue",
      "ser",
    ],
    it: [
      "a",
      "e",
      "o",
      "è",
      "i",
      "il",
      "lo",
      "la",
      "un",
      "in",
      "di",
      "da",
      "su",
      "al",
      "del",
      "per",
      "con",
      "gli",
      "una",
      "dei",
      "delle",
      "nel",
      "alla",
      "dalla",
      "sulla",
      "come",
      "più",
      "che",
      "chi",
      "cui",
      "dove",
      "sono",
      "hanno",
      "stato",
    ],
  };

  // Cached regex patterns
  const regexCache = {
    url: /https?:\/\/[^\s<>"]+/gi,
    dateSlash: /\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/g,
    dateDash: /\b\d{4}-\d{2}-\d{2}\b/g,
    year: /\b(19|20)\d{2}\b/g,
    codePath: /[a-z_]+\/[a-z_]+(?:\/[a-z_]+)*/gi,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  };

  // Protection system
  const protectionMarkers = [];
  let protectionCounter = 0;

  function protectContent(text) {
    protectionMarkers.length = 0;
    protectionCounter = 0;

    text = text.replace(regexCache.url, (match) => {
      const marker = `__PROTECTED_${protectionCounter++}__`;
      protectionMarkers.push({ marker, content: match });
      return marker;
    });

    text = text.replace(regexCache.dateSlash, (match) => {
      const marker = `__PROTECTED_${protectionCounter++}__`;
      protectionMarkers.push({ marker, content: match });
      return marker;
    });

    text = text.replace(regexCache.dateDash, (match) => {
      const marker = `__PROTECTED_${protectionCounter++}__`;
      protectionMarkers.push({ marker, content: match });
      return marker;
    });

    text = text.replace(regexCache.email, (match) => {
      const marker = `__PROTECTED_${protectionCounter++}__`;
      protectionMarkers.push({ marker, content: match });
      return marker;
    });

    text = text.replace(regexCache.codePath, (match) => {
      if (match.split("/").length >= 2) {
        const marker = `__PROTECTED_${protectionCounter++}__`;
        protectionMarkers.push({ marker, content: match });
        return marker;
      }
      return match;
    });

    return text;
  }

  function restoreContent(text) {
    protectionMarkers.forEach(({ marker, content }) => {
      text = text.replace(marker, content);
    });
    return text;
  }

  // Typography functions
  function fixPunctuation(text, rules) {
    if (
      text.includes(rules.emDash) &&
      text.includes(rules.enDash) &&
      text.includes(rules.ellipsis)
    ) {
      return text;
    }

    text = text.replace(/---/g, rules.emDash);
    text = text.replace(/--/g, rules.emDash);
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

  function fixApostrophes(text, rules) {
    text = text.replace(/(\w)'(\w)/g, `$1${rules.apostrophe}$2`);
    text = text.replace(/(\s)'(\d{2}s)/g, `$1${rules.apostrophe}$2`);
    text = text.replace(/\b'(twas|til|cause)\b/gi, `${rules.apostrophe}$1`);
    text = text.replace(/(s)'(\s|$|[,.!?;:])/g, `s${rules.apostrophe}$2`);
    return text;
  }

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

  function fixSpacing(text, locale, rules) {
    if (locale === "fr") {
      return fixFrenchSpacing(text, rules);
    }
    return fixEnglishSpacing(text);
  }

  function fixFrenchSpacing(text, rules) {
    text = text.replace(/\s*([:;!?])/g, `${rules.thinSpace}$1`);
    text = text.replace(/«\s*/g, `«${rules.thinSpace}`);
    text = text.replace(/\s*»/g, `${rules.thinSpace}»`);
    return text;
  }

  function fixEnglishSpacing(text) {
    text = text.replace(/\s+/g, " ");
    text = text.replace(/\s+([,.!?;:])/g, "$1");
    return text;
  }

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

  function preventOrphans(text, locale, rules) {
    const orphanWordList = orphanWords[locale] || orphanWords.en;

    const wordPattern = orphanWordList
      .map((word) => {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        if (/[àâäéèêëïîôöùûüÿç]/i.test(word)) {
          return `(?![\\p{L}\\p{N}'])${escaped}(?![\\p{L}\\p{N}'])`;
        } else {
          return `\\b${escaped}\\b`;
        }
      })
      .join("|");

    const nbspPattern = `(${wordPattern})\\s`;
    const nbspRegex = new RegExp(nbspPattern, "gi");

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
    const titleRegex = new RegExp(titlePattern, "gi");
    result = result.replace(titleRegex, `$1.${rules.nonBreakingSpace}`);

    result = result.replace(
      /\b(\d+)\s+(am|pm|h|min|s|kg|g|m|km|cm|mm|€|%)\b/gi,
      `$1${rules.nonBreakingSpace}$2`,
    );

    return result;
  }

  function preventWidows(text, rules) {
    const nbspRegex = /(?<!\u00A0)\s+(\S+)\s*$/;
    text = text.replace(nbspRegex, `${rules.nonBreakingSpace}$1`);
    return text;
  }

  function shouldSkipElement(element) {
    const skipTags = ["CODE", "PRE", "SCRIPT", "STYLE", "SAMP", "KBD", "VAR"];
    return skipTags.includes(element.tagName);
  }

  function processTextNode(textNode, locale, rules) {
    let text = textNode.textContent;

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

    textNode.textContent = text;
  }

  function processElement(element, locale, rules) {
    if (shouldSkipElement(element)) {
      return;
    }

    const walker = element.ownerDocument.createTreeWalker(
      element,
      5,
      null,
      false,
    );

    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 3) {
        if (!shouldSkipElement(node.parentElement)) {
          processTextNode(node, locale, rules);
        }
      }
    }

    if (config.enableWidowPrevention) {
      const excludeSelectors = config.excludeFromWidows.split(",");
      const shouldExclude = excludeSelectors.some((selector) =>
        element.matches(selector.trim()),
      );

      if (!shouldExclude) {
        const textNodes = [];
        const walker = element.ownerDocument.createTreeWalker(
          element,
          4,
          null,
          false,
        );
        let node;
        while ((node = walker.nextNode())) {
          if (node.textContent.trim()) {
            textNodes.push(node);
          }
        }

        if (textNodes.length > 0) {
          const lastTextNode = textNodes[textNodes.length - 1];
          lastTextNode.textContent = preventWidows(
            lastTextNode.textContent,
            rules,
          );
        }
      }
    }
  }

  function applyTypography(html, locale = config.defaultLocale) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const rules = typographyRules[locale] || typographyRules.en;

    const selectors =
      "p, li, blockquote, h1, h2, h3, h4, h5, h6, td, th, dd, dt, figcaption";
    const elements = document.querySelectorAll(selectors);

    elements.forEach((element) => {
      processElement(element, locale, rules);
    });

    return document.body.innerHTML;
  }

  const originalRender = mdParser.render.bind(mdParser);
  mdParser.render = function (src, env) {
    let html = originalRender(src, env);
    const locale = env?.locale || env?.lang || config.defaultLocale;
    html = applyTypography(html, locale);
    return html;
  };

  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setLibrary("md", mdParser);

  eleventyConfig.addFilter("typography", function (content, locale) {
    return applyTypography(content, locale || config.defaultLocale);
  });

  logger.success();
}
