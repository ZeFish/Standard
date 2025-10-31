/**!
 * Standard System Inspector - Minimal Debug Interface
 *
 * A minimalist debug interface for the Standard Framework
 * Philosophy: Felt, not seen. Present when needed, invisible when not.
 *
 * Opens with Shift+Cmd+D (Mac) or Shift+Ctrl+D (Windows/Linux)
 * Debug mode: Shift+Cmd+S / Shift+Ctrl+S
 *
 * @version @VERSION_PLACEHOLDER@
 */

class StandardLab {
  constructor() {
    this.state = "dormant"; // dormant, quick, full
    this.badge = null;
    this.panel = null;
    this.currentTab = "typography";
    this.googleFontsLoaded = new Set();
    this.colorScheme = this.detectColorScheme();
    this.modifiedTokens = new Set();
    this.position = this.loadPosition();
    this.version = document.documentElement.dataset.standardVersion;

    // Core tokens organized by category
    this.coreTokens = {
      typography: [
        "--font-text",
        "--font-header",
        "--font-monospace",
        "--font-size",
        "--font-ratio",
        "--font-density",
      ],
      layout: ["--line-width", "--rhythm-multiplier", "--space"],
      colors: this.getColorTokens(),
    };

    // Store defaults for reset functionality
    this.defaults = {};

    this.init();
  }

  init() {
    // Store default values
    this.storeDefaults();

    // Create badge (always present)
    this.createBadge();

    // Keyboard shortcuts
    this.initKeyboardShortcuts();

    // Listen for color scheme changes
    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          this.colorScheme = e.matches ? "dark" : "light";
          if (this.state === "full") {
            this.refreshTokenList();
          }
        });
    }

    // Track modifications
    this.initModificationTracking();
  }

  /**
   * Store default CSS property values
   */
  storeDefaults() {
    const allTokens = [
      ...this.coreTokens.typography,
      ...this.coreTokens.layout,
      ...this.coreTokens.colors,
    ];

    allTokens.forEach((token) => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(token)
        .trim();
      if (value) {
        this.defaults[token] = value;
      }
    });
  }

  /**
   * Get color tokens based on current color scheme
   */
  getColorTokens() {
    const scheme = this.colorScheme === "light" ? "light" : "dark";
    return [
      `--color-${scheme}-background`,
      `--color-${scheme}-foreground`,
      `--color-${scheme}-accent`,
      `--color-${scheme}-red`,
      `--color-${scheme}-orange`,
      `--color-${scheme}-yellow`,
      `--color-${scheme}-green`,
      `--color-${scheme}-cyan`,
      `--color-${scheme}-blue`,
      `--color-${scheme}-purple`,
      `--color-${scheme}-pink`,
    ];
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
   * Load saved position from localStorage
   */
  loadPosition() {
    const saved = localStorage.getItem("standard-lab-position");
    if (saved) {
      return JSON.parse(saved);
    }
    return { bottom: 16, right: 16 }; // Default position
  }

  /**
   * Save position to localStorage
   */
  savePosition() {
    localStorage.setItem(
      "standard-lab-position",
      JSON.stringify(this.position),
    );
  }

  /**
   * Create floating badge (dormant state)
   */
  createBadge() {
    if (this.badge) return;

    this.badge = document.createElement("button");
    this.badge.className = "standard-lab-badge";
    this.badge.setAttribute("aria-label", "Open Standard Inspector");
    this.badge.setAttribute("title", "Standard Inspector (Shift+Cmd+D)");

    // Position badge
    this.badge.style.bottom = `${this.position.bottom}px`;
    this.badge.style.right = `${this.position.right}px`;

    // SVG icon (Standard "S" logo)
    this.badge.innerHTML = `
      <svg width="24" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7v10c0 5.5 10 9 10 9s10-3.5 10-9V7l-10-5z"/>
        <path d="M12 8v8"/>
      </svg>
    `;

    // Click to open quick panel
    this.badge.addEventListener("click", () => this.openQuick());

    // Make draggable
    this.makeDraggable(this.badge);

    document.body.appendChild(this.badge);
    this.updateBadge();
    this.injectStyles();
  }

  /**
   * Update badge with modification count
   */
  updateBadge() {
    if (!this.badge) return;

    const count = this.modifiedTokens.size;
    if (count > 0) {
      this.badge.setAttribute("data-modified", count);
    } else {
      this.badge.removeAttribute("data-modified");
    }
  }

  /**
   * Make element draggable
   */
  makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialBottom, initialRight;

    const onMouseDown = (e) => {
      // Only drag on the element itself, not its children
      if (
        e.target !== element &&
        !element.classList.contains("standard-lab-panel-header")
      )
        return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = element.getBoundingClientRect();
      initialBottom = window.innerHeight - rect.bottom;
      initialRight = window.innerWidth - rect.right;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      element.style.cursor = "grabbing";
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;

      const deltaX = startX - e.clientX;
      const deltaY = e.clientY - startY;

      this.position.right = Math.max(0, initialRight + deltaX);
      this.position.bottom = Math.max(0, initialBottom - deltaY);

      element.style.right = `${this.position.right}px`;
      element.style.bottom = `${this.position.bottom}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      element.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      this.savePosition();
    };

    element.addEventListener("mousedown", onMouseDown);
  }

  /**
   * Open quick panel
   */
  openQuick() {
    if (this.state === "quick") {
      this.close();
      return;
    }

    this.state = "quick";
    this.createQuickPanel();
  }

  /**
   * Open full editor
   */
  openFull() {
    this.state = "full";
    this.createFullPanel();
  }

  /**
   * Close panel
   */
  close() {
    if (this.panel) {
      this.panel.style.opacity = "0";
      this.panel.style.transform = "translateY(10px)";
      setTimeout(() => {
        if (this.panel) {
          this.panel.remove();
          this.panel = null;
        }
      }, 200);
    }
    this.state = "dormant";
  }

  /**
   * Create quick panel (toggles and essentials)
   */
  createQuickPanel() {
    if (this.panel) this.panel.remove();

    this.panel = document.createElement("div");
    this.panel.className = "standard-lab-panel standard-lab-panel-quick";

    // Position relative to badge
    this.panel.style.bottom = `${this.position.bottom + 60}px`;
    this.panel.style.right = `${this.position.right}px`;

    const debugActive = document.body.classList.contains("standard-debug");
    const modifiedCount = this.modifiedTokens.size;

    this.panel.innerHTML = `
      <header class="standard-lab-panel-header">
        <h2>Inspector v${this.version}</h2>
        <button class="standard-lab-btn-icon" data-action="close" title="Close (Esc)">×</button>
      </header>

      <section class="standard-lab-section">
        <label class="standard-lab-toggle">
          <input type="checkbox" ${debugActive ? "checked" : ""} data-toggle="debug">
          <span>Debug Mode</span>
          <kbd>⇧⌘D</kbd>
        </label>
      </section>

      <section class="standard-lab-section">
        <label class="standard-lab-label">Theme</label>
        <select class="standard-lab-select" data-action="theme">
          ${this.getThemeOptions()}
        </select>
      </section>

      <footer class="standard-lab-actions">
        <button class="standard-lab-btn" data-action="edit-tokens">
          ${modifiedCount > 0 ? `Edit Tokens (${modifiedCount})` : "Edit Tokens"}
        </button>
        ${
          modifiedCount > 0
            ? `
          <button class="standard-lab-btn standard-lab-btn-secondary" data-action="reset">
            Reset
          </button>
        `
            : ""
        }
        <button class="standard-lab-btn standard-lab-btn-secondary" data-action="copy">
          Copy CSS
        </button>
      </footer>
    `;

    this.attachQuickPanelListeners();
    document.body.appendChild(this.panel);

    // Animate in
    requestAnimationFrame(() => {
      this.panel.style.opacity = "1";
      this.panel.style.transform = "translateY(0)";
    });
  }

  /**
   * Get theme options HTML
   */
  getThemeOptions() {
    const themes = [
      { value: "", label: "Default" },
      { value: "paper", label: "Paper" },
      { value: "swiss", label: "Swiss" },
      { value: "kernel", label: "Kernel" },
      { value: "forest", label: "Forest" },
      { value: "book", label: "Book" },
      { value: "minimal", label: "Minimal" },
    ];

    const current = document.documentElement.getAttribute("data-theme") || "";

    return themes
      .map(
        (theme) =>
          `<option value="${theme.value}" ${current === theme.value ? "selected" : ""}>
        ${theme.label}
      </option>`,
      )
      .join("");
  }

  /**
   * Attach event listeners to quick panel
   */
  attachQuickPanelListeners() {
    // Close button
    this.panel
      .querySelector('[data-action="close"]')
      ?.addEventListener("click", () => this.close());

    // Debug toggle
    this.panel
      .querySelector('[data-toggle="debug"]')
      ?.addEventListener("change", (e) => {
        document.body.classList.toggle("standard-debug", e.target.checked);
        //toast.info(
        toast.info(
          `Debug mode ${e.target.checked ? "enabled" : "disabled"}`,
          e.target.checked ? "success" : "info",
        );
      });

    // Theme selector
    this.panel
      .querySelector('[data-action="theme"]')
      ?.addEventListener("change", (e) => {
        const theme = e.target.value;
        if (theme) {
          document.documentElement.setAttribute("data-theme", theme);
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
        localStorage.setItem("standard-theme", theme);
        toast.info(`Theme: ${theme || "Default"}`, "success");
      });

    // Edit tokens button
    this.panel
      .querySelector('[data-action="edit-tokens"]')
      ?.addEventListener("click", () => this.openFull());

    // Reset button
    this.panel
      .querySelector('[data-action="reset"]')
      ?.addEventListener("click", () => this.resetAll());

    // Copy CSS button
    this.panel
      .querySelector('[data-action="copy"]')
      ?.addEventListener("click", () => this.copyCSS());
  }

  /**
   * Create full editor panel
   */
  createFullPanel() {
    if (this.panel) this.panel.remove();

    this.panel = document.createElement("div");
    this.panel.className = "standard-lab-panel standard-lab-panel-full";

    // Position relative to badge
    this.panel.style.bottom = `${this.position.bottom + 60}px`;
    this.panel.style.right = `${this.position.right}px`;

    const modifiedCount = this.modifiedTokens.size;
    const showModifiedOnly = modifiedCount > 0;

    this.panel.innerHTML = `
      <header class="standard-lab-panel-header" style="cursor: grab;">
        <h2>Token Editor</h2>
        <div class="standard-lab-header-actions">
          <button class="standard-lab-btn-icon" data-action="minimize" title="Minimize">−</button>
          <button class="standard-lab-btn-icon" data-action="close" title="Close (Esc)">×</button>
        </div>
      </header>

      <nav class="standard-lab-tabs">
        <button class="standard-lab-tab" data-tab="typography" aria-selected="true">Typography</button>
        <button class="standard-lab-tab" data-tab="layout">Layout</button>
        <button class="standard-lab-tab" data-tab="colors">Colors</button>
      </nav>

      ${
        modifiedCount > 0
          ? `
        <div class="standard-lab-filter">
          <label class="standard-lab-toggle">
            <input type="checkbox" ${showModifiedOnly ? "checked" : ""} data-filter="modified">
            <span>Show modified only (${modifiedCount})</span>
          </label>
        </div>
      `
          : ""
      }

      <div class="standard-lab-content">
        ${this.renderTokenList("typography", showModifiedOnly)}
      </div>

      <footer class="standard-lab-actions">
        <button class="standard-lab-btn standard-lab-btn-secondary" data-action="reset">Reset All</button>
        <button class="standard-lab-btn" data-action="copy">Copy CSS</button>
      </footer>
    `;

    this.attachFullPanelListeners();
    this.makeDraggable(this.panel.querySelector(".standard-lab-panel-header"));
    document.body.appendChild(this.panel);

    // Animate in
    requestAnimationFrame(() => {
      this.panel.style.opacity = "1";
      this.panel.style.transform = "translateY(0)";
    });
  }

  /**
   * Render token list for a category
   */
  renderTokenList(category, modifiedOnly = false) {
    const tokens = this.coreTokens[category] || [];

    let filteredTokens = tokens;
    if (modifiedOnly) {
      filteredTokens = tokens.filter((token) => this.modifiedTokens.has(token));
    }

    if (filteredTokens.length === 0) {
      return `<div class="standard-lab-empty">No tokens to display</div>`;
    }

    return `
      <div class="standard-lab-token-list">
        ${filteredTokens.map((token) => this.renderTokenRow(token)).join("")}
      </div>
    `;
  }

  /**
   * Render a single token row
   */
  renderTokenRow(token) {
    const value = this.getPropertyValue(token);
    const isModified = this.modifiedTokens.has(token);
    const isColor = token.includes("color") && this.isColorValue(value);

    return `
      <div class="standard-lab-token-row ${isModified ? "is-modified" : ""}">
        ${
          isColor
            ? `
          <input
            type="color"
            class="standard-lab-color-input"
            data-token="${token}"
            value="${this.extractHexColor(value)}"
            title="Pick color"
          >
        `
            : ""
        }
        <input
          type="text"
          class="standard-lab-text-input ${isColor ? "has-color" : ""}"
          data-token="${token}"
          value="${value}"
          placeholder="${token}"
          spellcheck="false"
        >
        <button
          class="standard-lab-btn-icon standard-lab-btn-reset"
          data-action="reset-token"
          data-token="${token}"
          title="Reset"
          ${!isModified ? "disabled" : ""}
        >↺</button>
      </div>
    `;
  }

  /**
   * Attach event listeners to full panel
   */
  attachFullPanelListeners() {
    // Close/minimize buttons
    this.panel
      .querySelector('[data-action="close"]')
      ?.addEventListener("click", () => this.close());

    this.panel
      .querySelector('[data-action="minimize"]')
      ?.addEventListener("click", () => this.openQuick());

    // Tab switching
    this.panel.querySelectorAll(".standard-lab-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const category = e.target.dataset.tab;
        this.switchTab(category);
      });
    });

    // Modified filter toggle
    this.panel
      .querySelector('[data-filter="modified"]')
      ?.addEventListener("change", (e) => {
        this.refreshTokenList(e.target.checked);
      });

    // Token inputs
    this.panel.querySelectorAll(".standard-lab-text-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        this.updateToken(e.target.dataset.token, e.target.value);
      });
    });

    // Color inputs
    this.panel
      .querySelectorAll(".standard-lab-color-input")
      .forEach((input) => {
        input.addEventListener("input", (e) => {
          const token = e.target.dataset.token;
          const color = e.target.value;
          this.updateToken(token, color);

          // Also update text input
          const textInput = this.panel.querySelector(
            `.standard-lab-text-input[data-token="${token}"]`,
          );
          if (textInput) {
            textInput.value = color;
          }
        });
      });

    // Reset token buttons
    this.panel
      .querySelectorAll('[data-action="reset-token"]')
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const token = e.target.dataset.token;
          this.resetToken(token);
        });
      });

    // Reset all button
    this.panel
      .querySelector('[data-action="reset"]')
      ?.addEventListener("click", () => this.resetAll());

    // Copy CSS button
    this.panel
      .querySelector('[data-action="copy"]')
      ?.addEventListener("click", () => this.copyCSS());
  }

  /**
   * Switch to a different tab
   */
  switchTab(category) {
    this.currentTab = category;

    // Update tab buttons
    this.panel.querySelectorAll(".standard-lab-tab").forEach((tab) => {
      const isActive = tab.dataset.tab === category;
      tab.setAttribute("aria-selected", isActive);
    });

    // Update content
    const showModifiedOnly =
      this.panel.querySelector('[data-filter="modified"]')?.checked || false;
    this.refreshTokenList(showModifiedOnly);
  }

  /**
   * Refresh token list
   */
  refreshTokenList(modifiedOnly = false) {
    const content = this.panel?.querySelector(".standard-lab-content");
    if (!content) return;

    content.innerHTML = this.renderTokenList(this.currentTab, modifiedOnly);
    this.attachFullPanelListeners();
  }

  /**
   * Update a token value
   */
  updateToken(token, value) {
    document.documentElement.style.setProperty(token, value);

    // Track modification
    const defaultValue = this.defaults[token];
    if (value !== defaultValue) {
      this.modifiedTokens.add(token);
    } else {
      this.modifiedTokens.delete(token);
    }

    this.updateBadge();

    // Update reset button state
    const resetBtn = this.panel?.querySelector(
      `[data-action="reset-token"][data-token="${token}"]`,
    );
    if (resetBtn) {
      resetBtn.disabled = !this.modifiedTokens.has(token);
    }

    // Update row styling
    const row = this.panel?.querySelector(
      `.standard-lab-token-row:has([data-token="${token}"])`,
    );
    if (row) {
      row.classList.toggle("is-modified", this.modifiedTokens.has(token));
    }

    // Load Google Font if it's a font property
    if (
      token.includes("font-") &&
      !token.includes("font-size") &&
      !token.includes("font-ratio")
    ) {
      this.loadGoogleFont(value);
    }
  }

  /**
   * Reset a single token
   */
  resetToken(token) {
    const defaultValue = this.defaults[token];
    if (defaultValue) {
      document.documentElement.style.setProperty(token, defaultValue);
      this.modifiedTokens.delete(token);

      // Update UI
      const input = this.panel?.querySelector(`[data-token="${token}"]`);
      if (input) {
        input.value = defaultValue;
      }

      this.updateBadge();
      this.refreshTokenList();
      toast.info(`Reset ${token}`, "info");
    }
  }

  /**
   * Reset all tokens
   */
  resetAll() {
    if (!confirm("Reset all tokens to defaults?")) return;

    document.documentElement.removeAttribute("style");
    this.modifiedTokens.clear();
    this.googleFontsLoaded.clear();
    this.updateBadge();

    if (this.state === "full") {
      this.refreshTokenList();
    }

    toast.info("All tokens reset", "success");
  }

  /**
   * Copy all CSS
   */
  copyCSS() {
    const allTokens = [
      ...this.coreTokens.typography,
      ...this.coreTokens.layout,
      ...this.coreTokens.colors,
    ];

    const cssLines = allTokens.map((token) => {
      const value = this.getPropertyValue(token);
      return `  ${token}: ${value};`;
    });

    const css = `:root {\n${cssLines.join("\n")}\n}`;

    navigator.clipboard
      .writeText(css)
      .then(() => {
        toast.info("✓ CSS copied to clipboard!", "success");
      })
      .catch(() => {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = css;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.info("✓ CSS copied to clipboard!", "success");
      });
  }

  /**
   * Get CSS property value
   */
  getPropertyValue(token) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(token)
      .trim();

    if (!value) {
      return document.documentElement.style.getPropertyValue(token).trim();
    }

    return value;
  }

  /**
   * Check if value is a color
   */
  isColorValue(value) {
    if (!value) return false;
    return (
      value.startsWith("#") ||
      value.startsWith("rgb") ||
      value.startsWith("hsl") ||
      value.startsWith("oklch") ||
      value.includes("color-mix")
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

    // Common color names
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

    // Load font
    const fontUrl = `https://fonts.googleapis.com/css2?family=${cleanName.replace(/ /g, "+")}:wght@300;400;500;600;700;900&display=swap`;

    if (
      !document.querySelector(`link[href*="${cleanName.replace(/ /g, "+")}"]`)
    ) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fontUrl;
      document.head.appendChild(link);
      this.googleFontsLoaded.add(cleanName);
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `standard-lab-notification standard-lab-notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

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
   * Initialize keyboard shortcuts
   */
  initKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      const isMac = navigator.platform.indexOf("Mac") > -1;

      // Shift+Cmd+S / Shift+Ctrl+S - Toggle inspector
      if (
        e.shiftKey &&
        (isMac ? e.metaKey : e.ctrlKey) &&
        e.key.toLowerCase() === "s"
      ) {
        e.preventDefault();
        if (this.state === "dormant") {
          this.openQuick();
        } else {
          this.close();
        }
      }

      // Shift+Cmd+D / Shift+Ctrl+D - Toggle debug mode
      if (
        e.shiftKey &&
        (isMac ? e.metaKey : e.ctrlKey) &&
        e.key.toLowerCase() === "d"
      ) {
        e.preventDefault();
        document.body.classList.toggle("standard-debug");
        const isActive = document.body.classList.contains("standard-debug");
        toast.info(
          `Debug mode ${isActive ? "enabled" : "disabled"}`,
          isActive ? "success" : "info",
        );
      }

      // ESC - Close panel
      if (e.key === "Escape" && this.state !== "dormant") {
        this.close();
      }
    });
  }

  /**
   * Initialize modification tracking
   */
  initModificationTracking() {
    // Check for existing modifications on init
    const allTokens = [
      ...this.coreTokens.typography,
      ...this.coreTokens.layout,
      ...this.coreTokens.colors,
    ];

    allTokens.forEach((token) => {
      const currentValue = this.getPropertyValue(token);
      const defaultValue = this.defaults[token];

      if (currentValue && defaultValue && currentValue !== defaultValue) {
        this.modifiedTokens.add(token);
      }
    });

    this.updateBadge();
  }

  /**
   * Inject styles
   */
  injectStyles() {
    if (document.getElementById("standard-lab-styles")) return;

    const styles = document.createElement("style");
    styles.id = "standard-lab-styles";
    styles.textContent = `
      /* =========================== */
      /* STANDARD LAB - MINIMAL UI   */
      /* =========================== */

      /* Badge (Dormant State) */
      .standard-lab-badge {
        position: fixed;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: color-mix(in srgb, var(--color-background) 30%, transparent);
        border: 1px solid var(--color-border);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        backdrop-filter: blur(10px);
        cursor: pointer;
        z-index: var(--z-toast);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-foreground);
        transition: all 0.2s ease;
        padding: 0;
      }

      .standard-lab-badge:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: scale(1.05);
        color: var(--color-accent);
      }

      .standard-lab-badge:active {
        transform: scale(0.95);
      }

      /* Badge modification indicator */
      .standard-lab-badge[data-modified]::after {
        content: attr(data-modified);
        position: absolute;
        top: -4px;
        right: -4px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--color-accent);
        color: var(--color-background);
        font-size: var(--scale-xs);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        border: 2px solid var(--color-background);
      }

      /* Panel Base */
      .standard-lab-panel {
        position: fixed;
        background: color-mix(in srgb, var(--color-background) 60%, transparent);
        backdrop-filter: blur(5px);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        z-index: var(--z-toast);
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.2s ease, transform 0.2s ease;
        display: flex;
        flex-direction: column;
        font-family: var(--font-interface);
        font-size: var(--scale);
      }

      /* Quick Panel */
      .standard-lab-panel-quick {
        width: 280px;
        max-height: 400px;
      }

      /* Full Panel */
      .standard-lab-panel-full {
        width: 360px;
        max-height: 600px;
      }

      /* Panel Header */
      .standard-lab-panel-header {
        padding: var(--space-xs);
        border-bottom: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }

      .standard-lab-panel-header h2 {
        margin: 0;
        font-size: var(--scale-s);
        font-weight: 600;
        letter-spacing: -0.02em;
      }

      .standard-lab-header-actions {
        display: flex;
        gap: var(--space-2xs);
      }

      /* Sections */
      .standard-lab-section {
        padding: var(--space-xs);
        border-bottom: 1px solid var(--color-border);
      }

      .standard-lab-section:last-of-type {
        border-bottom: none;
      }

      /* Label */
      .standard-lab-label {
        display: block;
        font-size: var(--scale-xs);
        font-weight: 600;
        color: var(--color-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--space-2xs);
      }

      /* Toggle */
      .standard-lab-toggle {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        cursor: pointer;
        user-select: none;
      }

      .standard-lab-toggle input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
        margin: 0;
      }

      .standard-lab-toggle span {
        flex: 1;
        font-size: var(--scale-s);
      }

      .standard-lab-toggle kbd {
        font-size: var(--scale-xs);
        font-family: var(--font-monospace);
        color: var(--color-subtle);
        padding: var(--space-3xs) var(--space-2xs);
        background: var(--color-background-secondary);
        border-radius: 3px;
      }

      /* Select */
      .standard-lab-select {
        width: 100%;
        padding: var(--space-xs);
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        font-size: var(--scale-s);
        color: var(--color-foreground);
        cursor: pointer;
      }

      /* Actions Footer */
      .standard-lab-actions {
        padding: var(--space-s);
        border-top: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        gap: var(--space-2xs);
        flex-shrink: 0;
      }

      /* Buttons */
      .standard-lab-btn {
        width: 100%;
        padding: var(--space-3xs);
        background: var(--color-accent);
        color: var(--color-background);
        border: none;
        border-radius: var(--border-radius);
        font-size: var(--scale-s);
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s ease;
      }

      .standard-lab-btn:hover {
        opacity: 0.9;
      }

      .standard-lab-btn:active {
        opacity: 0.8;
      }

      .standard-lab-btn-secondary {
        background: var(--color-background-secondary);
        color: var(--color-foreground);
        border: 1px solid var(--color-border);
      }

      .standard-lab-btn-icon {
        width: 28px;
        height: 28px;
        padding: 0;
        background: transparent;
        border: none;
        color: var(--color-muted);
        font-size: var(--scale-l);
        line-height: 1;
        cursor: pointer;
        border-radius: var(--border-radius);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .standard-lab-btn-icon:hover {
        background: var(--color-background-secondary);
        color: var(--color-foreground);
      }

      /* Tabs */
      .standard-lab-tabs {
        display: flex;
        border-bottom: 1px solid var(--color-border);
        flex-shrink: 0;
      }

      .standard-lab-tab {
        flex: 1;
        padding: var(--space-xs);
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        font-size: var(--scale-s);
        font-weight: 500;
        color: var(--color-muted);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .standard-lab-tab:hover {
        color: var(--color-foreground);
        background: var(--color-background-secondary);
      }

      .standard-lab-tab[aria-selected="true"] {
        color: var(--color-foreground);
        border-bottom-color: var(--color-accent);
        font-weight: 600;
      }

      /* Filter */
      .standard-lab-filter {
        padding: var(--space-xs) var(--space-s);
        background: var(--color-background-secondary);
        border-bottom: 1px solid var(--color-border);
        flex-shrink: 0;
      }

      /* Content Area */
      .standard-lab-content {
        flex: 1;
        overflow-y: auto;
        padding: var(--space-xs);
      }

      .standard-lab-content::-webkit-scrollbar {
        width: 6px;
      }

      .standard-lab-content::-webkit-scrollbar-track {
        background: transparent;
      }

      .standard-lab-content::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: 3px;
      }

      .standard-lab-content::-webkit-scrollbar-thumb:hover {
        background: var(--color-muted);
      }

      /* Token List */
      .standard-lab-token-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-3xs);
      }

      /* Token Row */
      .standard-lab-token-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--space-2xs);
        align-items: center;
        padding: var(--space-2xs);
        border-radius: var(--border-radius);
        transition: background 0.2s ease;
      }

      .standard-lab-token-row.has-color {
        grid-template-columns: auto 1fr auto;
      }

      .standard-lab-token-row:hover {
        background: var(--color-background-secondary);
      }

      .standard-lab-token-row.is-modified {
        background: color-mix(in srgb, var(--color-accent) 5%, transparent);
      }

      /* Token Inputs */
      .standard-lab-text-input {
        padding: var(--space-2xs);
        background: transparent;
        border: 1px solid transparent;
        border-radius: 3px;
        font-size: var(--scale-xs);
        font-family: var(--font-monospace);
        color: var(--color-foreground);
        min-width: 0;
        transition: all 0.2s ease;
      }

      .standard-lab-text-input:focus {
        outline: none;
        background: var(--color-background);
        border-color: var(--color-accent);
      }

      .standard-lab-color-input {
        width: 32px;
        height: 32px;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        cursor: pointer;
        padding: 2px;
        background: var(--color-background);
      }

      .standard-lab-color-input::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      .standard-lab-color-input::-webkit-color-swatch {
        border: none;
        border-radius: 2px;
      }

      .standard-lab-btn-reset {
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .standard-lab-token-row:hover .standard-lab-btn-reset:not(:disabled) {
        opacity: 1;
      }

      .standard-lab-btn-reset:disabled {
        opacity: 0;
        cursor: not-allowed;
      }

      /* Empty State */
      .standard-lab-empty {
        padding: var(--space);
        text-align: center;
        color: var(--color-subtle);
        font-size: var(--scale-s);
      }

      /* Notification */
      .standard-lab-notification {
        position: fixed;
        top: var(--space);
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        padding: var(--space-xs) var(--space-s);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: calc(var(--z-toast) + 1);
        font-size: var(--scale-s);
        opacity: 0;
        transition: opacity 0.2s ease, transform 0.2s ease;
        pointer-events: none;
      }

      .standard-lab-notification-success {
        background: var(--color-success);
        color: white;
        border-color: var(--color-success);
      }

      .standard-lab-notification-info {
        background: var(--color-info);
        color: white;
        border-color: var(--color-info);
      }

      /* Dark mode adjustments */
      @media (prefers-color-scheme: dark) {
        .standard-lab-panel {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .standard-lab-panel-quick,
        .standard-lab-panel-full {
          width: calc(100vw - var(--space) * 2);
          max-width: 360px;
        }
      }

      /* Print: hide everything */
      @media print {
        .standard-lab-badge,
        .standard-lab-panel,
        .standard-lab-notification {
          display: none !important;
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
