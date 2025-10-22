import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @component Cloudflare Functions Plugin
 * @category 11ty Plugins
 * @description Plugin to integrate Cloudflare Workers/Functions with 11ty websites.
 * Automatically copies utility functions and configuration for serverless deployment.
 * Provides helper functions for common Cloudflare use cases like redirects, authentication,
 * rate limiting, and caching.
 *
 * @param {object} eleventyConfig 11ty configuration object
 * @param {object} options Plugin options
 * @param {string} options.outputDir Output directory for function files (default: functions)
 * @param {string} options.environment Environment name (default: production)
 * @param {object} options.env Environment variables to pass to functions
 *
 * @prop {passthrough} functions Copy function files to output
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
    includeFunctions = ["example"],
  } = options;

  // Generate wrangler.toml from .env on build start
  eleventyConfig.on("eleventy.before", () => {
    generateWranglerConfig({ environment });
  });

  // Copy Cloudflare functions to output directory
  // Functions are now in src/cloudflare/ instead of src/eleventy/cloudflare/
  const cloudflareDir = path.join(__dirname, "../cloudflare");

  if (fs.existsSync(cloudflareDir)) {
    eleventyConfig.addPassthroughCopy({
      [cloudflareDir]: outputDir,
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

/**
 * Generate wrangler.toml from .env file
 * @param {object} options Configuration options
 * @returns {boolean} Success status
 */
function generateWranglerConfig(options = {}) {
  const { environment = "production", dryRun = false } = options;

  // Load environment variables from .env
  const result = dotenv.config();
  if (result.error && result.error.code !== "ENOENT") {
    console.error("[Wrangler] Error loading .env file:", result.error);
    return false;
  }

  // Check required environment variables
  const required = ["GITHUB_OWNER", "GITHUB_REPO"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `[Wrangler] ⚠️  Missing required environment variables: ${missing.join(", ")}`,
    );
    console.warn(`    Create a .env file with these values`);
    return false;
  }

  // Build wrangler.toml content
  const wranglerConfig = buildWranglerToml(environment);
  const devVarsContent = buildDevVars(environment);

  if (!dryRun) {
    try {
      // Write wrangler.toml
      fs.writeFileSync("wrangler.toml", wranglerConfig);

      // Write .dev.vars
      fs.writeFileSync(".dev.vars", devVarsContent);

      console.log(`
[Standard] ✅ Generated wrangler.toml and .dev.vars

📝 Configuration loaded from .env:
   - Project: ${process.env.PROJECT_NAME || "comments"}
   - GitHub: ${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}
   - Comments path: ${process.env.GITHUB_COMMENTS_PATH || "data/comments"}

⚠️  IMPORTANT: Set production secrets manually:

   wrangler secret put GITHUB_TOKEN --env ${environment}
   wrangler secret put MODERATION_EMAIL --env ${environment}
   wrangler secret put GITHUB_WEBHOOK_SECRET --env ${environment}

🚀 Then deploy:

   wrangler publish --env ${environment}
`);
    } catch (error) {
      console.error("[Wrangler] Error writing configuration files:", error);
      return false;
    }
  }

  return true;
}

/**
 * Build wrangler.toml content
 * @param {string} environment Environment name
 * @returns {string} TOML content
 */
function buildWranglerToml(environment) {
  const projectName = process.env.PROJECT_NAME || "comments";
  const domain = process.env.DOMAIN || "example.com";
  const zoneId = process.env.CLOUDFLARE_ZONE_ID || "your-zone-id";
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "your-account-id";

  let toml = `# Cloudflare Workers Configuration for GitHub Comments System
# Auto-generated from .env file

name = "${projectName}"
type = "service"
main = "functions/api/comments.js"
account_id = "${accountId}"
compatibility_date = "2024-10-22"

# Local development
[env.development]
workers_dev = true

vars = { SPAM_CHECK_ENABLED = "true" }

# Production environment
[env.${environment}]
`;

  // Add route if domain is provided
  if (domain !== "example.com") {
    toml += `route = "${domain}/api/comments"
zone_id = "${zoneId}"

`;
  }

  toml += `vars = { SPAM_CHECK_ENABLED = "${process.env.SPAM_CHECK_ENABLED || "true"}" }

[env.${environment}.vars]
GITHUB_OWNER = "${process.env.GITHUB_OWNER}"
GITHUB_REPO = "${process.env.GITHUB_REPO}"
GITHUB_COMMENTS_PATH = "${process.env.GITHUB_COMMENTS_PATH || "data/comments"}"

[env.${environment}.secrets]
# Set these with: wrangler secret put <name> --env ${environment}
GITHUB_TOKEN = ""
MODERATION_EMAIL = ""
GITHUB_WEBHOOK_SECRET = ""
`;

  return toml;
}

/**
 * Build .dev.vars content for local development
 * @param {string} environment Environment name
 * @returns {string} Dev vars content
 */
function buildDevVars(environment) {
  return `# Local development environment variables
# This file is used by wrangler during local development
# It's loaded from the .env file and should be kept in .gitignore

GITHUB_TOKEN=${process.env.GITHUB_TOKEN || ""}
GITHUB_OWNER=${process.env.GITHUB_OWNER || ""}
GITHUB_REPO=${process.env.GITHUB_REPO || ""}
GITHUB_COMMENTS_PATH=${process.env.GITHUB_COMMENTS_PATH || "data/comments"}
MODERATION_EMAIL=${process.env.MODERATION_EMAIL || ""}
GITHUB_WEBHOOK_SECRET=${process.env.GITHUB_WEBHOOK_SECRET || ""}
SPAM_CHECK_ENABLED=${process.env.SPAM_CHECK_ENABLED || "true"}
`;
}
