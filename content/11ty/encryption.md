# Content Encryption & Protection

Protect sensitive content with client-side password encryption. Perfect for private notes, premium content, or restricted information.

## Overview

The encryption plugin allows you to:

- **Encrypt page content** - Protect sensitive information
- **Password protect pages** - Require password to view
- **Client-side decryption** - No server needed
- **Transparent integration** - Works with markdown and templates
- **Minimal performance impact** - Encryption/decryption is fast
- **No dependencies** - Pure JavaScript, no libraries required

### Use Cases

- 📝 **Private notes** - Keep personal thoughts encrypted
- 💼 **Premium content** - Protect exclusive articles behind passwords
- 🔐 **Sensitive information** - Encrypt confidential data
- 👥 **Member-only areas** - Restrict access to specific users
- 📊 **Proprietary data** - Protect business information
- 🎓 **Course materials** - Lock content until payment/enrollment


## How It Works

### Encryption Process

1. **You write content** normally in markdown or templates
2. **Set `encrypted: true`** in front matter
3. **Plugin encrypts the content** at build time
4. **HTML includes encrypted payload** + decryption UI
5. **Users enter password** in browser
6. **Content decrypts client-side** - never sent to server

### Security Model

- **Algorithm**: SHA256-based XOR encryption
- **Location**: Encryption/decryption happens entirely in browser
- **Password**: User enters at view time, not stored
- **Transport**: No encryption keys transmitted to server
- **Storage**: Encrypted content embedded in HTML

> [!WARNING]
> This provides **content obfuscation**, not military-grade security. It prevents casual viewing but determined attackers could potentially decrypt. For highly sensitive data, use server-side access control.


## Basic Setup

### Enable Encryption

Add to `eleventy.config.js`:

```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    encryption: {
      enabled: true,
      // Additional options below
    }
  });

  return {
    dir: { input: "content", output: "_site" }
  };
}
```

### Protect a Page

Create a markdown file with encryption enabled:

```markdown

title: Private Notes
encrypted: true
password: mypassword123


# Private Notes

This content is password-protected and encrypted.

Only visible to someone with the password.
```

**That's it!** The plugin automatically:
1. Encrypts the content
2. Creates a password prompt
3. Handles decryption on the client


## Usage Examples

### Simple Protected Page

```markdown

title: Secret Article
encrypted: true
password: secret123

# Secret Information

This content is encrypted.
```

Visit the page → See password prompt → Enter "secret123" → View content

### Multiple Passwords

For different access levels, use multiple pages with different passwords:

```markdown

title: Premium Content
encrypted: true
password: premium-user-pass
description: Exclusive member content

# Premium Article

This content is for premium members only.
```

```markdown

title: Executive Summary
encrypted: true
password: exec-password-456

# Executive Information

Restricted to executives.
```

### Protected Blog Post

```markdown

title: My Private Blog Post
-post
encrypted: true
password: blog-password
date: 2024-10-21

# 

This blog post is password protected.

Share the password only with intended readers.

## Section 1

Protected content here...

## Section 2

More encrypted content...
```

### Time-Limited Content

Combine with custom passwords to expire content:

```markdown

title: Conference Materials
encrypted: true
password: conf2024-access  # Change after event
description: Materials for October 2024 conference

# Conference Materials

Event access ends: October 31, 2024

[After date, change password to disable access]
```


## Configuration

Advanced configuration options in `eleventy.config.js`:

```javascript
eleventyConfig.addPlugin(Standard, {
  encryption: {
    // Enable/disable encryption
    enabled: true,

    // UI customization
    ui: {
      // Placeholder text for password input
      placeholder: "Enter password...",

      // Button text
      buttonText: "Unlock",

      // Error message
      errorMessage: "Invalid password. Try again.",

      // Success message (shown briefly)
      successMessage: "Content unlocked!",

      // Heading text
      heading: "Protected Content",

      // Instruction text
      instruction: "This content is password-protected.",
    },

    // Encryption settings
    encryption: {
      // Hashing iterations (higher = slower but more secure)
      iterations: 10000,

      // Salt length in bytes
      saltLength: 16,
    },

    // Styling
    style: {
      // Custom CSS class for encrypted section
      containerClass: "encrypted-content",

      // Theme: 'light', 'dark', or 'auto'
      theme: "auto",

      // Custom background color
      backgroundColor: "transparent",
    },

    // Layout
    layout: "default", // or "minimal"
  }
});
```

### Options Explained

| Option | Type | Default | Description |
|--||---|-|
| `enabled` | boolean | `true` | Enable encryption feature |
| `ui.placeholder` | string | `"Enter password..."` | Input placeholder |
| `ui.buttonText` | string | `"Unlock"` | Button label |
| `ui.errorMessage` | string | Error text | Message on wrong password |
| `ui.successMessage` | string | Success text | Shown after unlock |
| `encryption.iterations` | number | `10000` | Hash iterations |
| `style.theme` | string | `"auto"` | Light/dark/auto theme |
| `layout` | string | `"default"` | UI layout style |


## Front Matter Options

Control encryption per-page:

```markdown

title: Protected Article

# Encryption settings
encrypted: true              # Enable encryption
password: mypassword         # Required password
passwordHint: "Think winter" # Optional hint shown to users

# Optional customization
encryptionUI:
  heading: "VIP Content"
  instruction: "Members only"
  buttonText: "Reveal"
  placeholder: "VIP password"

```


## Styling Encrypted Content

### Default Styles

The plugin includes default styling for the password prompt:

```css
/* Encrypted content container */
.encrypted-content {
  border: 2px solid var(--color-accent);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  background: var(--color-background);
}

/* Password prompt */
.encrypted-prompt {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  margin: 0 auto;
}

/* Input field */
.encrypted-prompt input {
  padding: 0.75rem;
  border: 1px solid var(--color-accent);
  border-radius: 4px;
  font-size: 1rem;
}

/* Unlock button */
.encrypted-prompt button {
  padding: 0.75rem 1.5rem;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.encrypted-prompt button:hover {
  opacity: 0.9;
}
```

### Custom Styling

Override with your own CSS:

```css
/* Custom encrypted container */
.my-encrypted {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.my-encrypted input {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid white;
  color: white;
  padding: 1rem;
  border-radius: 8px;
}

.my-encrypted input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.my-encrypted button {
  background: white;
  color: #667eea;
  font-weight: bold;
  padding: 1rem 2rem;
  border-radius: 8px;
}
```

In front matter:

```markdown

title: Styled Protected Content
encrypted: true
password: mypass
encryptionUI:
  containerClass: my-encrypted

```

### Tailwind CSS Styling

If using Tailwind:

```css
@layer components {
  .encrypted-custom {
    @apply p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg;
  }

  .encrypted-custom input {
    @apply w-full px-4 py-2 bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 rounded-lg focus:outline-none focus:border-opacity-100;
  }

  .encrypted-custom button {
    @apply w-full px-4 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-opacity-90 transition;
  }
}
```


## Common Patterns

### Protected Blog Series

Encrypt individual posts with different passwords:

```markdown

title: "Advanced Series - Part 1"
encrypted: true
password: advanced-series-p1
-post
series: Advanced

```

```markdown

title: "Advanced Series - Part 2"
encrypted: true
password: advanced-series-p2
-post
series: Advanced

```

### Password Hint

Provide hints without revealing password:

```markdown

title: Mystery Article
encrypted: true
password: phoenix
passwordHint: "This mythical bird rises from ashes"

```

The hint displays in the unlock prompt.

### Premium Member Content

Create a landing page with encrypted content:

```markdown

title: Premium Content Hub


# Premium Articles

## Article 1: Advanced Techniques

[Click to unlock premium content]

## Article 2: Expert Guide

[Click to unlock premium content]


*Contact [email] for premium access password*
```

Each article encrypted with member password.

### Course Materials

Protect lesson materials:

```markdown

title: "Lesson 5: Advanced Concepts"
encrypted: true
password: course-2024-students
course: Advanced Course
lesson: 5


# 

## Learning Objectives

- Understand concept A
- Apply technique B
- Master pattern C

## Content

[Protected lesson material]
```


## Password Security Best Practices

### Strong Passwords

```markdown

# Good passwords (reasonably unique)
password: Phoenix2024Rising

# Weak passwords (easy to guess)
password: 123456     # Too simple
password: password   # Too common
password: a          # Too short

```

### Password Management

**For sharing:**

1. Share password through **separate secure channel**
   - Not in email with link
   - Not in same document
   - Not in URL parameters

2. Use for **semi-public content** (not highly sensitive)
   - Premium articles
   - Member previews
   - Time-limited access

3. **Rotate passwords regularly**
   - Change after specific date
   - Expire old access codes
   - Create new passwords for new courses

### Example: Rotating Passwords

```markdown

title: Conference Materials
encrypted: true
password: conf-oct-2024  # Change November 1st
expires: "2024-10-31"
note: "Password changes after conference"

```


## Decryption on Client

### How It Works

1. **Browser receives encrypted HTML** with password-protected content
2. **User enters password** in form
3. **JavaScript hashes the password**
4. **XOR decryption applied** with hashed password
5. **Content revealed if password correct**
6. **Nothing sent to server**

### Performance

- **Encryption**: ~10ms for typical page
- **Decryption**: ~10ms for typical page
- **Impact**: Negligible build time increase
- **Size**: ~2KB additional JavaScript

### Privacy

- **No server logs** - Password never sent to server
- **No tracking** - Decryption happens entirely client-side
- **No cookies** - Password not stored in browser
- **Temporary** - Password only in memory while session active


## Troubleshooting

### Password Not Working

**Problem**: Password prompt appears but password doesn't unlock

**Solutions**:
1. Verify password matches exactly (case-sensitive)
2. Check no typos in password in front matter
3. Clear browser cache and reload
4. Rebuild site: `npx @11ty/eleventy`

### Content Not Visible After Unlock

**Problem**: Page still shows encrypted section after entering password

**Solutions**:
1. Check browser console for errors (F12)
2. Verify JavaScript enabled in browser
3. Ensure encryption is enabled in config
4. Try different browser

### Build Includes Unencrypted Content

**Problem**: Encrypted content showing plain text in HTML file

**Solutions**:
1. Verify `encrypted: true` in front matter
2. Check `encryption.enabled: true` in config
3. Run full rebuild (not incremental)
4. Clear `_site` folder and rebuild

### Performance Issues

**Problem**: Build is slow with many encrypted pages

**Solutions**:
1. Encryption overhead is minimal (~10ms per page)
2. Check if unrelated plugins are slow
3. Profile: `npx @11ty/eleventy --profile`


## API Reference

For technical details, see [Content Encryption Plugin Documentation](/docs/content-encryption-plugin/)


## See Also

- [Getting Started](/11ty/getting-started/) - 11ty setup basics
- [Markdown](/11ty/markdown/) - Enhanced markdown writing
- [Backlinks](/11ty/backlinks/) - Connect encrypted pages
- [Advanced Features](/11ty/advanced/) - Power user techniques
- [Content Encryption Plugin API](/docs/content-encryption-plugin/) - Technical reference


Protect sensitive content with password encryption. [Explore advanced features](/11ty/advanced/)