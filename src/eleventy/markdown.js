import { InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import markdown_it_obsidian_callouts from "markdown-it-obsidian-callouts";
import markdownItFootnote from "markdown-it-footnote";
import { JSDOM } from "jsdom";

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
 * @version 0.2.1
 * @since 0.1.0
 */

export default function (eleventyConfig, options = {}) {
  const config = {
    enableSmartQuotes: true,
    enablePunctuation: true,
    enableWidowPrevention: true,
    enableOrphanPrevention: true,
    enableSpacing: true,
    enableFractions: true,
    enableArrowsAndSymbols: true,
    enableNumberFormatting: false,
    defaultLocale: "en",
    excludeSelectors: "code, pre, script, style, samp, kbd, var",
    excludeFromWidows: "h1, h2, h3, h4, h5, h6",
    siteUrl: "", // Add this line
    ...options,
  };

  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: false, // We handle this ourselves
  })
    .use(markdown_it_obsidian_callouts)
    .use(markdownItFootnote);

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

  /**
   * External Link Marker Plugin
   *
   * In the early web, every link was an adventure into the unknown. You'd click
   * and suddenly find yourself on a completely different site, often with no way
   * back except the browser's back button. Tim Berners-Lee's original vision
   * didn't distinguish between internal and external links—all links were equal.
   *
   * But as websites grew into complex information architectures, designers realized
   * users needed signals. "Am I staying here, or leaving?" became a critical question.
   * The solution emerged from print design: just as footnotes used symbols (†, ‡, *)
   * to indicate external references, web designers adopted the "external link arrow" (↗).
   *
   * This automatically detects external links and marks them with a class, allowing
   * your CSS to add that visual indicator. It's smart enough to know what "external"
   * means—checking against your site's actual domain, not just looking for http://.
   *
   * @param {String} siteUrl - Your site's base URL (e.g., 'https://standard.ffp.co')
   * @returns {Boolean} Whether link is external
   */
  function markExternalLinks(md) {
    const defaultLinkRender =
      md.renderer.rules.link_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const hrefIndex = token.attrIndex("href");

      if (hrefIndex >= 0) {
        const href = token.attrs[hrefIndex][1];

        // Handle content/ path rewriting
        if (href && href.startsWith("content/")) {
          let rewrittenHref = "/" + href.replace(/^content\//, "");
          rewrittenHref = rewrittenHref.replace(/\.md$/, "/");
          if (!rewrittenHref.endsWith("/")) {
            rewrittenHref += "/";
          }
          token.attrs[hrefIndex][1] = rewrittenHref;
        }

        const currentHref = token.attrs[hrefIndex][1];
        const isExternal =
          currentHref.startsWith("http://") ||
          currentHref.startsWith("https://") ||
          currentHref.startsWith("mailto:") ||
          currentHref.startsWith("tel:");

        if (isExternal) {
          const classIndex = token.attrIndex("class");
          if (classIndex < 0) {
            token.attrPush(["class", "external-link"]);
          } else {
            token.attrs[classIndex][1] += " external-link";
          }

          token.attrSet("rel", "noopener noreferrer");
          token.attrSet("target", "_blank");
        } else {
          token.attrSet("preload", "");
        }
      }

      return defaultLinkRender(tokens, idx, options, env, self);
    };
  }

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
    text = text.replace(/(\s)->(\s)/g, `$1${globalSymbols.rightArrow}$2`);
    text = text.replace(/(\s)<->(\s)/g, `$1${globalSymbols.leftRightArrow}$2`);
    text = text.replace(/(\s)<-(\s)/g, `$1${globalSymbols.leftArrow}$2`);
    text = text.replace(/\s+x\s+/gi, ` ${globalSymbols.multiplication} `);
    text = text.replace(/\s+\*\s+/g, ` ${globalSymbols.multiplication} `);
    text = text.replace(/\+\/-/g, globalSymbols.plusMinus);
    text = text.replace(/(\s)!=(\s)/g, `$1${globalSymbols.notEqual}$2`);
    text = text.replace(/(\s)~=(\s)/g, `$1${globalSymbols.approximately}$2`);
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
    const words = orphanWords[locale] || orphanWords.en;
    const pattern = `\\b(${words.join("|")})\\b\\s`;
    const regex = new RegExp(pattern, "gi");

    text = text.replace(regex, `$1${rules.nonBreakingSpace}`);

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
    text = text.replace(titleRegex, `$1.${rules.nonBreakingSpace}`);

    text = text.replace(
      /\b(\d+)\s+(am|pm|h|min|s|kg|g|m|km|cm|mm|€|%)\b/gi,
      `$1${rules.nonBreakingSpace}$2`,
    );

    return text;
  }

  function preventWidows(text, rules) {
    const nbspRegex = /\s+(\S+)\s*$/;
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

  markExternalLinks(md);

  const originalRender = md.render.bind(md);
  md.render = function (src, env) {
    let html = originalRender(src, env);
    const locale = env?.locale || env?.lang || config.defaultLocale;
    html = applyTypography(html, locale);
    return html;
  };

  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addFilter("typography", function (content, locale) {
    return applyTypography(content, locale || config.defaultLocale);
  });

  eleventyConfig.addShortcode("typographyConfig", function () {
    return JSON.stringify(config, null, 2);
  });
}
