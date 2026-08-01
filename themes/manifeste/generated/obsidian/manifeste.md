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

    .markdown-reading-view h1,
    .inline-title {
        text-align: center;
        padding: 3rlh 0;
        color: var(--color-foreground);
    }

    .markdown-reading-view {
        .callout {
            border-color: color-mix(
                in oklab,
                var(--callout-color) 20%,
                var(--background-secondary)
            );
            background-color: color-mix(
                in oklab,
                var(--callout-color) 2%,
                var(--background-secondary)
            );
            border-top: 0;
            border-right: 0;
            border-bottom: 0;
            border-left-width: 0.25rlh;
        }

        .callout-icon {
            color: var(--callout-color);
        }

        .callout-title {
            color: var(--color-foreground);
        }

        .callout-content {
            border: 0;
            background: transparent;
            box-shadow: none;
        }
    }

    .vertical-rhythm .markdown-preview-view ol > li,
    .vertical-rhythm .markdown-preview-view ul > li,
    .vertical-rhythm .markdown-source-view ol > li,
    .vertical-rhythm .markdown-source-view ul > li,
    .vertical-rhythm .mod-cm6 .HyperMD-list-line.cm-line {
        margin: 0rlh 0rlh 0rlh 0rlh;
    }
}
```
