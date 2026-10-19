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
theme: mono
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="mono"] {
    /* ─── Custom rules for Mono ───────────────────────────── */
    :is(.markdown-reading-view table, .markdown-rendered table, .cm-embed-block:has(table), .reveal table, .slides table),
      th,
      td {
        font-family: var(--font-monospace);
        border-color: var(--color-foreground);
      }
      th {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-accent);
      }

      :is(code, .cm-inline-code) {
        background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
      }

      img {
        filter: none !important;
        mix-blend-mode: normal !important;
      }
}
```
