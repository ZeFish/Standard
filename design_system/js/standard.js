/**
 * Standard Framework - Main Entry Point
 *
 * This file serves as both:
 * 1. An ES module entry point for direct imports (for bundlers like Astro)
 * 2. A distributed UMD/IIFE export for npm consumers
 *
 * When distributed as @zefish/standard/js, this becomes dist/standard.min.js
 * (via build-js.js bundling all modules together).
 *
 * Usage:
 *   // In Astro or modern bundler
 *   import standard from '@zefish/standard';
 *
 *   // Or import specific parts
 *   import { toast, comments, ImageZoom } from '@zefish/standard';
 *
 * @version @VERSION_PLACEHOLDER@
 */

// Re-export all public APIs from individual modules
export { default as toast } from "./standard.toast.js";
export { default as comments, GitHubComments } from "./standard.comment.js";
export { StandardLab } from "./standard.lab.js";
export { ImageZoom, default as imageZoom } from "./standard.image-zoom.js";
export { initCopyButtons } from "./standard.copy-buttons.js";
export { initScrollWrappers } from "./standard.scroll-wrappers.js";
export { initAstro, astroHelpers } from "./standard.astro.js";
export { initHTMX } from "./standard.htmx.js";

// Import for internal use
import { default as imageZoom } from "./standard.image-zoom.js";
import { initCopyButtons } from "./standard.copy-buttons.js";
import { initScrollWrappers } from "./standard.scroll-wrappers.js";

/**
 * Main namespace object
 */
const standard = {
  version: "@VERSION_PLACEHOLDER@",

  getInstance(moduleName) {
    if (typeof window === "undefined") return null;
    switch (moduleName) {
      case "toast":
        return window.toast || null;
      case "comments":
        return window.comments || null;
      case "StandardLab":
        return window.StandardLab || null;
      case "imageZoom":
        return window.imageZoom || null;
      default:
        console.warn(
          `Unknown module: ${moduleName}. Available: toast, comments, StandardLab, imageZoom`,
        );
        return null;
    }
  },

  getInstances() {
    if (typeof window === "undefined") {
      return {
        toast: null,
        comments: null,
        StandardLab: null,
        imageZoom: null,
      };
    }
    return {
      toast: window.toast || null,
      comments: window.comments || null,
      StandardLab: window.StandardLab || null,
      imageZoom: window.imageZoom || null,
    };
  },

  detectFramework() {
    if (typeof window === "undefined") return "none";
    if (window.startViewTransition) return "astro-view-transitions";
    if (window.astro) return "astro";
    if (window.htmx) return "htmx (deprecated)";
    return "none";
  },

  /**
   * Refresh all UI components
   * Useful after dynamic content updates (HTMX, Astro transitions, etc.)
   */
  refresh() {
    if (typeof window === "undefined") return;

    // Rescan images for zoom
    if (window.imageZoom && typeof window.imageZoom.rescan === "function") {
      window.imageZoom.rescan();
    }

    // Re-initialize copy buttons
    if (typeof initCopyButtons === "function") {
      initCopyButtons();
    }

    // Re-initialize scroll wrappers
    if (typeof initScrollWrappers === "function") {
      initScrollWrappers();
    }
  },

  /**
   * Initialize the framework and set up event listeners
   */
  init() {
    if (typeof window === "undefined") return;

    // Initial setup
    this.refresh();

    // Astro View Transitions support
    document.addEventListener("astro:page-load", () => {
      this.refresh();
    });

    // HTMX support
    document.body.addEventListener("htmx:afterSettle", () => {
      this.refresh();
    });
  },

  info() {
    const framework = this.detectFramework();
    console.log(`Standard Framework v${this.version}`);
    console.log(`Framework detected: ${framework}`);
    console.log("Modules:", [
      "toast - Notification system",
      "comments - GitHub-backed comments",
      "StandardLab - Design token inspector",
      "imageZoom - Click-to-zoom lightbox",
      "initCopyButtons() - Copy buttons for code blocks",
      "initScrollWrappers() - Scroll shadows",
    ]);
    console.log("Integrations:", [
      "✓ initAstro() - For Astro View Transitions API (recommended)",
      "⚠ initHTMX() - For HTMX navigation (legacy, use View Transitions instead)",
    ]);
    console.log("\n📚 Learn more:");
    console.log(
      "  Astro View Transitions: https://docs.astro.build/en/guides/view-transitions/",
    );
  },
};

export default standard;

// Expose to global scope and auto-init
if (typeof window !== "undefined") {
  window.standard = standard;

  // Auto-initialize on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => standard.init());
  } else {
    standard.init();
  }

  console.log(
    "Standard Framework loaded. Type window.standard.info() for help.",
  );
}
