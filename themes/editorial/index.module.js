export default {
  id: "theme-editorial",
  name: "Stnd :: Theme :: Editorial",
  description: "A clean, typography-focused theme for writers.",
  meta: { type: "theme", themeId: "editorial", label: "Editorial" },
  styles: ["./editorial.scss"],

  dependencies: [
    "@stnd/fonts/tiempos-headline",
    "@stnd/fonts/literata",
    "@stnd/fonts/instrument-sans",
  ]
};
