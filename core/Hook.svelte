<script>
  /**
   * Hook.svelte
   *
   * A Svelte-based proxy for rendering module components.
   * This solves the Astro "NoMatchingImport" issue with dynamic hydration
   * by providing a statically analyzable entry point for Astro.
   */
  import { extensions } from "virtual:stnd/components";

  let { zone, props = {} } = $props();

  // Get components for this zone
  const entries = $derived(extensions[zone] || []);
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
