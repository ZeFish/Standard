/**
 * Gallery Theme - Compass Action
 *
 * Registers a single Compass action (trigger: ::theme-gallery) that:
 *  - applies the Gallery theme immediately via <html data-theme="gallery">
 *  - persists the preference by calling PUT /api/user/preferences
 *
 * Rationale:
 *  - Theme actions should be owned by their theme spore and provide a simple,
 *    immediate command (no Compass view required).
 */

import Log from "@stnd/log";
import { saveVisitorPreferences } from "../../garden/Visitor";

const log = Log({ scope: "CompassThemeGallery" });

export default [
  {
    trigger: "::theme-gallery",
    meta: {
      title: "Gallery Theme",
      desc: "Minimal, visual-first temperament suitable for images and art",
      icon: "palette",
    },
    action: async () => {
      // Apply immediately for instant feedback (guard for server-side)
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", "gallery");
      } else {
        log.info(
          "No DOM available to apply theme locally (server environment)",
        );
      }

      const saved = await saveVisitorPreferences({ theme: "gallery" });

      if (saved) {
        log.info("Switched to Gallery theme");
        window.toast("Theme applied", "success");
      } else {
        window.toast("Theme changed locally but not saved", "warning");
      }
    },
  },
];
