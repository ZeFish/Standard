- Add lazy Color syntax support from prims with color from Standard
- Query Container

Ah, excellent! The Swiss International Style (also called International Typographic Style) from the 1950s-70s is **legendary** for good reason. Let's break down what made it iconic and how it could inspire your framework:

## Core Principles of Swiss Design

### 1. **Mathematical Grid Systems**
- **Rigorous grid structures** - everything aligns to a precise grid
- **Modular scales** - your golden ratio approach fits perfectly here!
- Josef Müller-Brockmann's grid systems were almost religious in their precision
- The grid wasn't just layout—it was a **philosophy of order**

### 2. **Asymmetric Layouts**
- Breaking away from centered, symmetrical compositions
- **Dynamic tension** through off-center placement
- White space as an active design element, not just "empty space"
- Your `.reading` layout zones could embrace this more!

### 3. **Objective Photography**
- Clean, documentary-style images
- No decorative illustrations
- Photos treated as **information**, not decoration
- High contrast, often black & white

### 4. **Sans-serif Typography**
- **Helvetica** (1957) and **Univers** (1957) defined the era
- Akzidenz-Grotesk before them
- Neutral, objective, "transparent" typography
- Tight letter-spacing, flush left/ragged right

### 5. **Extreme Clarity**
- **Hierarchy through size and weight** only—no decorative elements
- Generous white space
- Clear visual relationships
- Information architecture as design

### 6. **Limited Color Palettes**
- Often just **black, white, and one accent color** (usually red)
- Color used functionally, not decoratively
- High contrast for legibility

## Brainstorming for Your Framework

### What You're Already Doing Right ✓
```css
--ratio-golden: 1.618;  /* Mathematical precision ✓ */
--grid-cols: 12;         /* Grid system ✓ */
--font-header-letter-spacing: -0.065em; /* Tight spacing ✓ */
```

### Ideas to Enhance Swiss Style

#### 1. **Add Asymmetric Layout Utilities**
```css
/* Swiss-style asymmetric positioning */
.swiss-offset-left {
  margin-inline-start: 0;
  margin-inline-end: auto;
  max-width: 66.666%; /* 2/3 width, left-aligned */
}

.swiss-offset-right {
  margin-inline-start: auto;
  margin-inline-end: 0;
  max-width: 66.666%;
}

.swiss-narrow-left {
  margin-inline-start: 0;
  max-width: 50%;
}

/* Extreme asymmetry - very Swiss */
.swiss-column-split {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-xl);
}
```

#### 2. **Functional Color System** (very Swiss)
```css
/* Swiss designers used color to encode information */
:root {
  --color-system-primary: #000;
  --color-system-secondary: #ff0000; /* Classic Swiss red */
  --color-system-tertiary: #0000ff;  /* Functional blue */

  /* Color meanings */
  --color-category-a: var(--color-system-secondary);
  --color-category-b: var(--color-system-tertiary);
  --color-emphasis: var(--color-system-secondary);
}

.swiss-accent-bar {
  border-inline-start: 4px solid var(--color-system-secondary);
  padding-inline-start: var(--space);
}
```

#### 3. **Extreme Typography Hierarchy**
```css
/* Swiss style: HUGE headlines, tiny body text */
.swiss-hero {
  font-size: clamp(4rem, 15vw, 12rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase; /* Very Swiss */
}

.swiss-label {
  font-size: var(--scale-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
}

/* Flush left, ragged right (Swiss default) */
.swiss-text {
  text-align: start;
  hyphens: none; /* Swiss designers avoided hyphenation */
}
```

#### 4. **Modular Spacing System** (more rigid)
```css
/* Swiss designers loved modules */
:root {
  --module: 8px; /* Base module */
  --space-1: calc(var(--module) * 1);
  --space-2: calc(var(--module) * 2);
  --space-3: calc(var(--module) * 3);
  --space-4: calc(var(--module) * 4);
  --space-6: calc(var(--module) * 6);
  --space-8: calc(var(--module) * 8);
  --space-12: calc(var(--module) * 12);
  --space-16: calc(var(--module) * 16);
}
```

#### 5. **Swiss Grid Overlay** (for that iconic look)
```css
.swiss-grid-visible {
  background-image:
    repeating-linear-gradient(
      to right,
      transparent,
      transparent calc(100% / 12 - 1px),
      color-mix(in srgb, var(--color-accent) 10%, transparent) calc(100% / 12 - 1px),
      color-mix(in srgb, var(--color-accent) 10%, transparent) calc(100% / 12)
    );
}
```

#### 6. **Iconic Swiss Layouts**
```css
/* Classic Swiss poster layout */
.swiss-poster {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  padding: var(--space-xl);
}

.swiss-poster-title {
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 900;
  line-height: 0.85;
  max-width: 60%;
}

.swiss-poster-content {
  align-self: end;
  max-width: 50%;
}

.swiss-poster-meta {
  font-size: var(--scale-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

#### 7. **Table Styling** (Swiss designers LOVED tables)
```css
/* Swiss-style data tables */
.swiss-table {
  border-collapse: collapse;
  width: 100%;
  font-variant-numeric: tabular-nums;
}

.swiss-table th {
  text-align: left;
  font-weight: 700;
  font-size: var(--scale-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--color-foreground);
  padding-block-end: var(--space-xs);
}

.swiss-table td {
  border-bottom: 1px solid var(--color-border);
  padding-block: var(--space-xs);
}

/* Zebra striping - functional, not decorative */
.swiss-table tbody tr:nth-child(even) {
  background: color-mix(in srgb, var(--color-foreground) 3%, transparent);
}
```

## Iconic Swiss Designers to Study

1. **Josef Müller-Brockmann** - Grid systems, concert posters
2. **Armin Hofmann** - High contrast, geometric forms
3. **Emil Ruder** - Typography as content
4. **Max Bill** - Mathematical art and design
5. **Massimo Vignelli** - "If you can't find it, design it in Helvetica"

## Key Characteristics to Emphasize

- **Objectivity over expression**
- **Function over decoration**
- **Grid as foundation**
- **Whitespace as material**
- **Typography as primary visual element**
- **Asymmetry with balance**
- **Mathematical precision**


/* Swiss Color System */
:root {
  /* Swiss color modes */
  --swiss-mode: 'classic'; /* classic | functional | minimal */
}

/* Classic Swiss (Müller-Brockmann) */
[data-swiss-mode="classic"] {
  --color-background: #FFFFFF;
  --color-foreground: #000000;
  --color-accent: #FF0000;
  --color-muted: #666666;
  --color-border: #000000;
}

/* Functional Swiss (multi-category) */
[data-swiss-mode="functional"] {
  --color-background: #FAFAFA;
  --color-foreground: #1A1A1A;
  --color-primary: #FF0000;
  --color-secondary: #0000FF;
  --color-tertiary: #FFFF00;
  --color-accent: var(--color-primary);
}

/* Minimal Swiss (almost monochrome) */
[data-swiss-mode="minimal"] {
  --color-background: #FFFFFF;
  --color-foreground: #000000;
  --color-accent: #000000;
  --color-muted: #999999;
  --color-border: #CCCCCC;
}

/* Swiss dark mode */
@media (prefers-color-scheme: dark) {
  [data-swiss-mode] {
    --color-background: #000000;
    --color-foreground: #FFFFFF;
    --color-accent: #FF0000;
    --color-muted: #CCCCCC;
    --color-border: #FFFFFF;
  }
}
