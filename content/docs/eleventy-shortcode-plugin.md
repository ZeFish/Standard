---
title: Eleventy Shortcode Plugin
layout: base
permalink: /docs/eleventy-shortcode-plugin/index.html
eleventyNavigation:
  key: Eleventy Shortcode Plugin
  parent: 11ty Plugins
  title: Eleventy Shortcode Plugin
category: 11ty Plugins
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/shortcode.js
since: 0.1.0
---

# Eleventy Shortcode Plugin

Provides template shortcodes for including Standard Framework assets, fonts, mobile meta tags, calculating reading time estimates, and initializing the GitHub comments system. Integrates with Nunjucks templates for easy asset inclusion and content utilities.

```js
// In Nunjucks template
{% standardFonts %}
{% standardAssets %}
{% metaMobile %}

// Reading time shortcode
{% readingTime page.content %}

// Comment form (auto-initializes with commentPageId from frontmatter)
{% standardComment %}
```

### Properties

| Name | Type | Description |
|------|------|-------------|
| `standardFonts` | `shortcode` | Include Inter and Source Serif 4 fonts |
| `standardAssets` | `shortcode` | Include CSS and JS (in main plugin) |
| `metaMobile` | `shortcode` | Include mobile viewport meta tags |
| `readingTime` | `shortcode` | Calculate and display reading time estimate |
| `standardComment` | `shortcode` | Render semantic HTML comment form (auto-initializes) |
| `initComments` | `shortcode` | Initialize GitHub comments system with configuration (optional) |

<details>
<summary><span class="button">Source Code</span></summary>

```javascript
export default function (eleventyConfig, options = {}) {
  eleventyConfig.addShortcode("bodyHtmx", function () {
    return `hx-boost="true" hx-target="main" hx-select="main" hx-swap="outerHTML show:window:top"`;
  });

  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("standardFonts", function () {
    return `<link rel="preconnect" href="https://rsms.me/">
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap" rel="stylesheet">`;
  });

  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("metaMobile", function () {
    return `<!-- Mobile -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">`;
  });

  eleventyConfig.addShortcode("readingTime", function (text) {
    // Return an empty string if the text is empty
    if (!text) {
      return "";
    }

    const wordsPerMinute = 225;
    // Count words by splitting on any whitespace
    const wordCount = text.split(/\s+/g).length;
    const minutes = Math.floor(wordCount / wordsPerMinute);

    // This follows your original logic of only showing for > 1 minute
    if (minutes > 1) {
      return `&nbsp;- ${minutes} minutes`;
    }

    // You could also uncomment this block to handle the 1 minute case
    /*
      if (minutes === 1) {
        return `&nbsp;- 1 minute`;
      }
      */

    return "";
  });
```

</details>

