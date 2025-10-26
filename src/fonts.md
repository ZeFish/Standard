**Perfect!** Crystal clear now. Let me code this up:

## Implementation: `src/eleventy/font.js`

```javascript
/**
 * Font Management System
 *
 * @component Font Management Plugin
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1734, William Caslon released his first typeface specimen sheet,
 * forever changing how printers selected fonts. Before Caslon, printers
 * had to physically visit foundries to see type samples. His innovation?
 * A single sheet showing everything available—weights, styles, sizes.
 *
 * This plugin brings that same simplicity to web development. Instead of
 * wrestling with Google Fonts URLs, @import statements, and font-display
 * strategies, you declare what you want and the system handles the rest.
 * One line. Done.
 *
 * For local fonts, it scans /assets/fonts/ and auto-detects weights, styles,
 * and variable fonts. For Google Fonts, it generates optimized embed codes
 * with sensible defaults. No configuration files. No registries. Just works.
 *
 * ### Future Improvements
 *
 * - Add automatic subset selection based on content language
 * - Support Bunny Fonts (privacy-friendly Google Fonts alternative)
 * - Add font loading performance metrics
 * - Generate fallback font stacks automatically
 * - Support font-feature-settings presets
 *
 * @see {shortcode} standardAssets - Main asset loader
 * @see {file} src/styles/standard-03-typography.scss - Typography system
 *
 * @link https://fonts.google.com Google Fonts
 * @link https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face MDN @font-face
 *
 * @example njk - Local font (auto-detect)
 *   {% standardFonts "inter" %}
 *
 * @example njk - Google Fonts
 *   {% standardFonts "inter", source="google" %}
 *
 * @example njk - Multiple fonts
 *   {% standardFonts "inter", "merriweather" %}
 *
 * @example njk - Specific weights
 *   {% standardFonts "inter", source="google", weights="400,700" %}
 *
 * @example njk - Custom CSS variable
 *   {% standardFonts "inter", var="sans" %}
 */

import fs from "fs";
import path from "path";

/**
 * Scan /assets/fonts/ for font files matching pattern
 *
 * Pattern examples:
 * - inter.woff2 → weight: 400, style: normal
 * - inter-italic.woff2 → weight: 400, style: italic
 * - inter-700.woff2 → weight: 700, style: normal
 * - inter-700-italic.woff2 → weight: 700, style: italic
 * - inter-variable.woff2 → variable font
 */
function scanLocalFonts(fontName, fontsDir = "./assets/fonts") {
  const fonts = [];
  const variableFont = null;

  if (!fs.existsSync(fontsDir)) {
    return { fonts, variableFont, found: false };
  }

  const files = fs.readdirSync(fontsDir);
  const pattern = new RegExp(`^${fontName}(-variable|-\\d+)?(-italic)?\\.(woff2|woff|ttf)$`, "i");

  files.forEach(file => {
    const match = file.match(pattern);
    if (!match) return;

    const [, weightPart, stylePart, format] = match;

    // Variable font
    if (weightPart === "-variable") {
      fonts.push({
        file,
        format,
        variable: true,
        weight: "100 900",
        style: stylePart ? "italic" : "normal"
      });
      return;
    }

    // Static font
    const weight = weightPart ? weightPart.replace("-", "") : "400";
    const style = stylePart ? "italic" : "normal";

    fonts.push({
      file,
      format,
      variable: false,
      weight,
      style
    });
  });

  return { fonts, found: fonts.length > 0 };
}

/**
 * Generate @font-face rules for local fonts
 */
function generateFontFaceRules(fontName, fonts, basePath = "/assets/fonts") {
  if (fonts.length === 0) return "";

  const familyName = fontName
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const rules = fonts.map(font => {
    const formatMap = {
      woff2: "woff2",
      woff: "woff",
      ttf: "truetype"
    };

    const fontFormat = font.variable ? "woff2-variations" : formatMap[font.format];

    return `@font-face {
  font-family: '${familyName}';
  src: url('${basePath}/${font.file}') format('${fontFormat}');
  font-weight: ${font.weight};
  font-style: ${font.style};
  font-display: swap;
}`;
  }).join("\n\n");

  return `<style>\n${rules}\n</style>`;
}

/**
 * Generate Google Fonts URL
 *
 * Without API access, we use sensible defaults:
 * - Default weights: 300, 400, 500, 600, 700
 * - Default styles: normal, italic
 * - Variable fonts: Use wght axis range
 */
function generateGoogleFontsUrl(fontName, options = {}) {
  const display = options.display || "swap";
  const weights = options.weights
    ? options.weights.split(",").map(w => w.trim())
    : ["300", "400", "500", "600", "700"];

  // Format font name for URL
  const family = fontName
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("+");

  // Check if variable font requested
  if (options.variable) {
    return `https://fonts.googleapis.com/css2?family=${family}:wght@100..900&display=${display}`;
  }

  // Standard font with italic support
  const specs = [];
  weights.forEach(weight => {
    specs.push(`0,${weight}`); // normal
    specs.push(`1,${weight}`); // italic
  });

  return `https://fonts.googleapis.com/css2?family=${family}:ital,wght@${specs.join(";")}&display=${display}`;
}

/**
 * Generate CSS custom property
 */
function generateCssVar(fontName, cssVarName = null) {
  const familyName = fontName
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const varName = cssVarName || `--font-${fontName.toLowerCase()}`;

  // Smart fallback based on font name
  let fallback = "sans-serif";
  if (fontName.match(/serif|garamond|times|georgia|merriweather/i)) {
    fallback = "Georgia, serif";
  } else if (fontName.match(/mono|code|courier|consolas/i)) {
    fallback = '"Courier New", monospace';
  } else {
    fallback = "system-ui, sans-serif";
  }

  return `<style>\n:root {\n  ${varName}: "${familyName}", ${fallback};\n}\n</style>`;
}

/**
 * Main shortcode function
 */
export function standardFonts(eleventyConfig) {
  return function(...args) {
    // Parse arguments
    const fonts = [];
    const options = {
      source: "local", // 'local' or 'google'
      display: "swap",
      weights: null,
      variable: false,
      var: null,
      fontsDir: "./assets/fonts"
    };

    args.forEach(arg => {
      if (typeof arg === "string") {
        fonts.push(arg.toLowerCase());
      } else if (typeof arg === "object") {
        Object.assign(options, arg);
      }
    });

    if (fonts.length === 0) {
      console.warn("[standardFonts] No fonts specified");
      return "";
    }

    const output = [];

    fonts.forEach(fontName => {
      // Determine source (explicit or auto-detect)
      const source = options.source;

      if (source === "local") {
        // Scan for local fonts
        const { fonts: localFonts, found } = scanLocalFonts(fontName, options.fontsDir);

        if (!found) {
          console.warn(`[standardFonts] Font "${fontName}" not found in ${options.fontsDir}/`);
          console.warn(`  Expected files like: ${fontName}.woff2, ${fontName}-700.woff2, ${fontName}-variable.woff2`);
          return;
        }

        // Generate @font-face rules
        output.push(generateFontFaceRules(fontName, localFonts));

        // Generate CSS variable
        output.push(generateCssVar(fontName, options.var));

        console.log(`[standardFonts] Loaded local font "${fontName}" (${localFonts.length} variants)`);
      }
      else if (source === "google") {
        // Generate Google Fonts embed
        output.push('<link rel="preconnect" href="https://fonts.googleapis.com">');
        output.push('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');

        const url = generateGoogleFontsUrl(fontName, options);
        output.push(`<link rel="stylesheet" href="${url}">`);

        // Generate CSS variable
        output.push(generateCssVar(fontName, options.var));

        console.log(`[standardFonts] Loaded Google Font "${fontName}"`);
      }
      else {
        console.warn(`[standardFonts] Invalid source "${source}" (use "local" or "google")`);
      }
    });

    return output.filter(Boolean).join("\n");
  };
}

/**
 * Register plugin with 11ty
 */
export function FontPlugin(eleventyConfig, options = {}) {
  eleventyConfig.addShortcode("standardFonts", standardFonts(eleventyConfig));
}
```

## Add to Main Plugin

Update `src/eleventy/eleventy.js`:

```javascript
import { FontPlugin } from "./font.js";

export default function StandardFramework(eleventyConfig, options = {}) {
  // ... existing plugins ...

  // Add font management
  eleventyConfig.addPlugin(FontPlugin, options);

  // ... rest of code ...
}
```

## Usage Examples

### Local Fonts (Auto-detect)

```njk
<!-- Scans /assets/fonts/ for inter*.woff2 -->
{% standardFonts "inter" %}
```

**Detects:**
```
/assets/fonts/inter.woff2           → Regular
/assets/fonts/inter-700.woff2       → Bold
/assets/fonts/inter-variable.woff2  → Variable font
```

**Generates:**
```html
<style>
@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/inter.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/inter-700.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
</style>

<style>
:root {
  --font-inter: "Inter", system-ui, sans-serif;
}
</style>
```

### Google Fonts

```njk
<!-- Loads from Google with default weights (300-700) -->
{% standardFonts "roboto", source="google" %}
```

**Generates:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;1,300;0,400;1,400;0,500;1,500;0,600;1,600;0,700;1,700&display=swap">

<style>
:root {
  --font-roboto: "Roboto", system-ui, sans-serif;
}
</style>
```

### Google Fonts with Specific Weights

```njk
{% standardFonts "inter", source="google", weights="400,700" %}
```

### Variable Google Font

```njk
{% standardFonts "inter", source="google", variable=true %}
```

### Custom CSS Variable

```njk
{% standardFonts "inter", var="sans" %}
<!-- Creates --font-sans instead of --font-inter -->
```

### Multiple Fonts

```njk
{% standardFonts "inter", source="google" %}
{% standardFonts "merriweather", source="google" %}
```

## File Naming Convention

```
/assets/fonts/
  ├── inter.woff2                 ← Regular (400 normal)
  ├── inter-italic.woff2          ← Regular italic (400 italic)
  ├── inter-700.woff2             ← Bold (700 normal)
  ├── inter-700-italic.woff2      ← Bold italic (700 italic)
  ├── inter-variable.woff2        ← Variable (100-900)
  ├── merriweather.woff2
  └── merriweather-700.woff2
```

**Pattern:** `{fontname}[-{weight}][-italic].{format}`

---

**Does this match your vision?** Want me to add anything else (like Bunny Fonts support, or automatic subset detection)?
