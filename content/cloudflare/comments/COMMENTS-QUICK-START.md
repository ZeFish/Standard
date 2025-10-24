# GitHub Comments System - Quick Start

Deploy a fully-functional comments system in 10 minutes.

## Files Included

**Source Code** (`src/cloudflare/`):
- `comments.js` — Server-side handler (core logic)
- `standard.comment.js` — Client-side library (rendering)
- `comments-example.js` — Ready-to-deploy function handler
- `wrangler-comments.toml.template` — Cloudflare config template
- `utils.js` — Shared utilities

**Templates** (`src/layouts/`):
- `comments.njk` — Ready-to-use Nunjucks layout template

**Documentation** (`content/cloudflare/comments/`):
- `COMMENTS-GUIDE.md` — Full documentation
- `COMMENTS-QUICK-START.md` — This file
- `COMMENTS-FILES.md` — File reference
- `index.md` — Overview

## Setup (10 minutes)

### Step 1: Enable Cloudflare in Standard Plugin (1 min)

Update your `eleventy.config.js`:

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    cloudflare: { enabled: true }
  });
}
```

This automatically:
- ✅ Enables the comments system (comments require Cloudflare Functions backend)
- ✅ Copies comments handler to `functions/api/comments.js`
- ✅ Copies client library to `assets/standard/standard.comment.js`
- ✅ Generates `wrangler.toml` from your `.env` file on build

### Step 2: Create .env File (1 min)

Create a `.env` file in your project root:

```bash
# .env
PROJECT_NAME=my-site
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repository-name
GITHUB_COMMENTS_PATH=data/comments
GITHUB_TOKEN=ghp_your_token_here
DOMAIN=example.com
CLOUDFLARE_ZONE_ID=your-zone-id
CLOUDFLARE_ACCOUNT_ID=your-account-id
MODERATION_EMAIL=admin@example.com
```

**Add to .gitignore** (to keep secrets safe):
```bash
echo ".env" >> .gitignore
```

The plugin will automatically read this file and generate `wrangler.toml` during your build!

### Step 2.5: GitHub Setup (Optional)

If you haven't already, create the comments directory in your repo:

```bash
mkdir data/comments
touch data/comments/.gitkeep
git add data/comments/.gitkeep
git commit -m "Add comments directory"
git push
```

(GitHub will auto-create it on first comment if you skip this)

### Step 3: Get Your Cloudflare Credentials (2 min)

```bash
# Get your Cloudflare account ID
wrangler whoami

# Or get it from: https://dash.cloudflare.com/profile/api-tokens
# Find your Account ID in the right sidebar
```

Update your `.env` file with:
- `CLOUDFLARE_ACCOUNT_ID` - From above
- `CLOUDFLARE_ZONE_ID` - From your domain's DNS settings (if using custom domain)
- `DOMAIN` - Your actual domain (e.g., example.com)

### Step 4: Create GitHub Personal Access Token (1 min)

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: `Standard Comments`
4. **Scopes:** Check `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** and add to your `.env`:
   ```bash
   GITHUB_TOKEN=ghp_your_token_here
   ```

### Step 5: Deploy to Cloudflare (1 min)

```bash
# Set production secrets
wrangler secret put GITHUB_TOKEN --env production
wrangler secret put MODERATION_EMAIL --env production
wrangler secret put GITHUB_WEBHOOK_SECRET --env production

# Deploy
wrangler publish --env production
```

The `wrangler.toml` is automatically generated from your `.env` file!

### Step 6: Add Comments to Your Pages (1 min)

**Option 1: Use Comments Layout (Easiest)**

In your article/blog template:

```nunjucks
---
layout: comments.njk
comment: true
---

# Your Article Content
```

This automatically includes the full comments section with form and styling. The page ID is auto-generated from your file slug.

**Option 2: Use Comments Layout with Options**

```nunjucks
---
layout: comments.njk
comment: true
commentApiUrl: /api/comments
showCommentForm: true
pollInterval: 30000
---
```

**Option 3: Use standardComment Shortcode**

Include the `standardComment` shortcode in your custom layout:

```nunjucks
---
layout: base.njk
comment: true
---

{% standardComment %}
```

The shortcode automatically creates the comments container and form!

The `standardComment` shortcode automatically:
- ✅ Renders semantic HTML with fieldset, legend, proper labels
- ✅ Auto-initializes when `comment: true` is in frontmatter
- ✅ Loads and displays existing comments (auto-generated page ID from file slug)
- ✅ Handles form submission
- ✅ Integrates with Standard design tokens
- ✅ Includes error handling

Customize with options:
```nunjucks
<!-- Hide reset button -->
{% standardComment true, false %}

<!-- Hide submit button -->
{% standardComment false, true %}
```

**Option 4: Include as Partial**

```nunjucks
{% set commentPageId = page.fileSlug %}
{% include "comments.njk" %}
```

**Option 5: Manual Setup**

```html
<!-- Add form to your page -->
<div id="comments"></div>
<form id="comment-form">
  <input type="text" name="author" placeholder="Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="content" placeholder="Comment" required></textarea>
  <button type="submit">Post</button>
</form>

<!-- Include scripts -->
<script src="/assets/standard/standard.comment.js"></script>
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

### Step 7: Test & Deploy (2 min)

1. Build and run locally: `npm run build && npm start`
2. Submit a test comment on your site
3. Check GitHub repo: `data/comments/blog/my-post/`
4. Should see a `.json` file with your comment
5. Comment appears on page after refresh
6. Deploy: `wrangler publish --env production`

## Minimal Example

```nunjucks
---
layout: comments.njk
comment: true
---

# Your Article Content Here
```

That's it! Just set `comment: true` in your frontmatter and use the `comments.njk` layout. Everything works automatically:
- ✅ Semantic form with fieldset, legend, labels
- ✅ Comments container
- ✅ Auto-initialized comments loading (page ID from file slug)
- ✅ Form submission handling
- ✅ Error handling

Or if you prefer to build your own layout:

```nunjucks
---
layout: base.njk
comment: true
---

<div id="comments"></div>
{% standardComment %}
```

Just set `comment: true` in your frontmatter and the shortcode handles the rest!

## Shortcodes Reference

Standard provides a powerful shortcode for comments that handles everything:

### `{% standardComment %}`

Renders a semantic HTML comment form AND automatically initializes the comments system.

**Usage:**
```nunjucks
{% standardComment %}
```

The shortcode automatically detects `comment: true` from your frontmatter and initializes comments. No separate initialization needed!

**Parameters:**
- `showSubmit` (boolean, default: `true`) - Show submit button
- `showReset` (boolean, default: `true`) - Show reset button

**Example:**
```nunjucks
<!-- Hide reset button -->
{% standardComment true, false %}

<!-- Hide submit button -->
{% standardComment false, true %}
```

**Auto-initialization (Frontmatter):**
The shortcode reads from your frontmatter:
- `comment: true` - Enable comments (page ID auto-generated from file slug)
- `commentApiUrl` - API endpoint (default: `/api/comments`)
- `pollInterval` - Auto-refresh interval in ms

**Features:**
- ✅ Semantic HTML: `<fieldset>`, `<legend>`, proper `<label>` associations
- ✅ Accessible: ARIA labels for required fields
- ✅ Design tokens: Uses Standard CSS variables for consistent styling
- ✅ Auto-initializes: No separate initialization shortcode needed
- ✅ Loads comments: Automatically fetches from GitHub
- ✅ Handles submission: Form submission is automatic
- ✅ Error handling: User-friendly error messages
- ✅ Privacy notice: Linked to your privacy and terms pages
- ✅ Responsive: Works on mobile and desktop

### `{% initComments %}` (Optional)

For advanced use cases where you need manual initialization with custom options.

**Usage:**
```nunjucks
{% initComments "blog/my-post" %}
```

**Parameters:**
- `pageId` (string, required) - Unique identifier for the page
- `apiUrl` (string, default: `/api/comments`) - API endpoint
- `container` (string, default: `#comments`) - Comments container selector
- `form` (string, default: `#comment-form`) - Form element selector
- `pollInterval` (number, default: `null`) - Auto-refresh interval in ms

**Note:** You only need this if you're NOT using `commentForm`, or if you need custom container selectors.

## Environment Variables

```toml
# Required
GITHUB_TOKEN = "ghp_xxxxx..."           # Personal access token
GITHUB_OWNER = "your-username"           # GitHub username or org
GITHUB_REPO = "your-repo-name"           # Repo name where comments go
GITHUB_COMMENTS_PATH = "data/comments"   # Path in repo for comments

# Optional
MODERATION_EMAIL = "you@example.com"     # Email for moderation alerts
SPAM_CHECK_ENABLED = "true"              # Enable spam detection (default: true)
```

## Key Features

✅ **Comments as Files** — Each comment = JSON file in GitHub
✅ **Spam Detection** — Automatic flagging of suspicious comments
✅ **Moderation** — Email alerts for flagged comments
✅ **Threading** — Nested/reply comments with visual hierarchy
✅ **Markdown** — Support for **bold**, *italic*, `code`, [links](url)
✅ **Responsive** — Works on mobile and desktop
✅ **Caching** — Efficient comment storage and retrieval
✅ **CORS** — Ready for cross-domain requests

## File Structure After Setup

```
your-repo/
├── data/
│   └── comments/
│       └── blog/
│           └── my-post/
│               ├── 1729609945000-a7x9k2m1.json
│               ├── 1729609967000-b4z2k9p3.json
│               └── 1729610005000-c8m5l1q7.json
├── functions/
│   └── api/
│       └── comments.js
└── wrangler.toml
```

## Comment JSON Format

```json
{
  "id": "1729609945000-a7x9k2m1",
  "pageId": "blog/my-post",
  "author": "John Doe",
  "email": "john@example.com",
  "content": "Great post!",
  "parentId": null,
  "createdAt": "2024-10-22T15:32:25.000Z",
  "approved": false,
  "spam": false,
  "spamReasons": [],
  "spamConfidence": 0.1
}
```

## Common Issues

### GitHub 401 Unauthorized
- Token expired or incorrect
- Token doesn't have `repo` scope
- **Fix**: Generate new token with proper scope

### GitHub 404 Not Found
- `GITHUB_OWNER` or `GITHUB_REPO` incorrect
- `data/comments` directory doesn't exist
- **Fix**: Verify settings and create directory

### Comments not appearing
- Check function logs: `wrangler tail --env production`
- Verify CORS headers in response
- Check browser console for errors
- **Fix**: Review logs and test API endpoint directly

### Spam detection too aggressive
- Adjust `spamKeywords` in `comments.js`
- Lower spam confidence threshold
- Disable spam check: `SPAM_CHECK_ENABLED = "false"`

## API Endpoints

### POST /api/comments
Submit a comment
```bash
curl -X POST https://your-domain/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "pageId": "blog/my-post",
    "author": "John",
    "email": "john@example.com",
    "content": "Great post!",
    "parentId": null
  }'
```

### GET /api/comments?pageId=...
Fetch comments for a page
```bash
curl https://your-domain/api/comments?pageId=blog/my-post
```

## Moderation

1. **Monitor**: Check email for moderation alerts
2. **Review**: Go to GitHub repo, find comment JSON file
3. **Approve**:
   - Edit JSON file
   - Change `"approved": false` to `"approved": true`
   - Save commit
4. **Delete**:
   - Delete JSON file
   - Commit deletion

## Advanced Features

### Enable Real-time Updates
```javascript
const comments = new GitHubComments({
  pollInterval: 30000, // Check every 30 seconds
});
comments.startPolling();
```

### Custom Spam Keywords
Edit `detectSpam()` in `comments.js`:
```javascript
const spamKeywords = [
  "viagra", "casino", "custom-word", // Add yours
];
```

### Rate Limiting
Add Cloudflare rate limiting to `wrangler.toml`:
```toml
[env.production]
routes = [
  { pattern = "example.com/api/comments", zone_name = "example.com", custom_domain = true }
]
```

### Email Notifications
Integrate SendGrid or Mailgun in `sendModerationEmail()`:
```javascript
async function sendModerationEmail(comment, spamDetection, env) {
  await fetch("https://api.sendgrid.com/v3/mail/send", {
    // ... SendGrid config
  });
}
```

## Full Documentation

For complete docs, examples, and advanced features:
→ See `COMMENTS-GUIDE.md`

## Next Steps

1. ✅ Deploy comments system
2. ✅ Test comment submission
3. ⭐ Add to multiple pages
4. 📧 Configure moderation emails
5. 🔧 Customize spam detection
6. 🎨 Style comments section

## Support

- GitHub Issues: Report bugs
- Pull Requests: Contribute improvements
- Discussions: Ask questions

## Files Reference

| File | Purpose |
|------|---------|
| `comments.js` | Server handler, validation, GitHub API |
| `standard.comment.js` | Browser library, rendering, form |
| `comments-example.js` | Ready-to-deploy endpoint |
| `comments-template.html` | HTML + CSS template |
| `wrangler-comments.toml.template` | Cloudflare config |
| `COMMENTS-GUIDE.md` | Complete documentation |
| `COMMENTS-QUICK-START.md` | This file |

Happy commenting! 🎉
