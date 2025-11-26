/**
 * Astro Transitions Integration - Full support for Astro View Transitions API
 *
 * Handles theme switching and module re-initialization when Astro View Transitions
 * swap content. Works seamlessly with the Astro transition API for smooth SPA-like
 * navigation without the JavaScript overhead.
 *
 * Features:
 * - Extracts theme from server response and applies to current page
 * - Triggers image zoom rescanning after transitions
 * - Re-initializes scroll wrappers for new horizontal scroll elements
 * - Re-initializes copy buttons for new code blocks
 * - Persists theme across transitions
 * - Automatic theme detection to prevent flash on load
 * - Support for both astro:after-swap and astro:page-load events
 *
 * @version @VERSION_PLACEHOLDER@
 *
 * @see https://docs.astro.build/en/guides/view-transitions/
 *
 * Astro View Transitions API Lifecycle:
 *   1. astro:before-preparation → Before loading new page
 *   2. astro:after-preparation  → After new page HTML is loaded
 *   3. astro:before-swap        → Before DOM swap (can customize swap logic)
 *   4. astro:after-swap         → After DOM swap (use this for re-init)
 *   5. astro:page-load          → After ALL animations complete (final event)
 *
 * @example
 *   // Enable with default settings
 *   import { initAstro } from '@zefish/standard/js/standard-astro.js';
 *   initAstro();
 *
 *   // Or use specific event for late re-initialization
 *   initAstro({ usePageLoad: true });
 */

import { initCopyButtons } from "./standard-copy-buttons.js";
import { initializeScrollWrappers } from "./standard-scroll-wrappers.js";

/**
 * Store current theme to persist across transitions
 */
let currentTheme = null;

/**
 * Store scroll position for smooth scrolling management
 */
let scrollState = { x: 0, y: 0 };

/**
 * Initialize theme from DOM on first load
 */
function initializeTheme() {
  if (typeof document !== "undefined") {
    currentTheme = document.documentElement.dataset.theme;
  }
}

/**
 * Detect if View Transitions are supported and enabled
 */
function supportsViewTransitions() {
  if (typeof window === "undefined") return false;
  return (
    "startViewTransition" in document &&
    (window.transitionEnabledOnThisPage === true ||
      !("transitionEnabledOnThisPage" in window))
  );
}

/**
 * Handle theme switching during Astro transitions
 *
 * Prevents theme flash by:
 * 1. Storing theme before transition starts
 * 2. Applying stored theme immediately after swap
 */
export function setupAstroThemeSwitching() {
  if (typeof window === "undefined") return;

  // Before the new page starts loading, save current theme
  document.addEventListener("astro:before-preparation", (evt) => {
    const theme = document.documentElement.dataset.theme;
    if (theme) {
      currentTheme = theme;
    }
    // Optional: Log navigation direction
    // console.log(`[View Transition] Direction: ${evt.direction}`);
  });

  // Immediately after swap, apply the stored theme
  document.addEventListener("astro:before-swap", (evt) => {
    // Parse the new document to check for theme
    if (evt.newDocument) {
      const newTheme = evt.newDocument.documentElement.dataset.theme;
      if (newTheme) {
        currentTheme = newTheme;
        // Apply immediately on current document
        document.documentElement.dataset.theme = newTheme;
      }
    }
  });

  // Final fallback: Apply theme after swap completes
  document.addEventListener("astro:after-swap", () => {
    if (currentTheme) {
      document.documentElement.dataset.theme = currentTheme;
    }
  });
}

/**
 * Handle scroll position management during transitions
 *
 * Stores scroll position before navigation and can optionally
 * restore it or reset to top depending on use case
 */
export function setupAstroScrollManagement(options = {}) {
  const { restoreScroll = false } = options;

  if (typeof window === "undefined") return;

  document.addEventListener("astro:before-preparation", () => {
    // Store scroll position before leaving page
    scrollState = {
      x: window.scrollX || 0,
      y: window.scrollY || 0,
    };
  });

  document.addEventListener("astro:after-swap", () => {
    // Reset scroll to top (default browser behavior)
    // unless explicitly configured to restore
    if (restoreScroll) {
      window.scrollTo(scrollState.x, scrollState.y);
    } else {
      window.scrollTo(0, 0);
    }
  });
}

/**
 * Re-initialize Standard modules after Astro transitions
 *
 * This runs early in the transition lifecycle (astro:after-swap)
 * so modules are ready as animations complete
 */
export function setupAstroReinitialization() {
  if (typeof window === "undefined") return;

  document.addEventListener("astro:after-swap", () => {
    // Re-scan images for the zoom feature
    if (window.imageZoom && typeof window.imageZoom.rescan === "function") {
      window.imageZoom.rescan();
    }

    // Re-initialize scroll wrappers for new horizontal scrollers
    if (typeof initializeScrollWrappers === "function") {
      initializeScrollWrappers(document);
    }

    // Re-initialize copy buttons for new code blocks
    if (typeof initCopyButtons === "function") {
      initCopyButtons();
    }
  });
}

/**
 * Alternative: Use astro:page-load for late-stage re-initialization
 *
 * Fires AFTER all transitions and animations are complete.
 * Useful if you need to wait for animations to finish before re-initializing.
 */
export function setupAstroPageLoadReinitialization() {
  if (typeof window === "undefined") return;

  document.addEventListener("astro:page-load", () => {
    // This fires after the entire page transition is complete
    // and all animations have finished

    if (window.imageZoom && typeof window.imageZoom.rescan === "function") {
      window.imageZoom.rescan();
    }

    if (typeof initializeScrollWrappers === "function") {
      initializeScrollWrappers(document);
    }

    if (typeof initCopyButtons === "function") {
      initCopyButtons();
    }
  });
}

/**
 * Setup debugging and diagnostics for View Transitions
 *
 * Logs all transition events to console for development
 */
export function setupAstroDebugLogging() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const events = [
    "astro:before-preparation",
    "astro:after-preparation",
    "astro:before-swap",
    "astro:after-swap",
    "astro:page-load",
  ];

  events.forEach((eventName) => {
    document.addEventListener(eventName, (evt) => {
      console.log(`[Standard] ${eventName}`, {
        type: eventName,
        fromURL: evt.from?.href || "N/A",
        toURL: evt.to?.href || "N/A",
        direction: evt.direction || "N/A",
      });
    });
  });
}

/**
 * Initialize all Astro integration features
 *
 * @param {Object} options Configuration options
 * @param {boolean} [options.usePageLoad=false] Use astro:page-load instead of astro:after-swap
 * @param {boolean} [options.debug=false] Enable debug logging
 * @param {boolean} [options.restoreScroll=false] Restore scroll position on navigation
 * @returns {Object} Astro integration status
 *
 * @example
 *   // Standard usage
 *   initAstro();
 *
 *   // With late re-initialization
 *   initAstro({ usePageLoad: true });
 *
 *   // With debugging enabled
 *   initAstro({ debug: true });
 *
 *   // Full options
 *   initAstro({
 *     usePageLoad: false,
 *     debug: false,
 *     restoreScroll: false
 *   });
 */
export function initAstro(options = {}) {
  const { usePageLoad = false, debug = false, restoreScroll = false } = options;

  if (typeof document === "undefined") {
    console.warn(
      "[Standard Astro] Document not available - running in non-browser environment"
    );
    return { success: false, reason: "non-browser-environment" };
  }

  // Check if View Transitions are actually enabled
  const viewTransitionsEnabled = supportsViewTransitions();

  if (debug) {
    console.log("[Standard Astro] Initializing...", {
      viewTransitionsEnabled,
      usePageLoad,
      restoreScroll,
    });
  }

  // Initialize theme detection
  initializeTheme();

  // Setup theme switching
  setupAstroThemeSwitching();

  // Setup scroll management
  setupAstroScrollManagement({ restoreScroll });

  // Setup module re-initialization
  if (usePageLoad) {
    setupAstroPageLoadReinitialization();
    if (debug) console.log("[Standard Astro] Using astro:page-load event");
  } else {
    setupAstroReinitialization();
    if (debug) console.log("[Standard Astro] Using astro:after-swap event");
  }

  // Setup optional debugging
  if (debug) {
    setupAstroDebugLogging();
    console.log("[Standard Astro] Debug logging enabled");
  }

  if (debug) {
    console.log("[Standard Astro] ✓ Initialization complete");
  }

  return {
    success: true,
    viewTransitionsEnabled,
    modules: ["imageZoom", "scrollWrappers", "copyButtons"],
  };
}

/**
 * Export helpers for manual control
 */
export const astroHelpers = {
  /**
   * Manually trigger re-initialization
   */
  reinitialize() {
    if (window.imageZoom && typeof window.imageZoom.rescan === "function") {
      window.imageZoom.rescan();
    }
    if (typeof initializeScrollWrappers === "function") {
      initializeScrollWrappers(document);
    }
    if (typeof initCopyButtons === "function") {
      initCopyButtons();
    }
  },

  /**
   * Check if View Transitions are supported
   */
  isSupported() {
    return supportsViewTransitions();
  },

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return currentTheme;
  },

  /**
   * Set theme manually
   */
  setTheme(theme) {
    currentTheme = theme;
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = theme;
    }
  },
};

/**
 * Auto-initialize on DOMContentLoaded
 *
 * Only auto-init if View Transitions are detected
 */
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (supportsViewTransitions()) {
        initAstro();
      }
    });
  } else {
    // Document already ready
    if (supportsViewTransitions()) {
      initAstro();
    }
  }
}

export default initAstro;
