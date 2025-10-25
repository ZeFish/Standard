---
title: Simplified Contact API Endpoint
layout: base
permalink: /docs/simplified-contact-api-endpoint/index.html
eleventyNavigation:
  key: Simplified Contact API Endpoint
  parent: Cloudflare Functions
  title: Simplified Contact API Endpoint
category: Cloudflare Functions
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/cloudflare/api/contact.js
---

# Simplified Contact API Endpoint

A simplified example of a Cloudflare Function for handling contact form submissions. This file now returns a basic response and does not include complex logic.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `request` | `Request` | The incoming request. |
| `env` | `object` | The environment variables. |
| `ctx` | `object` | The context object. |

### Returns

**Type:** `Response`

The response to the request.

<details>
<summary><span class="button">Source Code</span></summary>

```javascript
export async function onRequestPost(request, env, ctx) {
  return new Response("Contact API - Simplified Response", {
    headers: { "Content-Type": "text/plain" },
    status: 200,
  });
}
```

</details>

