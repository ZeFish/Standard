(function () {
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

  // Note: ES module exports/imports removed for bundling compatibility
  // When bundled, all modules are combined into a single IIFE that exposes
  // the API via window.standard. Individual modules define their own globals.

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

      // Check for Astro's data-astro-cid-* attributes on the html element
      const html = document.documentElement;
      if (
        Array.from(html.attributes).some((attr) =>
          attr.name.startsWith("data-astro-cid-"),
        )
      ) {
        return "astro";
      }

      if (window.htmx) return "htmx";
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
      if (this.detectFramework() == "astro") {
        document.addEventListener("astro:page-load", () => {
          this.refresh();
        });
      }

      // HTMX support
      if (this.detectFramework() == "htmx") {
        document.body.addEventListener("htmx:afterSettle", () => {
          this.refresh();
        });
      }
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
})();
