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
    this.this.originalImage = img;
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

/**
 * Toast Notification System
 *
 * @version 1.0.0
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 2004, Gmail launched with a revolutionary feature: transient notifications
 * that appeared in the corner of your screen—"Message sent"—and vanished after
 * a few seconds. No dialog box to dismiss. No modal blocking your workflow.
 * Just a gentle confirmation that something happened, then gone.
 *
 * They called them "toast notifications" because they pop up like toast from
 * a toaster. The metaphor stuck. Within a year, every web app copied the pattern.
 * Why? Because toasts solve a fundamental UX problem: how do you give feedback
 * without interrupting the user's flow?
 *
 * This implementation provides a complete toast system: programmatic creation,
 * auto-dismiss with progress bars, stacking, pause-on-hover, keyboard dismissal,
 * and full accessibility with ARIA live regions. It's lightweight (~200 lines),
 * dependency-free, and respects the Standard Framework's design philosophy.
 *
 * Usage:
 *   toast.success('Saved successfully!');
 *   toast.error('Something went wrong');
 *   toast.info('New message', { duration: 5000, position: 'bottom-right' });
 *
 * @link https://www.nngroup.com/articles/toast/ NN/g Toast Guidelines
 * @link https://www.w3.org/WAI/ARIA/apg/patterns/alert/ ARIA Alert Pattern
 */

(function (global) {
  "use strict";

  /**
   * Toast Configuration Defaults
   */
  const DEFAULTS = {
    duration: 4000, // Auto-dismiss after 4 seconds
    position: "top-center", // top-right, top-left, top-center, bottom-right, bottom-left, bottom-center
    pauseOnHover: true, // Pause auto-dismiss when hovering
    showProgress: true, // Show countdown progress bar
    closeButton: false, // Show close button
    maxToasts: 5, // Maximum simultaneous toasts (queue others)
    animation: "slide", // slide, fade
    role: "status", // ARIA role: status (polite) or alert (assertive)
  };

  /**
   * Toast Container Management
   */
  const containers = {};

  /**
   * Active toasts queue
   */
  let toastQueue = [];
  let activeToasts = 0;

  /**
   * Get or create toast container for a position
   */
  function getContainer(position) {
    if (containers[position]) {
      return containers[position];
    }

    const container = document.createElement("div");
    container.className = `toast-container toast-container-${position}`;
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "false");
    document.body.appendChild(container);

    containers[position] = container;
    return container;
  }

  /**
   * Create a toast element
   */
  function createToast(message, type, options) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", options.role);

    // Toast content structure
    const content = document.createElement("div");
    content.className = "toast-content";

    // Icon (optional, based on type)
    const icon = document.createElement("span");
    icon.className = "toast-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = getIcon(type);

    // Message
    const messageEl = document.createElement("div");
    messageEl.className = "toast-message";
    messageEl.textContent = message;

    content.appendChild(icon);
    content.appendChild(messageEl);

    // Close button
    if (options.closeButton) {
      const closeBtn = document.createElement("button");
      closeBtn.className = "toast-close";
      closeBtn.setAttribute("aria-label", "Close notification");
      closeBtn.innerHTML = "×";
      closeBtn.addEventListener("click", () => dismissToast(toast));
      content.appendChild(closeBtn);
    }

    toast.appendChild(content);

    // Progress bar
    if (options.showProgress && options.duration > 0) {
      const progress = document.createElement("div");
      progress.className = "toast-progress";
      toast.appendChild(progress);

      // Store for animation
      toast._progressBar = progress;
    }

    return toast;
  }

  /**
   * Get icon for toast type
   */
  function getIcon(type) {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };
    return icons[type] || "ℹ";
  }

  /**
   * Show a toast notification
   */
  function showToast(message, type = "info", userOptions = {}) {
    const options = { ...DEFAULTS, ...userOptions };

    // If max toasts reached, queue this one
    if (activeToasts >= options.maxToasts) {
      toastQueue.push({ message, type, options });
      return;
    }

    const container = getContainer(options.position);
    const toast = createToast(message, type, options);

    // Add to DOM
    container.appendChild(toast);
    activeToasts++;

    // Trigger reflow for animation
    toast.offsetHeight;

    // Add visible class for slide-in animation
    requestAnimationFrame(() => {
      toast.classList.add("toast-visible");
    });

    // Auto-dismiss logic
    let timeoutId;
    let startTime;
    let remainingTime = options.duration;

    function startDismissTimer() {
      if (options.duration <= 0) return;

      startTime = Date.now();
      timeoutId = setTimeout(() => {
        dismissToast(toast);
      }, remainingTime);

      // Animate progress bar
      if (toast._progressBar) {
        toast._progressBar.style.transition = `width ${remainingTime}ms linear`;
        toast._progressBar.style.width = "0%";
      }
    }

    function pauseDismissTimer() {
      if (options.duration <= 0) return;

      clearTimeout(timeoutId);
      remainingTime -= Date.now() - startTime;

      // Pause progress bar
      if (toast._progressBar) {
        const computedStyle = window.getComputedStyle(toast._progressBar);
        toast._progressBar.style.width = computedStyle.width;
        toast._progressBar.style.transition = "none";
      }
    }

    // Pause on hover
    if (options.pauseOnHover) {
      toast.addEventListener("mouseenter", pauseDismissTimer);
      toast.addEventListener("mouseleave", startDismissTimer);
    }

    // Start auto-dismiss
    startDismissTimer();

    // Keyboard dismissal (Escape key)
    const escapeHandler = (e) => {
      if (e.key === "Escape") {
        dismissToast(toast);
      }
    };
    document.addEventListener("keydown", escapeHandler);
    toast._escapeHandler = escapeHandler;

    return toast;
  }

  /**
   * Dismiss a toast with animation
   */
  function dismissToast(toast) {
    // Remove visible class for slide-out animation
    toast.classList.remove("toast-visible");
    toast.classList.add("toast-dismissing");

    // Remove from DOM after animation
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }

      // Clean up event listener
      if (toast._escapeHandler) {
        document.removeEventListener("keydown", toast._escapeHandler);
      }

      activeToasts--;

      // Show next queued toast
      if (toastQueue.length > 0) {
        const next = toastQueue.shift();
        showToast(next.message, next.type, next.options);
      }
    }, 300); // Match CSS animation duration
  }

  /**
   * Public API
   */
  const toast = {
    /**
     * Show success toast
     */
    success(message, options = {}) {
      return showToast(message, "success", options);
    },

    /**
     * Show error toast
     */
    error(message, options = {}) {
      return showToast(message, "error", { ...options, role: "alert" });
    },

    /**
     * Show warning toast
     */
    warning(message, options = {}) {
      return showToast(message, "warning", options);
    },

    /**
     * Show info toast
     */
    info(message, options = {}) {
      return showToast(message, "info", options);
    },

    /**
     * Show custom toast
     */
    show(message, type = "info", options = {}) {
      return showToast(message, type, options);
    },

    /**
     * Dismiss all toasts
     */
    dismissAll() {
      Object.values(containers).forEach((container) => {
        const toasts = container.querySelectorAll(".toast");
        toasts.forEach(dismissToast);
      });
      toastQueue = [];
    },

    /**
     * Configure default options
     */
    configure(options) {
      Object.assign(DEFAULTS, options);
    },
  };

  // Expose to global scope
  if (typeof module !== "undefined" && module.exports) {
    module.exports = toast;
  } else {
    global.toast = toast;
  }
})(typeof window !== "undefined" ? window : this);

/**
 * GitHub Comment
 *
 * HTMX-COMPATIBLE VERSION: Includes a robust event listener at the end
 * to re-initialize the comments widget safely after HTMX page loads.
 * This version moves all initialization logic inside a DOMContentLoaded
 * check to prevent minification-related variable collisions and timing errors.
 *
 * @version @VERSION_PLACEHOLDER@
 */

(function (global) {
  "use strict";

  /* ========================================================
   * ORIGINAL GITHUB COMMENTS LIBRARY (Unchanged)
   * ======================================================== */
  class GitHubComments {
    constructor(options = {}) {
      this.apiUrl = options.apiUrl || "/api/comments";
      this.pageId = options.pageId;
      this.container =
        typeof options.container === "string"
          ? document.querySelector(options.container)
          : options.container || document.querySelector("#comments");
      this.formSelector = options.form || "#comment-form";
      this.comments = [];
      this.loading = false;
      this.pollInterval = options.pollInterval || null;
      this.pollTimer = null;
      this.onLoad = options.onLoad || null;
      this.onRender = options.onRender || null;
    }

    async load() {
      if (!this.pageId) {
        console.error("GitHubComments: pageId is required");
        this.error = "Configuration error: pageId is required";
        return [];
      }

      this.loading = true;
      this.error = null; // Clear any previous errors

      try {
        const response = await fetch(
          `${this.apiUrl}?pageId=${encodeURIComponent(this.pageId)}`,
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        this.comments = data.comments || [];
        this.loading = false;

        if (typeof this.onLoad === "function") {
          try {
            this.onLoad(this.comments);
          } catch (e) {
            /* swallow user errors */
          }
        }
        return this.comments;
      } catch (error) {
        console.error("Error loading comments:", error);
        this.loading = false;

        // --- ADD THESE LINES ---
        // Store a user-friendly error message
        this.error =
          error.message || "Failed to load comments. Please try again later.";

        return [];
      }
    }

    async submit(data) {
      try {
        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageId: this.pageId, ...data }),
        });
        if (!response.ok) {
          let errorMessage = `API error: ${response.status}`;
          try {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
          } catch (e) {
            errorMessage = `API endpoint not available (${response.status})`;
          }
          throw new Error(errorMessage);
        }
        const result = await response.json();
        if (result.comment) {
          this.comments.push(result.comment);
          this.comments.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
        }
        return result;
      } catch (error) {
        console.error("Error submitting comment:", error);
        throw error;
      }
    }

    formatTime(dateStr) {
      const date = new Date(dateStr);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      if (seconds < 60) return "just now";
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
      return date.toLocaleDateString();
    }

    escapeHTML(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }

    formatContent(content) {
      let html = this.escapeHTML(content);
      html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
      html = html.replace(/_(.+?)_/g, "<em>$1</em>");
      html = html.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");
      html = html.replace(/`(.+?)`/g, "<code>$1</code>");
      html = html.replace(
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
      );
      html = html.replace(/\n/g, "<br>");
      return html;
    }

    renderComment(comment, level = 0) {
      const approved = comment.approved !== false ? "" : ' data-pending="true"';
      const spam = comment.spam ? ' data-spam="true"' : "";
      return `
        <div class="comment" data-id="${this.escapeHTML(String(comment.id))}" data-level="${level}"${approved}${spam}">
          <div class="comment-header">
            <span class="comment-author">${this.escapeHTML(comment.author || "Anonymous")}</span>
            <span class="comment-date">${this.formatTime(comment.createdAt)}</span>
            ${comment.spam ? '<span class="comment-flag">Flagged as spam</span>' : ""}
            ${!comment.approved ? '<span class="comment-pending">Awaiting moderation</span>' : ""}
          </div>
          <div class="comment-content">${this.formatContent(comment.content || "")}</div>
        </div>
      `;
    }

    buildCommentTree() {
      const byId = {};
      const roots = [];
      for (const comment of this.comments) {
        byId[comment.id] = { ...comment, replies: [] };
      }
      for (const comment of this.comments) {
        if (comment.parentId && byId[comment.parentId]) {
          byId[comment.parentId].replies.push(byId[comment.id]);
        } else {
          roots.push(byId[comment.id]);
        }
      }
      return roots;
    }

    renderTree(comments, level = 0) {
      return comments
        .map((comment) => {
          let html = this.renderComment(comment, level);
          if (comment.replies && comment.replies.length > 0) {
            html += `<div class="comment-replies">${this.renderTree(comment.replies, level + 1)}</div>`;
          }
          return html;
        })
        .join("");
    }

    /**
     * Show or hide the comment form based on current state
     */
    updateFormVisibility() {
      const showFormBtn = document.getElementById("show-comment-form-btn");
      if (!showFormBtn) return;

      // Hide button if there's an error, show it otherwise
      if (this.error) {
        showFormBtn.style.display = "none";
      } else {
        showFormBtn.style.display = "";
      }
    }

    render() {
      if (!this.container) {
        console.error("GitHubComments: container not found");
        return;
      }

      // If there's an error, show it and stop
      if (this.error) {
        this.container.innerHTML = `
            <aside class="comments debug" role="alert">
              Error loading comments: ${this.escapeHTML(this.error)}
            </aside>
          `;
        this.updateFormVisibility(); // <-- ADD THIS LINE
        return;
      }

      // If no comments and no error, show empty state
      if (this.comments.length === 0) {
        this.container.innerHTML =
          '<p class="comments-empty">No comments yet. Be the first to comment!</p>';
        this.updateFormVisibility(); // <-- ADD THIS LINE
        return;
      }

      // Otherwise, render the comments as normal
      const tree = this.buildCommentTree();
      this.container.innerHTML = this.renderTree(tree);
      this.attachReplyHandlers();
      this.updateFormVisibility(); // <-- ADD THIS LINE

      if (typeof this.onRender === "function") {
        try {
          this.onRender(this.container);
        } catch (e) {
          /* swallow */
        }
      }
    }

    attachReplyHandlers() {
      if (!this.container) return;
      this.container.querySelectorAll(".comment-reply").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const parentId = e.target.dataset.parentId;
          const form = document.querySelector(this.formSelector);
          if (form) {
            const parentInput = form.querySelector('[name="parentId"]');
            if (parentInput) parentInput.value = parentId;
            form.scrollIntoView({ behavior: "smooth" });
          }
        });
      });
    }

    attachFormHandler(formSelector = null) {
      const form = document.querySelector(formSelector || this.formSelector);
      if (!form) return;
      form.removeAttribute("hx-boost");
      form.setAttribute("hx-disable", "true");
      if (window.htmx) {
        const clone = form.cloneNode(true);
        form.parentNode.replaceChild(clone, form);
        const newForm = document.querySelector(
          formSelector || this.formSelector,
        );
        newForm.addEventListener("submit", this._handleFormSubmit.bind(this));
        return;
      }
      form.addEventListener("submit", this._handleFormSubmit.bind(this));
    }

    async _handleFormSubmit(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const form = e.target;
      const formData = new FormData(form);
      const data = {
        author: formData.get("author"),
        email: formData.get("email"),
        content: formData.get("content"),
        parentId: formData.get("parentId") || null,
      };
      const submitBtn = form.querySelector("button[type=submit]");
      const originalText = submitBtn ? submitBtn.textContent : "";
      const statusDiv = form.querySelector("#form-status");
      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Submitting...";
          submitBtn.style.opacity = "0.7";
        }
        if (statusDiv) {
          statusDiv.style.display = "block";
          statusDiv.textContent = "Sending your comment...";
          statusDiv.style.color = "var(--color-foreground, #000)";
        }
        const result = await this.submit(data);
        if (statusDiv) {
          statusDiv.textContent =
            "Comment submitted successfully! It will appear after moderation.";
          statusDiv.style.color = "var(--color-green, green)";
          setTimeout(() => {
            statusDiv.style.display = "none";
            statusDiv.textContent = "";
          }, 6000);
        }
        form.reset();
        const parentIdField = form.querySelector('[name="parentId"]');
        if (parentIdField) parentIdField.value = "";
        this.render();
        return result;
      } catch (error) {
        if (statusDiv) {
          statusDiv.textContent = `Error: ${error.message}`;
          statusDiv.style.color = "var(--color-red, red)";
          statusDiv.style.display = "block";
        }
        throw error;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.opacity = "1";
        }
      }
    }

    startPolling() {
      if (!this.pollInterval) return;
      this.stopPolling();
      this.pollTimer = setInterval(async () => {
        const before = this.comments.length;
        await this.load();
        if (this.comments.length > before) {
          this.render();
        }
      }, this.pollInterval);
    }

    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    }
  }

  function normalizePageId(pathOrId) {
    if (!pathOrId || typeof pathOrId !== "string") return "index";
    let id = pathOrId.trim();
    try {
      const u = new URL(id, window.location.origin);
      id = u.pathname;
    } catch (e) {
      /* not a full URL */
    }
    id = id.replace(/^\/|\/$/g, "");
    if (id === "") return "index";
    id = id.replace(/[\/]+/g, "_");
    id = id.replace(/[^A-Za-z0-9_-]/g, "_");
    return id;
  }

  const DEFAULTS = {
    apiUrl: "/api/comments",
    containerSelector: "#comments",
    formSelector: "#comment-form",
    pollInterval: null,
    autoInit: true,
    pageId: null,
    onLoad: null,
    onRender: null,
  };

  let _instance = null;
  let _configured = { ...DEFAULTS };

  const comments = {
    version: "@VERSION_PLACEHOLDER@",
    configure(options = {}) {
      Object.assign(_configured, options || {});
      return _configured;
    },
    getInstance() {
      return _instance;
    },
    createInstance(options = {}) {
      const opts = {
        apiUrl: _configured.apiUrl,
        container: options.container || _configured.containerSelector,
        form: options.formSelector || _configured.formSelector,
        pollInterval:
          options.pollInterval != null
            ? options.pollInterval
            : _configured.pollInterval,
        onLoad: options.onLoad || _configured.onLoad,
        onRender: options.onRender || _configured.onRender,
      };
      const explicitPageId =
        options.pageId || _configured.pageId || _getPageIdFromDOM();
      opts.pageId = normalizePageId(explicitPageId || window.location.pathname);
      _instance = new GitHubComments(opts);
      return _instance;
    },
    async init(options = {}) {
      if (typeof document === "undefined") return null;
      if (_instance && !options.recreate) return _instance;
      let container = options.container;
      if (!container) {
        const el =
          document.querySelector("[data-comments]") ||
          document.querySelector(_configured.containerSelector);
        container = el || _configured.containerSelector;
      }
      const inst = this.createInstance({ ...options, container });
      try {
        await inst.load();
        inst.render();
      } catch (e) {
        /* swallow */
      }
      try {
        inst.attachFormHandler(
          options.formSelector || _configured.formSelector,
        );
      } catch (e) {
        /* swallow */
      }
      if (inst.pollInterval) {
        inst.startPolling();
      }
      return inst;
    },
    async load() {
      if (!_instance) await this.init();
      if (!_instance) return [];
      return _instance.load();
    },
    render() {
      if (!_instance) {
        console.error("comments: not initialized");
        return;
      }
      return _instance.render();
    },
    attachFormHandler(selector) {
      if (!_instance) {
        console.error("comments: not initialized");
        return;
      }
      return _instance.attachFormHandler(selector);
    },
    submit(data) {
      if (!_instance) {
        return Promise.reject(new Error("comments: not initialized"));
      }
      return _instance.submit(data);
    },
    startPolling() {
      if (!_instance) {
        console.error("comments: not initialized");
        return;
      }
      return _instance.startPolling();
    },
    stopPolling() {
      if (!_instance) return;
      return _instance.stopPolling();
    },
    getPageId() {
      if (_instance && _instance.pageId) return _instance.pageId;
      const explicit = _configured.pageId || _getPageIdFromDOM();
      return normalizePageId(
        explicit ||
          (typeof window !== "undefined" ? window.location.pathname : "index"),
      );
    },
  };

  function _getPageIdFromDOM() {
    if (typeof document === "undefined") return null;
    const el = document.querySelector("[data-page-id]") || document.body;
    const attr = el && el.getAttribute && el.getAttribute("data-page-id");
    if (attr) return attr;
    const meta = document.querySelector('meta[name="page-id"]');
    if (meta && meta.content) return meta.content;
    const og = document.querySelector('meta[property="og:url"]');
    if (og && og.content) {
      try {
        const u = new URL(og.content);
        return u.pathname;
      } catch (e) {
        return og.content;
      }
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href) {
      try {
        const u = new URL(canonical.href);
        return u.pathname;
      } catch (e) {
        return canonical.href;
      }
    }
    return null;
  }

  /* ========================================================
   * ROBUST AUTO-INITIALIZATION & HTMX INTEGRATION (The Fix)
   * ======================================================== */

  // This setup function contains all logic that needs to run once the DOM is ready.
  function setupCommentsAndHTMX() {
    // --- Step 1: Run the original auto-initialization for the first page load ---
    if (_configured.autoInit && !_instance) {
      try {
        // The `comments` object is available here in our private scope.
        comments.init().catch(() => {
          /* ignore initial init errors */
        });
      } catch (e) {
        /* ignore */
      }
    }

    // --- Step 2: Add the HTMX listener to handle subsequent page loads ---
    // Using htmx:afterSettle which fires ONCE per request after all swaps are complete.
    document.body.addEventListener("htmx:afterSettle", function (event) {
      // Check if a comments section now exists on the page after the swap
      const commentsContainer = document.querySelector(
        "#comments, [data-comments]",
      );

      if (commentsContainer) {
        // 1. Stop any existing polling timer
        const oldInstance = comments.getInstance();
        if (oldInstance) {
          oldInstance.stopPolling();
        }

        // 2. Re-initialize the comments library for the new page content
        comments.init({ recreate: true });
      }
    });
  }

  // --- Main execution block ---
  // If in a browser, wait for the DOM to be ready, then run our setup function.
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setupCommentsAndHTMX);
    } else {
      // DOM is already ready
      setupCommentsAndHTMX();
    }
  }

  /* ========================================================
   * EXPORTS (Unchanged)
   * ======================================================== */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = comments;
  } else {
    global.comments = comments;
    global.GitHubComments = GitHubComments;
  }
})(typeof window !== "undefined" ? window : this);
