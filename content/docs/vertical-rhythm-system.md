---
title: Vertical Rhythm System
layout: base
permalink: /docs/vertical-rhythm-system/index.html
eleventyNavigation:
  key: Vertical Rhythm System
  parent: Layout
  title: Vertical Rhythm System
category: Layout
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-05-rhythm.scss
since: 0.1.0
---

Enhanced bulletproof rhythm system that prevents margin collapse
and ensures consistent vertical spacing throughout the document. Based on the
1rlh (relative line height) rhythm unit for mathematical precision.
Applied globally to <html> root for cascade throughout the page.
Supports responsive rhythm adjustments and granular control per element.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `{class} .rhythm Apply rhythm spacing to <html> root or any container` | `mixed` |  |
| `{class} .no-rhythm Disable rhythm for specific elements` | `mixed` |  |
| `{variable} --space Base rhythm unit (1rlh)` | `mixed` |  |
| `{variable} --rhythm-multiplier Normal element spacing multiplier (default: 1)` | `mixed` |  |
| `{variable} --rhythm-multiplier-block Block element spacing multiplier` | `mixed` |  |
| `{variable} --body-padding-multiplier Padding multiplier for <body> (desktop)` | `mixed` |  |
| `{variable} --body-mobile-padding-multiplier Padding multiplier for <body> (mobile)` | `mixed` |  |

## Examples

```scss
// Global: <html> has .rhythm class (applied automatically)
<html class="rhythm">
<body>
<!-- All content gets rhythm spacing -->
<h1>Title</h1>
<p>Paragraphs get automatic spacing</p>
</body>
</html>
// Local: Apply .rhythm to specific container
<div class="rhythm">
<h1>Section Title</h1>
<p>Container children get rhythm spacing</p>
</div>
// Disable: Use .no-rhythm to opt-out
<section class="no-rhythm">No spacing applied here</section>
<div class="rhythm no-rhythm">Explicitly disabled rhythm</div>
```

## See Also

- standard-01-token.scss
- standard-06-reading.scss


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-05-rhythm.scss`
