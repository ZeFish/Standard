import { defineToolbarApp } from "astro/toolbar";

export default defineToolbarApp({
  init(canvas, app) {
    // Restore previous debug state
    const wasActive = sessionStorage.getItem("stnd-debug-mode") === "true";
    if (wasActive) {
      document.documentElement.classList.add("stnd-debug");
    }

    app.onToggled(({ state }) => {
      if (state) {
        document.documentElement.classList.add("stnd-debug");
        sessionStorage.setItem("stnd-debug-mode", "true");
      } else {
        document.documentElement.classList.remove("stnd-debug");
        sessionStorage.setItem("stnd-debug-mode", "false");
      }
    });
  },
});
