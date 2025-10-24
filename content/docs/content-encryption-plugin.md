---
title: Content Encryption Plugin
layout: base
permalink: /docs/content-encryption-plugin/index.html
eleventyNavigation:
  key: Content Encryption Plugin
  parent: 11ty Plugins
  title: Content Encryption Plugin
category: 11ty Plugins
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/encryption.js
since: 0.1.0
---

Encrypts sensitive page content with password protection.
Uses SHA256-based XOR encryption for client-side decryption. Supports
password-protected pages via front matter configuration. Encrypted content
is embedded in HTML with decryption UI.

## Properties

| Name | Type | Description |
|------|------|-------------|
| `encrypted` | `frontmatter` | : true Enable encryption for page |
| `password` | `frontmatter` | Required password for decryption |
| `protect` | `transform` | -notes Automatic encryption transform |
| `encrypted` | `layout` | .njk Template for encrypted content display |

## Examples

```js
// In markdown front matter
---
title: Private Page
encrypted: true
password: mypassword123
---
This content will be encrypted and require password to view.
```


---

**Source:** `/Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/encryption.js`
