/**
 * Backlinks Injector Integration
 * 
 * This integration runs after all content is processed and injects
 * backlinks data into each page's data for template access.
 */

import { getBacklinkGraph } from "../remark/backlinks.js";

export default function backlinkInjectorIntegration() {
  return {
    name: "backlinks-injector",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        console.log("🔗 BACKLINKS INJECTOR: Build complete, backlink graph ready");
        
        const backlinkGraph = getBacklinkGraph();
        console.log("🔗 BACKLINKS INJECTOR: Graph has", Object.keys(backlinkGraph).length, "entries");
        console.log("🔗 BACKLINKS INJECTOR: Sample entries:", Object.entries(backlinkGraph).slice(0, 3));
      }
    }
  };
}
