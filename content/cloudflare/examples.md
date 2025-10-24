---
title: Real-World Examples

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

export default {
  async fetch(request) {
    return new Response(JSON.stringify({
      framework: "Standard Framework",
      version: "Simplified",
      message: "This is a simplified example.",
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  },
};
```

**Usage:** `GET https://your-domain.com/api/data`

## User Directory

Fetch and filter user data.

```javascript
// functions/users.js

const users = [
  { id: 1, name: "Alice", role: "admin", email: "alice@example.com" },
  { id: 2, name: "Bob", role: "user", email: "bob@example.com" },
  { id: 3, name: "Charlie", role: "user", email: "charlie@example.com" },
];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const role = url.searchParams.get("role");
    const limit = url.searchParams.get("limit");

    let result = users;
    if (role) {
      result = users.filter(u => u.role === role);
    }

    if (limit) {
      result = result.slice(0, parseInt(limit));
    }

    return new Response(JSON.stringify({
      count: result.length,
      users: result,
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
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

    try {
      const body = await request.json();

      // Validate required fields
      if (!body.name || !body.email || !body.message) {
        return new Response("Missing required fields", { status: 400 });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return new Response("Invalid email format", { status: 400 });
      }

      // Here you would save to database or send email
      console.log("Form submission:", body);

      return new Response(JSON.stringify({
        success: true,
        message: "Thank you for your message. We'll be in touch soon!",
        id: Date.now(),
      }), { status: 201, headers: { "Content-Type": "application/json" } });

    } catch (error) {
      return new Response(error.message || "Internal Server Error", { status: 500 });
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

// In production, store in KV or database
const shortUrls = {
  "intro": "https://standard.ffp.com/cloudflare/setup/",
  "docs": "https://standard.ffp.com/",
  "github": "https://github.com/ZeFish/Standard",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const queryUrl = url.searchParams.get("url");

    // Create short URL
    if (pathname === "/api/shorten" && queryUrl) {
      const code = Math.random().toString(36).substring(7);
      shortUrls[code] = queryUrl;

      return new Response(JSON.stringify({
        code,
        short: `https://your-domain.com/${code}`,
        long: queryUrl,
      }), { status: 201, headers: { "Content-Type": "application/json" } });
    }

    // Redirect to long URL
    const code = pathname.slice(1);
    if (shortUrls[code]) {
      return new Response(null, {
        status: 301,
        headers: { Location: shortUrls[code] },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  },
};
```

## Todo List API

Simple in-memory todo list (for demo only; use database in production).

```javascript
// functions/todos.js

// In-memory store (resets on redeploy)
let todos = [
  { id: 1, text: "Learn Cloudflare Functions", completed: false },
  { id: 2, text: "Deploy an API", completed: false },
];
let nextId = 3;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const method = request.method;
    let body = null;

    if (method !== "GET" && method !== "HEAD") {
      body = await request.json().catch(() => null);
    }

    try {
      if (method === "GET") {
        // List all todos
        return new Response(JSON.stringify({ todos }), { headers: { "Content-Type": "application/json" } });
      }

      else if (method === "POST" && url.pathname === "/api/todos") {
        // Create todo
        if (!body || !body.text) {
          return new Response("Missing 'text' field", { status: 400 });
        }

        const todo = {
          id: nextId++,
          text: body.text,
          completed: false,
          created: new Date().toISOString(),
        };
        todos.push(todo);

        return new Response(JSON.stringify(todo), { status: 201, headers: { "Content-Type": "application/json" } });
      }

      else if (method === "PATCH") {
        // Update todo
        const id = parseInt(body.id);
        const todo = todos.find(t => t.id === id);

        if (!todo) {
          return new Response("Todo not found", { status: 404 });
        }

        if (body.text !== undefined) todo.text = body.text;
        if (body.completed !== undefined) todo.completed = body.completed;

        return new Response(JSON.stringify(todo), { headers: { "Content-Type": "application/json" } });
      }

      else if (method === "DELETE") {
        // Delete todo
        const id = parseInt(body.id);
        const index = todos.findIndex(t => t.id === id);

        if (index === -1) {
          return new Response("Todo not found", { status: 404 });
        }

        todos.splice(index, 1);
        return new Response(JSON.stringify({ deleted: id }), { headers: { "Content-Type": "application/json" } });
      }

      return new Response("Method not allowed", { status: 405 });

    } catch (error) {
      return new Response(error.message || "Internal Server Error", { status: 500 });
    }
  },
};
```

## Weather Widget

Fetch and display weather data (requires external API).

```javascript
// functions/weather.js

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const city = url.searchParams.get("city") || "San Francisco";

      // Fetch from external API
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=37.78&longitude=-122.42&current=temperature_2m,weather_code`
      );

      if (!response.ok) {
        return new Response("Weather service unavailable", { status: 503 });
      }

      const data = await response.json();

      const weatherResponse = new Response(JSON.stringify({
        city,
        temperature: data.current.temperature_2m,
        condition: data.current.weather_code,
        updated: new Date().toISOString(),
      }), { headers: { "Content-Type": "application/json" } });

      // Cache for 10 minutes
      return weatherResponse;

    } catch (error) {
      return new Response(error.message || "Internal Server Error", { status: 500 });
    }
  },
};
```

## Authentication Check

Verify API key or token.

```javascript
// functions/protected.js

export default {
  async fetch(request, env) {
    // Get authorization header
    const auth = request.headers.get("Authorization");

    if (!auth || !auth.startsWith("Bearer ")) {
      return new Response("Missing or invalid authorization", { status: 401 });
    }

    const token = auth.slice(7);

    // Verify token (in production, use proper JWT verification)
    if (token !== env.API_TOKEN) {
      return new Response("Invalid token", { status: 403 });
    }

    // Token is valid
    return new Response(JSON.stringify({
      authenticated: true,
      message: "Welcome to protected API",
    }), { headers: { "Content-Type": "application/json" } });
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

export default {
  async fetch(request) {
    const health = {
      status: "healthy",
      version: "Simplified",
      timestamp: new Date().toISOString(),
      uptime: process.uptime?.() || 0,
      checks: {
        api: "ok",
        database: "ok",
        cache: "ok",
      },
    };

    const response = new Response(JSON.stringify(health), { headers: { "Content-Type": "application/json" } });
    return response; // Cache for 1 minute
  },
};
```

**Usage:** Used for monitoring and load balancer health checks

## Rate Limiting

Simple rate limiting using request counting.

```javascript
// functions/rate-limit.js

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
      return new Response(
        `Rate limit exceeded. Try again in 1 minute.`,
        { status: 429 }
      );
    }

    return new Response(JSON.stringify({
      message: "Request allowed",
      requests: limit.count,
      remaining: limit.remaining,
    }), { headers: { "Content-Type": "application/json" } });
  },
};
```

## Next Steps

- [See Patterns](/cloudflare/patterns/) - More patterns explained
- [Deploy](/cloudflare/deployment/) - Take to production

---

Ready to deploy your own? [Check the deployment guide](/cloudflare/deployment/)
