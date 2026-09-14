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
theme: manifeste
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="manifeste"] {
    /* ─── Custom rules for Manifeste ───────────────────────────── */
    --color-dark-bold: color-mix(
        in oklab,
        #de7260 85%,
        var(--color-background)
    );

    :is(.markdown-reading-view h1, .HyperMD-header-1, .inline-title) {
        text-align: center;
        padding: 3rlh 0;
        color: var(--color-foreground);
    }

    .callout {
            border-color: color-mix(
                in oklab,
                var(--callout-color) 20%,
                var(--color-surface, var(--color-background))
            );
            background-color: color-mix(
                in oklab,
                var(--callout-color) 2%,
                var(--color-surface, var(--color-background))
            );
            border-top: 0;
            border-right: 0;
            border-bottom: 0;
            border-left-width: 0.25rlh;
        }

        .callout-icon {
            color: var(--callout-color);
        }

        :is(.callout-title, .callout-title-inner) {
            color: var(--color-foreground);
        }

        .callout-content {
            border: 0;
            background: transparent;
            box-shadow: none;
        }

        .vertical-rhythm :is(ol, ul) > li {
            margin: 0;
        }
}
```
