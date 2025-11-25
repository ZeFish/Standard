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
import remarkBacklinks from "./remark/backlinks.js";
import { getBacklinkGraph, resetBacklinkGraph } from "./utils/backlinks.js";
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
        const backlinksEnabled = mergedConfig.backlinks !== false;
        if (backlinksEnabled) {
          resetBacklinkGraph();
        }

        const remarkPlugins = [
          [remarkTags, mergedConfig.tags || {}],
          [remarkStandard, mergedConfig.standard || {}],
          [remarkEscapeCode, mergedConfig.escapeCode || {}],
          [remarkFixDates, mergedConfig.dateFields || {}],
        ];
        if (backlinksEnabled) {
          remarkPlugins.push([remarkBacklinks, mergedConfig.backlinks || {}]);
        }
        remarkPlugins.push([remarkSyntax, mergedConfig.syntax || {}]);

        const rehypePlugins = [
          [rehypeTypography, mergedConfig.typography || {}],
          [rehypeStandard, mergedConfig.html || {}],
        ];

        // 1. Configure Remark/Rehype Plugins
        updateConfig({
          markdown: {
            remarkPlugins,
            rehypePlugins,
          },
        });

        // 2. Virtual Modules (config + backlinks)
        const moduleDir = path.dirname(fileURLToPath(import.meta.url));
        const currentDir = path.resolve(moduleDir);
        const backlinksModulePath = path
          .join(currentDir, "utils", "backlinks.js")
          .split(path.sep)
          .join("/");

        const virtualModulesPlugin = {
          name: "vite-plugin-standard-virtual",
          resolveId(id) {
            if (id === "virtual:standard/config") {
              return "\0standard-virtual-config";
            }
            if (id === "virtual:standard/backlinks") {
              return "\0standard-virtual-backlinks";
            }
          },
          load(id) {
            if (id === "\0standard-virtual-config") {
              return `export default ${JSON.stringify(mergedConfig)}`;
            }
            if (id === "\0standard-virtual-backlinks") {
              if (!backlinksEnabled) {
                return "export const backlinks = {};\nexport default backlinks;";
              }
              return `import { getBacklinkGraph } from "${backlinksModulePath}";\nconst graph = getBacklinkGraph();\nexport const backlinks = graph;\nexport default graph;`;
            }
          },
        };

        updateConfig({
          vite: {
            plugins: [virtualModulesPlugin],
          },
        });

        // 3. Inject Routes (optional)
        if (mergedConfig.injectRoutes !== false) {
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

        // 4. Configure Vite aliases to expose Standard assets
        const moduleDirAliases = path.dirname(fileURLToPath(import.meta.url));
        const packageSrcDir = path.resolve(moduleDirAliases, "../");

        const aliasEntries = {};
        const stylesDir = path.resolve(packageSrcDir, "styles");
        if (fs.existsSync(stylesDir)) {
          aliasEntries["@standard-styles"] = stylesDir;
        }

        const scriptsDir = path.resolve(packageSrcDir, "js");
        if (fs.existsSync(scriptsDir)) {
          aliasEntries["@standard-js"] = scriptsDir;
        }

        const fontsDir = path.resolve(
          packageSrcDir,
          "../",
          "public",
          "assets",
          "fonts",
        );
        if (fs.existsSync(fontsDir)) {
          aliasEntries["@standard-fonts"] = fontsDir;
        }

        if (Object.keys(aliasEntries).length > 0) {
          updateConfig({
            vite: {
              resolve: {
                alias: aliasEntries,
              },
            },
          });
        }

        // 5. Setup Cloudflare Features (delegate to complete integration)
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

        // 6. Add Global Assets (CSS/JS)
        const assetsConfig = mergedConfig.assets || {};

        const cssEntry =
          assetsConfig.css ?? "@zefish/standard/styles/standard.scss";
        if (cssEntry) {
          injectScript("page-ssr", `import "${cssEntry}";`);
        }

        const themeEntry =
          assetsConfig.css ?? "@zefish/standard/styles/standard.theme.scss";
        if (themeEntry) {
          injectScript("page-ssr", `import "${themeEntry}";`);
        }

        const jsEntry = assetsConfig.js ?? "@zefish/standard/js";
        if (jsEntry) {
          injectScript("page", `import "${jsEntry}";`);
        }
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
