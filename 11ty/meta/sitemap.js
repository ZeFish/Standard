// src/eleventy/sitemap.js

/**
 * Sitemap XML Generator
 *
 * @component Standard Framework Sitemap Plugin
 * @category 11ty Plugins
 */

import Logger from "../../core/logger.js";

export default function Sitemap(eleventyConfig, site = {}) {
  const user = site.standard?.sitemap || {};

  // Enabled guard
  const enabled = user.enabled ?? true;
  if (enabled === false) return;

  const logger = Logger({
    scope: "Sitemap",
    verbose: site.standard?.verbose || false,
  });

  // Defaults
  const defaults = {
    hostname: site.url || "https://example.com",
    exclude: ["/404/", "/admin/", "/private/"],
    filename: "sitemap.xml",
  };

  // Normalize
  const hostname = user.hostname ?? defaults.hostname;
  const exclude = Array.isArray(user.exclude) ? user.exclude : defaults.exclude;
  const filename = user.filename ?? defaults.filename;

  // Collection for sitemap
  eleventyConfig.addCollection("sitemap", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter((item) => {
        if (!item.url) return false;
        // Explicit opt-out
        if (item.data?.excludeFromSitemap) return false;
        // No permalink
        if (item.data?.permalink === false) return false;
        // Pattern exclusions
        if (exclude.some((pattern) => item.url.includes(pattern))) return false;
        return true;
      })
      .sort((a, b) => (b.date || 0) - (a.date || 0));
  });

  // Emit sitemap
  eleventyConfig.addTemplate(
    `${filename}.njk`,
    `---
layout: false
permalink: ${filename}
eleventyExcludeFromCollections: true
---
<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{%- for page in collections.sitemap %}
  <url>
    <loc>${hostname}{{ page.url }}</loc>
    <lastmod>{{ (page.date or site.now) | dateToRfc3339 }}</lastmod>
  </url>
{%- endfor %}
</urlset>`,
  );

  logger.success();
}
