import { defineConfig } from "astro/config";
import standard from "./src/astro/standard.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  title: "Standard Framework",
  description:
    "Standard is built on the belief that design systems should be rooted in centuries of typographic tradition, mathematical precision, and the timeless principles of Swiss International Style.",
  site: "https://standard.ffp.co",
  url: "https://standard.ffp.co",
  language: "en",
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
  verbose: false,
  security: {
    enabled: false,
  },
  openrouter: {
    enabled: true,
    model: "meta-llama/llama-4-maverick:free",
    apiKey: process.env.OPENROUTER_KEY,
  },
  build: {
    css: {
      srcDir: "src/styles",
      outputDir: ["lib"],
      files: [
        {
          input: "standard.scss",
          output: "standard.min.css",
        },
        {
          input: "standard.theme.scss",
          output: "standard.theme.min.css",
        },
        {
          input: "../../node_modules/sanitize.css/sanitize.css",
          output: "sanitize.min.css",
        },
      ],
      bundle: {
        files: [
          "sanitize.min.css",
          "standard.min.css",
          "standard.theme.min.css",
        ],
        output: "standard.bundle.css",
      },
    },
    js: {
      srcDir: "src/js",
      outputDir: ["lib"],
      files: [
        {
          input: "standard.js",
          output: "standard.min.js",
          minify: false,
        },
        {
          input: "standard.toast.js",
          output: "standard.toast.js",
          minify: false,
        },
        {
          input: "standard.comment.js",
          output: "standard.comment.js",
          minify: false,
        },
        {
          input: "standard.lab.js",
          output: "standard.lab.js",
          minify: false,
        },
        {
          input: "standard-copy-buttons.js",
          output: "standard-copy-buttons.js",
          minify: false,
        },
        {
          input: "standard-image-zoom.js",
          output: "standard-image-zoom.js",
          minify: false,
        },
        {
          input: "standard-scroll-wrappers.js",
          output: "standard-scroll-wrappers.js",
          minify: false,
        },
        {
          input: "standard-htmx.js",
          output: "standard-htmx.js",
          minify: false,
        },
        {
          input: "standard-astro.js",
          output: "standard-astro.js",
          minify: false,
        },
      ],
      bundles: [
        {
          name: "standard.bundle.js",
          files: [
            "node_modules/htmx.org/dist/htmx.min.js",
            "node_modules/htmx-ext-preload/dist/preload.min.js",
            "lib/standard.min.js",
            "lib/standard.toast.js",
          ],
        },
        {
          name: "standard.bundle.full.js",
          files: [
            "node_modules/htmx.org/dist/htmx.min.js",
            "node_modules/htmx-ext-preload/dist/preload.min.js",
            "lib/standard.min.js",
            "lib/standard.toast.js",
            "lib/standard.comment.js",
          ],
        },
      ],
    },
  },
  integrations: [standard()],
  server: {
    port: 8083,
  },
  vite: {},
});
