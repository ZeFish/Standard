/*!
 * Standard System Inspector - Minimal Debug Interface
 *
 * A minimalist debug interface for the Standard Framework
 * Philosophy: Felt, not seen. Present when needed, invisible when not.
 *
 * HTMX-COMPATIBLE VERSION: Includes a .refresh() method and stable IDs
 * to work with htmx:load events and hx-preserve.
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

    // Slider configuration for numeric tokens
    this.sliderConfig = {
      "--optical-ratio": { min: 1, max: 2, step: 0.01, unit: "" },
      "--line-height": { min: 1, max: 2, step: 0.05, unit: "" },
      "--font-size": { min: 0, max: 2, step: 0.05, unit: "em" },
      "--ratio-golden": { min: 1, max: 2, step: 0.01, unit: "" },
      "--ratio-silver": { min: 1, max: 3, step: 0.01, unit: "" },
      "--ratio-wholestep": { min: 1, max: 3, step: 0.01, unit: "" },
      "--ratio-halfstep": { min: 1, max: 2, step: 0.01, unit: "" },
      "--font-weight": { min: 100, max: 900, step: 100, unit: "" },
      "--bold-weight": { min: 100, max: 900, step: 100, unit: "" },
      "--radius": { min: 0, max: 2, step: 0.05, unit: "rem" },
      "--line-width": { min: 0, max: 10, step: 0.5, unit: "px" },
      "--base": { min: 0.5, max: 3, step: 0.05, unit: "rem" },
      "--base-gap": { min: 0, max: 3, step: 0.05, unit: "rem" },
      "--base-block-gap": { min: 0, max: 3, step: 0.05, unit: "rem" },
      "--body-padding": { min: 0, max: 5, step: 0.25, unit: "rem" },
      "--gap": { min: 0, max: 3, step: 0.05, unit: "rem" },
      "--grid-gap": { min: 0, max: 3, step: 0.05, unit: "rem" },
    };

    this.coreTokens = {
      typography: [
        "--font-text",
        "--font-header",
        "--font-monospace",
        "--font-interface",
        "--font-size",
        "--optical-ratio",
        "--line-height",
        "--font-weight",
        "--bold-weight",
        "--font-letter-spacing",
        "--font-header-letter-spacing",
        "--font-header-weight",
      ],
      layout: [
        "--line-width",
        "--line-width-xs",
        "--line-width-s",
        "--line-width-m",
        "--line-width-l",
        "--line-width-xl",
        "--base",
        "--base-gap",
        "--base-block-gap",
        "--body-padding",
        "--gap",
        "--grid-gap",
      ],
      colors: this.getColorTokens(),
      advanced: [
        "--ratio-golden",
        "--ratio-silver",
        "--ratio-wholestep",
        "--ratio-halfstep",
        "--radius",
        "--blur",
        "--transition",
        "--line-width",
        "--shadow",
        "--border",
      ],
    };

    this.defaults = {};
    this.init();
  }

  init() {
    this.storeDefaults();
    this.createBadge();
    this.initKeyboardShortcuts();

    // Check if debug mode is already active
    if (document.documentElement.classList.contains("standard-debug")) {
      this.injectGridDebugOverlays();
    }

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
    this.initModificationTracking();
  }

  storeDefaults() {
    const allTokens = [
      ...this.coreTokens.typography,
      ...this.coreTokens.layout,
      ...this.coreTokens.colors,
      ...this.coreTokens.advanced,
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

  detectColorScheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  loadPosition() {
    const saved = localStorage.getItem("standard-lab-position");
    if (saved) {
      return JSON.parse(saved);
    }
    return { bottom: 16, right: 16 };
  }

  savePosition() {
    localStorage.setItem(
      "standard-lab-position",
      JSON.stringify(this.position),
    );
  }

  createBadge() {
    if (this.badge) return;
    this.badge = document.createElement("button");
    this.badge.id = "standard-lab-badge-container";
    this.badge.className = "standard-lab-badge";
    this.badge.setAttribute("aria-label", "Open Standard Inspector");
    this.badge.setAttribute("title", "Standard Inspector (Shift+Cmd+S)");
    this.badge.setAttribute("style", "color:var(--color-subtle);");
    this.badge.style.bottom = `${this.position.bottom}px`;
    this.badge.style.right = `${this.position.right}px`;
    this.badge.innerHTML = `※`;
    this.badge.addEventListener("click", () => this.openQuick());
    this.makeDraggable(this.badge);
    document.body.appendChild(this.badge);
    this.updateBadge();
    this.injectStyles();
  }

  updateBadge() {
    if (!this.badge) return;
    const count = this.modifiedTokens.size;
    if (count > 0) {
      this.badge.setAttribute("data-modified", count);
    } else {
      this.badge.removeAttribute("data-modified");
    }
  }

  makeDraggable(element) {
    let isDragging = false,
      startX,
      startY,
      initialBottom,
      initialRight;
    const onMouseDown = (e) => {
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

  openQuick() {
    if (this.state === "quick") {
      this.close();
      return;
    }
    this.state = "quick";
    this.createQuickPanel();
  }

  openFull() {
    this.state = "full";
    this.createFullPanel();
  }

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
   * Public method to refresh the panel's UI.
   * Ideal for calling after HTMX swaps change the page state (e.g., theme).
   */
  refresh() {
    console.log("refresh");
    this.storeDefaults();

    this.badge = null;
    this.init();

    // Re-inject overlays if debug is active
    if (document.documentElement.classList.contains("standard-debug")) {
      this.removeGridDebugOverlays();
      this.injectGridDebugOverlays();
    }

    // Do nothing if the panel is closed
    if (this.state === "dormant") {
      return;
    }

    // Re-run the appropriate panel creation method to rebuild the UI
    if (this.state === "quick") {
      this.createQuickPanel();
    } else if (this.state === "full") {
      const showModifiedOnly =
        this.panel?.querySelector('[data-filter="modified"]')?.checked || false;
      this.createFullPanel();
      this.switchTab(this.currentTab);
      const modifiedFilter = this.panel?.querySelector(
        '[data-filter="modified"]',
      );
      if (modifiedFilter) {
        modifiedFilter.checked = showModifiedOnly;
        this.refreshTokenList(showModifiedOnly);
      }
    }
  }

  createQuickPanel() {
    if (this.panel) this.panel.remove();
    this.panel = document.createElement("div");
    this.panel.id = "standard-lab-panel-container";
    this.panel.className = "standard-lab-panel standard-lab-panel-quick";
    this.panel.style.bottom = `calc(${this.position.bottom}px + var(--base-2))`;
    this.panel.style.right = `${this.position.right}px`;
    const debugActive =
      document.documentElement.classList.contains("standard-debug");
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
        ${modifiedCount > 0 ? `<button class="standard-lab-btn standard-lab-btn-secondary" data-action="reset">Reset</button>` : ""}
        <button class="standard-lab-btn standard-lab-btn-secondary" data-action="copy">Copy CSS</button>
      </footer>
    `;
    this.attachQuickPanelListeners();
    document.body.appendChild(this.panel);
    requestAnimationFrame(() => {
      this.panel.style.opacity = "1";
      this.panel.style.transform = "translateY(0)";
    });
  }

  getThemeOptions() {
    const themes = [
      { value: "", label: "Default" },
      { value: "paper", label: "Paper" },
      { value: "swiss", label: "Swiss" },
      { value: "kernel", label: "Kernel" },
      { value: "forest", label: "Forest" },
      { value: "book", label: "Book" },
      { value: "minimal", label: "Minimal" },
      { value: "blueprint", label: "Blueprint" },
    ];
    const current = document.documentElement.getAttribute("data-theme") || "";
    return themes
      .map(
        (theme) =>
          `<option value="${theme.value}" ${current === theme.value ? "selected" : ""}>${theme.label}</option>`,
      )
      .join("");
  }

  attachQuickPanelListeners() {
    this.panel
      .querySelector('[data-action="close"]')
      ?.addEventListener("click", () => this.close());
    this.panel
      .querySelector('[data-toggle="debug"]')
      ?.addEventListener("change", (e) => {
        const isEnabled = e.target.checked;
        document.documentElement.classList.toggle("standard-debug", isEnabled);
        if (isEnabled) {
          this.injectGridDebugOverlays();
        } else {
          this.removeGridDebugOverlays();
        }
        toast.info(`Debug mode ${e.target.checked ? "enabled" : "disabled"}`);
      });
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
        toast.info(`Theme: ${theme || "Default"}`);
      });
    this.panel
      .querySelector('[data-action="edit-tokens"]')
      ?.addEventListener("click", () => this.openFull());
    this.panel
      .querySelector('[data-action="reset"]')
      ?.addEventListener("click", () => this.resetAll());
    this.panel
      .querySelector('[data-action="copy"]')
      ?.addEventListener("click", () => this.copyCSS());
  }

  createFullPanel() {
    if (this.panel) this.panel.remove();
    this.panel = document.createElement("div");
    this.panel.id = "standard-lab-panel-container";
    this.panel.className = "standard-lab-panel standard-lab-panel-full";
    this.panel.style.bottom = `calc(${this.position.bottom}px + var(--base-2))`;
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
        <button class="standard-lab-tab" data-tab="advanced">Advanced</button>
      </nav>
      ${modifiedCount > 0 ? `<div class="standard-lab-filter"><label class="standard-lab-toggle"><input type="checkbox" ${showModifiedOnly ? "checked" : ""} data-filter="modified"><span>Show modified only (${modifiedCount})</span></label></div>` : ""}
      <div class="standard-lab-content">${this.renderTokenList("typography", showModifiedOnly)}</div>
      <footer class="standard-lab-actions">
        <button class="standard-lab-btn standard-lab-btn-secondary" data-action="reset">Reset All</button>
        <button class="standard-lab-btn" data-action="copy">Copy CSS</button>
      </footer>
    `;
    this.attachFullPanelListeners();
    this.makeDraggable(this.panel.querySelector(".standard-lab-panel-header"));
    document.body.appendChild(this.panel);
    requestAnimationFrame(() => {
      this.panel.style.opacity = "1";
      this.panel.style.transform = "translateY(0)";
    });
  }

  renderTokenList(category, modifiedOnly = false) {
    const tokens = this.coreTokens[category] || [];
    let filteredTokens = modifiedOnly
      ? tokens.filter((token) => this.modifiedTokens.has(token))
      : tokens;
    if (filteredTokens.length === 0) {
      return `<div class="standard-lab-empty">No tokens to display</div>`;
    }
    return `<div class="standard-lab-token-list">${filteredTokens.map((token) => this.renderTokenRow(token)).join("")}</div>`;
  }

  /**
   * Check if a value is numeric (with optional unit)
   */
  isNumericValue(value) {
    if (!value) return false;
    // Match patterns like: 1.5, 1.5rem, 16px, 1.618, 500
    return /^-?\d+(\.\d+)?(rem|em|px|%|ch|vh|vw)?$/.test(value.trim());
  }

  /**
   * Extract numeric portion from a CSS value
   */
  extractNumericValue(value) {
    if (!value) return 0;
    const match = value.match(/^(-?\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Extract unit from a CSS value (rem, px, em, etc.)
   */
  extractUnit(value) {
    if (!value) return "";
    const match = value.match(/[a-z%]+$/i);
    return match ? match[0] : "";
  }

  renderTokenRow(token) {
    const value = this.getPropertyValue(token);
    const isModified = this.modifiedTokens.has(token);
    const isColor = token.includes("color") && this.isColorValue(value);
    const sliderConfig = this.sliderConfig[token];

    // Detect if this is a slider-enabled numeric token
    const isSlider = sliderConfig && this.isNumericValue(value);

    if (isSlider) {
      const numericValue = this.extractNumericValue(value);
      return `
        <div class="standard-lab-token-row ${isModified ? "is-modified" : ""}">
          <div class="standard-lab-slider-container">
            <label class="standard-lab-slider-label">${token}</label>
            <div class="standard-lab-slider-controls">
              <input
                type="range"
                class="standard-lab-slider-input"
                data-token="${token}"
                value="${numericValue}"
                min="${sliderConfig.min}"
                max="${sliderConfig.max}"
                step="${sliderConfig.step}"
                title="${token}">
              <input
                type="text"
                class="standard-lab-text-input standard-lab-slider-value"
                data-token="${token}"
                value="${value}"
                spellcheck="false">
            </div>
          </div>
          <button class="standard-lab-btn-icon standard-lab-btn-reset" data-action="reset-token" data-token="${token}" title="Reset" ${!isModified ? "disabled" : ""}>↺</button>
        </div>
      `;
    }

    if (isColor) {
      return `
        <div class="standard-lab-token-row ${isModified ? "is-modified" : ""}">
          <div class="standard-lab-color-container">
            <label class="standard-lab-color-label">${token}</label>
            <div class="standard-lab-color-controls">
              <input
                type="color"
                class="standard-lab-color-input"
                data-token="${token}"
                value="${this.extractHexColor(value)}"
                title="Pick color">
              <input
                type="text"
                class="standard-lab-text-input standard-lab-color-value"
                data-token="${token}"
                value="${value}"
                placeholder="${token}"
                spellcheck="false">
            </div>
          </div>
          <button class="standard-lab-btn-icon standard-lab-btn-reset" data-action="reset-token" data-token="${token}" title="Reset" ${!isModified ? "disabled" : ""}>↺</button>
        </div>
      `;
    }

    // Default text input (for font names, etc.)
    return `
      <div class="standard-lab-token-row ${isModified ? "is-modified" : ""}">
        <div class="standard-lab-text-container">
          <label class="standard-lab-text-label">${token}</label>
          <input type="text" class="standard-lab-text-input" data-token="${token}" value="${value}" placeholder="${token}" spellcheck="false">
        </div>
        <button class="standard-lab-btn-icon standard-lab-btn-reset" data-action="reset-token" data-token="${token}" title="Reset" ${!isModified ? "disabled" : ""}>↺</button>
      </div>
    `;
  }

  attachFullPanelListeners() {
    this.panel
      .querySelector('[data-action="close"]')
      ?.addEventListener("click", () => this.close());
    this.panel
      .querySelector('[data-action="minimize"]')
      ?.addEventListener("click", () => this.openQuick());
    this.panel.querySelectorAll(".standard-lab-tab").forEach((tab) => {
      tab.addEventListener("click", (e) =>
        this.switchTab(e.target.dataset.tab),
      );
    });
    this.panel
      .querySelector('[data-filter="modified"]')
      ?.addEventListener("change", (e) =>
        this.refreshTokenList(e.target.checked),
      );

    // Slider input listeners
    this.panel
      .querySelectorAll(".standard-lab-slider-input")
      .forEach((slider) => {
        slider.addEventListener("input", (e) => {
          const token = e.target.dataset.token;
          const numericValue = e.target.value;
          const config = this.sliderConfig[token];
          const unit =
            config.unit || this.extractUnit(this.getPropertyValue(token));
          const fullValue = `${numericValue}${unit}`;

          this.updateToken(token, fullValue);

          // Update the text input to reflect slider value
          const textInput = this.panel.querySelector(
            `.standard-lab-slider-value[data-token="${token}"]`,
          );
          if (textInput) textInput.value = fullValue;
        });
      });

    // Text input for sliders (allows manual override)
    this.panel
      .querySelectorAll(".standard-lab-slider-value")
      .forEach((input) => {
        input.addEventListener("input", (e) => {
          const token = e.target.dataset.token;
          const value = e.target.value;
          const numericValue = this.extractNumericValue(value);

          this.updateToken(token, value);

          // Sync slider position
          const slider = this.panel.querySelector(
            `.standard-lab-slider-input[data-token="${token}"]`,
          );
          if (slider) slider.value = numericValue;
        });
      });

    // Regular text inputs
    this.panel
      .querySelectorAll(
        ".standard-lab-text-input:not(.standard-lab-slider-value):not(.standard-lab-color-value)",
      )
      .forEach((input) => {
        input.addEventListener("input", (e) =>
          this.updateToken(e.target.dataset.token, e.target.value),
        );
      });

    // Color pickers
    this.panel
      .querySelectorAll(".standard-lab-color-input")
      .forEach((input) => {
        input.addEventListener("input", (e) => {
          const token = e.target.dataset.token;
          const color = e.target.value;
          this.updateToken(token, color);
          const textInput = this.panel.querySelector(
            `.standard-lab-color-value[data-token="${token}"]`,
          );
          if (textInput) textInput.value = color;
        });
      });

    // Color text inputs
    this.panel
      .querySelectorAll(".standard-lab-color-value")
      .forEach((input) => {
        input.addEventListener("input", (e) => {
          const token = e.target.dataset.token;
          const value = e.target.value;
          this.updateToken(token, value);
          const colorInput = this.panel.querySelector(
            `.standard-lab-color-input[data-token="${token}"]`,
          );
          if (colorInput && this.isColorValue(value)) {
            colorInput.value = this.extractHexColor(value);
          }
        });
      });

    // Reset buttons
    this.panel
      .querySelectorAll('[data-action="reset-token"]')
      .forEach((btn) => {
        btn.addEventListener("click", (e) =>
          this.resetToken(e.target.dataset.token),
        );
      });
    this.panel
      .querySelector('[data-action="reset"]')
      ?.addEventListener("click", () => this.resetAll());
    this.panel
      .querySelector('[data-action="copy"]')
      ?.addEventListener("click", () => this.copyCSS());
  }

  switchTab(category) {
    this.currentTab = category;
    this.panel.querySelectorAll(".standard-lab-tab").forEach((tab) => {
      tab.setAttribute("aria-selected", tab.dataset.tab === category);
    });
    const showModifiedOnly =
      this.panel.querySelector('[data-filter="modified"]')?.checked || false;
    this.refreshTokenList(showModifiedOnly);
  }

  refreshTokenList(modifiedOnly = false) {
    const content = this.panel?.querySelector(".standard-lab-content");
    if (!content) return;
    content.innerHTML = this.renderTokenList(this.currentTab, modifiedOnly);
    this.attachFullPanelListeners();
  }

  updateToken(token, value) {
    document.documentElement.style.setProperty(token, value);
    if (value !== this.defaults[token]) {
      this.modifiedTokens.add(token);
    } else {
      this.modifiedTokens.delete(token);
    }
    this.updateBadge();
    const resetBtn = this.panel?.querySelector(
      `[data-action="reset-token"][data-token="${token}"]`,
    );
    if (resetBtn) resetBtn.disabled = !this.modifiedTokens.has(token);
    const row = this.panel?.querySelector(
      `.standard-lab-token-row:has([data-token="${token}"])`,
    );
    if (row)
      row.classList.toggle("is-modified", this.modifiedTokens.has(token));
    if (
      token.includes("font-") &&
      !token.includes("font-size") &&
      !token.includes("font-ratio")
    ) {
      this.loadGoogleFont(value);
    }
  }

  resetToken(token) {
    const defaultValue = this.defaults[token];
    if (defaultValue) {
      document.documentElement.style.setProperty(token, defaultValue);
      this.modifiedTokens.delete(token);
      const input = this.panel?.querySelector(`[data-token="${token}"]`);
      if (input) input.value = defaultValue;
      this.updateBadge();
      this.refreshTokenList();
      toast.info(`Reset ${token}`);
    }
  }

  resetAll() {
    if (!confirm("Reset all tokens to defaults?")) return;
    document.documentElement.removeAttribute("style");
    this.modifiedTokens.clear();
    this.googleFontsLoaded.clear();
    this.updateBadge();
    if (this.state === "full") {
      this.refreshTokenList();
    }
    toast.info("All tokens reset");
  }

  copyCSS() {
    const allTokens = [
      ...this.coreTokens.typography,
      ...this.coreTokens.layout,
      ...this.coreTokens.colors,
      ...this.coreTokens.advanced,
    ];
    const css = `:root {\n${allTokens.map((token) => `  ${token}: ${this.getPropertyValue(token)};`).join("\n")}\n}`;
    navigator.clipboard
      .writeText(css)
      .then(() => toast.success("CSS copied to clipboard!"))
      .catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = css;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("CSS copied to clipboard!");
      });
  }

  getPropertyValue(token) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(token)
      .trim();
    return (
      value || document.documentElement.style.getPropertyValue(token).trim()
    );
  }

  isColorValue(value) {
    return value
      ? value.startsWith("#") ||
          value.startsWith("rgb") ||
          value.startsWith("hsl") ||
          value.startsWith("oklch") ||
          value.includes("color-mix")
      : false;
  }

  extractHexColor(value) {
    if (!value) return "#000000";
    const hexMatch = value.match(/#[0-9a-f]{6}/i);
    if (hexMatch) return hexMatch[0];
    const rgbMatch = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch;
      return (
        "#" +
        [r, g, b].map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")
      );
    }
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

  loadGoogleFont(fontName) {
    const cleanName = fontName.split(",")[0].trim().replace(/['"]/g, "");
    const systemFonts = [
      "system-ui",
      "sans-serif",
      "serif",
      "monospace",
      "-apple-system",
      "BlinkMacSystemFont",
    ];
    if (
      systemFonts.includes(cleanName) ||
      this.googleFontsLoaded.has(cleanName)
    )
      return;
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

  initKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      const isMac = navigator.platform.indexOf("Mac") > -1;
      if (
        e.shiftKey &&
        (isMac ? e.metaKey : e.ctrlKey) &&
        e.key.toLowerCase() === "s"
      ) {
        e.preventDefault();
        this.state === "dormant" ? this.openQuick() : this.close();
      }
      if (
        e.shiftKey &&
        (isMac ? e.metaKey : e.ctrlKey) &&
        e.key.toLowerCase() === "d"
      ) {
        e.preventDefault();

        document.documentElement.classList.toggle("standard-debug");
        const isActive =
          document.documentElement.classList.contains("standard-debug");

        if (isActive) {
          this.injectGridDebugOverlays();
        } else {
          this.removeGridDebugOverlays();
        }

        toast.info(`Debug mode ${isActive ? "enabled" : "disabled"}`);
      }
      if (e.key === "Escape" && this.state !== "dormant") {
        this.close();
      }
    });
  }

  initModificationTracking() {
    const allTokens = [
      ...this.coreTokens.typography,
      ...this.coreTokens.layout,
      ...this.coreTokens.colors,
      ...this.coreTokens.advanced,
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
   * Inject grid debug overlays into all .prose containers
   */
  injectGridDebugOverlays() {
    const proseContainers = document.querySelectorAll(".prose");

    proseContainers.forEach((prose) => {
      // Check if overlay already exists
      if (prose.querySelector(".grid-debug-overlay")) {
        return;
      }

      const overlay = document.createElement("div");
      overlay.className = "grid-debug-overlay";
      overlay.setAttribute("aria-hidden", "true");

      // Add 7 spans for grid columns
      for (let i = 0; i < 7; i++) {
        overlay.appendChild(document.createElement("span"));
      }

      // Insert as first child
      prose.insertBefore(overlay, prose.firstChild);
    });
  }

  /**
   * Remove grid debug overlays from all .prose containers
   */
  removeGridDebugOverlays() {
    document
      .querySelectorAll(".grid-debug-overlay")
      .forEach((overlay) => overlay.remove());
  }

  injectStyles() {
    if (document.getElementById("standard-lab-styles")) return;
    const styles = document.createElement("style");
    styles.id = "standard-lab-styles";
    styles.textContent = `
      .standard-lab-badge { font-family: var(--font-interface); position: fixed; width: var(--base); height: var(--base); border-radius: 50%; background: color-mix(in srgb, var(--color-background-secondary) 30%, transparent); border: var(--border); box-shadow: var(--shadow); backdrop-filter: var(--blur); cursor: pointer; z-index: var(--z-toast); line-height:1.5; display: flex; align-items: baseline; justify-content: center; color: var(--color-foreground); transition: all 0.2s ease; padding: 0; }
      .standard-lab-badge:hover { box-shadow: var(--shadow); transform: scale(1.05); color: var(--color-accent); }
      .standard-lab-badge:active { transform: scale(0.95); }
      .standard-lab-badge[data-modified]::after { content: attr(data-modified); position: absolute; top: -4px; right: -4px; width: 20px; height: 20px; border-radius: 50%; background: var(--color-accent); color: var(--color-background); font-size: var(--scale-d3); display: flex; align-items: center; justify-content: center; font-weight: 600; border: 2px solid var(--color-background); }
      .standard-lab-panel { position: fixed; font-size: 16px !important; line-height: 1.2 !important; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; background: var(--modal-background); backdrop-filter: var(--blur); border: var(--border); border-radius: 6px; box-shadow: var(--shadow); z-index: var(--z-toast); opacity: 0; transform: translateY(10px); transition: opacity 0.2s ease, transform 0.2s ease; display: flex; flex-direction: column; }
      .standard-lab-panel * { font-size: inherit !important; line-height: inherit !important; line-height:1.5 !important; }
      .standard-lab-panel :is(label, input) { margin:0; }
      .standard-lab-panel-quick { max-width: 280px; max-height: 400px; }
      .standard-lab-panel-full { max-width: 360px; max-height: 600px; }
      .standard-lab-panel-header { padding: 6px; border-bottom: var(--border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
      .standard-lab-panel-header h2 { margin: 0; font-size: 14px !important; font-weight: 600; letter-spacing: -0.02em; }
      .standard-lab-header-actions { display: flex; gap: 6px; }
      .standard-lab-section { padding: 6px; border-bottom: var(--border); }
      .standard-lab-section:last-of-type { border-bottom: none; }
      .standard-lab-label { display: block; font-size: 11px !important; font-weight: 600; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
      .standard-lab-toggle { display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; }
      .standard-lab-toggle input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; margin: 0; }
      .standard-lab-toggle span { flex: 1; font-size: 14px !important; }
      .standard-lab-toggle kbd { font-size: 12px !important; font-family: var(--font-monospace); color: var(--color-subtle); padding: 2px 6px; background: var(--color-background-secondary); border-radius: 6px; }
      .standard-lab-select { width: 100%; padding: 6px 3px; margin:0; background: var(--color-background); border: var(--border); border-radius: 6px; font-size: 14px !important; color: var(--color-foreground); cursor: pointer; }
      .standard-lab-actions { padding: 6px; border-top: var(--border); display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
      .standard-lab-btn { font-size: 12px !important; width: 100%; padding: 6px 3px; background: var(--color-accent); color: var(--color-background); border: border-radius: var(--border); border-radius: 6px; font-size: 14px !important; font-weight: 600; cursor: pointer; transition: opacity 0.2s ease; }
      .standard-lab-btn:hover { opacity: 0.9; }
      .standard-lab-btn:active { opacity: 0.8; }
      .standard-lab-btn-secondary { background: var(--color-background-secondary); color: var(--color-foreground); border: var(--border); }
      .standard-lab-btn-icon { font-size: 12px !important; width: 24px; height: 24px; padding: 0; background: transparent; border: none; color: var(--color-muted); font-size: 20px !important; line-height: 1 !important; cursor: pointer; border-radius: 6px; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
      .standard-lab-btn-icon:hover { background: var(--color-background-secondary); color: var(--color-foreground); }
      .standard-lab-tabs { display: flex; border-bottom: var(--border); flex-shrink: 0; }
      .standard-lab-tab { flex: 1; padding: 6px; background: transparent; border: none; border-bottom: 2px solid transparent; font-size: 16px !important; font-weight: 500; color: var(--color-muted); cursor: pointer; transition: all 0.2s ease; }
      .standard-lab-tab:hover { color: var(--color-foreground); background: var(--color-background-secondary); }
      .standard-lab-tab[aria-selected="true"] { color: var(--color-foreground); border-bottom-color: var(--color-accent); font-weight: 600; }
      .standard-lab-filter { padding: 6px var(--base-d2); background: var(--color-background-secondary); border-bottom: var(--border); flex-shrink: 0; }
      .standard-lab-content { flex: 1; overflow-y: auto; padding: 6px; }
      .standard-lab-content::-webkit-scrollbar { width: 6px; }
      .standard-lab-content::-webkit-scrollbar-track { background: transparent; }
      .standard-lab-content::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 6px; }
      .standard-lab-content::-webkit-scrollbar-thumb:hover { background: var(--color-muted); }
      .standard-lab-token-list { display: flex; flex-direction: column; gap: 3px; }
      .standard-lab-token-row { display: grid; grid-template-columns: 1fr auto; gap: 6px; align-items: start; padding: 6px; border-radius: 6px; transition: background 0.2s ease; }
      .standard-lab-token-row:hover { background: var(--color-background-secondary); }
      .standard-lab-token-row.is-modified { background: color-mix(in srgb, var(--color-accent) 5%, transparent); }
      .standard-lab-text-input { padding: 0; background: transparent; border: 1px solid transparent; border-radius: 6px; font-size: 12px !important; font-family: var(--font-monospace); color: var(--color-foreground); min-width: 0; transition: all 0.2s ease; }
      .standard-lab-text-input:focus { outline: none; background: var(--color-background); border-color: var(--color-accent); }
      .standard-lab-color-container { width: 100%; }
      .standard-lab-color-label { display: block; font-size: 11px !important; font-family: var(--font-monospace); color: var(--color-muted); margin-bottom: 6px; }
      .standard-lab-color-controls { display: flex; gap: 6px; align-items: center; }
      .standard-lab-color-input { width: 40px; height: 40px; border: var(--border); border-radius: 6px; cursor: pointer; padding: 4px; background: var(--color-background); flex-shrink: 0; }
      .standard-lab-color-input::-webkit-color-swatch-wrapper { padding: 0; }
      .standard-lab-color-input::-webkit-color-swatch { border: none; border-radius: 6px; }
      .standard-lab-color-value { flex: 1; min-width: 0; padding: 0; font-family: var(--font-monospace); font-size: 12px !important; }
      .standard-lab-text-container { width: 100%; }
      .standard-lab-text-label { display: block; font-size: 11px !important; font-family: var(--font-monospace); color: var(--color-muted); margin-bottom: 6px; }
      .standard-lab-slider-container { width: 100%; }
      .standard-lab-slider-label { display: block; font-size: 11px !important; font-family: var(--font-monospace); color: var(--color-muted); margin-bottom: 6px; }
      .standard-lab-slider-controls { display: flex; gap: 6px; align-items: center; }
      .standard-lab-slider-input { flex: 1; height: 6px; -webkit-appearance: none; appearance: none; background: var(--color-background-secondary); border-radius: 6px; outline: none; cursor: pointer; }
      .standard-lab-slider-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: var(--color-accent); border-radius: 50%; cursor: grab; transition: transform 0.1s ease; }
      .standard-lab-slider-input::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.2); }
      .standard-lab-slider-input::-moz-range-thumb { width: 16px; height: 16px; background: var(--color-accent); border-radius: 50%; border: none; cursor: grab; transition: transform 0.1s ease; }
      .standard-lab-slider-input::-moz-range-thumb:active { cursor: grabbing; transform: scale(1.2); }
      .standard-lab-slider-value { width: 80px; flex-shrink: 0; text-align: center; padding: 6px 8px; font-size: 12px !important; }
      .standard-lab-btn-reset { opacity: 0; transition: opacity 0.2s ease; }
      .standard-lab-token-row:hover .standard-lab-btn-reset:not(:disabled) { opacity: 1; }
      .standard-lab-btn-reset:disabled { opacity: 0; cursor: not-allowed; }
      .standard-lab-empty { padding: var(--base); text-align: center; color: var(--color-subtle); font-size: 14px !important; }
      .standard-lab-notification { position: fixed; top: var(--base); left: 50%; transform: translateX(-50%) translateY(-10px); background: var(--color-background); border: var(--border); border-radius: 6px; padding: 8px 16px; box-shadow: var(--shadow); z-index: calc(var(--z-toast) + 1); font-size: 14px !important; opacity: 0; transition: opacity 0.2s ease, transform 0.2s ease; pointer-events: none; }
      .standard-lab-notification-success { background: var(--color-success); color: white; border-color: var(--color-success); }
      .standard-lab-notification-info { background: var(--color-info); color: white; border-color: var(--color-info); }
      @media (prefers-color-scheme: dark) { .standard-lab-panel { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); } }
      @media (max-width: 768px) { .standard-lab-panel-quick, .standard-lab-panel-full { width: calc(100vw - 32px); max-width: 360px; } }
      @media print { .standard-lab-badge, .standard-lab-panel, .standard-lab-notification { display: none !important; } }
    `;
    document.head.appendChild(styles);
  }
}

// ================================================================
// AUTO-INITIALIZATION AND HTMX INTEGRATION
// ================================================================

if (typeof window !== "undefined") {
  const setupStandardLab = () => {
    // 1. Create the StandardLab instance if it doesn't exist.
    if (!window.StandardLab) {
      window.StandardLab = new StandardLab();
    }

    // 2. Add the HTMX integration listener.
    document.body.addEventListener("htmx:afterSettle", function (event) {
      console.log("HTMX loaded, refreshing StandardLab...");
      if (window.StandardLab) {
        window.StandardLab.refresh();
      }
    });
  };

  // Check if the DOM is already loaded or wait for it.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupStandardLab);
  } else {
    setupStandardLab();
  }
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = { StandardLab };
}
