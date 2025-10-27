/**
 * Navigation Menu Plugin
 *
 * @component Navigation Menu System
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1990, Tim Berners-Lee created the first web page with three links.
 * That's it. Three links. By 1993, NCSA Mosaic added the "navigation bar"—
 * a revolutionary concept that let you move between pages without scrolling
 * through endless text. The web as we know it was born.
 *
 * But navigation quickly became complex. By the 2000s, sites had mega-menus
 * with hundreds of links, dropdown cascades three levels deep, and Flash-based
 * navigation that broke the back button. We lost our way.
 *
 * Then came mobile. Suddenly, your 12-item horizontal menu didn't fit on a
 * 320px screen. The "hamburger menu" emerged in 2009 (Xerox invented it in
 * the 1980s, but mobile rediscovered it). Now we had a new problem: how do
 * you make navigation that works on both a 320px phone and a 2560px monitor?
 *
 * This plugin solves it with a simple principle: **semantic HTML first,
 * progressive enhancement second**. Your navigation is a list of links.
 * Nothing more, nothing less. It works without JavaScript. It works without
 * CSS. It's accessible by default. Then we layer on responsive behavior,
 * active states, external link handling, and keyboard navigation.
 *
 * The result is navigation that works everywhere, for everyone, always.
 *
 * **How It Works:**
 *
 * You provide an array of links. The plugin generates semantic HTML with
 * proper ARIA labels, active states, and external link detection. It uses
 * your existing utility classes (`.no-bullet`, spacing tokens) so everything
 * aligns with your design system. No custom CSS required.
 *
 * **Active State Detection:**
 *
 * The plugin compares the current page URL with each menu item's URL. For
 * exact matches (homepage), it uses exact comparison. For section pages
 * (like /blog/post-1), it uses prefix matching (so /blog is active when
 * viewing /blog/post-1). This gives you "breadcrumb-style" active states.
 *
 * **External Link Handling:**
 *
 * Any link starting with `http://` or `https://` that doesn't match your
 * site's domain automatically gets `target="_blank"` and `rel="noopener noreferrer"`.
 * This prevents security issues and makes external links obvious to users.
 *
 * ### Future Improvements
 *
 * - Support for nested/dropdown menus
 * - Mobile hamburger menu component
 * - Keyboard navigation (arrow keys)
 * - Icon support (SVG icons in menu items)
 * - Mega-menu support for large sites
 * - Breadcrumb generation from menu structure
 *
 * @see {file} src/styles/standard-10-navigation.scss - Navigation styling
 * @see {utility} .no-bullet - Removes list bullets
 * @see {utility} .display-flex - Flexbox layout
 *
 * @link https://www.w3.org/WAI/tutorials/menus/ W3C Menu Tutorial
 * @link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/navigation_role MDN Navigation Role
 *
 * @example javascript - Basic usage in eleventy.config.js
 *   import Standard from "@zefish/standard";
 *
 *   export default function (eleventyConfig) {
 *     eleventyConfig.addPlugin(Standard, {
 *       menu: {
 *         enabled: true,
 *         label: "Main navigation",
 *         className: "menu",
 *         inline: true
 *       }
 *     });
 *   }
 *
 * @example javascript - Data structure (_data/site.js)
 *   module.exports = {
 *     nav: {
 *       header: [
 *         { label: "Home", url: "/", exact: true },
 *         { label: "Blog", url: "/blog/" },
 *         { label: "About", url: "/about/" },
 *         { label: "Contact", url: "/contact/" }
 *       ],
 *       footer: [
 *         { label: "Privacy", url: "/privacy/" },
 *         { label: "Terms", url: "/terms/" },
 *         { label: "GitHub", url: "https://github.com/you", external: true }
 *       ]
 *     }
 *   };
 *
 * @example njk - Horizontal header menu
 *   {% menu site.nav.header, {
 *     label: "Main navigation",
 *     inline: true,
 *     className: "menu"
 *   } %}
 *
 * @example njk - Stacked footer menu
 *   {% menu site.nav.footer, {
 *     label: "Footer links",
 *     inline: false,
 *     className: "menu menu--footer"
 *   } %}
 *
 * @example html - Generated output (horizontal)
 *   <nav class="menu__nav" aria-label="Main navigation">
 *     <ul class="menu no-bullet display-flex" style="gap: var(--space-s);">
 *       <li class="menu__item is-active">
 *         <a class="menu__link" href="/" aria-current="page">Home</a>
 *       </li>
 *       <li class="menu__item">
 *         <a class="menu__link" href="/blog/">Blog</a>
 *       </li>
 *       <li class="menu__item">
 *         <a class="menu__link external-link" href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
 *       </li>
 *     </ul>
 *   </nav>
 *
 * @param {object} options Configuration options
 * @param {boolean} options.enabled Enable menu plugin (default: true)
 * @param {string} options.label Default ARIA label for navigation
 * @param {string} options.className Default CSS class for menu
 * @param {boolean} options.inline Horizontal layout (true) or stacked (false)
 */

import { createLogger } from "./logger.js";

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizePath(p = "") {
  if (!p) return "/";
  const s = String(p).replace(/\/+$/, "");
  return s === "" ? "/" : s;
}

function isActive(itemUrl, currentUrl, exact = false) {
  const a = normalizePath(itemUrl);
  const b = normalizePath(currentUrl);
  return exact ? a === b : b.startsWith(a);
}

export default function MenuPlugin(eleventyConfig, options = {}) {
  const defaults = {
    enabled: true,
    label: "Navigation",
    className: "menu",
    inline: true,
  };

  const config = { ...defaults, ...options };

  /**
   * Menu Shortcode
   *
   * Generates semantic navigation HTML from array of links.
   *
   * @param {array} items Array of menu items
   * @param {object} opts Per-use configuration options
   * @returns {string} HTML navigation markup
   */
  eleventyConfig.addShortcode("menu", function menuShortcode(items, opts = {}) {
    const currentUrl = (opts.currentUrl ?? this.page?.url) || "/";
    const label = opts.label || config.label;
    const className = opts.className || config.className;
    const inline = opts.inline ?? config.inline;

    // Generate list items
    const lis = (items || [])
      .map((item) => {
        const text = escapeHtml(item.label || item.name || "");
        const href = item.url || "#";
        const active = isActive(href, currentUrl, item.exact);

        // External link detection
        const isAbsolute = /^https?:\/\//i.test(href);
        const siteUrl = this.site?.url || "";
        const external =
          item.external ||
          (isAbsolute && !href.startsWith(normalizePath(siteUrl)));

        // Build link attributes
        const rel = item.rel || (external ? "noopener noreferrer" : undefined);
        const target = item.target || (external ? "_blank" : undefined);

        const aAttrs = [
          `class="${external ? " external-link" : ""}"`,
          `href="${escapeHtml(href)}"`,
          active ? `aria-current="page"` : "",
          target ? `target="${escapeHtml(target)}"` : "",
          rel ? `rel="${escapeHtml(rel)}"` : "",
        ]
          .filter(Boolean)
          .join(" ");

        const liClass = ["", active ? "is-active" : ""]
          .filter(Boolean)
          .join(" ");

        return `<li class="${liClass}"><a ${aAttrs}>${text}</a></li>`;
      })
      .join("");

    // Build list classes
    const ulClasses = [escapeHtml(className), "no-bullet", inline ? "flex" : ""]
      .filter(Boolean)
      .join(" ");

    // Use inline style for gap (until we add .gap-s utility)
    const ulStyle = inline ? ` style="gap: var(--space-s);"` : "";

    return `<nav aria-label="${escapeHtml(
      label,
    )}"><ul class="${ulClasses}"${ulStyle}>${lis}</ul></nav>`;
  });
}
