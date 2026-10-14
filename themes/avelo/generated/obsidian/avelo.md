---
aliases: []
created: 2026-10-11 23:09
modified: 2026-10-14 13:03
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
    --font-monospace: "Monolisa";
        --font-monospace-feature: "zero" on;
        .value, .stat-number, .figure-value {
            font-feature-settings: "zero" on;
        }

      &.theme-dark,
      &[data-color-mode="dark"] {
          --color-header: var(--color-muted);
          .drawer-title {
              --color-header: var(--color-muted);
          }
      }
}
```
