/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    // JSDOM simulates a browser environment so you can test DOM manipulation
    // used in your src/js library
    environment: "jsdom",

    // Run tests in these folders
    include: ["tests/**/*.test.{js,ts}", "src/**/*.test.{js,ts}"],

    // Optional: helpful for debugging
    globals: true,
  },
});
