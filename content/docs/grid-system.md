---
title: Grid System
layout: base
permalink: /docs/grid-system/index.html
eleventyNavigation:
  key: Grid System
  parent: Layout
  title: Grid System
category: Layout
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-06-grid.scss
since: 0.1.0
---

12-column Swiss-style responsive grid with flexible gaps and alignment.
Uses CSS Grid with logical properties for RTL support. Supports nested grids,
asymmetric layouts, gap variants (tight/normal/wide), and responsive column changes.
All gaps align to the vertical rhythm system.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `{class} .grid 12-column grid container` | `mixed` |  |
| `{class} .grid-2 through .grid-12 Predefined grid layouts (2-12 columns)` | `mixed` |  |
| `{class} .col-1 through .col-12 Column span modifiers` | `mixed` |  |
| `{class} .col-sm-* Responsive columns at 768px+` | `mixed` |  |
| `{class} .col-lg-* Responsive columns at 1024px+` | `mixed` |  |
| `{class} .start-{n} Start column position (1-12)` | `mixed` |  |
| `{class} .gap-tight Tight gap (1/4 space)` | `mixed` |  |
| `{class} .gap-wide Wide gap (1.5 space)` | `mixed` |  |

## Examples

```scss
// Basic 12-column grid with equal width columns
<div class="grid">
<div class="col-3">Item 1</div>
<div class="col-3">Item 2</div>
<div class="col-3">Item 3</div>
<div class="col-3">Item 4</div>
</div>
// Responsive grid layout
<div class="grid">
<div class="col-12 col-sm-6 col-lg-3">Card</div>
<div class="col-12 col-sm-6 col-lg-3">Card</div>
</div>
// Main content + sidebar layout
<div class="grid">
<div class="col-8">Main content</div>
<div class="col-4">Sidebar</div>
</div>
```

## See Also

- standard-04-rhythm.scss


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-06-grid.scss`
