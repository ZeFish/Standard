export default {
  id: "theme-technical",
  name: "Stnd :: Theme :: Technical",
  description: "A NASA/EPA graphics-standards-manual spec sheet — Courier Prime body, Gorton Perfected/Monosten headers, Berkeley Mono for code.",
  meta: { type: "theme", themeId: "technical", label: "Technical" },
  styles: ["./technical.scss"],
  dependencies: [
    "@stnd/fonts/courier-prime",
    "@stnd/fonts/futura-now",
    "@stnd/fonts/monosten",
    "@stnd/fonts/gorton-perfected",
    "@stnd/fonts/berkeley-mono"
  ],
};
