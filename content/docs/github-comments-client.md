---
title: GitHub Comments Client
layout: base
permalink: /docs/github-comments-client/index.html
eleventyNavigation:
  key: GitHub Comments Client
  parent: Cloudflare Functions
  title: GitHub Comments Client
category: Cloudflare Functions
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/js/standard.comment.js
since: 0.10.53
---

Client-side library for interacting with the GitHub comments API.
Handles form submission, comment rendering, and real-time updates.
Features:
- Submit comments via form
- Render comments with nested threads
- Auto-format timestamps and user mentions
- Client-side caching of comments
- Real-time comment updates (optional polling)
- Markdown support with code blocks

## Examples

```js
// Initialize on page
const comments = new GitHubComments({
apiUrl: '/api/comments',
pageId: 'blog/my-post',
container: '#comments-section'
});
await comments.load();
comments.render();
comments.attachFormHandler('#comment-form');
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/js/standard.comment.js`
