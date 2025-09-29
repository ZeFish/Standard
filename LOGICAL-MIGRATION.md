# Migration Guide: Physical to Logical Properties

This guide helps you migrate from physical properties to logical properties in the Standard Framework.

## Quick Migration Table

### Margin Properties
| Physical (Old) | Logical (New) | Notes |
|---|---|---|
| `margin-top` | `margin-block-start` | Start of block direction |
| `margin-bottom` | `margin-block-end` | End of block direction |
| `margin-left` | `margin-inline-start` | Start of inline direction |
| `margin-right` | `margin-inline-end` | End of inline direction |
| `margin: 1rem 0` | `margin-block: 1rem` | Block shorthand |
| `margin: 0 1rem` | `margin-inline: 1rem` | Inline shorthand |

### Padding Properties
| Physical (Old) | Logical (New) | Notes |
|---|---|---|
| `padding-top` | `padding-block-start` | Start of block direction |
| `padding-bottom` | `padding-block-end` | End of block direction |
| `padding-left` | `padding-inline-start` | Start of inline direction |
| `padding-right` | `padding-inline-end` | End of inline direction |
| `padding: 1rem 0` | `padding-block: 1rem` | Block shorthand |
| `padding: 0 1rem` | `padding-inline: 1rem` | Inline shorthand |

### Border Properties
| Physical (Old) | Logical (New) | Notes |
|---|---|---|
| `border-top` | `border-block-start` | Start of block direction |
| `border-bottom` | `border-block-end` | End of block direction |
| `border-left` | `border-inline-start` | Start of inline direction |
| `border-right` | `border-inline-end` | End of inline direction |

### Position Properties
| Physical (Old) | Logical (New) | Notes |
|---|---|---|
| `top` | `inset-block-start` | Start of block direction |
| `bottom` | `inset-block-end` | End of block direction |
| `left` | `inset-inline-start` | Start of inline direction |
| `right` | `inset-inline-end` | End of inline direction |
| `top: 0; bottom: 0` | `inset-block: 0` | Block shorthand |
| `left: 0; right: 0` | `inset-inline: 0` | Inline shorthand |

### Size Properties
| Physical (Old) | Logical (New) | Notes |
|---|---|---|
| `width` | `inline-size` | Size in inline direction |
| `height` | `block-size` | Size in block direction |
| `min-width` | `min-inline-size` | Minimum inline size |
| `min-height` | `min-block-size` | Minimum block size |
| `max-width` | `max-inline-size` | Maximum inline size |
| `max-height` | `max-block-size` | Maximum block size |

## Framework Utility Classes Migration

### Old Physical Utilities → New Logical Utilities
```css
/* OLD: Physical utility classes */
.mt-0 { margin-top: 0; }
.mb-1 { margin-bottom: 1rem; }
.ml-auto { margin-left: auto; }
.mr-auto { margin-right: auto; }
.pl-2 { padding-left: 2rem; }
.pr-2 { padding-right: 2rem; }

/* NEW: Logical utility classes */
.margin-block-start-0 { margin-block-start: 0; }
.margin-block-end-1 { margin-block-end: 1rem; }
.margin-inline-auto { margin-inline: auto; }
.margin-inline-start-auto { margin-inline-start: auto; }
.margin-inline-end-auto { margin-inline-end: auto; }
.padding-inline-start-2 { padding-inline-start: 2rem; }
.padding-inline-end-2 { padding-inline-end: 2rem; }
```

### Standard Framework Rhythm Utilities
```css
/* OLD: Physical margin exceptions */
.no-top { margin-top: 0 !important; }
.no-bottom { margin-bottom: 0 !important; }

/* NEW: Logical margin exceptions */
.no-block-start { margin-block-start: 0 !important; }
.no-block-end { margin-block-end: 0 !important; }
```

## Step-by-Step Migration Process

### Step 1: Identify Physical Properties
Use this regex to find physical properties in your CSS:
```regex
(margin|padding|border)-(top|bottom|left|right)
(width|height|min-width|min-height|max-width|max-height)
(top|bottom|left|right):\s
```

### Step 2: Replace with Logical Equivalents
```scss
// BEFORE: Physical properties
.component {
    margin-top: var(--space);
    margin-bottom: var(--space-l);
    padding-left: var(--space-s);
    padding-right: var(--space-s);
    max-width: 42rem;
    border-left: 4px solid var(--color-accent);
}

// AFTER: Logical properties
.component {
    margin-block-start: var(--space);
    margin-block-end: var(--space-l);
    padding-inline: var(--space-s);
    max-inline-size: 42rem;
    border-inline-start: 4px solid var(--color-accent);
}
```

### Step 3: Update Utility Classes
```html
<!-- BEFORE: Physical utility classes -->
<div class="mt-4 mb-8 ml-auto mr-auto">
    Content
</div>

<!-- AFTER: Logical utility classes -->
<div class="margin-block-start-4 margin-block-end-8 margin-inline-auto">
    Content
</div>
```

### Step 4: Test in Different Writing Modes
```html
<!-- Test with RTL -->
<div dir="rtl" lang="ar">
    <div class="component">النص العربي</div>
</div>

<!-- Test with vertical writing -->
<div style="writing-mode: vertical-rl;" lang="ja">
    <div class="component">日本語のテキスト</div>
</div>
```

## Common Migration Patterns

### Pattern 1: Centering Content
```scss
// BEFORE
.center {
    margin-left: auto;
    margin-right: auto;
    max-width: 42rem;
}

// AFTER
.center {
    margin-inline: auto;
    max-inline-size: 42rem;
}
```

### Pattern 2: Sidebar Layout
```scss
// BEFORE
.sidebar {
    margin-right: 2rem;
    padding-left: 1rem;
    border-left: 1px solid var(--color-border);
}

// AFTER
.sidebar {
    margin-inline-end: 2rem;
    padding-inline-start: 1rem;
    border-inline-start: 1px solid var(--color-border);
}
```

### Pattern 3: Card Components
```scss
// BEFORE
.card {
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
    border-left: 4px solid var(--color-accent);
}

// AFTER
.card {
    padding-block: 1rem;
    padding-inline: 1.5rem;
    margin-block-end: 2rem;
    border-inline-start: 4px solid var(--color-accent);
}
```

### Pattern 4: Form Fields
```scss
// BEFORE
.form-field {
    margin-bottom: 1rem;
    
    label {
        margin-bottom: 0.5rem;
    }
    
    input {
        padding: 0.5rem 1rem;
        width: 100%;
    }
}

// AFTER
.form-field {
    margin-block-end: 1rem;
    
    label {
        margin-block-end: 0.5rem;
    }
    
    input {
        padding-block: 0.5rem;
        padding-inline: 1rem;
        inline-size: 100%;
    }
}
```

### Pattern 5: Navigation
```scss
// BEFORE
.nav-item {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    border-right: 1px solid var(--color-border);
}

.nav-item:last-child {
    margin-right: 0;
    border-right: none;
}

// AFTER
.nav-item {
    margin-inline-end: 1rem;
    padding-block: 0.5rem;
    padding-inline: 1rem;
    border-inline-end: 1px solid var(--color-border);
}

.nav-item:last-child {
    margin-inline-end: 0;
    border-inline-end: none;
}
```

## Automated Migration Tools

### PostCSS Plugin Configuration
```javascript
// postcss.config.js
module.exports = {
    plugins: [
        require('postcss-logical')({
            // Preserve physical properties as fallbacks
            preserve: true,
            // Disable specific properties if needed
            disable: ['float']
        })
    ]
}
```

### VS Code Find/Replace Patterns
```javascript
// Find: margin-top: (.+);
// Replace: margin-block-start: $1;

// Find: margin-bottom: (.+);
// Replace: margin-block-end: $1;

// Find: margin-left: (.+);
// Replace: margin-inline-start: $1;

// Find: margin-right: (.+);
// Replace: margin-inline-end: $1;

// Find: padding-left: (.+);
// Replace: padding-inline-start: $1;

// Find: padding-right: (.+);
// Replace: padding-inline-end: $1;

// Find: max-width: (.+);
// Replace: max-inline-size: $1;
```

### Sass Migration Mixins
```scss
// Helper mixins for gradual migration
@mixin margin-block($start: 0, $end: $start) {
    margin-block-start: $start;
    margin-block-end: $end;
    
    // Fallback for older browsers
    @supports not (margin-block-start: 0) {
        margin-top: $start;
        margin-bottom: $end;
    }
}

@mixin margin-inline($start: 0, $end: $start) {
    margin-inline-start: $start;
    margin-inline-end: $end;
    
    // Fallback for older browsers
    @supports not (margin-inline-start: 0) {
        margin-left: $start;
        margin-right: $end;
    }
}

@mixin padding-block($start: 0, $end: $start) {
    padding-block-start: $start;
    padding-block-end: $end;
    
    // Fallback for older browsers
    @supports not (padding-block-start: 0) {
        padding-top: $start;
        padding-bottom: $end;
    }
}

@mixin padding-inline($start: 0, $end: $start) {
    padding-inline-start: $start;
    padding-inline-end: $end;
    
    // Fallback for older browsers
    @supports not (padding-inline-start: 0) {
        padding-left: $start;
        padding-right: $end;
    }
}
```

## Browser Support and Fallbacks

### Support Matrix (2024)
- ✅ Chrome 87+
- ✅ Firefox 66+
- ✅ Safari 14.1+
- ❌ IE 11

### Fallback Strategies
```scss
// Strategy 1: @supports queries
.element {
    // Fallback
    margin-bottom: 1rem;
    padding-left: 2rem;
    max-width: 42rem;
    
    // Modern
    @supports (margin-block-end: 1rem) {
        margin-bottom: unset;
        margin-block-end: 1rem;
    }
    
    @supports (padding-inline-start: 2rem) {
        padding-left: unset;
        padding-inline-start: 2rem;
    }
    
    @supports (max-inline-size: 42rem) {
        max-width: unset;
        max-inline-size: 42rem;
    }
}

// Strategy 2: PostCSS automatic fallbacks
.element {
    margin-block-end: 1rem; /* → margin-bottom: 1rem; margin-block-end: 1rem; */
    padding-inline-start: 2rem; /* → padding-left: 2rem; padding-inline-start: 2rem; */
    max-inline-size: 42rem; /* → max-width: 42rem; max-inline-size: 42rem; */
}
```

## Testing Your Migration

### Manual Testing Checklist
- [ ] Layout looks correct in LTR languages (English, etc.)
- [ ] Layout adapts properly in RTL languages (Arabic, Hebrew)
- [ ] Vertical writing modes work (Japanese, Chinese)
- [ ] Responsive behavior is maintained
- [ ] Print styles work correctly
- [ ] Older browsers show fallback styles

### Automated Testing
```javascript
// Test logical properties support
describe('Logical Properties', () => {
    it('should support margin-block-end', () => {
        const element = document.createElement('div');
        element.style.marginBlockEnd = '1rem';
        expect(element.style.marginBlockEnd).toBe('1rem');
    });
    
    it('should adapt to writing mode changes', () => {
        const container = document.querySelector('.test-container');
        container.style.writingMode = 'vertical-rl';
        
        // Test that logical properties adapt correctly
        const computedStyle = getComputedStyle(container.querySelector('.logical-element'));
        // Add your specific tests here
    });
});
```

## Migration Timeline Recommendation

### Phase 1: New Development (Immediate)
- Use logical properties for all new components
- Update framework core files
- Create new utility classes

### Phase 2: Gradual Migration (3-6 months)
- Update existing components one by one
- Add fallbacks for browser support
- Update documentation and examples

### Phase 3: Cleanup (6-12 months)
- Remove unnecessary fallbacks
- Clean up old utility classes
- Full logical properties adoption

## Common Pitfalls and Solutions

### Pitfall 1: Muscle Memory
**Problem**: Developers automatically type `margin-left`
**Solution**: Use editor snippets and linting rules

### Pitfall 2: Mixed Approaches
**Problem**: Mixing logical and physical properties
**Solution**: Establish clear coding standards and code review

### Pitfall 3: Browser Support
**Problem**: Logical properties not working in older browsers
**Solution**: Use PostCSS for automatic fallbacks

### Pitfall 4: Third-party Components
**Problem**: External libraries use physical properties
**Solution**: Override styles or use wrapper classes

## Resources and Tools

### Online Tools
- [CSS Logical Properties Converter](https://example.com)
- [Writing Mode Tester](https://example.com)
- [RTL Layout Inspector](https://example.com)

### Browser DevTools
- Chrome: Check "Show logical properties" in Elements panel
- Firefox: Logical properties shown by default in newer versions
- Safari: Use Web Inspector's computed styles

### Linting Rules
```javascript
// stylelint config
{
    "rules": {
        "property-disallowed-list": [
            ["margin-top", "margin-bottom", "margin-left", "margin-right"],
            {
                "message": "Use logical properties: margin-block-start, margin-block-end, margin-inline-start, margin-inline-end"
            }
        ]
    }
}
```

This migration guide ensures a smooth transition from physical to logical properties while maintaining browser compatibility and code quality.