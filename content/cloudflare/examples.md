---
title: Real-World Examples
layout: article
eleventyNavigation:
  key: Examples
  parent: Cloudflare Functions
  title: Examples
permalink: /cloudflare/examples/
---

# Real-World Examples

Complete, working examples for common use cases.

## Simple JSON API

Return structured data from a simple API endpoint.

```javascript
// functions/data.js
import { createResponse } from "./utils.js";

export default {
  async fetch(request) {
    return createResponse({
      framework: "Standard Framework",
      version: "0.10.52",
      features: [
        "Typography system",
        "Grid system",
        "Color system",
        "Cloudflare Functions",
      ],
      documentation: "https://standard.ffp.com/",
    });
  },
};
```

**Usage:** `GET https://your-domain.com/api/data`

## User Directory

Fetch and filter user data.

```javascript
// functions/users.js
import { createResponse, parseRequest } from "./utils.js";

const users = [
  { id: 1, name: "Alice", role: "admin", email: "alice@example.com" },
  { id: 2, name: "Bob", role: "user", email: "bob@example.com" },
  { id: 3, name: "Charlie", role: "user", email: "charlie@example.com" },
];

export default {
  async fetch(request) {
    const { query } = await parseRequest(request);

    // Filter by role if provided
    let result = users;
    if (query.role) {
      result = users.filter(u => u.role === query.role);
    }

    // Paginate if requested
    if (query.limit) {
      result = result.slice(0, parseInt(query.limit));
    }

    return createResponse({
      count: result.length,
      users: result,
    });
  },
};
```

**Usage:**
```
GET https://your-domain.com/api/users
GET https://your-domain.com/api/users?role=admin
GET https://your-domain.com/api/users?limit=2
```

## Contact Form Handler

Process form submissions.

```javascript
// functions/contact.js
import { createResponse, createErrorResponse, parseRequest, validateMethod } from "./utils.js";

export default {
  async fetch(request) {
    // Only allow POST
    if (request.method !== "POST" && request.method !== "OPTIONS") {
      return createErrorResponse("Method not allowed", 405);
    }

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    try {
      const { body } = await parseRequest(request);

      // Validate required fields
      if (!body.name || !body.email || !body.message) {
        return createErrorResponse("Missing required fields", 400);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return createErrorResponse("Invalid email format", 400);
      }

      // Here you would save to database or send email
      console.log("Form submission:", body);

      return createResponse({
        success: true,
        message: "Thank you for your message. We'll be in touch soon!",
        id: Date.now(),
      }, { status: 201 });

    } catch (error) {
      return createErrorResponse(error.message, 500);
    }
  },
};
```

**Usage:**
```javascript
const response = await fetch('https://your-domain.com/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I have a question...',
  }),
});
```

## Short URL Service

Create and manage short URLs.

```javascript
// functions/shorten.js
import { createResponse, parseRequest } from "./utils.js";

// In production, store in KV or database
const shortUrls = {
  "intro": "https://standard.ffp.com/cloudflare/setup/",
  "docs": "https://standard.ffp.com/",
  "github": "https://github.com/ZeFish/Standard",
};

export default {
  async fetch(request) {
    const { pathname, query } = await parseRequest(request);

    // Create short URL
    if (pathname === "/api/shorten" && query.url) {
      const code = Math.random().toString(36).substring(7);
      shortUrls[code] = query.url;

      return createResponse({
        code,
        short: `https://your-domain.com/${code}`,
        long: query.url,
      }, { status: 201 });
    }

    // Redirect to long URL
    const code = pathname.slice(1);
    if (shortUrls[code]) {
      return new Response(null, {
        status: 301,
        headers: { Location: shortUrls[code] },
      });
    }

    return createResponse({ error: "Not found" }, { status: 404 });
  },
};
```

## Todo List API

Simple in-memory todo list (for demo only; use database in production).

```javascript
// functions/todos.js
import { createResponse, createErrorResponse, parseRequest, validateMethod } from "./utils.js";

// In-memory store (resets on redeploy)
let todos = [
  { id: 1, text: "Learn Cloudflare Functions", completed: false },
  { id: 2, text: "Deploy an API", completed: false },
];
let nextId = 3;

export default {
  async fetch(request) {
    const { method, pathname, body } = await parseRequest(request);

    try {
      if (method === "GET") {
        // List all todos
        return createResponse({ todos });
      }

      else if (method === "POST" && pathname === "/api/todos") {
        // Create todo
        if (!body.text) {
          return createErrorResponse("Missing 'text' field", 400);
        }

        const todo = {
          id: nextId++,
          text: body.text,
          completed: false,
          created: new Date().toISOString(),
        };
        todos.push(todo);

        return createResponse(todo, { status: 201 });
      }

      else if (method === "PATCH") {
        // Update todo
        const id = parseInt(body.id);
        const todo = todos.find(t => t.id === id);

        if (!todo) {
          return createErrorResponse("Todo not found", 404);
        }

        if (body.text !== undefined) todo.text = body.text;
        if (body.completed !== undefined) todo.completed = body.completed;

        return createResponse(todo);
      }

      else if (method === "DELETE") {
        // Delete todo
        const id = parseInt(body.id);
        const index = todos.findIndex(t => t.id === id);

        if (index === -1) {
          return createErrorResponse("Todo not found", 404);
        }

        todos.splice(index, 1);
        return createResponse({ deleted: id });
      }

      return createErrorResponse("Method not allowed", 405);

    } catch (error) {
      return createErrorResponse(error.message, 500);
    }
  },
};
```

## Weather Widget

Fetch and display weather data (requires external API).

```javascript
// functions/weather.js
import { createResponse, createErrorResponse, parseRequest, withCache } from "./utils.js";

export default {
  async fetch(request, env) {
    try {
      const { query } = await parseRequest(request);
      const city = query.city || "San Francisco";

      // Fetch from external API
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=37.78&longitude=-122.42&current=temperature_2m,weather_code`
      );

      if (!response.ok) {
        return createErrorResponse("Weather service unavailable", 503);
      }

      const data = await response.json();

      const weatherResponse = createResponse({
        city,
        temperature: data.current.temperature_2m,
        condition: data.current.weather_code,
        updated: new Date().toISOString(),
      });

      // Cache for 10 minutes
      return withCache(weatherResponse, 600);

    } catch (error) {
      return createErrorResponse(error.message, 500);
    }
  },
};
```

## Authentication Check

Verify API key or token.

```javascript
// functions/protected.js
import { createResponse, createErrorResponse } from "./utils.js";

export default {
  async fetch(request, env) {
    // Get authorization header
    const auth = request.headers.get("Authorization");

    if (!auth || !auth.startsWith("Bearer ")) {
      return createErrorResponse("Missing or invalid authorization", 401);
    }

    const token = auth.slice(7);

    // Verify token (in production, use proper JWT verification)
    if (token !== env.API_TOKEN) {
      return createErrorResponse("Invalid token", 403);
    }

    // Token is valid
    return createResponse({
      authenticated: true,
      message: "Welcome to protected API",
    });
  },
};
```

**Usage:**
```javascript
const response = await fetch('https://your-domain.com/api/protected', {
  headers: {
    'Authorization': 'Bearer your-secret-token',
  },
});
```

## Health Check

Monitor function status.

```javascript
// functions/health.js
import { createResponse, withCache } from "./utils.js";

export default {
  async fetch(request) {
    const health = {
      status: "healthy",
      version: "0.10.52",
      timestamp: new Date().toISOString(),
      uptime: process.uptime?.() || 0,
      checks: {
        api: "ok",
        database: "ok",
        cache: "ok",
      },
    };

    const response = createResponse(health);
    return withCache(response, 60); // Cache for 1 minute
  },
};
```

**Usage:** Used for monitoring and load balancer health checks

## Rate Limiting

Simple rate limiting using request counting.

```javascript
// functions/rate-limit.js
import { createResponse, createErrorResponse } from "./utils.js";

const requestCounts = new Map();
const LIMIT = 100;
const WINDOW = 60000; // 1 minute

function checkRateLimit(ip) {
  const now = Date.now();
  const data = requestCounts.get(ip) || { count: 0, resetTime: now + WINDOW };

  if (now > data.resetTime) {
    return { allowed: true, count: 1, remaining: LIMIT - 1 };
  }

  if (data.count >= LIMIT) {
    return { allowed: false, count: data.count, remaining: 0 };
  }

  data.count++;
  requestCounts.set(ip, data);

  return { allowed: true, count: data.count, remaining: LIMIT - data.count };
}

export default {
  async fetch(request) {
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const limit = checkRateLimit(ip);

    if (!limit.allowed) {
      return createErrorResponse(
        `Rate limit exceeded. Try again in 1 minute.`,
        429
      );
    }

    return createResponse({
      message: "Request allowed",
      requests: limit.count,
      remaining: limit.remaining,
    });
  },
};
```

## Next Steps

- [See Patterns](/cloudflare/patterns/) - More patterns explained
- [API Reference](/cloudflare/reference/) - All available utilities
- [Deploy](/cloudflare/deployment/) - Take to production

---

Ready to deploy your own? [Check the deployment guide](/cloudflare/deployment/)
