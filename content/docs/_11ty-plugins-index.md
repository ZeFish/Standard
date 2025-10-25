---
title: 11ty Plugins
layout: base
permalink: /docs/11ty-plugins/index.html
eleventyNavigation:
  key: 11ty Plugins
  title: 11ty Plugins
---

# 11ty Plugins

Documentation for 11ty plugins components and utilities.

## Components

- [Eleventy Shortcode Plugin](/docs/eleventy-shortcode-plugin/) - Provides template shortcodes for including Standard Framework assets,
fonts, mobile meta tags, calculating reading time estimates, and initializing the
GitHub comments system. Integrates with Nunjucks templates for easy asset inclusion
and content utilities.
- [Markdown Plugin with Fine-Art Typography](/docs/markdown-plugin-with-fine-art-typography/) - Configures markdown-it parser with plugins for syntax highlighting,
callout blocks, footnotes, and classical typography enhancements applied at build time.

Typography features (build-time):
- Smart quotes (locale-aware)
- Em dashes (—) and en dashes (–)
- Proper ellipses (…)
- Widow prevention
- Orphan prevention
- Unicode fractions (½, ¾)
- Arrow symbols (→, ←, ⇒)
- Math symbols (×, ±, ≠)
- Legal symbols (©, ®, ™)
- French spacing rules
- [Eleventy Filter Plugin](/docs/eleventy-filter-plugin/) - Provides template filters for content processing including excerpt
generation, image extraction, HTML manipulation, date formatting, and data filtering.
All filters handle both Markdown and HTML input gracefully.
- [Content Encryption Plugin](/docs/content-encryption-plugin/) - Encrypts sensitive page content with password protection.
Uses SHA256-based XOR encryption for client-side decryption. Supports
password-protected pages via front matter configuration. Encrypted content
is embedded in HTML with decryption UI.
- [Standard Framework 11ty Plugin](/docs/standard-framework-11ty-plugin/) - Complete plugin orchestrator for Standard Framework. Includes:
- Typography system (smart quotes, fractions, dashes, widow prevention)
- CSS framework (grid, spacing, colors, responsive design)
- 11ty plugins (markdown, filters, shortcodes, backlinks, encryption)
- Cloudflare Functions integration (serverless endpoints)
- GitHub Comments System (serverless comments stored in GitHub)

One plugin adds everything you need. Configure what you want to use.
- [Cloudflare Functions Plugin](/docs/cloudflare-functions-plugin/) - Plugin to integrate Cloudflare Workers/Functions with 11ty websites.
Automatically copies function files and generates configuration for serverless deployment.
- [Backlinks Plugin](/docs/backlinks-plugin/) - Implements wiki-style bidirectional backlinks for knowledge graph
and content interconnection. Automatically discovers internal links and creates
a backlinks map showing which pages link to each page. Supports wiki-style link
syntax [[Page Name]] in addition to standard markdown links.

