/**
 * Module Auto-Discovery and Loading System
 *
 * This module handles the discovery, loading, and processing of modules (vertical slices).
 */

import { fileURLToPath, pathToFileURL } from "url";
import { globSync } from "glob";
import * as path from "path";
import { createRequire } from "module";
import Log from "@stnd/log";
import { z } from "zod";

const RouteSchema = z.object({
  path: z.string(),
  entrypoint: z.string(),
  methods: z.array(z.string()).optional(),
  priority: z.number().optional(),
});

const HookSchema = z.union([
  z.string(),
  z
    .object({
      ui: z.string().optional(),
      action: z.string().optional(),
      server: z.boolean().optional(),
      meta: z.record(z.any()).optional(),
    })
    .passthrough(),
]);

const ScriptSchema = z.union([
  z.string(),
  z
    .object({
      src: z.string(),
      init: z.string().optional(),
      inline: z.boolean().optional(),
    })
    .passthrough(),
]);

const MiddlewareSchema = z.union([
  z.string(),
  z
    .object({
      entrypoint: z.string(),
      order: z.number().optional(),
    })
    .passthrough(),
]);

const ModuleManifestSchema = z
  .object({
    id: z.string().min(1, "A module must have an 'id'"),
    name: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    config: z.record(z.any()).optional(),
    routes: z.array(RouteSchema).optional(),
    // Where this module is allowed to exist. `domain` lists the canonical
    // domain(s) it belongs to; the module's routes and hooks disappear
    // everywhere else. The framework never resolves a hostname itself — the
    // app tells the guard which canonical domain the current request is on,
    // so "standard.garden" still matches while developing on localhost.
    // Absent = the module exists everywhere (the default for every module
    // that doesn't opt in).
    filter: z
      .object({
        domain: z.union([z.string(), z.array(z.string())]).optional(),
      })
      .passthrough()
      .optional(),
    hooks: z.record(z.union([HookSchema, z.array(HookSchema)])).optional(),
    styles: z.array(z.string()).optional(),
    scripts: z.array(ScriptSchema).optional(),
    middleware: z.array(MiddlewareSchema).optional(),
    integrations: z
      .union([z.array(z.any()), z.custom((val) => typeof val === "function")])
      .optional(),
    aliases: z.record(z.string()).optional(),
    actions: z.union([z.string(), z.record(z.string())]).optional(),
    store: z.record(z.string()).optional(),
    content: z.union([z.string(), z.record(z.string())]).optional(),
    head: z.array(z.any()).optional(),
    vite: z.any().optional(), // Escape hatch for vite config
  })
  .passthrough();

const DEFAULT_MODULE_PATTERNS = ["./modules/**/*.module.{ts,js}"];

export function buildModulePatterns(config) {
  const folders = Array.isArray(config?.moduleFolder)
    ? config.moduleFolder
    : config?.moduleFolder
      ? [config.moduleFolder]
      : [];

  const cleaned = folders
    .map((f) => (f || "").replace(/^\/*|\/*$/g, ""))
    .filter(Boolean);

  if (cleaned.length > 0) {
    return cleaned.map((folder) => `${folder}/**/*.module.{ts,js}`);
  }

  return DEFAULT_MODULE_PATTERNS;
}

export function discoverModuleFiles(appRoot, patterns) {
  return globSync(patterns, {
    cwd: appRoot,
    absolute: true,
    ignore: ["**/_*/**", "**/.*/**"],
  });
}

export async function loadModules({
  command,
  config,
  finalConfig,
  injectRoute,
  injectScript,
}) {
  const log = Log({ scope: "Modules" });
  const appRoot = fileURLToPath(config.root);
  log.success("Initializing module engine...");

  const modulePatterns = buildModulePatterns(finalConfig);
  const require = createRequire(import.meta.url);

  const discoveredFiles = discoverModuleFiles(appRoot, modulePatterns);

  const resolveModulePath = (idOrPath) => {
    if (path.isAbsolute(idOrPath)) return idOrPath;

    const tryResolve = (id) => {
      try {
        return require.resolve(id);
      } catch {
        return null;
      }
    };

    const isBare =
      typeof idOrPath === "string" &&
      !idOrPath.startsWith("@") &&
      !idOrPath.startsWith(".") &&
      !idOrPath.startsWith("/");
    const prefixed = isBare ? `@stnd/${idOrPath}` : null;
    const resolved =
      tryResolve(idOrPath) || (prefixed ? tryResolve(prefixed) : null);

    if (!resolved && !idOrPath.startsWith(".") && !idOrPath.startsWith("/")) {
      // Quiet warning for local dependencies
    }
    return resolved;
  };

  const moduleMap = new Map();
  const idToPath = new Map();
  const explicitLoadList = Array.isArray(finalConfig.moduleLoad)
    ? finalConfig.moduleLoad
    : [];

  const loadQueue = [
    ...explicitLoadList.map((rawId) => ({ rawId, origin: "explicit" })),
    ...discoveredFiles.map((rawId) => ({ rawId, origin: "discovered" })),
  ];
  const processedPaths = new Set();
  const moduleOrigins = new Map();

  while (loadQueue.length > 0) {
    const batch = loadQueue.splice(0, loadQueue.length);
    const tasks = batch
      .map(({ rawId, origin, sourceModule }) => {
        const resolvedPath = resolveModulePath(rawId);
        if (!resolvedPath || processedPaths.has(resolvedPath)) return null;
        processedPaths.add(resolvedPath);
        return { rawId, origin, sourceModule, resolvedPath };
      })
      .filter(Boolean);

    if (tasks.length === 0) continue;

    const results = await Promise.allSettled(
      tasks.map(async ({ rawId, origin, resolvedPath }) => {
        const moduleDef = await import(pathToFileURL(resolvedPath).href);
        return { rawId, origin, resolvedPath, moduleDef };
      }),
    );

    results.forEach((result, index) => {
      const task = tasks[index];
      if (result.status === "rejected") {
        log.fatal(
          `Failed to load module: ${task.resolvedPath}\nSee: https://stnd.build/manual/diagnostic/module-load-failure`,
          result.reason,
        );
      }

      const { moduleDef, resolvedPath, origin } = result.value;
      const rawDef = moduleDef.default;

      if (task.rawId === "core" || task.rawId === "@stnd/core") {
        let errorMsg = `Invalid dependency: "@stnd/core" is the orchestration engine, not a module.`;
        if (task.sourceModule) {
          errorMsg += `\n  Required by: "${task.sourceModule}" module`;
        }
        errorMsg += `\nSee: https://stnd.build/manual/diagnostic/core-is-not-a-module`;
        log.fatal(errorMsg);
      }

      // STRICT MANIFEST VALIDATION
      const parsedDef = ModuleManifestSchema.safeParse(rawDef);
      if (!parsedDef.success) {
        let errorMsg = `Invalid module manifest format: ${resolvedPath}\n`;
        parsedDef.error.issues.forEach((err) => {
          errorMsg += `  - [${err.path.join(".")}] ${err.message}\n`;
        });
        if (task.sourceModule) {
          errorMsg += `  Required by: "${task.sourceModule}" module\n`;
        }
        errorMsg += `See: https://stnd.build/manual/diagnostic/content-validation`;
        log.fatal(errorMsg);
      }

      const def = parsedDef.data;

      // STRICT ID CHECKING
      if (idToPath.has(def.id)) {
        const existingPath = idToPath.get(def.id);
        if (existingPath !== resolvedPath) {
          log.fatal(
            `Duplicate module ID "${def.id}" detected.` +
              `\n  Path 1: ${existingPath}` +
              `\n  Path 2: ${resolvedPath}` +
              `\n  Every module must have a unique ID.` +
              `\n  See: https://stnd.build/manual/diagnostic/module-duplicate-id`,
          );
        }
      }

      moduleMap.set(resolvedPath, { def, filePath: resolvedPath });
      idToPath.set(def.id, resolvedPath);
      moduleOrigins.set(def.id, origin);

      if (Array.isArray(def.dependencies)) {
        for (const depId of def.dependencies) {
          if (!idToPath.has(depId)) {
            loadQueue.push({
              rawId: depId,
              origin: "dependency",
              sourceModule: def.id,
            });
          }
        }
      }
    });
  }

  // 2. Build Dependency Graph
  const sortedIds = [];
  const adjacency = new Map();
  const indegree = new Map();
  const allIds = Array.from(idToPath.keys());

  allIds.forEach((id) => {
    adjacency.set(id, new Set());
    indegree.set(id, 0);
  });

  for (const moduleId of allIds) {
    const pathStr = idToPath.get(moduleId);
    if (!pathStr) continue;
    const { def } = moduleMap.get(pathStr);
    if (!def?.dependencies) continue;

    for (const rawDep of def.dependencies) {
      let depId = rawDep;
      if (!idToPath.has(depId)) {
        const resolvedDepPath = resolveModulePath(rawDep);
        if (resolvedDepPath && moduleMap.has(resolvedDepPath)) {
          depId = moduleMap.get(resolvedDepPath).def.id;
        }
      }

      if (!idToPath.has(depId)) {
        log.fatal(
          `Module "${moduleId}" has unresolved dependency: "${rawDep}"\nSee: https://stnd.build/manual/diagnostic/module-dependency-unresolved`,
        );
      }

      if (!adjacency.has(depId)) adjacency.set(depId, new Set());
      adjacency.get(depId).add(moduleId);
      indegree.set(moduleId, (indegree.get(moduleId) || 0) + 1);
    }
  }

  const ready = allIds.filter((id) => (indegree.get(id) || 0) === 0);
  while (ready.length > 0) {
    ready.sort();
    const nextId = ready.shift();
    sortedIds.push(nextId);
    const dependents = adjacency.get(nextId);
    if (!dependents) continue;
    for (const dependent of dependents) {
      const nextCount = (indegree.get(dependent) || 0) - 1;
      indegree.set(dependent, nextCount);
      if (nextCount === 0) ready.push(dependent);
    }
  }

  if (sortedIds.length !== allIds.length) {
    log.fatal(
      "Circular dependency detected in module graph.\nSee: https://stnd.build/manual/diagnostic/module-dependency-circular",
    );
  }

  // 3. Process
  const modules = {
    runtime: [],
    // Server-only: {id, filter, routes} for modules declaring `filter.domain`.
    // See the comment at the injectRoute() call site for why this exists
    // separately from `runtime` (which is the client-bundled payload).
    domainFilters: [],
    config: [],
    aliases: {},
    ui: {},
    middleware: [],
    integrations: [],
    actions: [],
    hooks: [], // formerly lifecycleExtensions
    content: [],
    store: [],
    styles: [],
    scripts: [],
    head: [],
    optimizeDeps: [],
    icon: { tokens: {}, library: null }, // merged token contributions from modules
  };

  // Tracks whether each hook name has been classified as a UI/action-zone
  // contribution (routed to virtual:stnd/components, no server filtering)
  // or a logic hook (routed to virtual:stnd/hooks, supports `server: true`).
  // A hook name must mean one thing consistently — see the fatal error
  // thrown in the def.hooks block below.
  const hookKindByName = new Map();

  for (const moduleId of sortedIds) {
    const pathStr = idToPath.get(moduleId);
    const { def, filePath } = moduleMap.get(pathStr);
    const moduleDir = path.dirname(filePath);

    if (def.status === "disabled") continue;

    // Environment-gated modules: skip if command doesn't match.
    // Supports string ("dev") or array (["dev", "preview"]).
    if (def.environment) {
      const envs = Array.isArray(def.environment)
        ? def.environment
        : [def.environment];
      if (!envs.includes(command)) {
        log.debug(
          `[${def.name}] skipped (environment: ${def.environment}, command: ${command})`,
        );
        continue;
      }
    }

    Log.success(def.name, "");

    if (def.config) {
      modules.config.push({ moduleId: def.id, value: def.config });
    }

    // ── def.store ──────────────────────────────────────────────
    // Declarative provide/inject for the Standard OS runtime store.
    //
    //   store: {
    //     user:   "./models/Visitor.js#visitorStore",
    //     search: "./search.js#searchNotes",
    //     locale: "./i18n.js",              // default export
    //   }
    //
    // The loader resolves file paths and parses the #exportName suffix.
    // The virtual module system generates the import + provide() calls.
    if (def.store) {
      Object.entries(def.store).forEach(([key, value]) => {
        let filePath, exportName;
        if (typeof value === "string") {
          const hashIndex = value.lastIndexOf("#");
          if (hashIndex > 0) {
            filePath = value.slice(0, hashIndex);
            exportName = value.slice(hashIndex + 1);
          } else {
            filePath = value;
            exportName = null;
          }
        } else if (value && typeof value === "object") {
          filePath = value.from || value.path;
          exportName = value.export || null;
        }

        if (filePath) {
          const resolved = filePath.startsWith("@")
            ? filePath
            : path.resolve(moduleDir, filePath);
          modules.store.push({ key, path: resolved, export: exportName });
        }
      });
    }

    if (def.routes) {
      def.routes.forEach((route) => {
        const entrypoint = pathToFileURL(
          path.resolve(moduleDir, route.entrypoint),
        ).href;
        injectRoute({ pattern: route.path, entrypoint });
      });
    }

    // A module declaring `filter: { domain }` needs its route PATTERNS at
    // request time, server-side, to turn "hidden in the UI" into "the URL
    // itself answers 404" (routes are injected once here, at build time, so
    // hiding a button never stops the URL from working). This is collected
    // separately from `modules.runtime` because that array is the CLIENT
    // payload and deliberately strips `routes` (see the destructuring a few
    // hundred lines down) — bundling every route pattern to the browser for
    // a check only the server needs would be pure waste.
    if (def.filter) {
      modules.domainFilters.push({
        id: def.id,
        filter: def.filter,
        routes: def.routes || [],
      });
    }

    if (def.styles) {
      def.styles.forEach((style) => {
        // Preserve external URLs (https:// or protocol-relative //) as-is so they don't get path-resolved into local files.
        if (/^https?:\/\//.test(style) || /^\/\//.test(style)) {
          modules.styles.push(style);
        } else {
          const pathRef = style.startsWith("@")
            ? style
            : path.resolve(moduleDir, style);
          modules.styles.push(pathRef);
        }
      });
    }

    if (def.scripts) {
      def.scripts.forEach((script) => {
        if (typeof script === "string") {
          if (/^https?:\/\//.test(script)) {
            // External CDN URLs are kept as-is.
            // standard.js handles them with a <script src> tag.
            modules.scripts.push(script);
          } else {
            const pathRef = script.startsWith("@")
              ? script
              : path.resolve(moduleDir, script);
            modules.scripts.push(pathRef);
          }
        } else if (typeof script === "object" && script.src) {
          // Lifecycle-managed: { src, init?, refresh? }
          const resolvedSrc = script.src.startsWith("@")
            ? script.src
            : path.resolve(moduleDir, script.src);
          modules.scripts.push({ ...script, src: resolvedSrc });
        }
      });
    }

    if (def.middleware) {
      def.middleware.forEach((entry) => {
        const entrypoint = path.resolve(
          moduleDir,
          typeof entry === "string" ? entry : entry.entrypoint,
        );
        const order = typeof entry.order === "number" ? entry.order : 0;
        modules.middleware.push({ moduleId: def.id, order, entrypoint });
      });
    }

    if (def.actions) {
      modules.actions.push({
        moduleId: def.id,
        entrypoint: path.resolve(moduleDir, def.actions),
      });
    }

    // ── def.hooks ───────────────────────────────────────────────
    // The single unified API for all module contributions:
    //
    //   hooks: {
    //     // UI into zones (use `ui` key)
    //     "stnd:base":   ["./Toast.astro"],
    //     "stnd:client": [{ ui: "@stnd/lab/Lab.svelte", meta: { "client:load": true } }],
    //
    //     // Lifecycle hooks and JS action handlers
    //     "astro:build:done": [{ action: "./on-build.js" }],
    //     "launcher:action":  [{ action: "./actions/nav.js" }],
    //
    //     // Launcher views (ui entries in custom hook names)
    //     "launcher:view": [{ ui: "./views/ShareView.svelte", trigger: "::share", meta: {...} }],
    //   }
    //
    // Resolution rules:
    //   - astro:* hooks OR .js/.ts entries → runtime lifecycle hooks
    //   - Everything else → UI zone contributions (rendered by Hook.astro)
    //   - Paths starting with "@" are kept as Vite aliases
    //   - Plain strings are shorthand for { ui: "path" }
    //   - `ui` is preferred, `component` accepted for backward compat
    if (def.hooks) {
      const resolvePath = (p) =>
        p && p.startsWith("@") ? p : p ? path.resolve(moduleDir, p) : null;

      Object.entries(def.hooks).forEach(([hookName, value]) => {
        const entries = Array.isArray(value) ? value : [value];
        entries.forEach((entry) => {
          if (!entry) return;

          // Normalize: plain string → { ui: "path" }
          const normalized = typeof entry === "string" ? { ui: entry } : entry;

          const entryPath =
            normalized.ui || normalized.component || normalized.action;
          if (!entryPath) return;

          const isLifecycleOrAction =
            hookName.startsWith("astro:") ||
            (!hookName.startsWith("launcher:") &&
              !hookName.endsWith(":action") &&
              entryPath.match(/\.(js|ts|mjs|cjs)$/i));

          // A hook name must mean one thing consistently: either a logic
          // hook (virtual:stnd/hooks, runHook/runPipeline) or a UI/action
          // zone (virtual:stnd/components, <Hook zone="..."> + direct
          // extensions[zone] reads). These are two disconnected virtual
          // modules — silently splitting one name across both means half
          // the registered handlers are invisible to whichever consumer
          // asked for the other kind. Fail loud instead, same as duplicate
          // module IDs and launcher trigger collisions.
          const kind = isLifecycleOrAction ? "logic" : "ui";
          const previousKind = hookKindByName.get(hookName);
          if (previousKind && previousKind !== kind) {
            log.fatal(
              `Hook "${hookName}" is registered as both a logic hook and a UI/action zone contribution.` +
                `\n  Module "${def.id}" registered a ${kind} entry (${entryPath}), but "${hookName}" was already classified as ${previousKind} by an earlier module.` +
                `\n  A hook name must consistently resolve to one kind: logic hooks are ".js/.ts" entries not prefixed "launcher:" or suffixed ":action"; everything else is a UI/action zone.` +
                `\n  Rename this hook or make its entry type consistent with the other registrations.` +
                `\n  See: https://stnd.build/manual/diagnostic/hook-kind-mismatch`,
            );
          }
          hookKindByName.set(hookName, kind);

          if (isLifecycleOrAction) {
            modules.hooks.push({
              moduleId: def.id,
              hook: hookName,
              entrypoint: path.resolve(moduleDir, entryPath),
              server: !!normalized.server,
            });
          } else {
            // UI zone contribution. `server` is meaningless here: this
            // pool compiles into virtual:stnd/components, which — unlike
            // virtual:stnd/hooks — has no SSR/client split (see
            // generateComponentsModule), so a `server: true` flag can
            // never be honored. Fail loud rather than silently ignoring
            // it and giving false confidence that server-only code stays
            // out of the client bundle.
            if (normalized.server) {
              log.fatal(
                `Hook "${hookName}" (module "${def.id}") sets "server: true", but this hook classifies as a UI/action zone contribution, which has no server/client split.` +
                  `\n  "server: true" only has an effect on logic hooks (".js/.ts" entries not prefixed "launcher:" or suffixed ":action").` +
                  `\n  Remove "server: true", or rename this hook off the "launcher:"/":action" pattern if it must stay out of the client bundle.` +
                  `\n  See: https://stnd.build/manual/diagnostic/hook-server-flag-ignored`,
              );
            }
            if (!modules.ui[hookName]) modules.ui[hookName] = [];
            modules.ui[hookName].push({
              moduleId: def.id,
              component: resolvePath(normalized.ui || normalized.component),
              action: resolvePath(normalized.action),
              meta: normalized.meta || {},
              trigger: normalized.trigger,
            });
          }
        });
      });
    }

    if (def.aliases) {
      Object.entries(def.aliases).forEach(([alias, target]) => {
        modules.aliases[alias] = target.startsWith(".")
          ? path.resolve(moduleDir, target)
          : target;
      });
    }

    if (def.content) {
      modules.content.push({
        type: typeof def.content === "string" ? "external" : "inline",
        entrypoint:
          typeof def.content === "string"
            ? path.resolve(moduleDir, def.content)
            : filePath,
      });
    }

    if (def.optimizeDeps) {
      modules.optimizeDeps.push(...def.optimizeDeps);
    }

    // ── def.icon ────────────────────────────────────────────────
    // Module-level icon token contributions.
    //
    //   icon: {
    //     library: "lucide",
    //     tokens: {
    //       search: "lucide:search",
    //       home:   "lucide:house",
    //     },
    //   }
    //
    // Tokens are merged in module resolution order (later modules win).
    // Apps can ship a *.module.js that sets their preferred icon library
    // without touching astro.config.mjs.
    if (def.icon) {
      if (def.icon.tokens && typeof def.icon.tokens === "object") {
        Object.assign(modules.icon.tokens, def.icon.tokens);
      }
      if (def.icon.library) {
        modules.icon.library = def.icon.library;
      }
    }

    // Collect integrations: supports an array of Astro integrations or a
    // factory function (config) => AstroIntegration[]. Factory functions are
    // resolved in standard.js after finalConfig is fully merged.
    if (def.integrations) {
      if (typeof def.integrations === "function") {
        modules.integrations.push(def.integrations);
      } else if (Array.isArray(def.integrations)) {
        modules.integrations.push(...def.integrations);
      }
    }

    const {
      routes,
      styles,
      scripts,
      head,
      middleware,
      integrations,
      hooks,
      dependencies,
      aliases,
      content,
      icon,
      ...clientPayload
    } = def;
    // Only include in runtime if the module has client-usable properties beyond pure metadata.
    // Pure metadata keys (id, name, description, status) don't justify importing the module file,
    // which would pull server-only deps (e.g. @astrojs/sitemap → Node streams) into the bundle.
    const METADATA_ONLY_KEYS = new Set(["id", "name", "description", "status"]);
    if (
      Object.keys(clientPayload).filter((k) => !METADATA_ONLY_KEYS.has(k))
        .length > 0
    ) {
      clientPayload.__importPath = pathToFileURL(filePath).href;
      modules.runtime.push(clientPayload);
    }
  }

  return { modules, loadedPaths: Array.from(moduleMap.keys()) };
}
