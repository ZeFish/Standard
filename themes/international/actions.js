/**
 * International Theme - Compass Action
 *
 * Registers a single Compass action (trigger: ::theme-international) that:
 *  - applies the International (Swiss) theme immediately via <html data-theme="international">
 *  - persists the preference by calling PUT /api/user/preferences
 *
 * Rationale:
 *  - Theme actions should live in their respective theme spores so each theme
 *    owns its commands and behavior. This keeps the core small and the theme
 *    logic vertically encapsulated.
 */

import Log from "@stnd/log";
import { saveVisitorPreferences } from "../../garden/Visitor";

const log = Log({ scope: "CompassThemeInternational" });

const internationalAction = {
  trigger: "::theme-international",
  meta: {
    title: "International Theme",
    desc: "Switch to the International (Swiss) temperament: clean, grid-based, neutral",
    icon: "palette",
  },
  action: async () => {
    // Apply locally for immediate feedback (guard for server-side environments)
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", "international");
    } else {
      log.info("Server environment: skipping immediate DOM update for theme");
    }

    const saved = await saveVisitorPreferences({ theme: "international" });

    if (saved) {
      log.info("Switched to International theme");
      window.toast("Theme applied", "success");
    } else {
      window.toast("Theme changed locally but not saved", "warning");
    }
  },
};

export default [internationalAction];
