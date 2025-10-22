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

/**
 * @component Standard Framework 11ty Plugin
 * @category 11ty Plugins
 * @description Main plugin orchestrator for Standard Framework. Registers all
 * sub-plugins (markdown, filters, shortcodes, backlinks, encryption, documentation).
 * Configures asset copying, global data, and template functions. Can serve assets
 * from local files or CDN. Automatically includes all framework CSS and JS.
 *
 * @param {object} eleventyConfig 11ty configuration object
 * @param {object} options Plugin options
 * @param {string} options.outputDir Output directory for copied files (default: assets/standard)
 * @param {boolean} options.copyFiles Copy files from node_modules (default: true)
 * @param {boolean} options.useCDN Use CDN instead of local files (default: false)
 * @param {array} options.escapeCodeBlocks Languages to escape code blocks for (default: [])
 *
 * @prop {shortcode} standardAssets Include CSS and JS in template
 * @prop {shortcode} standardLab Include lab/experimental features
 * @prop {plugin} Markdown Enhanced markdown parsing
 * @prop {plugin} Filter Template filters for content
 * @prop {plugin} ShortCode Additional template shortcodes
 * @prop {plugin} PreProcessor Markdown preprocessing
 * @prop {plugin} Backlinks Wiki-style backlinks
 * @prop {plugin} Encryption Content encryption
 *
 * @example
 * // In eleventy.config.js
 * import Standard from "./src/eleventy/eleventy.js";
 *
 * export default function (eleventyConfig) {
 *   eleventyConfig.addPlugin(Standard, {
 *     outputDir: "assets/standard",
 *     copyFiles: true,
 *     useCDN: false
 *   });
 * }
 *
 * // In templates
 * {% standardAssets %}
 * {% standardLab %}
 *
 * @since 0.1.0
 */

export default function (eleventyConfig, options = {}) {
  // Options with defaults
  const {
    // Output directory for copied files (relative to output folder)
    outputDir = "assets/standard",
    // Whether to copy files from node_modules
    copyFiles = true,
    // Whether to use CDN instead of local files
    useCDN = false,
    // Languages to escape code blocks for globally
    escapeCodeBlocks = [],
  } = options;

  eleventyConfig.addPlugin(PreProcessor, { escapeCodeBlocks });
  eleventyConfig.addPlugin(ShortCode);
  eleventyConfig.addPlugin(Filter);
  eleventyConfig.addPlugin(Backlinks);
  eleventyConfig.addPlugin(Markdown);
  eleventyConfig.addPlugin(addEncryptionTransform);

  eleventyConfig.setUseGitIgnore(false);

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
    return `<link rel="stylesheet" href="/${outputDir}/standard.min.css">
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
