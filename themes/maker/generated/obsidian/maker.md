---
aliases: []
created: 2026-10-23 12:17
modified: 2026-10-23 12:17
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: maker
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="maker"] {
    /* ─── Custom rules for Maker ───────────────────────────── */
    /* Accent system */


    /* Accent system */

    /* Code and UI extras */
    --color-dark-accent: var(--color-purple);

    --color-bold-default: var(--color-red);
    --color-italic-default: var(--color-blue);

    --font-density: 1.5;
    --font-ratio: 1.5;
    --font-line-width: 55ch;

    --font-text: "MonoLisa";
    --font-weight: 400;
    --bold-weight: 500;
    --font-feature: "";
    --font-variation: "";

    --font-header: "Fraunces";
    --font-weight-header: 400;
      --font-header-feature: "";
      --font-header-variation: "SOFT" 100, "WONK" 1;
      --font-header-letter-spacing: -0.065em;

    --font-monospace: "MonoLisa";
    --font-mono-feature: "";
    --font-mono-variation: "";

    --font-interface: "MonoLisa";

      --code-function: var(--color-pink);

      :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title, .reveal h1, .slides h1) {
        text-align: left;
      }

      .token.comment {
        color: color-mix(
          in oklab,
          var(--color-foreground) 40%,
          var(--color-background)
        );
        font-style: italic;
      }
}
```
