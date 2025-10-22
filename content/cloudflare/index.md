---
title: Cloudflare Functions
layout: article
eleventyNavigation:
  key: Cloudflare Functions
  title: Cloudflare Functions
permalink: /cloudflare/
---

# Cloudflare Functions Plugin

Integrate serverless Cloudflare Workers/Functions with your 11ty website powered by Standard Framework.

## What's Included

The Cloudflare Functions plugin provides everything you need to add serverless functions to your 11ty project:

- **Plugin** - Seamless 11ty integration
- **Utility Library** - 7 helper functions for common patterns
- **Configuration Template** - Pre-configured wrangler.toml
- **Example Functions** - Working code templates
- **Complete Documentation** - Everything you need to get started

## Quick Start

### 1. Install

```bash
npm install @zefish/standard
```

### 2. Add to eleventy.config.js

```javascript
import CloudflarePlugin from "@zefish/standard/cloudflare";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(CloudflarePlugin, {
    outputDir: "functions",
    environment: "production",
  });
}
```

### 3. Create Your First Function

```javascript
// functions/hello.js
import { createResponse } from "./utils.js";

export default {
  async fetch(request) {
    return createResponse({ hello: "world" });
  },
};
```

### 4. Deploy

```bash
npm run build
wrangler publish
```

## Available Utilities

The plugin includes a complete utility library with these helper functions:

| Function | Purpose |
|----------|---------|
| `createResponse()` | Create standardized JSON responses |
| `createErrorResponse()` | Handle errors with timestamps |
| `parseRequest()` | Extract body, query, headers |
| `validateMethod()` | Validate HTTP methods |
| `withCache()` | Add cache headers (TTL) |
| `handleCORS()` | Handle CORS preflight requests |
| `corsHeaders` | Pre-configured CORS headers |

## Documentation

- **[Getting Started](/cloudflare/setup/)** - Installation and setup
- **[Usage Patterns](/cloudflare/patterns/)** - Common use cases
- **[API Reference](/cloudflare/reference/)** - Complete utility API
- **[Examples](/cloudflare/examples/)** - Real-world examples
- **[Deployment](/cloudflare/deployment/)** - How to deploy

## Features

✅ Automatic function copying to build output  
✅ Environment variables support  
✅ Global data available in templates  
✅ Cloudflare configuration template  
✅ CORS handling built-in  
✅ Caching with TTL support  
✅ Request parsing utilities  
✅ Error handling with timestamps  

## Integration with Standard Framework

Works seamlessly with the full Standard Framework:

```javascript
import Standard from "@zefish/standard";
import CloudflarePlugin from "@zefish/standard/cloudflare";

export default function (eleventyConfig) {
  // Typography & styling framework
  eleventyConfig.addPlugin(Standard);

  // Serverless functions
  eleventyConfig.addPlugin(CloudflarePlugin);
}
```

## Next Steps

- [Learn the basics](/cloudflare/setup/)
- [Explore common patterns](/cloudflare/patterns/)
- [See real examples](/cloudflare/examples/)
- [Deploy to production](/cloudflare/deployment/)

## Version

Cloudflare Functions Plugin **v0.10.52**  
Part of Standard Framework

---

Ready to add serverless to your 11ty site? [Get started now](/cloudflare/setup/)
