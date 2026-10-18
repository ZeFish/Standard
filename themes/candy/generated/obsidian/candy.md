---
aliases: []
created: 2026-10-18 04:28
modified: 2026-10-18 04:29
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: candy
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="candy"] {
    /* ─── Custom rules for Candy ───────────────────────────── */
    background: var(--color-background);

      :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title), :is(.markdown-reading-view h2, .HyperMD-header-2), :is(.markdown-reading-view h3, .HyperMD-header-3), :is(.markdown-reading-view h4, .HyperMD-header-4), :is(.markdown-reading-view h5, .HyperMD-header-5), :is(.markdown-reading-view h6, .HyperMD-header-6) {
        font-family: var(--font-header);
        color: var(--color-foreground);
        letter-spacing: var(--font-header-letter-spacing, -0.01em);
        line-height: var(--font-header-line-height, 1.15);
      }

      :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title) {
        font-weight: 800;
      }

      /* Confectionery rounded elements */
      button,
      .button,
      input,
      select,
      textarea,
      article.card,
      .card {
        border-radius: var(--radius-md, 20px);
      }

      .badge,
      .tag,
      .pill {
        border-radius: var(--radius-lg, 32px);
      }

      ::selection {
        background: color-mix(in srgb, var(--color-accent) 25%, transparent);
        color: var(--color-foreground);
      }
}
```
