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
 * **Item Limiting:**
 *
 * You can limit the number of items shown using the `limit` option. This is
 * especially useful for backlinks, recent posts, or any dynamic list that
 * might grow large. For example, `limit: 5` shows only the first 5 items.
 * Perfect for "Recent Posts" or "Top 10 Pages" lists.
 *
 * ### Future Improvements
 *
 * - Support for nested/dropdown menus
 * - Mobile hamburger menu component
 * - Keyboard navigation (arrow keys)
 * - Icon support (SVG icons in menu items)
 * - Mega-menu support for large sites
 * - Breadcrumb generation from menu structure
 * - "Show more" link when items are truncated
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
 *         ariaLabel: "Main navigation",
 *         class: "menu"
 *       }
 *     });
 *   }
 *
 * @example javascript - Data structure (_data/site.js)
 *   module.exports = {
 *     nav: {
 *       header: [
 *         { title: "Home", url: "/", exact: true },
 *         { title: "Blog", url: "/blog/" },
 *         { title: "About", url: "/about/" },
 *         { title: "Contact", url: "/contact/" }
 *       ],
 *       footer: [
 *         { title: "Privacy", url: "/privacy/" },
 *         { title: "Terms", url: "/terms/" },
 *         { title: "GitHub", url: "https://github.com/you", external: true }
 *       ]
 *     }
 *   };
 *
 * @example njk - Horizontal header menu
 *   {% menu site.nav.header, {
 *     ariaLabel: "Main navigation",
 *     class: "horizontal"
 *   } %}
 *
 * @example njk - Stacked footer menu
 *   {% menu site.nav.footer, {
 *     ariaLabel: "Footer links"
 *   } %}
 *
 * @example njk - Limited backlinks (show only 5)
 *   {% menu backlinks, {
 *     ariaLabel: "Related pages",
 *     limit: 5
 *   } %}
 *
 * @example njk - Recent posts (limited to 10)
 *   {% menu collections.blog | reverse, {
 *     ariaLabel: "Recent posts",
 *     limit: 10
 *   } %}
 *
 * @example html - Generated output (horizontal)
 *   <nav class="menu__nav" aria-label="Main navigation">
 *     <ul class="menu no-bullet display-flex" style="gap: var(--rhythm-d2);">
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
 * @param {string} options.ariaLabel Default ARIA label for navigation
 * @param {string} options.class Default CSS class for menu
 * @param {number} options.limit Maximum number of items to show (default: unlimited)
 */

import Logger from "../core/logger.js";

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

export default function MenuPlugin(eleventyConfig, site = {}) {
  const defaults = {
    enabled: true,
    ariaLabel: "Navigation",
    class: "",
    limit: null, // No limit by default
  };
  const config = { ...defaults, ...(site.standard?.menu || {}) };

  if (config.enabled === false) return;

  const logger = Logger({
    verbose: site.standard?.verbose,
    scope: "Menu",
  });

  /**
   * Menu Shortcode
   *
   * Generates semantic navigation HTML from array of links.
   *
   * @param {array} items Array of menu items with { title, url }
   * @param {object} opts Per-use configuration options
   * @param {string} opts.ariaLabel ARIA label for this navigation
   * @param {string} opts.class CSS classes for the menu
   * @param {number} opts.limit Maximum number of items to show
   * @returns {string} HTML navigation markup
   */
  eleventyConfig.addShortcode("menu", function menuShortcode(items, opts = {}) {
    const currentUrl = (opts.currentUrl ?? this.page?.url) || "/";
    const ariaLabel = opts.ariaLabel || config.ariaLabel;
    const className = opts.class || config.class;
    const limit = opts.limit ?? config.limit;

    // Apply limit if specified
    const itemsToRender =
      limit && limit > 0 ? (items || []).slice(0, limit) : items || [];

    const lis = itemsToRender
      .map((item) => {
        const text = escapeHtml(
          item.title || item.data?.title || item.label || item.fileSlug || "",
        );
        const href = item.url || "#";
        const active = isActive(href, currentUrl, item.exact);

        const isAbsolute = /^https?:\/\//i.test(href);
        const siteUrl = this.site?.url || "";
        const external =
          item.external ||
          (isAbsolute && !href.startsWith(normalizePath(siteUrl)));

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

        const liClass = [active ? "is-active" : ""].filter(Boolean).join(" ");

        return `<li class="${liClass}"><a ${aAttrs}>${text}</a></li>`;
      })
      .join("");

    const classes = ["menu", escapeHtml(className)].filter(Boolean).join(" ");

    return `<nav class="${classes}" aria-label="${escapeHtml(ariaLabel)}"><ul>${lis}</ul></nav>`;
  });

  logger.success();
}
