export default {
  id: "theme-humanist",
  name: "Stnd :: Theme :: Humanist",
  description: "A warm, approachable theme with organic typography.",
  meta: { type: "theme", themeId: "humanist", label: "Humanist" },
  styles: ["./humanist.scss"],

  dependencies: [
    "@stnd/fonts/inter",
    "@stnd/fonts/instrument-sans",
    "@stnd/fonts/kalice",
    "@stnd/fonts/newsreader"
  ],
};
