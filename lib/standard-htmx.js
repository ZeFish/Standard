/**
 * HTMX Integration - Theme switching and dynamic content re-initialization
 *
 * Handles theme switching when HTMX swaps content from the server.
 * Also triggers re-initialization of other modules after swaps.
 *
 * Features:
 * - Extracts theme from server response and applies to current page
 * - Triggers image zoom rescanning after content swaps
 * - Re-initializes scroll wrappers for new horizontal scroll elements
 * - Re-initializes copy buttons for new code blocks
 *
 * @version @VERSION_PLACEHOLDER@
 */

import { initCopyButtons } from "./standard-copy-buttons.js";
import { initializeScrollWrappers } from "./standard-scroll-wrappers.js";

/**
 * Handle theme switching during HTMX swaps
 */
export function setupHTMXThemeSwitching() {
  document.body.addEventListener("htmx:beforeSwap", (evt) => {
    // Parse the full HTML response
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      evt.detail.xhr.responseText,
      "text/html",
    );

    // Extract theme from the response's <html> tag
    const newTheme = doc.documentElement.dataset.theme;

    if (newTheme) {
      // Apply it to current page's <html>
      document.documentElement.dataset.theme = newTheme;
    }
  });
}

/**
 * Handle re-initialization of modules after HTMX swaps
 */
export function setupHTMXReinitialization() {
  document.body.addEventListener("htmx:afterSettle", function (event) {
    // Re-scan images for the zoom feature
    if (window.imageZoom) {
      window.imageZoom.rescan();
    }

    // Re-initialize scroll wrappers for new horizontal scrollers
    initializeScrollWrappers(event.detail.elt);

    // Re-initialize copy buttons for new code blocks
    initCopyButtons();
  });
}

/**
 * Initialize all HTMX integration features
 */
export function initHTMX() {
  setupHTMXThemeSwitching();
  setupHTMXReinitialization();
}

/**
 * Auto-initialize
 */
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHTMX);
  } else {
    initHTMX();
  }
}

export default initHTMX;
