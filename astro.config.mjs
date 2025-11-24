import { defineConfig } from "astro/config";
import standard from "./src/astro/standard.js";
import cloudflareIntegration from "./src/astro/integrations/cloudflare.js";
import openrouterIntegration from "./src/astro/integrations/openrouter.js";

import { ignoreLayout } from "./src/astro/remark/ignore-layout.js";

// https://astro.build/config
export default defineConfig({
  integrations: [
    standard(),
    cloudflareIntegration({
      functions: {
        enabled: true,
        outputDir: "functions/api",
        environment: "production",
      },
      // Use Cloudflare's built-in image optimization
      images: {
        enabled: true,
        skipClass: "no-cdn",
        skipExternal: true,
      },
      comments: {
        enabled: true,
        apiEndpoint: "/api/comments",
        commentsPath: "data/comments",
      },
      verbose: true,
    }),
    openrouterIntegration({
      enabled: true,
      model: "anthropic/claude-3.5-sonnet",
      copyFunctions: true,
      verbose: true,
    }),
  ],
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
  server: {
    port: 8083,
  },
  vite: {},
});
