---
aliases: []
created: 2026-07-24 09:35
modified: 2026-09-05 13:10
cssclasses: []
maturity: sprout
mode: read
publish: false
tags:
  - design
theme: apex
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="apex"] {
    /* ─── Custom rules for Apex ───────────────────────────── */
    /* ─── Foreground & Background ────────────────────────────── */
    --color-light-foreground: #3b3b3b;
    --color-light-background: #e4e0d6;
    --color-dark-foreground:  #e4e0d6;
    --color-dark-background:  #1b1b1b;

    /* ─── Light Palette — Volcanic Tonal ─────────────────────── */
    /*
        Everything radiates from the brick red at the apex.
        Hues desaturate progressively as they cool away from red —
        like lava hardening into stone. The red still dominates.
    */
    --color-light-red:    oklch(53% 0.185 28);   /* brick vermillion — the apex */
    --color-light-orange: oklch(59% 0.148 38);   /* warm terra cotta            */
    --color-light-yellow: oklch(65% 0.110 55);   /* ochre clay                  */
    --color-light-green:  oklch(50% 0.048 130);  /* warm ash green              */
    --color-light-cyan:   oklch(53% 0.030 190);  /* stone grey                  */
    --color-light-blue:   oklch(44% 0.058 240);  /* dark slate                  */
    --color-light-purple: oklch(41% 0.082 310);  /* deep aubergine              */
    --color-light-pink:   oklch(54% 0.118 12);   /* deep rose                   */

    /* ─── Dark Palette — same hues, +10% luminance ──────────── */
    --color-dark-red:    oklch(63% 0.185 28);    /* ember red                   */
    --color-dark-orange: oklch(69% 0.148 38);    /* burnt sienna                */
    --color-dark-yellow: oklch(74% 0.110 55);    /* warm sand                   */
    --color-dark-green:  oklch(60% 0.048 130);   /* sage ash                    */
    --color-dark-cyan:   oklch(63% 0.030 190);   /* warm stone                  */
    --color-dark-blue:   oklch(54% 0.058 240);   /* blue slate                  */
    --color-dark-purple: oklch(52% 0.082 310);   /* deep violet                 */
    --color-dark-pink:   oklch(64% 0.118 12);    /* ember rose                  */

    /* ─── Semantic assignments ──────────────────────────────── */
    --color-accent:       var(--color-red);
    --color-light-accent: var(--color-red);
    --color-dark-accent:  var(--color-red);
    --color-bold:         var(--text-color);
    --color-italic:       var(--text-muted);

    /* ─── Typography ────────────────────────────────────────── */
    --bold-weight: 600;
    --font-ratio: 1.6;
    --font-text:      "MonoLisa";
    --font-feature:   "liga", "salt", "clig", "kern", "calt", "zero";
    --font-variation: "wght" 400;
    --font-header:    "Herbus Apex";
    --font-monospace: "MonoLisa";
    --font-interface: "MonoLisa";
    --font-header-weight:         400;
    --font-header-letter-spacing: -0.006em;
    --font-header-line-height:    1;

    /* ─── Dark mode font swap ────────────────────────────────── */
    &.theme-dark {
        --font-text:      "Sohne Mono";
        --font-monospace: "Sohne Mono";
        --font-interface: "Sohne Mono";
    }

    /* ─── Body text — subtle emboss shadow ──────────────────── */
     
        color: color-mix(in oklab, var(--color-foreground) 90%, transparent);

        --shadow-color: color-mix(in oklab, currentcolor 10%, transparent);
        --shadow-distance: 0px;
        --shadow-depth: 0.5px;
        text-shadow:
            var(--shadow-depth) 0px var(--shadow-depth) var(--shadow-color),
            calc(var(--shadow-depth) * -1) 0px var(--shadow-depth)
                var(--shadow-color),
            0px var(--shadow-depth) var(--shadow-depth) var(--shadow-color);

    /* ─── Links ─────────────────────────────────────────────── */
    .markdown-reading-view a {
        text-decoration: underline !important;
    }

    /* ─── Headers — sharp emboss shadow ─────────────────────── */
    .inline-title,
    .markdown-reading-view :is(h1, h2, h3, h4, h5, h6) {
        color: color-mix(in oklab, currentcolor 90%, var(--background-primary));

        --shadow-color: color-mix(
            in oklab,
            currentcolor 100%,
            var(--background-primary)
        );
        --shadow-distance: 0px;
        --shadow-depth: 0.75px;
        text-shadow:
            var(--shadow-depth) 0px var(--shadow-depth) var(--shadow-color),
            calc(var(--shadow-depth) * -1) 0px var(--shadow-depth)
                var(--shadow-color),
            0px var(--shadow-depth) var(--shadow-depth) var(--shadow-color);
    }

    /* ─── Light mode headers — red tint ─────────────────────── */
    &.theme-light .inline-title,
    &.theme-light .markdown-reading-view :is(h1, h2, h3, h4, h5, h6) {
        color: color-mix(
            in oklab,
            var(--color-red) 90%,
            var(--background-primary)
        );
    }

    /* ─── Light mode h1 — embossed against background ───────── */
    .markdown-reading-view h1,
    .inline-title {
        --color: color-mix(in oklab, var(--background-primary) 75%, black);
        text-shadow:
            -1px -1px 1px var(--color),
            1px -1px 1px var(--color),
            -1px 1px 1px var(--color),
            1px 1px 1px var(--color) !important;
    }

    /* ─── Dark mode h1 — red ghost ──────────────────────────── */
    &.theme-dark .markdown-reading-view h1,
    &.theme-dark .inline-title {
        --color: color-mix(in oklab, var(--background-primary) 0%, var(--color-red));
        text-shadow:
            -1px -1px 0px var(--color),
            1px -1px 0px var(--color),
            -1px 1px 0px var(--color),
            1px 1px 0px var(--color) !important;
    }
}
```
