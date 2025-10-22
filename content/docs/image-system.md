---
title: Image System
layout: component
permalink: /docs/image-system/index.html
eleventyNavigation:
  key: Image System
  parent: Components
  title: Image System
category: Components
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-08-img.scss
since: 0.1.0
---

Responsive image handling with interactive zoom functionality.
Images automatically scale to 100% width, support smooth zoom on click,
and include keyboard navigation for dismissing zoomed images.
Works seamlessly with rhythm and reading layouts.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `img` | `element` | Default responsive image |
| `{class} .fx Images with border and effects` | `mixed` |  |
| `{class} .nofx Images without border/effects` | `mixed` |  |
| `img` | `state` | :hover Prepare for zoom interaction |
| `img` | `state` | :active Active zoom state |
| `{class} .zoomed Zoomed image state` | `mixed` |  |

## Examples

```scss
// Basic responsive image
<img src="image.jpg" alt="Description">
// Image with border and effects
<img src="image.jpg" class="fx" alt="Description">
// Click to zoom, click again to close
// ESC key also closes zoomed image
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-08-img.scss`
