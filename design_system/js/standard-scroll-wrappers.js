/**
 * Scroll Wrappers - Manage horizontal scroll shadow indicators
 *
 * Adds shadow indicators to .scroll elements showing scroll direction:
 * - Right shadow appears when scrolled fully to the left
 * - Left shadow appears when scrolled fully to the right
 *
 * Features:
 * - Efficient: Only initializes once per element (uses data-scroll-initialized marker)
 * - Responsive: Re-checks shadows on window resize
 * - HTMX compatible: Can be called with scoped rootElement for dynamic content
 * - Passive event listeners for better performance
 *
 * @version @VERSION_PLACEHOLDER@
 */

/**
 * Initialize scroll wrappers that haven't been initialized yet
 *
 * @param {Element} [rootElement=document] - The element to search within.
 *   Defaults to entire document. Scoping makes it efficient for HTMX swaps.
 */
export function initializeScrollWrappers(rootElement = document) {
  // Find all .scroll elements that DO NOT have our initialized marker
  const newWrappers = rootElement.querySelectorAll(
    ".scroll:not([data-scroll-initialized])",
  );

  newWrappers.forEach((wrapper) => {
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
    window.addEventListener("resize", handleScroll);

    // Mark this element as initialized so we don't process it again
    wrapper.dataset.scrollInitialized = "true";
  });
}

/**
 * Auto-initialize on DOM ready
 */
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initializeScrollWrappers(document);
    });
  } else {
    initializeScrollWrappers(document);
  }
}

// Expose for manual initialization (e.g., after HTMX swaps)
if (typeof window !== "undefined") {
  window.initializeScrollWrappers = initializeScrollWrappers;
}
