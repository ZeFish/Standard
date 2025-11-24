# Configuration Example

This page demonstrates how to use your `site.config.yml` settings in Astro components.

## Basic Usage

Here's how to import and use the configuration in any `.astro` file:

```astro

// Import the configuration
import config from "virtual:standard/config";

<!-- Use the configuration -->
<h1>{config.title}</h1>
<p>{config.description}</p>

<!-- Access nested properties -->
<p>Written by {config.author.name}</p>
```

## Live Example

The configuration values below are loaded from `site.config.yml`:

**Site Title:** {config.title}

**Site Description:** {config.description}

**Author:** {config.author.name}

**Language:** {config.language}

## Navigation

Your configured navigation menu:

{config.nav?.header && (
  <ul>
    {config.nav.header.map((item) => (
      <li><a href={item.url}>{item.title}</a></li>
    ))}
  </ul>
)}

## Social Links

{config.social && Object.keys(config.social).length > 0 && (
  <div>
    <h3>Follow Me</h3>
    <ul>
      {config.social.twitter && (
        <li>Twitter: {config.social.twitter}</li>
      )}
      {config.social.instagram && (
        <li>Instagram: {config.social.instagram}</li>
      )}
    </ul>
  </div>
)}

## Framework Settings

Your Standard Framework configuration:

```json
{JSON.stringify(config.standard, null, 2)}
```

## How It Works

1. **Automatic Loading**: The Astro integration automatically loads `site.config.yml` from your project root
2. **Virtual Module**: Configuration is available via `virtual:standard/config`
3. **Type Safety**: Use JSDoc for better IDE support
4. **Hot Reload**: Changes to `site.config.yml` are reflected immediately in development

## Next Steps

- Read the full [[Astro Configuration]] guide
- Explore [[Components]] for reusable patterns
- Check out [[Layouts]] for layout integration