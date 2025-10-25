import Standard from "./src/eleventy/eleventy.js";
import DocGenerator from "./src/eleventy/doc-generator.js";

import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(resolve(__dirname, "package.json"), "utf-8"),
);

const site = {
  title: "Standard Framework",
  url: "https://standard.ffp.co",
  version: pkg.version,
  docs: "https://standard.ffp.co/docs",
  language: "fr",
  description: "",
  keywords: "",
  author: {
    name: "Francis Fontaine",
    email: "francisfontaine@gmail.com",
    url: "https://francisfontaine.com/now/",
    twitter: "francisfontaine",
  },
  social: {
    twitter: "@francisfontaine",
    instagram: "@francisfontaine",
  },
};

export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory("content");
  eleventyConfig.setIncludesDirectory("../src/layouts");
  eleventyConfig.setOutputDirectory("_site");

  eleventyConfig.addGlobalData("site", site); // 👈 Add metadata globally
  eleventyConfig.addGlobalData("layout", "base");
  eleventyConfig.addGlobalData("now", new Date()); // For dynamic year in footer

  eleventyConfig.addPlugin(Standard, { cloudflare: { enabled: true } });
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
  eleventyConfig.on("eleventy.before", () => {
    console.log("[Config] eleventy.before hook triggered");

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
        console.log("[Config] Syncing README.md to content/");
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
        console.log("[Config] Syncing claude.md to content/");
        fs.writeFileSync(claudeDest, srcContent, "utf-8");
      }
    }

    console.log("[Config] eleventy.before hook completed");
  });

  eleventyConfig.addGlobalData("eleventyComputed", {
    title: (data) => {
      if (data.page.fileSlug.toLowerCase() === "readme") {
        return "Standard Framework";
      }
    },
  });

  return {
    markdownTemplateEngine: false, // disables Nunjucks in Markdown files
  };
}
