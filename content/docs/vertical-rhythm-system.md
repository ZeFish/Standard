---
title: Vertical Rhythm System
layout: component
permalink: /docs/vertical-rhythm-system/index.html
eleventyNavigation:
  key: Vertical Rhythm System
  parent: Layout
  title: Vertical Rhythm System
category: Layout
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-04-rhythm.scss
since: 0.1.0
---

Enhanced bulletproof rhythm system that prevents margin collapse
and ensures consistent vertical spacing throughout the document. Based on the
1rlh (relative line height) rhythm unit for mathematical precision.
Supports responsive rhythm adjustments and granular control per element.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `{class} .rhythm Apply rhythm spacing to container` | `mixed` |  |
| `{class} .no-rhythm Disable rhythm for specific elements` | `mixed` |  |
| `{variable} --space Base rhythm unit (1rlh)` | `mixed` |  |
| `{variable} --rhythm-multiplier Normal element spacing multiplier` | `mixed` |  |
| `{variable} --rhythm-multiplier-block Block element spacing multiplier` | `mixed` |  |

## Examples

```scss
// Enable rhythm on container
<div class="rhythm">
<h1>Title</h1>
<p>Paragraphs get automatic spacing</p>
</div>
// Disable rhythm for specific element
<div class="rhythm no-rhythm">No spacing applied</div>
```

## See Also

- standard-01-token.scss


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-04-rhythm.scss`
