export default {
  id: "theme-book",
  name: "Stnd :: Theme :: Book",
  description: "A classic, readable theme optimized for long-form reading.",
  meta: { type: "theme", themeId: "book", label: "Book" },
  dependencies: [
    "@stnd/fonts/source-serif-4",
    "@stnd/fonts/newsreader",
    "@stnd/fonts/ibm-plex"
  ],
  styles: ["./book.scss"],
};
