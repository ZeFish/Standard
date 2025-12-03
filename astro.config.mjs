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
  integrations: [
    standard({
      title: "Standard Framework",
      description:
        "Standard is built on the belief that design systems should be rooted in centuries of typographic tradition, mathematical precision, and the timeless principles of Swiss International Style.",
      url: "https://standard.ffp.co",
      language: "fr",
      author: {
        name: "Francis Fontaine",
        email: "francisfontaine@gmail.com",
        url: "https://francisfontaine.com/now/",
        twitter: "francisfontaine",
      },
      social: {
        twitter: "@francisfontaine",
        instagram: "@francisfontaine",
      },
      nav: {
        header: [
          { title: "Docs", url: "/docs/" },
          { title: "Getting Started", url: "/getting-started/" },
          { title: "Cheat Sheet", url: "/cheat-sheet/" },
        ],
      },
      verbose: true,
      security: {
        enabled: false,
      },
      openrouter: {
        enabled: true,
        model: "meta-llama/llama-4-maverick:free",
        apiKey: env.OPENROUTER_KEY,
      },
    }),
  ],
  server: {
    port: 8083,
  },
  vite: {},
});
