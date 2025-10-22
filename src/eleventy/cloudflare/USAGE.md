# Cloudflare Functions Plugin - Usage Guide

Quick reference for using the Standard Framework Cloudflare Plugin in your 11ty projects.

## Installation

```bash
npm install @zefish/standard
```

## Basic Setup

### 1. Configure in eleventy.config.js

```javascript
import Standard from "@zefish/standard";
import CloudflarePlugin from "@zefish/standard/cloudflare";

export default function (eleventyConfig) {
  // Add Standard Framework
  eleventyConfig.addPlugin(Standard, {
    outputDir: "assets/standard",
  });

  // Add Cloudflare Functions support
  eleventyConfig.addPlugin(CloudflarePlugin, {
    outputDir: "functions",
    environment: "production",
  });
}
```

### 2. Create Your First Function

Create a file in your functions directory:

```javascript
// functions/hello.js
import { createResponse } from "@zefish/standard/cloudflare/utils.js";

export default {
  async fetch(request) {
    return createResponse({
      message: "Hello from Cloudflare!",
      version: "0.10.52",
    });
  },
};
```

### 3. Set Up Wrangler

```bash
# Initialize wrangler project
wrangler init

# Or use the template
cp node_modules/@zefish/standard/src/eleventy/cloudflare/wrangler.toml.template wrangler.toml
```

Edit `wrangler.toml`:

```toml
name = "my-project"
main = "functions/hello.js"
compatibility_date = "2024-10-21"
```

### 4. Deploy

```bash
# Test locally
wrangler dev

# Deploy to production
wrangler publish
```

## Common Patterns

### API Endpoint with Query Params

```javascript
import { createResponse, parseRequest } from "@zefish/standard/cloudflare/utils.js";

export default {
  async fetch(request) {
    const { query } = await parseRequest(request);
    const name = query.name || "World";

    return createResponse({
      greeting: `Hello, ${name}!`,
    });
  },
};
```

Usage: `https://your-domain.com/api/hello?name=Francis`

### POST Handler

```javascript
import { createResponse, createErrorResponse, parseRequest, validateMethod } from "@zefish/standard/cloudflare/utils.js";

export default {
  async fetch(request) {
    const methodError = validateMethod(request, ["POST", "OPTIONS"]);
    if (methodError) return methodError;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    const { body } = await parseRequest(request);

    // Process the data
    const result = await processForm(body);

    return createResponse({
      success: true,
      data: result,
    });
  },
};
```

### With Caching

```javascript
import { createResponse, withCache } from "@zefish/standard/cloudflare/utils.js";

export default {
  async fetch(request) {
    const response = createResponse({
      data: "This data is cached",
      timestamp: new Date().toISOString(),
    });

    // Cache for 24 hours
    return withCache(response, 86400);
  },
};
```

### Error Handling

```javascript
import { createErrorResponse } from "@zefish/standard/cloudflare/utils.js";

export default {
  async fetch(request) {
    try {
      // Your logic here
      if (!request.url.includes("/api/")) {
        return createErrorResponse("Not an API endpoint", 404);
      }
    } catch (error) {
      return createErrorResponse(error.message, 500);
    }
  },
};
```

## Available Utilities

### Response Helpers

```javascript
// Standard JSON response
createResponse(data, options)

// Error response
createErrorResponse(message, statusCode)

// With CORS headers
handleCORS(request, customHeaders)
```

### Request Helpers

```javascript
// Parse request data
const { method, url, query, headers, body } = await parseRequest(request)

// Validate HTTP method
const error = validateMethod(request, ["GET", "POST"])
```

### Caching

```javascript
// Add cache headers (TTL in seconds)
withCache(response, 3600)  // 1 hour
```

## Environment Variables

Pass environment-specific config:

```javascript
// eleventy.config.js
eleventyConfig.addPlugin(CloudflarePlugin, {
  env: {
    API_ENDPOINT: process.env.CF_API_ENDPOINT,
    AUTH_TOKEN: process.env.CF_AUTH_TOKEN,
  },
});
```

Access in functions:

```javascript
// functions/api.js
export default {
  async fetch(request, env) {
    const apiUrl = env.API_ENDPOINT;
    // Use it...
  },
};
```

## File Structure

After setup, your project looks like:

```
my-project/
├── eleventy.config.js
├── wrangler.toml
├── content/
│   └── index.md
├── functions/
│   ├── hello.js
│   ├── api.js
│   └── utils.js  (from Standard Framework)
└── _site/
    └── functions/  (deployed to Cloudflare)
```

## Deployment Checklist

- [ ] `eleventy.config.js` configured with CloudflarePlugin
- [ ] `wrangler.toml` set up with project details
- [ ] Functions created in `functions/` directory
- [ ] Environment variables set in `wrangler.toml`
- [ ] Tested locally with `wrangler dev`
- [ ] Deployed with `wrangler publish`

## Troubleshooting

### Functions not being copied

Make sure `outputDir` matches your Wrangler configuration:

```javascript
eleventyConfig.addPlugin(CloudflarePlugin, {
  outputDir: "functions",  // Must match wrangler.toml
});
```

### CORS errors

Wrap responses with CORS headers:

```javascript
import { handleCORS } from "@zefish/standard/cloudflare/utils.js";

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return handleCORS(request);
    }
    // ... rest of handler
  },
};
```

### Import errors

Import utilities from the correct path:

```javascript
// ✓ Correct
import { createResponse } from "@zefish/standard/cloudflare/utils.js";

// ✗ Wrong
import { createResponse } from "./utils.js";
```

## Learn More

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- [Standard Framework](https://standard.ffp.com/)
