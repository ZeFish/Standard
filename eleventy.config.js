import Standard from "./src/eleventy/eleventy.js";
import { execSync } from "child_process";

const site = {
  title: "Francis Fontaine",
  url: "https://francisfontaine.com/",
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

  eleventyConfig.addPlugin(Standard);
  eleventyConfig.addPassthroughCopy({ dist: "assets/standard" });

  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      if (data.page.fileSlug.toLowerCase() === "readme") {
        return "/";
      }
    },
  });

  return {
    markdownTemplateEngine: false, // disables Nunjucks in Markdown files
    htmlTemplateEngine: "njk",
  };
}
