/**
 * @stnd/core Astro Integration
 *
 * The core orchestration layer that bootstraps the Standard module system,
 * manages assets, virtual modules, and proxies lifecycle hooks.
 */
import { fileURLToPath, pathToFileURL } from "url";
import * as path from "path";
import * as fs from "fs";
import { createRequire } from "module";
import svelte from "@astrojs/svelte";
import Log from "@stnd/log";
import { deepMerge, mergeModuleConfigs } from "@stnd/utils";
import { loadModules } from "./src/loader.js";
import {
  generateConfigModule,
  generateModulesModule,
  generateModulesMetadataModule,
  generateModuleDomainsModule,
  generateStylesModule,
  generateScriptsModule,
  generateComponentsModule,
  generateMiddlewareModule,
  generateActionsModule,
  generateHooksModule,
  generateContentModule,
  generateStoreModule,
} from "./src/virtual.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function standard(options = {}) {
  const startTime = performance.now();
  const log = Log({
    scope: "Core",
    level: options?.debug ? "DEBUG" : undefined,
  });
  let allLifecycleExtensions = [];

  /** Helper to filter registered hooks by name */
  const activeHooks = (name) => {
    return allLifecycleExtensions.filter((e) => e.hook === name);
  };

  /** Helper to import and execute a hook from a module */
  const proxyHook = async (hookExt, args) => {
    try {
      const runner = await import(pathToFileURL(hookExt.entrypoint).href);
      const fn = runner.onRequest || runner.default || runner.handler || runner;
      if (typeof fn === "function") {
        await fn(args);
      }
    } catch (e) {
      log.error(
        `Failed to execute module hook [${hookExt.hook}] from [${hookExt.moduleId}]:`,
        e,
      );
    }
  };

  const integration = {
    name: "@stnd/core",
    hooks: {
      "astro:config:setup": async ({
        command,
        config,
        updateConfig,
        injectScript,
        injectRoute,
        addMiddleware,
        addWatchFile,
        addDevToolbarApp,
      }) => {
        log.debug("Phase: [config:setup] starting...");

        // 1. Prepare Base Configuration
        const safeConfig = {};
        const unsafeKeys = [
          "vite",
          "integrations",
          "server",
          "adapter",
          "markdown",
          "build",
          "_cloudflare",
        ];
        for (const key in config) {
          if (!unsafeKeys.includes(key)) safeConfig[key] = config[key];
        }

        // Gold Standard defaults — every @stnd site ships with these.
        // Users extend via `moduleLoad`, opt-out via `moduleExclude`.
        const GOLD_STANDARD_MODULES = [
          // System UI — every page gets these
          "@stnd/modules/toast",
          "@stnd/modules/confetti",
          "@stnd/modules/lab",
          "@stnd/modules/launcher",

          // Styles & fonts
          "@stnd/modules/styles",
          "@stnd/fonts/inter",
          "@stnd/fonts/source-serif-4",
          "@stnd/fonts/ibm-plex",

          // Client enhancements
          "@stnd/modules/copy-buttons",
          "@stnd/modules/image-zoom",
          "@stnd/modules/scroll-wrappers",

          // Content enhancements
          "@stnd/modules/mermaid",
          "@stnd/modules/math",
          "@stnd/modules/prism",

          // SEO & web standards
          "@stnd/modules/robots",
          "@stnd/modules/headers",
          "@stnd/modules/manifest",
          "@stnd/modules/sitemap",

          // Icon & Lottie asset delivery
          "@stnd/icon/module",
        ];

        const baseOptions = {
          moduleFolder: "modules",
        };

        // Merge everything except moduleLoad (we handle that ourselves)
        const {
          moduleLoad: userModuleLoad,
          moduleExclude: userModuleExclude,
          ...restOptions
        } = options || {};

        // Create excludeSet early to conditionally register toolbar apps
        const excludeSet = new Set(userModuleExclude || []);

        // Register Standard Debug Toggle in Astro Dev Bar
        addDevToolbarApp({
          id: "stnd-debug",
          name: "Standard Debug",
          icon: "puzzle",
          entrypoint: fileURLToPath(
            new URL("./src/dev-toolbar/debug-toggle.js", import.meta.url),
          ),
        });
        // Only register Lab toggle if lab module is loaded
        if (!excludeSet.has("@stnd/modules/lab")) {
          addDevToolbarApp({
            id: "stnd-lab",
            name: "Standard Lab",
            icon: "robot",
            entrypoint: fileURLToPath(
              new URL("./src/dev-toolbar/lab-toggle.js", import.meta.url),
            ),
          });
        }
        const finalConfig = deepMerge({}, baseOptions, safeConfig, restOptions);

        // Build the final module list: gold standard + user additions - exclusions
        const goldModules = GOLD_STANDARD_MODULES.filter(
          (m) => !excludeSet.has(m),
        );
        const userModules = (userModuleLoad || []).filter(
          (m) => !GOLD_STANDARD_MODULES.includes(m),
        );
        finalConfig.moduleLoad = [...goldModules, ...userModules];
        globalThis.__STANDARD_CONFIG__ = finalConfig;

        // Keep user-level config separate so it can override module contributions
        const userConfig = { ...restOptions };

        const { modules, loadedPaths } = await loadModules({
          command,
          config,
          finalConfig,
          injectRoute,
          injectScript,
        });

        // Merge module config contributions (in load order), then user config on top.
        // deepMerge concatenates arrays (e.g. nav items) and recurses objects.
        if (modules.config.length > 0) {
          const merged = mergeModuleConfigs(
            finalConfig,
            modules.config,
            userConfig,
          );
          Object.assign(finalConfig, merged);
          globalThis.__STANDARD_CONFIG__ = finalConfig;
          log.debug(
            `Config: merged contributions from ${modules.config.length} module(s)`,
          );
        }

        // Merge module icon token contributions.
        // Module tokens are the base layer; user-level tokens (from standard() config) win on top.
        // Resolution priority: user tokens > module tokens > built-in tokens.js defaults
        if (
          modules.icon &&
          (Object.keys(modules.icon.tokens).length > 0 || modules.icon.library)
        ) {
          finalConfig.icon = finalConfig.icon ?? {};
          finalConfig.icon.tokens = {
            ...modules.icon.tokens, // module contributions (base)
            ...(finalConfig.icon.tokens ?? {}), // user-level overrides win
          };
          if (modules.icon.library && !finalConfig.icon.library) {
            finalConfig.icon.library = modules.icon.library;
          }
          globalThis.__STANDARD_CONFIG__ = finalConfig;
        }

        // Actions Check: If modules provide actions, ensure the project has the bridge file
        if (modules.actions.length > 0) {
          const rootPath = fileURLToPath(config.root);
          // Check for index.ts, index.js or index.mjs
          const hasActionsFile = [".ts", ".js", ".mjs"].some((ext) =>
            fs.existsSync(path.resolve(rootPath, `src/actions/index${ext}`)),
          );

          if (!hasActionsFile) {
            log.warn(
              `Modules define actions but 'src/actions/index.ts' is missing.\n` +
                `      Actions will trigger 404 errors without this bridge file.\n` +
                `      See fix: https://stnd.build/manual/5-reference/actions-404`,
            );
          }
        }

        // Watch System: Trigger reload when manifest modify
        loadedPaths.forEach((p) => {
          addWatchFile(p);
        });

        // Watch System: Watch the module folder for new additions
        if (finalConfig.moduleFolder) {
          const moduleRoot = path.resolve(
            fileURLToPath(config.root),
            finalConfig.moduleFolder,
          );
          addWatchFile(moduleRoot);
        }

        allLifecycleExtensions = modules.hooks;

        // Vault support is owned by @stnd/loader-vault (the content-collection
        // loader apps actually use). Core's old `vault:` option built a second,
        // parallel index — removed. One vault owner. See ADR-0001 context.

        // 3. Register Middlewares
        if (addMiddleware && modules.middleware.length > 0) {
          const sortedMiddleware = [...modules.middleware].sort(
            (a, b) => (a.order || 0) - (b.order || 0),
          );
          sortedMiddleware.forEach((mw) => {
            addMiddleware({
              entrypoint: mw.entrypoint,
              order: (mw.order || 0) < 0 ? "pre" : "post",
            });
          });
        }

        // 4. Vite & Workspace Aliases (Universal Resolution)
        //
        // @stnd/core is the sanctioned "meta-package": its own code imports only
        // @stnd/log + @stnd/utils, but it *declares* the whole framework as
        // dependencies so a single `install @stnd/core` brings everything. The
        // alias list is derived from those declared @stnd/* deps, so it can never
        // drift from what the package actually ships. (See packages/README.)
        const require = createRequire(import.meta.url);
        const corePkg = JSON.parse(
          fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"),
        );
        const packages = Object.keys(corePkg.dependencies || {})
          .filter((dep) => dep.startsWith("@stnd/"))
          .map((dep) => dep.slice("@stnd/".length));

        const aliases = packages.reduce((acc, pkg) => {
          const pkgName = `@stnd/${pkg}`;
          try {
            const pkgMain = require.resolve(`${pkgName}/package.json`);
            const pkgDir = path.dirname(pkgMain);
            acc[pkgName] = pkgDir;
            acc[`${pkgName}/`] = path.join(pkgDir, "/");
          } catch (e) {
            // Fallback for monorepo development: assume packages/pkg exists
            const fallbackPath = path.resolve(__dirname, `../${pkg}`);
            log.debug(
              `Package ${pkgName} resolved via monorepo fallback: ${fallbackPath}`,
            );
            acc[pkgName] = fallbackPath;
            acc[`${pkgName}/`] = path.join(fallbackPath, "/");
          }
          return acc;
        }, {});

        Object.assign(aliases, modules.aliases || {});

        // @modules — canonical alias for the app's vertical slice folder
        // Every @stnd/core app gets this for free. No configuration needed.
        if (finalConfig.moduleFolder) {
          const moduleRoot = path.resolve(
            fileURLToPath(config.root),
            finalConfig.moduleFolder,
          );
          aliases["@modules"] = moduleRoot;
          aliases["@modules/"] = moduleRoot + "/";
        }

        // 5. Virtual Modules — must be registered via updateConfig so the
        // module lands in the actual merged Vite config, not a stale reference.
        const virtualModuleStnd = {
          name: "vite-module-stnd",
          resolveId(id, importer, options) {
            if (!id.startsWith("virtual:stnd/")) return;
            // virtual:stnd/scripts and virtual:stnd/store are imported from
            // <script> tags (client-side), so the browser fetches the URL
            // directly in dev mode.  The \0 prefix gets encoded as __x00__
            // in the URL and the dev server doesn't decode it back → 404.
            // All other virtual modules are imported from the frontmatter
            // (SSR/Vite context) where \0 works fine.
            if (id === "virtual:stnd/scripts") return "virtual-stnd/scripts";
            if (id === "virtual:stnd/store") return "virtual-stnd/store";

            // Hooks need environment-specific IDs so we can filter server-only hooks
            if (id === "virtual:stnd/hooks") {
              return options?.ssr
                ? "\0virtual-stnd/hooks-server"
                : "\0virtual-stnd/hooks-client";
            }

            return "\0" + id.replace("virtual:", "virtual-");
          },
          load(id) {
            const appHooks = modules.hooks.filter(
              (e) => !e.hook.startsWith("astro:"),
            );
            if (id === "\0virtual-stnd/config")
              return generateConfigModule(finalConfig);
            if (id === "\0virtual-stnd/modules")
              return generateModulesModule(modules.runtime);
            if (id === "\0virtual-stnd/modules-metadata")
              return generateModulesMetadataModule(modules.runtime);
            if (id === "\0virtual-stnd/module-domains")
              return generateModuleDomainsModule(modules.domainFilters);
            if (id === "\0virtual-stnd/components")
              return generateComponentsModule(modules.ui);
            if (id === "\0virtual-stnd/middleware")
              return generateMiddlewareModule(modules.middleware);
            if (id === "\0virtual-stnd/actions")
              return generateActionsModule(modules.actions);
            if (id === "\0virtual-stnd/hooks-server")
              return generateHooksModule(appHooks, { ssr: true });
            if (id === "\0virtual-stnd/hooks-client")
              return generateHooksModule(appHooks, { ssr: false });
            if (id === "\0virtual-stnd/styles")
              return generateStylesModule(modules.styles);
            if (id === "virtual-stnd/scripts")
              return generateScriptsModule(modules.scripts);
            if (id === "virtual-stnd/store")
              return generateStoreModule(modules.store);
            if (id === "\0virtual-stnd/content")
              return generateContentModule(modules.content);
          },
        };

        // Resolve module integrations: factory functions receive the fully merged
        // finalConfig (including all icon token contributions); plain integration
        // objects are used as-is.
        const moduleIntegrations = [
          svelte(),
          ...modules.integrations
            .flatMap((entry) =>
              typeof entry === "function" ? entry(finalConfig) : [entry],
            )
            .filter(Boolean),
        ];

        updateConfig({
          // Speed is a respect (Standard value #2): every Standard app prefetches
          // links in the viewport and speculatively prerenders them. These are
          // root-level Astro config options — setting them on the integration
          // object (as before) was a silent no-op; Astro only reads `name` +
          // `hooks` off an integration. `clientPrerender` is an Astro experimental
          // flag, valid in the pinned Astro 7.x; it degrades gracefully in
          // browsers without the Speculation Rules API.
          prefetch: {
            prefetchAll: true,
            defaultStrategy: "viewport",
          },
          experimental: {
            clientPrerender: true,
          },
          integrations: moduleIntegrations,
          vite: {
            plugins: [virtualModuleStnd],
            resolve: {
              alias: aliases,
              dedupe: ["svelte"],
              // Indispensable en Monorepo pour que @stnd/* reste @stnd/* et soit bundlé
              // preserveSymlinks: true, -> dont apply it or common-ancestor-path will scream
              extensions: [
                ".astro",
                ".svelte.js",
                ".svelte.ts",
                ".mjs",
                ".js",
                ".ts",
                ".jsx",
                ".tsx",
                ".json",
              ],
            },
            optimizeDeps: {
              entries: (modules.runtime || [])
                .map((m) =>
                  m.__importPath ? fileURLToPath(m.__importPath) : null,
                )
                .filter(Boolean),
              include: modules.optimizeDeps || [],
              exclude: [...packages.map((p) => `@stnd/${p}`), "cloudflare:workers"],
            },
            ssr: {
              noExternal: ["@stnd/*"],
            },
          },
        });

        // 6. Asset Injection (Virtual Style Module + Individual Scripts)
        // Collect external CDN script URLs into finalConfig so the virtual
        // config module exposes them. Base.astro renders them as <script> / <link>
        // tags directly in <head>, which is the only reliable path in
        // Astro 6 beta + Cloudflare adapter dev mode (where the injectScript
        // API's pipeline is bypassed entirely by the NonRunnablePipeline).
        // Separate external CDN string URLs from local/object entries.
        // External strings become <script src> tags via Base.astro.
        // Everything else (local strings + objects) goes into virtual:stnd/scripts.
        const externalScripts = [
          ...new Set(
            (modules.scripts || []).filter(
              (s) => typeof s === "string" && /^https?:\/\//.test(s),
            ),
          ),
        ];
        const externalStyles = [
          ...new Set(
            (modules.styles || []).filter((s) => /^https?:\/\//.test(s)),
          ),
        ];
        // Keep only local styles for static imports — external styles via <link> tags in head.
        const localStyles = (modules.styles || []).filter(
          (s) => !/^https?:\/\//.test(s),
        );
        modules.styles = localStyles;

        if (externalScripts.length > 0) {
          finalConfig._externalScripts = externalScripts;
        }
        if (externalStyles.length > 0) {
          finalConfig._externalStyles = externalStyles;
        }
        if (externalScripts.length > 0 || externalStyles.length > 0) {
          globalThis.__STANDARD_CONFIG__ = finalConfig;
        }

        log.debug(
          `Assets: ${modules.styles.length} styles, ${modules.scripts.length} scripts, ${modules.head.length} head tags`,
        );

        // Inject the virtual styles module automatically (Clean & SSR-Safe)
        if (modules.styles.length > 0) {
          injectScript("page-ssr", 'import "virtual:stnd/styles";');
          injectScript("page", 'import "virtual:stnd/styles";');
        }

        // Inject the Standard OS runtime store (provide/inject)
        // Must run before components mount so inject() calls find their values.
        if (modules.store.length > 0) {
          injectScript("page", 'import "virtual:stnd/store";');
        }

        // Inject virtual:stnd/scripts once — it handles both fire-and-forget
        // string imports and lifecycle-managed object entries in one bundle.
        if (modules.scripts.length > 0) {
          injectScript("page", 'import "virtual:stnd/scripts";');
        }

        // External CDN scripts can't go through Vite's bundler.
        // Inject via `head-inline` so they render for ALL routes.
        externalScripts.forEach((s) => {
          injectScript(
            "head-inline",
            `{const _s=document.createElement("script");_s.src=${JSON.stringify(s)};document.head.appendChild(_s);}`,
          );
        });

        modules.head.forEach((h) => {
          if (h.type === "script") {
            injectScript("page-ssr", `import ${JSON.stringify(h.content)};`);
          } else if (h.type === "inline") {
            injectScript("head-inline", h.content);
          }
        });

        log.debug("Phase: [config:setup] success");
      },

      // --- Hook Proxying ---
      "astro:config:done": async (args) => {
        for (const h of activeHooks("astro:config:done"))
          await proxyHook(h, args);
      },
      "astro:server:setup": async (args) => {
        for (const h of activeHooks("astro:server:setup"))
          await proxyHook(h, args);
      },
      "astro:server:start": async (args) => {
        const { address } = args;
        const elapsed = Math.round(performance.now() - startTime);
        const url = `http://${address.address === "0.0.0.0" || address.address === "::" ? "localhost" : address.address}:${address.port}`;
        log.bannerSuccess(`Kernel Ready: ${url} (${elapsed}ms)`);
        for (const h of activeHooks("astro:server:start"))
          await proxyHook(h, args);
      },
      "astro:build:start": async (args) => {
        for (const h of activeHooks("astro:build:start"))
          await proxyHook(h, args);
      },
      "astro:build:setup": async (args) => {
        for (const h of activeHooks("astro:build:setup"))
          await proxyHook(h, args);
      },
      "astro:build:done": async (args) => {
        for (const h of activeHooks("astro:build:done"))
          await proxyHook(h, args);
      },
    },
  };

  return integration;
}
