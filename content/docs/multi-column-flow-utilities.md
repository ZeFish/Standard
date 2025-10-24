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
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-98-utilities.scss
since: 0.1.0
---

CSS multi-column layout utilities for flowing text across columns.
Useful for magazine-style layouts, masonry grids, and dense text content.
Automatically stacks to single column on mobile for readability.
Classes:
- .flow-2, .flow-3, .flow-4: Fixed column count
- .flow-auto: Automatic columns based on optimal width
- .flow-gap-tight, .flow-gap-wide: Column gap variants
- .flow-keep: Prevent breaks inside elements
- .flow-rule, .flow-rule-accent: Vertical lines between columns

## Examples

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


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/styles/standard-98-utilities.scss`
