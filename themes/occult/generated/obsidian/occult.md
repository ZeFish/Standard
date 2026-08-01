---
aliases: []
created: 2026-07-24 09:35
modified: 2026-07-24 09:35
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: occult
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="occult"] {
    /* ─── Custom rules for Occult ───────────────────────────── */
    /* ─── Design Tokens ──────────────────────────────────────── */
    --color-light-background: #f8f5f1;
    --color-light-foreground: #1c1c1b;
    --color-light-accent: #be9c63;
    --color-light-red: #8a3324;
    --color-light-orange: #c1742d;
    --color-light-green: #4a7a49;
    --color-light-cyan: #3b8d8a;
    --color-light-blue: #2f5f87;
    --color-light-purple: #6b4b8a;
    --color-dark-background: #0f0f0f;
    --color-dark-foreground: #efeae3;
    --color-dark-accent: color-mix(in srgb, var(--color-light-accent) 60%, #000 40%);
    --color-bold: var(--color-red);
    --color-italic: var(--color-green);
    --font-text: "Fern";
    --font-header: "Fern";
    --font-monospace: "Monaspace Xenon";

    /* ─── Custom rules for Occult ───────────────────────────── */
    /* === Core palette (light) === */
      /* warm paper */
      /* faded ink */
      /* antique gold */

      /* Ancillary accents */
      /* dried blood / sealing wax */

      /* === Dark mode counterparts === */

      /* Semantic aliases */

      /* Typography & tokens */

      .dark {
        --color-accent: var(--color-dark-accent);
        --color-bold: var(--color-dark-accent);
      }

      /* Pre/code treatment — keep it readable against the parchment */
      :is(pre, code) {
        font-family: var(--font-monospace);
        background: color-mix(in srgb, var(--color-foreground) 3%, transparent);
        color: var(--color-foreground);
        border-radius: var(--radius);
        padding: calc(var(--space) * 0.75);
      }

      /* Media blocks stand out softly on the parchment */
      :is(p:has(img), figure) {
        background: color-mix(in srgb, var(--color-light-accent) 3%, transparent);
        padding: var(--space);
        border-radius: calc(var(--radius) + var(--space-2));
      }
}
```
