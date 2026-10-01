---
aliases: []
created: 2026-07-24 09:35
modified: 2026-10-01 13:40
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: international
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="international"] {
    /* ─── Custom rules for International ───────────────────────────── */
    :is(.callout-title, .callout-title-inner),
        > summary {
        padding: 0 var(--space-d2);
        }
}
```
