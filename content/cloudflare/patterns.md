---
title: Common Usage Patterns

eleventyNavigation:
  key: Patterns
  parent: Cloudflare Functions
  title: Usage Patterns
permalink: /cloudflare/patterns/
---

# Common Usage Patterns

Real-world patterns for building APIs, handlers, and utilities with Cloudflare Functions.

## Simple GET Endpoint

Return JSON data from a GET request.

```javascript
import { createResponse, parseRequest } from "./utils.js";

export default {
  async fetch(request) {
    const { method } = await parseRequest(request);

    if (method !== "GET") {
      return createResponse({ error: "Method not allowed" }, { status: 405 });
    }

    return createResponse({
      message: "Hello World",
      timestamp: new Date().toISOString(),
    });
  },
};
```

## GET with Query Parameters

Extract and use query parameters.

```javascript
import { createResponse, parseRequest } from "./utils.js";

export default {
  async fetch(request) {
    const { query } = await parseRequest(request);
    const name = query.name || "Guest";
    const greeting = query.greeting || "Hello";

    return createResponse({
      message: `${greeting}, ${name}!`,
    });
  },
};
```

Usage: `https://your-domain.com/api/greet?name=Francis&greeting=Welcome`

## POST Handler with Body

Accept and process POST data.

```javascript
import { createResponse, createErrorResponse, parseRequest, validateMethod } from "./utils.js";

export default {
  async fetch(request) {
    // Validate method
    const error = validateMethod(request, ["POST", "OPTIONS"]);
    if (error) return error;

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    // Parse request
    const { body } = await parseRequest(request);

    // Process data
    const result = await processForm(body);

    return createResponse({
      success: true,
      data: result,
    });
  },
};

async function processForm(data) {
  // Your processing logic
  return { processed: true, items: data };
}
```

## Response Caching

Cache responses to reduce load and improve performance.

```javascript
import { createResponse, withCache } from "./utils.js";

export default {
  async fetch(request) {
    const data = {
      title: "Cached Content",
      timestamp: new Date().toISOString(),
    };

    const response = createResponse(data);

    // Cache for 1 hour (3600 seconds)
    return withCache(response, 3600);
  },
};
```

Cache TTL examples:

```javascript
withCache(response, 300)       // 5 minutes
withCache(response, 3600)      // 1 hour
withCache(response, 86400)     // 1 day
withCache(response, 604800)    // 1 week
```

## Error Handling

Proper error responses with status codes.

```javascript
import { createResponse, createErrorResponse, parseRequest } from "./utils.js";

export default {
  async fetch(request) {
    try {
      const { pathname } = await parseRequest(request);

      // Validate endpoint
      if (!pathname.startsWith("/api/")) {
        return createErrorResponse("Not an API endpoint", 404);
      }

      // Simulate processing
      const data = await fetchData();

      return createResponse(data);

    } catch (error) {
      console.error("Error:", error);
      return createErrorResponse(error.message, 500);
    }
  },
};

async function fetchData() {
  // Your logic
  return { data: "success" };
}
```

## CORS-Enabled API

Handle CORS requests for cross-origin access.

```javascript
import { createResponse, handleCORS, validateMethod } from "./utils.js";

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return handleCORS(request);
    }

    // Validate method
    const error = validateMethod(request, ["GET", "POST"]);
    if (error) return error;

    // Your API logic
    return createResponse({
      message: "CORS enabled response",
    });
  },
};
```

## Router Pattern

Route different paths to different handlers.

```javascript
import { createResponse, createErrorResponse, parseRequest } from "./utils.js";

export default {
  async fetch(request) {
    const { pathname } = await parseRequest(request);

    // Route requests
    if (pathname === "/api/users") {
      return handleUsers(request);
    } else if (pathname === "/api/posts") {
      return handlePosts(request);
    } else if (pathname === "/api/health") {
      return createResponse({ status: "ok" });
    } else {
      return createErrorResponse("Not found", 404);
    }
  },
};

async function handleUsers(request) {
  return createResponse({
    users: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ],
  });
}

async function handlePosts(request) {
  return createResponse({
    posts: [
      { id: 1, title: "Hello World" },
      { id: 2, title: "Second Post" },
    ],
  });
}
```

## URL Shortener / Redirects

Simple redirect service.

```javascript
import { createResponse } from "./utils.js";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const code = url.pathname.slice(1);

    // Redirect map
    const redirects = {
      "cv": "https://example.com/resume.pdf",
      "github": "https://github.com/username",
      "twitter": "https://twitter.com/username",
      "docs": "https://standard.ffp.com/",
    };

    if (redirects[code]) {
      return new Response(null, {
        status: 302,
        headers: { Location: redirects[code] },
      });
    }

    return createResponse(
      { error: "Short URL not found", code },
      { status: 404 }
    );
  },
};
```

## Environment Variables

Access secrets and configuration.

```javascript
export default {
  async fetch(request, env) {
    // Access environment variables
    const apiKey = env.API_KEY;
    const dbUrl = env.DATABASE_URL;
    const isProduction = env.ENVIRONMENT === "production";

    // Use them in your logic
    const headers = {
      "Authorization": `Bearer ${apiKey}`,
    };

    const response = await fetch(dbUrl, { headers });

    return new Response(JSON.stringify({
      environment: env.ENVIRONMENT,
      status: response.status,
    }));
  },
};
```

## Request Validation

Validate incoming requests before processing.

```javascript
import { createResponse, createErrorResponse, parseRequest, validateMethod } from "./utils.js";

export default {
  async fetch(request) {
    // Check method
    const methodError = validateMethod(request, ["POST"]);
    if (methodError) return methodError;

    const { headers, body } = await parseRequest(request);

    // Check content type
    const contentType = headers["content-type"] || "";
    if (!contentType.includes("application/json")) {
      return createErrorResponse("Content-Type must be application/json", 400);
    }

    // Validate body
    if (!body) {
      return createErrorResponse("Request body is required", 400);
    }

    const data = typeof body === "string" ? JSON.parse(body) : body;

    // Validate required fields
    if (!data.email || !data.name) {
      return createErrorResponse("Missing required fields: email, name", 400);
    }

    return createResponse({ success: true, data });
  },
};
```

## Middleware Pattern

Use middleware for common operations.

```javascript
import { createResponse, validateMethod } from "./utils.js";

// Middleware functions
async function authenticateRequest(request, env) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || token !== env.AUTH_TOKEN) {
    throw new Error("Unauthorized");
  }
}

async function logRequest(request) {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
}

// Main handler
export default {
  async fetch(request, env) {
    try {
      // Apply middleware
      await logRequest(request);
      await authenticateRequest(request, env);

      // Your API logic
      return createResponse({ message: "Authenticated" });

    } catch (error) {
      return createResponse(
        { error: error.message },
        { status: 401 }
      );
    }
  },
};
```

## Chaining Operations

Compose multiple operations.

```javascript
import { createResponse, createErrorResponse, parseRequest, withCache } from "./utils.js";

export default {
  async fetch(request) {
    try {
      const { query } = await parseRequest(request);

      // Chain operations
      const data = await fetchData(query);
      const validated = await validateData(data);
      const enriched = await enrichData(validated);
      const response = createResponse(enriched);

      // Cache the result
      return withCache(response, 3600);

    } catch (error) {
      return createErrorResponse(error.message, 500);
    }
  },
};

async function fetchData(query) {
  // Fetch logic
  return { fetched: true };
}

async function validateData(data) {
  // Validation logic
  return data;
}

async function enrichData(data) {
  // Enrichment logic
  return { ...data, enriched: true, timestamp: new Date().toISOString() };
}
```

## Next Steps

- [See Real Examples](/cloudflare/examples/) - Complete working code
- [API Reference](/cloudflare/reference/) - All utilities
- [Deploy to Production](/cloudflare/deployment/) - Go live

---

Ready to deploy? [Check the deployment guide](/cloudflare/deployment/)
