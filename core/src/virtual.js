export function sanitizeConfig(config) {
  const seen = new WeakSet();
  return JSON.parse(
    JSON.stringify(config, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      if (typeof value === "function") {
        return undefined;
      }
      return value;
    }),
  );
}

/**
 * Generate a virtual module that wires the Standard OS runtime store.
 *
 * Module manifests declare `store:` entries as key → import path mappings:
 *
 *   store: {
 *     user:   "./models/Visitor.js#visitorStore",
 *     search: "./search.js#searchNotes",
 *     locale: "./i18n.js",              // default export
 *   }
 *
 * The loader resolves the file paths and parses the `#exportName` suffix.
 * This generator produces a module that imports each value and calls
 * `provide(key, value)` from the Standard OS runtime store.
 *
 * @param {{ key: string, path: string, export: string|null }[]} storeEntries
 * @returns {string} module source
 */
export function generateStoreModule(storeEntries = []) {
  if (!storeEntries || storeEntries.length === 0) {
    return "// No store entries registered.\n";
  }

  let importStatements = 'import { provide } from "@stnd/store";\n';
  let provideStatements = "";

  storeEntries.forEach((entry, i) => {
    const alias = `__store_${i}`;
    if (entry.export) {
      // Named export: import { visitorStore as __store_0 } from "...";
      importStatements += `import { ${entry.export} as ${alias} } from ${JSON.stringify(entry.path)};\n`;
    } else {
      // Default export: import __store_0 from "...";
      importStatements += `import ${alias} from ${JSON.stringify(entry.path)};\n`;
    }
    provideStatements += `provide(${JSON.stringify(entry.key)}, ${alias});\n`;
  });

  return importStatements + "\n" + provideStatements;
}

export function generateConfigModule(finalConfig) {
  const cleanConfig = sanitizeConfig(finalConfig);
  return `export default ${JSON.stringify(cleanConfig)}`;
}

export function generateModulesModule(runtimeModules) {
  // Build a sanitized client payload with functions removed (safe for JSON serialization)
  const sanitizedModules = runtimeModules.map((m) => {
    const copy = JSON.parse(JSON.stringify(m));
    // Remove internal import path from the public payload
    delete copy.__importPath;
    return copy;
  });

  // Generate import statements for the actual module modules so their functions
  // are available at runtime (useful for SSR route handlers, etc.)
  let importStatements = "";
  const moduleNames = [];
  runtimeModules.forEach((m, i) => {
    if (m.__importPath) {
      const name = `__module_${i}`;
      importStatements += `import ${name} from ${JSON.stringify(m.__importPath)};\n`;
      moduleNames.push(name);
    } else {
      moduleNames.push("undefined");
    }
  });

  // Compose and return the virtual module source:
  // - Import module modules (preserves functions)
  // - Export `modules` (sanitized metadata) for client-side usage
  // - Export `instances` as the actual imported modules for server/runtime use
  return (
    importStatements +
    `\nexport const modules = ${JSON.stringify(sanitizedModules)};\n` +
    `export const instances = [${moduleNames.join(", ")}];`
  );
}

/**
 * Server-only virtual module carrying route patterns for domain-filtered
 * modules (`filter: { domain }` in a manifest). Deliberately separate from
 * `generateModulesModule`/`generateModulesMetadataModule`, whose payload is
 * bundled to the client — route patterns have no reason to ship there.
 * Consumed by the app's own request middleware to 404 a build-time-injected
 * route that shouldn't answer on the current domain.
 *
 * @param {{id: string, filter: object, routes: Array<{path: string}>}[]} domainFilterModules
 * @returns {string} module source
 */
export function generateModuleDomainsModule(domainFilterModules = []) {
  return `export const modules = ${JSON.stringify(domainFilterModules)};`;
}

export function generateModulesMetadataModule(runtimeModules) {
  // Build a sanitized client payload with functions removed (safe for JSON serialization)
  const sanitizedModules = runtimeModules.map((m) => {
    const copy = JSON.parse(JSON.stringify(m));
    // Remove internal import path from the public payload
    delete copy.__importPath;
    return copy;
  });

  return `export const modules = ${JSON.stringify(sanitizedModules)};`;
}

/**
 * Generate a virtual module that statically imports all module styles.
 * This guarantees styles are included at build time (works for both
 * `output: "server"` and `output: "static"`) and avoids relying on
 * injectScript runtime quirks.
 *
 * @param {string[]} styleExtensions
 * @returns {string} module source
 */
export function generateStylesModule(styleExtensions = []) {
  const seen = new Set();
  const imports = [];
  for (const s of styleExtensions || []) {
    if (!s) continue;
    // Skip external URLs — handled separately via config._externalScripts/Base.astro
    if (/^https?:\/\//.test(s) || /^\/\//.test(s)) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    imports.push(`import ${JSON.stringify(s)};`);
  }
  return imports.join("\n") + (imports.length ? "\n" : "");
}

/**
 * Generate a unified virtual module for all module scripts.
 *
 * Manifests declare scripts as a mixed array of strings and descriptor objects:
 *
 *   scripts: [
 *     "boot.js",                               // string → fire-and-forget, runs once
 *     "https://cdn.../lib.min.js",             // string → external CDN, skipped here
 *     { src: "@stnd/client/copy-buttons",      // object → lifecycle-managed
 *       init: "initCopyButtons",               //   called on first load
 *       refresh: "refreshCopyButtons" },       //   called on astro:after-swap
 *     { src: "@stnd/client/image-zoom",
 *       init: "initImageZoom" },               //   no refresh → init reruns on swap too
 *   ]
 *
 * Fire-and-forget strings are imported statically (side-effect only, once).
 * Object entries with `init` are registered in a lifecycle runner that calls
 * init on load and refresh (or init again) on every astro:after-swap.
 *
 * External CDN URLs in string form are excluded — handled via
 * config._externalScripts and rendered as <script src="..."> by Base.astro.
 *
 * @param {(string | { src: string, init?: string, refresh?: string })[]} scriptEntries
 * @returns {string} module source
 */
export function generateScriptsModule(scriptEntries = []) {
  const seenPaths = new Set();
  const fireAndForget = [];
  const lifecycle = [];

  for (const entry of scriptEntries || []) {
    if (!entry) continue;

    if (typeof entry === "string") {
      if (/^https?:\/\//.test(entry) || /^\/\//.test(entry)) continue;
      if (seenPaths.has(entry)) continue;
      seenPaths.add(entry);
      fireAndForget.push(entry);
    } else if (typeof entry === "object" && entry.src) {
      if (seenPaths.has(entry.src)) continue;
      seenPaths.add(entry.src);
      lifecycle.push(entry);
    }
  }

  if (fireAndForget.length === 0 && lifecycle.length === 0) {
    return "// No scripts registered.\n";
  }

  let out = "";

  // Fire-and-forget: static imports, side-effect only, run once
  for (const p of fireAndForget) {
    out += `import ${JSON.stringify(p)};\n`;
  }

  if (lifecycle.length === 0) return out;

  // Lifecycle-managed: import as namespace, register in runner
  out += "\n";
  const registrations = [];
  lifecycle.forEach((entry, i) => {
    const alias = `__script_${i}`;
    out += `import * as ${alias} from ${JSON.stringify(entry.src)};\n`;
    registrations.push(
      `{ src: ${JSON.stringify(entry.src)}, mod: ${alias}` +
        (entry.init ? `, init: ${JSON.stringify(entry.init)}` : "") +
        (entry.refresh ? `, refresh: ${JSON.stringify(entry.refresh)}` : "") +
        ` }`,
    );
  });

  out += `
var __scripts = [${registrations.join(", ")}];

function __runScripts(isSwap) {
  __scripts.forEach(function(entry) {
    try {
      var fn = isSwap
        ? (entry.refresh ? entry.mod[entry.refresh] : (entry.init ? entry.mod[entry.init] : null))
        : (entry.init ? entry.mod[entry.init] : null);
      if (typeof fn === "function") fn();
    } catch (err) {
      console.error("[stnd] script init failed: " + entry.src, err);
    }
  });
}

if (typeof window !== "undefined") {
  __runScripts(false);
  document.addEventListener("astro:after-swap", function() { __runScripts(true); });
}
`;

  return out;
}

export function generateComponentsModule(componentExtensions) {
  let importStatements = "";
  let body = "export const extensions = {};\n";
  let counter = 0;
  Object.entries(componentExtensions || {}).forEach(([zone, entries]) => {
    entries.forEach((entry) => {
      const hasComponent = entry.component && entry.component.trim().length > 0;
      const hasAction = entry.action && entry.action.trim().length > 0;

      const componentName = hasComponent
        ? `__ui_component_${counter}`
        : "undefined";
      const actionName = hasAction ? `__ui_action_${counter}` : "undefined";

      if (hasComponent) {
        importStatements += `import ${componentName} from ${JSON.stringify(entry.component)};\n`;
      }

      if (hasAction) {
        importStatements += `import ${actionName} from ${JSON.stringify(entry.action)};\n`;
      }

      body += `extensions[${JSON.stringify(zone)}] = extensions[${JSON.stringify(zone)}] || [];\n`;
      body += `extensions[${JSON.stringify(zone)}].push({ moduleId: ${JSON.stringify(entry.moduleId)}, trigger: ${entry.trigger ? JSON.stringify(entry.trigger) : "undefined"}, meta: ${JSON.stringify(entry.meta || {})}, component: ${componentName}, action: ${actionName} });\n`;

      counter += 1;
    });
  });
  return importStatements + "\n" + body;
}

export function generateMiddlewareModule(middlewareExtensions) {
  let importStatements =
    'import { sequence, defineMiddleware } from "astro/middleware";\n';
  let middlewareItems = [];
  const sorted = [...(middlewareExtensions || [])].sort(
    (a, b) => a.order - b.order,
  );
  sorted.forEach((entry, index) => {
    const importName = `__mw_${index}`;
    importStatements += `import * as ${importName} from ${JSON.stringify(entry.entrypoint)};\n`;
    const handler = `${importName}.onRequest || ${importName}.default || ${importName}`;
    middlewareItems.push(`defineMiddleware(async (context, next) => {
            const h = ${handler};
            return typeof h === "function" ? h(context, next) : next();
        })`);
  });

  return (
    importStatements +
    `\nexport const onRequest = sequence(\n  ${middlewareItems.join(",\n  ")}\n);\n`
  );
}

export function generateActionsModule(actionsExtensions) {
  let importStatements = "";
  let body = "export const actions = {};\n";
  // Aggregate all actions from modules
  (actionsExtensions || []).forEach((entry, index) => {
    if (entry.entrypoint && entry.entrypoint.trim().length > 0) {
      const importName = `__act_${index}`;
      importStatements += `import * as ${importName} from ${JSON.stringify(entry.entrypoint)};\n`;
      body += `Object.assign(actions, ${importName}.actions || ${importName}.default || ${importName});\n`;
    }
  });
  return importStatements + "\n" + body;
}

export function generateHooksModule(customHooks = [], options = { ssr: true }) {
  // Runtime Hooks Generator
  // Filter hooks based on environment (SSR vs Client)
  // If we are NOT in SSR, skip hooks marked as server-only
  const filteredHooks = customHooks.filter((ext) => {
    if (!options.ssr && ext.server) return false;
    return true;
  });

  // Group custom hooks by hook name
  const hooksMap = {};
  filteredHooks.forEach((ext) => {
    hooksMap[ext.hook] = hooksMap[ext.hook] || [];
    hooksMap[ext.hook].push(ext);
  });

  let importStatements = "";
  let body = "const hooks = {};\n";

  let hookIndex = 0;
  Object.entries(hooksMap).forEach(([hookName, listeners]) => {
    body += `hooks[${JSON.stringify(hookName)}] = [];\n`;
    listeners.forEach((listener) => {
      if (listener.entrypoint && listener.entrypoint.trim().length > 0) {
        const importName = `__hook_handler_${hookIndex++}`;
        importStatements += `import ${importName} from ${JSON.stringify(listener.entrypoint)};\n`;
        body += `hooks[${JSON.stringify(hookName)}].push({ moduleId: ${JSON.stringify(listener.moduleId)}, mod: ${importName} });\n`;
      }
    });
  });

  // Both runners isolate handler failures: one module's throwing handler
  // must not blank out every other module's contribution to the same
  // hook name, and (for runPipeline specifically) must not 500 a page
  // that handler wasn't even trying to act on. A failure is logged and
  // treated as "this handler contributed nothing" — the fan-out/pipeline
  // continues with the remaining handlers.
  const runnerHelper = `
export async function runHook(name, ...args) {
const entries = hooks[name] || [];
const results = [];
for (const entry of entries) {
  const fn = typeof entry.mod === 'function' ? entry.mod : entry.mod?.default;
  if (typeof fn !== 'function') continue;
  try {
    results.push(await fn(...args));
  } catch (err) {
    console.error('[stnd] hook "' + name + '" handler from module "' + entry.moduleId + '" threw:', err);
  }
}
return results;
}

// Sequential transform: threads a single value through every handler
// registered for \`name\`, in order. Each handler receives the current value
// (plus any extra args) and must return the next value — there is no
// implicit "return nothing to pass through unchanged"; a handler that
// wants to leave the value untouched returns it explicitly. This is
// deliberate: a handler that forgets to return should fail loudly
// (the next handler/consumer chokes on undefined) rather than silently
// becoming a no-op. Unlike runHook (fan-out + collect), this is for "let
// each interested module inspect and optionally transform the same
// thing," e.g. a note-render descriptor that a gate/paywall module can
// override without the caller knowing which module (if any) acted.
export async function runPipeline(name, initialValue, ...args) {
const entries = hooks[name] || [];
let value = initialValue;
for (const entry of entries) {
  const fn = typeof entry.mod === 'function' ? entry.mod : entry.mod?.default;
  if (typeof fn !== 'function') continue;
  try {
    value = await fn(value, ...args);
  } catch (err) {
    console.error('[stnd] pipeline "' + name + '" handler from module "' + entry.moduleId + '" threw — value unchanged:', err);
  }
}
return value;
}

export default hooks;
`;
  return importStatements + "\n" + body + "\n" + runnerHelper;
}

export function generateContentModule(contentExtensions) {
  let importStatements = "";
  let body = "export const collections = {};\n";

  (contentExtensions || []).forEach((entry, index) => {
    const importName = `__content_${index}`;
    // pathToFileURL is not needed here as JSON.stringify(path) works for import if it's absolute
    // but 'entrypoint' is absolute path.
    // On windows it needs file://, on mac/linux absolute path needs special handling in import?
    // Vite handles absolute paths if they are in the allowed scope.
    // Better use JSON.stringify(entry.entrypoint).

    importStatements += `import * as ${importName} from ${JSON.stringify(entry.entrypoint)};\n`;

    if (entry.type === "inline") {
      // Inline: content is defined in module.default.content
      body += `
            if (${importName}.default && ${importName}.default.content && typeof ${importName}.default.content === 'object') {
               Object.assign(collections, ${importName}.default.content);
            }
            `;
    } else {
      // External: file exports collections directly or as named exports
      body += `
            // Merge named exports as collections. Exclude default unless it's explicitly 'collections'
            Object.keys(${importName}).forEach(key => {
               if (key !== 'default') {
                  collections[key] = ${importName}[key];
               }
            });
            // If default export exists and looks like a collection map (and is not the module def itself, which it shouldn't be for external content file)
            // We can optionally support export default { home: ... }
            if (${importName}.default && typeof ${importName}.default === 'object') {
               // Verify it's not a module manifest by checking for 'id' + 'name'?
               // Or just assume content file is pure content.
               Object.assign(collections, ${importName}.default);
            }
            `;
    }
  });

  return importStatements + "\n" + body;
}
