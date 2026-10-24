export default {
  id: "theme-humanist",
  name: "Stnd :: Theme :: Humanist",
  description: "A warm, approachable theme with organic typography.",
  meta: { type: "theme", themeId: "humanist", label: "Humanist" },
  styles: ["./humanist.scss"],

  dependencies: [
    "@stnd/fonts/national-park",
    "@stnd/fonts/instrument-serif",
    "@stnd/fonts/newsreader",
    "@stnd/fonts/jetbrains-mono"
  ],
};
