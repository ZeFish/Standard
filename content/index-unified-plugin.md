---
layout: base.njk
title: Standard Framework - Unified Plugin
description: One plugin, all features - typography, CSS framework, Cloudflare Functions, and GitHub Comments
---

# Standard Framework - Unified Plugin

**One plugin to add everything.** No more multiple imports. No more configuration scattered across files.

## Installation

```bash
npm install @zefish/standard
```

## Basic Usage

```javascript
// eleventy.config.js
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard);
}
```

That's it. You now have:
- ✅ Typography system (smart quotes, fractions, dashes)
- ✅ Complete CSS framework (grid, spacing, colors, responsive)
- ✅ Enhanced markdown processing
- ✅ Template filters and shortcodes
- ✅ Wiki-style backlinks
- ✅ Content encryption
- ✅ Hierarchical navigation

## With Cloudflare Functions

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    cloudflare: { enabled: true }
  });
}
```

Adds serverless function support:
- ✅ All Cloudflare functions copied to `functions/`
- ✅ Example function included
- ✅ Helper utilities available
- ✅ Ready to deploy

## With GitHub Comments System

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    comments: { enabled: true }
  });
}
```

Adds comments system:
- ✅ Comments handler at `functions/api/comments.js`
- ✅ Browser client library at `assets/js/comments-client.js`
- ✅ Spam detection & moderation
- ✅ Nested threaded replies
- ✅ Stored in GitHub as JSON files

## Everything Enabled

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    outputDir: "assets/standard",
    copyFiles: true,
    useCDN: false,
    cloudflare: { 
      enabled: true,
      outputDir: "functions",
      environment: "production"
    },
    comments: { 
      enabled: true,
      outputDir: "functions/api",
      copyClientLibrary: true
    }
  });
}
```

## Configuration Reference

### Main Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outputDir` | string | `assets/standard` | Where to copy Standard CSS/JS |
| `copyFiles` | boolean | `true` | Copy from node_modules |
| `useCDN` | boolean | `false` | Use unpkg CDN instead of local files |
| `escapeCodeBlocks` | array | `[]` | Languages to escape in markdown |

### Cloudflare Functions Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cloudflare.enabled` | boolean | `false` | Enable Cloudflare Functions |
| `cloudflare.outputDir` | string | `functions` | Output directory for functions |
| `cloudflare.environment` | string | `production` | Environment name |

### Comments System Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `comments.enabled` | boolean | `false` | Enable GitHub Comments |
| `comments.outputDir` | string | `functions/api` | Comments handler output |
| `comments.copyClientLibrary` | boolean | `true` | Copy browser library to assets |

## Template Usage

### Include Standard Assets

```html
<head>
  {% standardAssets %}
</head>
```

Includes minified CSS and JS in your pages.

### Include Lab Features

```html
<script>
  {% standardLab %}
</script>
```

Includes experimental features.

### Use Template Filters

```html
{{ content | excerpt }}
{{ date | dateFormat }}
{{ images | extractFirstImage }}
```

See [[Filters]] for complete list.

### Use Shortcodes

```html
{% standardAssets %}
{% standardLab %}
```

## Using Comments

### 1. Add HTML Form

```html
<div id="comments"></div>
<form id="comment-form">
  <input type="text" name="author" placeholder="Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="content" placeholder="Comment" required></textarea>
  <button type="submit">Post</button>
</form>
```

### 2. Initialize JavaScript

```html
<script src="/assets/js/comments-client.js"></script>
<script>
  const comments = new GitHubComments({
    apiUrl: '/api/comments',
    pageId: 'blog/my-post',
    container: '#comments',
    form: '#comment-form'
  });
  
  comments.load().then(() => comments.render());
  comments.attachFormHandler();
</script>
```

### 3. Configure Cloudflare

Add to `wrangler.toml`:

```toml
[env.production.secrets]
GITHUB_TOKEN = "your-token-here"
GITHUB_OWNER = "your-username"
GITHUB_REPO = "your-repo"
GITHUB_COMMENTS_PATH = "data/comments"
```

### 4. Deploy

```bash
wrangler publish --env production
```

## Global Data Available

In your templates, access configuration data:

```html
<!-- Standard Framework -->
{{ standard.layout.meta }}

<!-- Cloudflare -->
{% if cloudflare %}
  Environment: {{ cloudflare.environment }}
{% endif %}

<!-- Comments -->
{% if comments %}
  API: {{ comments.apiEndpoint }}
  Client: {{ comments.clientLibrary }}
{% endif %}
```

## Common Configurations

### Minimal Setup (Just Typography)

```javascript
eleventyConfig.addPlugin(Standard);
```

### Blog (Typography + Comments)

```javascript
eleventyConfig.addPlugin(Standard, {
  comments: { enabled: true }
});
```

### API Server (Cloudflare + Comments)

```javascript
eleventyConfig.addPlugin(Standard, {
  cloudflare: { enabled: true },
  comments: { enabled: true }
});
```

### Production Optimized

```javascript
eleventyConfig.addPlugin(Standard, {
  outputDir: "assets/standard",
  copyFiles: true,
  useCDN: process.env.NODE_ENV === "production",
  cloudflare: { 
    enabled: process.env.ENABLE_FUNCTIONS === "true",
    environment: process.env.NODE_ENV || "production"
  },
  comments: { 
    enabled: process.env.ENABLE_COMMENTS === "true"
  }
});
```

## File Output Structure

**Minimum** (just plugin):
```
assets/standard/
├── standard.min.css
├── standard.min.js
└── standard.lab.js
```

**With Cloudflare**:
```
functions/
├── example.js
├── comments-example.js
├── comments-client.js
├── utils.js
└── ...
```

**With Comments**:
```
functions/api/
├── comments.js
├── utils.js
└── ...

assets/js/
└── comments-client.js
```

## Troubleshooting

**Q: Can I enable/disable features conditionally?**
A: Yes! Use environment variables or build flags.

**Q: Do I need all features?**
A: No! Only enable what you need. Disabled features don't add overhead.

**Q: Can I use just comments without Standard?**
A: Use the standalone plugin (see usage-patterns.md), but consolidated plugin is cleaner.

**Q: How do I add custom Cloudflare functions?**
A: Copy to `functions/` directory - they'll be included automatically.

## Documentation

- [[Getting Started]] - First time setup
- [[CSS Framework]] - Typography, grid, colors
- [[Cloudflare Functions]] - Serverless integration
- [[GitHub Comments]] - Comments system
- [[Filters]] - Template filters
- [[Shortcodes]] - Template shortcodes

## Version

Standard Framework **0.10.53**
One plugin, everything included.

---

**That's it!** One `addPlugin` call. Everything you need.
