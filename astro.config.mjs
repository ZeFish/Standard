import { defineConfig } from "astro/config";
import standard from "./src/astro/standard.js";
import path from "path";
import { fileURLToPath } from "url";


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
  })],




  server: {
    port: 8083,
  },

  vite: {},
});