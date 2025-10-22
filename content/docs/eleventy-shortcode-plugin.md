---
title: Eleventy Shortcode Plugin
layout: component
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
fonts, mobile meta tags, and calculating reading time estimates. Integrates with
Nunjucks templates for easy asset inclusion and content utilities.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `standardFonts` | `shortcode` | Include Inter and Source Serif 4 fonts |
| `standardAssets` | `shortcode` | Include CSS and JS (in main plugin) |
| `metaMobile` | `shortcode` | Include mobile viewport meta tags |
| `readingTime` | `shortcode` | Calculate and display reading time estimate |

## Examples

```js
// In Nunjucks template
{% standardFonts %}
{% standardAssets %}
{% metaMobile %}
// Reading time shortcode
{% readingTime page.content %}
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/shortcode.js`
