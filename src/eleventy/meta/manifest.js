// src/eleventy/manifeste.js

/**
 * Web App Manifest Generator
 *
 * @component Standard Framework Manifest Plugin
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.10.53
 *
 * In 2013, Mozilla proposed the Web App Manifest specification to bridge
 * the gap between web and native apps. By 2015, Chrome adopted it, and
 * today it's the W3C standard for Progressive Web Apps (PWAs). A simple
 * JSON file transforms your website into an installable application that
 * appears on users' home screens alongside native apps.
 *
 * This plugin generates a standards-compliant manifest.json file that enables:
 * - "Add to Home Screen" on mobile devices
 * - Custom app name and icons
 * - Branded splash screens
 * - Standalone display mode (no browser UI)
 * - Theme colors that match your design
 *
 * Configuration priority (highest to lowest):
 * 1. site.standard.manifest.* (specific manifest config)
 * 2. site.* (site-level fallbacks like title, description)
 * 3. Hard-coded defaults
 *
 * @example js - In eleventy.config.js
 *   eleventyConfig.addPlugin(Standard, {
 *     manifest: {
 *       enabled: true,
 *       name: "My App",
 *       theme_color: "#0066cc"
 *     }
 *   });
 *
 * @example yaml - In site.config.yml
 *   title: My Website
 *   description: A great site
 *
 *   standard:
 *     manifest:
 *       enabled: true
 *       theme_color: "#0066cc"
 *       # name will use site.title automatically
 *
 * @param {Object} eleventyConfig - 11ty configuration object
 * @param {Object} site - Complete site configuration object
 * @param {String} site.title - Site title (fallback for manifest name)
 * @param {String} site.description - Site description (fallback for manifest description)
 * @param {Object} site.standard - Standard plugin configuration
 * @param {Object} site.standard.manifest - Manifest-specific configuration
 * @param {Boolean} site.standard.manifest.enabled - Enable manifest generation
 * @param {String} site.standard.manifest.name - App name (overrides site.title)
 * @param {String} site.standard.manifest.short_name - Short app name
 * @param {String} site.standard.manifest.description - App description (overrides site.description)
 * @param {String} site.standard.manifest.theme_color - Theme color (toolbar color)
 * @param {String} site.standard.manifest.background_color - Background color (splash screen)
 * @param {Array} site.standard.manifest.icons - Array of icon objects
 *
 * @link https://www.w3.org/TR/appmanifest/ W3C Web App Manifest Spec
 * @link https://web.dev/add-manifest/ Google's Manifest Guide
 */

import { createLogger } from "./../logger.js";

export default function (eleventyConfig, site = {}) {
  // ===== EXTRACT MANIFEST CONFIGURATION =====
  // Get manifest config from site.standard.manifest (if exists)
  const manifestConfig = site.standard?.manifest || {};

  // Early return if manifest is explicitly disabled
  if (manifestConfig.enabled === false) return;

  // ===== INITIALIZE LOGGER =====
  const logger = createLogger({
    scope: "Manifest",
    verbose: site.standard?.verbose || false,
  });

  // ===== EXTRACT NON-TEXT FIELDS WITH DEFAULTS =====
  // These fields don't need site-level fallbacks
  const {
    filename = "site.webmanifest", // Output filename
    display = "standalone", // Display mode (standalone = no browser UI)
    orientation = "any", // Screen orientation (any/portrait/landscape)
    theme_color = "#000000", // Toolbar/status bar color
    background_color = "#ffffff", // Splash screen background
    icons = [], // Array of icon objects
    categories = [], // App store categories
    screenshots = [], // App store screenshots
    shortcuts = [], // App shortcuts (jump list)
    start_url = "/", // Starting URL when launched
  } = manifestConfig;

  // ===== HANDLE TEXT FIELDS WITH FALLBACK CHAIN =====
  // These use: manifest config → site config → hard-coded default

  // App name: Use manifest.name, fall back to site.title, finally "My Site"
  const name = manifestConfig.name || site.title || "My Site";

  // Short name (12 chars max recommended): Use manifest.short_name,
  // fall back to truncated site.title, finally "Site"
  const short_name =
    manifestConfig.short_name || site.title?.substring(0, 12) || "Site";

  // Description: Use manifest.description, fall back to site.description, finally generic
  const description =
    manifestConfig.description || site.description || "A website";

  // ===== DEBUG LOGGING =====
  // Log what values we're actually using (helps debug configuration issues)
  logger.debug(`Generating manifest.json:`);
  logger.debug(`  Name: "${name}"`);
  logger.debug(`  Short name: "${short_name}"`);
  logger.debug(`  Description: "${description}"`);
  logger.debug(`  Theme color: ${theme_color}`);
  logger.debug(`  Icons: ${icons.length} defined`);

  // ===== BUILD MANIFEST OBJECT =====
  // Create the JSON object that will be written to manifest.json
  const manifest = {
    name, // Full app name (shown on splash screen)
    short_name, // Short name (shown under icon)
    description, // App description
    start_url, // URL to open when app launches
    display, // How the app should display
    orientation, // Screen orientation preference
    theme_color, // OS theme color (status bar, etc.)
    background_color, // Splash screen background
    icons, // App icons (various sizes)
  };

  // ===== ADD OPTIONAL FIELDS =====
  // Only include these fields if they have values
  // (keeps manifest.json clean and validates correctly)

  if (categories.length > 0) {
    manifest.categories = categories; // App categories for stores
  }

  if (screenshots.length > 0) {
    manifest.screenshots = screenshots; // App store screenshots
  }

  if (shortcuts.length > 0) {
    manifest.shortcuts = shortcuts; // Jump list / quick actions
  }

  // ===== GENERATE MANIFEST.JSON FILE =====
  // Use 11ty's addTemplate to create a virtual file
  // This generates manifest.json at build time
  eleventyConfig.addTemplate(
    `${filename}.njk`, // Virtual template name
    `---
layout: false
permalink: ${filename}
eleventyExcludeFromCollections: true
---
${JSON.stringify(manifest, null, 2)}`, // Pretty-printed JSON with 2-space indent
  );

  // ===== SUCCESS LOG =====
  logger.success();
}
