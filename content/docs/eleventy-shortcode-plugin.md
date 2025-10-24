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

Provides template shortcodes for including Standard Framework assets,
fonts, mobile meta tags, calculating reading time estimates, and initializing the
GitHub comments system. Integrates with Nunjucks templates for easy asset inclusion
and content utilities.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `standardFonts` | `shortcode` | Include Inter and Source Serif 4 fonts |
| `standardAssets` | `shortcode` | Include CSS and JS (in main plugin) |
| `metaMobile` | `shortcode` | Include mobile viewport meta tags |
| `readingTime` | `shortcode` | Calculate and display reading time estimate |
| `standardComment` | `shortcode` | Render semantic HTML comment form (auto-initializes) |
| `initComments` | `shortcode` | Initialize GitHub comments system with configuration (optional) |

## Examples

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


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/shortcode.js`
