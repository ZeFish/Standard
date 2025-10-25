---
title: Simplified Comments API Endpoint
layout: base
permalink: /docs/simplified-comments-api-endpoint/index.html
eleventyNavigation:
  key: Simplified Comments API Endpoint
  parent: Cloudflare Functions
  title: Simplified Comments API Endpoint
category: Cloudflare Functions
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/cloudflare/api/comments.js
since: 0.10.53
---

# Simplified Comments API Endpoint

Cloudflare Function for handling GitHub-backed comments.

Features:
 - GET: Fetch all comments for a page from GitHub
 - POST: Store new comment as Markdown file in GitHub
 - CORS enabled for cross-domain requests
 - Automatic moderation flag for review
 - Comments stored as .md files with frontmatter for 11ty integration

GitHub Storage Structure: data/comments/{pageId}/{timestamp}-{hash}.md

Page ID Format:
 - Uses normalized page.url from 11ty
 - Examples: "/blog/my-post/" → "blog_my-post"
 - Homepage "/" → "index"
 - Nested URLs: "/blog/2024/article/" → "blog_2024_article"
 - Normalization done in shortcode.js before reaching API

Environment Variables Required:
 - GITHUB_TOKEN: Personal access token with repo write access
 - GITHUB_OWNER: Repository owner (e.g., "zefish")
 - GITHUB_REPO: Repository name (e.g., "standard")
 - GITHUB_COMMENTS_PATH: Path for storing comments (default: "data/comments")
 - MODERATION_EMAIL: Email for notifications

<details>
<summary><span class="button">Source Code</span></summary>

```javascript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};
```

</details>

