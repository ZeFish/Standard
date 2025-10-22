---
title: Standard Framework 11ty Plugin
layout: component
permalink: /docs/standard-framework-11ty-plugin/index.html
eleventyNavigation:
  key: Standard Framework 11ty Plugin
  parent: 11ty Plugins
  title: Standard Framework 11ty Plugin
category: 11ty Plugins
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/eleventy.js
since: 0.1.0
---

Main plugin orchestrator for Standard Framework. Registers all
sub-plugins (markdown, filters, shortcodes, backlinks, encryption, documentation).
Configures asset copying, global data, and template functions. Can serve assets
from local files or CDN. Automatically includes all framework CSS and JS.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `standardAssets` | `shortcode` | Include CSS and JS in template |
| `standardLab` | `shortcode` | Include lab/experimental features |
| `Markdown` | `plugin` | Enhanced markdown parsing |
| `Filter` | `plugin` | Template filters for content |
| `ShortCode` | `plugin` | Additional template shortcodes |
| `PreProcessor` | `plugin` | Markdown preprocessing |
| `Backlinks` | `plugin` | Wiki-style backlinks |
| `Encryption` | `plugin` | Content encryption |

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `eleventyConfig` | `object` | 11ty configuration object |
| `options` | `object` | Plugin options |
| `options` | `string` | .outputDir Output directory for copied files (default: assets/standard) |
| `options` | `boolean` | .copyFiles Copy files from node_modules (default: true) |
| `options` | `boolean` | .useCDN Use CDN instead of local files (default: false) |
| `options` | `array` | .escapeCodeBlocks Languages to escape code blocks for (default: []) |

## Examples

```js
// In eleventy.config.js
import Standard from "./src/eleventy/eleventy.js";
export default function (eleventyConfig) {
eleventyConfig.addPlugin(Standard, {
outputDir: "assets/standard",
copyFiles: true,
useCDN: false
});
}
// In templates
{% standardAssets %}
{% standardLab %}
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/eleventy.js`
