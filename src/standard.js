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
    // Skip if already processed to prevent cumulative changes
    if (element.hasAttribute("data-typography-processed")) {
      return;
    }

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
    // Prevent widow: non-breaking space before last word (only if not already present)
    const nbspRegex = new RegExp(
      `(?!${this.rules.nonBreakingSpace})\\s+(\\S+)\\s*$`,
      "g",
    );
    text = text.replace(nbspRegex, `${this.rules.nonBreakingSpace}$1`);

    // Prevent orphan prepositions and articles (2-letter words) - only if not already processed
    const twoLetterWords = new RegExp(
      `\\s+(a|an|at|be|by|do|go|he|if|in|is|it|me|my|no|of|on|or|so|to|up|us|we|un|le|la|et|ou|où|à|de|en|ce|ça|il|on|je|tu|me|te|se|ne|y|ci|là)(?!${this.rules.nonBreakingSpace})\\s+`,
      "gi",
    );
    text = text.replace(twoLetterWords, ` $1${this.rules.nonBreakingSpace}`);

    // Prevent breaking on common short words and phrases - only if not already processed
    const commonPhrases = [
      new RegExp(
        `\\s+(Mr|Mrs|Ms|Dr|Prof|St)\\.(?!${this.rules.nonBreakingSpace})\\s+`,
        "gi",
      ),
      new RegExp(
        `\\s+(\\d+)(?!${this.rules.nonBreakingSpace})\\s+(am|pm|AM|PM)\\s+`,
        "gi",
      ),
      new RegExp(
        `\\s+(\\d+)(?!${this.rules.nonBreakingSpace})\\s+(st|nd|rd|th)\\s+`,
        "gi",
      ),
    ];

    commonPhrases.forEach((pattern, index) => {
      text = text.replace(pattern, (match, p1, p2) => {
        if (index === 0) {
          return ` ${p1}.${this.rules.nonBreakingSpace}`;
        } else {
          return ` ${p1}${this.rules.nonBreakingSpace}${p2} `;
        }
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
// AUTO-INITIALIZATION
// ========================================

// Auto-initialize if running in browser and not imported as module
if (typeof window !== "undefined" && !window.StandardLoaded) {
  window.StandardLoaded = true;

  // Make classes available globally
  window.StandardTypography = StandardTypography;
  window.StandardTheme = StandardTheme;

  // Auto-initialize theme system (no configuration needed)
  window.standardTheme = new StandardTheme();

  // Auto-initialize typography system
  window.standardTypography = new StandardTypography();

  // Create convenient global functions
  window.setTheme = (theme) => window.standardTheme.setTheme(theme);
  window.toggleTheme = () => window.standardTheme.toggleTheme();
  window.getTheme = () => window.standardTheme.getThemeInfo();

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
    console.log("Keyboard shortcut: Ctrl/Cmd + Shift + D to toggle theme");
  }
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = { StandardTypography, StandardTheme };
}

// Export for ES6 modules
if (typeof exports !== "undefined") {
  exports.StandardTypography = StandardTypography;
  exports.StandardTheme = StandardTheme;
}
