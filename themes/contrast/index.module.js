export default {
    id: "theme-contrast",
    name: "Stnd :: Theme :: High Contrast",
    description: "A theme providing maximum contrast for low vision accessibility, avoiding grayscales.",
    meta: { type: "theme", themeId: "contrast", label: "High Contrast" },
    dependencies: [
    "@stnd/fonts/atkinson-hyperlegible-next",
    "@stnd/fonts/inter"
  ],
    styles: ["./contrast.scss"],
};
