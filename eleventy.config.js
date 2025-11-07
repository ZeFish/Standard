import Standard from "./src/eleventy/standard.js";
import DocGenerator from "./src/eleventy/doc-generator.js";

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  // ===== STANDARD FRAMEWORK PLUGIN =====
  // Uses smart defaults:
  // - dirs: { input: "content", includes: "../src/layouts", output: "_site" }
  // - publicDir: "../public" (copies to _site/ root)
  // - Watches: src/scss/, src/js/, .trigger
  // - Server: Hot-reloads _site/assets/**
  eleventyConfig.addPlugin(Standard, {
    verbose: true,
  });
  /*

ai: {
  enabled: true,
  model: "anthropic/claude-3.5-sonnet",
  copyFunctions: true,
},

*/
  eleventyConfig.addGlobalData("theme", "blueprint");
  eleventyConfig.addGlobalData("layout", "base");
  eleventyConfig.watchIgnores.add("_site/assets/**/*");

  // ===== AUTO-DOCUMENTATION GENERATOR =====
  eleventyConfig.addPlugin(DocGenerator, {
    sourceDir: "src",
    patterns: [
      "styles/**/*.scss",
      "js/**/*.js",
      "eleventy/**/*.js",
      "cloudflare/**/*.js",
    ],
    outputDir: "content/docs",
  });

  // ===== ADDITIONAL ASSET FOLDERS =====
  // Standard copies public/ automatically, but if you also have content/assets:
  eleventyConfig.addPassthroughCopy({ public: "." });

  // ===== WATCH IGNORES =====
  // Standard watches src/eleventy/ automatically, but ignore compiled files
  eleventyConfig.watchIgnores.add("**/dist/**");
  eleventyConfig.watchIgnores.add("**/.cache/**");

  // ===== README SYNC =====
  // Sync README.md to content/ before each build
  eleventyConfig.addWatchTarget("README.md");

  eleventyConfig.on("eleventy.before", () => {
    const readmeSrc = join(__dirname, "README.md");
    const readmeDest = join(__dirname, "content", "README.md");

    if (fs.existsSync(readmeSrc)) {
      const srcContent = fs.readFileSync(readmeSrc, "utf-8");
      const destExists = fs.existsSync(readmeDest);
      const destContent = destExists
        ? fs.readFileSync(readmeDest, "utf-8")
        : null;

      // Only write if changed (prevents infinite watch loop)
      if (!destExists || srcContent !== destContent) {
        fs.writeFileSync(readmeDest, srcContent, "utf-8");
      }
    }
  });

  // ===== COMPUTED DATA =====
  eleventyConfig.addGlobalData("eleventyComputed", {
    // Special handling for README.md
    title: (data) => {
      if (data.page.fileSlug.toLowerCase() === "readme") {
        return "Standard Framework";
      }
      return data.title; // Fallback to frontmatter
    },
  });
  // ===== RETURN CONFIG =====
  // Standard plugin already returns these, but explicit is fine
  return {
    markdownTemplateEngine: false, // Disable Nunjucks in Markdown
    htmlTemplateEngine: "njk",
    dir: {
      input: "content",
      includes: "../src/layouts",
      output: "_site",
    },
  };
}
