---
title: GitHub Comments Client
layout: base
permalink: /docs/git-hub-comments-client/index.html
eleventyNavigation:
  key: GitHub Comments Client
  parent: Cloudflare Functions
  title: GitHub Comments Client
category: Cloudflare Functions
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/js/standard.comment.js
since: 0.10.53
---

# GitHub Comments Client

Client-side library for interacting with the GitHub comments API. Handles form submission, comment rendering, and real-time updates.

Features:
 - Submit comments via form
 - Render comments with nested threads
 - Auto-format timestamps and user mentions
 - Client-side caching of comments
 - Real-time comment updates (optional polling)
 - Markdown support with code blocks

Page ID Format:
 - Uses normalized page.url (e.g., "/blog/my-post/" → "blog_my-post")
 - Comments are stored in: data/comments/{pageId}/{timestamp}-{hash}.md
 - Homepage "/" becomes "index"
 - Slashes replaced with underscore for GitHub file path safety

```js
// Initialize on page (auto-initialized by standardComment shortcode)
const comments = new GitHubComments({
apiUrl: '/api/comments',
pageId: 'blog--my-post',  // Normalized from page.url
container: '#comments-section'
});

await comments.load();
comments.render();
comments.attachFormHandler('#comment-form');
```

<details>
<summary><span class="button">Source Code</span></summary>

```javascript
class GitHubComments {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || "/api/comments";
    this.pageId = options.pageId;
    this.container = document.querySelector(options.container || "#comments");
    this.formSelector = options.form || "#comment-form";
    this.comments = [];
    this.loading = false;
    this.pollInterval = options.pollInterval || null; // ms, null = disabled
    this.pollTimer = null;
  }
```

</details>

