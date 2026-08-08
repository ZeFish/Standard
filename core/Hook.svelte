<script>
  /**
   * Hook.svelte
   *
   * A Svelte-based proxy for rendering module components.
   * This solves the Astro "NoMatchingImport" issue with dynamic hydration
   * by providing a statically analyzable entry point for Astro.
   */
  import { extensions } from "virtual:stnd/components";

  let { zone, props = {}, activeScopes = undefined } = $props();

  function isEntryVisible(entry) {
    const requiredScope = entry?.meta?.scope;
    if (!requiredScope) return true;
    if (!activeScopes) return true;
    const required = Array.isArray(requiredScope) ? requiredScope : [requiredScope];
    return required.every((s) => activeScopes.includes(s));
  }

  // Get components for this zone, honoring the same scope contract as Hook.astro
  // (this is the path `stnd:client` actually takes — see StndInit.astro).
  const entries = $derived((extensions[zone] || []).filter(isEntryVisible));
</script>

{#each entries as entry (entry.moduleId)}
  {#if entry.component}
    <entry.component
      {...props}
      {...entry.meta || {}}
      data-hook-zone={zone}
      data-module-id={entry.moduleId}
    />
  {/if}
{/each}
