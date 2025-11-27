## Frontmatter Defaults Remark Plugin

A remark plugin for the Standard Framework that allows you to define default values for frontmatter fields that are missing or undefined across your content collection. It also **automatically generates permalinks** from file IDs if not provided.

### Problem Solved

When managing content collections, you often want:
1. Consistent metadata across all documents without requiring every markdown file to explicitly define every field
2. Consistent, predictable URLs based on file structure
3. Readable titles automatically generated from filenames
4. The ability to customize URLs and titles via frontmatter when needed

This plugin solves all four by:
- ✅ Applying defaults to missing frontmatter fields
- ✅ Auto-generating permalinks from file IDs
- ✅ Auto-generating titles from filenames (kebab-case → Title Case)
- ✅ Never overwriting existing values
- ✅ Deep cloning arrays and objects to avoid reference issues
- ✅ Running early in the markdown pipeline
- ✅ Providing verbose logging for debugging

### Installation

The plugin is already integrated into your Standard Framework. It's automatically imported and configured in `src/astro/standard-remark.js`.

### Configuration

#### Option 1: Via astro.config.mjs (Recommended)

```javascript
import { defineConfig } from "astro/config";
import standard from "./src/astro/standard.js";

export default defineConfig({
  integrations: [
    standard({
      configPath: "site.config.yml",
      
      // Define your frontmatter defaults here
      frontmatterDefaults: {
        visibility: 'public',
        draft: false,
        tags: [],
        author: 'Your Name',
        layout: 'default',
        category: 'uncategorized'
        // Note: permalink is auto-generated if not provided
      },
      
      verbose: process.env.NODE_ENV === "development"
    })
  ]
});
```

#### Option 2: Via site.config.yml

```yaml
# site.config.yml
frontmatterDefaults:
  visibility: public
  draft: false
  tags: []
  author: Your Name
  layout: default
  category: uncategorized

verbose: true
```

### How It Works

#### 1. Title Generation

If no `title` is provided in frontmatter, it's automatically generated from the filename (kebab-case → Title Case):

| File Path | Generated Title |
|-----------|-------------------|
| `blog/my-post.md` | `My Post` |
| `docs/getting-started.md` | `Getting Started` |
| `pages/about.md` | `About` |
| `index.md` | *(no title generated)* |

#### 2. Permalink Generation

If no `permalink` is provided in frontmatter, it's automatically generated from the file ID:

| File Path | Generated Permalink |
|-----------|-------------------|
| `blog/my-post.md` | `/blog/my-post/` |
| `docs/index.md` | `/docs/` |
| `index.md` | `/` |
| `pages/about.md` | `/pages/about/` |

#### 3. URL Assignment

The generated (or provided) `permalink` becomes the collection entry's `.url` property:

```javascript
// In your templates
const posts = await getCollection('docs');

posts.map(post => (
  <a href={post.url}>  {/* Uses the permalink */}
    {post.data.title}
  </a>
))
```

#### 4. Default Application

All other defaults are applied to missing fields:

```markdown
---
title: My Article
description: A great article
---
```

Becomes:

```javascript
{
  title: 'My Article',       // From frontmatter
  description: 'A great article',
  visibility: 'public',      // ← Applied default
  draft: false,              // ← Applied default
  tags: [],                  // ← Applied default
  author: 'Your Name',       // ← Applied default
  layout: 'default',         // ← Applied default
  permalink: '/my-article/'  // ← Auto-generated from file ID
}
```

**File:** `content/blog/getting-started.md` (no frontmatter)
```markdown
---
---

Content here...
```

Becomes:

```javascript
{
  title: 'Getting Started',  // ← Auto-generated from filename
  visibility: 'public',      // ← Applied default
  draft: false,              // ← Applied default
  tags: [],                  // ← Applied default
  author: 'Your Name',       // ← Applied default
  layout: 'default',         // ← Applied default
  permalink: '/blog/getting-started/'  // ← Auto-generated from file ID
}
```

### Usage Examples

#### Example 1: Minimal Frontmatter with Auto-Generated Title and URL

**File:** `content/docs/getting-started.md` (no frontmatter)
```markdown
---
---

Content here...
```

**Result in template:**
```javascript
post.url // → '/docs/getting-started/'
post.data.title // → 'Getting Started' (auto-generated from filename)
post.data.visibility // → 'public' (default)
post.data.draft // → false (default)
```

#### Example 2: Partial Frontmatter

**File:** `content/blog/my-article.md`
```markdown
---
description: A great article
---

Content here...
```

**Result in template:**
```javascript
post.url // → '/blog/my-article/'
post.data.title // → 'My Article' (auto-generated from filename)
post.data.description // → 'A great article'
post.data.visibility // → 'public' (default)
post.data.draft // → false (default)
```

#### Example 3: Custom Permalink and Title

**File:** `content/blog/my-post.md`
```markdown
---
title: My Article
permalink: /articles/custom-url/
---

Content here...
```

**Result in template:**
```javascript
post.url // → '/articles/custom-url/' (NOT auto-generated)
post.data.permalink // → '/articles/custom-url/'
```

#### Example 4: Existing Values Preserved

**File:** `content/blog/featured.md`
```markdown
---
title: Featured Post
draft: true
tags: [featured, important]
visibility: private
---

Content here...
```

**Result in template:**
```javascript
post.url // → '/blog/featured/'
post.data.title // → 'Featured Post' (NOT overwritten)
post.data.draft // → true (NOT overwritten)
post.data.tags // → [featured, important] (NOT overwritten)
post.data.visibility // → 'private' (NOT overwritten)
post.data.author // → 'Your Name' (default applied)
```

### Advanced Configuration

#### Complex Default Objects

```javascript
frontmatterDefaults: {
  metadata: {
    version: '1.0',
    status: 'published'
  },
  seo: {
    robots: 'index, follow',
    canonical: null
  }
}
```

#### Custom Permalink Patterns (via frontmatter)

You can override the auto-generated permalink on a per-file basis:

```markdown
---
title: My Post
permalink: /custom/path/to/post/
---
```

### Plugin Order

The frontmatter defaults plugin runs in this order:

1. **remarkTags** - Extract and process frontmatter tags
2. **remarkStandard** - Standard markdown enhancements
3. **remarkEscapeCode** - Escape code blocks
4. **remarkFixDates** - Normalize date fields
5. **remarkFrontmatterDefaults** ← **Applies defaults & generates permalinks here**
6. **remarkBacklinks** - Generate bidirectional backlinks
7. **remarkObsidianLinks** - Convert wikilinks
8. **remarkSyntax** - Syntax highlighting (must run last)

This order ensures that:
- Permalinks are available before backlinks are generated
- Date normalization happens before defaults
- All metadata is ready for subsequent plugins
- Syntax highlighting runs last without interference

### Accessing Data in Templates

#### In Astro Components

```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('docs');
---

<nav>
  {posts.map(post => (
    <a href={post.url}>
      {post.data.title}  {/* Auto-generated if not in frontmatter */}
    </a>
  ))}
</nav>
```

#### In Backlinks

```astro
---
const { backlinks = [] } = Astro.props;
---

{backlinks.map(link => (
  <a href={link.url}>
    {link.title}
  </a>
))}
```

### Debugging

Enable verbose logging to see which defaults and permalinks are being applied:

```javascript
// astro.config.mjs
standard({
  frontmatterDefaults: { /* ... */ },
  verbose: true  // ← Enable debug output
})
```

**Console output example:**
```
[standard/frontmatter-defaults] Applied defaults to "blog/my-post.md":
{
  title: 'My Post',
  visibility: 'public',
  draft: false,
  tags: [],
  author: 'Your Name',
  permalink: '/blog/my-post/'
}
```

### Title Generation Rules

The `generateTitleFromFilename()` function follows these rules:

1. **Kebab-case to Title Case:** `my-post` → `My Post`
2. **Skip index files:** `index.md` → *(no title generated)*
3. **Capitalize each word:** `getting-started` → `Getting Started`

Examples:
```
my-post.md → My Post
getting-started.md → Getting Started
about.md → About
index.md → (no title)
```

### Permalink Generation Rules

The `generatePermalinkFromFileId()` function follows these rules:

1. **Remove file extensions:** `.md` and `.mdx` are stripped
2. **Handle index files:** `docs/index.md` → `/docs/`
3. **Root index:** `index.md` → `/`
4. **Add slashes:** Ensures leading `/` and trailing `/`

Examples:
```
blog/my-post.md → /blog/my-post/
docs/index.md → /docs/
index.md → /
pages/about.md → /pages/about/
```

### Deep Clone Behavior

Arrays and objects are deep cloned to prevent reference issues:

```javascript
// Configuration
frontmatterDefaults: {
  tags: ['default'],
  metadata: { version: '1.0' }
}

// File 1 gets: tags: ['default'], metadata: { version: '1.0' }
// (separate copy, not shared reference)

// File 2 gets: tags: ['default'], metadata: { version: '1.0' }
// (separate copy, not shared reference)

// Modifying one file's tags won't affect another
```

### API Reference

```javascript
/**
 * @param {Object} options - Configuration options
 * @param {Object} options.defaults - Key-value pairs of default values
 * @param {boolean} options.verbose - Enable debug logging (default: false)
 * @returns {Function} Remark plugin function
 */
export default function remarkFrontmatterDefaults(options = {})

// Internal functions (used automatically)
function generateTitleFromFilename(file) // Converts filename to Title Case
function generatePermalinkFromFileId(file) // Converts file path to URL
```

### Common Patterns

#### Pattern 1: Blog with Metadata

```javascript
frontmatterDefaults: {
  layout: 'blog-post',
  draft: false,
  featured: false,
  tags: [],
  category: 'general',
  author: 'Your Name'
  // permalink auto-generated from file path
}
```

#### Pattern 2: Documentation

```javascript
frontmatterDefaults: {
  layout: 'doc',
  toc: true,
  sidebar: true,
  draft: false,
  difficulty: 'beginner'
  // permalink auto-generated from file path
}
```

#### Pattern 3: Portfolio/Projects

```javascript
frontmatterDefaults: {
  layout: 'project',
  featured: false,
  status: 'completed',
  tags: [],
  client: null,
  year: new Date().getFullYear()
  // permalink auto-generated from file path
}
```

### Troubleshooting

**Q: URLs aren't being generated correctly**
- A: Check that `frontmatterDefaults` is configured in your integration options
- Ensure the plugin is enabled (it is by default)
- Check console for verbose logging

**Q: Custom permalinks aren't working**
- A: Make sure you set `permalink` in frontmatter before the remark plugin runs
- The plugin only generates permalinks if the field is missing

**Q: Backlinks don't have URLs**
- A: Backlinks are separate objects. Use `post.url` from collection entries instead
- Or ensure backlink objects have a `url` property set

**Q: Plugin runs in wrong order**
- A: The order is fixed in `standard-remark.js`. Don't reorder plugins manually

### Performance

The plugin is highly optimized:
- O(n) complexity where n = number of default fields
- Only processes frontmatter metadata, not content
- Deep cloning only happens for objects/arrays
- Minimal memory overhead
- Permalink generation is a simple string transformation

### Related Plugins

- `remarkFixDates` - Normalize date formats
- `remarkTags` - Extract and process tags
- `remarkBacklinks` - Generate bidirectional links
- `remarkObsidianLinks` - Convert wikilinks

### License

MIT - Same as Standard Framework
