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
theme: calm
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="calm"] {
    /* ─── Custom rules for Calme (Anti-Surcharge) ───────────────────────────── */
    /* ─── Design Tokens ──────────────────────────────────────── */
    --color-light-background: #eeebe5;
    --color-light-foreground: #4a4743;
    --color-dark-background: #1e1d1b;
    --color-dark-foreground: #cdcac4;
    --color-accent: #6f8c7e;
    --color-border: transparent;
    --color-subtle: color-mix(in srgb, var(--color-foreground) 4%, transparent);
    --font-text: "Quicksand", sans-serif;
    --font-header: "Quicksand", sans-serif;
    --font-weight-text: 400;
    --font-header-weight: 600;
    --font-header-letter-spacing: 0em;
    --line-height: 1.6;
    --optical-ratio: 1.333;
    --radius-base: 16px;
    --radius-md: 24px;
    --radius-lg: 32px;

    /* ─── Custom rules for Calme (Anti-Surcharge) ───────────────────────────── */
    /* Soft, earthy, desaturated pastel tokens to reduce visual fatigue */
      /* Soft taupe/sand */
      /* Warm, low-contrast dark gray */
      /* Soft warm dark */
      /* Muted light gray */
      /* Desaturated sage green */
      /* Remove harsh lines */

      /* Soft, rounded typography */
      /* Avoid aggressive boldness */
      /* Softer scale increment limit */

      /* Override structural tokens */

      /* Universal overstimulation reducers */
      * {
        /* Globally soften transitions and shadows */
        box-shadow: none !important;
        transition-duration: 0.8s !important;
        /* Make what little animation exists feel relaxed, or just slow it */
      }

      button,
      .module-card,
      a {
        /* No sharp borders, rely purely on soft surface backgrounds */
        border: none !important;
      }

      /* Specific softening for cards */
      .module-card {
        background: var(--color-subtle) !important;
      }
}
```
