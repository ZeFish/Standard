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
theme: frank
type: theme
visibility: private
snippet: false
---

![[Sample content]]

```css
[data-stnd-theme="frank"] {
    /* ─── Custom rules for Frank ───────────────────────────── */
    /* Dark */
    --color-dark-foreground: oklch(0.7721 0.0228 96.47);
    --color-dark-background: oklch(0.2308 0.0023 67.73);
    --color-dark-accent: var(--color-yellow);

    --color-dark-red: oklch(48.37% 0.1896 27.22);
    --color-dark-orange: oklch(68.30% 0.1638 52.74);
    --color-dark-yellow: oklch(77.36% 0.1572 70.09);
    --color-dark-green: oklch(48.45% 0.0792 169.07);
    --color-dark-cyan: oklch(55.79% 0.0866 200.53);
    --color-dark-blue: oklch(51.36% 0.0974 225.11);
    --color-dark-purple: oklch(52.98% 0.1621 332.34);
    --color-dark-pink: oklch(54.70% 0.1628 360);

    --color-dark-accent: var(--color-yellow);
    --color-dark-bold: var(--color-orange);
    --color-dark-italic: var(--color-blue);
    }


    .markdown-reading-view .callout[data-callout="caption"] {
        margin: -1rlh 33% 0 0 !important;
        padding:0;
        border-radius:0;
        text-wrap: balance;
    }
    .callout[data-callout="caption"] .callout-content {
        text-align: left;
        padding: 0;
        color: var(--color-foreground);
        border-radius:0;
    }

    .stnd-vertical-rhythm .markdown-preview-view [class^=el-]  hr { display:none !important; }

    .markdown-reading-view blockquote,
    		.markdown-reading-view pre,
    		.markdown-reading-view figure,
    		.markdown-reading-view .callout,
    		.markdown-reading-view p:has(img) {
    		  margin-inline: 0 !important;
    		  padding-inline: 0 !important;
    		}
    		
    		.markdown-reading-view h1,
     .cm-header-1,
     .HyperMD-header-1,
    .inline-title {
        text-align: left;
        padding-block-end: 6rlh;
        color: var(--color-foreground);
    }

    .markdown-reading-view .callout[data-callout="caption"]{
    	    margin-block: -1rlh 8rlh  !important;
}
```
