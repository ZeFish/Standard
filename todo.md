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

typography from js to 11ty
image service to cloudflare
code and table wraper for horizontal scrolling
contact form
shortCode
.flow -> .column

@media print {
    .no-print,
    .no-print *,
    .footer,
    .header{
        display: none !important;
    }
    body {
        padding: 0;
    }
}
