import Standard from "./src/eleventy/eleventy.js";
import DocGenerator from "./src/eleventy/doc-generator.js";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(resolve(__dirname, "package.json"), "utf-8"),
);

const site = {
  title: "Standard Framework",
  url: "https://standard.ffp.com/",
  version: pkg.version,
  docs: "https://standard.ffp.com/",
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
  eleventyConfig.addGlobalData("layout", "article");

  eleventyConfig.addPlugin(Standard);
  eleventyConfig.addPlugin(DocGenerator, {
    sourceDir: "src",
    patterns: ["styles/**/*.scss", "js/**/*.js", "eleventy/**/*.js"],
    outputDir: "content/docs",
    layout: "component",
  });

  // Copy files to output
  eleventyConfig.addPassthroughCopy({ dist: "assets/standard" });
  eleventyConfig.addPassthroughCopy({
    [resolve(__dirname, "README.md")]: "index.html",
  });

  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      if (data.page.fileSlug.toLowerCase() === "readme") {
        return "/";
      }
    },
  });

  // Log startup message
  eleventyConfig.on("eleventy.after", () => {
    console.log("");
    console.log("🎨 " + site.title);
    console.log("📦 v" + site.version);
    console.log("📖 " + site.docs);
    console.log("");
  });

  return {
    markdownTemplateEngine: false, // disables Nunjucks in Markdown files
    htmlTemplateEngine: "njk",
  };
}
