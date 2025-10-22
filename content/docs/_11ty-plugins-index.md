---
title: 11ty Plugins
layout: component
permalink: /docs/11ty-plugins/index.html
eleventyNavigation:
  key: 11ty Plugins
  title: 11ty Plugins
---

# 11ty Plugins

Documentation for 11ty plugins components and utilities.

## Components

- [Eleventy Shortcode Plugin](/docs/eleventy-shortcode-plugin/) - Provides template shortcodes for including Standard Framework assets,
fonts, mobile meta tags, and calculating reading time estimates. Integrates with
Nunjucks templates for easy asset inclusion and content utilities.
- [Markdown Preprocessor Plugin](/docs/markdown-preprocessor-plugin/) - Preprocesses markdown content before rendering. Removes comments,
handles syntax highlighting markers, escapes code blocks, and fixes date formats.
Supports HTML comments (%% ... %%), highlighting syntax (== ... ==), and
configurable code block language escaping.
- [Markdown Plugin](/docs/markdown-plugin/) - Configures markdown-it parser with plugins for syntax highlighting,
callout blocks (admonitions), and footnotes. Enables typographer for smart quotes,
dashes, and proper punctuation. HTML output from markdown is preserved.
- [Eleventy Filter Plugin](/docs/eleventy-filter-plugin/) - Provides template filters for content processing including excerpt
generation, image extraction, HTML manipulation, date formatting, and data filtering.
All filters handle both Markdown and HTML input gracefully.
- [Content Encryption Plugin](/docs/content-encryption-plugin/) - Encrypts sensitive page content with password protection.
Uses SHA256-based XOR encryption for client-side decryption. Supports
password-protected pages via front matter configuration. Encrypted content
is embedded in HTML with decryption UI.
- [Standard Framework 11ty Plugin](/docs/standard-framework-11ty-plugin/) - Main plugin orchestrator for Standard Framework. Registers all
sub-plugins (markdown, filters, shortcodes, backlinks, encryption, documentation).
Configures asset copying, global data, and template functions. Can serve assets
from local files or CDN. Automatically includes all framework CSS and JS.
- [Backlinks Plugin](/docs/backlinks-plugin/) - Implements wiki-style bidirectional backlinks for knowledge graph
and content interconnection. Automatically discovers internal links and creates
a backlinks map showing which pages link to each page. Supports wiki-style link
syntax [[Page Name]] in addition to standard markdown links.
