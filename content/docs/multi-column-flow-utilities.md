---
title: Multi-Column Flow Utilities
layout: base
permalink: /docs/multi-column-flow-utilities/index.html
eleventyNavigation:
  key: Multi-Column Flow Utilities
  parent: Utilities
  title: Multi-Column Flow Utilities
category: Utilities
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/_standard-98-utilities.scss
since: 0.1.0
---

# Multi-Column Flow Utilities

CSS multi-column layout utilities for flowing text across columns. Useful for magazine-style layouts, masonry grids, and dense text content. Automatically stacks to single column on mobile for readability.

Classes:
 - .flow-2, .flow-3, .flow-4: Fixed column count
 - .flow-auto: Automatic columns based on optimal width
 - .flow-gap-tight, .flow-gap-wide: Column gap variants
 - .flow-keep: Prevent breaks inside elements
 - .flow-rule, .flow-rule-accent: Vertical lines between columns

```scss
<!-- Two-column layout -->
<div class="flow-2">
<p>Content flows across two columns...</p>
</div>

<!-- Auto-responsive columns with rules -->
<div class="flow-auto flow-rule">
<p>Automatically creates optimal columns...</p>
</div>

<!-- Prevent element from breaking across columns -->
<div class="flow-3">
<blockquote class="flow-keep">Stays together</blockquote>
</div>
```

<details>
<summary><span class="button">Source Code</span></summary>

```scss
.flow-2 {
    columns: 2;
    column-gap: var(--grid-gap);
}

.flow-3 {
    columns: 3;
    column-gap: var(--grid-gap);
}

.flow-4 {
    columns: 4;
    column-gap: var(--grid-gap);
}

/* Responsive column count based on container width */
.flow-auto {
    columns: auto;
    column-width: var(--line-width-s); /* ~32rem optimal column width */
    column-gap: var(--grid-gap);
}

/* Column gap variants */
.flow-gap-tight {
    column-gap: var(--space-s);
}

.flow-gap-wide {
    column-gap: var(--space-l);
}

/* Prevent breaks inside elements */
.flow-keep {
    break-inside: avoid;
    page-break-inside: avoid; /* Legacy support */
}

/* Column rules (vertical lines between columns) */
.flow-rule {
    column-rule: var(--border);
}

.flow-rule-accent {
    column-rule: 1px solid var(--color-accent);
}

/* Responsive breakpoints */
@media (max-width: $small) {
    .flow-2,
    .flow-3,
    .flow-4 {
        columns: 1; /* Stack on mobile */
    }
}

@media (min-width: calc($small + 1px)) and (max-width: $large) {
    .flow-3,
    .flow-4 {
        columns: 2; /* Reduce columns on tablets */
    }
}
```

</details>

