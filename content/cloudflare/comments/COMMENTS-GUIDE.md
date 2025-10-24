# GitHub Comments System

A serverless comments system that stores each comment as a file in your GitHub repository. Perfect for static sites, blogs, and documentation that need user engagement without complex backends.

## How It Works

```
User submits comment via form
         ↓
Cloudflare Function validates & sanitizes
         ↓
Spam detection checks comment
         ↓
Comment stored as JSON file in GitHub
         ↓
Browser fetches comments and renders
```

**Key Features:**
- ✅ Each comment = 1 file in GitHub (easy to manage/review)
- ✅ Automatic spam detection with configurable thresholds
- ✅ Moderation workflow (approval before displaying)
- ✅ Nested/threaded comments support
- ✅ Email notifications for new comments
- ✅ Rate limiting per IP address
- ✅ Markdown and link support
- ✅ Mobile-friendly rendering

## Setup

### 1. GitHub Repository Setup

1. Create a directory for comments in your repo:
   ```bash
   mkdir data/comments
   ```

2. Create a Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (full control of repositories)
   - Copy the token (you'll need it for Cloudflare)

3. Commit the empty directory:
   ```bash
   git add data/comments/.gitkeep
   git commit -m "Add comments directory"
   git push
   ```

### 2. Cloudflare Configuration

1. Set environment variables in `wrangler.toml`:

   ```toml
   [env.production]
   vars = { SPAM_CHECK_ENABLED = "true" }

   [env.production.secrets]
   # Run: wrangler secret put GITHUB_TOKEN
   GITHUB_TOKEN = "your-personal-access-token"
   GITHUB_OWNER = "your-username-or-org"
   GITHUB_REPO = "your-repo-name"
   GITHUB_COMMENTS_PATH = "data/comments"
   MODERATION_EMAIL = "you@example.com"
   GITHUB_WEBHOOK_SECRET = "your-webhook-secret"
   ```

2. Add secrets to Cloudflare:
   ```bash
   wrangler secret put GITHUB_TOKEN
   wrangler secret put GITHUB_OWNER
   wrangler secret put GITHUB_REPO
   ```

3. Deploy function:
   ```bash
   wrangler publish --env production
   ```

### 3. Frontend Integration

Add the client library to your page:

```html
<!-- HTML form -->
<div id="comments-section">
  <h2>Comments</h2>
  <div id="comments"></div>

  <h3>Leave a Comment</h3>
  <form id="comment-form">
    <input
      type="text"
      name="author"
      placeholder="Your name"
      required
    />

    <input
      type="email"
      name="email"
      placeholder="Your email (not shown)"
      required
    />

    <textarea
      name="content"
      placeholder="Your comment (supports **bold**, *italic*, `code`, [links](url))"
      required
    ></textarea>

    <input type="hidden" name="parentId" value="" />

    <button type="submit">Post Comment</button>

    <div class="form-message"></div>
  </form>
</div>

<!-- Client library -->
<script src="/path/to/standard.comment.js"></script>

<script>
  const comments = new GitHubComments({
    apiUrl: "/api/comments",
    pageId: "blog/my-post",
    container: "#comments",
    form: "#comment-form",
    pollInterval: 30000, // Check for new comments every 30s (optional)
  });

  // Load and display comments
  comments.load().then(() => comments.render());

  // Attach form handler
  comments.attachFormHandler();

  // Optional: start polling for new comments
  comments.startPolling();
</script>
```

### 4. CSS Styling (Optional)

```css
/* Comment container */
.comment {
  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f9f9f9;
}

.comment[data-level="1"] {
  margin-left: 2rem;
}

.comment[data-level="2"] {
  margin-left: 4rem;
}

.comment[data-pending] {
  opacity: 0.6;
  border-color: #ffc107;
}

.comment[data-spam] {
  border-color: #dc3545;
  background: #fff5f5;
}

/* Comment header */
.comment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.comment-date {
  color: #888;
}

.comment-flag,
.comment-pending {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.comment-flag {
  background: #ffe5e5;
  color: #dc3545;
}

.comment-pending {
  background: #fff3cd;
  color: #856404;
}

/* Comment content */
.comment-content {
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.comment-content code {
  background: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.9em;
}

.comment-content pre {
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.comment-content a {
  color: #0066cc;
  text-decoration: underline;
}

/* Actions */
.comment-actions {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.comment-reply {
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.comment-reply:hover {
  color: #0052a3;
}

/* Form */
#comment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
}

#comment-form input,
#comment-form textarea {
  padding: 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
}

#comment-form textarea {
  min-height: 120px;
  resize: vertical;
}

#comment-form button {
  padding: 0.75rem 1.5rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

#comment-form button:hover {
  background: #0052a3;
}

#comment-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-message {
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
}

.form-message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.form-message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.comments-empty {
  color: #888;
  font-style: italic;
}
```

## Comment File Structure

Each comment is stored as a JSON file:

```
data/
  comments/
    blog/
      my-post/
        1729609945000-a7x9k2m1.json
        1729609967000-b4z2k9p3.json
        1729610005000-c8m5l1q7.json
```

Each file contains:

```json
{
  "id": "1729609945000-a7x9k2m1",
  "pageId": "blog/my-post",
  "author": "John Doe",
  "email": "john@example.com",
  "content": "Great article!",
  "parentId": null,
  "createdAt": "2024-10-22T15:32:25.000Z",
  "approved": false,
  "spam": false,
  "spamReasons": [],
  "spamConfidence": 0.1
}
```

## Moderation Workflow

### Automatic Spam Detection

The system automatically checks for:
- **All caps content** (>50% uppercase)
- **Multiple URLs** (>2 in one comment)
- **Spam keywords** (viagra, casino, lottery, etc.)
- **Repeated characters** (repeated letters indicate spam)
- **Short content with links** (classic spam pattern)

Comments exceeding spam threshold (confidence > 0.5) are:
1. Marked as `spam: true`
2. Not displayed on page
3. Email sent to moderator for review

### Moderation Review

1. Check comments in GitHub directly at `data/comments/`
2. Review flagged comments (look for `"spam": true`)
3. Either:
   - **Approve**: Change `"approved": true` and `"spam": false`
   - **Delete**: Remove the JSON file
   - **Ban IP**: Add to spam filter

### Email Notifications

When a comment is flagged for moderation, an email is sent to `MODERATION_EMAIL` with:
- Comment content
- Author information
- Spam detection reasons and confidence score
- Direct link to review in GitHub

## API Reference

### POST /api/comments

Submit a new comment.

**Request:**
```json
{
  "pageId": "blog/my-post",
  "author": "John Doe",
  "email": "john@example.com",
  "content": "Great article!",
  "parentId": null
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "comment": {
    "id": "1729609945000-a7x9k2m1",
    "pageId": "blog/my-post",
    "author": "John Doe",
    "email": "john@example.com",
    "content": "Great article!",
    "parentId": null,
    "createdAt": "2024-10-22T15:32:25.000Z",
    "approved": false,
    "spam": false
  }
}
```

### GET /api/comments?pageId=...

Fetch all comments for a page.

**Response:**
```json
{
  "pageId": "blog/my-post",
  "count": 3,
  "comments": [
    {
      "id": "1729609945000-a7x9k2m1",
      "pageId": "blog/my-post",
      "author": "John Doe",
      "email": "john@example.com",
      "content": "Great article!",
      "parentId": null,
      "createdAt": "2024-10-22T15:32:25.000Z",
      "approved": true,
      "spam": false
    }
  ]
}
```

### Error Responses

**Validation Error (400):**
```json
{
  "error": true,
  "message": "valid email is required; content is required",
  "status": 400,
  "timestamp": "2024-10-22T15:32:25.000Z"
}
```

**Spam Detected (500):**
```json
{
  "error": true,
  "message": "Comment flagged as spam and requires moderation",
  "status": 500,
  "timestamp": "2024-10-22T15:32:25.000Z"
}
```

## Advanced Usage

### Rate Limiting

Add rate limiting middleware to Cloudflare:

```javascript
async function rateLimit(request, env) {
  const ip = request.headers.get("cf-connecting-ip");
  const key = `ratelimit:${ip}`;

  // KV store check (requires Cloudflare KV)
  const count = await env.COMMENTS_KV.get(key) || 0;

  if (count > 5) {
    return createErrorResponse("Too many requests", 429);
  }

  await env.COMMENTS_KV.put(key, count + 1, { expirationTtl: 3600 });
  return null;
}
```

### Custom Spam Keywords

Extend spam detection:

```javascript
const customSpamKeywords = [
  "your-custom-word",
  "another-spam-term",
];

// In detectSpam function:
const allKeywords = [...spamKeywords, ...customSpamKeywords];
```

### Email Integration

Send moderation emails via SendGrid:

```javascript
async function sendModerationEmail(comment, spamDetection, env) {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: env.MODERATION_EMAIL }],
      }],
      from: { email: "noreply@example.com" },
      subject: `New comment needs moderation: ${comment.pageId}`,
      content: [{
        type: "text/plain",
        value: formatEmailBody(comment, spamDetection),
      }],
    }),
  });
}
```

### Database Storage Alternative

Store comments in Cloudflare D1 instead of GitHub:

```javascript
async function submitToDatabase(comment, env) {
  const result = await env.DB.prepare(
    "INSERT INTO comments (id, pageId, author, content, createdAt) VALUES (?, ?, ?, ?, ?)"
  ).bind(comment.id, comment.pageId, comment.author, comment.content, comment.createdAt).run();

  return result;
}
```

## Troubleshooting

### Comments not appearing

1. Check Cloudflare function logs: `wrangler tail --env production`
2. Verify GitHub token has `repo` scope
3. Confirm `GITHUB_COMMENTS_PATH` exists in repository
4. Check browser console for API errors

### GitHub API errors

**401 Unauthorized:**
- Invalid or expired GitHub token
- Token doesn't have `repo` scope

**403 Forbidden:**
- Token lacks write permissions
- Rate limited by GitHub API

**404 Not Found:**
- `GITHUB_OWNER` or `GITHUB_REPO` incorrect
- `GITHUB_COMMENTS_PATH` doesn't exist

### Form not submitting

1. Check CORS headers in response
2. Verify `pageId` is provided
3. Check email validation regex
4. Look for spam detection errors in console

## Security Considerations

✅ **What's Protected:**
- HTML sanitization prevents XSS attacks
- Email validation prevents spam
- GitHub token stored in Cloudflare secrets (never exposed)
- CORS headers configured per-environment

⚠️ **What You Should Monitor:**
- Spam detection thresholds (tune for your audience)
- Rate limiting per IP (prevent DDoS)
- Moderation queue (review flagged comments regularly)
- Comment content (use GitHub's moderation tools)

## Deployment Checklist

- [ ] GitHub personal access token created with `repo` scope
- [ ] `data/comments` directory exists in GitHub repo
- [ ] Cloudflare secrets configured (`GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`)
- [ ] Function deployed: `wrangler publish --env production`
- [ ] Frontend form HTML added to page
- [ ] `standard.comment.js` included in page
- [ ] CSS styling applied
- [ ] Tested comment submission
- [ ] Verified comments appear in GitHub repo
- [ ] Moderation email recipient configured (if using)

## See Also

- [comments.js](./comments.js) - Server-side handler
- [standard.comment.js](./standard.comment.js) - Client-side library
- [utils.js](./utils.js) - Shared utilities
- [wrangler.toml.template](./wrangler.toml.template) - Cloudflare config template
