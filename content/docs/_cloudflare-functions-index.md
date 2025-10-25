---
title: Cloudflare Functions
layout: base
permalink: /docs/cloudflare-functions/index.html
eleventyNavigation:
  key: Cloudflare Functions
  title: Cloudflare Functions
---

# Cloudflare Functions

Documentation for cloudflare functions components and utilities.

## Components

- [GitHub Comments Client](/docs/git-hub-comments-client/) - Client-side library for interacting with the GitHub comments API.
Handles form submission, comment rendering, and real-time updates.

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
- [Simplified Contact API Endpoint](/docs/simplified-contact-api-endpoint/) - A simplified example of a Cloudflare Function for handling contact form submissions.
This file now returns a basic response and does not include complex logic.
- [Simplified Comments API Endpoint](/docs/simplified-comments-api-endpoint/) - Cloudflare Function for handling GitHub-backed comments.

Features:
- GET: Fetch all comments for a page from GitHub
- POST: Store new comment as Markdown file in GitHub
- CORS enabled for cross-domain requests
- Automatic moderation flag for review
- Comments stored as .md files with frontmatter for 11ty integration

GitHub Storage Structure:
data/comments/{pageId}/{timestamp}-{hash}.md

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

