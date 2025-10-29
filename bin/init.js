#!/usr/bin/env node

/**
 * @component Standard Framework Init Command
 * @category Build Tools
 * @description Scaffolds a new website using Standard Framework.
 * Creates the necessary directory structure and configuration files.
 *
 * Usage:
 *   standard-init                   # Interactive setup
 *   standard-init my-site           # Create my-site directory
 *
 * Creates:
 *   - site.config.yml (project configuration)
 *   - content/ (documentation content)
 *   - src/styles/ (custom SCSS)
 *   - src/js/ (custom JavaScript)
 *   - package.json (with Standard Framework dependency)
 *   - eleventy.config.js (11ty configuration)
 *
 * @since 0.14.0
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frameworkRoot = path.join(__dirname, "..");

// Get project name from argument or use default
const projectName = process.argv[2] || "standard-site";
const projectPath = path.resolve(process.cwd(), projectName);

console.log("🚀 Standard Framework - Project Initializer\n");

// Check if directory already exists
if (fs.existsSync(projectPath)) {
  console.error(`❌ Directory "${projectName}" already exists!`);
  process.exit(1);
}

console.log(`📁 Creating project: ${projectName}\n`);

try {
  // Create directories
  const dirs = [
    "content",
    "src/styles",
    "src/js",
    "src/layouts",
    "public/assets/css",
    "public/assets/js",
    "_site",
  ];

  for (const dir of dirs) {
    fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    console.log(`   ✅ Created ${dir}/`);
  }

  console.log();

  // Create site.config.yml
  const siteConfig = `title: "${projectName}"
url: "https://example.com"
description: "A beautiful site built with Standard Framework"
language: "en"
author:
  name: "Your Name"
  email: "your.email@example.com"
social:
  twitter: "@yourhandle"

# Build configuration (read by build-css and build-js scripts)
# Outputs to public/assets which is watched by 11ty for browser reload
build:
  css:
    outputDir: "public/assets/css"
    files:
      - input: "custom.scss"
        output: "custom.min.css"
    bundle:
      files:
        - "node_modules/@zefish/standard/dist/standard.min.css"
        - "public/assets/css/custom.min.css"
      output: "site.min.css"

  js:
    outputDir: "public/assets/js"
    files:
      - input: "custom.js"
        output: "custom.min.js"
        minify: true
    bundles:
      - name: "site.bundle.js"
        files:
          - "node_modules/htmx.org/dist/htmx.min.js"
          - "node_modules/@zefish/standard/dist/standard.min.js"
          - "public/assets/js/custom.min.js"
`;

  fs.writeFileSync(path.join(projectPath, "site.config.yml"), siteConfig);
  console.log("✅ Created site.config.yml");

  // Create eleventy.config.js
  const eleventyConfig = `import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  // Add Standard Framework plugin
  eleventyConfig.addPlugin(Standard, {
    outputDir: "assets/standard",
    copyFiles: true,
    cloudflare: { enabled: false },
  });

  // Configure input/output directories
  eleventyConfig.setInputDirectory("content");
  eleventyConfig.setIncludesDirectory("../src/layouts");
  eleventyConfig.setOutputDirectory("_site");

  // Add default layout
  eleventyConfig.addGlobalData("layout", "base");

  // Copy assets to output
  eleventyConfig.addPassthroughCopy({ "content/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "public": "." });

  // Ignore src/js and src/styles - they are watched by build scripts
  eleventyConfig.watchIgnores.add("src/js/**");
  eleventyConfig.watchIgnores.add("src/styles/**");

  // Also ignore public files from triggering rebuilds
  eleventyConfig.watchIgnores.add("public/**");

  // Configure dev server to watch files for browser reload only (no rebuild)
  eleventyConfig.setServerOptions({
    watch: [".trigger-reload"],
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
`;

  fs.writeFileSync(
    path.join(projectPath, "eleventy.config.js"),
    eleventyConfig,
  );
  console.log("✅ Created eleventy.config.js");

  // Create package.json
  const packageJson = {
    name: projectName,
    version: "0.1.0",
    description: "A beautiful site built with Standard Framework",
    type: "module",
    scripts: {
      "build:css": "standard-build-css",
      "build:js": "standard-build-js",
      build: "npm run build:css && npm run build:js && eleventy",
      "watch:css": "standard-build-css --watch",
      "watch:js": "standard-build-js --watch",
      dev: 'concurrently --kill-others "npm run watch:css" "npm run watch:js" "eleventy --serve"',
      start: "npm run dev",
    },
    keywords: ["standard-framework", "typography", "11ty"],
    author: "Your Name",
    license: "MIT",
    dependencies: {
      "@zefish/standard": "latest",
      "@11ty/eleventy": "^3.1.0",
      dotenv: "^17.0.0",
    },
    devDependencies: {
      concurrently: "^8.2.2",
    },
  };

  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(packageJson, null, 2),
  );
  console.log("✅ Created package.json");

  // Create a sample SCSS file
  const scssFile = `/**
 * Custom Styles for Your Site
 * This file will be compiled and bundled with Standard Framework CSS
 */

// Import Standard Framework variables
// @import "@zefish/standard/css";

// Add your custom styles below
body {
  // Customize as needed
}
`;

  fs.writeFileSync(path.join(projectPath, "src/styles/custom.scss"), scssFile);
  console.log("✅ Created src/styles/custom.scss");

  // Create a sample JS file
  const jsFile = `/**
 * Custom JavaScript for Your Site
 * This file will be minified and bundled with Standard Framework JS
 */

console.log("Standard Framework initialized!");

// Add your custom scripts below
`;

  fs.writeFileSync(path.join(projectPath, "src/js/custom.js"), jsFile);
  console.log("✅ Created src/js/custom.js");

  // Create a base layout
  const layoutDir = path.join(projectPath, "src/layouts");
  const baseLayout = `<!DOCTYPE html>
<html lang="{{ site.language or 'en' }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title or site.title }}</title>
  <meta name="description" content="{{ description or site.description }}">

  <!-- Site CSS (Standard Framework + Custom) -->
  <link rel="stylesheet" href="/assets/css/site.min.css">
</head>
<body>
  <header>
    <h1>{{ site.title }}</h1>
  </header>

  <main>
    {{ content | safe }}
  </main>

  <footer>
    <p>&copy; {{ now.getFullYear() }} {{ site.author.name }}. All rights reserved.</p>
  </footer>

  <!-- Site JS (Standard Framework + Custom) -->
  <script src="/assets/js/site.bundle.js"></script>
</body>
</html>
`;

  fs.writeFileSync(path.join(layoutDir, "base.njk"), baseLayout);
  console.log("✅ Created src/layouts/base.njk");

  // Create README.md
  const readme = `# ${projectName}

A beautiful site built with [Standard Framework](https://standard.ffp.co).

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm start
\`\`\`

This starts an optimized development workflow:
- Watches SCSS files and recompiles CSS on changes
- Watches JS files and recompiles JavaScript on changes
- Runs 11ty dev server with live reload
- CSS/JS changes only trigger browser reload (fast)
- Content changes trigger full 11ty rebuild (as needed)

### Building

\`\`\`bash
npm run build
\`\`\`

### Building individual components

\`\`\`bash
npm run build:css    # Build CSS only
npm run build:js     # Build JavaScript only
\`\`\`

## Configuration

Edit \`site.config.yml\` to customize:
- Site metadata (title, URL, author)
- Build configuration (which files to compile/bundle)
- Navigation structure
- Custom settings

## Project Structure

\`\`\`
${projectName}/
├── content/          # Markdown/HTML content
├── src/
│   ├── styles/      # Custom SCSS files
│   ├── js/          # Custom JavaScript files
│   └── layouts/     # Nunjucks templates
├── public/          # Compiled assets (generated, watched by 11ty)
│   └── assets/
│       ├── css/     # Compiled CSS bundles
│       └── js/      # Compiled JS bundles
├── _site/           # Built site (generated)
├── site.config.yml  # Site & build configuration
├── eleventy.config.js # 11ty configuration
└── package.json     # Dependencies & scripts
\`\`\`

## Learn More

- [Standard Framework Docs](https://standard.ffp.co/docs)
- [Getting Started Guide](https://standard.ffp.co/getting-started)
- [Cheat Sheet](https://standard.ffp.co/cheat-sheet)

---

Built with ❤️ using Standard Framework
`;

  fs.writeFileSync(path.join(projectPath, "README.md"), readme);
  console.log("✅ Created README.md");

  // Create a sample content file
  const indexMd = `---
layout: base.njk
title: Home
---

# Welcome to {{ site.title }}

This is your home page. Edit content/index.md to change this.

## Next Steps

1. Customize \`site.config.yml\` with your site information
2. Add content in the \`content/\` directory
3. Customize styles in \`src/styles/custom.scss\`
4. Run \`npm start\` to see your site live

---

Powered by [Standard Framework](https://standard.ffp.co)
`;

  fs.writeFileSync(path.join(projectPath, "content/index.md"), indexMd);
  console.log("✅ Created content/index.md");

  // Create .gitignore
  const gitignore = `node_modules/
public/
_site/
.trigger-reload
.DS_Store
.env
.env.local
*.log
`;

  fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignore);
  console.log("✅ Created .gitignore");

  console.log("\n✅ Project created successfully!\n");
  console.log(`📂 Next steps:\n`);
  console.log(`   cd ${projectName}`);
  console.log(`   npm install`);
  console.log(`   npm start\n`);
  console.log("🎉 Your Standard Framework site is ready to go!\n");
} catch (error) {
  console.error("❌ Error creating project:", error.message);
  process.exit(1);
}
