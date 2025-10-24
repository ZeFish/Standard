---
title: Debug System
layout: base
permalink: /docs/debug-system/index.html
eleventyNavigation:
  key: Debug System
  parent: Development
  title: Debug System
category: Development
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-99-debug.scss
since: 0.1.0
---

Development debugging utilities for visualizing grid layouts,
baseline rhythm, reading zones, and typography processing. Activated by adding
.standard-debug class to body or parent element. Shows overlays for grid columns,
baseline rhythm, reading layout zones, and other layout metrics. Essential for
design system development and layout debugging. Automatically hidden in print.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `{class} .standard-debug Enable debug visualization` | `mixed` |  |
| `baseline` | `overlay` | -grid Horizontal baseline grid overlay |
| `grid` | `overlay` | -columns Vertical grid column overlay |
| `reading` | `overlay` | -zones Reading layout zone visualization |
| `rhythm` | `overlay` | -spacing Margin/spacing outline visualization |
| `breakpoint` | `indicator` | -indicator Current responsive breakpoint |
| `debug` | `indicator` | -panel Fixed info panel with metrics |

## Examples

```scss
// Enable debug mode on page
<body class="standard-debug">
<!-- All debug overlays visible -->
</body>
// Debug specific grid
<div class="grid standard-debug">
<div class="col-4">Shows grid overlay</div>
</div>
// Debug reading layout zones
<article class="reading standard-debug">
<div class="accent">Zone highlighted</div>
</article>
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-99-debug.scss`
