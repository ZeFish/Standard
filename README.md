# Standard

**Typography is the voice.**
**Grid is the structure.**
**Rhythm is the flow.**
**Color is the emotion.**

A fine-art design framework for the web, built on a simple truth: great design is not decoration—it is the careful arrangement of space, proportion, and meaning.

Rooted in the golden ratio and centuries of typographic wisdom, Standard bridges timeless print principles with the dynamic nature of the web.

[![npm version](https://img.shields.io/npm/v/@zefish/standard.svg)](https://www.npmjs.com/package/@zefish/standard)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Quick Start

```bash
npm install @zefish/standard
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="https://unpkg.com/@zefish/standard/dist/standard.css">
</head>
<body class="rhythm">
  <article class="reading">
    <h1>Beautiful Typography</h1>
    <p>Automatically enhanced with smart quotes, widow prevention, and classical spacing.</p>
  </article>

  <script src="https://unpkg.com/@zefish/standard/dist/standard.js"></script>
</body>
</html>
```

**That's it.** Standard auto-initializes with sensible defaults and progressive enhancement.

---

## Philosophy

Between the words and the whitespace, between the grid lines and the content, lies the essence of communication. Standard honors that space.

Great design asks nothing of the reader except to read. It removes friction, respects hierarchy, and follows the eye's natural movement through space. This framework implements what centuries of master typographers discovered: that mathematics and beauty are not opposites, that constraints enable freedom, and that the best design is felt, not seen.

---

## The Four Pillars

### 🗣️ Typography is the Voice

Smart quotes, proper punctuation, widow prevention, and multi-locale support that speaks with clarity.

```javascript
// Automatic enhancement
"Straight quotes" → "Curly quotes"
-- → em—dash
... → ellipsis…
Mr. Smith → Mr. Smith (non-breaking space)
```

**Multi-locale support:** English, French, German, Spanish, Italian—each with proper quotation marks, spacing rules, and number formatting.

### 📐 Grid is the Structure

A Swiss-style 12-column responsive grid that organizes with precision.

```html
<div class="grid">
  <div class="col-8 col-md-6">Main content</div>
  <div class="col-4 col-md-6">Sidebar</div>
</div>
```

**Inspired by Josef Müller-Brockmann** and the International Typographic Style.

### 🎵 Rhythm is the Flow

Mathematical vertical spacing based on the golden ratio that guides the eye with harmony.

```html
<article class="rhythm">
  <!-- All elements automatically align to a baseline grid -->
  <h2>Heading</h2>
  <p>Perfect spacing between elements.</p>
</article>
```

**Future-ready:** Prepared for CSS `text-box-trim` (coming 2025-2026).

### 🎨 Color is the Emotion

Automatic light/dark theming that responds to context and mood.

```css
/* Adapts automatically to user preference */
@media (prefers-color-scheme: dark) {
  /* Dark mode colors applied automatically */
}
```

**Zero configuration.** Respects user preferences. Accessible by default.

---

## Core Concepts

### The `.rhythm` Class

Applies consistent vertical spacing to all child elements, creating visual harmony through mathematical precision.

```html
<div class="rhythm">
  <h1>Heading</h1>
  <p>Paragraph with proper spacing.</p>
  <p>Another paragraph.</p>
  <blockquote>Quote with generous spacing.</blockquote>
</div>
```

**Features:**
- ✅ Margin-collapse safe (uses `flow-root`)
- ✅ Respects typographic hierarchy
- ✅ Handles nested content gracefully
- ✅ Works with all HTML elements
- ✅ Based on `1rlh` (root line-height) units

**Modifiers:**
```html
<div class="rhythm rhythm-tight">Tighter spacing (0.75×)</div>
<div class="rhythm rhythm-loose">Looser spacing (1.5×)</div>
<div class="rhythm rhythm-xl">Extra loose (2×)</div>
```

### The `.reading` Class

Editorial layout system for articles and long-form content, inspired by centuries of book design.

```html
<article class="reading">
  <!-- Main content: optimal reading width (42rem / ~66 characters) -->
  <h1>Article Title</h1>
  <p>Body text automatically constrained to comfortable reading width.</p>

  <!-- Accent: extends into margins -->
  <blockquote class="accent">
    Pull quotes and side notes.
  </blockquote>

  <!-- Feature: wider emphasis area -->
  <figure class="feature">
    <img src="wide-image.jpg" alt="Wide image">
  </figure>

  <!-- Full: edge-to-edge -->
  <div class="full">
    <img src="hero.jpg" alt="Full-width hero">
  </div>
</article>
```

**Layout Zones:**
- **content** (default) - 42rem, optimal for reading (60-75 characters per line)
- **accent** - Extends into side margins for pull quotes and asides
- **feature** - Wider emphasis area for images and media
- **full** - Edge-to-edge, full viewport width

### The `.grid` System

Swiss-style 12-column grid with logical properties and responsive utilities.

```html
<div class="grid">
  <!-- Basic spans -->
  <div class="col-6">Half width</div>
  <div class="col-6">Half width</div>

  <!-- Responsive -->
  <div class="col-12 col-md-8 col-lg-6">
    Full → 8 cols → 6 cols
  </div>

  <!-- Positioning -->
  <div class="col-4 start-3">
    4 columns wide, starting at column 3
  </div>

  <!-- Ergonomic presets -->
  <div class="col-half">1/2</div>
  <div class="col-third">1/3</div>
  <div class="col-two3">2/3</div>
  <div class="col-quarter">1/4</div>
</div>
```

**Gap Variants:**
```html
<div class="grid tight">Smaller gaps</div>
<div class="grid wide">Larger gaps</div>
<div class="grid no-row-gap">No vertical gaps</div>
<div class="grid row-gap-xl">Extra large vertical gaps</div>
```

**Free-Column Positioning:**
```html
<div class="grid">
  <!-- Precise positioning with CSS variables -->
  <div class="free-col" style="--start: 3; --span: 4;">
    Starts at column 3, spans 4 columns
  </div>

  <!-- Or use utility classes -->
  <div class="free-col startv-5 span-6">
    Starts at column 5, spans 6 columns
  </div>
</div>
```

---

## Typography Engine

Standard includes a JavaScript typography engine that applies micro-typographic enhancements automatically.

### Auto-Initialization (Default)

```html
<script src="standard.js"></script>
<!-- Automatically processes all text with smart defaults -->
```

The engine runs on page load and watches for dynamic content, applying:
- Smart quotes and apostrophes
- Proper punctuation (em-dashes, ellipses)
- Widow and orphan prevention
- Locale-specific spacing rules
- Fraction formatting (1/2 → ½)

### Manual Configuration

```javascript
const standard = new Standard({
  locale: 'en',                    // Auto-detected from <html lang="">
  enableSmartQuotes: true,         // "quotes" → "curly quotes"
  enablePunctuation: true,         // -- → em-dash, ... → ellipsis
  enableWidowPrevention: true,     // No orphaned words on last lines
  enableSpacing: true,             // Locale-specific spacing rules
  enableFractions: true,           // 1/2 → ½, 3/4 → ¾
  enableNumberFormatting: false,   // 1000 → 1,000 (conservative default)
  observeDOM: true,                // Watch for dynamic content
  autoProcess: true                // Process on page load
});
```

### Locale-Specific Typography

**English:**
```javascript
new Standard({ locale: 'en' });
// "Hello world" → "Hello world"
// -- → —
// Mr. Smith → Mr. Smith (non-breaking space)
// 1/2 → ½
```

**French:**
```javascript
new Standard({ locale: 'fr' });
// "Bonjour" → « Bonjour »
// word: → word : (thin space before punctuation)
// 1 000 → 1 000 (thin space separators)
// M. Dupont → M. Dupont (non-breaking space)
```

**German:**
```javascript
new Standard({ locale: 'de' });
// "Guten Tag" → „Guten Tag"
// 1000 → 1.000 (period separators)
// Dr. Schmidt → Dr. Schmidt (non-breaking space)
```

**Spanish & Italian:**
Each locale includes proper quotation marks, spacing conventions, and number formatting according to regional standards.

### Element-Level Control

```html
<!-- Disable for specific elements -->
<p data-standard-quotes="false">Keep "straight quotes"</p>
<pre data-standard-widows="false">Code block</pre>

<!-- Exclude entire sections -->
<nav translate="no">Navigation (automatically skipped)</nav>
<code>Code (automatically skipped)</code>
```

### API Methods

```javascript
// Process specific elements
standard.processElement(document.querySelector('article'));

// Refresh all processed content
standard.refresh();

// Update configuration on the fly
standard.updateOptions({
  enableSmartQuotes: false,
  locale: 'fr'
});

// Check current configuration
const config = standard.getConfig();
console.log(config.locale); // 'en'

// Toggle baseline grid debug mode
standard.toggleBaselineGrid(true);

// Measure font baseline offset (for fine-tuning)
standard.measureBaselineOffset('Georgia', 16);

// Clean up and remove all processing
standard.destroy();
```

### Events

Listen for processing events to integrate with your application:

```javascript
// After processing all elements
document.addEventListener('standard:afterProcessAll', (e) => {
  console.log(`Processed ${e.detail.processedCount} elements`);
});

// After processing individual element
document.addEventListener('standard:afterProcess', (e) => {
  console.log('Processed:', e.detail.element);
});

// Before processing starts
document.addEventListener('standard:beforeProcessAll', (e) => {
  console.log('Starting to process:', e.detail.selector);
});

// When options are updated
document.addEventListener('standard:optionsUpdated', (e) => {
  console.log('Options changed:', e.detail.newOptions);
});
```

---

## Design Tokens

Standard uses a comprehensive token system based on mathematical precision and the golden ratio.

### Typography Scale (Golden Ratio)

```css
:root {
  /* Mathematical ratios */
  --ratio-golden: 1.618;      /* φ - The golden ratio */
  --ratio-wholestep: 1.618;   /* Full step */
  --ratio-halfstep: 1.272;    /* √φ - Half-step harmony */
  --ratio-quarterstep: 1.128; /* ⁴√φ - Quarter-step */
  --ratio-eighthstep: 1.062;  /* ⁸√φ - Fine adjustments */

  /* Current ratio (configurable) */
  --font-ratio: var(--ratio-golden);

  /* Modular scale - calculated from font-ratio */
  --scale-xs: calc(var(--font-size) * pow(var(--font-ratio), -1));
  --scale-s: calc(var(--font-size) * pow(var(--font-ratio), -0.5));
  --scale: var(--font-size);          /* 1rem base */
  --scale-l: calc(var(--font-size) * pow(var(--font-ratio), 1));
  --scale-xl: calc(var(--font-size) * pow(var(--font-ratio), 2));
  --scale-xxl: calc(var(--font-size) * pow(var(--font-ratio), 3));
  --scale-xxxl: calc(var(--font-size) * pow(var(--font-ratio), 4));
}
```

### Spacing System (Rhythm-Based)

All spacing is based on `1rlh` (root line-height), ensuring vertical rhythm alignment:

```css
:root {
  /* Rhythm control */
  --rhythm-multiplier: 1;           /* Global rhythm scaling */
  --rhythm-block-space: 2;          /* Special block elements multiplier */

  /* Spacing scale - based on 1rlh */
  --space-xxxs: calc(1rlh / 5);     /* 0.2 rhythm units */
  --space-xxs: calc(1rlh / 4);      /* 0.25 rhythm units */
  --space-xs: calc(1rlh / 3);       /* 0.33 rhythm units */
  --space-s: calc(1rlh / 2);        /* 0.5 rhythm units */
  --space: 1rlh;                    /* 1 rhythm unit - FOUNDATION */
  --space-l: calc(2 * 1rlh);        /* 2 rhythm units */
  --space-xl: calc(3 * 1rlh);       /* 3 rhythm units */
  --space-xxl: calc(4 * 1rlh);      /* 4 rhythm units */
  --space-xxxl: calc(5 * 1rlh);     /* 5 rhythm units */

  /* Derived tokens */
  calc(var(--space) / 4): calc(var(--space) / 4);              /* Small gap for grids */
  --space-block: var(--space);                       /* Default block spacing */
  --space-block-special: calc(var(--space) * 2);    /* Blockquotes, figures */
}
```

### Line Width Tokens

Based on typography research for optimal readability:

```css
:root {
  --line-width-xs: 24rem;   /* ~384px - Narrow sidebars */
  --line-width-s: 32rem;    /* ~512px - Short form content */
  --line-width-m: 42rem;    /* ~672px - Optimal reading (60-75 chars) */
  --line-width-l: 50rem;    /* ~800px - Wider articles */
  --line-width-xl: 60rem;   /* ~960px - Documentation */
  --line-width-full: calc(100vw - (var(--space) * 2)); /* Responsive full */

  --line-width: var(--line-width-m); /* Default */
}
```

### Grid System Tokens

```css
:root {
  --grid-cols: 12;                  /* Number of columns */
  --grid-gap: var(--space);         /* Column gap */
  --grid-row-gap: var(--space);     /* Row gap */

  --container-max: 1200px;          /* Max container width */
  --container-standard: var(--space); /* Container padding */
}
```

### Color System (Auto Light/Dark)

Semantic tokens that automatically adapt to light/dark mode:

```css
:root {
  /* Semantic tokens (adapt automatically) */
  --color-background: /* white or #0f0f0f */;
  --color-foreground: /* near-black or near-white */;
  --color-accent: /* theme color */;

  /* Computed semantic colors */
  --color-muted: color-mix(in srgb, var(--color-foreground) 60%, var(--color-background));
  --color-subtle: color-mix(in srgb, var(--color-foreground) 40%, var(--color-background));
  --color-border: color-mix(in srgb, var(--color-foreground) 10%, var(--color-background));

  /* Background variants */
  --color-background-secondary: color-mix(in srgb, var(--color-foreground) 3%, var(--color-background));
  --color-background-tertiary: color-mix(in srgb, var(--color-foreground) 6%, var(--color-background));

  /* Interactive states */
  --color-hover: color-mix(in srgb, var(--color-accent) 35%, var(--color-background));
  --color-active: color-mix(in srgb, var(--color-accent) 20%, var(--color-background));

  /* Shadows */
  --shadow-color: color-mix(in srgb, var(--color-foreground) 7%, transparent);
  --shadow: 0 0 var(--space-xxs) var(--shadow-color);
}
```

**Automatic dark mode** via `@media (prefers-color-scheme: dark)` - no JavaScript required.

---

## Customization

### Override Design Tokens

```css
/* Custom theme */
:root {
  /* Typography */
  --font-text: 'Minion Pro', Georgia, serif;
  --font-header: 'Optima', 'Avenir Next', sans-serif;
  --font-monospace: 'SF Mono', 'Fira Code', monospace;
  --font-ratio: var(--ratio-golden);

  /* Spacing & Rhythm */
  --font-density: 1.5;              /* Line-height multiplier */
  --rhythm-multiplier: 1.2;         /* Scale all vertical spacing */

  /* Colors */
  --color-accent: oklch(65% 0.2 50);
  --color-light-background: #fefefe; /* Off-white like paper */
  --color-dark-background: #0a0a0a;  /* Deep black */

  /* Grid */
  --grid-cols: 16;                   /* 16-column grid */
  --grid-gap: var(--space-l);        /* Larger gaps */
}
```

### Custom Reading Layout Widths

```css
:root {
  --line-width-m: 38rem;             /* Narrower reading width */
  --content-accent: minmax(0, var(--space-xxl)); /* Wider margins */
  --content-feature: minmax(0, var(--space-xxxl)); /* Wider feature area */
}
```

### Font Feature Settings

```css
:root {
  /* Enable OpenType features */
  --font-feature: 'liga', 'dlig', 'kern', 'calt', 'ss01';
  --font-header-feature: 'dlig', 'case', 'kern', 'cv01', 'cv02';
  --font-monospace-feature: 'liga', 'calt', 'ss01', 'ss15';
}
```

---

## Advanced Usage

### Markdown Enhancement

Add `.md` class for enhanced callouts, code blocks, and formatting:

```html
<article class="reading rhythm md">
  <div class="callout" data-callout="note">
    <div class="callout-title">Note</div>
    <div class="callout-content">
      <p>Enhanced callout with proper typography.</p>
    </div>
  </div>

  <div class="callout" data-callout="warning">
    <div class="callout-title">Warning</div>
    <div class="callout-content">
      <p>Color-coded callouts for different types.</p>
    </div>
  </div>

  <div class="callout" data-callout="important">
    <div class="callout-title">Important</div>
    <div class="callout-content">
      <p>Critical information stands out.</p>
    </div>
  </div>
</article>
```

**Callout Types:** `note`, `warning`, `important`, `caption`

**Collapsible Callouts:**
```html
<details class="callout" data-callout="note">
  <summary>
    <div class="callout-title">Click to expand</div>
  </summary>
  <div class="callout-content">
    <p>Hidden content revealed on click.</p>
  </div>
</details>
```

### Image Galleries

The `.reading` layout automatically creates galleries from multiple images:

```html
<article class="reading">
  <!-- Automatic gallery layout -->
  <p>
    <img src="1.jpg" alt="Image 1">
    <img src="2.jpg" alt="Image 2">
    <img src="3.jpg" alt="Image 3">
  </p>
  <!-- Images automatically arranged in a flex grid with gaps -->
</article>
```

**Image Zoom:**
Images in `.reading` or `.rhythm` containers support click-to-zoom:

```html
<article class="reading">
  <img src="photo.jpg" alt="Click to zoom">
  <!-- Click activates full-screen zoom overlay -->
</article>
```

### Utility Classes

**Spacing:**
```html
<div class="no-margin-block">No vertical margin</div>
<div class="no-margin-inline">No horizontal margin</div>
<div class="auto-margin-inline">Centered horizontally</div>
<div class="no-padding-block">No vertical padding</div>
```

**Typography:**
```html
<p class="small">Smaller text (--scale-s)</p>
<p class="smaller">Even smaller (--scale-xs)</p>
<p class="compact">Tighter line-height</p>
<p class="font-mono">Monospace font</p>
<strong class="bold">Bold text</strong>
```

**Colors:**
```html
<p class="text-muted">Muted text (60% opacity)</p>
<p class="text-subtle">Subtle text (40% opacity)</p>
<p class="text-accent">Accent color</p>
<p class="text-success">Success color</p>
<p class="text-warning">Warning color</p>
<p class="text-error">Error color</p>

<div class="bg-secondary">Secondary background</div>
<div class="bg-tertiary">Tertiary background</div>
```

**Layout:**
```html
<div class="box">Card with padding, border, shadow</div>
<div class="box-inset">Card with inset shadow</div>
<div class="centered">Centered with max-width</div>
<div class="centered-narrow">Narrower centered container</div>
```

**Line Width:**
```html
<div class="width-xs">Extra small width (24rem)</div>
<div class="width-s">Small width (32rem)</div>
<div class="width-m">Medium width (42rem)</div>
<div class="width-l">Large width (50rem)</div>
<div class="width-xl">Extra large width (60rem)</div>
```

---

## Baseline Grid (Future-Ready)

Standard is prepared for CSS `text-box-trim` and `leading-trim`, which will enable true baseline grid alignment when browsers ship support (expected 2025-2026).

### Current Approach

Standard uses `1rlh` units and mathematical spacing to create visual rhythm. While not true baseline alignment, it provides consistent, harmonious spacing.

### Future Support

```css
/* Already included in Standard - activates when supported */
@supports (text-box-trim: both) {
  .rhythm > * {
    text-box-trim: both;
    text-box-edge: cap alphabetic;
  }
}

@supports (leading-trim: both) {
  .rhythm > * {
    leading-trim: both;
    text-edge: cap alphabetic;
  }
}
```

### Debug Mode

Visualize the baseline grid during development:

```javascript
// Show baseline grid overlay
standard.toggleBaselineGrid(true);

// Measure font baseline offset for fine-tuning
standard.measureBaselineOffset('Georgia', 16);
```

```html
<!-- Or add data attribute to body -->
<body data-baseline-debug="true">
  <article class="rhythm">
    <!-- Grid lines visible for alignment checking -->
  </article>
</body>
```

---

## Browser Support

| Feature | Support |
|---------|---------|
| CSS Framework | All modern browsers (Grid + Custom Properties) |
| Typography Engine | ES6+ (Chrome 51+, Firefox 54+, Safari 10+) |
| Baseline Grid | Safari TP (2024), Chrome/Firefox (2025-2026) |
| Dark Mode | All browsers with `prefers-color-scheme` |
| Logical Properties | All modern browsers |

**Progressive enhancement** ensures graceful degradation for older browsers.

---

## File Structure

```
standard/
├── dist/
│   ├── standard.css              # Compiled CSS (~45KB minified)
│   ├── standard.css.map          # Source map
│   ├── standard.js               # Typography engine (~15KB minified)
│   └── standard.js.map           # Source map
├── src/
│   ├── scss/
│   │   ├── sanitize.scss                # Modern CSS reset
│   │   ├── standard-00-token.scss       # Design tokens & golden ratio
│   │   ├── standard-01-grid.scss        # 12-column Swiss grid
│   │   ├── standard-02-prose.scss       # Reading layout system
│   │   ├── standard-03-typography.scss  # Font system & OpenType
│   │   ├── standard-04-rhythm.scss      # Vertical spacing & baseline
│   │   ├── standard-05-color.scss       # Color system & theming
│   │   ├── standard-06-img.scss         # Image handling & galleries
│   │   ├── standard-07-md.scss          # Markdown enhancements
│   │   ├── standard-08-utilities.scss   # Utility classes
│   │   └── standard.scss                # Main entry point
│   └── js/
│       └── standard.js                  # Typography engine
├── package.json
└── README.md
```

---

## Development

```bash
# Install dependencies
npm install

# Development mode (watch for changes)
npm run dev

# Build for production
npm run build

# Clean and rebuild
npm run release

# Clean dist folder
npm run clean
```

---

## Examples

### Simple Article

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="standard.css">
</head>
<body class="rhythm">
  <article class="reading">
    <h1>The Art of Typography</h1>
    <p>Typography is not just about choosing fonts—it's about creating rhythm, hierarchy, and meaning through careful attention to detail.</p>

    <h2>Principles</h2>
    <p>Great typography follows timeless principles: readability, hierarchy, and respect for the reader's eye.</p>

    <blockquote class="accent">
      "Typography is the craft of endowing human language with a durable visual form."
      <cite>— Robert Bringhurst</cite>
    </blockquote>
  </article>

  <script src="standard.js"></script>
</body>
</html>
```

### Grid Layout

```html
<div class="grid">
  <header class="col-full">
    <h1>Site Header</h1>
  </header>

  <main class="col-8 col-md-12">
    <article class="rhythm">
      <h2>Main Content</h2>
      <p>Content with vertical rhythm.</p>
    </article>
  </main>

  <aside class="col-4 col-md-12">
    <div class="box rhythm">
      <h3>Sidebar</h3>
      <p>Related content.</p>
    </div>
  </aside>

  <footer class="col-full">
    <p class="small text-muted">Footer content</p>
  </footer>
</div>
```

### Multi-Locale

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <link rel="stylesheet" href="standard.css">
</head>
<body class="rhythm">
  <article class="reading">
    <h1>Typographie Française</h1>
    <p>Le texte sera automatiquement amélioré avec les guillemets français « comme ceci » et les espaces fines avant la ponctuation :</p>
    <p>Exemple : voici un texte avec une ponctuation correcte !</p>
  </article>

  <script src="standard.js"></script>
  <!-- Auto-detects French from <html lang="fr"> -->
</body>
</html>
```

---

## Inspiration

Standard stands on the shoulders of giants:

- **Robert Bringhurst** - *The Elements of Typographic Style*
- **Josef Müller-Brockmann** - *Grid Systems in Graphic Design*
- **Jan Tschichold** - *The New Typography*
- **Ellen Lupton** - *Thinking with Type*
- **Swiss Typography** - International Typographic Style
- **Raster CSS** - Modern Swiss grid systems for the web

---

## Contributing

Contributions welcome! Please ensure:

- ✅ Maintains mathematical precision (golden ratio system)
- ✅ Follows classical typography principles
- ✅ Includes tests for new features
- ✅ Updates documentation
- ✅ Respects the four pillars: Typography, Grid, Rhythm, Color

---

## Roadmap

- [x] **v2.0** - Complete rewrite with logical properties
- [ ] **v2.1** - CSS `text-box-trim` support (when browsers ship)
- [ ] **v2.2** - Container query utilities
- [ ] **v2.3** - Additional locale support (Japanese, Arabic, Chinese)
- [ ] **v2.4** - Storybook component showcase
- [ ] **v3.0** - CSS-only mode (optional JavaScript)

---

## License

MIT License - Free to use for personal and commercial projects.

---

> *"Typography is the craft of endowing human language with a durable visual form. Grid systems provide the structure. Vertical rhythm creates the flow. Color conveys the emotion. Together, they form a complete language of design."*

**[View Demo](https://standard.zefish.dev)** · **[GitHub](https://github.com/zefish/standard)** · **[NPM](https://www.npmjs.com/package/@zefish/standard)**
