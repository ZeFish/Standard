export default {
  id: "theme-pulp",
  name: "Stnd :: Theme :: Pulp",
  description: "A punchy dime-store crime novel and Tarantino pulp aesthetic featuring Herbus headers, aged newsprint tones, typewriter monospace, and iconic taxi/diner neon yellow accents.",
  meta: { type: "theme", themeId: "pulp", label: "Pulp" },
  styles: ["./pulp.scss"],
  dependencies: [
    "@stnd/fonts/herbus",
    "@stnd/fonts/century-expanded",
    "@stnd/fonts/newsreader",
    "@stnd/fonts/courier-prime",
  ],
};
