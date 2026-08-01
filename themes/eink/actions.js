/**
 * E-INK THEME - COMPASS ACTION
 *
 * Registers a single Compass action (trigger: ::theme-eink) that:
 *  - applies the E-Ink theme immediately via <html data-theme="eink">
 *  - persists the preference by calling PUT /api/user/preferences
 *
 * Rationale:
 *  - Theme actions should be owned by their theme spore and provide a simple,
 *    immediate command (no Compass view required).
 */

import Log from "@stnd/log";
import { saveVisitorPreferences } from "../../garden/Visitor";

const log = Log({ scope: "CompassThemeEink" });

const einkAction = {
  trigger: "::theme-eink",
  meta: {
    title: "E-Ink Theme",
    desc: "Optimized for E-Ink displays: high legibility, low contrast.",
    icon: "palette",
  },
  action: async () => {
    // Apply immediately for instant feedback (guard for server-side)
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", "eink");
    } else {
      log.info("No DOM available to apply theme locally (server environment)");
    }

    const saved = await saveVisitorPreferences({ theme: "eink" });

    if (saved) {
      log.info("Switched to E-Ink theme");
      window.toast("Theme applied", "success");
    } else {
      window.toast("Theme changed locally but not saved", "warning");
    }
  },
};

export default [einkAction];
