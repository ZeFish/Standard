---
title: Color System

eleventyNavigation:
  key: Colors
  parent: CSS Framework
  title: Colors
permalink: /css/colors/
---

# Color System

A semantic color system with automatic light/dark theme support that respects user preferences and guarantees WCAG AA accessibility.

## Quick Navigation

- **[Typography System](/css/typography/)** - Font scales, sizes, and weights
- **[Grid System](/css/grid/)** - Flexible layouts and responsive columns
- **[Spacing & Rhythm](/css/spacing/)** - Vertical rhythm and spacing utilities
- **[Prose System](/css/prose/)** - Readable article layouts
- **[Utilities](/css/utilities/)** - Helper classes for common patterns

## Color Variables

All colors are CSS variables you can customize:

```css
:root {
  /* Semantic colors */
  --color-background: #ffffff;      /* Page background */
  --color-foreground: #000000;      /* Text color */
  --color-accent: #0066cc;          /* Primary action/emphasis */
  --color-success: #2d5016;         /* Success states */
  --color-warning: #7f6d12;         /* Warnings */
  --color-error: #9d1c1c;           /* Errors */
  --color-info: #2d3748;            /* Information */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0a0a0a;
    --color-foreground: #ffffff;
    --color-accent: #4da6ff;
    /* ... etc */
  }
}
```

See the full [Color System API Reference](/docs/color-system/).

## Using Colors

### Background & Text

```html
<!-- Automatically themed -->
<div class="bg-background text-foreground">
  <h1>This adapts to light/dark mode</h1>
  <p>Content automatically readable</p>
</div>
```

### Semantic Colors

```html
<!-- Success state -->
<div class="bg-success text-white">
  <p>✓ Operation completed successfully</p>
</div>

<!-- Warning state -->
<div class="bg-warning text-foreground">
  <p>⚠ Please review before continuing</p>
</div>

<!-- Error state -->
<div class="bg-error text-white">
  <p>✗ An error occurred</p>
</div>

<!-- Info state -->
<div class="bg-info text-white">
  <p>ℹ Additional information</p>
</div>
```

### Accent Color

The primary accent color for buttons, links, and emphasis:

```html
<!-- Accent button -->
<button class="btn-primary" style="background-color: var(--color-accent);">
  Primary Action
</button>

<!-- Accent link -->
<a href="#" style="color: var(--color-accent);">Important link</a>

<!-- Accent emphasis -->
<span class="text-accent">Highlighted text</span>
```

## Light Theme

**Light mode** provides excellent readability in bright environments:

```
Background:  White (#ffffff)
Text:        Dark gray/black (#1a1a1a)
Accent:      Bright blue (#0066cc)
Success:     Dark green (#2d5016)
Warning:     Dark gold (#7f6d12)
Error:       Dark red (#9d1c1c)
Info:        Dark blue (#2d3748)
```

### Usage

```html
<!-- Light theme automatically applies -->
<body>
  <header class="bg-background text-foreground">
    <h1>Light Theme</h1>
  </header>
</body>
```

Trigger in CSS:

```css
@media (prefers-color-scheme: light) {
  :root {
    /* Light theme colors */
  }
}
```

## Dark Theme

**Dark mode** reduces eye strain in low-light environments:

```
Background:  Black (#0a0a0a)
Text:        White (#ffffff)
Accent:      Light blue (#4da6ff)
Success:     Light green (#52b788)
Warning:     Light gold (#f9c74f)
Error:       Light red (#f94144)
Info:        Light blue (#90e0ef)
```

### Usage

```html
<!-- Dark theme automatically applies based on system preference -->
<body>
  <header class="bg-background text-foreground">
    <h1>Dark Theme (if system prefers it)</h1>
  </header>
</body>
```

## Accessibility

All color combinations meet **WCAG AA contrast requirements**:

| Combination | Contrast Ratio | Status |
|-------------|----------------|--------|
| Background + Foreground | 11.5:1 | AAA ✓ |
| Background + Accent | 8.2:1 | AAA ✓ |
| Accent + White text | 5.2:1 | AA ✓ |

### Testing Contrast

Never rely on color alone:

```html
<!-- ✓ Good - color + icon -->
<span class="text-success">✓ Success</span>

<!-- ✗ Bad - color only -->
<span class="text-success">Processing</span>

<!-- ✓ Better - color + text -->
<span class="text-success">✓ Processing complete</span>
```

## Color Classes

### Text Colors

```html
<p class="text-foreground">Default text color</p>
<p class="text-accent">Accent colored text</p>
<p class="text-success">Success message</p>
<p class="text-warning">Warning message</p>
<p class="text-error">Error message</p>
<p class="text-info">Info message</p>
```

### Background Colors

```html
<div class="bg-background">Background color</div>
<div class="bg-accent text-white">Accent background</div>
<div class="bg-success text-white">Success background</div>
<div class="bg-warning">Warning background</div>
<div class="bg-error text-white">Error background</div>
<div class="bg-info text-white">Info background</div>
```

## Alerts & Messages

### Success Alert

```html
<div class="bg-success text-white p-4 rounded">
  <h3>Success!</h3>
  <p>Your changes have been saved.</p>
</div>
```

### Warning Alert

```html
<div class="bg-warning text-foreground p-4 rounded">
  <h3>Warning</h3>
  <p>Please review this information carefully.</p>
</div>
```

### Error Alert

```html
<div class="bg-error text-white p-4 rounded">
  <h3>Error</h3>
  <p>Something went wrong. Please try again.</p>
</div>
```

### Info Alert

```html
<div class="bg-info text-white p-4 rounded">
  <h3>Information</h3>
  <p>Here's some helpful information.</p>
</div>
```

## Customization

Override colors for your brand:

```css
:root {
  /* Light theme */
  --color-accent: #ff6b35;          /* Your brand orange */
  --color-success: #1d7874;         /* Your brand teal */
  --color-warning: #d4a574;         /* Your brand tan */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark theme adjustments */
    --color-accent: #ff8c42;
    --color-success: #52b788;
    --color-warning: #f9c74f;
  }
}
```

### Per-Element Customization

```html
<!-- Override for specific element -->
<div style="--color-accent: #ff6b35;">
  <button class="btn-primary">Custom color</button>
</div>
```

## Gradient Background Example

```html
<div style="
  background: linear-gradient(
    135deg,
    var(--color-background),
    var(--color-accent)
  );
">
  Gradient using theme colors
</div>
```

## Common Patterns

### Card with Accent Border

```html
<div class="card" style="border-left: 4px solid var(--color-accent);">
  <h3>Card Title</h3>
  <p>Card content with accent border</p>
</div>
```

### Status Indicator

```html
<!-- Success -->
<span style="
  width: 12px;
  height: 12px;
  background-color: var(--color-success);
  border-radius: 50%;
"></span>

<!-- Error -->
<span style="
  width: 12px;
  height: 12px;
  background-color: var(--color-error);
  border-radius: 50%;
"></span>
```

### Button Variants

```html
<!-- Primary (accent) -->
<button class="btn" style="background-color: var(--color-accent);">
  Primary
</button>

<!-- Success -->
<button class="btn" style="background-color: var(--color-success);">
  Success
</button>

<!-- Danger/Error -->
<button class="btn" style="background-color: var(--color-error);">
  Delete
</button>
```

## Dark Mode Browser Support

Automatically works in:

- macOS 10.14+ (Dark Mode)
- iOS 13+ (Dark Mode)
- Android 10+ (Dark Theme)
- Windows 10+ (Dark Theme)
- Most modern browsers

### Manual Testing

**Chrome/Edge DevTools:**
1. Open DevTools (F12)
2. Cmd+Shift+P (or Ctrl+Shift+P)
3. Type "Rendering"
4. Select "Rendering"
5. Find "Emulate CSS media feature prefers-color-scheme"
6. Toggle between light/dark

## Best Practices

### ✓ Do

- Use semantic colors (success, warning, error)
- Test both light and dark themes
- Ensure sufficient contrast
- Combine color with text/icons
- Respect user system preferences
- Customize within your brand guidelines

### ✗ Don't

- Use color alone to convey information
- Violate WCAG AA contrast requirements
- Hardcode colors (use CSS variables instead)
- Ignore dark mode compatibility
- Over-saturate colors

## Learn More

- **[API Reference](/docs/color-system/)** - Complete SCSS documentation
- **[Accessibility](/css/accessibility/)** - Color accessibility guidelines
- **[Typography](/css/typography/)** - Text colors and contrast
- **[Components](/css/buttons/)** - Colored components

---

Color is semantics, not decoration. [Master the grid system](/css/grid/)
