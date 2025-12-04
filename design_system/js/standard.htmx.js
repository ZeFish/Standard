(function () {
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

  // Note: When bundled, initCopyButtons and initScrollWrappers are available
  // from their respective global modules

  /**
   * Handle theme switching during HTMX swaps
   */
  function setupHTMXThemeSwitching() {
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
  function setupHTMXReinitialization() {
    document.body.addEventListener("htmx:afterSettle", function (event) {
      // Re-scan images for the zoom feature
      if (window.imageZoom) {
        window.imageZoom.rescan();
      }

      // Re-initialize scroll wrappers for new horizontal scrollers
      initScrollWrappers(event.detail.elt);

      // Re-initialize copy buttons for new code blocks
      initCopyButtons();
    });
  }

  /**
   * Initialize all HTMX integration features
   */
  function initHTMX() {
    if (window.htmx) {
      setupHTMXThemeSwitching();
      setupHTMXReinitialization();
    }
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

  // Expose to global scope
  if (typeof window !== "undefined") {
    window.initHTMX = initHTMX;
  }
})();
