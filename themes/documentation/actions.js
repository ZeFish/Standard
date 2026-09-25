/**
 * Documentation Theme - Compass Action
 * Registers a single Compass action (trigger: ::theme-documentation) that:
 *  - applies the Documentation theme immediately via <html data-theme="documentation">
 *  - persists the choice to the visitor's preferences
 */

import Log from "@stnd/log";
import { saveVisitorPreferences } from "../../garden/Visitor";

const log = Log({ scope: "CompassThemeDocumentation" });

const documentationAction = {
  trigger: "::theme-documentation",
  meta: {
    title: "Documentation Theme",
    desc: "A clean, functional theme tailored for documentation, specifications, and code.",
    icon: "code",
  },
  action: async () => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", "documentation");
    }
    const saved = await saveVisitorPreferences({ theme: "documentation" });
    if (saved) {
      log.info("Switched to Documentation theme");
      window.toast?.("Documentation theme active", "info");
    }
  },
};

export default [documentationAction];
