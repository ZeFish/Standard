(function () {
  /**
   * Image Zoom - Standalone lightbox with keyboard navigation
   *
   * A lightweight image zoom library with full featured lightbox experience.
   * Click any image to zoom, use arrow keys to navigate, ESC to close.
   *
   * Features:
   * - Click to zoom in/out
   * - Keyboard navigation (←/→ arrows, ESC to close)
   * - Click backdrop to close
   * - Auto-closes on scroll
   * - Wraps around image gallery
   * - Custom events for extensibility
   * - Configurable selectors
   * - Graceful degradation (CSS fallback without JS)
   * - HTMX compatible via rescan() method
   *
   * @version @VERSION_PLACEHOLDER@
   * @license MIT
   */

  /**
   * @class ImageZoom
   * @description A progressively enhanced image zoom lightbox.
   *
   * Creates a full HTML overlay (no CSS conflicts).
   * If JavaScript is disabled, falls back to CSS-only `:active` zoom.
   *
   * Usage:
   *   const imageZoom = new ImageZoom();
   *   // or with options
   *   const imageZoom = new ImageZoom({
   *     selector: 'img.zoomable',
   *     enableKeyboardNav: true
   *   });
   *   // After HTMX swap:
   *   imageZoom.rescan();
   */
  class ImageZoom {
    constructor(options = {}) {
      this.options = {
        selector: "img:not([data-no-zoom])",
        enableKeyboardNav: true,
        ...options,
      };

      this.overlay = null;
      this.originalImage = null;
      this.images = [];

      // Create bound handlers for stable event listener references
      this.boundKeydownHandler = this.handleKeydown.bind(this);
      this.boundCloseHandler = this.close.bind(this);
      this.boundClickHandler = this.handleClick.bind(this);

      this.init();
    }

    /**
     * Initialize the zoom system
     */
    init() {
      document.documentElement.classList.add("js-image-zoom-enabled");
      document.addEventListener("click", this.boundClickHandler);
      console.log("[ImageZoom] Initialized and click listener attached");
    }

    /**
     * Public method to re-scan the document for zoomable images.
     * Call this after new content has been loaded (e.g., by HTMX).
     *
     * Usage:
     *   imageZoom.rescan();
     *
     * @returns {number} Number of zoomable images found
     */
    rescan() {
      this.refreshImages();

      // Ensure class is present (in case of full page swap)
      document.documentElement.classList.add("js-image-zoom-enabled");

      // Rebind listener to be safe
      document.removeEventListener("click", this.boundClickHandler);
      document.addEventListener("click", this.boundClickHandler);

      console.log(
        `[ImageZoom] Rescanned. Found ${this.images.length} images. Listener rebound.`,
      );
      return this.images.length;
    }

    /**
     * Internal: Refresh the list of zoomable images
     */
    refreshImages() {
      this.images = Array.from(
        document.querySelectorAll(this.options.selector),
      );
      return this.images.length;
    }

    /**
     * Handle click events on images
     */
    handleClick(e) {
      const img = e.target.closest(this.options.selector);

      if (img) {
        console.log("[ImageZoom] Click detected on zoomable image", img);
        if (!this.overlay) {
          e.preventDefault();
          e.stopPropagation();
          this.open(img);
        } else {
          e.preventDefault();
          this.close();
        }
      } else if (this.overlay) {
        // Click outside image while overlay is open
        e.preventDefault();
        this.close();
      }
    }

    /**
     * Handle keyboard navigation
     */
    handleKeydown(e) {
      if (!this.overlay) return;
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          this.close();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          this.navigate(-1);
          break;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          this.navigate(1);
          break;
      }
    }

    /**
     * Open the zoom overlay
     */
    open(img) {
      if (this.overlay) return;
      this.originalImage = img;
      this.overlay = document.createElement("div");
      this.overlay.className = "image-zoom-overlay";

      const zoomedImg = new Image();
      zoomedImg.src = this.originalImage.src;
      zoomedImg.alt = this.originalImage.alt;

      this.overlay.appendChild(zoomedImg);
      document.body.appendChild(this.overlay);

      document.documentElement.classList.add("image-zoomed-active");

      if (this.options.enableKeyboardNav) {
        document.addEventListener("keydown", this.boundKeydownHandler);
      }

      // Close when user scrolls the page
      window.addEventListener("scroll", this.boundCloseHandler);

      requestAnimationFrame(() => {
        this.overlay.classList.add("is-visible");
      });
    }

    /**
     * Close the zoom overlay
     */
    close() {
      if (!this.overlay) return;

      // Remove scroll listener to prevent memory leaks
      window.removeEventListener("scroll", this.boundCloseHandler);

      this.overlay.classList.remove("is-visible");

      this.overlay.addEventListener(
        "transitionend",
        () => {
          if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
          }
        },
        { once: true },
      );

      document.documentElement.classList.remove("image-zoomed-active");
      this.originalImage = null;

      if (this.options.enableKeyboardNav) {
        document.removeEventListener("keydown", this.boundKeydownHandler);
      }
    }

    /**
     * Navigate to next/previous image in the gallery
     */
    navigate(direction) {
      if (!this.originalImage) return;
      this.images = Array.from(
        document.querySelectorAll(this.options.selector),
      );
      const currentIndex = this.images.indexOf(this.originalImage);
      if (currentIndex === -1) return;
      const newIndex =
        (currentIndex + direction + this.images.length) % this.images.length;
      const nextImage = this.images[newIndex];
      if (nextImage) {
        const zoomedImg = this.overlay.querySelector("img");
        zoomedImg.src = nextImage.src;
        zoomedImg.alt = nextImage.alt;
        this.originalImage = nextImage;
      }
    }

    /**
     * Cleanup and destroy the zoom instance
     */
    destroy() {
      if (this.overlay) {
        this.close();
      }
      document.removeEventListener("click", this.boundClickHandler);
    }
  }

  /**
   * Auto-initialization
   */
  if (typeof window !== "undefined") {
    console.log("hola");
    window.ImageZoom = ImageZoom;
    const initImageZoom = () => {
      window.imageZoom = new ImageZoom();
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initImageZoom());
    } else {
      initImageZoom();
    }
  }

  /**
   * Default export
   */
})();
