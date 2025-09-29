/**
 * Bonjour Monde
 * Standard Typography - Fine-Art Typography Rules for the Web
 *
 * A JavaScript library implementing classical typography rules that CSS cannot handle,
 * inspired by the precision of print typography and fine-art design principles.
 *
 * Based on research from:
 * - The Elements of Typographic Style (Robert Bringhurst)
 * - Ellen Lupton's typography works
 * - Classical European typography conventions
 * - Swiss typography principles
 *
 * @version 0.1.0
 * @license MIT
 */

class StandardTypography {
  constructor(options = {}) {
    this.options = {
      locale: "en",
      enableWidowPrevention: true,
      enableSmartQuotes: true,
      enablePunctuation: true,
      enableSpacing: true,
      enableLigatures: true,
      debug: false,
      autoProcess: true,
      excludeSelectors: "nav, .nav, [role='navigation']",
      excludeFromWidows: "h1, h2, h3, h4, h5, h6",
      watchThemeChanges: true,
      reprocessOnThemeChange: false,
      ...options,
    };

    this.rules = this.getRulesForLocale(this.options.locale);
    this.isDarkMode = this.detectDarkMode();
    this.themeObserver = null;
    this.themeChangeTimeout = null;
    this.isProcessingThemeChange = false;
    this.init();
  }

  /**
   * Initialize the typography engine
   */
  init() {
    if (this.options.watchThemeChanges) {
      this.setupThemeWatcher();
    }

    if (this.options.autoProcess === false) {
      // Skip automatic processing if disabled
      return;
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.process());
    } else {
      this.process();
    }
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
      },
    };

    return rules[locale] || rules.en;
  }

  /**
   * Get theme-specific typography adjustments
   */
  getThemeRules() {
    return {
      // Potential theme-specific adjustments
      light: {
        // Light mode might benefit from slightly tighter spacing
        spacingMultiplier: 1.0,
        contrastBoost: false,
      },
      dark: {
        // Dark mode might benefit from slightly looser spacing for readability
        spacingMultiplier: 1.05,
        contrastBoost: true,
      },
    };
  }

  /**
   * Process all eligible elements on the page
   */
  process(selector = "p, li, blockquote, h1, h2, h3, h4, h5, h6") {
    const elements = document.querySelectorAll(selector);

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

    filteredElements.forEach((element) => {
      this.processElement(element);
    });

    if (this.options.debug) {
      console.log(
        `StandardTypography: Processed ${filteredElements.length} of ${elements.length} elements`,
      );
    }
  }

  /**
   * Check if element should be processed
   */
  shouldProcess(element) {
    // Skip if element has data attribute to opt out
    if (element.hasAttribute("data-typography-skip")) {
      return false;
    }

    // Skip code blocks and similar elements
    const skipTags = ["CODE", "PRE", "SCRIPT", "STYLE"];
    if (skipTags.includes(element.tagName)) {
      return false;
    }

    // Skip if parent is a code block
    let parent = element.parentElement;
    while (parent) {
      if (skipTags.includes(parent.tagName)) {
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
    let text = element.innerHTML;

    if (this.options.enablePunctuation) {
      text = this.fixPunctuation(text);
    }

    if (this.options.enableSmartQuotes) {
      text = this.fixQuotes(text);
    }

    if (this.options.enableSpacing) {
      text = this.fixSpacing(text);
    }

    // Apply theme-specific adjustments if needed
    text = this.applyThemeAdjustments(text, element);

    if (
      this.options.enableWidowPrevention &&
      !this.shouldExcludeFromWidows(element)
    ) {
      text = this.preventWidows(text);
    }

    element.innerHTML = text;
  }

  /**
   * Fix punctuation marks (em dashes, ellipses, etc.)
   */
  fixPunctuation(text) {
    // Replace double/triple hyphens with em dash
    text = text.replace(/---/g, this.rules.emDash);
    text = text.replace(/--/g, this.rules.emDash);

    // Replace three periods with ellipsis
    text = text.replace(/\.\.\./g, this.rules.ellipsis);

    // Replace space-hyphen-space with en dash (for ranges)
    text = text.replace(/\s+-\s+/g, ` ${this.rules.enDash} `);

    return text;
  }

  /**
   * Fix quotation marks (smart quotes)
   */
  fixQuotes(text) {
    // Handle double quotes
    let quoteCount = 0;
    text = text.replace(/"([^"]*?)"/g, (match, content) => {
      return `${this.rules.leftDoubleQuote}${content}${this.rules.rightDoubleQuote}`;
    });

    // Handle single quotes and apostrophes
    text = text.replace(/'([^']*?)'/g, (match, content) => {
      return `${this.rules.leftSingleQuote}${content}${this.rules.rightSingleQuote}`;
    });

    // Fix apostrophes in contractions
    text = text.replace(/(\w)'(\w)/g, `$1${this.rules.apostrophe}$2`);

    return text;
  }

  /**
   * Fix spacing issues based on locale
   */
  fixSpacing(text) {
    if (this.options.locale === "fr") {
      return this.fixFrenchSpacing(text);
    }

    return this.fixEnglishSpacing(text);
  }

  /**
   * French typography spacing rules
   */
  fixFrenchSpacing(text) {
    // Add thin non-breaking space before : ; ! ?
    text = text.replace(/\s*([:\;\!\?])/g, `${this.rules.thinSpace}$1`);

    // Handle guillemets (French quotes)
    text = text.replace(/«\s*/g, `«${this.rules.thinSpace}`);
    text = text.replace(/\s*»/g, `${this.rules.thinSpace}»`);

    return text;
  }

  /**
   * English typography spacing rules
   */
  fixEnglishSpacing(text) {
    // Remove multiple spaces
    text = text.replace(/\s+/g, " ");

    // Remove space before punctuation
    text = text.replace(/\s+([,\.\!\?\;\:])/g, "$1");

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
   * Detect if dark mode is currently active
   */
  detectDarkMode() {
    // Only check for .dark class on html element
    return document.documentElement.classList.contains("dark");
  }

  /**
   * Setup theme change watcher
   */
  setupThemeWatcher() {
    // Watch for class changes on html element
    if (typeof MutationObserver !== "undefined") {
      this.themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class"
          ) {
            this.debouncedThemeChange();
          }
        });
      });

      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    // Note: System preference changes are handled by the theme management system
    // StandardTypography only observes the html.dark class
  }

  /**
   * Debounced theme change to prevent cascading loops
   */
  debouncedThemeChange() {
    if (this.isProcessingThemeChange) {
      return; // Prevent cascade
    }

    if (this.themeChangeTimeout) {
      clearTimeout(this.themeChangeTimeout);
    }

    this.themeChangeTimeout = setTimeout(() => {
      const newDarkMode = this.detectDarkMode();
      if (newDarkMode !== this.isDarkMode) {
        this.processThemeChange(newDarkMode);
      }
    }, 100); // 100ms debounce
  }

  /**
   * Process theme change with cascade prevention
   */
  processThemeChange(isDark) {
    if (this.isProcessingThemeChange) {
      return; // Prevent cascade
    }

    this.isProcessingThemeChange = true;
    this.onThemeChange(isDark);

    // Reset flag after a short delay
    setTimeout(() => {
      this.isProcessingThemeChange = false;
    }, 200);
  }

  /**
   * Handle theme change
   */
  onThemeChange(isDark) {
    const oldDarkMode = this.isDarkMode;
    this.isDarkMode = isDark;

    if (this.options.debug) {
      console.log(
        `StandardTypography: Theme changed from ${
          oldDarkMode ? "dark" : "light"
        } to ${isDark ? "dark" : "light"}`,
      );
    }

    // Optionally re-process content when theme changes
    // This could be useful if typography rules differ between themes
    if (this.options.reprocessOnThemeChange) {
      this.refresh();
    }

    // Dispatch custom event for external listeners
    if (typeof CustomEvent !== "undefined") {
      document.dispatchEvent(
        new CustomEvent("standard:themechange", {
          detail: { isDark, oldDarkMode },
        }),
      );
    }
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.isDarkMode ? "dark" : "light";
  }

  /**
   * Check if current theme is dark
   */
  isDark() {
    return this.isDarkMode;
  }

  /**
   * Check if current theme is light
   */
  isLight() {
    return !this.isDarkMode;
  }

  /**
   * Apply theme-specific typography adjustments
   */
  applyThemeAdjustments(text, element) {
    const themeRules = this.getThemeRules();
    const currentTheme = this.getCurrentTheme();
    const rules = themeRules[currentTheme];

    if (!rules) return text;

    // Example: In dark mode, we might want to add slightly more spacing
    // around certain punctuation for better readability
    if (currentTheme === "dark" && rules.contrastBoost) {
      // Add thin spaces around em dashes in dark mode for better contrast
      text = text.replace(
        /—/g,
        `${this.rules.thinSpace}—${this.rules.thinSpace}`,
      );
    }

    return text;
  }

  /**
   * Prevent widows and orphans
   * Insert non-breaking space before last word of each paragraph
   * Insert non-breaking space before two-letter words at line endings
   */
  preventWidows(text) {
    // Prevent widow: non-breaking space before last word
    text = text.replace(/\s+(\S+)\s*$/g, `${this.rules.nonBreakingSpace}$1`);

    // Prevent orphan prepositions and articles (2-letter words)
    const twoLetterWords =
      /\s+(a|an|at|be|by|do|go|he|if|in|is|it|me|my|no|of|on|or|so|to|up|us|we|un|le|la|et|ou|où|à|de|en|ce|ça|il|on|je|tu|me|te|se|ne|y|ci|là)\s+/gi;
    text = text.replace(twoLetterWords, ` $1${this.rules.nonBreakingSpace}`);

    // Prevent breaking on common short words and phrases
    const commonPhrases = [
      /\s+(Mr|Mrs|Ms|Dr|Prof|St)\.\s+/gi,
      /\s+(\d+)\s+(am|pm|AM|PM)\s+/gi,
      /\s+(\d+)\s+(st|nd|rd|th)\s+/gi,
    ];

    commonPhrases.forEach((pattern) => {
      text = text.replace(pattern, (match, p1, p2) => {
        return ` ${p1}${p2 ? "." : ""}${this.rules.nonBreakingSpace}${p2 || ""} `;
      });
    });

    return text;
  }

  /**
   * Apply typography rules to new content (for dynamic content)
   */
  processNewContent(element) {
    if (element.nodeType === Node.ELEMENT_NODE) {
      this.processElement(element);

      // Process child elements
      element
        .querySelectorAll("p, li, blockquote, h1, h2, h3, h4, h5, h6")
        .forEach((child) => {
          if (this.shouldProcess(child)) {
            this.processElement(child);
          }
        });
    }
  }

  /**
   * Refresh - reprocess all elements
   */
  refresh() {
    if (this.options.debug) {
      console.log(
        `StandardTypography: Refreshing (theme: ${this.getCurrentTheme()})`,
      );
    }
    this.process();
  }

  /**
   * Cleanup - remove theme watchers and observers
   */
  destroy() {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
      this.themeObserver = null;
    }

    if (this.themeChangeTimeout) {
      clearTimeout(this.themeChangeTimeout);
      this.themeChangeTimeout = null;
    }

    this.isProcessingThemeChange = false;

    if (this.options.debug) {
      console.log("StandardTypography: Cleaned up");
    }
  }

  /**
   * Update options and reprocess
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this.rules = this.getRulesForLocale(this.options.locale);
    this.refresh();
  }

  /**
   * Process specific element manually
   */
  processElement(element) {
    if (!this.shouldProcess(element)) return;

    let text = element.innerHTML;

    if (this.options.enablePunctuation) {
      text = this.fixPunctuation(text);
    }

    if (this.options.enableSmartQuotes) {
      text = this.fixQuotes(text);
    }

    if (this.options.enableSpacing) {
      text = this.fixSpacing(text);
    }

    if (
      this.options.enableWidowPrevention &&
      !this.shouldExcludeFromWidows(element)
    ) {
      text = this.preventWidows(text);
    }

    element.innerHTML = text;
  }
}

// Auto-initialize if running in browser and not imported as module
if (typeof window !== "undefined" && !window.StandardTypographyLoaded) {
  window.StandardTypographyLoaded = true;
  window.StandardTypography = StandardTypography;

  // Auto-initialize with default options
  window.typography = new StandardTypography();
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = StandardTypography;
}

// Export for ES6 modules
if (typeof exports !== "undefined") {
  exports.StandardTypography = StandardTypography;
}
