/**
 * Manages the visibility of "end-of-scroll" shadow indicators on a .table-wrapper.
 *
 * This script implements an inverse shadow logic:
 * - A right shadow appears only when the user has scrolled fully to the left.
 * - A left shadow appears only when the user has scrolled fully to the right.
 */
document.addEventListener("DOMContentLoaded", () => {
  const tableWrappers = document.querySelectorAll(".scroll");

  tableWrappers.forEach((wrapper) => {
    const handleScroll = () => {
      // First, check if there is any overflow content at all
      const hasOverflow = wrapper.scrollWidth > wrapper.clientWidth;

      // If there's no overflow, ensure no shadows are shown and stop.
      if (!hasOverflow) {
        wrapper.classList.remove("show-left-shadow", "show-right-shadow");
        return;
      }

      const scrollLeft = wrapper.scrollLeft;
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

      // --- YOUR CUSTOM LOGIC ---

      // Rule 1: Show right shadow ONLY when scroll is at the very beginning.
      wrapper.classList.toggle("show-right-shadow", scrollLeft === 0);

      // Rule 2: Show left shadow ONLY when scroll is at the very end.
      wrapper.classList.toggle("show-left-shadow", scrollLeft >= maxScroll - 1);
    };

    // Run once on load to set the initial state
    handleScroll();

    // Run on every scroll event
    wrapper.addEventListener("scroll", handleScroll, { passive: true });

    // Also run if the window is resized, as this might change the overflow
    window.addEventListener("resize", handleScroll);
  });
});

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

/**
 * @class ImageZoom
 * @description A progressively enhanced image zoom lightbox.
 *
 * This script provides a full-featured lightbox experience. If JavaScript is disabled or fails,
 * it gracefully degrades to a CSS-only zoom effect triggered by the `:active` state.
 *
 * Features:
 * - Creates a full HTML overlay, preventing any CSS conflicts.
 * - Keyboard navigation (Arrow keys for next/previous, ESC to close).
 * - Click the backdrop to close.
 * - Graceful fade-in and fade-out animations.
 * - Announces its presence to CSS via a `js-image-zoom-enabled` class on the <html> tag,
 *   allowing CSS to disable its own fallback styles.
 */
/**
 * @class ImageZoom
 * @description A progressively enhanced image zoom lightbox.
 * Now closes automatically when the user scrolls the page.
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

    // --- NEW (1/3): Create bound handlers for listeners ---
    // This provides a stable function reference for adding and removing event listeners.
    this.boundKeydownHandler = this.handleKeydown.bind(this);
    this.boundCloseHandler = this.close.bind(this); // <-- ADD THIS LINE

    this.init();
  }

  init() {
    document.documentElement.classList.add("js-image-zoom-enabled");
    document.addEventListener("click", this.handleClick.bind(this));
  }

  handleClick(e) {
    const img = e.target.closest(this.options.selector);

    if (img && !this.overlay) {
      e.preventDefault();
      e.stopPropagation();
      this.open(img);
    } else if (this.overlay) {
      e.preventDefault();
      this.close();
    }
  }

  handleKeydown(e) {
    // ... (This method remains unchanged)
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

    // --- NEW (2/3): Add scroll listener to close the zoom ---
    window.addEventListener("scroll", this.boundCloseHandler); // <-- ADD THIS LINE

    requestAnimationFrame(() => {
      this.overlay.classList.add("is-visible");
    });
  }

  close() {
    if (!this.overlay) return;

    // --- NEW (3/3): Remove scroll listener on close ---
    // This is crucial to prevent memory leaks and unwanted behavior.
    window.removeEventListener("scroll", this.boundCloseHandler); // <-- ADD THIS LINE

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

  navigate(direction) {
    // ... (This method remains unchanged)
    if (!this.originalImage) return;
    this.images = Array.from(document.querySelectorAll(this.options.selector));
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

  destroy() {
    if (this.overlay) {
      this.close();
    }
    document.removeEventListener("click", this.handleClick.bind(this));
  }
}

// Auto-initialization
if (typeof window !== "undefined") {
  window.ImageZoom = ImageZoom;
  const initImageZoom = () => {
    window.imageZoom = new ImageZoom();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initImageZoom);
  } else {
    initImageZoom();
  }
}
