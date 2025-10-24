---
title: Deployment Guide

eleventyNavigation:
  key: Deployment
  parent: Cloudflare Functions
  title: Deployment
permalink: /cloudflare/deployment/
---

# Deployment Guide

Deploy your Cloudflare Functions to production.

## Pre-Deployment Checklist

- [ ] Functions are created and tested locally
- [ ] `wrangler.toml` is configured with your project details
- [ ] You're authenticated with `wrangler login`
- [ ] Environment variables are set
- [ ] Site builds successfully: `npm run build`
- [ ] Functions are in `_site/functions/`

## Local Testing

Always test locally before deploying.

### Start Development Server

```bash
wrangler dev
```

This starts a local server at `http://localhost:8787`.

### Test Your Functions

```bash
# Test a function
curl http://localhost:8787/api/comments

# Test with POST
curl -X POST http://localhost:8787/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

## Building

Build your entire 11ty site with functions included.

```bash
npm run build
```

This:
1. Generates 11ty site
2. Copies functions to `_site/functions/`
3. Injects version numbers into dist files

Verify functions are copied:

```bash
ls _site/functions/
```

## Deployment Methods

### Method 1: Wrangler CLI (Recommended)

Simplest and most common method.

```bash
# Deploy to production
wrangler publish

# Deploy to specific environment
wrangler publish --env production

# Deploy to staging
wrangler publish --env staging
```

### Method 2: GitHub Actions

Automate deployment on push.

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to Cloudflare
        run: npx wrangler publish
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### Method 3: Wrangler Pages

Deploy your entire site + functions.

```bash
# Create Pages project
wrangler pages project create my-project

# Deploy
wrangler pages deploy _site --project-name=my-project
```

## Configuration for Production

### wrangler.toml Setup

```toml
name = "my-project"
main = "functions/index.js"
compatibility_date = "2024-10-21"
type = "service"

[env.production]
name = "my-project-prod"
routes = [
  { pattern = "example.com/api/*", zone_id = "your-zone-id" }
]
vars = { ENVIRONMENT = "production" }

[env.staging]
name = "my-project-staging"
routes = [
  { pattern = "staging.example.com/api/*", zone_id = "your-zone-id" }
]
vars = { ENVIRONMENT = "staging" }
```

### Environment Variables

Set secrets in Wrangler:

```bash
# Set for production
wrangler secret put API_KEY --env production

# Set for staging
wrangler secret put API_KEY --env staging
```

Or in `wrangler.toml`:

```toml
[env.production]
vars = {
  ENVIRONMENT = "production"
}

[env.production.secrets]
API_KEY = "your-secret-value"
```

## Deployment Process

### Step 1: Verify Build

```bash
npm run build
```

Check output:

```bash
ls _site/functions/
```

### Step 2: Test Locally

```bash
wrangler dev
```

Visit `http://localhost:8787` and test endpoints.

### Step 3: Authenticate

```bash
wrangler login
```

### Step 4: Deploy

```bash
wrangler publish
```

### Step 5: Verify Deployment

```bash
# Check deployed version
wrangler tail

# Test deployed endpoint
curl https://your-domain.com/api/hello
```

## Monitoring

### View Logs

```bash
# Real-time logs
wrangler tail

# Specific environment
wrangler tail --env production

# Filter by status
wrangler tail --status ok
```

### Performance Monitoring

Visit Cloudflare Dashboard:
1. Go to Workers > Your Project
2. Check Analytics tab
3. Monitor request rates and errors

### Error Tracking

```bash
# View recent errors
wrangler tail --status error

# Detailed logs
wrangler tail --format json
```

## Troubleshooting

### Functions Not Deploying

**Problem:** `wrangler publish` fails with "No functions found"

**Solution:** Ensure functions are in `_site/functions/`: 

```bash
npm run build
ls _site/functions/
wrangler publish
```

### Environment Variables Not Available

**Problem:** `env.API_KEY` is undefined

**Solution:** Set in `wrangler.toml`:

```toml
[env.production]
vars = { API_KEY = "your-value" }
```

Or use secrets:

```bash
wrangler secret put API_KEY --env production
```

### Timeout Errors

**Problem:** Functions timing out

**Solution:** Check for long-running operations:

```javascript
// ✗ Too slow
async function slowOperation() {
  await new Promise(r => setTimeout(r, 60000)); // 60 seconds
}

// ✓ Better
async function fastOperation() {
  // Keep under 30 seconds
  const timeout = Promise.race([
    doWork(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 25000)
    )
  ]);
}
```

## Updating Deployed Functions

### Quick Update

```bash
# Edit functions locally
# Test with: wrangler dev
# Deploy:
wrangler publish
```

### Rollback

Cloudflare keeps version history:

```bash
# List versions
wrangler deployments list

# Rollback to specific version
wrangler rollback --version <version-id>
```

## Performance Tips

1. **Keep functions small** - Faster cold starts
2. **Avoid N+1 queries** - Batch database requests
3. **Use KV for data** - Store frequently accessed data
4. **Monitor logs** - Check `wrangler tail` for issues

## Cost Optimization

- **Requests:** First 100,000/day free
- **Cold starts:** Optimize function size
- **KV storage:** Consider costs for large datasets

## Security Best Practices

1. **Use secrets** - Never hardcode API keys
2. **Validate input** - Check request data
3. **Log carefully** - Don't log sensitive data
4. **Use HTTPS** - Always use secure connections

## Next Steps

- Monitor your functions in [Cloudflare Dashboard](https://dash.cloudflare.com)
- Set up [Alerting](https://developers.cloudflare.com/workers/observability/alerts/)
- Optimize with [Performance Analytics](https://developers.cloudflare.com/workers/observability/analytics/)

---

**Deployed successfully?** Time to scale! 🚀
