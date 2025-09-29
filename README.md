# Standard

A fine-art typography framework implementing classical design principles, mathematical precision with the golden ratio, and micro-typography rules inspired by the masters of print design.

> *"The standard is the space between columns of type. It is not merely empty space, but an active participant in the rhythm and harmony of the page."* — Inspired by Jan Tschichold

## Quick Start

```bash
npm install @zefish/standard
```

```css
@import '@zefish/standard';
```

### CDN Usage

```html
<!-- Include the Standard CSS -->
<link rel="stylesheet" href="https://unpkg.com/@zefish/standard/min">

<!-- Include the Standard JavaScript -->
<script src="https://unpkg.com/@zefish/standard/js"></script>
```

## Philosophy

Standard bridges the centuries-old wisdom of print typography with the dynamic nature of the web. Named after the fundamental typographic term for the space between columns, this framework embodies the principle that design is not just about what you include, but how you organize the spaces between.

## Architecture

Standard is built around classical typography and print design principles:

### `.reading` - Fine-Art Layout System
Handles article content positioning using print design terminology and principles:

- **.content:** Main content area with reading margins
- **standard** - Sidebar space (traditional print term for space between columns)
- **feature** - Emphasized content area for images and highlights
- **bleed** - Full width content extending to edges (print terminology)

**Print Design Philosophy:**
- **content/standard/feature** areas maintain comfortable reading proportions
- **bleed** areas extend to edges like print design bleeds for impact
- Each class name reflects actual typography and print design terminology

### `.rhythm` - Vertical Spacing System
Mathematical vertical spacing system based on classical typography principles and the golden ratio.

**Mathematical Precision:**
```
Golden Ratio System:
├── --ratio-golden: 1.618       (φ - Classical proportion)
├── --ratio-halfstep: 1.272     (√φ - Half-step harmony)
├── --ratio-quarterstep: 1.128  (⁴√φ - Quarter-step precision)
└── --ratio-eighthstep: 1.062   (⁸√φ - Fine adjustments)

Vertical Rhythm: 1rlh (root line height)
├── --space-xxxs: marge ÷ 5    (Fine details)
├── --space-xxs:  marge ÷ 4    (Micro spacing)
├── --space-xs:   marge ÷ 3    (Small spacing)
├── --space-s:    marge ÷ 2    (Half rhythm)
├── --space:      marge        (1 rhythm unit) ← FOUNDATION
├── --space-l:    2 × marge    (Double rhythm)
├── --space-xl:   3 × marge    (Triple rhythm)
├── --space-xxl:  4 × marge    (Quad rhythm)
└── --space-xxxl: 5 × marge    (Quintuple rhythm)
```

Fine-art typography principles:
- **Mathematical consistency** based on golden ratio derivatives
- **Baseline grid alignment** ensures visual harmony
- **Print-inspired proportions** create timeless layouts
- **Modular scale typography** maintains hierarchical clarity

**Visual Rhythm Indicators:**
```html
<!-- Show baseline grid for debugging -->
<div class="grid-debug">
  <article class="rhythm">
    <!-- Content aligns to visible grid lines -->
  </article>
</div>
```

**Fine-Art Typography Rules:**
```css
.fine-art-component {
  margin-bottom: var(--space-l);     /* Golden ratio proportions */
  padding: var(--space) var(--space-s); /* Mathematical precision */
  font-size: calc(var(--font-size-base) * var(--ratio-golden));
}

.classical-section + .classical-section {
  margin-top: var(--space-xl);       /* Print design spacing */
}
```

**JavaScript Typography Engine:**
```javascript
const typography = new StandardTypography({
  enableSmartQuotes: true,      // "quotes" → "quotes"
  enableWidowPrevention: true,  // Prevent single words on lines
  enablePunctuation: true,      // -- → em—dash, ... → ellipsis…
  locale: 'fr'                  // French spacing: word : → word :
});
```

## Fine-Art Typography Usage

### Book Layout Only
For content positioning using print design terminology:

```html
<article class="book">
  <h1>Article Title</h1>
  <p>Main content sits in optimal reading width.</p>
  <div class="standard">Sidebar content in the standard space.</div>
  <div class="feature">Featured content with emphasis.</div>
  <div class="bleed">Full-width content that bleeds to edges.</div>
</article>
```

### Rhythm Only
For consistent typography spacing in a simple layout:

```html
<article class="rhythm">
  <h1>Properly spaced heading</h1>
  <p>Content with vertical rhythm applied.</p>
  <p>Consistent spacing between elements.</p>
</article>
```

### Complete Fine-Art System
Combining book layout, rhythm, and typography engine:

```html
<article class="book rhythm">
  <h1>Fine-Art Article</h1>
  <p>Content with mathematical spacing and micro-typography.</p>

  <div class="standard">
    <h3>Marginal Notes</h3>
    <p>Traditional print design sidebar placement.</p>
  </div>

  <blockquote>"Enhanced quotes with smart typography"</blockquote>

  <div class="bleed">
    <h2>Full-Width Feature</h2>
    <p>Content extending to edges like print bleeds.</p>
  </div>
</article>

<script src="https://unpkg.com/@zefish/standard@0.1.3/dist/standard.js"></script>
```

### Enhanced Markdown with Typography
Add `.md` for enhanced markdown with fine-art typography:

```html
<article class="book rhythm md">
  <div class="callout" data-callout="note">
    <div class="callout-title">Nota Bene</div>
    <div class="callout-content">
      <p>Enhanced callouts with "smart quotes" and proper spacing.</p>
    </div>
  </div>
</article>

<!-- Ensure standard.js is loaded, e.g., via CDN: <script src="https://unpkg.com/@zefish/standard@0.1.3/dist/standard.js"></script> -->
<script>
// Auto-applies widow prevention, smart quotes, proper punctuation
const typography = new StandardTypography();
</script>
```

## Design System

### Typography Scale
Mathematical precision based on the golden ratio and its derivatives:

- Golden ratio system: `--ratio-golden` (1.618), `--ratio-halfstep` (1.272)
- Modular scale: `--scale-xs` through `--scale-xxxl`
- Vertical rhythm: `1rlh` foundation with mathematical subdivisions
- OpenType features: Ligatures, kerning, and professional typography

### Spacing System
Rhythm-based spacing tokens:

- `--space-xxxs` through `--space-xxxl`
- Based on line height (`1rlh`) for consistent vertical rhythm
- Responsive spacing with `clamp()`

### Line-Width Tokens
Optimized reading widths based on typography research:

- `--line-width-xs` (24rem) - Sidebar content, narrow columns
- `--line-width-s` (32rem) - Forms, short articles, mobile-first
- `--line-width-normal` (42rem) - Optimal reading width (60-75 chars/line)
- `--line-width-wide` (50rem) - Articles with images/code
- `--line-width-xl` (60rem) - Documentation, technical content
- `--line-width-full` (88vw) - Responsive full width with margins

```html
<div class="line-width-normal">
  <p>Content constrained to optimal reading width</p>
</div>
```

### Color System
Automatic light/dark mode with semantic color tokens:

- Natural, analog-inspired light mode colors
- Soft-glow, night-usable dark mode colors
- Semantic tokens: `--color-accent`, `--color-muted`, etc.

### Grid System
12-column responsive grid with utility classes:

```html
<div class="grid">
  <div class="col-6 col-md-4">Responsive columns</div>
  <div class="col-6 col-md-8">Adapts at breakpoints</div>
</div>
```

## Customization

Override tokens for fine-art customization:

```css
/* Mathematical ratio customization */
:root {
  --font-ratio: var(--ratio-golden); /* Use golden ratio */
  --font-text: 'Minion Pro', Georgia, serif; /* Classical serif */
  --font-header: 'Optima', 'Helvetica Neue', sans-serif; /* Swiss style */
}

/* Fine-art color palette */
:root {
  --color-accent: oklch(65% 0.2 50); /* Perceptually uniform */
  --color-light-background: #fefefe; /* Off-white like paper */
}

/* Print-inspired spacing */
:root {
  --space: 1.6rem; /* Golden ratio line height */
  --font-density: 1.618; /* Golden ratio density */
}

/* Typography engine configuration */
const typography = new GutterTypography({
  locale: 'en',           // or 'fr' for French rules
  enableSmartQuotes: true,
  enableWidowPrevention: true
});
```

## Design Token Architecture

Standard uses **distributed design tokens** organized by domain for better maintainability:

### Token Organization
- **`standard-00-token.scss`** - Mathematical ratios, golden ratio system
- **`standard-01-grid.scss`** - Swiss-style grid system
- **`standard-02-prose.scss`** - Book layout system + print terminology
- **`standard-03-typography.scss`** - Fine-art typography + OpenType features
- **`standard-04-rhythm.scss`** - Baseline grid + vertical rhythm
- **`standard-05-color.scss`** - Perceptual color system (OKLCH)

## File Structure

```
src/
├── standard-00-token.scss     # Mathematical ratios, golden ratio system
├── standard-01-grid.scss      # Swiss-style grid system
├── standard-02-prose.scss     # Book layout system + print terminology
├── standard-03-typography.scss # Fine-art typography + OpenType features
├── standard-04-rhythm.scss    # Baseline grid + vertical rhythm
├── standard-05-color.scss     # Perceptual color system (OKLCH)
├── standard-06-img.scss       # Gallery system + print-style images
├── standard-07-md.scss        # Enhanced markdown + typography
├── standard-08-utilities.scss # Print design utilities
├── standard.js                # Typography engine + theme management
└── standard.scss              # Framework entry point
```

### Fine-Art Design Benefits
- **Mathematical precision** - Golden ratio and derived proportions
- **Print design heritage** - Terminology and principles from centuries of craft
- **Micro-typography** - Details that elevate design from good to exceptional
- **Classical foundations** - Based on timeless principles, not trends

## Browser Support

- **CSS Framework:** All modern browsers supporting CSS Grid and Custom Properties
- **Typography Engine:** ES6+ browsers (Chrome 51+, Firefox 54+, Safari 10+)
- **Fallbacks:** Graceful degradation for older browsers

## Development

```bash
npm run build      # Build CSS and JavaScript
npm run dev        # Watch mode for development
npm run clean      # Clean dist folder
npm run release    # Clean + build for production
```

## Contributing

Standard welcomes contributions that align with its fine-art typography philosophy. Please read our contributing guidelines and ensure any additions maintain the mathematical precision and classical principles that define the framework.

## Inspiration

This framework draws inspiration from:

- **The Elements of Typographic Style** by Robert Bringhurst
- **Grid Systems in Graphic Design** by Josef Müller-Brockmann
- **Thinking with Type** by Ellen Lupton
- **Swiss Typography** and the International Typographic Style
- **Classical book design** and centuries of typographic wisdom

## License

MIT License - Use Standard to create beautiful, mathematically precise, and typographically excellent web experiences.

---

*"Typography is a craft by which the meanings of a text can be clarified, honored and shared, or knowingly disguised."* — Robert Bringhurst
