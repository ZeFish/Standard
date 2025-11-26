/**
 * Astro Transitions Integration - Theme switching and dynamic content re-initialization
 *
 * Handles theme switching and module re-initialization when Astro View Transitions
 * swap content. Works seamlessly with the Astro transition API.
 *
 * Features:
 * - Extracts theme from server response and applies to current page
 * - Triggers image zoom rescanning after transitions
 * - Re-initializes scroll wrappers for new horizontal scroll elements
 * - Re-initializes copy buttons for new code blocks
 * - Persists theme across transitions
 *
 * @version @VERSION_PLACEHOLDER@
 *
 * @see https://docs.astro.build/en/guides/view-transitions/
 */

import { initCopyButtons } from "./standard-copy-buttons.js";
import { initializeScrollWrappers } from "./standard-scroll-wrappers.js";

/**
 * Store current theme to persist across transitions
 */
let currentTheme = null;

/**
 * Initialize theme from DOM on first load
 */
function initializeTheme() {
  if (typeof document !== "undefined") {
    currentTheme = document.documentElement.dataset.theme;
  }
}

/**
 * Handle theme switching during Astro transitions
 */
export function setupAstroThemeSwitching() {
  if (typeof window === "undefined") return;

  document.addEventListener("astro:before-preparation", (evt) => {
    // Store the current theme to apply to the new page
    // This prevents theme flashing during transitions
    const theme = document.documentElement.dataset.theme;
    if (theme) {
      currentTheme = theme;
    }
  });

  document.addEventListener("astro:after-swap", () => {
    // Apply stored theme to the new page
    if (currentTheme) {
      document.documentElement.dataset.theme = currentTheme;
    }
  });
}

/**
 * Handle re-initialization of modules after Astro transitions
 */
export function setupAstroReinitialization() {
  if (typeof window === "undefined") return;

  document.addEventListener("astro:after-swap", () => {
    // Re-scan images for the zoom feature
    if (window.imageZoom) {
      window.imageZoom.rescan();
    }

    // Re-initialize scroll wrappers for new horizontal scrollers
    initializeScrollWrappers(document);

    // Re-initialize copy buttons for new code blocks
    initCopyButtons();
  });
}

/**
 * Alternative: Use astro:page-load for late-stage re-initialization
 * (Fires after all transitions and animations are complete)
 */
export function setupAstroPageLoadReinitalization() {
  if (typeof window === "undefined") return;

  document.addEventListener("astro:page-load", () => {
    // This fires after the entire page transition is complete
    // Useful if you need to wait for animations to finish
    if (window.imageZoom) {
      window.imageZoom.rescan();
    }

    initializeScrollWrappers(document);
    initCopyButtons();
  });
}

/**
 * Initialize all Astro integration features
 *
 * @param {Object} options Configuration options
 * @param {boolean} [options.usePageLoad=false] Use astro:page-load instead of astro:after-swap
 */
export function initAstro(options = {}) {
  const { usePageLoad = false } = options;

  initializeTheme();
  setupAstroThemeSwitching();

  if (usePageLoad) {
    setupAstroPageLoadReinitalization();
  } else {
    setupAstroReinitialization();
  }
}

/**
 * Auto-initialize
 */
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initAstro();
    });
  } else {
    initAstro();
  }
}

export default initAstro;
