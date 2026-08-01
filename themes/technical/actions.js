/**
 * Technical Theme - Compass Action
 *
 * Registers a single Compass action (trigger: ::theme-technical) that:
 *  - applies the Technical theme immediately via <html data-theme="technical">
 *  - persists the preference by calling PUT /api/user/preferences
 *
 * Rationale:
 *  - Theme actions should be owned by their theme spore and provide a simple,
 *    immediate command (no Compass view required).
 */

import Log from "@stnd/log";
import { saveVisitorPreferences } from "../../garden/Visitor";

const log = Log({ scope: "CompassThemeTechnical" });

const technicalAction = {
  trigger: "::theme-technical",
  meta: {
    title: "Technical Theme",
    desc: "Monospace-first, utility-focused temperament for manuals and code",
    icon: "palette",
  },
  action: async () => {
    // Apply locally for instant feedback (guard for server-side environments)
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", "technical");
    } else {
      log.info("No DOM available to apply theme locally (server environment)");
    }

    const saved = await saveVisitorPreferences({ theme: "technical" });

    if (saved) {
      log.info("Switched to Technical theme");
      window.toast("Theme applied", "success");
    } else {
      window.toast("Theme changed locally but not saved", "warning");
    }
  },
};

export default [technicalAction];
