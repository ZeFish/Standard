---
title: Utilities
layout: base
permalink: /docs/utilities/index.html
eleventyNavigation:
  key: Utilities
  title: Utilities
---

# Utilities

Documentation for utilities components and utilities.

## Components

- [Utility Classes](/docs/utility-classes/) - Self-documenting utility classes following a consistent naming pattern.
All utilities use the format: [property]-[side/variant]-[size].
Size tokens: xs, s, base (default), l, xl, 2xl, 3xl
All utilities use logical properties for RTL support and !important for override capability.
- [Utilities](/docs/utilities/) - Generate spacing utility classes for any CSS property
- [Utilities](/docs/utilities/) - Generate special value utilities (auto, none, etc.)
- [Responsive Display Utilities](/docs/responsive-display-utilities/) - Show/hide elements at different screen sizes.
Uses SCSS breakpoint variables for consistent responsive behavior.
Classes:
- .sm-hidden: Hidden on small screens (≤768px)
- .sm-only: Visible only on small screens (≤768px)
- .md-hidden: Hidden on medium screens (769px-1024px)
- .md-only: Visible only on medium screens (769px-1024px)
- .lg-hidden: Hidden on large screens (≥1024px)
- .lg-only: Visible only on large screens (≥1024px)
- [Multi-Column Flow Utilities](/docs/multi-column-flow-utilities/) - CSS multi-column layout utilities for flowing text across columns.
Useful for magazine-style layouts, masonry grids, and dense text content.
Automatically stacks to single column on mobile for readability.
Classes:
- .flow-2, .flow-3, .flow-4: Fixed column count
- .flow-auto: Automatic columns based on optimal width
- .flow-gap-tight, .flow-gap-wide: Column gap variants
- .flow-keep: Prevent breaks inside elements
- .flow-rule, .flow-rule-accent: Vertical lines between columns
- [Doc Parser](/docs/doc-parser/) - JSDoc-style documentation parser for SCSS and JavaScript files Extracts structured documentation from code comments Expected format: /** * @component ComponentName * @description Short description * @category Category Name * @example *   Code example here * @param {type} name Description * @prop {type} name Description * @return {type} Description * @deprecated Reason if deprecated * @see Related files * @since 0.10.0 * /
- [Cloudflare](/docs/cloudflare/) - Generate wrangler.toml from .env file
- [Cloudflare](/docs/cloudflare/) - Build wrangler.toml content
- [Cloudflare](/docs/cloudflare/) - Build .dev.vars content for local development

