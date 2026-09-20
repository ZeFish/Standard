---
aliases: []
created: 2026-07-24 09:35
modified: 2026-09-20 15:31
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

        :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title) {
            text-align: center;
            color: var(--color-foreground);
        }

        :is(.markdown-reading-view blockquote, .markdown-rendered blockquote, .HyperMD-quote) {
          border-left: 4px solid var(--color-accent);
          padding-block: var(--space-2);
          margin-block: var(--space-2) var(--space);
          margin-inline: var(--space);
          font-size: var(--size-lg);
          font-family: var(--font-header);
        }
}
```
