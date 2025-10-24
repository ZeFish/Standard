---
title: Standard Framework 11ty Plugin
layout: base
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

Complete plugin orchestrator for Standard Framework. Includes:
- Typography system (smart quotes, fractions, dashes, widow prevention)
- CSS framework (grid, spacing, colors, responsive design)
- 11ty plugins (markdown, filters, shortcodes, backlinks, encryption)
- Cloudflare Functions integration (serverless endpoints)
- GitHub Comments System (serverless comments stored in GitHub)
One plugin adds everything you need. Configure what you want to use.

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
| `Navigation` | `plugin` | Hierarchical navigation menus |
| `Cloudflare` | `passthrough` | Functions Serverless functions |
| `Comments` | `passthrough` | GitHub comments system |

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `eleventyConfig` | `object` | 11ty configuration object |
| `options` | `object` | Plugin options |
| `options` | `string` | .outputDir Output directory for Standard assets (default: assets/standard) |
| `options` | `boolean` | .copyFiles Copy files from node_modules (default: true) |
| `options` | `boolean` | .useCDN Use CDN instead of local files (default: false) |
| `options` | `array` | .escapeCodeBlocks Languages to escape code blocks for (default: []) |
| `options` | `object` | .cloudflare Cloudflare Functions config (default: { enabled: false }) |
| `options` | `object` | .comments GitHub Comments config (default: { enabled: false }) |

## Examples

```js
// Minimal setup (typography + CSS only)
import Standard from "./src/eleventy/eleventy.js";
export default function (eleventyConfig) {
eleventyConfig.addPlugin(Standard);
}
// With Cloudflare Functions
eleventyConfig.addPlugin(Standard, {
cloudflare: { enabled: true, outputDir: "functions" }
});
// With Comments System
eleventyConfig.addPlugin(Standard, {
comments: { enabled: true, outputDir: "functions/api" }
});
// Everything included
eleventyConfig.addPlugin(Standard, {
outputDir: "assets/standard",
copyFiles: true,
cloudflare: { enabled: true },
comments: { enabled: true }
});
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/eleventy.js`
