// src/eleventy/sitemap.js

/**
 * Sitemap XML Generator
 *
 * @component Standard Framework Sitemap Plugin
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.10.53
 */

import { createLogger } from "./logger.js";

export default function (eleventyConfig, site = {}) {
  const sitemapConfig = site.standard?.sitemap || {};

  if (sitemapConfig.enabled === false) return;

  const {
    hostname = site.url || "https://example.com",
    exclude = ["/404/", "/admin/", "/private/"]
  } = sitemapConfig;

  const logger = createLogger({
    scope: "Sitemap"
  });

  eleventyConfig.addCollection("sitemap", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter(item => {
        if (!item.url) return false;
        if (item.data.excludeFromSitemap) return false;
        if (item.data.permalink === false) return false;
        if (exclude.some(pattern => item.url.includes(pattern))) return false;
        return true;
      })
      .sort((a, b) => (b.date || 0) - (a.date || 0));
  });

  eleventyConfig.addTemplate(
    "sitemap.xml.njk",
    `---
layout: false
permalink: sitemap.xml
eleventyExcludeFromCollections: true
---
<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{%- for page in collections.sitemap %}
  <url>
    <loc>${hostname}{{ page.url }}</loc>
    <lastmod>{{ page.date.toISOString() }}</lastmod>
  </url>
{%- endfor %}
</urlset>`
  );
  logger.success("initialized");
}
