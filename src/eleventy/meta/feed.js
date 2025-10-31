// src/eleventy/feed.js

/**
 * RSS/Atom Feed Generator
 *
 * @component Standard Framework Feed Plugin
 * @category 11ty Plugins
 */

import { createLogger } from "../logger.js";
import pluginRss from "@11ty/eleventy-plugin-rss";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function Feed(eleventyConfig, site = {}) {
  const user = site.standard?.feed || {};

  // Enabled guard
  const enabled = user.enabled ?? true;
  if (enabled === false) return;

  const logger = createLogger({
    scope: "Feed",
    verbose: site.standard?.verbose || false,
  });

  // Defaults
  const defaults = {
    type: "atom", // "atom" or "rss"
    filename: "feed.xml",
    collection: "posts",
    collectionType: "tag", // "tag" | "custom" | "glob" | "all"
    limit: 10,
    stylesheet: "assets/pretty-atom-feed.xsl",
  };

  // Normalize scalar fields (user → defaults)
  const type =
    (user.type || defaults.type).toLowerCase() === "rss" ? "rss" : "atom";
  const filename = user.filename ?? defaults.filename;
  const collection = user.collection ?? defaults.collection;
  const collectionType = user.collectionType ?? defaults.collectionType;
  const limit = Number.isFinite(user.limit) ? user.limit : defaults.limit;
  const stylesheet = user.stylesheet ?? defaults.stylesheet;

  // Site-level fallbacks
  const siteTitle = site.title || "My Site";
  const siteDescription = site.description || "";
  const siteLanguage = site.language || "en";
  const siteUrl = site.url || "";

  // Author fallback
  const author = {
    name: user.author?.name ?? site.author?.name ?? "Site Author",
    email: user.author?.email ?? site.author?.email ?? null,
  };

  // Title/description/language/baseUrl from user → site → defaults
  const title = user.title ?? siteTitle;
  const subtitle = user.subtitle ?? siteDescription;
  const language = user.language ?? siteLanguage;
  const baseUrl = user.baseUrl ?? siteUrl;

  // Register official RSS plugin (provides filters)
  eleventyConfig.addPlugin(pluginRss);

  // Copy XSL if used
  if (stylesheet) {
    eleventyConfig.addPassthroughCopy({
      [path.join(__dirname, "../layouts/pretty-atom-feed.xsl")]: "assets/",
    });
  }

  // Create feed collection (filtered and limited)
  eleventyConfig.addCollection("feed", (collectionApi) => {
    let items;

    switch (collectionType) {
      case "tag":
        items = collectionApi.getFilteredByTag(collection);
        break;
      case "custom":
        items = collectionApi.getFilteredByGlob(
          `content/${collection}/**/*.md`,
        );
        break;
      case "glob":
        items = collectionApi.getFilteredByGlob(collection);
        break;
      case "all":
        items = collectionApi.getAll();
        break;
      default:
        items = collectionApi.getFilteredByTag(collection);
    }

    return (items || [])
      .filter((item) => !item.data?.draft)
      .filter((item) => !item.data?.excludeFromFeed)
      .filter((item) => item.url) // Must have a URL
      .sort((a, b) => (b.date || 0) - (a.date || 0))
      .slice(0, Number.isFinite(limit) ? limit : items.length);
  });

  // Generate Atom feed template
  if (type === "atom") {
    eleventyConfig.addTemplate(
      `${filename}.njk`,
      `---
permalink: ${filename}
eleventyExcludeFromCollections: true
layout: false
---
<?xml version="1.0" encoding="utf-8"?>
${stylesheet ? `<?xml-stylesheet href="/${stylesheet}" type="text/xsl"?>` : ""}
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${language}">
  <title>${title}</title>
  ${subtitle ? `<subtitle>${subtitle}</subtitle>` : ""}
  <link href="${baseUrl}/${filename}" rel="self"/>
  <link href="${baseUrl}/"/>
  <updated>{{ collections.feed | getNewestCollectionItemDate | dateToRfc3339 }}</updated>
  <id>${baseUrl}</id>
  <author>
    <name>${author.name}</name>
    ${author.email ? `<email>${author.email}</email>` : ""}
  </author>
  {%- for post in collections.feed %}
  {%- set absolutePostUrl = post.url | absoluteUrl(baseUrl) %}
  <entry>
    <title>{{ post.data.title }}</title>
    <link href="{{ absolutePostUrl }}"/>
    <updated>{{ post.date | dateToRfc3339 }}</updated>
    <id>{{ absolutePostUrl }}</id>
    <content xml:lang="${language}" type="html">{{ post.templateContent | htmlToAbsoluteUrls(absolutePostUrl) | excerpt }}</content>
  </entry>
  {%- endfor %}
</feed>`,
    );
  }

  // Generate RSS feed template
  if (type === "rss") {
    eleventyConfig.addTemplate(
      `${filename}.njk`,
      `---
permalink: ${filename}
eleventyExcludeFromCollections: true
layout: false
---
<?xml version="1.0" encoding="utf-8"?>
${stylesheet ? `<?xml-stylesheet href="/${stylesheet}" type="text/xsl"?>` : ""}
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xml:base="${baseUrl}" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}${filename}" rel="self" type="application/rss+xml" />
    ${subtitle ? `<description>${subtitle}</description>` : ""}
    <language>${language}</language>
    {%- for post in collections.feed %}
    {%- set absolutePostUrl = post.url | absoluteUrl(baseUrl) %}
    <item>
      <title>{{ post.data.title }}</title>
      <link>{{ absolutePostUrl }}</link>
      <description>{{ post.templateContent | htmlToAbsoluteUrls(absolutePostUrl) }}</description>
      <pubDate>{{ post.date | dateToRfc822 }}</pubDate>
      <dc:creator>${author.name}</dc:creator>
      <guid>{{ absolutePostUrl }}</guid>
    </item>
    {%- endfor %}
  </channel>
</rss>`,
    );
  }

  logger.success();
}
