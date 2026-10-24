export default {
  id: "theme-mono",
  name: "Stnd :: Theme :: Mono",
  description: "Monospace spec-sheet aesthetic rendered entirely in IBM Plex Mono.",
  meta: { type: "theme", themeId: "mono", label: "Mono" },
  styles: ["./mono.scss"],

  dependencies: [
    "@stnd/fonts/ibm-plex",
    "@stnd/fonts/jetbrains-mono"
  ],
};
