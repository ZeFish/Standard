import Standard from "./src/eleventy/standard.js";
import DocGenerator from "./src/eleventy/doc-generator.js";

import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(resolve(__dirname, "package.json"), "utf-8"),
);

export default function (eleventyConfig) {
  const basePath = path.join(__dirname, "site.config.yml");
  const baseConfig = yaml.load(fs.readFileSync(basePath, "utf8"));
  eleventyConfig.addGlobalData("site", baseConfig);
  eleventyConfig.addGlobalData("version", pkg.version);

  eleventyConfig.setInputDirectory("content");
  eleventyConfig.setIncludesDirectory("../src/layouts");
  eleventyConfig.setOutputDirectory("_site");

  eleventyConfig.addGlobalData("layout", "base");
  eleventyConfig.addGlobalData("now", new Date()); // For dynamic year in footer

  eleventyConfig.addPlugin(Standard, {
    cloudflare: { enabled: true },
    image: {
      enabled: false,
      cdn: "cloudflare", // Uses Cloudflare Pages' free image resizing
      baseUrl: "https://standard.ffp.co", // Your Cloudflare Pages domain
      sizes: [640, 960, 1280, 1920],
      quality: 85,
      format: "auto", // Cloudflare automatically serves WebP/AVIF
      sharpen: 0.5,
      skipExternal: true,
      generateSrcset: true,
      lazyLoad: false,
    },
  });

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

  // Copy files to output
  eleventyConfig.addPassthroughCopy({ "content/assets": "assets" });

  // Watch README.md and claude.md for changes and copy into content directory
  eleventyConfig.addWatchTarget("README.md");
  eleventyConfig.addWatchTarget("claude.md");

  eleventyConfig.addWatchTarget("src/eleventy");
  eleventyConfig.on("eleventy.before", () => {
    // Sync README.md
    const readmeSrc = join(__dirname, "README.md");
    const readmeDest = join(__dirname, "content", "README.md");

    if (fs.existsSync(readmeSrc)) {
      const srcContent = fs.readFileSync(readmeSrc, "utf-8");
      const destExists = fs.existsSync(readmeDest);
      const destContent = destExists
        ? fs.readFileSync(readmeDest, "utf-8")
        : null;

      // Only write if content has changed to prevent infinite watch loop
      if (!destExists || srcContent !== destContent) {
        fs.writeFileSync(readmeDest, srcContent, "utf-8");
      }
    }

    // Sync claude.md
    const claudeSrc = join(__dirname, "claude.md");
    const claudeDest = join(__dirname, "content", "claude.md");

    if (fs.existsSync(claudeSrc)) {
      const srcContent = fs.readFileSync(claudeSrc, "utf-8");
      const destExists = fs.existsSync(claudeDest);
      const destContent = destExists
        ? fs.readFileSync(claudeDest, "utf-8")
        : null;

      // Only write if content has changed to prevent infinite watch loop
      if (!destExists || srcContent !== destContent) {
        fs.writeFileSync(claudeDest, srcContent, "utf-8");
      }
    }
  });

  eleventyConfig.addGlobalData("eleventyComputed", {
    title: (data) => {
      if (data.page.fileSlug.toLowerCase() === "readme") {
        return "Standard Framework";
      }
    },
    theme: (data) => {
      const pageTheme = data.theme || "default";
      return pageTheme === "default" ? "paper" : pageTheme;
    },
    visibility: (data) => data.visibility || "public",
  });

  return {
    markdownTemplateEngine: false, // disables Nunjucks in Markdown files
  };
}
