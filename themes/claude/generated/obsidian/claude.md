---
aliases: []
created: 2026-07-24 09:35
modified: 2026-09-14 21:02
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: claude
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="claude"] {
    /* ─── Custom rules for Claude ───────────────────────────── */
    /* ─── Design Tokens ──────────────────────────────────────── */
    --color-light-background: oklch(0.98 0.01 95.1);
    --color-light-foreground: oklch(0.34 0.03 95.72);
    --color-light-accent: oklch(0.62 0.14 39.04);
    --color-dark-foreground: oklch(0.81 0.01 93.01);
    --color-dark-background: oklch(0.27 0 106.64);
    --color-dark-accent: oklch(0.67 0.13 38.76);
    --color-accent: var(--color-light-accent);
    --color-code: var(--color-foreground);
    --color-bold: var(--color-light-accent);
    --color-italic: color-mix( in srgb, var(--color-accent) 65%, var(--color-foreground) );
    --font-serif: "Ibarra Real Nova", Georgia, "Times New Roman", serif;
    --font-monospace: "MonoLisa", ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
    --optical-ratio: 1.414;
    --claude-opacity: 18%;
    --color-border: color-mix(in srgb, var(--color-foreground) 6%, transparent);

    /* ─── Custom rules for Claude ───────────────────────────── */
    /* Light theme foundations (OKLCH tuned) */

      /* Dark theme counterparts (kept expressive, slightly muted) */

      /* Semantic / alias tokens */

      /* Typographic voice */

      /* Utility */

      .dark {
        --color-accent: var(--color-dark-accent);
        --color-bold: var(--color-dark-accent);
      }

      :is(:is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title), :is(.markdown-reading-view h2, .HyperMD-header-2), :is(.markdown-reading-view h3, .HyperMD-header-3), :is(.markdown-reading-view h4, .HyperMD-header-4), :is(.markdown-reading-view h5, .HyperMD-header-5), :is(.markdown-reading-view h6, .HyperMD-header-6)) {
        border: none;
      }

      /* Prose niceties */
      :is(article, .prose) {
        background: transparent;
        color: var(--color-foreground);
        line-height: calc(var(--optical-ratio) + 0.25);
      }

      /* Small interactive touches */
      a {
        color: var(--color-accent);
        text-decoration: underline dotted;
        &:hover {
          text-decoration-style: solid;
        }
      }
}
```
