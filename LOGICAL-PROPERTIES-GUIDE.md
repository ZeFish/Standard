# Logical Properties vs Physical Properties in Standard Framework

## Overview

The Standard Framework uses **CSS Logical Properties** as the primary approach for spacing and layout, with physical properties as fallbacks. This guide explains the rationale, implementation, and best practices.

## Quick Answer: Use Logical Properties ✅

**Primary**: `margin-block-end`, `margin-inline-start`, `padding-block`, etc.  
**Fallback**: `margin-bottom`, `margin-left`, `padding-top`, etc. (when needed)

## What Are Logical Properties?

### Physical Properties (Traditional)
```css
/* Always refer to viewport directions */
.element {
    margin-top: 1rem;     /* Always top of viewport */
    margin-bottom: 1rem;  /* Always bottom of viewport */
    margin-left: 1rem;    /* Always left of viewport */
    margin-right: 1rem;   /* Always right of viewport */
}
```

### Logical Properties (Modern)
```css
/* Adapt to writing mode and text direction */
.element {
    margin-block-start: 1rem;  /* Start of block direction */
    margin-block-end: 1rem;    /* End of block direction */
    margin-inline-start: 1rem; /* Start of inline direction */
    margin-inline-end: 1rem;   /* End of inline direction */
}
```

## Why Standard Framework Uses Logical Properties

### 1. **International Typography** 🌍
Fine-art typography often involves multiple languages and writing systems:

```css
/* English (LTR, horizontal) */
margin-block-end: 1rem;  /* = margin-bottom */
margin-inline-end: 1rem; /* = margin-right */

/* Arabic/Hebrew (RTL, horizontal) */
margin-block-end: 1rem;  /* = margin-bottom */
margin-inline-end: 1rem; /* = margin-left (!) */

/* Japanese (vertical, RTL) */
margin-block-end: 1rem;  /* = margin-left (!) */
margin-inline-end: 1rem; /* = margin-bottom (!) */
```

### 2. **Future-Proof Design**
- Adapts automatically to different writing modes
- No manual RTL/LTR stylesheet switching
- Supports vertical writing modes out of the box

### 3. **Semantic Clarity**
```css
/* Physical: What does "left" mean in RTL? */
.sidebar {
    margin-left: 2rem; /* Confusing in RTL context */
}

/* Logical: Clear semantic meaning */
.sidebar {
    margin-inline-start: 2rem; /* Always "start of text direction" */
}
```

### 4. **Modern CSS Alignment**
- CSS Grid and Flexbox use logical concepts
- CSS Writing Modes specification alignment
- Web platform direction

## Mapping Guide

### Block Direction (Vertical in English)
```css
/* Physical → Logical */
margin-top        → margin-block-start
margin-bottom     → margin-block-end
padding-top       → padding-block-start  
padding-bottom    → padding-block-end
border-top        → border-block-start
border-bottom     → border-block-end

/* Shorthands */
margin: 1rem 0    → margin-block: 1rem
padding: 1rem 0   → padding-block: 1rem
```

### Inline Direction (Horizontal in English)
```css
/* Physical → Logical */
margin-left       → margin-inline-start
margin-right      → margin-inline-end
padding-left      → padding-inline-start
padding-right     → padding-inline-end
border-left       → border-inline-start
border-right      → border-inline-end

/* Shorthands */
margin: 0 1rem    → margin-inline: 1rem
padding: 0 1rem   → padding-inline: 1rem
```

### Position Properties
```css
/* Physical → Logical */
top               → inset-block-start
bottom            → inset-block-end
left              → inset-inline-start
right             → inset-inline-end

/* Shorthand */
top: 0; bottom: 0 → inset-block: 0
left: 0; right: 0 → inset-inline: 0
```

## Standard Framework Implementation

### Core Rhythm System
```scss
.rhythm {
    // Uses logical properties throughout
    > * {
        margin-block-end: calc(var(--space-block) * var(--rhythm-multiplier));
    }
    
    > :first-child {
        margin-block-start: 0;
    }
    
    > :last-child {
        margin-block-end: calc(var(--space) * var(--rhythm-multiplier));
    }
}
```

### Design Tokens
```scss
:root {
    // Logical spacing tokens
    --space-block-start: var(--space);
    --space-block-end: var(--space-block);
    --space-inline-start: var(--space);
    --space-inline-end: var(--space);
    
    // Border tokens
    --border-block: var(--hr-thickness) solid var(--color-border);
    --border-inline: var(--hr-thickness) solid var(--color-border);
}
```

### Utility Classes
```scss
// Logical margin utilities
.margin-block-start-0 { margin-block-start: 0; }
.margin-block-end-0 { margin-block-end: 0; }
.margin-inline-start-auto { margin-inline-start: auto; }
.margin-inline-end-auto { margin-inline-end: auto; }

// Logical padding utilities  
.padding-block-s { padding-block: var(--space-s); }
.padding-inline-l { padding-inline: var(--space-l); }
```

## Browser Support Strategy

### Current Support (2024)
- ✅ **Chrome 87+** (full support)
- ✅ **Firefox 66+** (full support)  
- ✅ **Safari 14.1+** (full support)
- ❌ **IE 11** (no support - but IE is dead)

### Fallback Strategy
```scss
// Automatic fallbacks using PostCSS Logical
.element {
    margin-bottom: 1rem;           /* Fallback */
    margin-block-end: 1rem;        /* Logical */
    
    padding-left: 2rem;            /* Fallback */
    padding-inline-start: 2rem;    /* Logical */
}

// Or manual fallbacks when needed
@supports not (margin-block-end: 1rem) {
    .rhythm > * {
        margin-bottom: calc(var(--space-block) * var(--rhythm-multiplier));
    }
}
```

## Best Practices

### ✅ DO: Use Logical Properties in Framework Code

```scss
// Framework internal styles
.rhythm > * {
    margin-block-end: var(--space-block);
}

.prose {
    padding-inline: var(--space-l);
}

.callout {
    border-inline-start: 4px solid var(--color-accent);
}
```

### ✅ DO: Provide Clear Documentation

```html
<!-- Document the logical property usage -->
<div class="rhythm">
    <!-- margin-block-end creates spacing between elements -->
    <p>Paragraph 1</p>
    <p>Paragraph 2</p>
</div>
```

### ✅ DO: Use Logical Shorthands

```scss
// Better: Use logical shorthands
.element {
    margin-block: var(--space-l) var(--space);
    padding-inline: var(--space-xl);
}

// Instead of:
.element {
    margin-block-start: var(--space-l);
    margin-block-end: var(--space);
    padding-inline-start: var(--space-xl);
    padding-inline-end: var(--space-xl);
}
```

### ✅ DO: Consider Writing Mode Context

```scss
// Design for multiple writing modes
.article-layout {
    writing-mode: horizontal-tb; /* Default */
    
    .sidebar {
        margin-inline-start: var(--space-xl); /* Always correct */
    }
}

.article-layout[data-writing-mode="vertical"] {
    writing-mode: vertical-rl;
    /* Logical properties adapt automatically */
}
```

### ❌ DON'T: Mix Logical and Physical Inconsistently

```scss
// Avoid mixing approaches randomly
.bad-example {
    margin-top: 1rem;           /* Physical */
    margin-block-end: 1rem;     /* Logical */
    /* Confusing and inconsistent */
}
```

### ❌ DON'T: Use Physical Properties for New Code

```scss
// Old approach - avoid in new code
.old-way {
    margin-bottom: var(--space);
    padding-left: var(--space-l);
}

// New approach - use logical properties
.new-way {
    margin-block-end: var(--space);
    padding-inline-start: var(--space-l);
}
```

## Migration Strategy

### Phase 1: New Code Only
```scss
// All new framework code uses logical properties
.new-component {
    margin-block-end: var(--space);
    padding-inline: var(--space-s);
}
```

### Phase 2: Gradual Migration
```scss
// Update existing code gradually
.existing-component {
    // margin-bottom: var(--space);        /* Old */
    margin-block-end: var(--space);        /* New */
    
    // padding: 0 var(--space-s);          /* Old */
    padding-inline: var(--space-s);        /* New */
}
```

### Phase 3: Fallback Removal
```scss
// Remove fallbacks when support is universal
.component {
    margin-block-end: var(--space); /* Only logical needed */
}
```

## Writing Mode Examples

### Horizontal LTR (English)
```css
.element {
    margin-block-end: 1rem;    /* = margin-bottom */
    margin-inline-start: 2rem; /* = margin-left */
}
```

### Horizontal RTL (Arabic)
```css
.element {
    margin-block-end: 1rem;    /* = margin-bottom */
    margin-inline-start: 2rem; /* = margin-right (!) */
}
```

### Vertical RTL (Traditional Japanese)
```css
.element {
    writing-mode: vertical-rl;
    margin-block-end: 1rem;    /* = margin-left (!) */
    margin-inline-start: 2rem; /* = margin-bottom (!) */
}
```

## Framework Usage Examples

### Rhythm System
```html
<!-- Works in any writing mode -->
<article class="rhythm" lang="ar" dir="rtl">
    <h1>العنوان الرئيسي</h1>
    <p>النص العربي يتدفق من اليمين إلى اليسار</p>
    <!-- margin-block-end creates proper spacing -->
</article>
```

### Grid Layout
```scss
.grid-item {
    // Adapts to text direction automatically
    padding-inline-start: var(--space);
    border-inline-end: var(--border);
}
```

### Form Layout
```scss
.form-field {
    margin-block-end: var(--space);
    
    label {
        margin-block-end: var(--space-xs);
    }
}
```

## Performance Considerations

### CSS Size Impact
- Logical properties don't increase CSS size significantly
- Fallbacks do add size, but provide better compatibility
- Use build tools to optimize based on browser targets

### Runtime Performance
- No performance difference between logical and physical properties
- Browser handles the mapping internally
- CSS containment works with both approaches

## Developer Experience

### Editor Support
- VS Code: Full autocomplete and IntelliSense support
- WebStorm: Full support with syntax highlighting
- PostCSS plugins available for fallbacks

### Debugging
```css
/* Easier debugging with semantic names */
.debug-spacing {
    outline: 1px solid red;
    /* "inline-start" is clearer than "left" in RTL context */
    margin-inline-start: 1rem;
}
```

### Team Adoption
```scss
// Provide utility mixins for easier adoption
@mixin margin-block($start: 0, $end: 0) {
    margin-block: $start $end;
}

@mixin padding-inline($start: 0, $end: $start) {
    padding-inline: $start $end;
}
```

## Conclusion

**Standard Framework uses logical properties because:**

1. **🌍 International**: Supports global typography needs
2. **🔮 Future-proof**: Adapts to writing modes automatically  
3. **🎯 Semantic**: Clear meaning regardless of context
4. **📏 Consistent**: Aligns with modern CSS practices
5. **⚡ Compatible**: Excellent browser support with fallbacks

**Best Practice Summary:**
- ✅ Use logical properties for all new framework code
- ✅ Provide fallbacks for older browsers when needed
- ✅ Document the approach clearly for developers
- ✅ Use logical shorthands when possible
- ❌ Don't mix logical and physical properties inconsistently

This approach ensures the Standard Framework remains relevant and usable for global typography while embracing modern CSS best practices.