/**
 * @component Comments System Plugin
 * @category Cloudflare Functions
 * @description Standalone 11ty plugin to integrate the GitHub comments system.
 * Handles copying comments handler, client library, and configuration templates
 * to your functions directory. Can be used independently or alongside other
 * Standard Framework plugins.
 *
 * Usage:
 * 1. Install Standard Framework: npm install @zefish/standard
 * 2. Import and add plugin to eleventy.config.js
 * 3. Configure GitHub credentials in wrangler.toml
 * 4. Deploy to Cloudflare
 *
 * @param {object} eleventyConfig 11ty configuration object
 * @param {object} options Plugin options
 * @param {string} options.outputDir Output directory for function files (default: functions/api)
 * @param {boolean} options.copyClientLibrary Copy browser library (default: true)
 * @param {boolean} options.copyTemplate Copy HTML template (default: true)
 *
 * @example
 * // In eleventy.config.js
 * import CommentsPlugin from "@zefish/standard/src/cloudflare/comments-plugin.js";
 *
 * export default function (eleventyConfig) {
 *   // Add Standard Framework
 *   eleventyConfig.addPlugin(Standard);
 *
 *   // Add Comments System (can be used independently)
 *   eleventyConfig.addPlugin(CommentsPlugin, {
 *     outputDir: "functions/api",
 *     copyClientLibrary: true,
 *     copyTemplate: false
 *   });
 * }
 *
 * @since 0.10.53
 */

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function (eleventyConfig, options = {}) {
  const {
    outputDir = "functions/api",
    copyClientLibrary = true,
    copyTemplate = true,
  } = options;

  // Copy comments handler to functions directory
  const commentsHandler = path.join(__dirname, "comments-example.js");
  if (fs.existsSync(commentsHandler)) {
    eleventyConfig.addPassthroughCopy({
      [commentsHandler]: `${outputDir}/comments.js`,
    });
  }

  // Copy utility functions (required by comments handler)
  const utils = path.join(__dirname, "utils.js");
  if (fs.existsSync(utils)) {
    eleventyConfig.addPassthroughCopy({
      [utils]: `${outputDir}/utils.js`,
    });
  }

  // Copy wrangler config template
  const wranglerTemplate = path.join(__dirname, "wrangler-comments.toml.template");
  if (fs.existsSync(wranglerTemplate)) {
    eleventyConfig.addPassthroughCopy({
      [wranglerTemplate]: "wrangler-comments.toml.template",
    });
  }

  // Optionally copy client library to assets
  if (copyClientLibrary) {
    const clientLib = path.join(__dirname, "comments-client.js");
    if (fs.existsSync(clientLib)) {
      eleventyConfig.addPassthroughCopy({
        [clientLib]: "assets/js/comments-client.js",
      });
    }
  }

  // Optionally copy HTML template to includes for easy reference
  if (copyTemplate) {
    const template = path.join(__dirname, "../", "content/cloudflare/comments/comments-template.html");
    if (fs.existsSync(template)) {
      eleventyConfig.addPassthroughCopy({
        [template]: "includes/comments-template.html",
      });
    }
  }

  // Add global data for comments configuration
  eleventyConfig.addGlobalData("comments", {
    enabled: true,
    apiEndpoint: "/api/comments",
    version: "0.10.53",
  });

  console.log(`[Comments Plugin] Configured for GitHub comments system`);
  console.log(`[Comments Plugin] Handler output directory: ${outputDir}`);
  if (copyClientLibrary) console.log(`[Comments Plugin] Client library copied to assets/js/`);
  if (copyTemplate) console.log(`[Comments Plugin] HTML template copied to includes/`);
}
