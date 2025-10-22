# Cloudflare Plugin - Quick Reference Card

## Setup (Copy-Paste)

### eleventy.config.js
```javascript
import CloudflarePlugin from "@zefish/standard/cloudflare";

eleventyConfig.addPlugin(CloudflarePlugin, {
  outputDir: "functions",
  environment: "production",
});
```

### First Function
```javascript
// functions/api.js
import { createResponse, parseRequest } from "./utils.js";

export default {
  async fetch(request) {
    const { query } = await parseRequest(request);
    return createResponse({ hello: query.name || "World" });
  },
};
```

## Utilities Cheat Sheet

```javascript
// Responses
createResponse(data, options)           // ✓ Standard response
createErrorResponse(message, status)    // ✓ Error with timestamp

// Requests
await parseRequest(request)             // ✓ { method, query, body, headers }
validateMethod(request, ["GET"])        // ✓ Validate method or error

// Features
withCache(response, 3600)               // ✓ Cache response (TTL seconds)
handleCORS(request)                     // ✓ Handle CORS preflight
corsHeaders                             // ✓ Pre-configured CORS
```

## Common Patterns

### GET with Query Params
```javascript
const { query } = await parseRequest(request);
const id = query.id;
```

### POST with Body
```javascript
const { body } = await parseRequest(request);
const data = JSON.parse(body);
```

### Validate Method
```javascript
const error = validateMethod(request, ["POST"]);
if (error) return error;
```

### Add Caching
```javascript
return withCache(response, 86400);  // 24 hours
```

### Error Response
```javascript
return createErrorResponse("Not found", 404);
```

## Deploy

```bash
# Local test
wrangler dev

# Deploy
wrangler publish

# Deploy to environment
wrangler publish --env production
```

## File Location Reference

```
Standard Framework
├── src/eleventy/cloudflare.js          # Main plugin
└── src/eleventy/cloudflare/
    ├── utils.js                        # Utilities
    ├── example.js                      # Example
    ├── wrangler.toml.template          # Config
    ├── README.md                       # Full docs
    ├── USAGE.md                        # Patterns
    ├── SUMMARY.md                      # Overview
    └── QUICK-REF.md                    # This file
```

## Import Paths

```javascript
// In eleventy.config.js
import CloudflarePlugin from "@zefish/standard/cloudflare";

// In functions (after build)
import { createResponse } from "./utils.js";
```

## Configuration

```javascript
eleventyConfig.addPlugin(CloudflarePlugin, {
  outputDir: "functions",              // Where to output functions
  environment: "production",           // Environment name
  env: {                               // Environment variables
    API_KEY: "secret",
    DB_URL: "connection_string",
  },
});
```

## Access in Templates

```nunjucks
{{ cloudflare.version }}         <!-- v0.10.52 -->
{{ cloudflare.environment }}     <!-- production -->
{{ cloudflare.outputDir }}       <!-- functions -->
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Functions not copied | Check `outputDir` in config |
| CORS errors | Use `handleCORS(request)` |
| Import errors | Use correct path: `./utils.js` |
| Cache not working | Use `withCache(response, ttl)` |
| Method not allowed | Use `validateMethod(request, methods)` |

## Example: Complete API

```javascript
import {
  createResponse,
  createErrorResponse,
  parseRequest,
  validateMethod,
  withCache,
} from "./utils.js";

export default {
  async fetch(request) {
    try {
      // Validate method
      const error = validateMethod(request, ["GET", "POST"]);
      if (error) return error;

      // Parse request
      const { method, query, body } = await parseRequest(request);

      // Process
      const result = await processData(body);

      // Return cached response
      const response = createResponse({
        success: true,
        data: result,
      });
      return withCache(response, 3600);

    } catch (error) {
      return createErrorResponse(error.message, 500);
    }
  },
};
```

## Links

- 📖 Full Docs: `README.md`
- 🚀 Patterns: `USAGE.md`
- 📋 Overview: `SUMMARY.md`
- 🔗 Standard Framework: https://standard.ffp.com/
- ☁️ Cloudflare Docs: https://developers.cloudflare.com/workers/

---

**Standard Framework v0.10.52** | Cloudflare Functions Plugin
