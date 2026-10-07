---
aliases: []
created: 2026-07-24 09:35
modified: 2026-10-07 13:46
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
    --font-serif: "Ibarra Real Nova", Georgia, "Times New Roman", serif;
    --font-monospace: "MonoLisa", ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
    --optical-ratio: 1.414;
    --claude-opacity: 18%;

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
