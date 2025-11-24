/**
 * @zefish/standard Astro Integration
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

  // Banner to indicate successful initialization
  logger.banner();

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

        // 4. Setup Cloudflare Features
        if (cloudflareConfig.enabled !== false) {
          setupCloudflareFeatures(config, cloudflareConfig, logger);
        }

        // 5. Setup OpenRouter AI Features
        if (openrouterConfig.enabled !== false && openrouterConfig.apiKey) {
          setupOpenRouterFeatures(config, openrouterConfig, logger);
        }

        // 6. Add Global Styles (if needed)
        // injectScript('page', `import '@zefish/standard/css';`);
      },

      "astro:build:done": ({ dir }) => {
        // Copy Cloudflare functions if enabled
        if (
          cloudflareConfig.enabled !== false &&
          cloudflareConfig.functions?.enabled
        ) {
          copyCloudflareFunctions(dir, cloudflareConfig, logger);
        }
      },
    },
  };
}

// Helper function for Cloudflare setup
function setupCloudflareFeatures(config, cloudflareConfig, logger) {
  const functionsConfig = {
    enabled: cloudflareConfig.functions?.enabled ?? false,
    outputDir: cloudflareConfig.functions?.outputDir ?? "functions/api",
    environment: cloudflareConfig.functions?.environment ?? "production",
    env: cloudflareConfig.functions?.env ?? {},
  };

  const commentsConfig = {
    enabled: cloudflareConfig.comments?.enabled ?? false,
    apiEndpoint: cloudflareConfig.comments?.apiEndpoint ?? "/api/comments",
    commentsPath: cloudflareConfig.comments?.commentsPath ?? "data/comments",
  };

  if (functionsConfig.enabled) {
    commentsConfig.enabled = true; // Enable comments if functions are enabled
    config._cloudflare = { functionsConfig, commentsConfig };
    logger.success("Cloudflare features initialized");
  }
}

// Helper function for OpenRouter setup
function setupOpenRouterFeatures(config, openrouterConfig, logger) {
  const aiConfig = {
    enabled: true,
    apiKey: openrouterConfig.apiKey || process.env.OPENROUTER_KEY,
    model: openrouterConfig.model || "anthropic/claude-3.5-sonnet",
    siteUrl: openrouterConfig.siteUrl,
  };

  if (!aiConfig.apiKey) {
    logger.warn("OPENROUTER_KEY not set. AI features will not work.");
    return;
  }

  config._ai = aiConfig;
  logger.success(`OpenRouter AI initialized with ${aiConfig.model}`);
}

// Helper function to copy Cloudflare functions
function copyCloudflareFunctions(dir, cloudflareConfig, logger) {
  const cloudflareDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../cloudflare/api",
  );
  const functionsOutputPath = path.join(
    dir.toString(),
    cloudflareConfig.functions.outputDir,
  );

  if (!fs.existsSync(cloudflareDir)) {
    logger.warn(`Functions directory not found: ${cloudflareDir}`);
    return;
  }

  try {
    fs.mkdirSync(functionsOutputPath, { recursive: true });

    const copyRecursive = (src, dest) => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      const entries = fs.readdirSync(src);

      entries.forEach((name) => {
        const srcPath = path.join(src, name);
        const destPath = path.join(dest, name);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
          copyRecursive(srcPath, destPath);
        } else {
          try {
            const fileName = path.basename(srcPath);
            fs.copyFileSync(srcPath, destPath);
            logger.debug(`Copied: ${fileName}`);
          } catch (e) {
            logger.error(`Copy failed ${srcPath} -> ${destPath}: ${e.message}`);
          }
        }
      });
    };

    copyRecursive(cloudflareDir, functionsOutputPath);
    logger.success(
      `Functions copied to /${cloudflareConfig.functions.outputDir}/`,
    );
  } catch (e) {
    logger.error(`Failed to copy functions: ${e.message}`);
  }
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
