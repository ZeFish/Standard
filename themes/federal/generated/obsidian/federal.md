---
aliases: []
created: 2026-07-24 09:35
modified: 2026-10-14 14:00
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
    /* The dark scheme needs no mapping here: every role is one `light-dark()` declaration in
         @stnd/styles and reads the seeds in tokens.yaml. (A hand-written dark block used to map the
         roles to `--color-dark-*` names, one of which, `--color-dark-surface`, does not exist.) */

      /* The theme selector sits on <html> — paint its own background so the
         sheet extends past the body's measure with no cold gray margins. */
      background: var(--color-background);

      /* Headings take the ink, not the base prose engine's heading color. */
      :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title),
      :is(.markdown-reading-view h2, .HyperMD-header-2),
      :is(.markdown-reading-view h3, .HyperMD-header-3),
      :is(.markdown-reading-view h4, .HyperMD-header-4) {
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
