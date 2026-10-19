---
aliases: []
created: 2026-07-24 09:35
modified: 2026-10-18 22:55
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

        :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title, .reveal h1, .slides h1) {
            line-height: 1;
        }
}
```
