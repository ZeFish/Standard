---
title: API Reference
layout: article
eleventyNavigation:
  key: Reference
  parent: Cloudflare Functions
  title: API Reference
permalink: /cloudflare/reference/
---

# API Reference

Complete reference for the Cloudflare Functions utility library.

## Response Helpers

### createResponse(data, options)

Create a standardized response with JSON content type and optional CORS headers.

**Parameters:**
- `data` (any) - Response data (string or object)
- `options` (object) - Optional settings
  - `status` (number) - HTTP status code (default: 200)
  - `headers` (object) - Custom headers
  - `cors` (boolean) - Include CORS headers (default: true)

**Returns:** `Response`

**Example:**

```javascript
// Simple response
createResponse({ message: "Hello" });

// With status code
createResponse({ error: "Not found" }, { status: 404 });

// With custom headers
createResponse({ data: "test" }, {
  status: 200,
  headers: { "X-Custom": "value" },
  cors: false,
});
```

### createErrorResponse(message, status, options)

Create a standardized error response with timestamp.

**Parameters:**
- `message` (string) - Error message
- `status` (number) - HTTP status code (default: 500)
- `options` (object) - Optional settings
  - `headers` (object) - Custom headers
  - `cors` (boolean) - Include CORS headers (default: true)

**Returns:** `Response`

**Response Format:**

```json
{
  "error": true,
  "message": "Error description",
  "status": 500,
  "timestamp": "2024-10-21T12:34:56.789Z"
}
```

**Example:**

```javascript
// Not found
createErrorResponse("Resource not found", 404);

// Bad request
createErrorResponse("Invalid input", 400);

// Server error
createErrorResponse("Database connection failed", 500);
```

### handleCORS(request, options)

Handle CORS preflight OPTIONS requests.

**Parameters:**
- `request` (Request) - The incoming request
- `options` (object) - Custom CORS headers to merge

**Returns:** `Response` (204 No Content)

**Example:**

```javascript
if (request.method === "OPTIONS") {
  return handleCORS(request);
}

// With custom headers
return handleCORS(request, {
  "Access-Control-Allow-Methods": "GET, POST, DELETE",
});
```

### corsHeaders

Pre-configured CORS headers object.

**Value:**

```javascript
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
}
```

**Example:**

```javascript
const response = new Response("data", {
  headers: corsHeaders,
});
```

## Request Helpers

### parseRequest(request)

Parse incoming request and extract method, URL, query parameters, headers, and body.

**Parameters:**
- `request` (Request) - The incoming request

**Returns:** `Promise<object>` with:
- `method` (string) - HTTP method
- `url` (string) - Full URL
- `pathname` (string) - URL path
- `query` (object) - Query parameters
- `headers` (object) - Request headers
- `body` (any) - Request body (parsed JSON if applicable)

**Example:**

```javascript
const { method, pathname, query, body } = await parseRequest(request);

console.log(method);           // "GET"
console.log(pathname);         // "/api/users/123"
console.log(query.page);       // "2"
console.log(body);             // Parsed JSON or null
```

**Supported Content Types:**
- `application/json` - Parsed as JSON object
- Others - Returned as text string

### validateMethod(request, allowedMethods)

Validate that the request method is in the allowed list.

**Parameters:**
- `request` (Request) - The incoming request
- `allowedMethods` (array) - Array of allowed methods (e.g., `["GET", "POST"]`)

**Returns:** `Response | null` - Error response if invalid, null if valid

**HTTP Status:** 405 Method Not Allowed

**Example:**

```javascript
const error = validateMethod(request, ["GET", "POST"]);
if (error) return error;

// Method is valid, continue
```

## Caching Helpers

### withCache(response, ttl)

Add cache headers to a response. Useful for improving performance and reducing requests.

**Parameters:**
- `response` (Response) - The response to cache
- `ttl` (number) - Time to live in seconds

**Returns:** `Response` - Response with cache headers

**Header Added:**

```
Cache-Control: public, max-age=<ttl>
```

**Examples:**

```javascript
// Cache for 5 minutes
withCache(response, 300);

// Cache for 1 hour
withCache(response, 3600);

// Cache for 1 day
withCache(response, 86400);

// Cache for 1 week
withCache(response, 604800);
```

**Typical TTL Values:**

| Duration | Seconds | Usage |
|----------|---------|-------|
| 5 minutes | 300 | Frequently changing data |
| 1 hour | 3600 | Regular updates |
| 1 day | 86400 | Static content |
| 1 week | 604800 | Rarely changes |

## Constants

### corsHeaders

Pre-configured CORS headers for allowing cross-origin requests.

```javascript
import { corsHeaders } from "./utils.js";

const response = new Response("data", {
  headers: corsHeaders,
});
```

## Error Codes Reference

### Common HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 204 | No Content | Successful, no body (e.g., OPTIONS) |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Authenticated but not allowed |
| 404 | Not Found | Resource doesn't exist |
| 405 | Method Not Allowed | Wrong HTTP method |
| 500 | Server Error | Unexpected error |
| 503 | Service Unavailable | Temporarily unavailable |

## Complete Example

Using all utilities together:

```javascript
import {
  createResponse,
  createErrorResponse,
  parseRequest,
  validateMethod,
  withCache,
  handleCORS,
} from "./utils.js";

export default {
  async fetch(request, env) {
    try {
      // Handle CORS preflight
      if (request.method === "OPTIONS") {
        return handleCORS(request);
      }

      // Validate method
      const error = validateMethod(request, ["GET", "POST"]);
      if (error) return error;

      // Parse request
      const { method, pathname, query, body } = await parseRequest(request);

      // Process
      let result;
      if (pathname === "/api/data") {
        result = await fetchData(query);
      } else if (pathname === "/api/submit") {
        result = await processSubmission(body);
      } else {
        return createErrorResponse("Not found", 404);
      }

      // Return cached response
      const response = createResponse({ success: true, data: result });
      return withCache(response, 3600);

    } catch (error) {
      return createErrorResponse(error.message, 500);
    }
  },
};
```

## Import Path

In your deployed functions:

```javascript
import { createResponse, parseRequest, ... } from "./utils.js";
```

The `utils.js` file is automatically copied to your functions directory when you build.

## Version

API Reference for **v0.10.52**

---

Need examples? [Check the examples page](/cloudflare/examples/)
