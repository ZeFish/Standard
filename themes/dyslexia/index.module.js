export default {
    id: "theme-dyslexia",
    name: "Stnd :: Theme :: Dyslexia",
    description: "A theme designed to reduce visual stress and improve readability for users with dyslexia.",
    meta: { type: "theme", themeId: "dyslexia", label: "Dyslexie" },
    dependencies: [
        "@stnd/fonts/atkinson-hyperlegible-next",
        "@stnd/fonts/atkinson-hyperlegible-mono",
    ],
    styles: ["./dyslexia.scss"],
};
