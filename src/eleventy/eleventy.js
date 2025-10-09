import nunjucks from "nunjucks";
import * as sass from "sass";
import path from "path";
import { fileURLToPath } from "url";

import Backlinks from "./backlinks.js";
import Markdown from "./markdown.js";
import Filter from "./filter.js";
import ShortCode from "./shortcode.js";
import PreProcessor from "./preprocessor.js";
import { addEncryptionTransform } from "./encryption.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function (eleventyConfig, options = {}) {
  // Options with defaults
  const {
    // Output directory for copied files (relative to output folder)
    outputDir = "assets/standard",
    // Whether to copy files from node_modules
    copyFiles = true,
    // Whether to use CDN instead of local files
    useCDN = false,
  } = options;

  eleventyConfig.addPlugin(PreProcessor);
  eleventyConfig.addPlugin(ShortCode);
  eleventyConfig.addPlugin(Filter);
  eleventyConfig.addPlugin(Backlinks);
  eleventyConfig.addPlugin(Markdown);
  eleventyConfig.addPlugin(addEncryptionTransform);

  //eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  //
  eleventyConfig.addGlobalData("standard", {
    layout: {
      meta: "node_modules/@zefish/standard/src/layouts/meta.njk",
    },
  });

  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("standardAssets", function () {
    if (useCDN) {
      return `<link href="https://unpkg.com/@zefish/standard" rel="stylesheet">
<script src="https://unpkg.com/@zefish/standard/js" type="module"></script>`;
    }
    return `<link href="/${outputDir}/standard.min.css" rel="stylesheet">
<script src="/${outputDir}/standard.min.js" type="module"></script>`;
  });

  // Shortcode to include only CSS
  eleventyConfig.addShortcode("standardLab", function () {
    if (useCDN) {
      return `<script type="module" src="https://unpkg.com/@zefish/standard/lab"></script>`;
    }
    return `<script type="module" src="/${outputDir}/standard.lab.js"></script>`;
  });

  // Add passthrough copy from node_modules using relative path
  if (copyFiles && !useCDN) {
    eleventyConfig.addPassthroughCopy({
      "node_modules/@zefish/standard/dist/standard.min.css": `${outputDir}/standard.min.css`,
      "node_modules/@zefish/standard/dist/standard.min.js": `${outputDir}/standard.min.js`,
      "node_modules/@zefish/standard/dist/standard.lab.js": `${outputDir}/standard.lab.js`,
    });
  }
}
