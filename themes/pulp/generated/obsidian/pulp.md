---
aliases: []
created: 2026-10-18 04:36
modified: 2026-10-18 04:36
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: pulp
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="pulp"] {
    /* ─── Custom rules for Pulp ───────────────────────────── */
    background: var(--color-background);

      :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title), :is(.markdown-reading-view h2, .HyperMD-header-2), :is(.markdown-reading-view h3, .HyperMD-header-3), :is(.markdown-reading-view h4, .HyperMD-header-4), :is(.markdown-reading-view h5, .HyperMD-header-5), :is(.markdown-reading-view h6, .HyperMD-header-6) {
        font-family: var(--font-header);
        color: var(--color-foreground);
        letter-spacing: var(--font-header-letter-spacing, -0.015em);
        line-height: var(--font-header-line-height, 1.05);
      }

      :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title) {
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: -0.02em;
        border-bottom: 2px solid var(--color-accent);
        padding-bottom: var(--space-d4, 0.25rem);
        margin-bottom: var(--space, 1rem);
      }

      :is(.markdown-reading-view h2, .HyperMD-header-2) {
        font-weight: 700;
      }

      /* Sharp paper cuts: dime-store novel aesthetic */
      button,
      .button,
      input,
      select,
      textarea,
      article.card,
      .card {
        border-radius: var(--radius-base, 0);
      }

      .badge,
      .tag,
      .pill {
        border-radius: var(--radius-md, 2px);
        font-family: var(--font-monospace);
        text-transform: uppercase;
        font-size: var(--scale-d4, 0.75rem);
        letter-spacing: 0.05em;
      }

      /* Pulp yellow highlighter selection */
      ::selection {
        background: var(--color-accent);
        color: #1d140d;
      }
}
```
