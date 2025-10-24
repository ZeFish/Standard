import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @component Cloudflare Functions Plugin
 * @category 11ty Plugins
 * @description Plugin to integrate Cloudflare Workers/Functions with 11ty websites.
 * Automatically copies function files and generates configuration for serverless deployment.
 *
 * @param {object} eleventyConfig 11ty configuration object
 * @param {object} options Plugin options
 * @param {string} options.outputDir Output directory for function files (default: functions)
 * @param {string} options.environment Environment name (default: production)
 * @param {object} options.env Environment variables to pass to functions
 *
 * @prop {passthrough} functions Copies function files from `src/cloudflare` to the output directory.
 * @prop {global} cloudflare Cloudflare configuration data available in templates
 *
 * @example
 * // In eleventy.config.js
 * import Standard from "./src/eleventy/eleventy.js";
 * import CloudflarePlugin from "./src/eleventy/cloudflare.js";
 *
 * export default function (eleventyConfig) {
 *   eleventyConfig.addPlugin(Standard);
 *   eleventyConfig.addPlugin(CloudflarePlugin, {
 *     outputDir: "functions",
 *     environment: "production"
 *   });
 * }
 *
 * @since 0.10.52
 */
export default function (eleventyConfig, options = {}) {
  const {
    outputDir = "functions",
    environment = "production",
    env = {},
  } = options;

  // Copy Cloudflare functions to output directory
  // Functions are now in src/cloudflare/ instead of src/eleventy/cloudflare/
  const cloudflareDir = path.join(__dirname, "../cloudflare");
  const jsDir = path.join(__dirname, "../js");

  if (fs.existsSync(cloudflareDir)) {
    eleventyConfig.addPassthroughCopy({
      [cloudflareDir]: outputDir,
      [jsDir]: "assets/js",
    });
  }

  // Add global data for Cloudflare configuration
  eleventyConfig.addGlobalData("cloudflare", {
    environment,
    outputDir,
    env,
    version: "0.10.52",
  });

  console.log(`[Cloudflare Plugin] Configured for ${environment} environment`);
  console.log(`[Cloudflare Plugin] Functions output directory: ${outputDir}`);
}
