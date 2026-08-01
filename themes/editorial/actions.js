/**
 * Editorial Theme - Compass Action
 *
 * Registers a single Compass action (trigger: ::theme-editorial) that:
 *  - applies the Editorial theme immediately via <html data-theme="editorial">
 *  - persists the preference by calling PUT /api/user/preferences
 *
 * Rationale:
 *  - Themes should own their own Compass action. This keeps theme logic
 *    encapsulated inside the theme spore and avoids a centralized theme bundle.
 */

import Log from "@stnd/log";
import { saveVisitorPreferences } from "../../garden/Visitor";

const log = Log({ scope: "CompassThemeEditorial" });

const editorialAction = {
  trigger: "::theme-editorial",
  meta: {
    title: "Editorial Theme",
    desc: "Switch to the Editorial temperament (newspaper, authoritative)",
    icon: "palette",
  },
  action: async () => {
    // Apply locally for instant feedback (guard for server-side environments)
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", "editorial");
    } else {
      log.info("No DOM available to apply theme locally (server environment)");
    }

    const saved = await saveVisitorPreferences({ theme: "editorial" });

    if (saved) {
      log.info("Switched to Editorial theme");
      window.toast("Theme applied", "success");
    } else {
      window.toast("Theme changed locally but not saved", "warning");
    }
  },
};

export default [editorialAction];
