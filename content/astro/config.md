# Astro Configuration

## Overview

The Standard Framework Astro integration automatically loads and merges configuration from `site.config.yml`, making your site settings available throughout your Astro application through a virtual module system.

## How It Works

When you import the Standard Framework in your `astro.config.mjs`, the integration automatically:

1. **Loads `site.config.yml`** from your project root
2. **Merges configuration** with any options passed directly to the integration
3. **Makes configuration available** via the virtual module `virtual:standard/config`
4. **Provides type-safe access** to all your site settings

## Basic Setup

### 1. Configure Astro Integration

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [standard()],
});
```

### 2. Use Configuration in Components

```astro

// Any .astro file
import config from "virtual:standard/config";

const { title, description, author } = config;

<html lang="en">
  <head>
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <h1>{title}</h1>
    <p>By {author.name}</p>
  </body>
</html>
```

## Configuration Structure

Your `site.config.yml` can contain any of these sections:

```yaml
# Site Information
title: "Your Site Title"
url: "https://yoursite.com"
language: "en"
description: "Your site description"
author:
  name: "Your Name"
  email: "you@example.com"
  url: "https://yourwebsite.com"
  twitter: "@yourhandle"

# Navigation
nav:
  header:
    - title: "Home"
      url: "/"
    - title: "About"
      url: "/about"
    - title: "Blog"
      url: "/blog"

# Social Media
social:
  twitter: "@yourhandle"
  instagram: "@yourhandle"
  github: "yourusername"

# Standard Framework Options
standard:
  verbose: true
  security:
    enabled: false
  ai:
    enabled: true
    model: "meta-llama/llama-4-maverick:free"

# Build Configuration
build:
  css:
    srcDir: "src/styles"
    outputDir: ["_site/assets/standard", "dist"]
    files:
      - input: "standard.scss"
        output: "standard.min.css"
  js:
    srcDir: "src/js"
    outputDir: ["_site/assets/standard", "dist"]
    files:
      - input: "standard.js"
        output: "standard.min.js"
```

## Configuration Priority

The integration merges configuration with the following priority:

1. **Direct integration options** (highest priority)
2. **site.config.yml values**
3. **Default values** (lowest priority)

```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [
    standard({
      // These override site.config.yml
      title: "Override Title",
      standard: {
        verbose: false  // Override the verbose setting
      }
    })
  ],
});
```

## Usage Examples

### Site Header Component

```astro

// components/Header.astro
import config from "virtual:standard/config";

<header class="site-header">
  <nav class="main-nav">
    <h1 class="site-title">
      <a href="/">{config.title}</a>
    </h1>

    {config.nav?.header && (
      <ul class="nav-links">
        {config.nav.header.map((item) => (
          <li>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    )}
  </nav>
</header>

<style>
  .site-header {
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .main-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
  }
</style>
```

### Author Bio Component

```astro

// components/AuthorBio.astro
import config from "virtual:standard/config";

<aside class="author-bio">
  {config.author && (
    <>
      <h3>About the Author</h3>

      {config.author.name && (
        <p><strong>{config.author.name}</strong></p>
      )}

      {config.author.url && (
        <p>
          <a href={config.author.url} rel="author">
            Website
          </a>
        </p>
      )}

      {config.author.email && (
        <p>
          <a href={`mailto:${config.author.email}`}>
            Email
          </a>
        </p>
      )}

      {config.author.twitter && (
        <p>
          <a href={`https://twitter.com/${config.author.twitter.replace('@', '')}`}>
            Twitter
          </a>
        </p>
      )}
    </>
  )}
</aside>

<style>
  .author-bio {
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;
    margin: 2rem 0;
  }

  .author-bio a {
    color: #0066cc;
    text-decoration: none;
  }

  .author-bio a:hover {
    text-decoration: underline;
  }
</style>
```

### Social Links Component

```astro

// components/SocialLinks.astro
import config from "virtual:standard/config";

<nav class="social-links">
  {config.social && Object.keys(config.social).length > 0 && (
    <>
      <h4>Follow Me</h4>
      <ul>
        {config.social.twitter && (
          <li>
            <a
              href={`https://twitter.com/${config.social.twitter.replace('@', '')}`}
              class="social-link twitter"
            >
              Twitter
            </a>
          </li>
        )}

        {config.social.instagram && (
          <li>
            <a
              href={`https://instagram.com/${config.social.instagram.replace('@', '')}`}
              class="social-link instagram"
            >
              Instagram
            </a>
          </li>
        )}

        {config.social.github && (
          <li>
            <a
              href={`https://github.com/${config.social.github}`}
              class="social-link github"
            >
              GitHub
            </a>
          </li>
        )}
      </ul>
    </>
  )}
</nav>

<style>
  .social-links {
    margin: 2rem 0;
  }

  .social-links ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 1rem;
  }

  .social-link {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border-radius: 4px;
    text-decoration: none;
    color: #666;
    transition: background 0.2s;
  }

  .social-link:hover {
    background: #e0e0e0;
  }
</style>
```

### Debug Component (Development)

```astro

// components/ConfigDebug.astro
import config from "virtual:standard/config";

// Only show in development
const isDev = import.meta.env.DEV;

{isDev && config.standard?.verbose && (
  <details class="config-debug">
    <summary>🔧 Debug: Site Configuration</summary>
    <pre><code>{JSON.stringify(config, null, 2)}</code></pre>
  </details>
)}

<style>
  .config-debug {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 1rem;
    max-width: 400px;
    max-height: 300px;
    overflow: auto;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
  }

  .config-debug pre {
    margin: 0;
    font-size: 0.8rem;
    white-space: pre-wrap;
  }
</style>
```

## Integration with Layouts

### Base Layout

```astro

// layouts/Base.astro
import config from "virtual:standard/config";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import ConfigDebug from "../components/ConfigDebug.astro";

const {
  title = "My Site",
  description = "",
  author = {},
  url = "https://example.com"
} = config;

<!DOCTYPE html>
<html lang={config.language || "en"}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>{title}</title>
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content="website" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    {config.social?.twitter && (
      <meta name="twitter:site" content={config.social.twitter} />
    )}

    <!-- Author -->
    {author.name && (
      <meta name="author" content={author.name} />
    )}
  </head>

  <body>
    <Header />

    <main class="content">
      <slot />
    </main>

    <Footer />
    <ConfigDebug />
  </body>
</html>
```

## Auto-Generated Routes

The integration automatically creates several useful routes that use your configuration:

### `/robots.txt`
Uses your `config.robots` settings to generate appropriate robots.txt content.

### `/site.webmanifest`
Uses your site metadata to create a Progressive Web App manifest:
- **Name**: From `config.title`
- **Description**: From `config.description`
- **Author**: From `config.author.name`
- **Theme Colors**: From `config.manifest` or defaults

### `/_headers`
Generates security headers based on `config.security` settings.

## Error Handling

The integration gracefully handles configuration errors:

```javascript
// If site.config.yml is missing or invalid
// The integration will:
// 1. Log a warning to console
// 2. Use empty object as fallback
// 3. Continue with default values
// 4. Not break your build
```

## Best Practices

### 1. Use Descriptive Keys

```yaml
# Good
author:
  name: "Francis Fontaine"
  email: "francisfontaine@gmail.com"

# Avoid
person:
  n: "Francis Fontaine"
  e: "francisfontaine@gmail.com"
```

### 2. Provide Defaults

```yaml
# Always provide fallbacks
title: "My Site"  # Required
description: "Site description"  # Required
language: "en"  # Good default
```

### 3. Use Environment-Specific Config

```yaml
# site.config.yml (base config)
standard:
  verbose: false

# Override in astro.config.mjs for development
standard({
  standard: {
    verbose: true  // Enable debug mode locally
  }
})
```

### 4. Type Safety with JSDoc

```astro

// Add JSDoc for better IDE support
/**
 * @type {import('virtual:standard/config')}
 */
const config = await import("virtual:standard/config");

```

## Migration from 11ty

If you're migrating from 11ty, your existing `site.config.yml` will work immediately with the Astro integration. The configuration structure is identical, and all existing routes and components will continue to work.

## Troubleshooting

### Configuration Not Loading

1. Check that `site.config.yml` is in your project root
2. Verify YAML syntax with a YAML validator
3. Check browser console for parsing errors
4. Ensure the file is readable by Node.js

### Virtual Module Not Found

1. Make sure you're importing from `virtual:standard/config`
2. Check that the Standard integration is properly configured in `astro.config.mjs`
3. Restart your dev server after adding the integration

### Type Errors

```typescript
// Add to your tsconfig.json if using TypeScript
{
  "compilerOptions": {
    "types": ["astro/client"]
  }
}
```

## See Also

- [[Astro Integration]] - Overview of the Astro integration
- [[Configuration]] - Complete configuration reference
- [[Layouts]] - Using layouts with configuration
- [[Components]] - Building reusable components
- [[Routes]] - Auto-generated routes and their configuration