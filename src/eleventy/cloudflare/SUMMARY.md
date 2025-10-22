# Cloudflare Functions Plugin - Summary

Complete Cloudflare Workers/Functions integration for Standard Framework 11ty projects.

## What's Included

### Core Files

- **cloudflare.js** - Main plugin file (import from package)
- **utils.js** - Helper utilities for request/response handling
- **example.js** - Example function template
- **wrangler.toml.template** - Cloudflare Workers configuration template
- **README.md** - Comprehensive documentation
- **USAGE.md** - Quick start and common patterns

## Quick Start (3 steps)

### 1. Add Plugin to eleventy.config.js

```javascript
import CloudflarePlugin from "@zefish/standard/cloudflare";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(CloudflarePlugin, {
    outputDir: "functions",
    environment: "production",
  });
}
```

### 2. Create a Function

```javascript
// functions/hello.js
import { createResponse } from "@zefish/standard/cloudflare/utils.js";

export default {
  async fetch(request) {
    return createResponse({ message: "Hello from Cloudflare!" });
  },
};
```

### 3. Deploy

```bash
npm run build
wrangler publish
```

## Features

✅ **Utilities Library**
- `createResponse()` - Standard JSON responses
- `createErrorResponse()` - Error handling
- `parseRequest()` - Request parsing (body, query, headers)
- `validateMethod()` - HTTP method validation
- `withCache()` - Response caching with TTL
- `handleCORS()` - CORS preflight handling
- `corsHeaders` - Pre-configured CORS headers

✅ **Integration**
- Automatic function copying to output directory
- Global data available in templates
- Environment variables support
- Wrangler configuration template included

✅ **Documentation**
- Full API documentation with JSDoc
- Usage guide with common patterns
- Example functions
- Troubleshooting section

## File Structure

```
src/eleventy/cloudflare/
├── cloudflare.js              # Main plugin
├── utils.js                   # Helper utilities
├── example.js                 # Example function
├── wrangler.toml.template     # Config template
├── README.md                  # Full documentation
├── USAGE.md                   # Quick start guide
└── SUMMARY.md                 # This file
```

## Import Paths

```javascript
// Main plugin
import CloudflarePlugin from "@zefish/standard/cloudflare";

// Utilities (when deployed)
import { createResponse } from "./utils.js";
```

## Package Configuration

The plugin is exported in `package.json`:

```json
{
  "exports": {
    "./cloudflare": "./src/eleventy/cloudflare.js"
  }
}
```

## Usage Examples

### Simple API

```javascript
export default {
  async fetch(request) {
    return createResponse({ hello: "world" });
  },
};
```

### With Query Parameters

```javascript
export default {
  async fetch(request) {
    const { query } = await parseRequest(request);
    return createResponse({ name: query.name || "Guest" });
  },
};
```

### POST Handler

```javascript
export default {
  async fetch(request) {
    const error = validateMethod(request, ["POST"]);
    if (error) return error;

    const { body } = await parseRequest(request);
    return createResponse({ received: body });
  },
};
```

### With Caching

```javascript
export default {
  async fetch(request) {
    const response = createResponse({ data: "cached" });
    return withCache(response, 3600); // 1 hour
  },
};
```

## Configuration Options

```javascript
eleventyConfig.addPlugin(CloudflarePlugin, {
  // Output directory for functions (default: "functions")
  outputDir: "functions",

  // Environment name (default: "production")
  environment: "production",

  // Environment variables for functions (default: {})
  env: {
    API_KEY: "secret",
    DB_URL: "database_url",
  },
});
```

## Available via Global Data

In your 11ty templates:

```nunjucks
{{ cloudflare.version }}          <!-- "0.10.52" -->
{{ cloudflare.environment }}       <!-- "production" -->
{{ cloudflare.outputDir }}         <!-- "functions" -->
```

## Deployment

### Local Testing

```bash
wrangler dev
```

### Production Deploy

```bash
wrangler publish
```

### With Environments

```bash
wrangler publish --env production
wrangler publish --env staging
```

## Integration with Standard Framework

Works seamlessly with Standard Framework:

```javascript
import Standard from "@zefish/standard";
import CloudflarePlugin from "@zefish/standard/cloudflare";

export default function (eleventyConfig) {
  // Typography & styling framework
  eleventyConfig.addPlugin(Standard);

  // Serverless functions
  eleventyConfig.addPlugin(CloudflarePlugin);

  // Doc generation
  eleventyConfig.addPlugin(DocGenerator);
}
```

## Utility Function Reference

### createResponse(data, options)
Create standardized response with optional CORS.

### createErrorResponse(message, status)
Create error response with timestamp.

### parseRequest(request)
Extract method, URL, query, headers, and body.

### validateMethod(request, allowedMethods)
Validate HTTP method, return error if invalid.

### withCache(response, ttl)
Add cache headers (TTL in seconds).

### handleCORS(request, options)
Handle CORS preflight requests.

## Documentation

For detailed information:
- **README.md** - Complete feature documentation
- **USAGE.md** - Quick start and patterns
- **example.js** - Working example function

## Version

Cloudflare Functions Plugin v0.10.52
Part of Standard Framework

## License

MIT - Same as Standard Framework
