/**
 * @stnd/core/module-filter — where a module is allowed to exist.
 *
 * A module manifest can declare:
 *
 *   filter: { domain: "standard.garden" }
 *   filter: { domain: ["standard.garden", "stnd.gd"] }
 *
 * and its routes and hooks then disappear on every other domain. Absent
 * `filter` means "everywhere", so this is opt-in and no existing module
 * changes behavior.
 *
 * The framework deliberately does NOT resolve hostnames. A raw
 * `location.hostname` check would fail the moment you develop on localhost or
 * serve the same app from a short domain. Instead the APP resolves what the
 * current request's canonical domain is (for stnd.gd: the commons garden is
 * always "standard.garden", whatever the machine calls itself; a personal
 * garden is its own hostname) and passes that string in. Matching is then a
 * plain equality — nothing here knows what any of these names mean.
 *
 * Pure functions, no imports: this runs in the Cloudflare worker (route guard)
 * and in the browser (Hook filtering) from the same source.
 */

/**
 * Is a module allowed on this canonical domain?
 *
 * @param {{ filter?: { domain?: string | string[] } } | null | undefined} moduleMeta
 * @param {string | null | undefined} currentDomain - the app-resolved canonical domain
 * @returns {boolean} true when allowed (including when nothing is declared)
 */
export function isModuleOnDomain(moduleMeta, currentDomain) {
  const declared = moduleMeta?.filter?.domain;
  if (declared == null) return true;

  // A domain filter we cannot evaluate must not silently hide the module —
  // failing open keeps an unresolved context (a missing prop, a non-request
  // render) from blanking the UI. The route guard resolves this explicitly.
  if (!currentDomain) return true;

  const allowed = Array.isArray(declared) ? declared : [declared];
  return allowed.includes(currentDomain);
}

/**
 * Build the set of module ids that are NOT allowed on this domain.
 *
 * @param {Array<{ id?: string, filter?: { domain?: string | string[] } }>} modules
 * @param {string | null | undefined} currentDomain
 * @returns {Set<string>}
 */
export function blockedModuleIds(modules, currentDomain) {
  const blocked = new Set();
  for (const m of modules || []) {
    if (m?.id && !isModuleOnDomain(m, currentDomain)) blocked.add(m.id);
  }
  return blocked;
}

/**
 * Turn an Astro route pattern into a matcher for a request pathname.
 *
 * Handles the two forms the module manifests use: `[param]` (one segment) and
 * `[...rest]` (the remainder, possibly empty — `/writer/[...slug]` has to match
 * a bare `/writer` too, which is exactly how a note gets created).
 *
 * @param {string} pattern
 * @returns {RegExp}
 */
export function routePatternToRegex(pattern) {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const source = escaped
    // `/[...name]` → the separator goes WITH the rest parameter, because a rest
    // route matches its own bare prefix: `/writer/[...slug]` has to catch
    // `/writer`, which is the URL that creates a new note. Consuming the slash
    // separately would leave `/writer` unmatched — the one path that matters most.
    .replace(/\/\\\[\\\.\\\.\\\.[^\\]*\\\]/g, "(?:/.*)?")
    // A rest parameter not preceded by a slash (rare, e.g. `/[...slug].md`).
    .replace(/\\\[\\\.\\\.\\\.[^\\]*\\\]/g, "(?:.*)?")
    // `[name]` → exactly one segment
    .replace(/\\\[[^\\]*\\\]/g, "[^/]+");
  // Tolerate the optional trailing slash.
  return new RegExp(`^${source}/?$`);
}

/**
 * Does this pathname belong to a module that is blocked on this domain?
 *
 * @param {string} pathname
 * @param {Array<{ id?: string, routes?: Array<{ path?: string }> }>} modules
 * @param {Set<string>} blocked - from blockedModuleIds()
 * @returns {boolean}
 */
export function isPathBlocked(pathname, modules, blocked) {
  if (!blocked || blocked.size === 0) return false;
  for (const m of modules || []) {
    if (!m?.id || !blocked.has(m.id)) continue;
    for (const route of m.routes || []) {
      if (!route?.path) continue;
      if (routePatternToRegex(route.path).test(pathname)) return true;
    }
  }
  return false;
}
