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
    position: "top-right", // top-right, top-left, top-center, bottom-right, bottom-left, bottom-center
    pauseOnHover: true, // Pause auto-dismiss when hovering
    showProgress: false, // Show countdown progress bar
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
