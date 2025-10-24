---
layout: base.njk
title: GitHub Comments System
description: Serverless comments system that stores each comment as a file in GitHub
eleventyNavigation:
  key: Comments System
  parent: Cloudflare
---

# GitHub Comments System

A production-ready, serverless comments system for Cloudflare that stores each comment as a JSON file directly in your GitHub repository.

## Quick Navigation

- **[Quick Start](./COMMENTS-QUICK-START.md)** — 10-minute setup guide
- **[Full Guide](./COMMENTS-GUIDE.md)** — Complete documentation
- **[File Reference](./COMMENTS-FILES.md)** — File directory and details
- **[HTML Template](./comments-template.html)** — Ready-to-use form HTML

## How It Works

```
User submits comment on page with URL /blog/my-post/
    ↓
Page URL normalized to "blog--my-post" (safe file path)
    ↓
Cloudflare validates & sanitizes
    ↓
Spam detection checks
    ↓
Comment stored as Markdown file in GitHub
    ↓
Browser fetches & renders with threading
```

## Page ID System

Comments are associated with **page URLs** (not filenames):

- **URL**: `/blog/my-post/` → **Page ID**: `blog--my-post`
- **URL**: `/about/` → **Page ID**: `about`
- **URL**: `/` → **Page ID**: `index`
- **URL**: `/blog/2024/article/` → **Page ID**: `blog--2024--article`

**Why URLs?** This ensures comments follow the content if you rename files but keep URLs stable via permalinks.

## Key Features

✅ **Own Your Data** — Comments stored in GitHub, not third-party services
✅ **Spam Detection** — Automatic detection with configurable thresholds
✅ **Moderation** — Email alerts + approval workflow
✅ **Nested Replies** — Threaded comments with visual hierarchy
✅ **Markdown** — Support for **bold**, *italic*, `code`, [links](url)
✅ **Zero Dependencies** — Pure JavaScript, no npm packages
✅ **Responsive** — Mobile-friendly design
✅ **XSS Safe** — HTML sanitization + entity encoding

## Files Included

**Source Code** (in `src/cloudflare/`):
- `comments.js` — Server-side handler (400 lines)
- `comments-client.js` — Browser library (350 lines)
- `comments-example.js` — Ready-to-deploy endpoint
- `wrangler-comments.toml.template` — Cloudflare config

**Documentation** (in `content/cloudflare/comments/`):
- `COMMENTS-QUICK-START.md` — 10-minute setup
- `COMMENTS-GUIDE.md` — Complete documentation
- `COMMENTS-FILES.md` — File reference
- `comments-template.html` — HTML + CSS template

## 3-Minute Overview

### 1. GitHub Setup
```bash
# Generate personal access token (repo scope)
# https://github.com/settings/tokens

# Create comments directory
mkdir data/comments
git add data/comments/.gitkeep
git commit -m "Add comments directory"
git push
```

### 2. Cloudflare Deployment
```bash
# Deploy comments function
wrangler publish --env production

# Set GitHub token
wrangler secret put GITHUB_TOKEN --env production
```

### 3. Frontend Integration
```html
<!-- Add to your page -->
<div id="comments"></div>
<form id="comment-form">
  <input type="text" name="author" placeholder="Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="content" placeholder="Comment" required></textarea>
  <button type="submit">Post</button>
</form>

<script src="/path/to/comments-client.js"></script>
<script>
  const comments = new GitHubComments({
    apiUrl: '/api/comments',
    pageId: 'blog/my-post',
    container: '#comments',
    form: '#comment-form'
  });
  comments.load().then(() => comments.render());
  comments.attachFormHandler();
</script>
```

## File Structure

After deployment, your repo will have:

```
data/comments/
├── blog--my-post/
│   ├── 1729609945000-a7x9k2m1.md
│   ├── 1729609967000-b4z2k9p3.md
│   └── 1729610005000-c8m5l1q7.md
├── about/
│   └── 1729610045000-e9m2k7p5.md
└── index/
    └── 1729610100000-d2m8k4r9.md
```

**Note**: Directory names use normalized page IDs (slashes replaced with `--`).

Each comment: ~500-1000 bytes (small, git-friendly)

## API Endpoints

### POST /api/comments
Submit a new comment

```json
{
  "pageId": "blog--my-post",
  "author": "John Doe",
  "email": "john@example.com",
  "content": "Great article!",
  "parentId": null
}
```

**Note**: `pageId` should be normalized (e.g., `blog--my-post` not `blog/my-post`). The `{% standardComment %}` shortcode handles this automatically.

### GET /api/comments?pageId=blog--my-post
Fetch all comments for a page

```json
{
  "pageId": "blog--my-post",
  "count": 3,
  "comments": [...]
}
```

## Configuration

### 11ty Plugin Configuration

Configure the comments system in your `eleventy.config.js`:

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    comments: {
      enabled: true,
      apiEndpoint: "/api/comments",
      commentsPath: "data/comments"  // ← Configurable GitHub storage path
    }
  });
}
```

**Options**:
- `enabled` (boolean) — Enable/disable comments system
- `apiEndpoint` (string) — API endpoint path (default: `/api/comments`)
- `commentsPath` (string) — GitHub storage path (default: `data/comments`)

### Cloudflare Environment Variables

Required environment variables:
- `GITHUB_TOKEN` — Personal access token with repo write access
- `GITHUB_OWNER` — Your GitHub username
- `GITHUB_REPO` — Repository name
- `GITHUB_COMMENTS_PATH` — Path for comments (default: `data/comments`, must match `commentsPath` above)

Optional:
- `MODERATION_EMAIL` — Email for spam alerts
- `SPAM_CHECK_ENABLED` — Enable spam detection (default: true)

**Example**: To store comments in `comments/` instead of `data/comments/`:
1. Set `commentsPath: "comments"` in your 11ty config
2. Set `GITHUB_COMMENTS_PATH=comments` in Cloudflare environment variables
3. Create `comments/` directory in your GitHub repo

## Use Cases

Perfect for:
- 📝 Static site blogs (11ty, Hugo, Jekyll)
- 📚 Documentation sites
- 🎨 Portfolio projects
- 📰 News/announcement boards
- 💡 Product feedback
- 🗨️ Community discussions

## Security

✅ HTML sanitization (removes XSS)
✅ Email validation
✅ GitHub token in secrets (never exposed)
✅ Spam detection with confidence scoring
✅ Rate limiting support
✅ Moderation approval workflow

## Next Steps

1. **[Start with Quick Start Guide](./COMMENTS-QUICK-START.md)** (10 minutes)
2. Set up GitHub personal access token
3. Deploy to Cloudflare
4. Add HTML form to your page
5. Test comment submission
6. Monitor moderation queue

## Advantages

**vs. Third-party Services** (Disqus, Commento):
- ✅ Own your data
- ✅ No external dependencies
- ✅ Free (uses existing services)
- ✅ Full control & transparency
- ✅ Built-in GitHub workflow

**vs. Database Solutions** (MongoDB, PostgreSQL):
- ✅ No database maintenance
- ✅ Version control & history (git)
- ✅ GitHub moderation interface
- ✅ Automatic scaling
- ✅ Built-in backups

## Breaking Changes (v0.10.53+)

### Page IDs Now Use `page.url` (Not `page.fileSlug`)

Comments are now associated with **page URLs** instead of **file names**.

**Why?** This ensures comments follow the content if you rename files but keep URLs stable via permalinks.

**Migration**: Not backward compatible. If you have existing comments from earlier versions, they used `page.fileSlug`. The system won't automatically find them with the new URL-based IDs.

**Options**:
1. **Accept fresh start** — Existing comments stay in old directories (won't display), new comments use new structure
2. **Don't upgrade** — Stay on earlier version if you have existing comments you want to keep
3. **Manual migration** — Rename directories to match new URL-based IDs (see below)

### Configurable Comments Path

The comments storage path is now configurable (previously hardcoded to `data/comments`).

**What Changed**:
- **Before**: Always `data/comments/`
- **After**: Configurable via `commentsPath` option (default: `data/comments`)

**Action Required**: Set `GITHUB_COMMENTS_PATH` environment variable in Cloudflare to match your chosen path.

## Troubleshooting

**Comments not appearing?**
- Check Cloudflare function logs: `wrangler tail --env production`
- Verify GitHub token has `repo` scope
- Confirm `GITHUB_COMMENTS_PATH` exists
- Verify `pageId` is normalized (use browser console to check)

**GitHub 401 Unauthorized?**
- Token expired or incorrect
- Regenerate token with proper scope

**Spam too aggressive?**
- Adjust detection in `comments.js`
- Lower confidence threshold
- Disable: `SPAM_CHECK_ENABLED = "false"`

**Wrong pageId?**
- Check browser console for actual `pageId` value
- Should be normalized (e.g., `blog--my-post` not `blog/my-post`)
- If manual integration, ensure you normalize URLs yourself

See [COMMENTS-GUIDE.md](./COMMENTS-GUIDE.md) for more troubleshooting.

## Statistics

- **Total Size**: ~65 KB (all files)
- **Code**: ~800 lines
- **Documentation**: ~900 lines
- **Dependencies**: 0 (zero!)
- **Browser Support**: All modern browsers (ES6+)

## See Also

- [Cloudflare Workers](../index.md) — General Cloudflare setup
- [Utilities](./../../css/utilities.md) — CSS utilities for styling comments
- [Standard Framework](./../../index.md) — Main framework documentation

---

**Version**: 0.10.53
**Status**: ✅ Production Ready
**Last Updated**: October 2024
