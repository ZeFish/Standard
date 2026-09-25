---
aliases: []
created: 2026-07-24 09:35
modified: 2026-09-25 01:46
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: venetian
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="venetian"] {
    /* ─── Custom rules for Venetian ───────────────────────────── */
    /* ─── Design Tokens ──────────────────────────────────────── */
    --color-light-accent: #7b3f00;
    --color-blue: #2f4e6e;
    --color-yellow: #c2a94b;
    --color-dark-accent: color-mix( in srgb, var(--color-dark-foreground) 25%, #b08a4b );
    --font-header: "adobe-jenson-pro";
    --font-text: "adobe-jenson-pro";
    --page-padding: var(--space-2);
    --gap-block: var(--space-2);
    --gap-mobile-block: var(--space-2);
    --line-height: 1.55;
    --prose-width: 38rem;

    /* ─── Custom rules for Venetian ───────────────────────────── */
    /* burnt umber */ /* lapis-like */

        letter-spacing: 0.004em;
}
```
