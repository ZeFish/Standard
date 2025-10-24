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
export default {
  async fetch(request) {
    if (request.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({
      message: "Hello World",
      timestamp: new Date().toISOString(),
    }), { headers: { "Content-Type": "application/json" } });
  },
};
```

## GET with Query Parameters

Extract and use query parameters.

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const name = url.searchParams.get("name") || "Guest";
    const greeting = url.searchParams.get("greeting") || "Hello";

    return new Response(JSON.stringify({
      message: `${greeting}, ${name}!`,
    }), { headers: { "Content-Type": "application/json" } });
  },
};
```

Usage: `https://your-domain.com/api/greet?name=Francis&greeting=Welcome`

## POST Handler with Body

Accept and process POST data.

```javascript
export default {
  async fetch(request) {
    // Only allow POST
    if (request.method !== "POST" && request.method !== "OPTIONS") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    // Parse request
    const body = await request.json();

    // Process data
    const result = await processForm(body);

    return new Response(JSON.stringify({
      success: true,
      data: result,
    }), { headers: { "Content-Type": "application/json" } });
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
export default {
  async fetch(request) {
    const data = {
      title: "Cached Content",
      timestamp: new Date().toISOString(),
    };

    const response = new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

    // Cache for 1 hour (3600 seconds)
    return response;
  },
};
```

Cache TTL examples:

```javascript
// Caching is now handled by Cloudflare Workers/Pages configuration, not directly in the function code.
// You can set caching rules in your `wrangler.toml` or Cloudflare dashboard.
```

## Error Handling

Proper error responses with status codes.

```javascript
export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Validate endpoint
      if (!pathname.startsWith("/api/")) {
        return new Response(JSON.stringify({ error: "Not an API endpoint" }), { status: 404, headers: { "Content-Type": "application/json" } });
      }

      // Simulate processing
      const data = await fetchData();

      return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

    } catch (error) {
      console.error("Error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
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
export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Your API logic
    return new Response(JSON.stringify({
      message: "CORS enabled response",
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
```

## Router Pattern

Route different paths to different handlers.

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Route requests
    if (pathname === "/api/users") {
      return handleUsers(request);
    } else if (pathname === "/api/posts") {
      return handlePosts(request);
    } else if (pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ok" }), { headers: { "Content-Type": "application/json" } });
    } else {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
  },
};

async function handleUsers(request) {
  return new Response(JSON.stringify({
    users: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ],
  }), { headers: { "Content-Type": "application/json" } });
}

async function handlePosts(request) {
  return new Response(JSON.stringify({
    posts: [
      { id: 1, title: "Hello World" },
      { id: 2, title: "Second Post" },
    ],
  }), { headers: { "Content-Type": "application/json" } });
}
```

## URL Shortener / Redirects

Simple redirect service.

```javascript
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

    return new Response(JSON.stringify(
      { error: "Short URL not found", code }
    ), { status: 404, headers: { "Content-Type": "application/json" } });
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
export default {
  async fetch(request) {
    // Check method
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
    }

    const headers = Object.fromEntries(request.headers);
    const body = await request.json().catch(() => null);

    // Check content type
    const contentType = headers["content-type"] || "";
    if (!contentType.includes("application/json")) {
      return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Validate body
    if (!body) {
      return new Response(JSON.stringify({ error: "Request body is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const data = typeof body === "string" ? JSON.parse(body) : body;

    // Validate required fields
    if (!data.email || !data.name) {
      return new Response(JSON.stringify({ error: "Missing required fields: email, name" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true, data }), { headers: { "Content-Type": "application/json" } });
  },
};
```

## Middleware Pattern

Use middleware for common operations.

```javascript
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
      return new Response(JSON.stringify({ message: "Authenticated" }), { headers: { "Content-Type": "application/json" } });

    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
```

## Chaining Operations

Compose multiple operations.

```javascript
export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const query = Object.fromEntries(url.searchParams);

      // Chain operations
      const data = await fetchData(query);
      const validated = await validateData(data);
      const enriched = await enrichData(validated);
      const response = new Response(JSON.stringify(enriched), { headers: { "Content-Type": "application/json" } });

      // Cache the result
      return response;

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
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
- [Deploy to Production](/cloudflare/deployment/) - Go live

---

Ready to deploy? [Check the deployment guide](/cloudflare/deployment/)
