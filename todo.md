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


@media print {
    .no-print,
    .no-print *,
    .footer,
    .header,
    section {
        display: none !important;
    }
    hr {
        background: black !important;
    }
    article,
    article h1 {
        padding: 0 !important;
    }
    body {
        padding: 0;
    }
    article {
        --gap: 0;
        --content: 100%;
    }
}

a.external-link::after {
    content: "↗";
    font-size: var(--scale-xs);
    opacity: var(--color-subtle);
    color: var(--color-foreground);
}
