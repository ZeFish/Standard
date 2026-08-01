/**
 * Humanist Theme - Compass Action
 *
 * Registers a single Compass action (trigger: ::theme-humanist) that:
 *  - applies the Humanist theme immediately via <html data-theme="humanist">
 *  - persists the preference by calling PUT /api/user/preferences
 *
 * Rationale:
 *  - Themes should own their own Compass action. This keeps theme logic
 *    encapsulated inside the theme spore and avoids a centralized theme bundle.
 */

import Log from "@stnd/log";
import { saveVisitorPreferences } from "../../garden/Visitor";

const log = Log({ scope: "CompassThemeHumanist" });

const humanistAction = {
  trigger: "::theme-humanist",
  meta: {
    title: "Humanist Theme",
    desc: "Switch to Humanist theme",
    icon: "palette",
  },
  action: async () => {
    // Apply locally for instant feedback
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", "humanist");
    } else {
      log.info("No DOM available to apply theme locally (server environment)");
    }

    const saved = await saveVisitorPreferences({ theme: "humanist" });

    if (saved) {
      log.info("Switched to Humanist theme");
      window.toast("Theme applied", "success");
    } else {
      window.toast("Theme changed locally but not saved", "warning");
    }
  },
};

export default [humanistAction];
