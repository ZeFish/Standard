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
theme: avantgarde
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="avantgarde"] {
    /* ─── Custom rules for Avant-Garde ───────────────────────────── */
    /* ─── Foreground & Background ────────────────────────────── */
    --color-light-foreground: #393633;
    --color-light-background: #e7e8e7;
    --color-dark-foreground:  #dcdad6;
    --color-dark-background:  #262421;

    /* ─── Light Palette — Bauhaus Editorial ─────────────────── */
    /*
        Reference: ITC Avant Garde Magazine, Push Pin Studios, 1970s
        offset lithography. Warm, assertive, geometric — not web-primaries.
        Each hue sits at a perceptually even luminance (~48–65%) so the
        Color Div swatches read as equally weighted on the warm grey ground.
    */
    --color-light-red:    oklch(50% 0.188 22);   /* deep vermillion     */
    --color-light-orange: oklch(64% 0.172 45);   /* warm amber-orange   */
    --color-light-yellow: oklch(72% 0.158 78);   /* Bauhaus ochre       */
    --color-light-green:  oklch(52% 0.118 150);  /* olive-sage          */
    --color-light-cyan:   oklch(60% 0.096 200);  /* Kodachrome teal     */
    --color-light-blue:   oklch(47% 0.130 242);  /* cobalt              */
    --color-light-purple: oklch(47% 0.142 305);  /* deep grape          */
    --color-light-pink:   oklch(57% 0.158 350);  /* warm rose           */

    /* ─── Dark Palette — same hues, lifted luminance ────────── */
    --color-dark-red:    oklch(61% 0.188 22);    /* ember red           */
    --color-dark-orange: oklch(71% 0.168 47);    /* warm amber          */
    --color-dark-yellow: oklch(80% 0.158 80);    /* candlelight         */
    --color-dark-green:  oklch(63% 0.118 150);   /* sage                */
    --color-dark-cyan:   oklch(68% 0.096 200);   /* teal mist           */
    --color-dark-blue:   oklch(58% 0.130 242);   /* midnight blue       */
    --color-dark-purple: oklch(59% 0.142 305);   /* smoky violet        */
    --color-dark-pink:   oklch(67% 0.158 350);   /* rose quartz         */

    /* ─── Semantic assignments ──────────────────────────────── */
    --color-light-accent: var(--color-orange);
    --color-dark-accent:  var(--color-orange);

    /* ─── Typography ────────────────────────────────────────── */
    --bold-weight: 600;
    --font-ratio: 1.6;
    --font-text:      "Sohne Mono";
    --font-header:    "Avant Garde Pro";
    --font-monospace: "Sohne Mono";
    --font-interface: "Sohne Mono";
    --font-header-weight:         700;
    --font-header-letter-spacing: -0.05em;
    --font-header-line-height:    1;

    /* ─── Links ─────────────────────────────────────────────── */
    .markdown-reading-view a {
        text-decoration: none !important;
        font-weight: 500;
    }

    .markdown-reading-view a:hover {
        text-decoration: none !important;
    }

    /* ─── Chisel texture ─────────────────────────────────────── */
    &.theme-dark.chisel-texture .workspace::before {
        opacity: 1;
    }

    &.theme-dark.chisel-texture .workspace::after {
        opacity: 1;
    }

    /* ─── Headers — ghost text with foreground shadow ────────── */
    .markdown-reading-view :is(h1, h2, h3, h4, h5, h6),
    .HyperMD-header-1,
    .HyperMD-header-2,
    .HyperMD-header-3,
    .HyperMD-header-4,
    .HyperMD-header-5,
    .HyperMD-header-6,
    .inline-title {
        text-shadow: 0px 0px 0.7px
            color-mix(in oklab, var(--color-foreground) 95%, transparent);
        color: transparent;
        text-align: left;
    }

    /* ─── Inline title — orange ghost ───────────────────────── */
    .inline-title {
        font-feature-settings: "dlig" on;
        font-weight: 600;
        text-transform: uppercase;
        text-shadow: 0px 0px 0.01em
            color-mix(in oklab, var(--color-orange) 95%, transparent);
        color: transparent;
    }

    /* ─── Images & lists ────────────────────────────────────── */
    .markdown-reading-view {
        img {
            filter: none !important;
            mix-blend-mode: normal !important;
        }

        ul,
        ol {
            padding: 0rlh 1rlh;
            margin: 1rlh 0rlh;
        }
    }
}
```
