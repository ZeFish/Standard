---
aliases: []
created: 2026-07-24 09:35
modified: 2026-10-23 02:55
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: humanist
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="humanist"] {
    /* ─── Custom rules for Humanist ───────────────────────────── */
    :is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote, .reveal blockquote, .slides blockquote) {
            font-family: var(--font-header);
            font-size: var(--scale-2);
            font-style: italic;
            border:0;
        }
}
```
