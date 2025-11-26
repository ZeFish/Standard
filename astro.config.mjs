import { defineConfig } from "astro/config";
import standard from "./src/astro/standard.js";
import path from "path";
import { fileURLToPath } from "url";

import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

import svelte from "@astrojs/svelte";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [standard({
    // Load configuration from YAML file (recommended approach)
    configPath: "site.config.yml",

    // Optional: Override YAML settings or add environment-specific config
    verbose: process.env.NODE_ENV === "development",

    // Optional: Environment-specific overrides
    cloudflare: {
      images: {
        quality: process.env.NODE_ENV === "production" ? 90 : 75,
      },
    },

    // Optional: Environment variables
    openrouter: {
      apiKey: process.env.OPENROUTER_KEY,
    },
  }), sitemap(), svelte()],

  markdown: {
    // Note: remark plugins are now managed by the standard integration
    // including: typography, tags, standard features, escape-code, fix-dates
    syntaxHighlight: "prism", // Use Prism for clean class-based syntax highlighting
    shikiConfig: {
      langs: [],
      wrap: false,
      langAlias: {
        nunjucks: "html",
        njk: "html",
      },
    },
  },

  vite: {
    resolve: {
      alias: {
        // Use source in dev for fast HMR
        "@zefish/standard/css": path.resolve(__dirname, "./src/styles/standard.scss"),
        "@zefish/standard/js": path.resolve(__dirname, "./src/js/standard.js"),
        "@zefish/standard": path.resolve(__dirname, "./src/astro/standard.js"),
      },
    },
  },

  server: {
    port: 8083,
  },

  vite: {},
  adapter: cloudflare(),
});