export default function (eleventyConfig, options = {}) {
  const { escapeCodeBlocks: globalEscapeCodeBlocks = [] } = options;

  eleventyConfig.addPreprocessor("comment", "md", (data, content) => {
    return content.replaceAll(/%%(.|\n|\s)*?%%/g, "");
  });
  eleventyConfig.addPreprocessor("commentCallouts", "md", (data, content) => {
    return content.replace(/(^> \[!comments?\][^\n]*\n(?:^>.*\n?)*)/gm, "");
  });
  eleventyConfig.addPreprocessor("highlight", "md", (data, content) => {
    return content.replace(/==(.+?)==/g, "<mark>$1</mark>");
  });
  eleventyConfig.addPreprocessor("escapeCodeBlock", "md", (data, content) => {
    // Get escape languages from front matter or use global setting
    // Front matter takes precedence: escapeCodeBlocks: ["html", "xml"]
    const escapeLanguages = data.escapeCodeBlocks || globalEscapeCodeBlocks;

    if (!escapeLanguages || escapeLanguages.length === 0) {
      return content;
    }

    // Create a regex pattern for each language to match code blocks
    escapeLanguages.forEach((lang) => {
      // Match ```language\n content \n``` and remove backticks
      const pattern = new RegExp(`^\`\`\`${lang}\n(.*?)\n\`\`\`$`, "gm");
      content = content.replace(pattern, "$1");
    });

    return content;
  });
  eleventyConfig.addPreprocessor("fixDates", "md", (data, content) => {
    const fixDateString = (value) => {
      if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value)
      ) {
        const date = new Date(value.replace(" ", "T"));
        // If the date is invalid, return the original value to prevent errors
        return isNaN(date.getTime()) ? value : date;
      }
      return value;
    };

    // Fix only known fields
    if (data.created) data.created = fixDateString(data.created);
    if (data.modified) data.modified = fixDateString(data.modified);

    return content;
  });
}
