/**
 * Copy Buttons - Add copy-to-clipboard functionality to code blocks
 *
 * Automatically adds a "Copy" button to every <pre><code> element.
 * Features:
 * - Gracefully handles missing Clipboard API (shows warning)
 * - Prevents duplicate buttons on re-initialization
 * - Shows "Copied!" feedback for 2 seconds
 * - Accessible with proper aria-label
 *
 * @version @VERSION_PLACEHOLDER@
 */

/**
 * Initialize copy buttons on all code blocks
 */
export function initCopyButtons() {
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

/**
 * Auto-initialize on DOM ready
 */
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCopyButtons);
  } else {
    initCopyButtons();
  }
}

// Expose for manual re-initialization (e.g., after HTMX swaps)
if (typeof window !== "undefined") {
  window.initCopyButtons = initCopyButtons;
}
