import { defineToolbarApp } from "astro/toolbar";

/**
 * Resilient Lab toggle
 *
 * Behavior:
 * - If `window.StandardLab` is present, open the quick panel immediately.
 * - Otherwise, attempt a dynamic import of the lab client (best-effort),
 *   and wait briefly for the global to become available before opening.
 * - Always toggle the toolbar state back off (momentary action).
 */
function waitForStandardLab(timeout = 3000, interval = 100) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (window.StandardLab) return resolve(window.StandardLab);
      if (Date.now() - start >= timeout)
        return reject(new Error("StandardLab not available within timeout"));
      setTimeout(check, interval);
    };
    check();
  });
}

export default defineToolbarApp({
  init(canvas, app) {
    // Poller handle (fallback if StandardLab doesn't emit events)
    let stateWatcher = null;
    // When toggles are triggered programmatically we should suppress
    // the onToggled handler to avoid re-entrancy loops.
    let suppressToggleHandler = false;

    function startPoller() {
      if (stateWatcher) return;
      // Skip the first sample to avoid a race with initialization events
      let grace = true;
      stateWatcher = setInterval(() => {
        if (!window.StandardLab) return;
        if (grace) {
          // Give the client a moment to initialize and emit its state event
          grace = false;
          return;
        }
        if (window.StandardLab.state === "dormant") {
          clearInterval(stateWatcher);
          stateWatcher = null;
          // Ensure programmatic toggle doesn't re-enter the handler
          suppressToggleHandler = true;
          app.toggleState({ state: false });
          setTimeout(() => (suppressToggleHandler = false), 0);
        } else {
          // Keep toolbar toggled while lab is open
          suppressToggleHandler = true;
          app.toggleState({ state: true });
          setTimeout(() => (suppressToggleHandler = false), 0);
        }
      }, 250);
    }

    function clearPoller() {
      if (stateWatcher) {
        clearInterval(stateWatcher);
        stateWatcher = null;
      }
    }

    // Listen for StandardLab state events (if the client emits them)
    const globalStateListener = (e) => {
      const s = e?.detail?.state;
      if (s === "dormant") {
        clearPoller();
        // Suppress the onToggled handler while we programmatically toggle the button
        suppressToggleHandler = true;
        app.toggleState({ state: false });
        setTimeout(() => (suppressToggleHandler = false), 0);
      } else if (s === "quick" || s === "full") {
        // Suppress the onToggled handler while we programmatically toggle the button
        suppressToggleHandler = true;
        app.toggleState({ state: true });
        setTimeout(() => (suppressToggleHandler = false), 0);
        startPoller();
      }
    };
    window.addEventListener("standardlab:state", globalStateListener);

    // Initial sync: if the lab is already open, reflect that in the toolbar
    if (
      window.StandardLab &&
      window.StandardLab.state &&
      window.StandardLab.state !== "dormant"
    ) {
      app.toggleState({ state: true });
      startPoller();
    }

    app.onToggled(({ state }) => {
      // If this toggle came from our own programmatic updates, ignore it
      if (suppressToggleHandler) return;
      if (state) {
        (async () => {
          try {
            // The Svelte Lab island (<Lab client:load />) provides
            // window.StandardLab automatically. If it hasn't hydrated
            // yet, wait briefly for it.
            if (
              !window.StandardLab ||
              typeof window.StandardLab.openQuick !== "function"
            ) {
              await waitForStandardLab(3000, 100);
            }

            if (
              window.StandardLab &&
              typeof window.StandardLab.openQuick === "function"
            ) {
              window.StandardLab.openQuick();
            } else {
              console.warn(
                "[Standard Lab] Instance not available. Ensure <Lab client:load /> is mounted.",
              );
              suppressToggleHandler = true;
              app.toggleState({ state: false });
              setTimeout(() => (suppressToggleHandler = false), 0);
              return;
            }

            // Ensure we keep the toolbar toggled while the lab is open
            startPoller();
          } catch (err) {
            console.warn("[Standard Lab] Error while trying to open:", err);
            suppressToggleHandler = true;
            app.toggleState({ state: false });
            setTimeout(() => (suppressToggleHandler = false), 0);
          }
        })();
      } else {
        // User toggled the toolbar off -> close the lab (if open) and stop syncing
        if (
          window.StandardLab &&
          typeof window.StandardLab.close === "function" &&
          window.StandardLab.state !== "dormant"
        ) {
          try {
            window.StandardLab.close();
          } catch (err) {
            console.warn("[Standard Lab] Error while trying to close:", err);
          }
        }
        clearPoller();
      }
    });
  },
});
