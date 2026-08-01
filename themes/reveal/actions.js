import Log from "@stnd/log";
import { saveVisitorPreferences } from "../../garden/Visitor";

const log = Log({ scope: "CompassThemeReveal" });

const revealAction = {
  trigger: "::theme-reveal",
  meta: {
    title: "Reveal Theme",
    desc: "Monochrome-first darkroom temperament inspired by camera markings and Leica red",
    icon: "palette",
  },
  action: async () => {
    // Apply locally for instant feedback (guard for server-side environments)
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", "reveal");
    } else {
      log.info("No DOM available to apply theme locally (server environment)");
    }

    const saved = await saveVisitorPreferences({ theme: "reveal" });

    if (saved) {
      log.info("Switched to Reveal theme");
      window.toast("Theme applied", "success");
    } else {
      window.toast("Theme changed locally but not saved", "warning");
    }
  },
};

export default [revealAction];
