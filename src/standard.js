/**
 * Standard Framework - Fine-Art Typography & Theme Management
 *
 * A comprehensive framework implementing:
 * - Classical typography rules that CSS cannot handle
 * - Automatic light/dark theme management with system preference detection
 * - Progressive enhancement with zero-configuration setup
 *
 * Based on research from:
 * - The Elements of Typographic Style (Robert Bringhurst)
 * - Ellen Lupton's typography works
 * - Classical European typography conventions
 * - Swiss typography principles
 * - Modern web accessibility standards
 *
 * @version 1.0.0
 * @license MIT
 */

// ========================================
// AUTOMATIC THEME MANAGEMENT SYSTEM
// ========================================

class StandardTheme {
  constructor(options = {}) {
    this.options = {
      storage: true, // Store theme preference
      storageKey: "standard-theme",
      transitions: true, // Smooth theme transitions
      respectMotion: true, // Respect prefers-reduced-motion
      debug: false,
      // Callbacks
      onThemeChange: null,
      onSystemChange: null,
      ...options,
    };

    this.currentTheme = null;
    this.systemPreference = null;
    this.userPreference = null;
    this.mediaQuery = null;
    this.isInitialized = false;

    this.init();
  }

  /**
   * Initialize theme system automatically
   */
  init() {
    if (this.isInitialized) return;

    // Load user preference from storage
    this.loadStoredPreference();

    // Set up system preference detection
    this.setupSystemDetection();

    // Apply initial theme
    this.applyTheme();

    // Set up smooth transitions if enabled
    this.setupTransitions();

    // Listen for storage changes (multi-tab sync)
    this.setupStorageSync();

    this.isInitialized = true;

    if (this.options.debug) {
      console.log("StandardTheme: Initialized", {
        system: this.systemPreference,
        user: this.userPreference,
        current: this.currentTheme,
      });
    }
  }

  /**
   * Detect system color scheme preference
   */
  setupSystemDetection() {
    if (typeof window === "undefined" || !window.matchMedia) return;

    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.systemPreference = this.mediaQuery.matches ? "dark" : "light";

    // Listen for system preference changes
    const handleSystemChange = (e) => {
      this.systemPreference = e.matches ? "dark" : "light";

      if (this.options.debug) {
        console.log(
          "StandardTheme: System preference changed to",
          this.systemPreference,
        );
      }

      // Only apply if user hasn't set manual preference
      if (!this.userPreference) {
        this.applyTheme();
      }

      // Call system change callback
      if (this.options.onSystemChange) {
        this.options.onSystemChange(this.systemPreference);
      }
    };

    // Use addEventListener if available, otherwise use addListener
    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener("change", handleSystemChange);
    } else {
      this.mediaQuery.addListener(handleSystemChange);
    }
  }

  /**
   * Load stored theme preference
   */
  loadStoredPreference() {
    if (!this.options.storage || typeof localStorage === "undefined") return;

    try {
      const stored = localStorage.getItem(this.options.storageKey);
      if (stored && ["light", "dark", "auto"].includes(stored)) {
        this.userPreference = stored === "auto" ? null : stored;
      }
    } catch (e) {
      // localStorage not available or blocked
      if (this.options.debug) {
        console.warn("StandardTheme: Could not access localStorage", e);
      }
    }
  }

  /**
   * Save theme preference to storage
   */
  savePreference(theme) {
    if (!this.options.storage || typeof localStorage === "undefined") return;

    try {
      const valueToStore = theme || "auto";
      localStorage.setItem(this.options.storageKey, valueToStore);
    } catch (e) {
      if (this.options.debug) {
        console.warn("StandardTheme: Could not save to localStorage", e);
      }
    }
  }

  /**
   * Determine effective theme (user preference or system)
   */
  getEffectiveTheme() {
    return this.userPreference || this.systemPreference || "light";
  }

  /**
   * Apply theme to document
   */
  applyTheme() {
    const newTheme = this.getEffectiveTheme();
    const oldTheme = this.currentTheme;

    if (newTheme === oldTheme) return;

    const html = document.documentElement;

    // Remove old theme classes
    html.classList.remove("light", "dark");

    // Add new theme class
    if (newTheme !== "auto") {
      html.classList.add(newTheme);
    }

    this.currentTheme = newTheme;

    // Update color-scheme for native controls
    html.style.colorScheme = newTheme;

    if (this.options.debug) {
      console.log(
        `StandardTheme: Applied theme "${newTheme}" (was "${oldTheme}")`,
      );
    }

    // Call theme change callback
    if (this.options.onThemeChange) {
      this.options.onThemeChange(newTheme, oldTheme);
    }

    // Dispatch theme change event
    this.dispatchThemeEvent(newTheme, oldTheme);
  }

  /**
   * Set up smooth transitions between themes
   */
  setupTransitions() {
    if (!this.options.transitions) return;

    // Check if user prefers reduced motion
    if (this.options.respectMotion) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;
    }

    // Add transition styles temporarily during theme changes
    const addTransitions = () => {
      const style = document.createElement("style");
      style.id = "standard-theme-transitions";
      style.textContent = `
        *, *::before, *::after {
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease !important;
        }
      `;
      document.head.appendChild(style);

      // Remove after transition completes
      setTimeout(() => {
        const transitionStyle = document.getElementById(
          "standard-theme-transitions",
        );
        if (transitionStyle) {
          transitionStyle.remove();
        }
      }, 200);
    };

    // Listen for theme changes to add transitions
    document.addEventListener("standard:themechange", addTransitions);
  }

  /**
   * Set up cross-tab theme synchronization
   */
  setupStorageSync() {
    if (!this.options.storage || typeof window === "undefined") return;

    window.addEventListener("storage", (e) => {
      if (e.key === this.options.storageKey && e.newValue !== e.oldValue) {
        this.loadStoredPreference();
        this.applyTheme();

        if (this.options.debug) {
          console.log("StandardTheme: Synced theme from another tab");
        }
      }
    });
  }

  /**
   * Dispatch theme change event
   */
  dispatchThemeEvent(newTheme, oldTheme) {
    if (typeof CustomEvent === "undefined") return;

    document.dispatchEvent(
      new CustomEvent("standard:themechange", {
        detail: {
          theme: newTheme,
          oldTheme: oldTheme,
          isDark: newTheme === "dark",
          isLight: newTheme === "light",
          isSystem: !this.userPreference,
          userPreference: this.userPreference,
          systemPreference: this.systemPreference,
        },
      }),
    );
  }

  /**
   * Manually set theme
   */
  setTheme(theme) {
    if (!["light", "dark", "auto", null].includes(theme)) {
      console.warn("StandardTheme: Invalid theme", theme);
      return;
    }

    this.userPreference = theme === "auto" ? null : theme;
    this.savePreference(theme);
    this.applyTheme();

    if (this.options.debug) {
      console.log("StandardTheme: Manual theme set to", theme || "auto");
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const current = this.getEffectiveTheme();
    const newTheme = current === "dark" ? "light" : "dark";
    this.setTheme(newTheme);
    return newTheme;
  }

  /**
   * Reset to system preference
   */
  resetToSystem() {
    this.setTheme("auto");
  }

  /**
   * Get current theme info
   */
  getThemeInfo() {
    return {
      current: this.currentTheme,
      effective: this.getEffectiveTheme(),
      user: this.userPreference,
      system: this.systemPreference,
      isDark: this.getEffectiveTheme() === "dark",
      isLight: this.getEffectiveTheme() === "light",
      isAuto: !this.userPreference,
    };
  }

  /**
   * Check if current theme is dark
   */
  isDark() {
    return this.getEffectiveTheme() === "dark";
  }

  /**
   * Check if current theme is light
   */
  isLight() {
    return this.getEffectiveTheme() === "light";
  }

  /**
   * Check if using system preference
   */
  isAuto() {
    return !this.userPreference;
  }

  /**
   * Create theme toggle button
   */
  createToggleButton(options = {}) {
    const config = {
      text: { light: "🌙 Dark", dark: "☀️ Light" },
      className: "theme-toggle",
      container: null,
      ...options,
    };

    const button = document.createElement("button");
    button.className = config.className;
    button.setAttribute("aria-label", "Toggle theme");

    const updateButton = () => {
      const theme = this.getEffectiveTheme();
      button.textContent = config.text[theme];
      button.setAttribute("data-theme", theme);
    };

    button.addEventListener("click", () => {
      this.toggleTheme();
    });

    // Listen for theme changes to update button
    document.addEventListener("standard:themechange", updateButton);

    // Initial update
    updateButton();

    // Append to container if specified
    if (config.container) {
      const container =
        typeof config.container === "string"
          ? document.querySelector(config.container)
          : config.container;

      if (container) {
        container.appendChild(button);
      }
    }

    return button;
  }

  /**
   * Cleanup theme system
   */
  destroy() {
    if (this.mediaQuery) {
      if (this.mediaQuery.removeEventListener) {
        this.mediaQuery.removeEventListener("change", this.handleSystemChange);
      } else {
        this.mediaQuery.removeListener(this.handleSystemChange);
      }
    }

    // Remove transition styles if they exist
    const transitionStyle = document.getElementById(
      "standard-theme-transitions",
    );
    if (transitionStyle) {
      transitionStyle.remove();
    }

    this.isInitialized = false;

    if (this.options.debug) {
      console.log("StandardTheme: Destroyed");
    }
  }
}

class StandardTypography {
  constructor(options = {}) {
    this.options = {
      locale: "en",
      enableWidowPrevention: false,
      enableSmartQuotes: false,
      enablePunctuation: false,
      enableSpacing: false,
      enableLigatures: false,
      debug: true,
      autoProcess: false,
      excludeSelectors: "nav, .nav, [role='navigation']",
      excludeFromWidows: "h1, h2, h3, h4, h5, h6",
      watchThemeChanges: false,
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
    // Skip if already processed to prevent cumulative changes
    if (element.hasAttribute("data-typography-processed")) {
      if (this.options.debug) {
        console.log(
          "StandardTypography: Skipping already processed element",
          element,
        );
      }
      return;
    }

    // Store original content before first processing
    this.storeOriginalContent(element);

    // Store original text for comparison
    const originalText = element.innerHTML;
    let text = originalText;

    if (this.options.debug) {
      console.log(
        "StandardTypography: Processing element",
        element,
        "Original:",
        originalText.substring(0, 50) + "...",
      );
    }

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

    // Only update if text actually changed
    if (text !== originalText) {
      if (this.options.debug) {
        console.log("StandardTypography: Text changed, updating element");
      }
      element.innerHTML = text;
    } else {
      if (this.options.debug) {
        console.log("StandardTypography: No changes made to text");
      }
    }

    // Mark as processed to prevent reprocessing
    element.setAttribute("data-typography-processed", "true");
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
    // Add thin non-breaking space before : ; ! ? (only if not already present)
    text = text.replace(
      new RegExp(`\\s*(?!${this.rules.thinSpace})([:\\;\\!\\?])`, "g"),
      `${this.rules.thinSpace}$1`,
    );

    // Handle guillemets (French quotes) - only if not already processed
    text = text.replace(
      new RegExp(`«(?!${this.rules.thinSpace})\\s*`, "g"),
      `«${this.rules.thinSpace}`,
    );
    text = text.replace(
      new RegExp(`\\s*(?!${this.rules.thinSpace})»`, "g"),
      `${this.rules.thinSpace}»`,
    );

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
    // Check if text already contains non-breaking spaces to prevent double processing
    if (text.includes(this.rules.nonBreakingSpace)) {
      return text; // Already processed
    }

    // Prevent widow: non-breaking space before last word
    const nbspRegex = /\s+(\S+)\s*$/;
    text = text.replace(nbspRegex, `${this.rules.nonBreakingSpace}$1`);

    // Prevent orphan prepositions and articles (2-letter words)
    const twoLetterWords =
      /\s+(a|an|at|be|by|do|go|he|if|in|is|it|me|my|no|of|on|or|so|to|up|us|we|un|le|la|et|ou|où|à|de|en|ce|ça|il|on|je|tu|me|te|se|ne|y|ci|là)\s+/gi;
    text = text.replace(twoLetterWords, ` $1${this.rules.nonBreakingSpace}`);

    // Prevent breaking on common short words and phrases
    text = text.replace(
      /\s+(Mr|Mrs|Ms|Dr|Prof|St)\.\s+/gi,
      ` $1.${this.rules.nonBreakingSpace}`,
    );
    text = text.replace(
      /\s+(\d+)\s+(am|pm|AM|PM)\s+/gi,
      ` $1${this.rules.nonBreakingSpace}$2 `,
    );
    text = text.replace(
      /\s+(\d+)\s+(st|nd|rd|th)\s+/gi,
      ` $1${this.rules.nonBreakingSpace}$2 `,
    );

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
    // Restore original content and reprocess to prevent cumulative changes
    this.restoreAllOriginalContent();
    this.process();
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
   * Store original text content before processing
   */
  storeOriginalContent(element) {
    if (!element.hasAttribute("data-original-content")) {
      element.setAttribute("data-original-content", element.innerHTML);
    }
  }

  /**
   * Restore original text content
   */
  restoreOriginalContent(element) {
    const original = element.getAttribute("data-original-content");
    if (original) {
      element.innerHTML = original;
      element.removeAttribute("data-original-content");
      element.removeAttribute("data-typography-processed");
    }
  }

  /**
   * Restore original content for all processed elements
   */
  restoreAllOriginalContent() {
    const processedElements = document.querySelectorAll(
      "[data-typography-processed]",
    );
    processedElements.forEach((element) => {
      this.restoreOriginalContent(element);
    });
  }

  /**
   * Cleanup - remove theme watchers and observers
   */
  destroy() {
    // Clear processed markers to allow reprocessing
    this.clearProcessedMarkers();

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

// ========================================
// READING LAYOUT DEBUG SYSTEM
// ========================================

class StandardReadingDebug {
  constructor(options = {}) {
    this.options = {
      debug: false,
      keyboardShortcuts: true,
      infoPanel: true,
      defaultMode: "off", // 'off', 'rhythm', 'columns', 'both'
      ...options,
    };

    this.currentMode = this.options.defaultMode;
    this.isInitialized = false;
    this.shortcuts = {
      rhythm: "KeyR",
      columns: "KeyC",
      both: "KeyB",
      off: "Escape",
    };

    this.init();
  }

  /**
   * Initialize the debug system
   */
  init() {
    if (this.isInitialized) return;

    if (this.options.keyboardShortcuts) {
      this.setupKeyboardShortcuts();
    }

    this.isInitialized = true;

    if (this.options.debug) {
      console.log("StandardReadingDebug: Initialized");
    }
  }

  /**
   * Setup keyboard shortcuts for debug modes
   */
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Only activate when Ctrl/Cmd + Shift + [key]
      if (!(e.ctrlKey || e.metaKey) || !e.shiftKey) return;

      let newMode = null;

      switch (e.code) {
        case this.shortcuts.rhythm:
          newMode = this.currentMode === "rhythm" ? "off" : "rhythm";
          break;
        case this.shortcuts.columns:
          newMode = this.currentMode === "columns" ? "off" : "columns";
          break;
        case this.shortcuts.both:
          newMode = this.currentMode === "both" ? "off" : "both";
          break;
        case this.shortcuts.off:
          newMode = "off";
          break;
      }

      if (newMode !== null) {
        e.preventDefault();
        this.setDebugMode(newMode);
      }
    });
  }

  /**
   * Set debug mode for all .reading elements
   */
  setDebugMode(mode) {
    const readingElements = document.querySelectorAll(".reading");

    readingElements.forEach((element) => {
      // Remove all debug classes
      element.classList.remove("reading-debug", "reading-debug-columns");

      // Add appropriate debug classes
      switch (mode) {
        case "rhythm":
          element.classList.add("reading-debug");
          break;
        case "columns":
          element.classList.add("reading-debug-columns");
          break;
        case "both":
          element.classList.add("reading-debug", "reading-debug-columns");
          break;
        case "off":
        default:
          // Classes already removed
          break;
      }
    });

    const oldMode = this.currentMode;
    this.currentMode = mode;

    if (this.options.debug) {
      console.log(
        `StandardReadingDebug: Mode changed from "${oldMode}" to "${mode}"`,
      );
    }

    // Dispatch debug mode change event
    this.dispatchDebugEvent(mode, oldMode);

    // Show temporary notification
    this.showModeNotification(mode);
  }

  /**
   * Dispatch debug mode change event
   */
  dispatchDebugEvent(newMode, oldMode) {
    if (typeof CustomEvent === "undefined") return;

    document.dispatchEvent(
      new CustomEvent("standard:readingdebug", {
        detail: {
          mode: newMode,
          oldMode: oldMode,
          isActive: newMode !== "off",
          showsRhythm: newMode === "rhythm" || newMode === "both",
          showsColumns: newMode === "columns" || newMode === "both",
        },
      }),
    );
  }

  /**
   * Show temporary notification of mode change
   */
  showModeNotification(mode) {
    // Remove existing notification if present
    const existing = document.getElementById("standard-debug-notification");
    if (existing) {
      existing.remove();
    }

    const notifications = {
      off: "📖 Reading Debug: Off",
      rhythm: "📏 Reading Debug: Vertical Rhythm",
      columns: "📐 Reading Debug: Column Layout",
      both: "🔍 Reading Debug: Full Layout",
    };

    const notification = document.createElement("div");
    notification.id = "standard-debug-notification";
    notification.textContent = notifications[mode];

    // Style the notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "var(--color-accent, #007acc)",
      color: "var(--color-background, white)",
      padding: "12px 16px",
      borderRadius: "var(--border-radius, 4px)",
      fontSize: "14px",
      fontFamily: "var(--font-interface, system-ui)",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      zIndex: "var(--z-toast, 1090)",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
    });

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = "translateX(0)";
    });

    // Auto-remove after 2 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 2000);
  }

  /**
   * Toggle debug mode (cycle through modes)
   */
  toggleDebugMode() {
    const modes = ["off", "rhythm", "columns", "both"];
    const currentIndex = modes.indexOf(this.currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    this.setDebugMode(modes[nextIndex]);
  }

  /**
   * Get current debug info
   */
  getDebugInfo() {
    return {
      mode: this.currentMode,
      isActive: this.currentMode !== "off",
      showsRhythm: this.currentMode === "rhythm" || this.currentMode === "both",
      showsColumns:
        this.currentMode === "columns" || this.currentMode === "both",
      shortcuts: {
        rhythm: `Ctrl/Cmd + Shift + R`,
        columns: `Ctrl/Cmd + Shift + C`,
        both: `Ctrl/Cmd + Shift + B`,
        off: `Escape`,
      },
    };
  }

  /**
   * Create debug control buttons
   */
  createDebugControls(options = {}) {
    const config = {
      container: null,
      className: "reading-debug-controls",
      ...options,
    };

    const container = document.createElement("div");
    container.className = config.className;

    // Style the container
    Object.assign(container.style, {
      display: "flex",
      gap: "8px",
      padding: "8px",
      background: "var(--color-background-secondary, #f5f5f5)",
      borderRadius: "var(--border-radius, 4px)",
      border: "1px solid var(--color-border, #ddd)",
      fontSize: "14px",
      fontFamily: "var(--font-interface, system-ui)",
    });

    const buttons = [
      { mode: "off", text: "📖 Off", title: "Turn off debug mode" },
      {
        mode: "rhythm",
        text: "📏 Rhythm",
        title: "Show vertical rhythm lines",
      },
      { mode: "columns", text: "📐 Columns", title: "Show column boundaries" },
      { mode: "both", text: "🔍 Both", title: "Show rhythm and columns" },
    ];

    buttons.forEach(({ mode, text, title }) => {
      const button = document.createElement("button");
      button.textContent = text;
      button.title = title;
      button.className = "debug-mode-button";

      Object.assign(button.style, {
        padding: "6px 12px",
        border: "1px solid var(--color-border, #ccc)",
        borderRadius: "var(--border-radius, 4px)",
        background: "var(--color-background, white)",
        color: "var(--color-foreground, black)",
        cursor: "pointer",
        fontSize: "inherit",
        fontFamily: "inherit",
      });

      button.addEventListener("click", () => {
        this.setDebugMode(mode);
        this.updateButtonStates(container);
      });

      container.appendChild(button);
    });

    // Update initial button states
    this.updateButtonStates(container);

    // Append to specified container if provided
    if (config.container) {
      const targetContainer =
        typeof config.container === "string"
          ? document.querySelector(config.container)
          : config.container;

      if (targetContainer) {
        targetContainer.appendChild(container);
      }
    }

    return container;
  }

  /**
   * Update button states to show current mode
   */
  updateButtonStates(container) {
    const buttons = container.querySelectorAll(".debug-mode-button");
    const modes = ["off", "rhythm", "columns", "both"];

    buttons.forEach((button, index) => {
      const isActive = modes[index] === this.currentMode;
      button.style.background = isActive
        ? "var(--color-accent, #007acc)"
        : "var(--color-background, white)";
      button.style.color = isActive
        ? "var(--color-background, white)"
        : "var(--color-foreground, black)";
    });
  }

  /**
   * Cleanup debug system
   */
  destroy() {
    // Turn off all debug modes
    this.setDebugMode("off");

    // Remove notification if present
    const notification = document.getElementById("standard-debug-notification");
    if (notification) {
      notification.remove();
    }

    this.isInitialized = false;

    if (this.options.debug) {
      console.log("StandardReadingDebug: Destroyed");
    }
  }
}

// ========================================
// AUTO-INITIALIZATION
// ========================================

// Auto-initialize if running in browser and not imported as module
if (typeof window !== "undefined" && !window.StandardLoaded) {
  window.StandardLoaded = true;

  // Make classes available globally
  window.StandardTypography = StandardTypography;
  window.StandardTheme = StandardTheme;
  window.StandardReadingDebug = StandardReadingDebug;

  // Auto-initialize theme system (no configuration needed)
  window.standardTheme = new StandardTheme();

  // Auto-initialize typography system with conservative settings
  window.standardTypography = new StandardTypography({
    autoProcess: false,
    debug: false,
    enableWidowPrevention: false,
    enableSmartQuotes: false,
    enablePunctuation: false,
  });

  // Auto-initialize reading debug system
  window.standardReadingDebug = new StandardReadingDebug();

  // Create convenient global functions
  window.setTheme = (theme) => window.standardTheme.setTheme(theme);
  window.toggleTheme = () => window.standardTheme.toggleTheme();
  window.getTheme = () => window.standardTheme.getThemeInfo();

  // Reading debug functions
  window.setReadingDebug = (mode) =>
    window.standardReadingDebug.setDebugMode(mode);
  window.toggleReadingDebug = () =>
    window.standardReadingDebug.toggleDebugMode();
  window.getReadingDebug = () => window.standardReadingDebug.getDebugInfo();

  // Auto-create theme toggle if container exists
  document.addEventListener("DOMContentLoaded", () => {
    // Look for theme toggle containers
    const toggleContainers = document.querySelectorAll("[data-theme-toggle]");
    toggleContainers.forEach((container) => {
      window.standardTheme.createToggleButton({ container });
    });

    // Create keyboard shortcut (Ctrl/Cmd + Shift + D)
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        window.toggleTheme();
      }
    });
  });

  // Debug info in console (only in development)
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    console.log("🎨 Standard Framework loaded");
    console.log("Theme API:", {
      "setTheme(theme)": "Set theme: light, dark, or auto",
      "toggleTheme()": "Toggle between light and dark",
      "getTheme()": "Get current theme info",
    });
    console.log("Reading Debug API:", {
      "setReadingDebug(mode)": "Set debug mode: off, rhythm, columns, both",
      "toggleReadingDebug()": "Cycle through debug modes",
      "getReadingDebug()": "Get current debug info",
    });
    console.log("Keyboard shortcuts:");
    console.log("• Ctrl/Cmd + Shift + D: Toggle theme");
    console.log("• Ctrl/Cmd + Shift + R: Toggle vertical rhythm");
    console.log("• Ctrl/Cmd + Shift + C: Toggle column layout");
    console.log("• Ctrl/Cmd + Shift + B: Toggle both debug modes");
  }
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = { StandardTypography, StandardTheme, StandardReadingDebug };
}

// Export for ES6 modules
if (typeof exports !== "undefined") {
  exports.StandardTypography = StandardTypography;
  exports.StandardTheme = StandardTheme;
  exports.StandardReadingDebug = StandardReadingDebug;
}
