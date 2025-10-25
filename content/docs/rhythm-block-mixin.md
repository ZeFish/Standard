---
title: Rhythm Block Mixin
layout: base
permalink: /docs/rhythm-block-mixin/index.html
eleventyNavigation:
  key: Rhythm Block Mixin
  parent: Foundation
  title: Rhythm Block Mixin
category: Foundation
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/_standard-00-variables.scss
since: 0.1.0
---

# Rhythm Block Mixin

Applies enhanced spacing to block-level elements that require extra visual separation such as callouts, blockquotes, code blocks, and tables.

<details>
<summary><span class="button">Source Code</span></summary>

```scss
@mixin apply-rhythm-block {
    .callout,
    blockquote,
    pre,
    figure,
    p:has(img),
    fieldset,
    hr,
    table,
    .container-small,
    .container-accent,
    .container-feature,
    .container-full {
        @content;
    }
}
```

</details>

