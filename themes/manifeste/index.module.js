export default {
  id: "theme-manifeste",
  name: "Stnd :: Theme :: Manifeste",
  description: "An elegant editorial theme with Tiempos Headline and Joly.",
  meta: { type: "theme", themeId: "manifeste", label: "Manifeste" },
  styles: ["./manifeste.scss"],
  dependencies: [
    "@stnd/fonts/tiempos-headline",
    "@stnd/fonts/joly",
    "@stnd/fonts/futura-now",
    "@stnd/fonts/sohne",
  ],
};
