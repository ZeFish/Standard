export default {
    id: "theme-contrast",
    name: "Stnd :: Theme :: High Contrast",
    description: "A theme providing maximum contrast for low vision accessibility, avoiding grayscales.",
    meta: { type: "theme", themeId: "contrast", label: "Contraste Élevé" },
    dependencies: [
    "@stnd/fonts/sohne",
    "@stnd/fonts/inter"
  ],
    styles: ["./contrast.scss"],
};
