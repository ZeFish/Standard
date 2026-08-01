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
theme: federal
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="federal"] {
    /* ─── Custom rules for Federal ───────────────────────────── */
    /* 🌙 Active Mapping (Dark Mode) */
      &[data-mode="dark"],
      .dark & {
        --color-background: var(--color-dark-background);
        --color-foreground: var(--color-dark-foreground);
        --color-accent: var(--color-dark-accent);
        --color-border: var(--color-dark-border);
        --color-surface: var(--color-dark-surface);
        --color-surface-low: var(--color-dark-surface-low);
        --color-subtle: var(--color-dark-subtle);
        --color-muted: var(--color-dark-muted);
      }

      /* The theme selector sits on <html> — paint its own background so the
         sheet extends past the body's measure with no cold gray margins. */
      background: var(--color-background);

      /* Headings take the ink, not the base prose engine's heading color. */
      h1,
      h2,
      h3,
      h4 {
        color: var(--color-foreground);
        text-align:left;
        padding:0 0;
      }

      /* ─── The spec voice: Berkeley Mono, small, engineering-flat ─────── */
      .spec {
        font-family: var(--font-monospace);
        font-size: var(--scale-d3);
        letter-spacing: 0.02em;
        line-height: 1.5;
        margin: 0;

        &.label {
          color: var(--color-subtle);
          text-transform: uppercase;
          font-size: var(--scale-d4);
          margin-block-end: 0.3em;
        }
      }

      /* ─── The federal bar: the one heavy element ──────────────────────── */
      .bar {
        height: calc(var(--space-d2) * 1.2);
        background: var(--color-accent);
        display:none;
        margin-block: 0;
      }
}
```
