// src/eleventy/manifest.js

/**
 * Web App Manifest Generator
 *
 * @component Standard Framework Manifest Plugin
 * @category 11ty Plugins
 */

import Logger from "./../logger.js";

export default function Manifest(eleventyConfig, site = {}) {
  // Read user config
  const user = site.standard?.manifest || {};

  // Early return if explicitly disabled
  const enabled = user.enabled ?? true;
  if (enabled === false) return;

  const logger = Logger({
    scope: "Manifest",
    verbose: site.standard?.verbose || false,
  });

  // Defaults
  const defaults = {
    filename: "site.webmanifest",
    display: "standalone",
    orientation: "any",
    theme_color: "#000000",
    background_color: "#ffffff",
    icons: [],
    categories: [],
    screenshots: [],
    shortcuts: [],
    start_url: "/",
  };

  // Non-text fields with defaults (arrays/strings)
  const filename = user.filename ?? defaults.filename;
  const display = user.display ?? defaults.display;
  const orientation = user.orientation ?? defaults.orientation;
  const theme_color = user.theme_color ?? defaults.theme_color;
  const background_color = user.background_color ?? defaults.background_color;
  const start_url = user.start_url ?? defaults.start_url;

  const icons = Array.isArray(user.icons) ? user.icons : defaults.icons;
  const categories = Array.isArray(user.categories)
    ? user.categories
    : defaults.categories;
  const screenshots = Array.isArray(user.screenshots)
    ? user.screenshots
    : defaults.screenshots;
  const shortcuts = Array.isArray(user.shortcuts)
    ? user.shortcuts
    : defaults.shortcuts;

  // Text fields with fallbacks: user → site → hard-coded
  const name = user.name || site.title || "My Site";
  const short_name =
    user.short_name || (site.title ? site.title.substring(0, 12) : "Site");
  const description = user.description || site.description || "A website";

  // Debug
  logger.debug("Generating manifest:");
  logger.debug(`  filename: ${filename}`);
  logger.debug(`  name: "${name}"`);
  logger.debug(`  short_name: "${short_name}"`);
  logger.debug(`  description: "${description}"`);
  logger.debug(`  theme_color: ${theme_color}`);
  logger.debug(`  icons: ${icons.length}`);

  // Build manifest object
  const manifest = {
    name,
    short_name,
    description,
    start_url,
    display,
    orientation,
    theme_color,
    background_color,
    icons,
  };

  if (categories.length > 0) manifest.categories = categories;
  if (screenshots.length > 0) manifest.screenshots = screenshots;
  if (shortcuts.length > 0) manifest.shortcuts = shortcuts;

  // Write manifest to output
  eleventyConfig.addTemplate(
    `${filename}.njk`,
    `---
layout: false
permalink: ${filename}
eleventyExcludeFromCollections: true
---
${JSON.stringify(manifest, null, 2)}`,
  );

  logger.success();
}
