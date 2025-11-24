# Comments System - Usage Patterns

Different ways to import and use the comments system alongside Standard Framework.

## Pattern 1: Comments Only (Standalone)

Use just the comments system without other Standard Framework features.

```javascript
// eleventy.config.js
import CommentsPlugin from "@zefish/standard/src/cloudflare/comments-plugin.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(CommentsPlugin, {
    outputDir: "functions/api",
    copyClientLibrary: true,
  });
}
```

**Use Case**: You want comments but don't need typography, grid, or other Standard features.

**Result**:
- ✅ Comments handler copied to `functions/api/comments.js`
- ✅ Client library copied to `assets/js/standard.comment.js`
- ✅ Configuration template copied


## Pattern 2: Standard + Comments Together

Use both the main Standard Framework and comments system.

```javascript
// eleventy.config.js
import Standard from "@zefish/standard";
import CommentsPlugin from "@zefish/standard/src/cloudflare/comments-plugin.js";

export default function (eleventyConfig) {
  // Main framework (typography, grid, CSS, JS)
  eleventyConfig.addPlugin(Standard, {
    outputDir: "assets/standard",
    copyFiles: true,
  });

  // Comments system (separate endpoint)
  eleventyConfig.addPlugin(CommentsPlugin, {
    outputDir: "functions/api",
    copyClientLibrary: true,
  });
}
```

**Use Case**: You want typography + comments. Perfect for blogs.

**Result**:
- ✅ Standard CSS/JS in `assets/standard/`
- ✅ Comments handler in `functions/api/comments.js`
- ✅ Comments client in `assets/js/standard.comment.js`
- ✅ Both plugins work independently


## Pattern 3: Standard + Comments + Custom Cloudflare Functions

Use Standard Framework, comments, plus your own custom functions.

```javascript
// eleventy.config.js
import Standard from "@zefish/standard";
import CloudflarePlugin from "@zefish/standard/src/eleventy/cloudflare.js";
import CommentsPlugin from "@zefish/standard/src/cloudflare/comments-plugin.js";

export default function (eleventyConfig) {
  // Main framework
  eleventyConfig.addPlugin(Standard);

  // All Cloudflare functions (copies entire src/cloudflare/ directory)
  eleventyConfig.addPlugin(CloudflarePlugin, {
    outputDir: "functions",
    environment: "production",
  });

  // Comments as separate plugin for finer control
  eleventyConfig.addPlugin(CommentsPlugin, {
    outputDir: "functions/api",
    copyClientLibrary: true,
  });
}
```

**Use Case**: You need comments + your own serverless functions.

**Result**:
- ✅ All functions in `functions/`
- ✅ Comments handler in `functions/api/comments.js`
- ✅ Your custom functions in `functions/` as well
- ✅ Full control over Cloudflare setup


## Pattern 4: Conditional Comments (Feature Flag)

Enable/disable comments based on environment.

```javascript
// eleventy.config.js
import Standard from "@zefish/standard";
import CommentsPlugin from "@zefish/standard/src/cloudflare/comments-plugin.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard);

  // Only add comments in production
  if (process.env.ELEVENTY_ENV === "production") {
    eleventyConfig.addPlugin(CommentsPlugin, {
      outputDir: "functions/api",
    });
  } else {
    console.log("[Comments] Disabled in development");
  }
}
```

**Use Case**: Comments only on production, not on dev/staging.

**Result**:
- ✅ Comments only deployed to production
- ✅ Dev/staging builds skip comments overhead
- ✅ Easy to toggle on/off


## Pattern 5: Comments + Multiple Cloudflare Endpoints

Use comments with other custom Cloudflare functions.

```javascript
// eleventy.config.js
import Standard from "@zefish/standard";
import CommentsPlugin from "@zefish/standard/src/cloudflare/comments-plugin.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard);

  // Comments system
  eleventyConfig.addPlugin(CommentsPlugin, {
    outputDir: "functions/api",
    copyClientLibrary: true,
  });

  // Your custom functions in separate directory
  eleventyConfig.addPassthroughCopy({
    "src/functions/**/*.js": "functions/",
  });
}
```

**File Structure**:
```
functions/
├── api/
│   ├── comments.js     (from CommentsPlugin)
│   └── utils.js        (from CommentsPlugin)
├── auth.js             (your custom)
├── analytics.js        (your custom)
└── webhook.js          (your custom)
```


## Pattern 6: Comments on Specific Pages Only

Use comments selectively on certain pages.

```html
<!-- article.njk - only on articles -->
<article>
  

  {% if page.url.includes("/blog/") or page.url.includes("/articles/") %}
    <div id="comments"></div>
    <form id="comment-form">
      <!-- form here -->
    </form>

    <script src="/assets/js/standard.comment.js"></script>
    <script>
      const comments = new GitHubComments({
        apiUrl: '/api/comments',
        pageId: page.fileSlug,
        container: '#comments',
        form: '#comment-form'
      });
      comments.load().then(() => comments.render());
      comments.attachFormHandler();
    </script>
  
</article>
```

**Use Case**: Comments on blog posts, but not on homepage or documentation.

**Result**:
- ✅ Comments loaded dynamically only where needed
- ✅ Faster page loads on non-comment pages
- ✅ Reduced JavaScript overhead


## Pattern 7: Custom Comments Endpoint Handler

Create your own comments handler while reusing the client library.

```javascript
// eleventy.config.js
import Standard from "@zefish/standard";
import CommentsPlugin from "@zefish/standard/src/cloudflare/comments-plugin.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard);

  // Only copy client library, not the handler
  eleventyConfig.addPlugin(CommentsPlugin, {
    outputDir: "functions/api",
    copyClientLibrary: true,
    // These would require exposing as options:
    // copyHandler: false,
    // copyConfig: false,
  });

  // Use your own handler
  eleventyConfig.addPassthroughCopy({
    "src/my-comments-handler.js": "functions/api/comments.js",
  });
}
```

**Use Case**: You want to customize the comments handler behavior.

**Result**:
- ✅ Use standard client library
- ✅ Custom server-side logic
- ✅ Full control over validation/spam detection


## Import Reference

### Main Framework
```javascript
import Standard from "@zefish/standard";
```

### Cloudflare Plugin (all functions)
```javascript
import CloudflarePlugin from "@zefish/standard/src/eleventy/cloudflare.js";
```

### Comments Plugin (comments only)
```javascript
import CommentsPlugin from "@zefish/standard/src/cloudflare/comments-plugin.js";
```

### Direct Imports (for custom setup)
```javascript
// Server-side handler
import { handleComments } from "@zefish/standard/src/cloudflare/comments.js";

// Browser library
import GitHubComments from "@zefish/standard/src/cloudflare/standard.comment.js";

// Utilities
import { createResponse, parseRequest } from "@zefish/standard/src/cloudflare/utils.js";
```


## Recommended Patterns

### 🎯 For Blogs/Documentation
```javascript
import Standard from "@zefish/standard";
import CommentsPlugin from "@zefish/standard/src/cloudflare/comments-plugin.js";

eleventyConfig.addPlugin(Standard);
eleventyConfig.addPlugin(CommentsPlugin);
```

### 🎯 For Minimal Sites
```javascript
import CommentsPlugin from "@zefish/standard/src/cloudflare/comments-plugin.js";

eleventyConfig.addPlugin(CommentsPlugin);
```

### 🎯 For API-Heavy Sites
```javascript
import Standard from "@zefish/standard";
import CloudflarePlugin from "@zefish/standard/src/eleventy/cloudflare.js";

eleventyConfig.addPlugin(Standard);
eleventyConfig.addPlugin(CloudflarePlugin);
```

### 🎯 For Everything
```javascript
import Standard from "@zefish/standard";
import CloudflarePlugin from "@zefish/standard/src/eleventy/cloudflare.js";
import CommentsPlugin from "@zefish/standard/src/cloudflare/comments-plugin.js";

eleventyConfig.addPlugin(Standard);
eleventyConfig.addPlugin(CloudflarePlugin);
eleventyConfig.addPlugin(CommentsPlugin);
```


## Configuration Examples

### Production Setup
```javascript
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard);

  eleventyConfig.addPlugin(CommentsPlugin, {
    outputDir: "functions/api",
    copyClientLibrary: true,
    copyTemplate: false, // Don't need template in production
  });
}
```

### Development Setup
```javascript
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard);

  if (process.env.ELEVENTY_ENV === "production") {
    eleventyConfig.addPlugin(CommentsPlugin);
  }
}
```

### Monorepo Setup (multiple sites)
```javascript
export default function (eleventyConfig) {
  const siteType = process.env.SITE_TYPE || "blog";

  // Always include base framework
  eleventyConfig.addPlugin(Standard);

  // Conditionally add comments
  if (siteType === "blog" || siteType === "full") {
    eleventyConfig.addPlugin(CommentsPlugin);
  }
}
```


## Troubleshooting

**Q: Can I use Standard and Comments together?**
A: Yes! Use Pattern 2. They're designed to work together.

**Q: Do I need Standard for comments?**
A: No! Use Pattern 1. Comments work standalone.

**Q: How do I add custom functions?**
A: Use Pattern 5. Copy your functions to a separate directory.

**Q: Can I disable comments in development?**
A: Yes! Use Pattern 4 with environment checks.

**Q: How do I use just the client library?**
A: Import directly: `import GitHubComments from "@zefish/standard/src/cloudflare/standard.comment.js"`


## See Also

- [Comments Quick Start](./COMMENTS-QUICK-START.md)
- [Comments Guide](./COMMENTS-GUIDE.md)
- [Standard Framework](../../index.md)
- [Cloudflare Integration](../index.md)