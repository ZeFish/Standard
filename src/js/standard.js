/**
 * Manages the visibility of "end-of-scroll" shadow indicators on a .table-wrapper.
 *
 * This script implements an inverse shadow logic:
 * - A right shadow appears only when the user has scrolled fully to the left.
 * - A left shadow appears only when the user has scrolled fully to the right.
 */

function initCopyButtons() {
  // Defensive check: does clipboard API exist?
  if (!navigator.clipboard) {
    console.warn("Clipboard API not available (requires HTTPS)");
    return;
  }

  document.querySelectorAll("pre > code").forEach((el) => {
    // Don't add button twice if called multiple times
    if (el.parentNode.querySelector(".copy-button")) {
      return;
    }

    const btn = document.createElement("button");
    btn.className = "copy-button";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");

    btn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(el.innerText);
        btn.textContent = "Copied!";
        btn.classList.add("copied");

        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        btn.textContent = "Failed";
        setTimeout(() => {
          btn.textContent = "Copy";
        }, 2000);
      }
    };

    el.parentNode.append(btn);
  });
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCopyButtons);
} else {
  // DOM already loaded (script at end of body)
  initCopyButtons();
}

// Optional: Export for manual triggering
if (typeof window !== "undefined") {
  window.initCopyButtons = initCopyButtons;
}

/**
 * Finds all scroll wrappers that haven't been initialized yet and attaches
 * the necessary event listeners for the shadow effect.
 *
 * @param {Element} [rootElement=document] - The element to search within.
 *   Defaults to the entire document. Scoping this makes it more efficient
 *   for HTMX swaps.
 */

function initializeScrollWrappers(rootElement = document) {
  // Find all .scroll elements that DO NOT have our initialized marker
  const newWrappers = rootElement.querySelectorAll(
    ".scroll:not([data-scroll-initialized])",
  );

  newWrappers.forEach((wrapper) => {
    // The core logic is the same as your original script
    const handleScroll = () => {
      const hasOverflow = wrapper.scrollWidth > wrapper.clientWidth;

      if (!hasOverflow) {
        wrapper.classList.remove("show-left-shadow", "show-right-shadow");
        return;
      }

      const scrollLeft = wrapper.scrollLeft;
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

      wrapper.classList.toggle("show-right-shadow", scrollLeft === 0);
      wrapper.classList.toggle("show-left-shadow", scrollLeft >= maxScroll - 1);
    };

    // Run the check immediately to set the initial state
    handleScroll();

    // Add the event listeners
    wrapper.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll); // Re-check on resize

    // --- THIS IS THE KEY ---
    // Mark this element as "initialized" so we don't process it again.
    wrapper.dataset.scrollInitialized = "true";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeScrollWrappers(document);
});

// Add this script to your base layout
document.body.addEventListener("htmx:beforeSwap", (evt) => {
  // Parse the full HTML response
  const parser = new DOMParser();
  const doc = parser.parseFromString(evt.detail.xhr.responseText, "text/html");

  // Extract theme from the response's <html> tag
  const newTheme = doc.documentElement.dataset.theme;

  if (newTheme) {
    // Apply it to current page's <html>
    document.documentElement.dataset.theme = newTheme;
  }
});

document.body.addEventListener("htmx:afterSettle", function (event) {
  // Check if our global imageZoom instance exists
  if (window.imageZoom) {
    // Tell the existing instance to find any new images
    // that were just loaded onto the page.
    window.imageZoom.rescan();
  }
  initializeScrollWrappers(event.detail.elt);
  initCopyButtons();
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

  /**
   * Public method to re-scan the document for zoomable images.
   * Ideal for calling after new content has been loaded by HTMX or other libraries.
   */
  rescan() {
    // The refreshImages method already contains the logic to find all images.
    // We're just exposing it through a clean public method.
    this.refreshImages();
    console.log(`ImageZoom rescanned. Found ${this.images.length} images.`);
  }

  refreshImages() {
    this.images = Array.from(document.querySelectorAll(this.options.selector));
    return this.images.length;
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
