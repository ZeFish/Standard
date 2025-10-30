// src/eleventy/feed.js

/**
 * RSS/Atom Feed Generator
 *
 * @component Standard Framework Feed Plugin
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.10.53
 *
 * In 1999, Netscape created RSS to syndicate web content. Two years later,
 * the Atom format emerged as a cleaner alternative. Today, RSS feeds remain
 * the backbone of podcasts, news aggregators, and content distribution -
 * a testament to the power of open standards over proprietary platforms.
 *
 * This plugin wraps 11ty's official RSS plugin to automatically generate
 * Atom and RSS feeds for your content. It provides sensible defaults while
 * respecting your metadata configuration. Feed readers, podcast apps, and
 * news aggregators will automatically discover and subscribe to your content.
 *
 * The beauty of RSS is its simplicity: it's just XML with timestamps and
 * links. No algorithms, no engagement metrics, no ads - just chronological
 * content delivery. It represents the web as it was meant to be: open,
 * decentralized, and user-controlled.
 *
 * ### Future Improvements
 *
 * - Support multiple feeds per site (blog, news, podcasts)
 * - Category-specific feeds
 * - JSON Feed format support
 * - Custom feed templates
 *
 * @see {plugin} Sitemap - Companion plugin for search engines
 * @see {file} content/feed.xml.njk - Generated feed template
 *
 * @link https://www.rssboard.org/rss-specification RSS 2.0 Specification
 * @link https://datatracker.ietf.org/doc/html/rfc4287 Atom RFC 4287
 *
 * @example js - Basic configuration
 *   eleventyConfig.addPlugin(Standard, {
 *     feed: {
 *       enabled: true,
 *       type: "atom",
 *       title: "My Blog",
 *       subtitle: "Thoughts and writings",
 *       author: {
 *         name: "Jane Doe",
 *         email: "jane@example.com"
 *       }
 *     }
 *   });
 *
 * @example js - Multiple feeds
 *   feed: {
 *     enabled: true,
 *     feeds: [
 *       {
 *         filename: "feed.xml",
 *         collection: "posts",
 *         title: "Blog Posts"
 *       },
 *       {
 *         filename: "podcast.xml",
 *         collection: "episodes",
 *         title: "Podcast Feed"
 *       }
 *     ]
 *   }
 *
 * @param {Object} eleventyConfig - 11ty configuration object
 * @param {Object} options - Plugin options
 * @param {Boolean} options.enabled - Enable feed generation (default: false)
 * @param {String} options.type - Feed type: "atom" or "rss" (default: "atom")
 * @param {String} options.filename - Output filename (default: "feed.xml")
 * @param {String} options.collection - Collection to syndicate (default: "posts")
 * @param {Number} options.limit - Number of items (default: 10)
 * @param {String} options.title - Feed title
 * @param {String} options.subtitle - Feed description
 * @param {String} options.language - Language code (default: "en")
 * @param {String} options.baseUrl - Site base URL
 * @param {Object} options.author - Author information
 * @param {String} options.author.name - Author name
 * @param {String} options.author.email - Author email
 */

import { createLogger } from "./logger.js";
import pluginRss from "@11ty/eleventy-plugin-rss";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function (eleventyConfig, site = {}) {
  const feedConfig = site.standard?.feed || {};

  if (feedConfig.enabled === false) return;

  const {
    type = "atom",
    filename = "feed.xml",
    collection = "posts",
    collectionType = "tag",
    limit = 10,
    title = site.title,
    subtitle = site.description,
    language = site.language,
    baseUrl = site.url,
    author = {
      name: site.author?.name || "Site Author",
      email: site.author?.email || null
    },
    stylesheet = "assets/pretty-atom-feed.xsl"
  } = feedConfig;

  const logger = createLogger({
    scope: "Feed"
  });

  // Register official RSS plugin (provides filters)
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPassthroughCopy({
    [path.join(__dirname, "../layouts/pretty-atom-feed.xsl")]: "assets/", // Copy to root of output
  });

  // Create feed collection (filtered and limited)
  eleventyConfig.addCollection("feed", (collectionApi) => {
    let items;

    // Different ways to get items
    switch (collectionType) {
      case "tag":
        // By tag (default)
        items = collectionApi.getFilteredByTag(collection);
        break;

      case "custom":
        // By custom collection name
        items = collectionApi.getFilteredByGlob(`content/${collection}/**/*.md`);
        break;

      case "glob":
        // By glob pattern
        items = collectionApi.getFilteredByGlob(collection);
        break;

      case "all":
        // Everything
        items = collectionApi.getAll();
        break;

      default:
        // Try tag first, fall back to custom collection
        items = collectionApi.getFilteredByTag(collection);
    }

    // Filter and sort
    return items
      .filter(item => !item.data.draft)
      .filter(item => !item.data.excludeFromFeed)
      .filter(item => item.url)  // Must have a URL
      .sort((a, b) => b.date - a.date)
      .slice(0, limit || items.length);

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
${stylesheet ? `<?xml-stylesheet href="/${stylesheet}" type="text/xsl"?>` : ''}
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${language}">
  <title>${title}</title>
  ${subtitle ? `<subtitle>${subtitle}</subtitle>` : ''}
  <link href="${baseUrl}/${filename}" rel="self"/>
  <link href="${baseUrl}/"/>
  <updated>{{ collections.feed | getNewestCollectionItemDate | dateToRfc3339 }}</updated>
  <id>${baseUrl}</id>
  <author>
    <name>${author.name}</name>
    ${author.email ? `<email>${author.email}</email>` : ''}
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
</feed>`
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
${stylesheet ? `<?xml-stylesheet href="/${stylesheet}" type="text/xsl"?>` : ''}
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xml:base="${baseUrl}" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}${filename}" rel="self" type="application/rss+xml" />
    ${subtitle ? `<description>${subtitle}</description>` : ''}
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
</rss>`
    );
  }
  logger.success("initialized");
}
