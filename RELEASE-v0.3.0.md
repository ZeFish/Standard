# Standard Framework v0.3.0 Release Notes

🎨 **Major Feature Update: Reading Layout Debug System & Form Enhancements**

## 🆕 New Features

### 📖 Reading Layout Debug System
- **Visual Rhythm Debug**: Toggle vertical rhythm lines with different size delimiters
  - Major rhythm lines (4× rhythm units)
  - Secondary rhythm lines (2× rhythm units)  
  - Base rhythm lines (1× rhythm unit)
  - Fine rhythm lines (0.5× rhythm unit)
- **Column Boundary Visualization**: See the actual reading layout grid boundaries
- **Interactive Controls**: Button interface and keyboard shortcuts
- **JavaScript API**: `setReadingDebug()`, `toggleReadingDebug()`, `getReadingDebug()`
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + Shift + R` - Toggle vertical rhythm
  - `Ctrl/Cmd + Shift + C` - Toggle column boundaries
  - `Ctrl/Cmd + Shift + B` - Toggle both modes
  - `Escape` - Turn off debug mode

### 🎛 Enhanced Form System
- **Accent Color Integration**: Checkboxes and radio buttons now use `--color-accent`
- **Clean Focus States**: Removed outlines from toggles and form controls
- **Grid Layout Fixes**: Resolved nested grid conflicts in forms
- **Typography Consistency**: Form elements now use `var(--font-density)` for proper line-height

### 📝 Enhanced Example Structure
- **Reorganized Sections**: Reading Layout → Grid → Typography → Colors
- **Rich Content Demo**: Added comprehensive `.reading` and `.md` examples
- **Interactive Typography Demo**: See typography processing effects in real-time
- **Better Navigation**: Updated section order for improved user experience

## 🐛 Bug Fixes

### ⚖️ Vertical Rhythm Spacing
- **Fixed margin collapse**: Special blocks now use `(var(--space-block-special) - var(--space))` for top margins
- **Eliminated excess spacing**: No more 1rlh extra space between paragraphs and blockquotes
- **Consistent hierarchy**: Perfect 2× spacing for special elements

### 📝 Typography Engine
- **Conservative defaults**: Typography processing is now opt-in, preventing unwanted modifications
- **Fixed accumulation**: No more cumulative non-breaking spaces when toggling themes
- **Better detection**: Improved duplicate processing prevention
- **Original content preservation**: Stores original text before any modifications

### 🎯 Form Layout
- **Nested grid resolution**: Forms inside grids now use flexbox to avoid conflicts
- **Smart grid handling**: `.rhythm .grid form { display: flex; }`
- **Height consistency**: Form fields properly match surrounding text elements

## 🔄 Breaking Changes

### Typography Engine Behavior
- **Default processing disabled**: Typography features are now opt-in
- **Manual activation required**: Use `standardTypography.updateOptions()` to enable features
- **No automatic theme processing**: Theme changes don't trigger text modifications

## 📚 API Additions

### Reading Debug API
```javascript
// Set debug modes
setReadingDebug('rhythm')   // Show rhythm lines
setReadingDebug('columns')  // Show column boundaries
setReadingDebug('both')     // Show both
setReadingDebug('off')      // Disable

// Get debug info
getReadingDebug()           // Returns current debug state

// Create controls
standardReadingDebug.createDebugControls({ container: element })
```

### Typography API (Enhanced)
```javascript
// Enable specific features
standardTypography.updateOptions({
  enableWidowPrevention: true,
  enableSmartQuotes: true,
  enablePunctuation: true
});

// Process content
standardTypography.processNewContent(element);
standardTypography.refresh();
```

## 🎨 CSS Improvements

### Form Styling
```css
/* Accent colors for form controls */
input[type="checkbox"],
input[type="radio"] {
    accent-color: var(--color-accent);
    outline: none;
}

/* Clean toggle button focus */
.toggle-btn:focus,
[data-theme-toggle] button:focus {
    outline: none;
}
```

### Reading Layout Debug
```css
/* Rhythm visualization */
.reading.reading-debug::before {
    /* Multi-layer gradient system for rhythm lines */
}

/* Column boundary markers */
.reading.reading-debug-columns::before {
    /* Grid template overlay */
}
```

### Spacing Fixes
```css
/* Corrected special block spacing */
blockquote,
pre,
figure,
.callout {
    margin-block-start: calc(
        (var(--space-block-special) - var(--space)) * var(--rhythm-multiplier)
    );
}
```

## 🛠 Development Improvements

- **Enhanced example file**: Comprehensive demonstration of all features
- **Better debugging**: Visual tools for understanding the framework
- **Cleaner codebase**: Removed automatic behaviors that could interfere
- **Conservative defaults**: Framework is less intrusive by default

## 📦 Installation & Usage

```bash
npm install @zefish/standard@0.3.0
```

```html
<!-- CSS -->
<link rel="stylesheet" href="node_modules/@zefish/standard/dist/standard.css">

<!-- JavaScript (optional) -->
<script src="node_modules/@zefish/standard/dist/standard.js"></script>
```

## 🎯 Migration Guide

### From v0.2.0
1. **Typography processing** is now opt-in - enable manually if needed
2. **Form styling** automatically includes accent colors
3. **Reading debug** is available via keyboard shortcuts or API
4. **Spacing** between special blocks is now corrected

### Recommended Updates
- Test forms with the new accent color styling
- Use reading debug tools to verify layout
- Enable typography features explicitly if desired
- Check that vertical spacing looks correct

## 🙏 Credits

This release focused on developer experience improvements, visual debugging capabilities, and fixing fundamental spacing issues in the framework's rhythm system.

---

**Full Changelog**: v0.2.0...v0.3.0  
**Download**: [Latest Release](https://www.npmjs.com/package/@zefish/standard)  
**Documentation**: See example/index.html for comprehensive demos