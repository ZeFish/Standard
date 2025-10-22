# Cloudflare Functions Plugin for Standard Framework

Integrate serverless Cloudflare Workers/Functions with your 11ty website powered by Standard Framework.

## Installation

```bash
npm install @zefish/standard
```

## Quick Start

### 1. Add to eleventy.config.js

```javascript
import Standard from "@zefish/standard";
import CloudflarePlugin from "@zefish/standard/src/eleventy/cloudflare.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard);
  eleventyConfig.addPlugin(CloudflarePlugin, {
    outputDir: "functions",
    environment: "production",
  });
}
```

### 2. Set Up Wrangler

Copy the template and configure for your project:

```bash
cp node_modules/@zefish/standard/src/eleventy/cloudflare/wrangler.toml.template wrangler.toml
```

Edit `wrangler.toml` with your Cloudflare credentials:

```toml
name = "my-project"
main = "functions/example.js"
compatibility_date = "2024-10-21"

[env.production]
route = "example.com/api/*"
```

### 3. Use Standard Utilities

```javascript
import {
  createResponse,
  createErrorResponse,
  parseRequest,
  withCache,
  validateMethod,
} from "./utils.js";

export default {
  async fetch(request) {
    const error = validateMethod(request, ["GET", "POST"]);
    if (error) return error;

    const { body, query } = await parseRequest(request);

    return withCache(
      createResponse({ success: true, data: body }),
      3600 // 1 hour cache
    );
  },
};
```

## Available Utilities

### `createResponse(data, options)`

Create a standardized JSON response.

```javascript
createResponse({ message: "Hello" }, { status: 200, cors: true });
```

### `createErrorResponse(message, status)`

Create a standardized error response.

```javascript
createErrorResponse("Not found", 404);
```

### `parseRequest(request)`

Parse incoming request with body, query params, and headers.

```javascript
const { method, query, body, headers } = await parseRequest(request);
```

### `validateMethod(request, allowedMethods)`

Validate HTTP method, returns error if invalid.

```javascript
const error = validateMethod(request, ["GET", "POST"]);
if (error) return error;
```

### `withCache(response, ttl)`

Add cache headers to response (in seconds).

```javascript
return withCache(response, 86400); // Cache for 1 day
```

### `handleCORS(request, options)`

Handle CORS preflight requests.

```javascript
if (request.method === "OPTIONS") {
  return handleCORS(request);
}
```

## Deployment

### Deploy to Cloudflare

```bash
# Install wrangler CLI
npm install -g wrangler

# Authenticate
wrangler login

# Deploy
wrangler publish
```

### Deploy to specific environment

```bash
wrangler publish --env production
```

## Environment Variables

Pass environment variables to your functions:

```javascript
eleventyConfig.addPlugin(CloudflarePlugin, {
  env: {
    API_KEY: process.env.CLOUDFLARE_API_KEY,
    DB_URL: process.env.DATABASE_URL,
  },
});
```

Access in your functions:

```javascript
const apiKey = env.API_KEY;
```

## Examples

### Simple API Endpoint

```javascript
import { createResponse, parseRequest } from "./utils.js";

export default {
  async fetch(request) {
    const { query } = await parseRequest(request);
    return createResponse({ hello: query.name || "World" });
  },
};
```

### Form Handler

```javascript
import { createResponse, createErrorResponse, parseRequest } from "./utils.js";

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return createErrorResponse("Method not allowed", 405);
    }

    const { body } = await parseRequest(request);
    
    // Process form data
    console.log("Form submission:", body);

    return createResponse({ success: true, received: body });
  },
};
```

### Redirect Service

```javascript
import { createResponse } from "./utils.js";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const shortCode = url.pathname.slice(1);

    const redirects = {
      "cv": "https://example.com/resume.pdf",
      "github": "https://github.com/username",
      "twitter": "https://twitter.com/username",
    };

    if (redirects[shortCode]) {
      return new Response(null, {
        status: 302,
        headers: { Location: redirects[shortCode] },
      });
    }

    return createResponse({ error: "Not found" }, { status: 404 });
  },
};
```

## Configuration Options

```javascript
eleventyConfig.addPlugin(CloudflarePlugin, {
  // Output directory for functions (relative to 11ty output)
  outputDir: "functions",

  // Environment name
  environment: "production",

  // Environment variables passed to functions
  env: {
    API_KEY: "...",
    DATABASE_URL: "...",
  },
});
```

## Learn More

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Standard Framework](https://standard.ffp.com/)

## License

MIT - See Standard Framework license
