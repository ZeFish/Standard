# Standard Framework Theme System

The Standard Framework includes a comprehensive, zero-configuration theme system that automatically handles light/dark mode switching with system preference detection, smooth transitions, and full accessibility support.

## Features

### 🎯 Zero Configuration
- Works automatically without any setup
- Detects system preference on load
- No manual initialization required

### 🔄 Smart System Integration
- Automatically detects `prefers-color-scheme: dark`
- Follows OS-level light/dark mode changes
- Graceful fallback to light mode if unsupported

### 💾 Persistent User Preferences
- Remembers manual theme choice in localStorage
- Syncs theme across browser tabs
- Respects user override over system preference

### ⚡ Smooth Transitions
- CSS transitions between theme changes
- Respects `prefers-reduced-motion: reduce`
- No jarring theme switches

### ♿ Full Accessibility Support
- Supports `prefers-contrast: high`
- Windows High Contrast mode (`forced-colors`)
- Proper `color-scheme` for native form controls

## How It Works

### Automatic Initialization
The theme system initializes automatically when the page loads:

```javascript
// Happens automatically - no code needed
window.standardTheme = new StandardTheme();
```

### Theme Resolution Priority
1. **User Manual Choice** - If user manually set light/dark
2. **System Preference** - OS light/dark mode setting
3. **Light Fallback** - Default if nothing detected

### CSS Implementation
```css
/* Default: Light mode */
:root {
    --color-background: var(--color-light-background);
    --color-foreground: var(--color-light-foreground);
    /* ... */
}

/* Auto-detect dark mode */
@media (prefers-color-scheme: dark) {
    :root:not(.light) {
        --color-background: var(--color-dark-background);
        --color-foreground: var(--color-dark-foreground);
        /* ... */
    }
}

/* Manual overrides */
.light { /* Force light theme */ }
.dark { /* Force dark theme */ }
```

## Usage

### Automatic Usage (Recommended)
Just include the Standard Framework - themes work automatically:

```html
<link rel="stylesheet" href="standard.css">
<script src="standard.js"></script>
<!-- That's it! Themes work automatically -->
```

### JavaScript API
```javascript
// Set specific theme
setTheme('light')    // Force light mode
setTheme('dark')     // Force dark mode
setTheme('auto')     // Follow system preference

// Toggle between light and dark
toggleTheme()        // Returns new theme

// Get current theme information
getTheme()           // Returns theme object
```

### Theme Toggle Buttons
Automatically creates theme toggle buttons:

```html
<!-- Button will be automatically inserted here -->
<div data-theme-toggle></div>
```

Or create manually:
```javascript
const button = standardTheme.createToggleButton({
    container: '#my-container',
    text: { light: '🌙 Dark Mode', dark: '☀️ Light Mode' }
});
```

### Keyboard Shortcut
Built-in keyboard shortcut:
- **Ctrl/Cmd + Shift + D** - Toggle theme

### Theme Events
Listen for theme changes:

```javascript
document.addEventListener('standard:themechange', (event) => {
    console.log('Theme changed to:', event.detail.theme);
    console.log('Is dark:', event.detail.isDark);
    console.log('User preference:', event.detail.userPreference);
    console.log('System preference:', event.detail.systemPreference);
});
```

## Advanced Configuration

### Custom Theme Class
```javascript
const theme = new StandardTheme({
    storage: true,              // Store preference (default: true)
    storageKey: 'my-theme',    // localStorage key (default: 'standard-theme')
    transitions: true,          // Smooth transitions (default: true)
    respectMotion: true,        // Respect prefers-reduced-motion (default: true)
    debug: false,              // Debug logging (default: false)

    // Callbacks
    onThemeChange: (newTheme, oldTheme) => {
        console.log(`Theme: ${oldTheme} → ${newTheme}`);
    },
    onSystemChange: (systemTheme) => {
        console.log(`System preference: ${systemTheme}`);
    }
});
```

### Theme Information Object
```javascript
const info = getTheme();
// Returns:
{
    current: 'dark',           // Currently applied theme
    effective: 'dark',         // Effective theme (resolves auto)
    user: 'dark',             // User's manual choice (null if auto)
    system: 'light',          // System preference
    isDark: true,             // Is current theme dark
    isLight: false,           // Is current theme light
    isAuto: false            // Is following system preference
}
```

## CSS Custom Properties

### Core Theme Tokens
```css
/* Semantic colors that adapt automatically */
--color-background         /* Main background color */
--color-foreground         /* Main text color */
--color-surface           /* Card/surface background */

/* Interactive states */
--color-accent            /* Primary accent color */
--color-hover             /* Hover state color */
--color-active            /* Active state color */
--color-accent             /* Focus outline color */

/* Semantic colors */
--color-success           /* Success/positive actions */
--color-warning           /* Warning/caution */
--color-error             /* Error/danger */
--color-info              /* Information/neutral */

/* Text hierarchy */
--color-muted             /* Secondary text */
--color-subtle            /* Tertiary text */

/* Borders and dividers */
--color-border            /* Standard borders */
--color-divider           /* Subtle dividers */

/* Backgrounds */
--color-background-secondary  /* Cards, inputs */
--color-background-tertiary   /* Subtle backgrounds */

/* Shadows */
--shadow                  /* Standard shadow */
--shadow-lg               /* Large shadow */
--shadow-xl               /* Extra large shadow */
```

### Color Palettes
The framework includes carefully crafted light and dark palettes:

#### Light Mode Colors
- Natural, paper-like, analog-inspired
- Dusty red clay, trail-worn orange, parchment mustard
- Sage green, glacier teal, faded blueprint
- Dusk lavender, vintage mauve rose

#### Dark Mode Colors
- Soft-glow, night-usable, retro tech inspired
- Ember red, lantern orange, candlelight gold
- Forest mint glow, creek frost, twilight blueprint
- Smoky violet dusk, faded polaroid blush

## Accessibility Features

### High Contrast Support
```css
@media (prefers-contrast: high) {
    :root {
        --color-border: var(--color-foreground);
        --color-muted: var(--color-foreground);
        /* Increased contrast ratios */
    }
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
    :root {
        transition: none;
    }
    * {
        transition: none !important;
        animation: none !important;
    }
}
```

### Windows High Contrast
```css
@media (forced-colors: active) {
    :root {
        --color-background: Canvas;
        --color-foreground: CanvasText;
        --color-accent: Highlight;
        /* Uses system high contrast colors */
    }
}
```

## Browser Support

### Modern Browsers (Full Support)
- Chrome 76+ (prefers-color-scheme support)
- Firefox 67+ (prefers-color-scheme support)
- Safari 12.1+ (prefers-color-scheme support)
- Edge 79+ (prefers-color-scheme support)

### Fallback Support
- Works in all browsers with JavaScript
- Falls back to light mode if no system detection
- Manual theme switching works universally

### Progressive Enhancement
```css
/* Works without JavaScript */
@media (prefers-color-scheme: dark) {
    :root:not(.light) {
        /* Dark theme applied automatically */
    }
}

/* Enhanced with JavaScript */
.dark {
    /* Manual dark theme override */
}
```

## Performance

### Optimizations
- CSS custom properties for instant theme switching
- Minimal DOM manipulation during theme changes
- Efficient event listeners with proper cleanup
- Debounced theme change detection

### Smooth Transitions
- Temporary transition styles during theme changes
- Respects user motion preferences
- GPU-accelerated when beneficial
- No layout shift during transitions

## Integration Examples

### React Integration
```jsx
import { useEffect, useState } from 'react';

function ThemeProvider() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Listen for theme changes
        const handler = (e) => setTheme(e.detail.theme);
        document.addEventListener('standard:themechange', handler);

        // Get initial theme
        setTheme(getTheme().current);

        return () => document.removeEventListener('standard:themechange', handler);
    }, []);

    return <div className={`app theme-${theme}`}>...</div>;
}
```

### Vue Integration
```vue
<template>
    <div :class="`app theme-${theme}`">
        <button @click="toggleTheme()">Toggle Theme</button>
    </div>
</template>

<script>
export default {
    data() {
        return { theme: 'light' };
    },
    mounted() {
        document.addEventListener('standard:themechange', (e) => {
            this.theme = e.detail.theme;
        });
        this.theme = getTheme().current;
    }
};
</script>
```

### Next.js Integration
```javascript
// pages/_app.js
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
    useEffect(() => {
        // Standard Framework initializes automatically
        // No additional setup needed
    }, []);

    return <Component {...pageProps} />;
}
```

## Customization

### Custom Colors
Override the color palettes:

```css
:root {
    /* Override light mode colors */
    --color-light-accent: #your-brand-color;
    --color-light-background: #custom-light;

    /* Override dark mode colors */
    --color-dark-accent: #your-brand-dark;
    --color-dark-background: #custom-dark;
}
```

### Custom Theme Toggle
```javascript
const customToggle = standardTheme.createToggleButton({
    text: {
        light: '🌜 Switch to Dark',
        dark: '🌞 Switch to Light'
    },
    className: 'my-theme-toggle',
    container: document.getElementById('header')
});
```

### Theme Persistence
Customize storage behavior:

```javascript
const theme = new StandardTheme({
    storageKey: 'my-app-theme',  // Custom storage key
    storage: false,              // Disable persistence
});
```

## Best Practices

### ✅ Do
- Let the system work automatically
- Use semantic color tokens (--color-accent vs --color-blue)
- Test in both light and dark modes
- Respect user preferences (auto mode)
- Use the provided theme events for custom logic

### ❌ Don't
- Hardcode light/dark specific colors
- Override system preferences without good reason
- Use physical color names in CSS (use semantic names)
- Ignore accessibility features
- Assume user's preferred theme

### Design Guidelines
- Ensure sufficient contrast in both modes
- Test with high contrast settings
- Verify form controls look correct
- Check image visibility in both themes
- Test with different accent colors

## Troubleshooting

### Theme Not Switching
1. Check if CSS is loaded correctly
2. Verify JavaScript is not blocked
3. Look for conflicting CSS rules
4. Check browser developer tools for errors

### Storage Issues
```javascript
// Test localStorage access
try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log('localStorage available');
} catch(e) {
    console.warn('localStorage blocked');
}
```

### System Detection Not Working
```javascript
// Test media query support
if (window.matchMedia) {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    console.log('System prefers dark:', darkQuery.matches);
} else {
    console.warn('matchMedia not supported');
}
```

### Debug Mode
```javascript
const theme = new StandardTheme({ debug: true });
// Will log theme changes and system detection
```

## Migration from Other Systems

### From Manual Theme Switching
```javascript
// Old way
document.body.classList.toggle('dark-theme');

// New way (automatic)
toggleTheme(); // or just let it work automatically
```

### From CSS-Only Solutions
```css
/* Old way */
body.dark { background: black; }
body.light { background: white; }

/* New way (semantic) */
:root { --color-background: white; }
@media (prefers-color-scheme: dark) {
    :root:not(.light) { --color-background: black; }
}
```

The Standard Framework theme system provides a complete, accessible, and user-friendly solution for light/dark mode handling with zero configuration required.
