import { defineConfig } from "astro/config";
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [
    standard({
      // Basic typography features
      typography: {
        enableSmartQuotes: true,
        enablePunctuation: true,
        enableWidowPrevention: true,
        enableFractions: true,
        locale: "en"
      },

      // Enable comments system
      comments: {
        enabled: true,
        apiEndpoint: "/api/comments"
      },

      // Automatically inject useful routes
      injectRoutes: true
    })
  ],

  // Optional: Configure markdown
  markdown: {
    syntaxHighlight: "prism"
  },

  // Optional: Server configuration
  server: {
    port: 3000
  }
});
