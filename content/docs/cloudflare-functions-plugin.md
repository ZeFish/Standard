---
title: Cloudflare Functions Plugin
layout: base
permalink: /docs/cloudflare-functions-plugin/index.html
eleventyNavigation:
  key: Cloudflare Functions Plugin
  parent: 11ty Plugins
  title: Cloudflare Functions Plugin
category: 11ty Plugins
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/cloudflare.js
since: 0.10.52
---

Plugin to integrate Cloudflare Workers/Functions with 11ty websites.
Automatically copies function files and generates configuration for serverless deployment.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `functions` | `passthrough` | Copies function files from `src/cloudflare` to the output directory. |
| `cloudflare` | `global` | Cloudflare configuration data available in templates |

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `eleventyConfig` | `object` | 11ty configuration object |
| `options` | `object` | Plugin options |
| `options` | `string` | .outputDir Output directory for function files (default: functions) |
| `options` | `string` | .environment Environment name (default: production) |
| `options` | `object` | .env Environment variables to pass to functions |

## Examples

```js
// In eleventy.config.js
import Standard from "./src/eleventy/eleventy.js";
import CloudflarePlugin from "./src/eleventy/cloudflare.js";
export default function (eleventyConfig) {
eleventyConfig.addPlugin(Standard);
eleventyConfig.addPlugin(CloudflarePlugin, {
outputDir: "functions",
environment: "production"
});
}
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/cloudflare.js`
