export default {
  id: "theme-documentation",
  name: "Stnd :: Theme :: Documentation",
  description: "Registers the Documentation theme.",
  meta: { type: "theme", themeId: "documentation", label: "Documentation" },
  styles: ["./documentation.scss"],
  dependencies: [
    "@stnd/fonts/ia-writer",
    "@stnd/fonts/ibm-plex",
    "@stnd/fonts/berkeley-mono",
  ],
};
