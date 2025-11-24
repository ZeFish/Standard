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

export default function standard(options = {}) {
  // Load site config if specified in options
  let siteConfig = {};
  const configPath = options.configPath || "site.config.yml";

  if (configPath && fs.existsSync(configPath)) {
    try {
      const configFile = fs.readFileSync(configPath, "utf8");
      siteConfig = yaml.load(configFile) || {};
    } catch (error) {
      console.warn(
        `[standard] Warning: Could not parse config file (${configPath}): ${error.message}`,
      );
    }
  } else if (configPath) {
    console.log(`[standard] Config file not found: ${configPath}`);
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
  };

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

        // 4. Add Global Styles (if needed)
        // injectScript('page', `import '@zefish/standard/css';`);
      },
    },
  };
}
