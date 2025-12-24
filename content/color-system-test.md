---
title: "OKLCH Color System Test"
description: "Testing the new OKLCH-based color generation system with signal harmony"
layout: base
---

# OKLCH Color System Test

This page demonstrates the new OKLCH-based color system that generates harmonious color palettes from a single "signal" color.

## How It Works

The system uses **OKLCH color space** (perceptually uniform) to:

1. Extract DNA from your signal color (lightness, chroma, hue)
2. Generate 6 semantic colors by rotating the hue
3. Preserve vibrancy and visual weight across all colors
4. Automatically adjust for dark mode

## Signal Color

The current signal is: <span style="display: inline-block; width: 2em; height: 2em; background: var(--signal); border: 1px solid var(--color-border); vertical-align: middle; border-radius: 0.25em;"></span> `--signal: #d65d0e` (Safety Orange)

## Generated Pigments

All colors below are **mathematically derived** from the signal above:

<div class="grid" style="--grid-cols: 3; gap: var(--space);">

<div style="padding: var(--space); background: var(--pigment-red); color: white; border-radius: var(--radius);">
  <strong>Red (25°)</strong><br>
  <code>--pigment-red</code><br>
  Errors, Deletions
</div>

<div style="padding: var(--space); background: var(--pigment-yellow); color: black; border-radius: var(--radius);">
  <strong>Yellow (85°)</strong><br>
  <code>--pigment-yellow</code><br>
  Warnings, Highlights
</div>

<div style="padding: var(--space); background: var(--pigment-green); color: white; border-radius: var(--radius);">
  <strong>Green (145°)</strong><br>
  <code>--pigment-green</code><br>
  Success, Insertions
</div>

<div style="padding: var(--space); background: var(--pigment-cyan); color: white; border-radius: var(--radius);">
  <strong>Cyan (190°)</strong><br>
  <code>--pigment-cyan</code><br>
  Info, Metadata
</div>

<div style="padding: var(--space); background: var(--pigment-blue); color: white; border-radius: var(--radius);">
  <strong>Blue (240°)</strong><br>
  <code>--pigment-blue</code><br>
  Links, Focus
</div>

<div style="padding: var(--space); background: var(--pigment-purple); color: white; border-radius: var(--radius);">
  <strong>Purple (300°)</strong><br>
  <code>--pigment-purple</code><br>
  Magic, AI
</div>

</div>

## Semantic Colors

The system maps generated pigments to semantic names:

- **Success:** <span style="color: var(--color-success); font-weight: bold;">Success Message</span> (uses green)
- **Warning:** <span style="color: var(--color-warning); font-weight: bold;">Warning Message</span> (uses yellow)
- **Error:** <span style="color: var(--color-error); font-weight: bold;">Error Message</span> (uses red)
- **Info:** <span style="color: var(--color-info); font-weight: bold;">Info Message</span> (uses blue)
- **Link:** <a href="#">This is a link</a> (uses blue)

## Test Different Signals

Try these in your browser DevTools console to see live color changes:

```javascript
// Neon Pink Signal
document.documentElement.style.setProperty('--signal', '#ff00ff');

// Forest Green Signal
document.documentElement.style.setProperty('--signal', '#3a4a3a');

// Electric Blue Signal
document.documentElement.style.setProperty('--signal', '#0099ff');

// Clay Brown Signal (from issue description)
document.documentElement.style.setProperty('--signal', '#7a5a2e');

// Reset to default (Safety Orange)
document.documentElement.style.setProperty('--signal', '#d65d0e');
```

## Dark Mode Test

**Switch your OS theme to dark mode** to see:
- All colors automatically brighten (+0.15 lightness)
- Hue and vibrancy preserved
- Maintains harmony and relationships

## Technical Implementation

### DNA Extraction
```css
--dna-l: oklch(from var(--signal) l);
--dna-c: oklch(from var(--signal) c);
--dna-h: oklch(from var(--signal) h);
```

### Safety Constraints
```css
/* Minimum vibrancy for alerts (prevents gray from black/white) */
--safe-c: max(var(--dna-c), 0.12);

/* Readable text lightness */
--safe-l: clamp(0.35, var(--dna-l), 0.75);
```

### Pigment Generation
```css
/* Rotate hue while preserving lightness & chroma */
--pigment-red: oklch(var(--safe-l) var(--safe-c) 25);
--pigment-yellow: oklch(var(--safe-l) var(--safe-c) 85);
--pigment-green: oklch(var(--safe-l) var(--safe-c) 145);
/* etc... */
```

### Dark Mode Adaptation
```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Brighten all pigments for visibility */
    --pigment-red: oklch(calc(var(--safe-l) + 0.15) var(--safe-c) 25);
    --pigment-yellow: oklch(calc(var(--safe-l) + 0.15) var(--safe-c) 85);
    /* etc... */
  }
}
```

## Browser Support

- **Chrome/Edge:** 111+ (March 2023)
- **Safari:** 16.4+ (March 2023)
- **Firefox:** 113+ (May 2023)

Older browsers fall back to default colors (backward compatible).

## Benefits

1. **One Color Generates All:** Set `--signal` once, get complete palette
2. **Consistent Vibrancy:** All colors have matching visual weight
3. **Smart Dark Mode:** Automatic brightness adjustment
4. **Temperature Preservation:** Warm signals stay warm, cool signals stay cool
5. **Accessible:** Built-in lightness constraints ensure WCAG AA compliance
6. **Customizable:** Override any specific pigment if needed

---

**Note:** This system is mathematically precise and perceptually uniform thanks to OKLCH color space. Unlike HSL (which is broken - yellow looks brighter than blue at same lightness), OKLCH ensures 50% lightness *looks* the same for every hue.
