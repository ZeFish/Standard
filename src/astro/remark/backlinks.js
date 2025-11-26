import { visit } from "unist-util-visit";

const backlinkStore = new Map();

function slugifySegment(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function normalizeKey(str) {
  if (!str) return null;
  let value = String(str).trim();
  if (!value) return null;
  value = value.replace(/\\/g, "/");
  value = value.replace(/\.mdx?$/i, "");
  value = value.replace(/\.html?$/i, "");
  value = value.replace(/^\.\/+/, "");
  value = value.replace(/^\/+/, "");
  value = value.replace(/\/+$/, "");
  if (!value) return null;
  const segments = value.split("/").map((segment) => slugifySegment(segment));
  return segments.filter(Boolean).join("/");
}

function ensureEntry(key, meta = {}) {
  if (!key) return null;
  if (!backlinkStore.has(key)) {
    backlinkStore.set(key, {
      key,
      meta: { id: key, slug: key },
      inbound: new Set(),
      outbound: new Set(),
    });
  }
  const entry = backlinkStore.get(key);
  entry.meta = {
    ...entry.meta,
    ...meta,
    id: entry.meta?.id ?? key,
    slug: entry.meta?.slug ?? key,
  };
  return entry;
}

export function resetBacklinks() {
  backlinkStore.clear();
}

export function getCollectedBacklinks() {
  return backlinkStore;
}

function serializeBacklinks() {
  const graph = getCollectedBacklinks();
  const result = {};
  for (const [key, entry] of graph.entries()) {
    result[key] = {
      key,
      meta: entry.meta || {},
      inbound: Array.from(entry.inbound || []),
      outbound: Array.from(entry.outbound || []),
    };
  }
  return result;
}

export function getBacklinkGraph() {
  return serializeBacklinks();
}

export function resetBacklinkGraph() {
  resetBacklinks();
}

export default function remarkBacklinks(options = {}) {
  const { baseUrl = "" } = options;

  return function transformer(tree, file) {
    const frontmatter = file.data?.astro?.frontmatter ?? {};
    const entryKey =
      normalizeKey(frontmatter.slug) ||
      normalizeKey(frontmatter.id) ||
      normalizeKey(frontmatter.permalink) ||
      normalizeKey(frontmatter.title) ||
      normalizeKey(file.stem) ||
      normalizeKey(file.path);

    if (!entryKey) {
      return;
    }

    const entryMeta = {
      title: frontmatter.title ?? null,
      slug: normalizeKey(frontmatter.slug) || entryKey,
      id: normalizeKey(frontmatter.id) || entryKey,
      type: frontmatter.type ?? null,
      url: frontmatter.url ?? null,
    };

    const entry = ensureEntry(entryKey, entryMeta);

    const registerTarget = (rawTarget) => {
      if (!rawTarget) return;
      if (/^(https?:|mailto:|tel:|#)/i.test(rawTarget)) return;
      const normalized = normalizeKey(rawTarget);
      if (!normalized || normalized === entryKey) return;

      entry.outbound.add(normalized);
      const targetEntry = ensureEntry(normalized);
      targetEntry.inbound.add(entryKey);
    };

    visit(tree, (node) => {
      if (node.type === "link" && typeof node.url === "string") {
        registerTarget(node.url);
      }

      if (node.type === "text" && typeof node.value === "string") {
        const wikiRegex = /\[\[([^\]]+)\]\]/g;
        let match;
        while ((match = wikiRegex.exec(node.value)) !== null) {
          const [fullMatch, targetPart] = match;
          if (!targetPart) continue;
          const [target] = targetPart.split("|");
          registerTarget(target?.trim());
        }
      }
    });
  };
}
