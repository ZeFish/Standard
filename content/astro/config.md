# Astro Configuration

## Overview

The Standard Framework Astro integration automatically loads and merges configuration from `site.config.yml`, making your site settings available throughout your Astro application through a virtual module system.

## How It Works

When you import the Standard Framework in your `astro.config.mjs`, the integration automatically:

1. **Loads `site.config.yml`** from your project root
2. **Merges configuration** with any options passed directly to the integration
3. **Makes configuration available** via the virtual module `virtual:standard/config`
4. **Provides type-safe access** to all your site settings

## Configuration Priority

The integration merges configuration with the following priority:

1. **Direct integration options** (highest priority)
2. **site.config.yml values**
3. **Default values** (lowest priority)

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
- If site.config.yml is missing or invalid
- The integration will log a warning to console
- Use empty object as fallback
- Continue with default values
- Not break your build

## Best Practices

### 1. Use Descriptive Keys

Use clear, descriptive names for your configuration keys rather than abbreviations.

### 2. Provide Defaults

Always provide fallback values for important configuration options:
- `title`: Your site title (Required)
- `description`: Site description (Required)
- `language`: Language code (Good default: "en")

### 3. Use Environment-Specific Config

Set base configuration in `site.config.yml` and override specific settings in `astro.config.mjs` for development.

### 4. Type Safety with JSDoc

Add JSDoc comments for better IDE support when importing configuration.

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

Add to your `tsconfig.json` if using TypeScript to get proper type definitions for Astro.

## See Also

- [[Astro Integration]] - Overview of the Astro integration
- [[Configuration]] - Complete configuration reference
- [[Layouts]] - Using layouts with configuration
- [[Components]] - Building reusable components
- [[Routes]] - Auto-generated routes and their configuration
