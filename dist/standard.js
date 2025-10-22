/*! Standard Framework v0.10.52 | 2025-10-22T02:00:15.410Z */
/**
 * Standard Framework - Fine-Art Typography Management
 *
 * A comprehensive framework implementing:
 * - Classical typography rules that CSS cannot handle
 * - Progressive enhancement with zero-configuration setup
 * - Multi-locale support with automatic detection
 * - Dynamic content observation
 * - Performance-optimized batch processing
 * - Image zoom with keyboard navigation
 *
 * Based on research from:
 * - The Elements of Typographic Style (Robert Bringhurst)
 * - Ellen Lupton's typography works
 * - Classical European typography conventions
 * - Swiss typography principles
 * - Modern web accessibility standards
 *
 * Philosophy: Respect classic typography rules, but readability always wins.
 *
 * @version 2.2.0
 * @license MIT
 */

class Standard {
  constructor(options = {}) {
    this.options = {
      locale: null, // Will auto-detect
      enableWidowPrevention: false,
      enableSmartQuotes: false,
      enablePunctuation: false,
      enableSpacing: false,
      enableFractions: false,
      enableNumberFormatting: false,
      enableArrowsAndSymbols: false,
      autoProcess: false,
      observeDOM: false, // Watch for dynamic content
      debounceDelay: 100,
      batchSize: 50,
      excludeSelectors: "nav, .nav, [role='navigation']",
      excludeFromWidows: "h1, h2, h3, h4, h5, h6",
      includeClass: "standard-typography", // Class to explicitly mark elements for processing
      ...options,
    };

    // Auto-detect locale if not specified
    if (!this.options.locale) {
      this.options.locale = this.detectLocale();
    }

    // Global symbols (universal across all languages)
    this.globalSymbols = {
      // Arrows
      rightArrow: "\u2192",
      leftArrow: "\u2190",
      upArrow: "\u2191",
      downArrow: "\u2193",
      doubleRightArrow: "\u21D2",
      doubleLeftArrow: "\u21D0",
      leftRightArrow: "\u2194",
      // Math operators
      multiplication: "\u00D7",
      plusMinus: "\u00B1",
      notEqual: "\u2260",
      lessThanEqual: "\u2264",
      greaterThanEqual: "\u2265",
      approximately: "\u2248",
      // Legal and branding
      copyright: "\u00A9",
      registered: "\u00AE",
      trademark: "\u2122",
      // Other symbols
      degree: "\u00B0",
      bullet: "\u2022",
      middleDot: "\u00B7",
    };

    this.rules = this.getRulesForLocale(this.options.locale);
    this.observer = null;
    this.processingQueue = [];
    this.isProcessing = false;
    this.debounceTimer = null;

    this.init();
  }

  /**
   * Initialize the typography engine
   */
  init() {
    if (this.options.autoProcess === false) {
      // Skip automatic processing if disabled
      return;
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.process());
    } else {
      this.process();
    }

    // Set up DOM observation if enabled
    if (this.options.observeDOM) {
      this.observeDynamicContent();
    }
  }

  /**
   * Detect locale from document or browser
   */
  detectLocale() {
    // Check <html lang="...">
    const htmlLang = document.documentElement.lang;
    if (htmlLang) {
      // Extract primary language code (e.g., "en-US" -> "en", "fr-CA" -> "fr")
      return htmlLang.split("-")[0].toLowerCase();
    }

    // Fallback to browser language
    if (navigator.language) {
      return navigator.language.split("-")[0].toLowerCase();
    }

    // Ultimate fallback
    return "en";
  }

  /**
   * Get typography rules for specific locale
   */
  getRulesForLocale(locale) {
    const rules = {
      en: {
        // English typography rules
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
        // French typography rules (with thin spaces before punctuation)
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
        numberSeparator: "\u2009", // thin space
        decimalSeparator: ",",
      },
      de: {
        // German typography rules
        thinSpace: "\u2009",
        nonBreakingSpace: "\u00A0",
        emDash: "\u2014",
        enDash: "\u2013",
        ellipsis: "\u2026",
        leftDoubleQuote: "\u201E", // „
        rightDoubleQuote: "\u201C", // "
        leftSingleQuote: "\u201A", // ‚
        rightSingleQuote: "\u2018", // '
        apostrophe: "\u2019",
        numberSeparator: ".",
        decimalSeparator: ",",
      },
      es: {
        // Spanish typography rules
        thinSpace: "\u2009",
        nonBreakingSpace: "\u00A0",
        emDash: "\u2014",
        enDash: "\u2013",
        ellipsis: "\u2026",
        leftDoubleQuote: "\u00AB", // «
        rightDoubleQuote: "\u00BB", // »
        leftSingleQuote: "\u2018",
        rightSingleQuote: "\u2019",
        apostrophe: "\u2019",
        numberSeparator: ".",
        decimalSeparator: ",",
      },
      it: {
        // Italian typography rules
        thinSpace: "\u2009",
        nonBreakingSpace: "\u00A0",
        emDash: "\u2014",
        enDash: "\u2013",
        ellipsis: "\u2026",
        leftDoubleQuote: "\u00AB", // «
        rightDoubleQuote: "\u00BB", // »
        leftSingleQuote: "\u2018",
        rightSingleQuote: "\u2019",
        apostrophe: "\u2019",
        numberSeparator: ".",
        decimalSeparator: ",",
      },
    };

    return rules[locale] || rules.en;
  }

  /**
   * Process all eligible elements on the page
   */
  async process(selector = "p, li, blockquote, h1, h2, h3, h4, h5, h6") {
    this.dispatchEvent("beforeProcessAll", { selector });

    // Include elements with the includeClass (like links with class="standard-typography")
    const includeClassSelector = this.options.includeClass
      ? `, .${this.options.includeClass}`
      : "";
    const fullSelector = selector + includeClassSelector;

    const elements = document.querySelectorAll(fullSelector);

    // Filter out elements that should be excluded
    const filteredElements = Array.from(elements).filter((element) => {
      // Check if element is within excluded selectors
      if (this.options.excludeSelectors) {
        const excludeSelectors = this.options.excludeSelectors
          .split(",")
          .map((s) => s.trim());
        for (const excludeSelector of excludeSelectors) {
          if (element.closest(excludeSelector)) {
            return false;
          }
        }
      }
      return this.shouldProcess(element);
    });

    // Process in batches for better performance
    await this.processBatch(filteredElements);

    this.dispatchEvent("afterProcessAll", {
      selector,
      processedCount: filteredElements.length,
      totalCount: elements.length,
    });
  }

  /**
   * Process elements in batches to avoid blocking UI
   */
  async processBatch(elements) {
    const batchSize = this.options.batchSize;

    for (let i = 0; i < elements.length; i += batchSize) {
      const batch = elements.slice(i, i + batchSize);
      batch.forEach((el) => this.processElement(el));

      // Yield to browser between batches
      if (i + batchSize < elements.length) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  }

  /**
   * Check if element should be processed
   */
  shouldProcess(element) {
    // Skip if element has translate="no" attribute
    if (element.getAttribute("translate") === "no") {
      return false;
    }

    // Skip code blocks and similar elements
    const skipTags = ["CODE", "PRE", "SCRIPT", "STYLE", "SAMP", "KBD", "VAR"];
    if (skipTags.includes(element.tagName)) {
      return false;
    }

    // Skip if parent is a code block or has translate="no"
    let parent = element.parentElement;
    while (parent) {
      if (skipTags.includes(parent.tagName)) {
        return false;
      }
      if (parent.getAttribute("translate") === "no") {
        return false;
      }
      parent = parent.parentElement;
    }

    return true;
  }

  /**
   * Process a single element
   */
  processElement(element) {
    // Skip if already processed to prevent cumulative changes
    if (element.hasAttribute("data-typography-processed")) {
      return;
    }

    // Check for element-specific overrides via data attributes
    const elementOptions = this.getElementOptions(element);

    this.dispatchEvent("beforeProcess", { element });

    // Get element-specific language
    const elementLocale = this.getElementLocale(element);
    const rules = this.getRulesForLocale(elementLocale);

    // Process text nodes only (preserves HTML structure)
    this.processTextNodes(element, elementLocale, rules, elementOptions);

    // Mark as processed to prevent reprocessing
    element.setAttribute("data-typography-processed", "true");

    this.dispatchEvent("afterProcess", { element });
  }

  /**
   * Get element-specific options from data attributes
   */
  getElementOptions(element) {
    return {
      enableSmartQuotes:
        element.dataset.standardQuotes !== "false" &&
        this.options.enableSmartQuotes,
      enablePunctuation:
        element.dataset.standardPunctuation !== "false" &&
        this.options.enablePunctuation,
      enableWidowPrevention:
        element.dataset.standardWidows !== "false" &&
        this.options.enableWidowPrevention,
      enableSpacing:
        element.dataset.standardSpacing !== "false" &&
        this.options.enableSpacing,
      enableFractions:
        element.dataset.standardFractions !== "false" &&
        this.options.enableFractions,
      enableNumberFormatting:
        element.dataset.standardNumbers !== "false" &&
        this.options.enableNumberFormatting,
      enableArrowsAndSymbols:
        element.dataset.standardArrows !== "false" &&
        this.options.enableArrowsAndSymbols,
    };
  }

  /**
   * Process only text nodes, preserving HTML structure
   */
  processTextNodes(element, elementLocale, rules, elementOptions) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      // Skip text nodes inside excluded elements
      if (!this.shouldProcess(node.parentElement)) {
        continue;
      }
      textNodes.push(node);
    }

    // Process typography on individual text nodes first
    textNodes.forEach((textNode) => {
      let text = textNode.nodeValue;
      const originalText = text;

      // Skip if empty or only whitespace
      if (!text || !text.trim()) {
        return;
      }

      // Apply typography fixes based on options
      if (elementOptions.enablePunctuation) {
        text = this.fixPunctuation(text, rules);
      }

      if (elementOptions.enableSmartQuotes) {
        text = this.fixQuotes(text, rules);
        text = this.fixApostrophes(text, rules);
      }

      if (elementOptions.enableFractions) {
        text = this.fixFractions(text);
      }

      if (elementOptions.enableArrowsAndSymbols) {
        text = this.fixArrowsAndSymbols(text, rules);
      }

      if (elementOptions.enableNumberFormatting) {
        text = this.fixNumbers(text, elementLocale, rules);
      }

      if (elementOptions.enableSpacing) {
        text = this.fixSpacing(text, elementLocale, rules);
      }

      // Only update if text actually changed
      if (text !== originalText) {
        textNode.nodeValue = text;
      }
    });

    // Then, process widow prevention ONCE for the entire element, so it's not undone
    if (
      elementOptions.enableWidowPrevention &&
      !this.shouldExcludeFromWidows(element)
    ) {
      this.preventWidowsForElement(element, elementLocale, rules);
    }
  }

  /**
   * Get locale for specific element (checks lang attribute)
   */
  getElementLocale(element) {
    // Check for data-standard-locale override
    if (element.dataset && element.dataset.standardLocale) {
      return element.dataset.standardLocale.toLowerCase();
    }

    // Check element's lang attribute
    const elementLang = element.getAttribute("lang");
    if (elementLang) {
      return elementLang.split("-")[0].toLowerCase();
    }

    // Check parent elements for lang attribute
    let parent = element.parentElement;
    while (parent) {
      const parentLang = parent.getAttribute("lang");
      if (parentLang) {
        return parentLang.split("-")[0].toLowerCase();
      }
      parent = parent.parentElement;
    }

    // Fallback to document locale
    return this.options.locale;
  }

  /**
   * Fix punctuation marks (em dashes, ellipses, etc.)
   */
  fixPunctuation(text, rules = this.rules) {
    // Skip if already has proper punctuation
    if (
      text.includes(rules.emDash) &&
      text.includes(rules.enDash) &&
      text.includes(rules.ellipsis)
    ) {
      return text;
    }

    // Replace triple hyphens with em dash first
    text = text.replace(/---/g, rules.emDash);

    // Replace double hyphens with em dash
    text = text.replace(/--/g, rules.emDash);

    // Replace three periods with ellipsis
    text = text.replace(/\.\.\./g, rules.ellipsis);

    // Replace space-hyphen-space with en dash (for ranges)
    text = text.replace(/\s+-\s+/g, ` ${rules.enDash} `);

    // Replace hyphen in number ranges with en dash
    text = text.replace(/(\d+)-(\d+)/g, `$1${rules.enDash}$2`);

    return text;
  }

  /**
   * Fix quotation marks (smart quotes)
   */
  fixQuotes(text, rules = this.rules) {
    // Skip if already has smart quotes
    if (
      text.includes(rules.leftDoubleQuote) ||
      text.includes(rules.rightDoubleQuote)
    ) {
      return text;
    }

    // Handle double quotes
    text = text.replace(/"([^"]*?)"/g, (match, content) => {
      return `${rules.leftDoubleQuote}${content}${rules.rightDoubleQuote}`;
    });

    // Handle single quotes (but not apostrophes)
    text = text.replace(/'([^']*?)'/g, (match, content) => {
      return `${rules.leftSingleQuote}${content}${rules.rightSingleQuote}`;
    });

    return text;
  }

  /**
   * Smart apostrophe detection (possessive vs quotes)
   */
  fixApostrophes(text, rules = this.rules) {
    // Possessive and contractions: John's, it's, don't
    text = text.replace(/(\w)'(\w)/g, `$1${rules.apostrophe}$2`);

    // Year abbreviations: '90s, '20s
    text = text.replace(/\s'(\d{2}s)/g, ` ${rules.apostrophe}$1`);

    // Contractions at start: 'twas, 'til, 'cause
    text = text.replace(/\b'(twas|til|cause)\b/gi, `${rules.apostrophe}$1`);

    // Possessive after s: James' or James's
    text = text.replace(/(\w)s'(\s|$)/g, `$1s${rules.apostrophe}$2`);

    return text;
  }

  /**
   * Convert common fractions to proper Unicode characters
   */
  fixFractions(text) {
    const fractions = {
      "1/2": "½",
      "1/3": "⅓",
      "2/3": "⅔",
      "1/4": "¼",
      "3/4": "¾",
      "1/5": "⅕",
      "2/5": "⅖",
      "3/5": "⅗",
      "4/5": "⅘",
      "1/6": "⅙",
      "5/6": "⅚",
      "1/8": "⅛",
      "3/8": "⅜",
      "5/8": "⅝",
      "7/8": "⅞",
    };

    // Replace fractions with word boundaries to avoid breaking dates or other numbers
    Object.entries(fractions).forEach(([ascii, unicode]) => {
      const regex = new RegExp(`\\b${ascii.replace("/", "\\/")}\\b`, "g");
      text = text.replace(regex, unicode);
    });

    return text;
  }

  /**
   * Transform ASCII arrows and symbols into proper Unicode characters
   */
  fixArrowsAndSymbols(text, rules = this.rules) {
    const symbols = this.globalSymbols;

    // Skip if already has proper symbols
    if (text.includes(symbols.rightArrow)) {
      return text;
    }

    // Arrow transformations (order matters - longest patterns first)

    // Double arrows
    text = text.replace(/==>/g, symbols.doubleRightArrow); // ==> becomes ⇒
    text = text.replace(/<==/g, symbols.doubleLeftArrow); // <== becomes ⇐
    text = text.replace(/<==/g, symbols.leftRightArrow); // <==> becomes ↔

    // Single arrows
    text = text.replace(/->/g, symbols.rightArrow); // -> becomes →
    text = text.replace(/<->/g, symbols.leftRightArrow); // <-> becomes ↔ (must come before <-)
    text = text.replace(/<-/g, symbols.leftArrow); // <- becomes ←

    // Math operators (with spaces to avoid breaking code)
    text = text.replace(/\s+x\s+/gi, ` ${symbols.multiplication} `); // x becomes × (keep spaces to avoid breaking words)
    text = text.replace(/\s+\*\s+/g, ` ${symbols.multiplication} `); // * becomes ×
    // Division operator removed - "/" is too common in regular text (dates, and/or, etc.)
    text = text.replace(/\+\/-/g, symbols.plusMinus); // +/- becomes ±
    text = text.replace(/!=/g, symbols.notEqual); // != becomes ≠
    text = text.replace(/<=/g, symbols.lessThanEqual); // <= becomes ≤
    text = text.replace(/>=/g, symbols.greaterThanEqual); // >= becomes ≥
    text = text.replace(/~=/g, symbols.approximately); // ~= becomes ≈
    text = text.replace(/≈=/g, symbols.approximately); // ≈= becomes ≈

    // Special symbols
    text = text.replace(/\(c\)/gi, symbols.copyright); // (c) becomes ©
    text = text.replace(/\(r\)/gi, symbols.registered); // (r) becomes ®
    text = text.replace(/\(tm\)/gi, symbols.trademark); // (tm) becomes ™

    // Temperature (careful with degrees)
    text = text.replace(/(\d+)\s*degrees?/gi, `$1${symbols.degree}`); // 100 degrees becomes 100°
    text = text.replace(/(\d+)\s*deg\b/gi, `$1${symbols.degree}`); // 100 deg becomes 100°

    return text;
  }

  /**
   * Format numbers with proper separators based on locale
   */
  fixNumbers(text, locale = this.options.locale, rules = this.rules) {
    // Only format large numbers (4+ digits)
    // Match numbers that aren't part of dates, times, or codes
    const numberRegex = /\b(\d{4,})\b/g;

    text = text.replace(numberRegex, (match) => {
      // Skip if it looks like a year (1900-2099)
      if (match.length === 4 && match >= "1900" && match <= "2099") {
        return match;
      }

      // Format based on locale
      if (locale === "fr") {
        // French: 1 000 000 (thin spaces)
        return match.replace(/(\d)(?=(\d{3})+$)/g, `$1${rules.thinSpace}`);
      } else if (locale === "de" || locale === "es" || locale === "it") {
        // German/Spanish/Italian: 1.000.000
        return match.replace(/(\d)(?=(\d{3})+$)/g, "$1.");
      } else {
        // English: 1,000,000
        return match.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
      }
    });

    return text;
  }

  /**
   * Fix spacing issues based on locale
   */
  fixSpacing(text, locale = this.options.locale, rules = this.rules) {
    if (locale === "fr") {
      return this.fixFrenchSpacing(text, rules);
    }

    return this.fixEnglishSpacing(text, rules);
  }

  /**
   * French typography spacing rules
   */
  fixFrenchSpacing(text, rules = this.rules) {
    // Add thin non-breaking space before : ; ! ? (only if not already present)
    text = text.replace(
      new RegExp(`\\s*(?!${rules.thinSpace})([:;!?])`, "g"),
      `${rules.thinSpace}$1`,
    );

    // Handle guillemets (French quotes) - only if not already processed
    text = text.replace(
      new RegExp(`«(?!${rules.thinSpace})\\s*`, "g"),
      `«${rules.thinSpace}`,
    );
    text = text.replace(
      new RegExp(`\\s*(?!${rules.thinSpace})»`, "g"),
      `${rules.thinSpace}»`,
    );

    return text;
  }

  /**
   * English typography spacing rules
   */
  fixEnglishSpacing(text, rules = this.rules) {
    // Remove multiple spaces
    text = text.replace(/\s+/g, " ");

    // Remove space before punctuation
    text = text.replace(/\s+([,.!?;:])/g, "$1");

    return text;
  }

  /**
   * Check if element should be excluded from widow prevention
   */
  shouldExcludeFromWidows(element) {
    if (!this.options.excludeFromWidows) return false;

    const excludeSelectors = this.options.excludeFromWidows
      .split(",")
      .map((s) => s.trim());

    return excludeSelectors.some((selector) => element.matches(selector));
  }

  /**
   * Prevent widows at the element level (works with inline HTML)
   */
  preventWidowsForElement(
    element,
    locale = this.options.locale,
    rules = this.rules,
  ) {
    // Get the full text content (strips HTML but preserves structure)
    const fullText = element.textContent;

    // Check if already processed
    if (fullText.includes(rules.nonBreakingSpace)) {
      return;
    }

    // Skip very short text
    if (fullText.trim().split(/\s+/).length < 3) {
      return;
    }

    // Skip elements containing <br> tags (explicit line breaks)
    if (element.querySelector("br")) {
      return;
    }

    // Find the last text node that contains actual words
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    let lastTextNode = null;
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim().length > 0) {
        lastTextNode = node;
      }
    }

    if (!lastTextNode) return;

    // Apply widow prevention only to the last text node
    let text = lastTextNode.nodeValue;
    const nbspRegex = /\s+(\S+)\s*$/;
    text = text.replace(nbspRegex, `${rules.nonBreakingSpace}$1`);
    lastTextNode.nodeValue = text;

    // Apply orphan prevention to all text nodes
    walker.currentNode = element;
    while ((node = walker.nextNode())) {
      if (!this.shouldProcess(node.parentElement)) continue;

      let text = node.nodeValue;
      if (!text || !text.trim()) continue;

      // Apply locale-specific orphan rules
      if (locale === "fr") {
        text = this.preventFrenchOrphans(text, rules);
      } else if (locale === "de") {
        text = this.preventGermanOrphans(text, rules);
      } else if (locale === "es") {
        text = this.preventSpanishOrphans(text, rules);
      } else if (locale === "it") {
        text = this.preventItalianOrphans(text, rules);
      } else {
        text = this.preventEnglishOrphans(text, rules);
      }

      node.nodeValue = text;
    }
  }

  /**
   * Prevent orphans for English text
   * Simple and clear approach
   */
  preventEnglishOrphans(text, rules = this.rules) {
    const shortWords = [
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
    ];

    // Build one big regex pattern for all words
    const pattern = `\\b(${shortWords.join("|")})\\b\\s`;
    const regex = new RegExp(pattern, "gi");

    // Replace all at once
    text = text.replace(regex, `$1${rules.nonBreakingSpace}`);

    // Titles: Mr. Smith, Dr. Jones
    text = text.replace(
      /\b(Mr|Mrs|Ms|Dr|Prof|St)\.\s/gi,
      `$1.${rules.nonBreakingSpace}`,
    );

    // Time: 5 pm, 10 am
    text = text.replace(
      /\b(\d+)\s(am|pm)\b/gi,
      `$1${rules.nonBreakingSpace}$2`,
    );

    // Ordinals: 1st, 2nd, 3rd
    text = text.replace(
      /\b(\d+)\s(st|nd|rd|th)\b/gi,
      `$1${rules.nonBreakingSpace}$2`,
    );

    return text;
  }

  preventFrenchOrphans(text, rules = this.rules) {
    const shortWords = [
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
      "était",
      "sera",
    ];

    const pattern = `\\b(${shortWords.join("|")})\\b\\s`;
    const regex = new RegExp(pattern, "gi");
    text = text.replace(regex, `$1${rules.nonBreakingSpace}`);

    text = text.replace(
      /\b(M|Mme|Mlle|Dr|Pr|St|Ste)\.\s/gi,
      `$1.${rules.nonBreakingSpace}`,
    );
    text = text.replace(
      /\b(\d+)\s(h|min|s|kg|g|m|km|cm|mm|€|%)\b/gi,
      `$1${rules.nonBreakingSpace}$2`,
    );

    return text;
  }

  preventGermanOrphans(text, rules = this.rules) {
    const shortWords = [
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
      "einer",
      "eines",
      "einem",
      "einen",
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
    ];

    const pattern = `\\b(${shortWords.join("|")})\\b\\s`;
    const regex = new RegExp(pattern, "gi");
    text = text.replace(regex, `$1${rules.nonBreakingSpace}`);

    text = text.replace(
      /\b(Dr|Prof|Dipl|Ing|Herr|Frau)\.\s/gi,
      `$1.${rules.nonBreakingSpace}`,
    );
    text = text.replace(
      /\b(\d+)\s(Uhr|kg|g|m|km|cm|mm|€|%)\b/gi,
      `$1${rules.nonBreakingSpace}$2`,
    );

    return text;
  }

  preventSpanishOrphans(text, rules = this.rules) {
    const shortWords = [
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
      "unos",
      "unas",
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
    ];

    const pattern = `\\b(${shortWords.join("|")})\\b\\s`;
    const regex = new RegExp(pattern, "gi");
    text = text.replace(regex, `$1${rules.nonBreakingSpace}`);

    text = text.replace(
      /\b(Sr|Sra|Dr|Dra|Prof)\.\s/gi,
      `$1.${rules.nonBreakingSpace}`,
    );
    text = text.replace(
      /\b(\d+)\s(h|min|s|kg|g|m|km|cm|mm|€|%)\b/gi,
      `$1${rules.nonBreakingSpace}$2`,
    );

    return text;
  }

  preventItalianOrphans(text, rules = this.rules) {
    const shortWords = [
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
      "essere",
      "fare",
    ];

    const pattern = `\\b(${shortWords.join("|")})\\b\\s`;
    const regex = new RegExp(pattern, "gi");
    text = text.replace(regex, `$1${rules.nonBreakingSpace}`);

    text = text.replace(
      /\b(Sig|Dott|Prof|Ing)\.\s/gi,
      `$1.${rules.nonBreakingSpace}`,
    );
    text = text.replace(
      /\b(\d+)\s(h|min|s|kg|g|m|km|cm|mm|€|%)\b/gi,
      `$1${rules.nonBreakingSpace}$2`,
    );

    return text;
  }

  /**
   * Watch for dynamically added content
   */
  observeDynamicContent() {
    if (typeof MutationObserver === "undefined") return;

    this.observer = new MutationObserver((mutations) => {
      // Debounce processing to avoid excessive calls
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.processNewContent(node);
            }
          });
        });
      }, this.options.debounceDelay);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.dispatchEvent("observerStarted", {});
  }

  /**
   * Apply typography rules to new content (for dynamic content)
   */
  processNewContent(element) {
    if (element.nodeType === Node.ELEMENT_NODE) {
      // Check if element itself should be processed
      if (this.shouldProcess(element)) {
        const selector = element.tagName.toLowerCase();
        const hasIncludeClass =
          this.options.includeClass &&
          element.classList.contains(this.options.includeClass);

        if (
          hasIncludeClass ||
          [
            "p",
            "li",
            "blockquote",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
          ].includes(selector)
        ) {
          this.processElement(element);
        }
      }

      // Process child elements (including those with includeClass)
      const includeClassSelector = this.options.includeClass
        ? `, .${this.options.includeClass}`
        : "";
      const children = element.querySelectorAll(
        `p, li, blockquote, h1, h2, h3, h4, h5, h6${includeClassSelector}`,
      );
      children.forEach((child) => {
        if (this.shouldProcess(child)) {
          this.processElement(child);
        }
      });
    }
  }

  /**
   * Dispatch custom events for extensibility
   */
  dispatchEvent(eventName, detail) {
    if (typeof CustomEvent === "undefined") return;

    document.dispatchEvent(
      new CustomEvent(`standard:${eventName}`, {
        detail: { ...detail, timestamp: Date.now() },
      }),
    );
  }

  /**
   * Refresh - reprocess all elements
   */
  refresh() {
    this.dispatchEvent("beforeRefresh", {});
    // Clear processed markers and reprocess to prevent cumulative changes
    this.clearProcessedMarkers();
    this.process();
    this.dispatchEvent("afterRefresh", {});
  }

  /**
   * Clear processed markers from all elements
   */
  clearProcessedMarkers() {
    const processedElements = document.querySelectorAll(
      "[data-typography-processed]",
    );
    processedElements.forEach((element) => {
      element.removeAttribute("data-typography-processed");
    });
  }

  /**
   * Cleanup and disconnect observer
   */
  destroy() {
    this.dispatchEvent("beforeDestroy", {});

    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Clear debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    // Clear processed markers to allow reprocessing
    this.clearProcessedMarkers();

    this.dispatchEvent("afterDestroy", {});
  }

  /**
   * Update options and reprocess
   */
  updateOptions(newOptions) {
    const oldOptions = { ...this.options };
    this.options = { ...this.options, ...newOptions };

    // Update locale if changed
    if (newOptions.locale && newOptions.locale !== oldOptions.locale) {
      this.rules = this.getRulesForLocale(this.options.locale);
    }

    // Restart observer if observeDOM option changed
    if (newOptions.observeDOM !== undefined) {
      if (newOptions.observeDOM && !this.observer) {
        this.observeDynamicContent();
      } else if (!newOptions.observeDOM && this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }

    this.dispatchEvent("optionsUpdated", { oldOptions, newOptions });

    // Reprocess if any typography options changed
    const typographyOptions = [
      "enableWidowPrevention",
      "enableSmartQuotes",
      "enablePunctuation",
      "enableSpacing",
      "enableFractions",
      "enableNumberFormatting",
      "enableArrowsAndSymbols",
      "locale",
    ];

    const shouldRefresh = typographyOptions.some(
      (key) =>
        newOptions[key] !== undefined && newOptions[key] !== oldOptions[key],
    );

    if (shouldRefresh) {
      this.refresh();
    }
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return {
      options: { ...this.options },
      locale: this.options.locale,
      rules: { ...this.rules },
      isObserving: !!this.observer,
    };
  }

  /**
   * Toggle baseline grid debug mode
   */
  toggleBaselineGrid(show = true) {
    document.body.setAttribute("data-baseline-debug", show);
    document.documentElement.style.setProperty(
      "--baseline-debug",
      show ? "1" : "0",
    );
  }

  /**
   * Measure font baseline offset (run once per font)
   */
  measureBaselineOffset(fontFamily = "system-ui", fontSize = 16) {
    const testEl = document.createElement("div");
    testEl.style.cssText = `
      position: absolute;
      font-family: ${fontFamily};
      font-size: ${fontSize}px;
      line-height: 1;
      visibility: hidden;
    `;
    testEl.textContent = "Hxg";
    document.body.appendChild(testEl);

    const bounds = testEl.getBoundingClientRect();
    const lineHeight = parseFloat(getComputedStyle(testEl).lineHeight);

    // Calculate offset from top of line-box to baseline
    const offset = (lineHeight - fontSize) / 2;

    document.body.removeChild(testEl);

    console.log(
      `Baseline offset for ${fontFamily}: ${offset}px (${offset / fontSize}em)`,
    );
    return offset / fontSize; // Return as em value
  }

  // ========================================
  // IMAGE ZOOM ENHANCEMENT
  // ========================================

  /**
   * Initialize image zoom functionality
   * - Click to zoom in/out
   * - Arrow keys to navigate
   * - ESC or click anywhere to close
   */
  initImageZoom() {
    this.imageZoom = {
      currentZoomedImage: null,
      images: [],
      zoomedClass: "zoomed",
      selector: ".reading img, .rhythm img",
    };

    // Disable CSS :active conflicts by injecting override styles
    this.disableImageActiveStyles();

    // Bind click events
    this.bindImageZoomClicks();

    // Bind keyboard events
    this.bindImageZoomKeyboard();

    this.dispatchEvent("imageZoomInitialized", {});
  }

  /**
   * Disable CSS :active pseudo-class for images to prevent conflicts
   * Injects a style override with higher specificity
   */
  disableImageActiveStyles() {
    const styleId = "standard-image-zoom-override";

    // Check if already injected
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
        /* Standard.js - Disable :active pseudo-class conflicts */
        .reading img:active,
        .rhythm img:active,
        :where(body:not(.no-rhythm)) img:active {
          /* Reset :active styles - JS handles zoom now */
          cursor: zoom-in !important;
          display: inline !important;
          z-index: auto !important;
          position: static !important;
          max-height: none !important;
          max-width: 100% !important;
          object-fit: initial !important;
          margin: 0 !important;
          padding: 0 !important;
          top: auto !important;
          left: auto !important;
          transform: none !important;
          user-select: auto !important;
        }

        /* Remove :active backdrop overlay */
        .reading :has(img:active)::before,
        .rhythm :has(img:active)::before {
          display: none !important;
        }
      `;

    document.head.appendChild(style);

    this.dispatchEvent("imageZoomStylesInjected", { styleId });
  }

  /**
   * Refresh list of zoomable images
   */
  refreshZoomableImages() {
    this.imageZoom.images = Array.from(
      document.querySelectorAll(this.imageZoom.selector),
    );
  }

  /**
   * Bind click events for image zoom
   */
  bindImageZoomClicks() {
    document.addEventListener("click", (e) => {
      const img = e.target.closest(this.imageZoom.selector);

      if (img) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleImageZoom(img);
      } else if (this.imageZoom.currentZoomedImage) {
        // Click anywhere else closes zoom
        this.closeImageZoom();
      }
    });
  }

  /**
   * Bind keyboard events for image zoom
   */
  bindImageZoomKeyboard() {
    document.addEventListener("keydown", (e) => {
      if (!this.imageZoom.currentZoomedImage) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          this.closeImageZoom();
          break;

        case "ArrowLeft":
          e.preventDefault();
          this.navigateZoomedImage(-1);
          break;

        case "ArrowRight":
          e.preventDefault();
          this.navigateZoomedImage(1);
          break;
      }
    });
  }

  /**
   * Toggle zoom on an image
   */
  toggleImageZoom(img) {
    if (this.imageZoom.currentZoomedImage === img) {
      this.closeImageZoom();
    } else {
      this.openImageZoom(img);
    }
  }

  /**
   * Open image zoom
   */
  openImageZoom(img) {
    // Close any currently zoomed image
    if (this.imageZoom.currentZoomedImage) {
      this.closeImageZoom();
    }

    img.classList.add(this.imageZoom.zoomedClass);
    this.imageZoom.currentZoomedImage = img;

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Dispatch custom event
    this.dispatchEvent("imageZoomOpen", { image: img });
  }

  /**
   * Close image zoom
   */
  closeImageZoom() {
    if (!this.imageZoom.currentZoomedImage) return;

    this.imageZoom.currentZoomedImage.classList.remove(
      this.imageZoom.zoomedClass,
    );

    // Dispatch custom event before clearing reference
    this.dispatchEvent("imageZoomClose", {
      image: this.imageZoom.currentZoomedImage,
    });

    this.imageZoom.currentZoomedImage = null;

    // Restore body scroll
    document.body.style.overflow = "";
  }

  /**
   * Navigate between images while zoomed
   */
  navigateZoomedImage(direction) {
    if (!this.imageZoom.currentZoomedImage) return;

    // Refresh images list in case DOM changed
    this.refreshZoomableImages();

    const currentIndex = this.imageZoom.images.indexOf(
      this.imageZoom.currentZoomedImage,
    );
    if (currentIndex === -1) return;

    const newIndex = currentIndex + direction;

    // Wrap around
    const nextIndex =
      (newIndex + this.imageZoom.images.length) % this.imageZoom.images.length;
    const nextImage = this.imageZoom.images[nextIndex];

    if (nextImage) {
      this.openImageZoom(nextImage);
    }
  }
}

// ========================================
// AUTO-INITIALIZATION
// ========================================

// Auto-initialize if running in browser and not imported as module
if (typeof window !== "undefined" && !window.StandardLoaded) {
  window.StandardLoaded = true;

  // Make class available globally
  window.Standard = Standard;

  // Auto-initialize with smart defaults
  window.standard = new Standard({
    autoProcess: true,
    observeDOM: true, // Watch for dynamic content
    enableWidowPrevention: true,
    enableSmartQuotes: true,
    enablePunctuation: true,
    enableSpacing: true,
    enableFractions: true,
    enableArrowsAndSymbols: true,
    enableNumberFormatting: false, // Conservative default
  });

  // Initialize image zoom
  window.standard.initImageZoom();

  // Listen for custom events (example)
  document.addEventListener("standard:afterProcessAll", (e) => {
    // You can hook into this event for custom behavior
    // console.log('Standard processed', e.detail.processedCount, 'elements');
  });

  // Image zoom event listeners (optional)
  document.addEventListener("standard:imageZoomOpen", (e) => {
    // console.log('Image zoomed:', e.detail.image);
  });

  document.addEventListener("standard:imageZoomClose", (e) => {
    // console.log('Zoom closed');
  });
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Standard };
}

// Export for ES6 modules
if (typeof exports !== "undefined") {
  exports.Standard = Standard;
}
