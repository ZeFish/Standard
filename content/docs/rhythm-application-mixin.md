---
title: Rhythm Application Mixin
layout: base
permalink: /docs/rhythm-application-mixin/index.html
eleventyNavigation:
  key: Rhythm Application Mixin
  parent: Foundation
  title: Rhythm Application Mixin
category: Foundation
type: scss
source: /Users/francisfontaine/Documents/GitHub/Standard/src/styles/_standard-00-variables.scss
since: 0.1.0
---

# Rhythm Application Mixin

Applies rhythm spacing rules to semantic HTML elements and common layout components. Ensures consistent vertical rhythm.

<details>
<summary><span class="button">Source Code</span></summary>

```scss
@mixin apply-rhythm {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    ul,
    ol,
    dl,
    blockquote,
    pre,
    table,
    figure,
    form,
    fieldset,
    section,
    article,
    aside,
    header,
    footer,
    main,
    nav,
    .flow,
    .flow-2,
    .flow-3,
    .flow-4,
    .box,
    .box-inset {
        @content;
    }
}
```

</details>

