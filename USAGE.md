# Standard Framework - Unified Astro Integration

A comprehensive design system and typography framework for Astro projects. Built on centuries of typographic tradition, mathematical precision, and Swiss International Style principles.

## Unified Integration Approach

The Standard Framework now provides a **unified Astro integration** that combines all features into a single, easy-to-configure plugin. Instead of managing multiple separate integrations, you now configure everything through one `standard()` call.

## Quick Start

### 1. Install

```bash
npm install @zefish/standard
```

### 2. Basic Setup

Add to your `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [
    standard({
      // All Standard Framework features in one place!
      cloudflare: {
        enabled: true,
        functions: { enabled: true },
        images: { enabled: true },
        comments: { enabled: true },
      },
      openrouter: {
        enabled: true,
        apiKey: process.env.OPENROUTER_KEY,
        model: "anthropic/claude-3.5-sonnet",
      },
    }),
  ],
});
```

That's it! Your Astro project now has:

- ✅ **Typography Engine** - Smart quotes, dashes, fractions, widow prevention
- ✅ **Swiss Grid System** - 12-column responsive layout
- ✅ **Vertical Rhythm** - Baseline grid alignment
- ✅ **Color System** - Automatic light/dark theming
- ✅ **Reading Layout** - Editorial-quality content styling
- ✅ **Markdown Enhancements** - Callouts, syntax highlighting, footnotes
- ✅ **Cloudflare Integration** - Image optimization, serverless functions, comments
- ✅ **OpenRouter AI** - Multi-model AI routing and content generation

## Features Overview

### Typography Engine
Automatically enhances text with classical typography rules:
- Smart quotes (curly quotes)
- Proper dashes (em-dash, en-dash)
- Ellipsis (…) instead of three dots
- Fraction formatting (½, ¼, ¾)
- Widow/orphan prevention
- Locale-aware rules (EN, FR, DE, ES, IT)

### CSS Framework
- **Golden Ratio** - All measurements derive from φ = 1.618
- **12-Layer ITCSS** - Organized, scalable architecture
- **Utility Classes** - `.rhythm`, `.prose`, `.grid`, `.col-6`
- **Responsive Grid** - Mobile-first 12-column system
- **Design Tokens** - CSS custom properties for theming

### Components & Layouts
- `Base.astro` - Main layout with navigation and footer
- `Meta.astro` - SEO meta tags component
- `Menu.astro` - Navigation menu component
- `Fonts.astro` - Typography loading component
- `Comments.astro` - GitHub-backed comments system

## Configuration

### Basic Configuration

```javascript
import { defineConfig } from "astro/config";
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [
    standard({
      // Standard framework core options
      verbose: true,
      configPath: "site.config.yml",
      
      // Cloudflare features (all in one place!)
      cloudflare: {
        enabled: true,
        functions: {
          enabled: true,
          outputDir: "functions/api",
          environment: "production",
        },
        images: {
          enabled: true,
          skipClass: "no-cdn",
          skipExternal: true,
          quality: 85,
          format: "auto",
        },
        comments: {
          enabled: true,
          apiEndpoint: "/api/comments",
          commentsPath: "data/comments",
        },
      },

      // OpenRouter AI features (all in one place!)
      openrouter: {
        enabled: true,
        apiKey: process.env.OPENROUTER_KEY,
        model: "anthropic/claude-3.5-sonnet",
        models: [ // Multi-model routing
          "anthropic/claude-3.5-sonnet",
          "openai/gpt-4-turbo",
          "google/gemini-pro"
        ],
        route: "cheapest", // Routing strategy (cheapest, smart, fastest)
        siteUrl: "https://your-site.com",
      },
    })
  ],
});
```

### Advanced Configuration

```javascript
import { defineConfig } from "astro/config";
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [
    standard({
      // Custom config file path
      configPath: "./my-site-config.yml",
      
      // Disable automatic route injection
      injectRoutes: false,
      
      // Markdown plugins
      tags: {
        enabled: true
      },
      syntax: {
        enabled: true,
        theme: "prism"
      },
      escapeCode: {
        languages: ["html", "css", "javascript"]
      },
      
      // Typography customization
      typography: {
        enableSmartQuotes: true,
        enablePunctuation: true,
        enableWidowPrevention: true,
        enableFractions: true,
        enableArrowsAndSymbols: true,
        enableNumberFormatting: true,
        enableSpacing: true,
        locale: "fr", // French rules
        observeDOM: true,
        autoProcess: true
      },

      // Advanced Cloudflare configuration
      cloudflare: {
        enabled: true,
        functions: {
          enabled: true,
          outputDir: "functions/api",
          environment: "production",
          env: {
            NODE_ENV: "production"
          }
        },
        images: {
          enabled: true,
          quality: 90,
          format: "auto",
          fit: "cover",
          skipClass: "no-cdn",
          skipExternal: false, // Allow external URLs
        },
        comments: {
          enabled: true,
          apiEndpoint: "/api/comments",
          commentsPath: "data/comments",
          version: "1.0.0",
        },
      },

      // Advanced OpenRouter configuration
      openrouter: {
        enabled: true,
        apiKey: process.env.OPENROUTER_KEY,
        model: "anthropic/claude-3.5-sonnet",
        models: [
          "anthropic/claude-3.5-sonnet", // Best for reasoning
          "openai/gpt-4-turbo", // Good for coding
          "google/gemini-pro" // Fast and cheap
        ],
        route: "smart", // Automatically selects best model
        siteUrl: "https://your-site.com",
      }
    })
  ],
});
```

## Usage Examples

### Using Layouts

```astro
---
import Base from "@zefish/standard/layouts/Base.astro";
---

<Base title="My Page" description="Page description">
  <h1>Welcome to My Site</h1>
  <p>This page uses the Standard Framework layout.</p>
</Base>
```

### Using Components

```astro
---
import Menu from "@zefish/standard/components/Menu.astro";
---

<nav>
  <Menu 
    items={[
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" }
    ]} 
  />
</nav>
```

### Importing CSS Directly

```javascript
// In your main layout or component
import "@zefish/standard/css";
import "@zefish/standard/theme";
```

### Using Typography Features

The typography engine automatically processes text. Enable it in your layout:

```astro
---
// This will automatically enhance text with smart quotes, dashes, etc.
---

<div class="prose">
  <h1>The Art of Typography</h1>
  <p>"Typography is the craft of endowing human language with a durable visual form."</p>
  <p>It converts -- to em-dashes, three dots to ellipsis…, and 1/2 to fractions.</p>
</div>
```

### Grid System

```html
<div class="grid">
  <div class="col-6">
    <h2>Left Column</h2>
    <p>Content here spans 6 columns on desktop.</p>
  </div>
  <div class="col-6">
    <h2>Right Column</h2>
    <p>Content here spans 6 columns on desktop.</p>
  </div>
</div>

<!-- Responsive columns -->
<div class="grid">
  <div class="col-12 md:col-6 lg:col-4">
    <p>Responsive: 12 cols mobile, 6 tablet, 4 desktop</p>
  </div>
</div>
```

### Vertical Rhythm

```html
<div class="rhythm">
  <h1>Heading</h1>
  <p>First paragraph sits on the baseline grid.</p>
  <p>Second paragraph maintains rhythm.</p>
  <h2>Subheading</h2>
  <p>Still aligned to the baseline grid.</p>
</div>
```

## Available Exports

### Main Integration
```javascript
import standard from "@zefish/standard";
```

### CSS & JavaScript
```javascript
import "@zefish/standard/css";      // Main CSS framework
import "@zefish/standard/theme";    // Theme variations
import "@zefish/standard/js";       // Typography engine
import "@zefish/standard/lab";      // Experimental features
```

### Components
```javascript
import Base from "@zefish/standard/layouts/Base.astro";
import Meta from "@zefish/standard/layouts/Meta.astro";
import Menu from "@zefish/standard/components/Menu.astro";
import Fonts from "@zefish/standard/components/Fonts.astro";
import Comments from "@zefish/standard/components/Comments.astro";
```

### Markdown Plugins
```javascript
import remarkTags from "@zefish/standard/remark/tags";
import remarkStandard from "@zefish/standard/remark/standard";
import remarkEscapeCode from "@zefish/standard/remark/escape-code";
import remarkFixDates from "@zefish/standard/remark/fix-dates";
import remarkSyntax from "@zefish/standard/remark/syntax";
import rehypeStandard from "@zefish/standard/rehype/standard";
import rehypeTypography from "@zefish/standard/rehype/typography";
```

### Routes
```javascript
import robots from "@zefish/standard/routes/robots.js";
import manifest from "@zefish/standard/routes/manifest.js";
import headers from "@zefish/standard/routes/headers.js";
```

### Utilities
```javascript
import content from "@zefish/standard/utils/content.js";
import typography from "@zefish/standard/utils/typography.js";
```

### Cloudflare Image Utilities
```javascript
import { 
  CloudflareImage, 
  CloudflarePicture, 
  ResponsiveImage,
  buildCloudflareImageUrl,
  generateImageSrcset 
} from "@zefish/standard";
```

## YAML Configuration Summary

The Standard Framework supports **complete configuration through YAML files**. Here's a quick reference of all available configuration options:

```yaml
# site.config.yml - Complete configuration reference

# Site metadata
title: "Your Site Name"
description: "Site description"
author:
  name: "Your Name"
  email: "you@example.com"
url: "https://your-site.com"

# Standard Framework core settings
standard:
  verbose: true                    # Enable detailed logging
  injectRoutes: true               # Auto-inject robots.txt, manifest, headers
  configPath: "site.config.yml"    # Path to this config file

# Typography engine configuration
typography:
  enableSmartQuotes: true          # Convert straight to curly quotes
  enablePunctuation: true          # Convert -- to em-dash, ... to ellipsis
  enableWidowPrevention: true      # Prevent single words on last line
  enableFractions: true            # Convert 1/2 to ½
  enableArrowsAndSymbols: true     # Convert -> to →, (c) to ©
  enableNumberFormatting: true     # Add locale-specific separators
  enableSpacing: true              # Fix spacing around punctuation
  locale: "en"                     # Language: en, fr, de, es, it
  observeDOM: true                 # Watch for dynamic content changes
  autoProcess: true                # Process on page load

# CSS Grid system
grid:
  columns: 12                      # Number of grid columns
  gap: "1rem"                      # Grid gap spacing

# Cloudflare integration (complete)
cloudflare:
  enabled: true                    # Master switch for all Cloudflare features
  
  # Serverless Functions
  functions:
    enabled: true                  # Enable Cloudflare Pages Functions
    outputDir: "functions/api"     # Where to copy function files
    environment: "production"      # Target environment
    env:                           # Environment variables
      NODE_ENV: "production"
  
  # Image optimization
  images:
    enabled: true                  # Use Cloudflare image optimization
    quality: 85                    # Image quality (1-100)
    format: "auto"                 # Format: auto, webp, avif
    fit: "cover"                   # How image fits: cover, contain, fill
    position: "center"             # Image position: center, top, bottom
    skipClass: "no-cdn"            # Skip optimization for this CSS class
    skipExternal: true             # Don't optimize external URLs
  
  # Comments system
  comments:
    enabled: true                  # Enable GitHub-backed comments
    apiEndpoint: "/api/comments"   # API endpoint URL
    commentsPath: "data/comments"  # GitHub path for comment files
    version: "1.0.0"               # Comments system version

# OpenRouter AI integration (complete)
openrouter:
  enabled: true                    # Master switch for AI features
  apiKey: "${OPENROUTER_KEY}"      # API key (from environment variable)
  model: "anthropic/claude-3.5-sonnet"  # Default model
  models:                          # Multi-model routing configuration
    - "anthropic/claude-3.5-sonnet"     # Best for reasoning
    - "openai/gpt-4-turbo"              # Good for coding tasks
    - "google/gemini-pro"               # Fast and cost-effective
  route: "smart"                   # Routing strategy: cheapest, smart, fastest
  siteUrl: "https://your-site.com" # For API referer header

# Alternative comments configuration
comments:
  enabled: true                    # Enable comments (alternative to cloudflare.comments)
  apiEndpoint: "/api/comments"     # API endpoint
  commentsPath: "data/comments"    # Storage path

# Navigation configuration
nav:
  header:                          # Header navigation
    - href: "/"
      label: "Home"
    - href: "/about"
      label: "About"
    - href: "/contact"
      label: "Contact"
  footer:                          # Footer navigation
    - href: "/privacy"
      label: "Privacy"
    - href: "/terms"
      label: "Terms"

# Site configuration
site:
  url: "https://your-site.com"     # Site URL
  language: "en"                   # Site language
  timezone: "UTC"                  # Site timezone

# Build configuration
build:
  outDir: "dist"                   # Output directory
  assetsDir: "assets"              # Assets directory
```

## Configuration File

You can use a `site.config.yml` file for configuration. The Standard Framework will automatically load and merge YAML configuration with your `astro.config.mjs` options (options take precedence over YAML):

```yaml
title: "My Site"
description: "A site built with Standard Framework"
author:
  name: "Your Name"

# Standard framework core settings
standard:
  verbose: true
  injectRoutes: true

# Typography settings
typography:
  enableSmartQuotes: true
  enablePunctuation: true
  enableWidowPrevention: true
  locale: "en"

# Grid settings
grid:
  columns: 12
  gap: "1rem"

# Cloudflare integration
cloudflare:
  enabled: true
  functions:
    enabled: true
    outputDir: "functions/api"
    environment: "production"
  images:
    enabled: true
    quality: 90
    format: "auto"
    skipClass: "no-cdn"
  comments:
    enabled: true
    apiEndpoint: "/api/comments"
    commentsPath: "data/comments"

# OpenRouter AI integration
openrouter:
  enabled: true
  model: "anthropic/claude-3.5-sonnet"
  siteUrl: "https://your-site.com"
  models:
    - "anthropic/claude-3.5-sonnet"
    - "openai/gpt-4-turbo"
    - "google/gemini-pro"
  route: "smart"

# Navigation
nav:
  header:
    - href: "/"
      label: "Home"
    - href: "/about"
      label: "About"
```

## Complete YAML-Only Configuration

You can configure **everything** through `site.config.yml` and keep your `astro.config.mjs` minimal:

```yaml
# site.config.yml - Complete configuration
title: "My Standard Framework Site"
description: "A beautifully designed site with typography, AI, and Cloudflare"
author:
  name: "Francis Fontaine"
  email: "hello@ffp.co"

# Standard Framework core settings
standard:
  verbose: true
  injectRoutes: true
  configPath: "site.config.yml"

# Typography engine settings
typography:
  enableSmartQuotes: true
  enablePunctuation: true
  enableWidowPrevention: true
  enableFractions: true
  enableArrowsAndSymbols: true
  enableNumberFormatting: true
  enableSpacing: true
  locale: "en"
  observeDOM: true
  autoProcess: true

# Grid system settings
grid:
  columns: 12
  gap: "1rem"

# Cloudflare integration (complete configuration)
cloudflare:
  enabled: true
  functions:
    enabled: true
    outputDir: "functions/api"
    environment: "production"
    env:
      NODE_ENV: "production"
  images:
    enabled: true
    quality: 85
    format: "auto"
    fit: "cover"
    position: "center"
    skipClass: "no-cdn"
    skipExternal: true
  comments:
    enabled: true
    apiEndpoint: "/api/comments"
    commentsPath: "data/comments"
    version: "1.0.0"

# OpenRouter AI integration (complete configuration)
openrouter:
  enabled: true
  apiKey: ${OPENROUTER_KEY}  # Environment variable
  model: "anthropic/claude-3.5-sonnet"
  models:
    - "anthropic/claude-3.5-sonnet"  # Best for reasoning
    - "openai/gpt-4-turbo"           # Good for coding
    - "google/gemini-pro"            # Fast and cheap
  route: "smart"  # Routing strategy: cheapest, smart, fastest
  siteUrl: ${SITE_URL:-https://standard.ffp.co}

# Comments system (alternative configuration)
comments:
  enabled: true
  apiEndpoint: "/api/comments"
  commentsPath: "data/comments"

# Navigation configuration
nav:
  header:
    - href: "/"
      label: "Home"
    - href: "/docs"
      label: "Documentation"
    - href: "/examples"
      label: "Examples"
    - href: "/about"
      label: "About"
  footer:
    - href: "https://github.com/ZeFish/Standard"
      label: "GitHub"
    - href: "https://standard.ffp.co"
      label: "Website"

# Site metadata
site:
  url: "https://standard.ffp.co"
  language: "en"
  timezone: "UTC"

# Build settings
build:
  outDir: "dist"
  assetsDir: "assets"
```

```javascript
// astro.config.mjs - Minimal configuration
import { defineConfig } from "astro/config";
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [
    standard({
      // Just point to your YAML file - everything else loads from there!
      configPath: "site.config.yml",
      
      // Optional: Override specific settings
      verbose: process.env.NODE_ENV === "development",
      
      // Optional: Environment-specific overrides
      cloudflare: {
        images: {
          quality: process.env.NODE_ENV === "production" ? 90 : 75,
        },
      },
      
      // Optional: Environment variables
      openrouter: {
        apiKey: process.env.OPENROUTER_KEY,
      },
    }),
  ],
});
```

**That's it!** Your entire Standard Framework setup is now in `site.config.yml`. The Astro config stays minimal and clean.

## Configuration Loading Priority

Configuration values are loaded in the following priority order (highest to lowest):

1. **Command-line options** (in `astro.config.mjs`)
2. **YAML file values** (in `site.config.yml`)
3. **Default values** (built into the framework)

This means you can set defaults in `site.config.yml` and override specific values in your Astro config:

```yaml
# site.config.yml - Set your defaults
cloudflare:
  enabled: true
  images:
    quality: 85
    format: "auto"

openrouter:
  enabled: true
  model: "anthropic/claude-3.5-sonnet"
```

```javascript
// astro.config.mjs - Override specific values
standard({
  cloudflare: {
    images: {
      quality: 90 // Override the YAML default
    }
  }
})
```

## Environment Variables in YAML

You can also reference environment variables in your YAML configuration:

```yaml
# site.config.yml
openrouter:
  enabled: true
  apiKey: ${OPENROUTER_KEY}  # Reads from env var
  siteUrl: ${SITE_URL:-https://default-site.com}  # With fallback
```

Then in your `.env` file:
```bash
OPENROUTER_KEY=sk-or-v1-your-key-here
SITE_URL=https://your-site.com
```

**Note**: Environment variable substitution in YAML is handled by your build system or can be processed manually before the build.

# Navigation
nav:
  header:
    - href: "/"
      label: "Home"
    - href: "/about"
      label: "About"
```

## Migration from Separate Integrations

If you were using separate integrations:

```javascript
// OLD WAY (multiple integrations)
import standard from "@zefish/standard";
import cloudflareIntegration from "@zefish/standard/integrations/cloudflare";
import openrouterIntegration from "@zefish/standard/integrations/openrouter";

export default defineConfig({
  integrations: [
    standard(),
    cloudflareIntegration({ /* options */ }),
    openrouterIntegration({ /* options */ }),
  ],
});
```

```javascript
// NEW WAY (unified integration)
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [
    standard({
      cloudflare: { /* options */ },
      openrouter: { /* options */ },
    }),
  ],
});
```

## Using Cloudflare Image Optimization

### Import Utilities

```javascript
// In your Astro components
import { 
  CloudflareImage, 
  CloudflarePicture, 
  ResponsiveImage,
  buildCloudflareImageUrl,
  generateImageSrcset 
} from "@zefish/standard";
```

### Basic Image Component

```astro
---
import { CloudflareImage } from "@zefish/standard";
---

<!-- Automatic optimization with responsive srcset -->
<CloudflareImage 
  src="/images/hero.jpg"
  alt="Beautiful landscape"
  width={1200}
  height={800}
  quality={90}
  format="auto"
  class="hero-image"
/>
```

### Picture Element with Multiple Formats

```astro
---
import { CloudflarePicture } from "@zefish/standard";
---

<!-- Generate WebP, AVIF, and fallback -->
<CloudflarePicture
  src="/images/photo.jpg"
  alt="Product photo"
  width={800}
  height={600}
  formats={["webp", "avif", "auto"]}
  sizes="(max-width: 768px) 100vw, 768px"
  class="product-image"
/>
```

### Progressive Loading with Blur Placeholder

```astro
---
import { ResponsiveImage } from "@zefish/standard";
---

<!-- Includes blur placeholder for smooth loading -->
<ResponsiveImage
  src="/images/gallery-1.jpg"
  alt="Gallery image"
  width={1200}
  height={900}
  blurPlaceholder={true}
  class="gallery-item"
/>
```

## Using OpenRouter AI Features

### Server-Side AI Calls

```javascript
// In Astro API routes or server components
export async function POST({ request }) {
  const { messages, options } = await request.json();
  
  // Call OpenRouter through the integration
  const response = await fetch("/api/ai/call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, options }),
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
```

### Client-Side AI Integration

```javascript
// In Astro components
const callAI = async (prompt) => {
  const response = await fetch("/api/ai/call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      messages: [{ role: "user", content: prompt }] 
    }),
  });
  
  const data = await response.json();
  return data.content;
};

// Usage
const summary = await callAI("Summarize this article in 50 words");
```

### Multi-Model Routing

```javascript
// Configure multiple models for smart routing
standard({
  openrouter: {
    models: [
      "anthropic/claude-3.5-sonnet", // Best for reasoning
      "openai/gpt-4-turbo", // Good for coding
      "google/gemini-pro" // Fast and cheap
    ],
    route: "smart" // Automatically selects best model
  }
})
```

## Environment Variables

Set these in your environment or `.env` file:

```bash
# Required for OpenRouter AI features
OPENROUTER_KEY=sk-or-v1-your-key-here

# Optional: Override default site URL
SITE_URL=https://your-site.com
```

## Benefits of Unified Integration

✅ **Single Configuration** - One place for all features
✅ **Better Type Safety** - Unified TypeScript definitions
✅ **Simplified Imports** - Import utilities from one place
✅ **Consistent Logging** - All features use same logger
✅ **Easier Maintenance** - Less boilerplate, clearer code
✅ **Better Performance** - Shared configuration and utilities

## Design Principles

### Mathematical Precision
Every measurement derives from the golden ratio (φ = 1.618):
- Base spacing: 1.5rem (24px)
- Scale multipliers: 1.5, 2.25, 3.375, 5.063
- Typography: 1.618 ratio between heading levels

### Swiss International Style
- Clean, objective design
- 12-column grid system
- Mathematical grid-based layouts
- Hierarchy through scale and weight

### Classical Typography
- Rules from masters of print design
- Locale-aware smart quotes
- Proper punctuation and spacing
- Widow/orphan prevention

### Progressive Enhancement
- Core experience without JavaScript
- JavaScript enhances, doesn't require
- Features degrade gracefully
- Mobile-first responsive design

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- JavaScript features are progressive enhancement

## Troubleshooting

### Enable Verbose Logging

```javascript
standard({
  verbose: true, // Shows detailed build information
})
```

### Check Configuration

```javascript
// Access config in your components
import config from "virtual:standard/config";

console.log("Standard config:", config);
```

### Common Issues

1. **Functions not copying**: Check `cloudflare.functions.enabled` is `true`
2. **AI not working**: Verify `OPENROUTER_KEY` is set
3. **Images not optimizing**: Ensure Cloudflare is enabled and images are local
4. **Comments not loading**: Check GitHub token and repository configuration

### Typography not working
Ensure JavaScript is enabled and the standard.js script is loaded:
```html
<script type="module">
  import "/assets/js/standard.js";
</script>
```

### Grid not responsive
Make sure you're using the correct class names:
```html
<!-- Correct -->
<div class="grid">
  <div class="col-6 md:col-4 lg:col-3">
</div>

<!-- Incorrect -->
<div class="grid">
  <div class="col-6 medium-col-4 large-col-3">
</div>
```

### Styles not applying
Import the CSS framework:
```javascript
import "@zefish/standard/css";
```

### Cloudflare images not optimizing
Check that:
- Cloudflare integration is enabled
- Images are local (not external URLs)
- Images don't have the `skipClass` class
- Image format is supported (not SVG)

### OpenRouter AI not responding
Verify:
- `OPENROUTER_KEY` environment variable is set
- API key has proper permissions
- Site URL is configured correctly
- Network connectivity to openrouter.ai

## Examples

See the [Standard Framework repository](https://github.com/ZeFish/Standard) for complete examples and documentation.

## Next Steps

- 📖 Read the [full documentation](https://standard.ffp.co)
- 🔧 Explore [configuration options](#configuration)
- 💡 Check out [example projects](./example-usage/)
- 🐛 Report issues on [GitHub](https://github.com/ZeFish/Standard)

## License

MIT License - see [LICENSE](https://github.com/ZeFish/Standard/blob/main/LICENSE) file.

## Support

- [GitHub Issues](https://github.com/ZeFish/Standard/issues)
- [Documentation](https://standard.ffp.co)
- [NPM Package](https://www.npmjs.com/package/@zefish/standard)