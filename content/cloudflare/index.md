# Cloudflare Functions Plugin

Integrate serverless Cloudflare Workers/Functions with your 11ty website powered by Standard Framework.

## What's Included

The Cloudflare Functions plugin provides basic integration for serverless functions with your 11ty project:

- **Plugin** - Seamless 11ty integration
- **Configuration Template** - Basic `wrangler.toml` generation
- **Simplified API Endpoints** - Basic `comments.js` and `contact.js` examples

## Quick Start

### 1. Install

```bash
npm install @zefish/standard
```

### 2. Add to eleventy.config.js

```javascript
import CloudflarePlugin from "@zefish/standard/cloudflare";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(CloudflarePlugin, {
    outputDir: "functions",
    environment: "production",
  });
}
```

### 3. Create Your First Function

```javascript
// functions/hello.js

export default {
  async fetch(request) {
    return new Response("Hello from Cloudflare Function!");
  },
};
```

### 4. Deploy

```bash
npm run build
wrangler publish
```

## Systems & Plugins

### Core Plugin
- **[Cloudflare Functions Plugin](/cloudflare/)** - Main serverless integration

### Simplified API Endpoints
- **[Comments API](/cloudflare/comments/)** - A simplified example of a comments API endpoint.
- **[Contact API](/cloudflare/contact/)** - A simplified example of a contact form API endpoint.

## Documentation

- **[Getting Started](/cloudflare/setup/)** - Installation and setup
- **[Usage Patterns](/cloudflare/patterns/)** - Common use cases
- **[Examples](/cloudflare/examples/)** - Real-world examples
- **[Deployment](/cloudflare/deployment/)** - How to deploy

## Features

- Automatic function copying to build output
- Environment variables support
- Global data available in templates
- Cloudflare configuration template

## Integration with Standard Framework

Works seamlessly with the full Standard Framework:

```javascript
import Standard from "@zefish/standard";
import CloudflarePlugin from "@zefish/standard/cloudflare";

export default function (eleventyConfig) {
  // Typography & styling framework
  eleventyConfig.addPlugin(Standard);

  // Serverless functions
  eleventyConfig.addPlugin(CloudflarePlugin);
}
```

## Next Steps

- [Learn the basics](/cloudflare/setup/)
- [Explore common patterns](/cloudflare/patterns/)
- [See real examples](/cloudflare/examples/)
- [Deploy to production](/cloudflare/deployment/)

## Version

Cloudflare Functions Plugin **v0.10.52**
Part of Standard Framework


Ready to add serverless to your 11ty site? [Get started now](/cloudflare/setup/)