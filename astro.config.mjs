import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import standard from "./astro/standard.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

export default defineConfig({
  srcDir: "./astro",
  site: "https://standard.ffp.co",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  integrations: [
    standard({
      openrouter: {
        apiKey: env.OPENROUTER_KEY,
      },
    }),
  ],
  server: {
    port: 8083,
  },
  vite: {},
});
