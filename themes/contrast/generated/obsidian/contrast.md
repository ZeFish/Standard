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
theme: contrast
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="contrast"] {
    /* ─── Custom rules for Contraste Élevé ───────────────────────────── */
    /* ─── Design Tokens ──────────────────────────────────────── */
    --color-light-background: #ffffff;
    --color-light-foreground: #000000;
    --color-dark-background: #000000;
    --color-dark-foreground: #ffffff;
    --color-light-accent: #0050ff;
    --color-dark-accent: #ffff00;
    --color-border: var(--color-foreground);
    --font-text: "Sohne", sans-serif;
    --font-header: "Inter", sans-serif;
    --font-weight-text: 500;
    --font-header-weight: 800;
    --font-header-letter-spacing: 0.02em;
    --line-height: 1.5;
    --optical-ratio: 1.414;
    --color-muted: var(--color-foreground);
    --color-subtle: var(--color-foreground);

    /* ─── Custom rules for Contraste Élevé ───────────────────────────── */
    /* High contrast strictly limits grayscales and relies on #000 and #fff */

      /* Use bright, pure colors for accents for maximum visibility */
      /* Bright Blue */
      /* Pure Yellow */
      /* Borders match text! */

      /* Highly legible font pairings */
      /* Slightly thicker base weight */
      /* Max boldness */

      /* High contrast elements must have distinct outlines */
      :focus-visible {
        outline: calc(var(--stroke-width) * 4) solid var(--color-accent);
        outline-offset: calc(var(--stroke-width) * 4);
        border-radius: calc(var(--stroke-width) * 4);
      }

      button,
      input,
      select,
      textarea,
      .module-card,
      blockquote,
      pre {
        border: var(--stroke-width) solid var(--color-foreground) !important;
        border-radius: var(--radius-sm);
      }

      /* Text elements get stronger treatment */
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        text-decoration-thickness: calc(var(--stroke-width) * 3);
        text-underline-offset: calc(var(--stroke-width) * 3);
      }
      img {
        filter: contrast(1.2);
        /* Slightly increase image contrast */
      }

      a {
        color: var(--color-accent);
        text-decoration: underline;
        text-decoration-thickness: 3px;
        font-weight: 700;
      }

      /* Ensure text over accent background is readable (like buttons) */
      .action-button.primary,
      button.primary {
        background: var(--color-accent);
        color: var(--color-background);
        border: calc(var(--stroke-width) * 4) solid var(--color-background) !important;
        box-shadow: 0 0 0 calc(var(--stroke-width) * 4) var(--color-accent);
      }
}
```
