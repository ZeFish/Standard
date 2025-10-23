eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    stylesheet: "/pretty-atom-feed.xsl",
    collection: { name: "public", limit: 10 },
    metadata: {
      language: metadata.language,
      title: metadata.title,
      subtitle: metadata.description,
      base: metadata.url,
      author: { name: metadata.author.name },
    },
  });

  add layout sitemap also on public collection by default
