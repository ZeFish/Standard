/**
 * Image Zoom - Standalone
 *
 * A lightweight image zoom library with keyboard navigation.
 * Click any image to zoom, use arrow keys to navigate, ESC to close.
 *
 * Features:
 * - Click to zoom in/out
 * - Keyboard navigation (←/→ arrows)
 * - ESC to close
 * - Wraps around image gallery
 * - Auto-injects required CSS
 * - Custom events for extensibility
 * - Configurable selectors
 *
 * @version @VERSION_PLACEHOLDER@
 * @license MIT
 * @author Your Name
 */

class ImageZoom {
  constructor(options = {}) {
    this.options = {
      selector: "img:not([data-no-zoom])", // Which images are zoomable
      zoomedClass: "zoomed", // Class added to zoomed image
      enableKeyboardNav: true, // Arrow keys to navigate
      enableCustomEvents: true, // Dispatch custom events
      ...options,
    };

    this.currentZoomedImage = null;
    this.images = [];

    this.init();
  }

  /**
   * Initialize the zoom functionality
   */
  init() {
    this.bindClickEvents();

    if (this.options.enableKeyboardNav) {
      this.bindKeyboardEvents();
    }

    this.dispatchEvent("initialized", {});
  }

  /**
   * Refresh list of zoomable images (useful after DOM updates)
   */
  refreshImages() {
    this.images = Array.from(document.querySelectorAll(this.options.selector));
    return this.images.length;
  }

  /**
   * Bind click events for zoom toggle
   */
  bindClickEvents() {
    document.addEventListener("click", (e) => {
      const img = e.target.closest(this.options.selector);

      if (img) {
        e.preventDefault();
        e.stopPropagation();
        this.toggle(img);
      } else if (this.currentZoomedImage) {
        // Click anywhere else closes zoom
        this.close();
      }
    });
  }

  /**
   * Bind keyboard events for navigation
   */
  bindKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
      if (!this.currentZoomedImage) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          this.close();
          break;

        case "ArrowLeft":
          e.preventDefault();
          this.navigate(-1);
          break;

        case "ArrowRight":
          e.preventDefault();
          this.navigate(1);
          break;

        case "ArrowUp":
          e.preventDefault();
          this.navigate(-1);
          break;

        case "ArrowDown":
          e.preventDefault();
          this.navigate(1);
          break;
      }
    });
  }

  /**
   * Toggle zoom on an image
   * @param {HTMLImageElement} img - The image element to toggle
   */
  toggle(img) {
    if (this.currentZoomedImage === img) {
      this.close();
    } else {
      this.open(img);
    }
  }

  /**
   * Open image zoom
   * @param {HTMLImageElement} img - The image element to zoom
   */
  open(img) {
    // Close any currently zoomed image
    if (this.currentZoomedImage) {
      this.close();
    }

    img.classList.add(this.options.zoomedClass);
    this.currentZoomedImage = img;

    // Prevent body scroll
    document.body.classList.add("image-zoomed");

    // Dispatch custom event
    this.dispatchEvent("open", { image: img });
  }

  /**
   * Close image zoom
   */
  close() {
    if (!this.currentZoomedImage) return;

    const img = this.currentZoomedImage;

    img.classList.remove(this.options.zoomedClass);
    this.currentZoomedImage = null;

    // Restore body scroll
    document.body.classList.remove("image-zoomed");

    // Dispatch custom event
    this.dispatchEvent("close", { image: img });
  }

  /**
   * Navigate between images while zoomed
   * @param {number} direction - 1 for next, -1 for previous
   */
  navigate(direction) {
    if (!this.currentZoomedImage) return;

    // Refresh images list in case DOM changed
    this.refreshImages();

    const currentIndex = this.images.indexOf(this.currentZoomedImage);
    if (currentIndex === -1) return;

    const newIndex = currentIndex + direction;

    // Wrap around (loop back to start/end)
    const nextIndex = (newIndex + this.images.length) % this.images.length;
    const nextImage = this.images[nextIndex];

    if (nextImage) {
      this.open(nextImage);
    }
  }

  /**
   * Dispatch custom events for extensibility
   * @param {string} eventName - Name of the event (without prefix)
   * @param {Object} detail - Event detail object
   */
  dispatchEvent(eventName, detail) {
    if (!this.options.enableCustomEvents) return;
    if (typeof CustomEvent === "undefined") return;

    document.dispatchEvent(
      new CustomEvent(`imagezoom:${eventName}`, {
        detail: {
          ...detail,
          timestamp: Date.now(),
          instance: this,
        },
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  /**
   * Update options after initialization
   * @param {Object} newOptions - New options to merge
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };

    // Re-inject styles if backdrop opacity changed
    if (newOptions.backdropOpacity !== undefined) {
      const styleEl = document.getElementById("image-zoom-styles");
      if (styleEl) {
        styleEl.remove();
      }
      this.injectStyles();
    }

    this.dispatchEvent("optionsUpdated", { options: this.options });
  }

  /**
   * Get current state
   * @returns {Object} Current state information
   */
  getState() {
    return {
      isZoomed: !!this.currentZoomedImage,
      currentImage: this.currentZoomedImage,
      totalImages: this.refreshImages(),
      currentIndex: this.currentZoomedImage
        ? this.images.indexOf(this.currentZoomedImage)
        : -1,
    };
  }

  /**
   * Cleanup and destroy instance
   */
  destroy() {
    // Close any open zoom
    if (this.currentZoomedImage) {
      this.close();
    }

    // Remove injected styles
    const styleEl = document.getElementById("image-zoom-styles");
    if (styleEl) {
      styleEl.remove();
    }

    this.dispatchEvent("destroyed", {});

    // Clear references
    this.currentZoomedImage = null;
    this.images = [];
  }
}

// ============================================
// AUTO-INITIALIZATION
// ============================================

if (typeof window !== "undefined") {
  // Make class available globally
  window.ImageZoom = ImageZoom;

  // Auto-initialize on DOM ready
  const initImageZoom = () => {
    window.imageZoom = new ImageZoom();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initImageZoom);
  } else {
    initImageZoom();
  }
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ImageZoom };
}

if (typeof exports !== "undefined") {
  exports.ImageZoom = ImageZoom;
}
