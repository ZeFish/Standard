/**
 * Standard System Debug & Playground Tool
 *
 * A minimalist debug interface for the Standard Framework
 * Opens with Shift+Cmd+. (Mac) or Shift+Ctrl+. (Windows/Linux)
 *
 * Philosophy: Form follows function. Every control serves a purpose.
 * Inspired by the clarity of Swiss design and Dieter Rams' interface principles.
 *
 * @version 1.0.0
 */

class StandardSystem {
  constructor() {
    this.isOpen = false;
    this.panel = null;
    this.tokens = {};

    // Keyboard shortcut: Shift+Cmd+. (Mac) or Shift+Ctrl+. (Windows)
    this.shortcut = {
      shift: true,
      meta: navigator.platform.indexOf("Mac") > -1, // Cmd on Mac
      ctrl: navigator.platform.indexOf("Mac") === -1, // Ctrl on Windows/Linux
      key: ".",
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

    // Scan tokens on load
    this.scanTokens();
  }

  /**
   * Scan all CSS custom properties from :root
   */
  scanTokens() {
    const rootStyles = getComputedStyle(document.documentElement);
    const allProps = Array.from(document.styleSheets)
      .flatMap((sheet) => {
        try {
          return Array.from(sheet.cssRules);
        } catch (e) {
          return [];
        }
      })
      .filter((rule) => rule.selectorText === ":root")
      .flatMap((rule) => Array.from(rule.style))
      .filter((prop) => prop.startsWith("--"));

    // Organize tokens by category
    this.tokens = {
      rhythm: allProps.filter(
        (p) =>
          p.includes("space") ||
          p.includes("rhythm") ||
          p.includes("gap") ||
          p.includes("body-padding"),
      ),
      typography: allProps.filter(
        (p) =>
          p.includes("font") ||
          p.includes("scale") ||
          p.includes("line") ||
          p.includes("letter") ||
          p.includes("density") ||
          p.includes("ratio"),
      ),
      colors: allProps.filter((p) => p.includes("color")),
      grid: allProps.filter(
        (p) =>
          p.includes("grid") ||
          p.includes("container") ||
          p.includes("content") ||
          p.includes("line-width"),
      ),
      other: allProps.filter(
        (p) =>
          !p.includes("space") &&
          !p.includes("rhythm") &&
          !p.includes("font") &&
          !p.includes("scale") &&
          !p.includes("color") &&
          !p.includes("grid") &&
          !p.includes("gap") &&
          !p.includes("container") &&
          !p.includes("line") &&
          !p.includes("density") &&
          !p.includes("ratio"),
      ),
    };
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
   * Create the debug panel UI
   */
  createPanel() {
    this.panel = document.createElement("div");
    this.panel.className = "standard-debug-panel";
    this.panel.innerHTML = `
      <div class="debug-header">
        <h2>Standard System</h2>
        <div class="debug-actions">
          <button class="debug-btn" data-action="toggle-debug" title="Toggle Debug Mode">
            <span class="debug-indicator"></span>
            Debug
          </button>
          <button class="debug-btn" data-action="reset" title="Reset All Values">Reset</button>
          <button class="debug-btn debug-close" data-action="close" title="Close (Esc)">×</button>
        </div>
      </div>
      <div class="debug-content">
        ${this.createSection("Rhythm & Spacing", this.tokens.rhythm)}
        ${this.createSection("Typography", this.tokens.typography)}
        ${this.createSection("Colors", this.tokens.colors, true)}
        ${this.createSection("Grid & Layout", this.tokens.grid)}
        ${this.createSection("Other", this.tokens.other)}
      </div>
      <div class="debug-footer">
        <span class="debug-shortcut">Shift+${this.shortcut.meta ? "Cmd" : "Ctrl"}+. to toggle</span>
      </div>
    `;

    this.attachEventListeners();
    this.updateDebugIndicator();

    this.injectStyles();
  }

  /**
   * Create a token section
   */
  createSection(title, tokens, useColorPicker = false) {
    if (!tokens || tokens.length === 0) return "";

    const rows = tokens
      .map((token) => {
        const value = getComputedStyle(document.documentElement)
          .getPropertyValue(token)
          .trim();
        const isColor = useColorPicker || this.isColorValue(value);

        return `
        <div class="debug-row">
          <label class="debug-label" title="${token}">
            <span class="debug-token">${token.replace("--", "")}</span>
          </label>
          <div class="debug-input-group">
            ${isColor ? this.createColorInput(token, value) : this.createTextInput(token, value)}
            <button class="debug-copy" data-token="${token}" title="Copy value">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
      })
      .join("");

    return `
      <details class="debug-section" open>
        <summary class="debug-section-title">${title}</summary>
        <div class="debug-section-content">
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
      <div class="debug-color-input">
        <input
          type="color"
          class="debug-input-color"
          data-token="${token}"
          value="${hexColor}"
          title="Pick color"
        >
        <input
          type="text"
          class="debug-input-text"
          data-token="${token}"
          value="${value}"
          placeholder="${value}"
        >
      </div>
    `;
  }

  /**
   * Create text input
   */
  createTextInput(token, value) {
    return `
      <input
        type="text"
        class="debug-input-text"
        data-token="${token}"
        value="${value}"
        placeholder="${value}"
      >
    `;
  }

  /**
   * Check if value is a color
   */
  isColorValue(value) {
    return (
      value.startsWith("#") ||
      value.startsWith("rgb") ||
      value.startsWith("hsl") ||
      value.includes("color-mix") ||
      /^[a-z]+$/i.test(value)
    ); // Named colors
  }

  /**
   * Extract hex color from complex CSS values
   */
  extractHexColor(value) {
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

    // Default fallback
    return "#000000";
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Action buttons
    this.panel.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const action = e.currentTarget.dataset.action;

        if (action === "close") {
          this.close();
        } else if (action === "toggle-debug") {
          document.body.classList.toggle("standard-debug");
          this.updateDebugIndicator();
        } else if (action === "reset") {
          this.resetAllTokens();
        }
      });
    });

    // Text inputs - live update
    this.panel.querySelectorAll(".debug-input-text").forEach((input) => {
      input.addEventListener("input", (e) => {
        const token = e.target.dataset.token;
        const value = e.target.value;
        document.documentElement.style.setProperty(token, value);
      });
    });

    // Color inputs - live update
    this.panel.querySelectorAll(".debug-input-color").forEach((input) => {
      input.addEventListener("input", (e) => {
        const token = e.target.dataset.token;
        const color = e.target.value;
        document.documentElement.style.setProperty(token, color);

        // Update text input
        const textInput = this.panel.querySelector(
          `.debug-input-text[data-token="${token}"]`,
        );
        if (textInput) {
          textInput.value = color;
        }
      });
    });

    // Copy buttons
    this.panel.querySelectorAll(".debug-copy").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const token = e.currentTarget.dataset.token;
        const value = getComputedStyle(document.documentElement)
          .getPropertyValue(token)
          .trim();
        const copyText = `${token}: ${value};`;

        navigator.clipboard.writeText(copyText).then(() => {
          this.showCopyFeedback(e.currentTarget);
        });
      });
    });

    // Prevent panel from closing when clicking inside
    this.panel.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close when clicking backdrop
    document.addEventListener("click", (e) => {
      if (this.isOpen && !this.panel.contains(e.target)) {
        this.close();
      }
    });
  }

  /**
   * Update debug mode indicator
   */
  updateDebugIndicator() {
    const indicator = this.panel?.querySelector(".debug-indicator");
    if (indicator) {
      indicator.classList.toggle(
        "active",
        document.body.classList.contains("standard-debug"),
      );
    }
  }

  /**
   * Show copy feedback
   */
  showCopyFeedback(button) {
    const original = button.innerHTML;
    button.innerHTML = "✓";
    button.style.color = "var(--color-success)";

    setTimeout(() => {
      button.innerHTML = original;
      button.style.color = "";
    }, 1000);
  }

  /**
   * Reset all tokens to default
   */
  resetAllTokens() {
    if (!confirm("Reset all values to defaults?")) return;

    // Remove all inline styles from :root
    document.documentElement.removeAttribute("style");

    // Refresh panel
    this.close();
    setTimeout(() => this.open(), 100);
  }

  /**
   * Inject panel styles
   */
  injectStyles() {
    if (document.getElementById("standard-debug-styles")) return;

    const styles = document.createElement("style");
    styles.id = "standard-debug-styles";
    styles.textContent = `
      .standard-debug-panel {
        position: fixed;
        top: 0;
        right: 0;
        width: min(420px, 90vw);
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

      .debug-header {
        padding: var(--space, 1rem);
        border-bottom: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }

      .debug-header h2 {
        margin: 0;
        font-size: var(--scale, 1rem);
        font-weight: 600;
        letter-spacing: -0.02em;
      }

      .debug-actions {
        display: flex;
        gap: var(--space-xs, 0.5rem);
      }

      .debug-btn {
        padding: var(--space-xs, 0.5rem) var(--space-s, 0.75rem);
        background: var(--color-background-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius, 4px);
        font-size: var(--scale-xs, 0.8rem);
        cursor: pointer;
        transition: all 0.15s ease;
        font-family: inherit;
        color: var(--color-foreground);
        display: flex;
        align-items: center;
        gap: var(--space-2xs, 0.25rem);
      }

      .debug-btn:hover {
        background: var(--color-hover);
        border-color: var(--color-accent);
      }

      .debug-close {
        font-size: 1.5rem;
        line-height: 1;
        padding: var(--space-xs, 0.5rem);
        aspect-ratio: 1;
      }

      .debug-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-subtle);
        transition: background 0.2s ease;
      }

      .debug-indicator.active {
        background: var(--color-accent);
        box-shadow: 0 0 8px var(--color-accent);
      }

      .debug-content {
        flex: 1;
        overflow-y: auto;
        padding: var(--space, 1rem);
      }

      .debug-section {
        margin-bottom: var(--space, 1rem);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius, 4px);
        background: var(--color-background-secondary);
      }

      .debug-section-title {
        padding: var(--space-s, 0.75rem);
        font-weight: 600;
        cursor: pointer;
        user-select: none;
        text-transform: uppercase;
        font-size: var(--scale-xs, 0.8rem);
        letter-spacing: 0.05em;
        border-bottom: 1px solid var(--color-border);
        list-style: none;
      }

      .debug-section-title::before {
        content: '▸';
        display: inline-block;
        margin-right: var(--space-xs, 0.5rem);
        transition: transform 0.2s ease;
      }

      .debug-section[open] .debug-section-title::before {
        transform: rotate(90deg);
      }

      .debug-section-content {
        padding: var(--space-s, 0.75rem);
      }

      .debug-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--space-xs, 0.5rem);
        align-items: center;
        margin-bottom: var(--space-xs, 0.5rem);
        padding-bottom: var(--space-xs, 0.5rem);
        border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
      }

      .debug-row:last-child {
        margin-bottom: 0;
        border-bottom: none;
      }

      .debug-label {
        margin: 0;
        font-size: var(--scale-xs, 0.8rem);
        color: var(--color-muted);
      }

      .debug-token {
        font-family: var(--font-monospace, monospace);
        font-size: 0.85em;
      }

      .debug-input-group {
        display: flex;
        gap: var(--space-2xs, 0.25rem);
        align-items: center;
      }

      .debug-input-text {
        padding: var(--space-2xs, 0.25rem) var(--space-xs, 0.5rem);
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius, 4px);
        font-size: var(--scale-xs, 0.8rem);
        font-family: var(--font-monospace, monospace);
        color: var(--color-foreground);
        min-width: 120px;
        transition: border-color 0.15s ease;
      }

      .debug-input-text:focus {
        outline: none;
        border-color: var(--color-accent);
        background: color-mix(in srgb, var(--color-accent) 5%, var(--color-background));
      }

      .debug-color-input {
        display: flex;
        gap: var(--space-2xs, 0.25rem);
        align-items: center;
      }

      .debug-input-color {
        width: 32px;
        height: 28px;
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius, 4px);
        cursor: pointer;
        padding: 2px;
        background: var(--color-background);
      }

      .debug-input-color::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      .debug-input-color::-webkit-color-swatch {
        border: none;
        border-radius: calc(var(--border-radius, 4px) - 2px);
      }

      .debug-copy {
        padding: var(--space-2xs, 0.25rem);
        background: var(--color-background-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius, 4px);
        cursor: pointer;
        transition: all 0.15s ease;
        color: var(--color-muted);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .debug-copy:hover {
        background: var(--color-hover);
        border-color: var(--color-accent);
        color: var(--color-foreground);
      }

      .debug-footer {
        padding: var(--space-s, 0.75rem) var(--space, 1rem);
        border-top: 1px solid var(--color-border);
        font-size: var(--scale-xs, 0.8rem);
        color: var(--color-subtle);
        text-align: center;
        flex-shrink: 0;
      }

      .debug-shortcut {
        font-family: var(--font-monospace, monospace);
      }

      /* Scrollbar styling */
      .debug-content::-webkit-scrollbar {
        width: 8px;
      }

      .debug-content::-webkit-scrollbar-track {
        background: var(--color-background-secondary);
      }

      .debug-content::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: 4px;
      }

      .debug-content::-webkit-scrollbar-thumb:hover {
        background: var(--color-muted);
      }

      /* Dark mode optimizations */
      @media (prefers-color-scheme: dark) {
        .standard-debug-panel {
          box-shadow: -4px 0 32px rgba(0, 0, 0, 0.5);
        }
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .standard-debug-panel {
          width: 100vw;
        }

        .debug-row {
          grid-template-columns: 1fr;
          gap: var(--space-2xs, 0.25rem);
        }

        .debug-input-group {
          width: 100%;
        }

        .debug-input-text {
          flex: 1;
          min-width: 0;
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
      window.StandardSystem = new StandardSystem();
    });
  } else {
    window.StandardSystem = new StandardSystem();
  }
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = { StandardSystem };
}
