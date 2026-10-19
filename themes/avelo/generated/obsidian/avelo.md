---
aliases: []
created: 2026-10-11 23:09
modified: 2026-10-18 22:55
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: avelo
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="avelo"] {
    /* ─── Custom rules for àVélo ───────────────────────────── */
    --font-header-variation: 'GEOM' 100.0;

        --font-monospace-feature: "zero" on;
        .value, .stat-number, .figure-value {
            font-feature-settings: "zero" on;
        }

      .drawer-title {
        --color-header: var(--color-muted);
      }

      :is(.markdown-reading-view table, .markdown-rendered table, .cm-embed-block:has(table), .reveal table, .slides table) {
          font-family: var(--font-interface);
      }
}
```
