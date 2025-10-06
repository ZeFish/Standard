module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("dist");

  return {
    dir: {
      input: "example",
      output: "_site"
    }
  };
};
