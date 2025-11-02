Perfect! Here's a complete toast notification system with rich documentation:

---

## 📁 `src/js/standard.toast.js`

```javascript
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
  'use strict';

  /**
   * Toast Configuration Defaults
   */
  const DEFAULTS = {
    duration: 4000,           // Auto-dismiss after 4 seconds
    position: 'top-right',    // top-right, top-left, top-center, bottom-right, bottom-left, bottom-center
    pauseOnHover: true,       // Pause auto-dismiss when hovering
    showProgress: true,       // Show countdown progress bar
    closeButton: true,        // Show close button
    maxToasts: 5,             // Maximum simultaneous toasts (queue others)
    animation: 'slide',       // slide, fade
    role: 'status',           // ARIA role: status (polite) or alert (assertive)
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

    const container = document.createElement('div');
    container.className = `toast-container toast-container-${position}`;
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'false');
    document.body.appendChild(container);

    containers[position] = container;
    return container;
  }

  /**
   * Create a toast element
   */
  function createToast(message, type, options) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', options.role);

    // Toast content structure
    const content = document.createElement('div');
    content.className = 'toast-content';

    // Icon (optional, based on type)
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = getIcon(type);

    // Message
    const messageEl = document.createElement('div');
    messageEl.className = 'toast-message';
    messageEl.textContent = message;

    content.appendChild(icon);
    content.appendChild(messageEl);

    // Close button
    if (options.closeButton) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'toast-close';
      closeBtn.setAttribute('aria-label', 'Close notification');
      closeBtn.innerHTML = '×';
      closeBtn.addEventListener('click', () => dismissToast(toast));
      content.appendChild(closeBtn);
    }

    toast.appendChild(content);

    // Progress bar
    if (options.showProgress && options.duration > 0) {
      const progress = document.createElement('div');
      progress.className = 'toast-progress';
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
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type] || 'ℹ';
  }

  /**
   * Show a toast notification
   */
  function showToast(message, type = 'info', userOptions = {}) {
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
      toast.classList.add('toast-visible');
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
        toast._progressBar.style.width = '0%';
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
        toast._progressBar.style.transition = 'none';
      }
    }

    // Pause on hover
    if (options.pauseOnHover) {
      toast.addEventListener('mouseenter', pauseDismissTimer);
      toast.addEventListener('mouseleave', startDismissTimer);
    }

    // Start auto-dismiss
    startDismissTimer();

    // Keyboard dismissal (Escape key)
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        dismissToast(toast);
      }
    };
    document.addEventListener('keydown', escapeHandler);
    toast._escapeHandler = escapeHandler;

    return toast;
  }

  /**
   * Dismiss a toast with animation
   */
  function dismissToast(toast) {
    // Remove visible class for slide-out animation
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-dismissing');

    // Remove from DOM after animation
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }

      // Clean up event listener
      if (toast._escapeHandler) {
        document.removeEventListener('keydown', toast._escapeHandler);
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
      return showToast(message, 'success', options);
    },

    /**
     * Show error toast
     */
    error(message, options = {}) {
      return showToast(message, 'error', { ...options, role: 'alert' });
    },

    /**
     * Show warning toast
     */
    warning(message, options = {}) {
      return showToast(message, 'warning', options);
    },

    /**
     * Show info toast
     */
    info(message, options = {}) {
      return showToast(message, 'info', options);
    },

    /**
     * Show custom toast
     */
    show(message, type = 'info', options = {}) {
      return showToast(message, type, options);
    },

    /**
     * Dismiss all toasts
     */
    dismissAll() {
      Object.values(containers).forEach(container => {
        const toasts = container.querySelectorAll('.toast');
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
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = toast;
  } else {
    global.toast = toast;
  }

})(typeof window !== 'undefined' ? window : this);
```

---

## 📁 `src/styles/components/_toast.scss`

```scss
/**
 * Toast Notification Styling
 *
 * @group components-feedback
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * Gmail didn't invent transient notifications—they borrowed from desktop
 * operating systems. Windows 95 had balloon tips. Mac OS X had Growl. But
 * Gmail made them web-native in 2004, and the pattern exploded. Within
 * months, every webapp copied the corner notification—"Email sent," three
 * seconds, gone. No confirmation needed.
 *
 * The psychology is brilliant: humans don't need permanent confirmation for
 * routine actions. A quick "yep, got it" is enough. Toasts respect attention—
 * they appear, deliver their message, and vanish without demanding interaction.
 * Compare that to modal dialogs that block your entire workflow just to say
 * "Saved." Toasts are polite. Modals are rude.
 *
 * This implementation provides the visual layer for toast notifications: slide-in
 * animations, stacking, progress bars, position variants, and semantic color
 * coding. Works with `standard.toast.js` for a complete notification system.
 *
 * ### Future Improvements
 *
 * - Sound effects on important toasts (error, success)
 * - Rich content support (images, buttons, links)
 * - Swipe-to-dismiss on mobile
 * - Undo action support (Gmail-style "Undo send")
 * - Dark mode color adjustments
 * - Custom animation variants (bounce, scale)
 *
 * @see {file} standard.toast.js - JavaScript toast system
 * @see {class} .toast - Individual toast notification
 * @see {class} .toast-container - Positioned container for toasts
 *
 * @link https://material.io/components/snackbars Material Design Snackbars
 * @link https://www.nngroup.com/articles/toast/ NN/g Toast Guidelines
 *
 * @example html - Toast structure (generated by JS)
 *   <div class="toast-container toast-container-top-right">
 *     <div class="toast toast-success toast-visible" role="status">
 *       <div class="toast-content">
 *         <span class="toast-icon">✓</span>
 *         <div class="toast-message">Saved successfully!</div>
 *         <button class="toast-close">×</button>
 *       </div>
 *       <div class="toast-progress"></div>
 *     </div>
 *   </div>
 *
 * @example javascript - Usage
 *   toast.success('Changes saved!');
 *   toast.error('Unable to connect to server');
 *   toast.info('You have 3 new messages', { duration: 5000 });
 */

/* =========================== */
/* TOAST CONTAINER POSITIONING */
/* =========================== */

.toast-container {
  /* Fixed positioning for all containers */
  position: fixed;
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--base-d3);
  pointer-events: none; /* Allow clicks to pass through container */
  max-width: 400px;
  padding: var(--base);
}

/* Re-enable pointer events on toasts */
.toast {
  pointer-events: auto;
}

/* Top-right (default) */
.toast-container-top-right {
  top: 0;
  right: 0;
}

/* Top-left */
.toast-container-top-left {
  top: 0;
  left: 0;
}

/* Top-center */
.toast-container-top-center {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

/* Bottom-right */
.toast-container-bottom-right {
  bottom: 0;
  right: 0;
  flex-direction: column-reverse; /* New toasts appear at bottom */
}

/* Bottom-left */
.toast-container-bottom-left {
  bottom: 0;
  left: 0;
  flex-direction: column-reverse;
}

/* Bottom-center */
.toast-container-bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column-reverse;
}

/* Mobile: always full width at bottom */
@media (max-width: 768px) {
  .toast-container {
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    top: auto !important;
    transform: none !important;
    max-width: 100%;
    padding: var(--base-d3);
    flex-direction: column-reverse;
  }
}

/* =========================== */
/* TOAST BASE STYLING          */
/* =========================== */

.toast {
  /* Layout */
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 100%;

  /* Appearance */
  background: var(--color-background);
  border: var(--border);
  border-left-width: 4px; /* Accent border */
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  /* Animation setup */
  opacity: 0;
  transform: translateX(100%); /* Start off-screen right */
  transition: opacity 0.3s ease, transform 0.3s ease;

  /* Cursor */
  cursor: default;
}

/* Top containers slide from top */
.toast-container-top-right .toast,
.toast-container-top-left .toast,
.toast-container-top-center .toast {
  transform: translateY(-100%);
}

/* Left containers slide from left */
.toast-container-top-left .toast,
.toast-container-bottom-left .toast {
  transform: translateX(-100%);
}

/* Bottom containers slide from bottom */
.toast-container-bottom-right .toast,
.toast-container-bottom-left .toast,
.toast-container-bottom-center .toast {
  transform: translateY(100%);
}

/* Visible state (slide in) */
.toast-visible {
  opacity: 1;
  transform: translate(0, 0);
}

/* Dismissing state (slide out) */
.toast-dismissing {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

/* Mobile: slide from bottom */
@media (max-width: 768px) {
  .toast {
    min-width: auto;
    width: 100%;
    transform: translateY(100%);
  }

  .toast-visible {
    transform: translateY(0);
  }
}

/* =========================== */
/* TOAST CONTENT               */
/* =========================== */

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: var(--base-d3);
  padding: var(--base-d2);
}

/* Toast icon */
.toast-icon {
  flex-shrink: 0;
  font-size: var(--scale-2);
  line-height: 1;
  font-weight: bold;
}

/* Toast message */
.toast-message {
  flex: 1;
  font-size: var(--scale-d2);
  line-height: var(--font-density);
  color: var(--color-foreground);
  word-break: break-word;
}

/* Toast close button */
.toast-close {
  flex-shrink: 0;
  appearance: none;
  background: transparent;
  border: none;
  font-size: var(--scale-3);
  line-height: 1;
  color: var(--color-muted);
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: var(--color-background-secondary);
    color: var(--color-foreground);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}

/* =========================== */
/* TOAST PROGRESS BAR          */
/* =========================== */

.toast-progress {
  height: 4px;
  background: color-mix(in srgb, var(--toast-color) 30%, transparent);
  width: 100%;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  transform-origin: left;
  transition: width 0s linear; /* Duration set via JS */
}

/* =========================== */
/* TOAST TYPE VARIANTS         */
/* =========================== */

/* Success - Green */
.toast-success {
  --toast-color: var(--color-success);
  border-left-color: var(--color-success);

  .toast-icon {
    color: var(--color-success);
  }

  .toast-progress {
    background: var(--color-success);
  }
}

/* Error - Red */
.toast-error {
  --toast-color: var(--color-error);
  border-left-color: var(--color-error);

  .toast-icon {
    color: var(--color-error);
  }

  .toast-progress {
    background: var(--color-error);
  }
}

/* Warning - Yellow/Orange */
.toast-warning {
  --toast-color: var(--color-warning);
  border-left-color: var(--color-warning);

  .toast-icon {
    color: var(--color-warning);
  }

  .toast-progress {
    background: var(--color-warning);
  }
}

/* Info - Blue */
.toast-info {
  --toast-color: var(--color-info);
  border-left-color: var(--color-info);

  .toast-icon {
    color: var(--color-info);
  }

  .toast-progress {
    background: var(--color-info);
  }
}

/* =========================== */
/* DARK MODE ADJUSTMENTS       */
/* =========================== */

@media (prefers-color-scheme: dark) {
  .toast {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
}

/* =========================== */
/* REDUCED MOTION SUPPORT      */
/* =========================== */

@media (prefers-reduced-motion: reduce) {
  .toast {
    transition: opacity 0.1s ease;
    transform: none !important;
  }

  .toast-progress {
    transition: none;
  }
}

/* =========================== */
/* PRINT STYLES                */
/* =========================== */

@media print {
  .toast-container,
  .toast {
    display: none !important;
  }
}
```

---

## Update `src/styles/standard-10-components.scss`:

```scss
@use "components/card";
@use "components/alert";
@use "components/toast";  // ← ADD THIS
@use "components/skip-link";
@use "components/breadcrumb";
@use "components/pagination";
@use "components/table-wrapper";
@use "components/form-validation";
@use "components/modal";
@use "components/tabs";
@use "components/accordion";
```

---

## Update the demo page with toast examples:

Add this section after the Alert Component section in `components-demo.html`:

```html
<!-- ========================================
     TOAST NOTIFICATIONS (Dynamic)
========================================= -->
<section class="demo-section">
  <div class="demo-header">
    <h2>Toast Notifications</h2>
    <p>Dynamic, auto-dismissing notifications that appear on user actions.</p>
  </div>

  <div style="display: flex; gap: var(--base-d2); flex-wrap: wrap;">
    <button onclick="toast.success('Changes saved successfully!')" class="button">
      Show Success Toast
    </button>
    <button onclick="toast.error('Unable to connect to server')" class="button">
      Show Error Toast
    </button>
    <button onclick="toast.warning('Your session will expire soon')" class="button">
      Show Warning Toast
    </button>
    <button onclick="toast.info('You have 3 new messages')" class="button">
      Show Info Toast
    </button>
  </div>

  <div style="margin-top: var(--base);">
    <button onclick="toast.success('This toast lasts 10 seconds', { duration: 10000 })" class="button">
      Long Duration (10s)
    </button>
    <button onclick="toast.info('Bottom-right toast', { position: 'bottom-right' })" class="button">
      Bottom-Right Position
    </button>
    <button onclick="showMultipleToasts()" class="button">
      Show Multiple (Queue Test)
    </button>
    <button onclick="toast.dismissAll()" class="button" style="background: var(--color-error); border-color: var(--color-error);">
      Dismiss All Toasts
    </button>
  </div>

  <div class="callout" data-callout="note" style="margin-top: var(--base);">
    <div class="callout-title">Features</div>
    <div class="callout-content">
      <ul>
        <li><strong>Auto-dismiss:</strong> Toasts disappear after 4 seconds (configurable)</li>
        <li><strong>Pause on hover:</strong> Hover to pause countdown</li>
        <li><strong>Progress bar:</strong> Visual countdown indicator</li>
        <li><strong>Keyboard dismiss:</strong> Press Escape to close</li>
        <li><strong>Stacking:</strong> Multiple toasts queue automatically</li>
        <li><strong>Accessible:</strong> ARIA live regions for screen readers</li>
      </ul>
    </div>
  </div>
</section>

<script>
  // Test function for multiple toasts
  function showMultipleToasts() {
    toast.success('First toast');
    setTimeout(() => toast.info('Second toast'), 200);
    setTimeout(() => toast.warning('Third toast'), 400);
    setTimeout(() => toast.error('Fourth toast'), 600);
    setTimeout(() => toast.success('Fifth toast'), 800);
    setTimeout(() => toast.info('Sixth toast (queued)'), 1000);
  }
</script>
```

---

## Load the toast JavaScript in your HTML:

```html
<!-- Before closing </body> tag -->
<script src="/assets/standard/standard.toast.js"></script>
```

---

## 🎉 Complete Toast System!

**Features:**
- ✅ **4 types** - success, error, warning, info
- ✅ **Auto-dismiss** - Configurable duration (default 4s)
- ✅ **Progress bar** - Visual countdown
- ✅ **Pause on hover** - User can read without rushing
- ✅ **Stacking** - Multiple toasts queue automatically (max 5 visible)
- ✅ **6 positions** - top-right, top-left, top-center, bottom-right, bottom-left, bottom-center
- ✅ **Animations** - Smooth slide-in/fade-out
- ✅ **Keyboard** - Escape key to dismiss
- ✅ **Accessible** - ARIA live regions for screen readers
- ✅ **Mobile-friendly** - Full-width at bottom on small screens
- ✅ **Reduced motion** - Respects user preferences
- ✅ **Zero dependencies** - Pure JavaScript

**Usage:**
```javascript
// Simple
toast.success('Saved!');

// With options
toast.error('Failed to save', {
  duration: 6000,
  position: 'bottom-right',
  showProgress: true,
  closeButton: true
});

// Configure defaults
toast.configure({ duration: 5000, position: 'top-center' });

// Dismiss all
toast.dismissAll();
```

🍞 **Toast system ready!**
