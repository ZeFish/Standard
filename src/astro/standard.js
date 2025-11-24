/**
 * @zefish/standard Astro Integration
 *
 * A comprehensive wrapper that orchestrates:
 * - OpenRouter AI integration
 * - Cloudflare integration
 * - Standard framework features
 */
import remarkTags from "./remark/tags.js";
import remarkStandard from "./remark/standard.js";
import remarkEscapeCode from "./remark/escape-code.js";
import remarkFixDates from "./remark/fix-dates.js";
import remarkSyntax from "./remark/syntax.js";
import rehypeStandard from "./rehype/standard.js";
import rehypeTypography from "./rehype/typography.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import createLogger from "../lib/logger.js";
import openrouterIntegration from "./integrations/openrouter.js";
import cloudflareIntegration from "./integrations/cloudflare.js";

export default function standard(options = {}) {
  const logger = createLogger({
    verbose: options.verbose ?? false,
    scope: "Standard",
  });

  // Load site config if specified in options
  let siteConfig = {};
  const configPath = options.configPath || "site.config.yml";

  if (configPath && fs.existsSync(configPath)) {
    try {
      const configFile = fs.readFileSync(configPath, "utf8");
      siteConfig = yaml.load(configFile) || {};
    } catch (error) {
      logger.warn(
        `Warning: Could not parse config file (${configPath}): ${error.message}`,
      );
    }
  } else if (configPath) {
    logger.info(`Config file not found: ${configPath}`);
  }

  // Merge site config with options (options take precedence)
  const mergedConfig = {
    ...siteConfig,
    ...options,
    // Deep merge for nested objects
    ...(options.site && { site: { ...siteConfig.site, ...options.site } }),
    ...(options.standard && {
      standard: { ...siteConfig.standard, ...options.standard },
    }),
    ...(options.build && { build: { ...siteConfig.build, ...options.build } }),
    ...(options.cloudflare && {
      cloudflare: { ...siteConfig.cloudflare, ...options.cloudflare },
    }),
    ...(options.openrouter && {
      openrouter: { ...siteConfig.openrouter, ...options.openrouter },
    }),
  };

  // Extract cloudflare and openrouter configs from both options and siteConfig
  const cloudflareConfig = {
    ...(siteConfig.cloudflare || {}),
    ...(options.cloudflare || {}),
  };
  const openrouterConfig = {
    ...(siteConfig.openrouter || {}),
    ...(options.openrouter || {}),
  };

  // Get package version for banner
  let packageVersion = "0.0.0";
  try {
    const packagePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../package.json",
    );
    const packageData = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    packageVersion = packageData.version || "0.0.0";
  } catch (error) {
    // Fallback to default version if package.json can't be read
  }

  // Banner to indicate successful initialization
  logger.banner(packageVersion);

  return {
    name: "@zefish/standard",
    hooks: {
      "astro:config:setup": ({
        config,
        updateConfig,
        injectScript,
        injectRoute,
      }) => {
        // 1. Configure Remark/Rehype Plugins
        updateConfig({
          markdown: {
            remarkPlugins: [
              [remarkTags, mergedConfig.tags || {}],
              [remarkStandard, mergedConfig.standard || {}],
              [remarkEscapeCode, mergedConfig.escapeCode || {}],
              [remarkFixDates, mergedConfig.dateFields || {}],
              [remarkSyntax, mergedConfig.syntax || {}],
            ],
            rehypePlugins: [
              [rehypeTypography, mergedConfig.typography || {}],
              [rehypeStandard, mergedConfig.html || {}],
            ],
          },
        });

        // 2. Virtual Module for Config
        updateConfig({
          vite: {
            plugins: [
              {
                name: "vite-plugin-standard-config",
                resolveId(id) {
                  if (id === "virtual:standard/config") {
                    return "\0virtual:standard/config";
                  }
                },
                load(id) {
                  if (id === "\0virtual:standard/config") {
                    return `export default ${JSON.stringify(mergedConfig)}`;
                  }
                },
              },
            ],
          },
        });

        // 3. Inject Routes (optional)
        if (mergedConfig.injectRoutes !== false) {
          const currentDir = path.dirname(fileURLToPath(import.meta.url));

          injectRoute({
            pattern: "/robots.txt",
            entrypoint: path.join(currentDir, "routes/robots.js"),
          });
          injectRoute({
            pattern: "/site.webmanifest",
            entrypoint: path.join(currentDir, "routes/manifest.js"),
          });
          injectRoute({
            pattern: "/_headers",
            entrypoint: path.join(currentDir, "routes/headers.js"),
          });
        }

        // 4. Setup Cloudflare Features (delegate to complete integration)
        if (cloudflareConfig.enabled !== false) {
          const cloudflare = cloudflareIntegration({
            ...cloudflareConfig,
            verbose: mergedConfig.verbose,
          });

          // Initialize the Cloudflare integration
          cloudflare.hooks["astro:config:setup"]({
            config,
            updateConfig,
            injectScript,
            injectRoute,
          });

          logger.success("Cloudflare integration enabled");
        }

        // 5. Setup OpenRouter AI Features (delegate to complete integration)
        if (openrouterConfig.enabled !== false) {
          const openrouter = openrouterIntegration({
            ...openrouterConfig,
            verbose: mergedConfig.verbose,
            siteUrl: mergedConfig.site?.url || mergedConfig.url,
          });

          // Initialize the OpenRouter integration
          openrouter.hooks["astro:config:setup"]({
            config,
            updateConfig,
            injectScript,
            injectRoute,
          });

          logger.success("OpenRouter AI integration enabled");
        }

        // 6. Add Global Styles (if needed)
        // injectScript('page', `import '@zefish/standard/css';`);
      },

      "astro:build:done": ({ dir }) => {
        // Build completed - integrations handled their own cleanup
        logger.debug(
          "Build completed - integrations handled their own cleanup",
        );
      },
    },
  };
}

// Export utility functions for use in components
export {
  buildCloudflareImageUrl,
  generateImageSrcset,
  shouldUseCloudflareImage,
  CloudflareImage,
  CloudflarePicture,
  ResponsiveImage,
} from "./utils/cloudflare.js";
