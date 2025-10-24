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

- [GitHub Comments Client](/docs/github-comments-client/) - Client-side library for interacting with the GitHub comments API.
Handles form submission, comment rendering, and real-time updates.
Features:
- Submit comments via form
- Render comments with nested threads
- Auto-format timestamps and user mentions
- Client-side caching of comments
- Real-time comment updates (optional polling)
- Markdown support with code blocks
- [Simplified Contact API Endpoint](/docs/simplified-contact-api-endpoint/) - A simplified example of a Cloudflare Function for handling contact form submissions.
This file now returns a basic response and does not include complex logic.
- [Simplified Comments API Endpoint](/docs/simplified-comments-api-endpoint/) - A simplified example of a Cloudflare Function for handling comments.
This file now returns a basic response and does not include complex logic,
environment variable validation, or CORS handling internally.

