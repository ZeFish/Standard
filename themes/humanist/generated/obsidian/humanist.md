---
aliases: []
created: 2026-07-24 09:35
modified: 2026-09-13 13:48
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
    .prose {
        display: block;
        }

        .markdown-reading-view h1,
        .cm-header-1,
        .HyperMD-header-1,
        .inline-title {
            text-align: center;
            padding: 2rlh 0;
            color: var(--color-foreground);
        }

        blockquote {
          border-left: var(--stroke-width-lg) solid var(--color-accent);
          padding-block: var(--space-2);
          margin-block: var(--space-2) var(--space);
          margin-inline: var(--space);
          font-size: var(--size-lg);
          font-family: var(--font-header);
        }
}
```
