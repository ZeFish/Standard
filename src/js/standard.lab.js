/**!
 * Standard System Debug & Playground Tool
 *
 * A minimalist debug interface for the Standard Framework
 * Opens with Shift+Cmd+D (Mac) or Shift+Ctrl+D (Windows/Linux)
 *
 * Philosophy: Form follows function. Every control serves a purpose.
 * Inspired by the clarity of Swiss design and Dieter Rams' interface principles.
 *
 * @version 1.0.0
 */

class StandardLab {
  constructor() {
    this.isOpen = false;
    this.panel = null;
    this.googleFontsLoaded = new Set();
    this.colorScheme = this.detectColorScheme();

    // Core tokens to expose (curated list)
    this.coreTokens = {
      typography: [
        "--font-text",
        "--font-header",
        "--font-interface",
        "--font-monospace",
        "--font-feature",
        "--font-variation",
        "--font-header-feature",
        "--font-header-variation",
        "--font-monospace-feature",
        "--font-monospace-variation",
        "--font-size",
        "--font-ratio",
        "--font-density",
        "--font-letter-spacing",
      ],
      layout: ["--line-width", "--rhythm-multiplier"],
      colorsLight: [
        "--color-light-background",
        "--color-light-foreground",
        "--color-light-red",
        "--color-light-orange",
        "--color-light-yellow",
        "--color-light-green",
        "--color-light-cyan",
        "--color-light-blue",
        "--color-light-purple",
        "--color-light-pink",
        "--color-light-accent",
      ],
      colorsDark: [
        "--color-dark-background",
        "--color-dark-foreground",
        "--color-dark-red",
        "--color-dark-orange",
        "--color-dark-yellow",
        "--color-dark-green",
        "--color-dark-cyan",
        "--color-dark-blue",
        "--color-dark-purple",
        "--color-dark-pink",
        "--color-dark-accent",
      ],
    };

    // Keyboard shortcut: Shift+Cmd+D (Mac) or Shift+Ctrl+D (Windows)
    this.shortcut = {
      shift: true,
      meta: navigator.platform.indexOf("Mac") > -1,
      ctrl: navigator.platform.indexOf("Mac") === -1,
      key: "d",
    };

    this.init();
  }

  init() {
    // Listen for keyboard shortcut
    document.addEventListener("keydown", (e) => {
      const matchesMac =
        this.shortcut.meta &&
        e.shiftKey &&
        e.metaKey &&
        e.key === this.shortcut.key;
      const matchesWin =
        this.shortcut.ctrl &&
        e.shiftKey &&
        e.ctrlKey &&
        e.key === this.shortcut.key;

      if (matchesMac || matchesWin) {
        e.preventDefault();
        this.toggle();
      }
    });

    // ESC to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    // Listen for color scheme changes
    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          this.colorScheme = e.matches ? "dark" : "light";
          // Refresh panel if open to show correct color palette
          if (this.isOpen) {
            this.refreshPanel();
          }
        });
    }
  }

  /**
   * Detect system color scheme
   */
  detectColorScheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  /**
   * Toggle panel visibility
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open debug panel
   */
  open() {
    if (this.panel) {
      this.panel.remove();
    }

    this.isOpen = true;
    this.createPanel();
    document.body.appendChild(this.panel);

    // Animate in
    requestAnimationFrame(() => {
      this.panel.style.opacity = "1";
      this.panel.style.transform = "translateX(0)";
    });
  }

  /**
   * Close debug panel
   */
  close() {
    if (!this.panel) return;

    this.isOpen = false;
    this.panel.style.opacity = "0";
    this.panel.style.transform = "translateX(100%)";

    setTimeout(() => {
      if (this.panel) {
        this.panel.remove();
        this.panel = null;
      }
    }, 200);
  }

  /**
   * Refresh panel without animation (for color scheme changes)
   */
  refreshPanel() {
    if (!this.panel) return;

    const content = this.panel.querySelector(".system-content");
    if (content) {
      // Update color scheme indicator
      this.updateColorSchemeIndicator();

      // Regenerate content with correct color palette
      content.innerHTML = `
        ${this.createSection("Typography", this.coreTokens.typography)}
        ${this.createSection("Layout & Rhythm", this.coreTokens.layout)}
        ${
          this.colorScheme === "light"
            ? this.createSection(
                "Colors (Light Mode)",
                this.coreTokens.colorsLight,
                true,
              )
            : this.createSection(
                "Colors (Dark Mode)",
                this.coreTokens.colorsDark,
                true,
              )
        }
      `;

      // Reattach input listeners
      this.attachInputListeners();
    }
  }

  /**
   * Create the debug panel UI
   */
  createPanel() {
    this.panel = document.createElement("div");
    this.panel.className = "standard-system-panel";

    // Only show the color palette for the current scheme
    const colorSection =
      this.colorScheme === "light"
        ? this.createSection(
            "Colors (Light Mode)",
            this.coreTokens.colorsLight,
            true,
          )
        : this.createSection(
            "Colors (Dark Mode)",
            this.coreTokens.colorsDark,
            true,
          );

    this.panel.innerHTML = `
      <div class="system-header">
        <div class="system-title-group">
          <h2>Standard System</h2>
          <span class="system-color-scheme" data-scheme="${this.colorScheme}">${this.colorScheme} mode</span>
        </div>
        <div class="system-actions">
          <button class="system-btn" data-action="toggle-debug" title="Toggle Debug Mode">
            <span class="system-indicator"></span>
            Debug
          </button>
          <button class="system-btn system-btn-primary" data-action="copy-all" title="Copy All as CSS">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy CSS
          </button>
          <button class="system-btn" data-action="reset" title="Reset All Values">Reset</button>
          <button class="system-btn system-close" data-action="close" title="Close (Esc)">×</button>
        </div>
      </div>
      <div class="system-content">
        ${this.createSection("Typography", this.coreTokens.typography)}
        ${this.createSection("Layout & Rhythm", this.coreTokens.layout)}
        ${colorSection}
      </div>
      <div class="system-footer">
        <span class="system-shortcut">Shift+${this.shortcut.meta ? "Cmd" : "Ctrl"}+D to toggle</span>
      </div>
    `;

    this.attachEventListeners();
    this.updateDebugIndicator();

    this.injectStyles();
  }

  /**
   * Get CSS custom property value with fallback
   */
  getPropertyValue(token) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(token)
      .trim();

    // If empty, try to get from inline styles
    if (!value) {
      return document.documentElement.style.getPropertyValue(token).trim();
    }

    return value;
  }

  /**
   * Create a token section
   */
  createSection(title, tokens, useColorPicker = false) {
    if (!tokens || tokens.length === 0) return "";

    const rows = tokens
      .map((token) => {
        let value = this.getPropertyValue(token);

        // If still empty, provide a helpful placeholder
        if (!value) {
          value = "";
        }

        const isColor =
          useColorPicker ||
          (token.includes("color") && this.isColorValue(value));
        const isFont =
          token.includes("font-") &&
          !token.includes("font-size") &&
          !token.includes("font-ratio") &&
          !token.includes("font-density") &&
          !token.includes("font-letter") &&
          !token.includes("font-feature") &&
          !token.includes("font-variation");

        return `
        <div class="system-row">
          <label class="system-label" title="${token}">
            <span class="system-token">${token.replace("--", "").replace("color-light-", "").replace("color-dark-", "")}</span>
          </label>
          <div class="system-input-group">
            ${isColor ? this.createColorInput(token, value) : this.createTextInput(token, value, isFont)}
          </div>
        </div>
      `;
      })
      .join("");

    return `
      <details class="system-section" open>
        <summary class="system-section-title">${title}</summary>
        <div class="system-section-content">
          ${rows}
        </div>
      </details>
    `;
  }

  /**
   * Create color input with picker
   */
  createColorInput(token, value) {
    const hexColor = this.extractHexColor(value);
    return `
      <div class="system-color-input">
        <input
          type="color"
          class="system-input-color"
          data-token="${token}"
          value="${hexColor}"
          title="Pick color"
        >
        <input
          type="text"
          class="system-input-text"
          data-token="${token}"
          value="${value}"
          placeholder="${value || "Enter color value"}"
        >
      </div>
    `;
  }

  /**
   * Create text input
   */
  createTextInput(token, value, isFont = false) {
    return `
      <input
        type="text"
        class="system-input-text ${isFont ? "system-input-font" : ""}"
        data-token="${token}"
        data-is-font="${isFont}"
        value="${value}"
        placeholder="${value || "Enter value"}"
      >
    `;
  }

  /**
   * Check if value is a color (improved detection)
   */
  isColorValue(value) {
    if (!value) return false;

    return (
      value.startsWith("#") ||
      value.startsWith("rgb") ||
      value.startsWith("hsl") ||
      value.includes("color-mix") ||
      // Named colors - more specific list
      [
        "white",
        "black",
        "red",
        "green",
        "blue",
        "yellow",
        "orange",
        "purple",
        "pink",
        "cyan",
        "transparent",
      ].includes(value.toLowerCase())
    );
  }

  /**
   * Extract hex color from complex CSS values
   */
  extractHexColor(value) {
    if (!value) return "#000000";

    // Try to extract hex
    const hexMatch = value.match(/#[0-9a-f]{6}/i);
    if (hexMatch) return hexMatch[0];

    // Try to convert rgb
    const rgbMatch = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch;
      return (
        "#" +
        [r, g, b].map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")
      );
    }

    // Common color names to hex
    const colorMap = {
      white: "#ffffff",
      black: "#000000",
      red: "#ff0000",
      green: "#00ff00",
      blue: "#0000ff",
      yellow: "#ffff00",
      orange: "#ffa500",
      purple: "#800080",
      pink: "#ffc0cb",
      cyan: "#00ffff",
    };

    return colorMap[value.toLowerCase()] || "#000000";
  }

  /**
   * Load Google Font
   */
  loadGoogleFont(fontName) {
    // Clean font name (remove fallbacks, quotes, etc)
    const cleanName = fontName.split(",")[0].trim().replace(/['"]/g, "");

    // Skip system fonts
    const systemFonts = [
      "system-ui",
      "sans-serif",
      "serif",
      "monospace",
      "-apple-system",
      "BlinkMacSystemFont",
    ];
    if (systemFonts.includes(cleanName)) return;

    // Skip if already loaded
    if (this.googleFontsLoaded.has(cleanName)) return;

    // Load font from Google Fonts
    const fontUrl = `https://fonts.googleapis.com/css2?family=${cleanName.replace(/ /g, "+")}:wght@300;400;500;600;700;900&display=swap`;

    // Check if link already exists
    if (
      !document.querySelector(`link[href*="${cleanName.replace(/ /g, "+")}"]`)
    ) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fontUrl;
      document.head.appendChild(link);

      this.googleFontsLoaded.add(cleanName);

      // Show feedback
      this.showNotification(`Loading ${cleanName} from Google Fonts...`);
    }
  }

  /**
   * Generate CSS for all customized tokens
   */
  generateCSS() {
    const allTokens = [
      ...this.coreTokens.typography,
      ...this.coreTokens.layout,
      ...this.coreTokens.colorsLight,
      ...this.coreTokens.colorsDark,
    ];

    const cssLines = allTokens.map((token) => {
      const value = this.getPropertyValue(token);
      return `  ${token}: ${value};`;
    });

    return `:root {\n${cssLines.join("\n")}\n}`;
  }

  /**
   * Copy all CSS to clipboard
   */
  copyAllCSS() {
    const css = this.generateCSS();

    navigator.clipboard
      .writeText(css)
      .then(() => {
        this.showNotification("✓ CSS copied to clipboard!", "success");
      })
      .catch(() => {
        // Fallback method
        const textarea = document.createElement("textarea");
        textarea.value = css;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        this.showNotification("✓ CSS copied to clipboard!", "success");
      });
  }

  /**
   * Show notification
   */
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `system-notification system-notification-${type}`;
    notification.textContent = message;

    this.panel.appendChild(notification);

    requestAnimationFrame(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-10px)";
      setTimeout(() => notification.remove(), 200);
    }, 2500);
  }

  /**
   * Update color scheme indicator
   */
  updateColorSchemeIndicator() {
    const indicator = this.panel?.querySelector(".system-color-scheme");
    if (indicator) {
      this.colorScheme = this.detectColorScheme();
      indicator.textContent = `${this.colorScheme} mode`;
      indicator.dataset.scheme = this.colorScheme;
    }
  }

  /**
   * Attach all event listeners
   */
  attachEventListeners() {
    // Action buttons - STOP PROPAGATION to prevent closing panel
    this.panel.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = e.currentTarget.dataset.action;

        if (action === "close") {
          this.close();
        } else if (action === "toggle-debug") {
          document.body.classList.toggle("standard-debug");
          this.updateDebugIndicator();
        } else if (action === "reset") {
          this.resetAllTokens();
        } else if (action === "copy-all") {
          this.copyAllCSS();
        }
      });
    });

    // Attach input listeners
    this.attachInputListeners();

    // Prevent panel from closing when clicking inside
    this.panel.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close when clicking outside - but use capture phase to prevent conflicts
    this.closeOnOutsideClick = (e) => {
      if (this.isOpen && this.panel && !this.panel.contains(e.target)) {
        this.close();
      }
    };

    // Use capture phase and add slight delay to ensure panel is fully rendered
    setTimeout(() => {
      document.addEventListener("click", this.closeOnOutsideClick, true);
    }, 100);
  }

  /**
   * Attach input listeners (separated for refresh functionality)
   */
  attachInputListeners() {
    // Text inputs - live update
    this.panel.querySelectorAll(".system-input-text").forEach((input) => {
      input.addEventListener("input", (e) => {
        const token = e.target.dataset.token;
        const value = e.target.value;
        const isFont = e.target.dataset.isFont === "true";

        document.documentElement.style.setProperty(token, value);

        // Load Google Font if it's a font property
        if (isFont) {
          this.loadGoogleFont(value);
        }
      });
    });

    // Color inputs - live update
    this.panel.querySelectorAll(".system-input-color").forEach((input) => {
      input.addEventListener("input", (e) => {
        const token = e.target.dataset.token;
        const color = e.target.value;
        document.documentElement.style.setProperty(token, color);

        // Update text input
        const textInput = this.panel.querySelector(
          `.system-input-text[data-token="${token}"]`,
        );
        if (textInput) {
          textInput.value = color;
        }
      });
    });
  }

  /**
   * Update debug mode indicator
   */
  updateDebugIndicator() {
    const indicator = this.panel?.querySelector(".system-indicator");
    if (indicator) {
      indicator.classList.toggle(
        "active",
        document.body.classList.contains("standard-debug"),
      );
    }
  }

  /**
   * Reset all tokens to default
   */
  resetAllTokens() {
    if (!confirm("Reset all values to defaults?")) return;

    // Remove all inline styles from :root
    document.documentElement.removeAttribute("style");

    // Clear loaded fonts tracking
    this.googleFontsLoaded.clear();

    // Refresh panel
    this.close();
    setTimeout(() => this.open(), 100);
  }

  /**
   * Inject panel styles
   */
  injectStyles() {
    if (document.getElementById("standard-system-styles")) return;

    const styles = document.createElement("style");
    styles.id = "standard-system-styles";
    styles.textContent = `
      .standard-system-panel {
        position: fixed;
        top: 0;
        right: 0;
        width: min(480px, 90vw);
        height: 100vh;
        background: var(--color-background);
        border-left: 2px solid var(--color-accent);
        box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
        z-index: 99999;
        display: flex;
        flex-direction: column;
        font-family: var(--font-interface, system-ui);
        font-size: var(--scale-s, 0.875rem);
        opacity: 0;
        transform: translateX(100%);
        transition: opacity 0.2s ease, transform 0.2s ease;
      }

      .system-header {
        padding: var(--space, 1rem);
        border-bottom: 1px solid var(--color-border);
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-shrink: 0;
        gap: var(--space-s, 0.75rem);
        flex-wrap: wrap;
      }

      .system-title-group {
        display: flex;
        flex-direction: column;
        gap: var(--space-2xs, 0.25rem);
      }

      .system-header h2 {
        margin: 0;
        font-size: var(--scale, 1rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        line-height: 1.2;
      }

      .system-color-scheme {
        font-size: var(--scale-s);
        color: var(--color-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: var(--space-2xs, 0.25rem);
      }

      .system-color-scheme::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-subtle);
      }

      .system-color-scheme[data-scheme="dark"]::before {
        background: var(--color-blue);
        box-shadow: 0 0 8px var(--color-blue);
      }

      .system-color-scheme[data-scheme="light"]::before {
        background: var(--color-yellow);
        box-shadow: 0 0 8px var(--color-yellow);
      }

      .system-actions {
        display: flex;
        gap: var(--space-xs, 0.5rem);
        flex-wrap: wrap;
      }

      .system-btn {
        padding: var(--space-xs, 0.5rem) var(--space-s, 0.75rem);
        background: var(--color-background-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius, 4px);
        font-size: var(--scale-s);
        cursor: pointer;
        transition: all 0.15s ease;
        font-family: inherit;
        color: var(--color-foreground);
        display: flex;
        align-items: center;
        gap: var(--space-2xs, 0.25rem);
        white-space: nowrap;
      }

      .system-btn:hover {
        background: var(--color-hover);
        border-color: var(--color-accent);
      }

      .system-btn-primary {
        background: var(--color-accent);
        color: var(--color-background);
        border-color: var(--color-accent);
        font-weight: 600;
      }

      .system-btn-primary:hover {
        opacity: 0.9;
      }

      .system-close {
        font-size: 1.5rem;
        line-height: 1;
        padding: var(--space-xs, 0.5rem);
        aspect-ratio: 1;
      }

      .system-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-subtle);
        transition: background 0.2s ease;
      }

      .system-indicator.active {
        background: var(--color-accent);
        box-shadow: 0 0 8px var(--color-accent);
      }

      .system-content {
        flex: 1;
        overflow-y: auto;
        padding: var(--space, 1rem);
      }

      .system-section {
        margin-bottom: var(--space, 1rem);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius, 4px);
        background: var(--color-background-secondary);
      }

      .system-section-title {
        padding: var(--space-s, 0.75rem);
        font-weight: 600;
        cursor: pointer;
        user-select: none;
        text-transform: uppercase;
        font-size: var(--scale-s);
        letter-spacing: 0.05em;
        border-bottom: 1px solid var(--color-border);
        list-style: none;
      }

      .system-section-title::before {
        content: '▸';
        display: inline-block;
        margin-right: var(--space-xs, 0.5rem);
        transition: transform 0.2s ease;
      }

      .system-section[open] .system-section-title::before {
        transform: rotate(90deg);
      }

      .system-section-content {
        padding: var(--space-s, 0.75rem);
      }

      .system-row {
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: var(--space-s, 0.75rem);
        align-items: center;
        margin-bottom: var(--space-s, 0.75rem);
        padding-bottom: var(--space-s, 0.75rem);
        border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
      }

      .system-row:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .system-label {
        margin: 0;
        font-size: var(--scale-s);
        color: var(--color-muted);
      }

      .system-token {
        font-family: var(--font-monospace, monospace);
        font-size: var(--scale-s);
        display: block;
      }

      .system-input-group {
        display: flex;
        gap: var(--space-2xs, 0.25rem);
        align-items: center;
        width: 100%;
      }

      .system-input-text {
        padding: var(--space-xs, 0.5rem);
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius, 4px);
        font-size: var(--scale-s);
        font-family: var(--font-monospace, monospace);
        color: var(--color-foreground);
        flex: 1;
        min-width: 0;
        transition: border-color 0.15s ease;
      }

      .system-input-text:focus {
        outline: none;
        border-color: var(--color-accent);
        background: color-mix(in srgb, var(--color-accent) 5%, var(--color-background));
      }

      .system-input-font {
        font-family: inherit;
      }

      .system-color-input {
        display: flex;
        gap: var(--space-2xs, 0.25rem);
        align-items: center;
        flex: 1;
      }

      .system-input-color {
        width: 36px;
        height: 32px;
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius, 4px);
        cursor: pointer;
        padding: 2px;
        background: var(--color-background);
        flex-shrink: 0;
      }

      .system-input-color::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      .system-input-color::-webkit-color-swatch {
        border: none;
        border-radius: calc(var(--border-radius, 4px) - 2px);
      }

      .system-input-color::-moz-color-swatch {
        border: none;
        border-radius: calc(var(--border-radius, 4px) - 2px);
      }

      .system-footer {
        padding: var(--space-s, 0.75rem) var(--space, 1rem);
        border-top: 1px solid var(--color-border);
        font-size: var(--scale-s);
        color: var(--color-subtle);
        text-align: center;
        flex-shrink: 0;
      }

      .system-shortcut {
        font-family: var(--font-monospace, monospace);
      }

      .system-notification {
        position: fixed;
        top: var(--space, 1rem);
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius, 4px);
        padding: var(--space-s, 0.75rem) var(--space, 1rem);
        box-shadow: var(--shadow, 0 2px 8px rgba(0,0,0,0.1));
        z-index: 100000;
        font-size: var(--scale-s);
        opacity: 0;
        transition: opacity 0.2s ease, transform 0.2s ease;
        pointer-events: none;
      }

      .system-notification-success {
        background: var(--color-success);
        color: white;
        border-color: var(--color-success);
      }

      /* Scrollbar styling */
      .system-content::-webkit-scrollbar {
        width: 8px;
      }

      .system-content::-webkit-scrollbar-track {
        background: var(--color-background-secondary);
      }

      .system-content::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: 4px;
      }

      .system-content::-webkit-scrollbar-thumb:hover {
        background: var(--color-muted);
      }

      /* Dark mode optimizations */
      @media (prefers-color-scheme: dark) {
        .standard-system-panel {
          box-shadow: -4px 0 32px rgba(0, 0, 0, 0.5);
        }
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .standard-system-panel {
          width: 100vw;
        }

        .system-row {
          grid-template-columns: 1fr;
          gap: var(--space-2xs, 0.25rem);
        }

        .system-header {
          flex-direction: column;
          align-items: stretch;
        }

        .system-actions {
          width: 100%;
          justify-content: space-between;
        }
      }
    `;

    document.head.appendChild(styles);
  }
}

// Auto-initialize when DOM is ready
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.StandardLab = new StandardLab();
    });
  } else {
    window.StandardLab = new StandardLab();
  }
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = { StandardLab };
}
