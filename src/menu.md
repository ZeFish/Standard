/*
const menuPlugin = require("./plugins/menu.js");

module.exports = function (eleventyConfig) {
    // Optional global defaults
    eleventyConfig.addGlobalData("site", require("./_data/site.js")); // if you want this.site.url for external detection
    eleventyConfig.addPlugin(menuPlugin, {
        label: "Navigation principale",
        className: "menu",
        inline: true,
    });

    return {
        // your existing config
    };
};
{# Header (horizontal) #}
{% menu site.nav.header, { label: "Navigation principale", inline: true } %}

{# Footer (stacked) #}
{% menu site.nav.footer, { label: "Pied de page", inline: false, className: "menu menu--footer" } %}



/* Menu hooks – minimal, aligns with your utilities */
.menu__nav {
    margin: 0; /* rhythm handles spacing of containers */
}

.menu__link {
    text-decoration: none; /* cleaner nav; underline on hover via global rules if wanted */
    padding: var(--space-3xs) var(--space-2xs);
    border-radius: var(--border-radius);
}

.menu__item.is-active > .menu__link {
    font-weight: 600;
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
}

.menu--footer .menu__link {
    text-decoration: underline; /* footer often keeps underlines */
}

/* Optional hover/active accent (keeps your color system) */
.menu__link:hover,
.menu__link:focus {
    background: color-mix(in srgb, var(--color-accent) 10%, transparent);
}



*/

// plugins/menu.js
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

module.exports = function menuPlugin(eleventyConfig, pluginOptions = {}) {
    // Defaults configurable at plugin load
    const defaults = {
        label: "Navigation",
        className: "menu",
        inline: true, // horizontal list by default
    };
    const baseOpts = { ...defaults, ...pluginOptions };

    eleventyConfig.addShortcode("menu", function menuShortcode(items, opts = {}) {
        // Per-call options override plugin-level options
        const currentUrl = (opts.currentUrl ?? this.page?.url) || "/";
        const label = opts.label || baseOpts.label;
        const className = opts.className || baseOpts.className;
        const inline = opts.inline ?? baseOpts.inline;

        const lis = (items || []).map((item) => {
            const text = escapeHtml(item.label || item.name || "");
            const href = item.url || "#";
            const active = isActive(href, currentUrl, item.exact);

            // External handling (optional, only when target provided or absolute URL)
            const isAbsolute = /^https?:\/\//i.test(href);
            const external = item.external || (isAbsolute && !href.startsWith(normalizePath(this.site?.url || "")));
            const rel = item.rel || (external ? "noopener noreferrer" : undefined);
            const target = item.target || (external ? "_blank" : undefined);

            const aAttrs = [
                `class="menu__link${external ? " external-link" : ""}"`,
                `href="${escapeHtml(href)}"`,
                active ? `aria-current="page"` : "",
                target ? `target="${escapeHtml(target)}"` : "",
                rel ? `rel="${escapeHtml(rel)}"` : "",
            ].filter(Boolean).join(" ");

            const liClass = ["menu__item", active ? "is-active" : ""]
                .filter(Boolean)
                .join(" ");

            return `
                <li class="${liClass}">
                    <a ${aAttrs}>${text}</a>
                </li>
            `;
        }).join("");

        const ulClass = [
            escapeHtml(className),
            inline ? "display-flex gap-s" : ""
        ].filter(Boolean).join(" ");

        return `
            <nav class="menu__nav" aria-label="${escapeHtml(label)}">
                <ul class="${ulClass}">
                    ${lis}
                </ul>
            </nav>
        `;
    });
};
