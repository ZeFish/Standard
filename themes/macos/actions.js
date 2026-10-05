import Log from "@stnd/log";
import { saveVisitorPreferences } from "../../garden/Visitor";

const log = Log({ scope: "CompassThemeMacOS" });

const macosAction = {
  trigger: "::theme-macos",
  meta: {
    title: "macOS Theme",
    desc: "Native macOS system temperament with San Francisco typography and native window aesthetics",
    icon: "palette",
  },
  action: async () => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", "macos");
    } else {
      log.info("No DOM available to apply theme locally (server environment)");
    }

    const saved = await saveVisitorPreferences({ theme: "macos" });

    if (saved) {
      log.info("Switched to macOS theme");
      window.toast("Theme applied", "success");
    } else {
      window.toast("Theme changed locally but not saved", "warning");
    }
  },
};

export default [macosAction];
